import { API_RESPONSE, collections, ConstCommunityNames, contentKeys, KEYS, maternityNotificationTemplateNaPrefix, mongoDbTables, Result, TranslationLanguage } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { getArgument } from '@anthem/communityapi/utils';
import Agenda from 'agenda/es';
import * as moment from 'moment';
import Container, { Service } from 'typedi';
import { Community } from '../models/communitiesModel';
import { PushNotificationContent, PushNotificationTemplate, ScheduledPNData } from '../models/pushNotificationModel';
import { Story } from '../models/storyModel';
import { User } from '../models/userModel';
import { Schedule } from './aws/schedule';
import { AgendaHelperService } from './helpers/agendaHelper';

@Service()
export class PushNotifications {
  constructor(
    @LoggerParam(__filename) private _log: ILogger,
    private result: Result,
    private schedule: Schedule,
    private mongoDb: MongoDatabaseClient,
    private agendaHelper: AgendaHelperService
  ) { }

  public async generatePNJobs(userId: string, communityId: string, dueDate: string): Promise<boolean> {
    try {
      const user: User = await this.mongoDb.readByID(collections.USERS, userId);
      if (user === null) {
        return false;
      }
      const meternityCommunity: Community = await this.mongoDb.readByID(collections.COMMUNITY, communityId);
      if (meternityCommunity.parent !== ConstCommunityNames.MATERNITY) {
        return false;
      }

      if (!this.schedule) {
        this.schedule = Container.get(Schedule);
      }
      // Delete the existing old PNs of the users
      await this.schedule.cancelJob(userId);

      if (dueDate === '') {
        return true;
      }

      /**
       * Generate the Weekly time based push notifications for the maternity community members based on the entered due Date.
       * 1. Find the number of days between the dueDate and current date.
       * 2. Find the number weeks between due date and current date -> (remainingDaysInCurrentWeek / 7) = weekCount
       * 3. We know the PREGNANCY_DURATION is on avg 40 weeks. Find the the current pregnency week of the user -> (PREGNANCY_DURATION - weekCount) = currentPregnancyWeek
       * 4. Find the number of days remaining in the current pregnancy week. -> (number of days between the dueDate and current date) % 7
       */

      // 1. Find the number of days between the dueDate and current date.
      const currDay = moment(new Date().setHours(0, 0, 0, 0));
      const userDueDate = moment(new Date(dueDate).setHours(0, 0, 0, 0));
      const diff = moment.duration(userDueDate.diff(currDay));

      // 2. Find the number of weeks between due date and current date -> (number of days between the dueDate and current date / 7) = weekCount
      const weekCount = Math.floor(diff.asDays() / KEYS.WEEK_DAYS);

      // 3. Find the the current pregnency week of the user
      const currentPregnancyWeek = (KEYS.PREGNANCY_DURATION - weekCount);

      // 4. Find the number of days remaining in the current pregnancy week.
      const remainingDaysInCurrentWeek = diff.asDays() % 7;

      const startDay = new Date();
      if (!await this.createPushNotifications(currentPregnancyWeek, startDay, userId, remainingDaysInCurrentWeek)) {
        return false;
      }

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  /**
   *
   * @param nextWeek is number which represents the pregnancy week to pick the PN tenmplate.
   * @param sendDate is Date() which defines the date and time at which the PN should be sent.
   * @param userId is string which defined to which user the Pn should send.
   * @param remainingDaysInCurrentWeek is number which defines the number of days remaining in the current pregnancy week.
   * @returns boolean
   */
  public async createPushNotifications(nextWeek: number, sendDate, userId: string, remainingDaysInCurrentWeek: number) {
    try {
      /**
       * Ticket: CCX-6891
       * Schedule the PN for the current pregnancy week with 1hour delay.
       */
      sendDate.setMinutes(sendDate.getMinutes() + 60);

      // Testing purpose - 1 minutes gape.
      // sendDate.setMinutes(sendDate.getMinutes() + 1);

      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return false;
      }

      await this.schedulePushNotifications(agenda, userId, nextWeek, sendDate);
      // Find the start date of nextWeek.
      sendDate.setDate(sendDate.getDate() + (remainingDaysInCurrentWeek + 1));

      // Testing purpose - 1 minutes gape.
      // sendDate.setMinutes(sendDate.getMinutes() + 1);

      // Set the scheduled PN time as 10 AM EST.
      sendDate.setUTCHours(15, 0, 0);
      nextWeek++;

      // Schedule the PN for the next set of pregnancy weeks.
      while (nextWeek <= KEYS.PN_TEMPLATE_NUMBER) {
        await this.schedulePushNotifications(agenda, userId, nextWeek, sendDate);

        nextWeek++;
        // Get the next week starting date by adding 7 days to the sendDate.
        sendDate.setDate(sendDate.getDate() + KEYS.WEEK_DAYS);

        // Testing purpose - 1 minutes gape.
        // sendDate.setMinutes(sendDate.getMinutes() + 1);
      }
      await this.agendaHelper.stopAgenda(agenda);

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async schedulePushNotifications(agenda: Agenda, userId: string, weekCount: number, sendOn: Date): Promise<boolean> {
    try {
      const scheduleData: ScheduledPNData = {
        createdAt: new Date(),
        receiverId: userId,
        weekCount: weekCount,
        name: maternityNotificationTemplateNaPrefix + weekCount,
        sendOn: sendOn,
        isSent: false,
        env: getArgument('env')
      };

      /* Create Scheduled PN with storing the details in DB. */
      const response = await this.schedule.scheduleJob(agenda, scheduleData);
      if (!response) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;

        return false;
      }

      return true;
    } catch (error) {
      this._log.error(error as Error);
      return false;
    }
  }

  public async userEligibility(template: PushNotificationTemplate, userId: string, templateCount: number): Promise<PushNotificationTemplate> {
    try {
      const user = await this.mongoDb.readByID(collections.USERS, userId);
      const appVersion = await this.mongoDb.readByValue(collections.APPVERSION, {});
      // Check for the user story status
      if (template?.checkStoryStatus) {
        const story: Story = await this.mongoDb.readByValue(collections.STORY, {
          [mongoDbTables.story.authorId]: userId,
          [mongoDbTables.story.commentId]: template.communityId
        });
        if (story && story.published) {
          const searchData = {
            [mongoDbTables.content.contentType]: contentKeys.pushNotification,
            [mongoDbTables.content.version]: appVersion.content.pushNotification,
            [mongoDbTables.content.language]: TranslationLanguage.ENGLISH
          };
          const pushNotification: PushNotificationContent = await this.mongoDb.readByValue(collections.CONTENT, searchData);
          const templateName = maternityNotificationTemplateNaPrefix + templateCount + 'a';
          const template: PushNotificationTemplate = pushNotification.pushNotificationTemplate.filter((pnTemplate) => pnTemplate.name === templateName)[0];
          return template;
        }
      }

      if (template?.userJoinedCommunity) {
        if (user.myCommunities.indexOf(template.communityId) === -1) {
          const searchData = {
            [mongoDbTables.content.contentType]: contentKeys.pushNotification,
            [mongoDbTables.content.version]: appVersion.content.pushNotification,
            [mongoDbTables.content.language]: TranslationLanguage.ENGLISH
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
