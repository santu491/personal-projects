import {
  API_RESPONSE,
  NotificationDeepLink,
  NotificationType,
  Result,
  SQSParams,
  collections,
  contentKeys,
  maternityNotificationTemplateNaPrefix,
  mongoDbTables,
  scheduledPollClosingNotification,
  scheduledPollClosingSoonNotification,
  scheduledPost,
  scheduledPushNotification,
  scheduledWeeklyNotification
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import Agenda, { Job } from 'agenda/es';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { AgendaHelperService } from '../helpers/agendaHelper';
import { NotificationQueueData, PushNotificationContent, PushNotificationTemplate, ScheduledPNData } from '../models/pushNotificationModel';
import { BaseResponse } from '../models/resultModel';
import { SchedulerPayload } from '../models/schedulerModel';
import { Story } from '../models/storyModel';
import { Schedule } from './aws/schedule';
import { SqsService } from './aws/sqsService';

@Service()
export class SchedulerService {
  constructor(
    private mongoDb: MongoDatabaseClient,
    private sqsService: SqsService,
    private result: Result,
    private schedule: Schedule,
    private agendaHelper: AgendaHelperService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async handlePushNotification(payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }
      const jobs: Job[] = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPushNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectId(payload.jobId),
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return this.result.createError(API_RESPONSE.messages.jobNotFound);
      }
      const job: Job = jobs[0];
      const notificationData: NotificationQueueData = this.createData(job);
      await this.sqsService.addToNotificationQueue(
        notificationData,
        APP.config.aws.genericQueue,
        SQSParams.GENERIC_MESSAGE_GROUP_ID
      );
      await this.agendaHelper.stopAgenda(agenda);

      return this.result.createSuccess(job);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async handleWeeklyPushNotification(payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }
      const jobs: Job[] = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledWeeklyNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectId(payload.jobId),
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return this.result.createError(API_RESPONSE.messages.jobNotFound);
      }
      const job = jobs[0];
      const appVersion = await this.mongoDb.readByValue(collections.APPVERSION, {});
      const searchData = {
        [mongoDbTables.content.contentType]: contentKeys.pushNotification,
        [mongoDbTables.content.version]: appVersion.content.pushNotification,
        [mongoDbTables.content.language]: contentKeys.english
      };
      const pushNotification: PushNotificationContent = await this.mongoDb.readByValue(collections.CONTENT, searchData);
      let template: PushNotificationTemplate = pushNotification.pushNotificationTemplate.filter((pnTemplate) => pnTemplate.name === job.attrs.data.name)[0];
      if (template.active) {
        if (template?.checkStoryStatus || template?.userJoinedCommunity) {
          template = await this.userEligibility(job.attrs.data.receiverId, template, job.attrs.data.weekCount);
        }
        const notificationData: ScheduledPNData = {
          isSent: false,
          createdAt: new Date(),
          type: NotificationType.ADHOC_TEMPLATE,
          deepLink: NotificationDeepLink.ACTIVITY,
          title: template.title,
          body: template.body,
          activityText: template.activityText,
          communityId: template.communityId,
          checkStoryStatus: template.checkStoryStatus,
          userJoinedCommunity: template.userJoinedCommunity,
          deepLinkInApp: template.deepLink,
          env: job.attrs.data.env,
          receiverId: job.attrs.data.receiverId,
          weekCount: job.attrs.data.weekCount,
          sendOn: job.attrs.data.sendOn,
          name: maternityNotificationTemplateNaPrefix
        };
        await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.userActivityQueue, SQSParams.ACTIVITY_MESSAGE_GROUP_ID);
      }

      await this.agendaHelper.stopAgenda(agenda);
      return this.result.createSuccess(true);

    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async handleScheduledPost(payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }

      const jobs: Job[] = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPost,
        [mongoDbTables.scheduledJobs.id]: new ObjectId(payload.jobId),
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return this.result.createError(API_RESPONSE.messages.jobNotFound);
      }
      const job = jobs[0];
      await this.schedule.executePostScheduleJob(job);
      await this.agendaHelper.stopAgenda(agenda);

      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async handlePostPollClosingSoon(payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }
      const jobs: Job[] = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPollClosingSoonNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectId(payload.jobId),
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return this.result.createError(API_RESPONSE.messages.jobNotFound);
      }
      const job: Job = jobs[0];
      await this.schedule.executePollClosingSoon(job);
      await this.agendaHelper.stopAgenda(agenda);

      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async handlePostPollClosed(payload: SchedulerPayload): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }
      const jobs: Job[] = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPollClosingNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectId(payload.jobId),
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return this.result.createError(API_RESPONSE.messages.jobNotFound);
      }
      const job = jobs[0];
      await this.schedule.executePollClosed(job);
      await this.agendaHelper.stopAgenda(agenda);

      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
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

  private async userEligibility(userId: string, template: PushNotificationTemplate, templateCount) {
    try {
      const user = await this.mongoDb.readByValue(collections.USERS, { [mongoDbTables.users.id]: new ObjectId(userId) });
      const appVersion = await this.mongoDb.readByValue(collections.APPVERSION, {});
      // Check for the user story status
      if (template?.checkStoryStatus) {
        const story: Story = await this.mongoDb.readByValue(collections.STORY, {
          [mongoDbTables.story.authorId]: userId,
          [mongoDbTables.story.communityId]: template.communityId
        });
        if (story && story.published) {
          const searchData = {
            [mongoDbTables.content.contentType]: contentKeys.pushNotification,
            [mongoDbTables.content.version]: appVersion.content.pushNotification,
            [mongoDbTables.content.language]: contentKeys.english
          };
          const pushNotification: PushNotificationContent = await this.mongoDb.readByValue(collections.CONTENT, searchData);
          const templateName = maternityNotificationTemplateNaPrefix + templateCount + 'a';
          const template: PushNotificationTemplate = pushNotification.pushNotificationTemplate.filter((pnTemplate) => pnTemplate.name === templateName)[0];
          return template;
        }
      }

      if(template?.userJoinedCommunity) {
        if (user.myCommunities.indexOf(template.communityId) === -1) {
          const searchData = {
            [mongoDbTables.content.contentType]: contentKeys.pushNotification,
            [mongoDbTables.content.version]: appVersion.content.pushNotification,
            [mongoDbTables.content.language]: contentKeys.english
          };
          const pushNotification: PushNotificationContent = await this.mongoDb.readByValue(collections.CONTENT, searchData);
          const templateName = maternityNotificationTemplateNaPrefix + templateCount + 'a';
          const template: PushNotificationTemplate = pushNotification.pushNotificationTemplate.filter((pnTemplate) => pnTemplate.name === templateName)[0];
          return template;
        }
      }

      return template;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
