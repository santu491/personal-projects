import { collections, mongoDbTables, NotificationDeepLink, NotificationType, scheduledPollClosingNotification, scheduledPollClosingSoonNotification, scheduledPost, scheduledPushNotification, schedulePostStatus, SQSParams } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { Agenda, Job } from 'agenda/es';
import { Post } from 'api/adminresources/models/postsModel';
import { NotificationQueueData, PollClosingPN } from 'api/adminresources/models/pushNotificationModel';
import { ObjectID, ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { AgendaHelperService } from '../../helpers/agendaHelper';
import { PostJobHelper } from '../../helpers/postJobHelper';
import { SqsService } from './sqsService';

@Service()

export class Schedule {
  constructor(
    @LoggerParam(__filename) private _log: ILogger,
    private sqsService: SqsService,
    private mongoSvc: MongoDatabaseClient,
    private postJobHelper: PostJobHelper,
    private agendaHelper: AgendaHelperService
  ) { }

  /**
   * Function creates a scheduled PN job and store it in DB.
   * @param payload PushNotification
   * @returns boolean
   *
   */
  public async schedulePNJob(payload) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      await agenda.schedule(payload.sendOn, scheduledPushNotification, payload);
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  /**
   * Function creates a scheduled job for Posts.
   * @param payload Post Job payload
   * @returns boolean
   *
   */
  public async schedulePostJob(payload) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPost,
        [mongoDbTables.scheduledJobs.postId]: payload.postId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length > 0) {
        for (const job of jobs) {
          await job.remove();
        }
      }

      await agenda.schedule(payload.publishOn, scheduledPost, payload);
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  /**
   * Function creates a scheduled job for Post's poll's closing previous day PN.
   * @param postId string
   * @param previousDayOfPoll Date
   * @returns boolean
   *
   */
  public async schedulePollClosingSoon(payload: PollClosingPN) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPollClosingSoonNotification,
        [mongoDbTables.scheduledJobs.postId]: payload.postId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });

      if (jobs.length > 0) {
        for (const job of jobs) {
          await job.remove();
        }
      }

      await agenda.schedule(payload.sendOn, scheduledPollClosingSoonNotification, payload);
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  /**
   * Function creates a scheduled job for Post's poll's closed PN.
   * @param postId string
   * @returns boolean
   *
   */
  public async schedulePollClosed(payload: PollClosingPN) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPollClosingNotification,
        [mongoDbTables.scheduledJobs.postId]: payload.postId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });

      if (jobs.length > 0) {
        for (const job of jobs) {
          await job.remove();
        }
      }

      await agenda.schedule(payload.sendOn, scheduledPollClosingNotification, payload);
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  /**
   * The function to handle the scheduled PNs to push the message to the SQS.
   * @param job Job
   */
  public executeScheduledPNJob = async (job: Job) => {
    const notificationData: NotificationQueueData = this.createData(job);
    await this.sqsService.addToNotificationQueue(
      notificationData,
      APP.config.aws.genericQueue,
      SQSParams.GENERIC_MESSAGE_GROUP_ID
    );

    job.attrs.data.isSent = true;
    job.attrs.data.updatedAt = new Date();
    await job.save();

  };

  public executePostScheduleJob = async (job: Job) => {
    const jobAttributes = job.attrs.data;
    let post: Post = await this.mongoSvc.readByID(collections.POSTS, jobAttributes.postId);
    if (post && !post.removed && !post.published) {
      post = await this.mongoSvc.findAndUpdateOne(collections.POSTS, { [mongoDbTables.posts.id]: new ObjectId(job.attrs.data.postId) }, {
        $set: {
          [mongoDbTables.posts.published]: true,
          [mongoDbTables.posts.publishedAt]: new Date(),
          [mongoDbTables.posts.updateDate]: new Date(),
          [mongoDbTables.posts.updatedBy]: post.createdBy,
          [mongoDbTables.posts.hasContentBeenPublishedOnce]: true,
          [mongoDbTables.posts.status]: schedulePostStatus.PUBLISHED
        }
      });

      /* If the newPost is published, then update the activity and trigger the PN */
      if (post.published) {
        await this.postJobHelper.userNotifyOverPost(post);
        if (post.isNotify) {
          await this.postJobHelper.notifyOnNewPost(post);
        }
      }
    }

    job.attrs.data.isSent = true;
    job.attrs.data.updatedAt = new Date();
    await job.save();
  };

  public executePollClosingSoon = async (job: Job) => {
    const jobAttributes = job.attrs.data;
    const notificationData: PollClosingPN = {
      type: jobAttributes.type,
      senderId: jobAttributes.senderId,
      title: jobAttributes.title,
      body: jobAttributes.body,
      env: jobAttributes.env,
      createdDate: jobAttributes.createdDate,
      communities: jobAttributes.communities,
      sendOn: jobAttributes.sendOn,
      activityDeepLink: jobAttributes.activityDeepLink,
      activityText: jobAttributes.activityText,
      postWithPoll: true,
      postClosingSoon: true,
      postId: jobAttributes.postId
    };
    await this.sqsService.addToNotificationQueue(
      notificationData,
      APP.config.aws.genericQueue,
      SQSParams.GENERIC_MESSAGE_GROUP_ID
    );

    job.attrs.data.isSent = true;
    job.attrs.data.updatedAt = new Date();
    await job.save();
  };

  public executePollClosed = async (job: Job) => {
    const jobAttributes = job.attrs.data;
    const notificationData: PollClosingPN = {
      type: jobAttributes.type,
      senderId: jobAttributes.senderId,
      title: jobAttributes.title,
      body: jobAttributes.body,
      env: jobAttributes.env,
      createdDate: jobAttributes.createdDate,
      communities: jobAttributes.communities,
      sendOn: jobAttributes.sendOn,
      activityDeepLink: jobAttributes.activityDeepLink,
      activityText: jobAttributes.activityText,
      postWithPoll: true,
      postClosingSoon: false,
      postId: jobAttributes.postId
    };
    await this.sqsService.addToNotificationQueue(
      notificationData,
      APP.config.aws.genericQueue,
      SQSParams.GENERIC_MESSAGE_GROUP_ID
    );

    job.attrs.data.isSent = true;
    job.attrs.data.updatedAt = new Date();
    await job.save();
  };

  public async cancelScheduledPNJob(jobId: string, adminId: string, agenda: Agenda) {
    try {
      if (!agenda) {
        return false;
      }
      const job = await agenda.jobs({
        name: scheduledPushNotification,
        _id: new ObjectId(jobId)
      });
      if (job.length === 0) {
        return false;
      }
      job[0].attrs.data.removed = true;
      job[0].attrs.data.updatedBy = adminId;

      await job[0].save();
      const query = {
        [mongoDbTables.scheduledJobs.name]: scheduledPushNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectID(jobId)
      };
      if (await agenda.disable(query) === 0) {
        return false;
      }
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async cancelPostJob(postId: string) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPost,
        [mongoDbTables.scheduledJobs.postId]: postId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return false;
      }
      for (const job of jobs) {
        await job.remove();
      }
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async cancelPollClosingSoonJob(postId: string) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPollClosingSoonNotification,
        [mongoDbTables.scheduledJobs.postId]: postId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return false;
      }
      for (const job of jobs) {
        await job.remove();
      }
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async cancelPollClosedJob(postId: string) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPollClosingNotification,
        [mongoDbTables.scheduledJobs.postId]: postId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return false;
      }
      for (const job of jobs) {
        await job.remove();
      }
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  private createData(job: Job): NotificationQueueData {
    const notificationData: NotificationQueueData = {
      type: NotificationType.ADHOC,
      env: getArgument('env'),
      deepLink: NotificationDeepLink.ACTIVITY,
      senderId: job.attrs.data.author.id,
      createdDate: new Date(),
      title: job.attrs.data.title,
      body: job.attrs.data.body,
      communities: job.attrs.data.communities,
      nonCommunityUsers: job.attrs.data.nonCommunityUsers,
      allUsers: job.attrs.data.allUsers,
      bannedUsers: job.attrs.data.bannedUsers,
      sendOn: new Date(job.attrs.data.sendOn),
      activityDeepLink: job.attrs.data.deepLink,
      usersWithNoStory: job.attrs.data.usersWithNoStory,
      usersWithDraftStory: job.attrs.data.usersWithDraftStory,
      usersWithNoRecentLogin: job.attrs.data.usersWithNoRecentLogin,
      numberOfLoginDays: job.attrs.data.numberOfLoginDays,
      postWithPoll: false
    };
    return notificationData;
  }
}
