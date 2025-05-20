import { API_RESPONSE, collections, contentKeys, maternityNotificationTemplateNaPrefix, mongoDbTables, NotificationDeepLink, NotificationType, scheduledPushNotification, SQSParams, TranslationLanguage } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { Agenda, Job } from 'agenda/es';
import { PushNotificationContent, PushNotificationTemplate, ScheduledPNData } from 'api/communityresources/models/pushNotificationModel';
import { Service } from 'typedi';
import { AgendaHelperService } from '../helpers/agendaHelper';
import { PushNotifications } from '../pushNotifications';
import { SqsService } from './sqsService';

@Service()

export class Schedule {
  constructor(
    @LoggerParam(__filename) private _log: ILogger,
    private sqsService: SqsService,
    private mongoDb: MongoDatabaseClient,
    private pushNotification: PushNotifications,
    private agendaHelper: AgendaHelperService
  ) { }

  /**
   * Function creates a scheduled job and store it in DB.
   * @param payload PushNotification
   * @returns boolean
   *
   */
  public async scheduleJob(agenda: Agenda, payload: ScheduledPNData) {
    try {
      await agenda.schedule(payload.sendOn, scheduledPushNotification, payload);

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
  public executeJob = async (job: Job) => {
    const notificationData = await this.createData(job);
    if (!notificationData) {
      this._log.error(API_RESPONSE.messages.badPNDate);
    } else {
      await this.sqsService.addToNotificationQueue(
        notificationData,
        APP.config.aws.userActivityQueue,
        SQSParams.ACTIVITY_MESSAGE_GROUP_ID
      );
    }

    // Update the Job as sent true.
    job.attrs.data.isSent = true;
    job.attrs.data.updatedAt = new Date();
    await job.save();
  };

  public async cancelJob(userId: string) {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }
      const jobs: Job[] = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPushNotification,
        [mongoDbTables.scheduledJobs.receiverId]: userId,
        [mongoDbTables.scheduledJobs.isSent]: false
      });
      if (jobs.length === 0) {
        await this.agendaHelper.stopAgenda(agenda);
        return false;
      }
      this._log.info(jobs.length + API_RESPONSE.messages.auditMessage + userId);

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

  private async createData(job: Job) {
    try {
      let template: PushNotificationTemplate;

      // Find the latest template based on the template name.
      const appVersion = await this.mongoDb.readByValue(collections.APPVERSION, {});
      const searchData = {
        [mongoDbTables.content.contentType]: contentKeys.pushNotification,
        [mongoDbTables.content.version]: appVersion.content.pushNotification,
        [mongoDbTables.content.language]: TranslationLanguage.ENGLISH
      };
      const pushNotification: PushNotificationContent = await this.mongoDb.readByValue(collections.CONTENT, searchData);
      template = pushNotification.pushNotificationTemplate.filter((pnTemplate) => pnTemplate.name === job.attrs.data.name)[0];
      if (!template.active) {
        return false;
      }
      if (template?.checkStoryStatus || template?.userJoinedCommunity) {
        template = await this.pushNotification.userEligibility(template, job.attrs.receiverId, job.attrs.weekCount);

        if (template === null) { return false; }
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
        name: maternityNotificationTemplateNaPrefix + job.attrs.data.weekCount
      };
      return notificationData;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }
}
