import { AdminRole, API_RESPONSE, collections, contentKeys, maternityCommunity, mongoDbTables, noCommunity, Result, scheduledPushNotification, SuperAdminRole, Validation } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import Agenda from 'agenda/es';
import { ObjectID } from 'mongodb';
import Container, { Service } from 'typedi';
import { AgendaHelperService } from '../helpers/agendaHelper';
import { PushNotificationHelper } from '../helpers/pushNotificationHelper';
import { UserHelperService } from '../helpers/userHelper';
import { Admin } from '../models/adminUserModel';
import { AppVersionModel } from '../models/appVersionModel';
import { Community } from '../models/communitiesModel';
import { PageParam } from '../models/pageParamModel';
import { PNMetricsResponse, PushNotificationContent, PushNotificationRequest, PushNotificationTemp, Subscription, TargetAudience, UserSearchData, ViewPNRequest } from '../models/pushNotificationModel';
import { BaseResponse } from '../models/resultModel';
import { Schedule } from './aws/schedule';

@Service()
export class PushNotificationService {
  _userHelper = Container.get(UserHelperService);
  agendaHelper = Container.get(AgendaHelperService);
  constructor(
    private result: Result,
    private schedule: Schedule,
    private _mongoSvc: MongoDatabaseClient,
    private pnHelper: PushNotificationHelper,
    private validation: Validation,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async createPushNotification(payload: PushNotificationRequest, adminId: string): Promise<BaseResponse> {
    try {
      const admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminId);
      if (!this.validateCommunityAccessToPN(payload, admin)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedTitle;

        return this.result.createError(this.result.errorInfo);
      }
      /* Validate the Advocate Commnity Access */
      if (admin.role === AdminRole.scadvocate && payload.communities) {
        const result = payload.communities.every((val) => {
          return admin.communities.indexOf(val) >= 0;
        });
        if (!result) {
          this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedCommunity;

          return this.result.createError([this.result.errorInfo]);
        }
      }

      const scheduledPN = await this.pnHelper.createPushNotificationData(payload, admin);

      /* Create Scheduled PN with storing the details in DB. */
      const response = await this.schedule.schedulePNJob(scheduledPN);
      if (!response) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;

        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createError(error);
    }
  }

  public async updatePushNotification(payload: PushNotificationRequest, adminId: string): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPushNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectID(payload.id)
      });
      if (jobs.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidPn;

        await this.agendaHelper.stopAgenda(agenda);

        return this.result.createError([this.result.errorInfo]);
      }
      const job = jobs[0];
      if (job.attrs.data.isSent || job.attrs.data.removed) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidEditOperation;
        await this.agendaHelper.stopAgenda(agenda);

        return this.result.createError([this.result.errorInfo]);
      }
      const author = job.attrs.data.author;
      const admin: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, author.id);
      if (!this.validateCommunityAccessToPN(payload, admin)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedTitle;
        await this.agendaHelper.stopAgenda(agenda);

        return this.result.createError(this.result.errorInfo);
      }
      const scheduledPN = await this.pnHelper.createPushNotificationData(payload, admin, adminId);
      job.attrs.data = scheduledPN;
      job.schedule(payload.sendOn);
      await job.save();
      await this.agendaHelper.stopAgenda(agenda);
      job.attrs.id = job.attrs[mongoDbTables.scheduledJobs.id];
      delete job.attrs[mongoDbTables.scheduledJobs.id];
      return this.result.createSuccess(job);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createError(error);
    }
  }

  public async removePushNotification(id: string, adminId: string): Promise<BaseResponse> {
    try {
      const agenda: Agenda = await this.agendaHelper.getAgenda();
      if (!agenda) {
        return this.result.createError(API_RESPONSE.messages.agendaError);
      }
      const jobs = await agenda.jobs({
        [mongoDbTables.scheduledJobs.name]: scheduledPushNotification,
        [mongoDbTables.scheduledJobs.id]: new ObjectID(id)
      });
      if (jobs.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidPn;
        await this.agendaHelper.stopAgenda(agenda);

        return this.result.createError([this.result.errorInfo]);
      }
      const job = jobs[0];
      if (job.attrs[mongoDbTables.scheduledJobs.isSent] || job.attrs[mongoDbTables.scheduledJobs.disabled]) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidDeleteOperation;
        await this.agendaHelper.stopAgenda(agenda);

        return this.result.createError([this.result.errorInfo]);
      }
      const response = await this.schedule.cancelScheduledPNJob(id, adminId, agenda);
      if (!response) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidDelete;
        await this.agendaHelper.stopAgenda(agenda);

        return this.result.createError([this.result.errorInfo]);
      }
      await this.agendaHelper.stopAgenda(agenda);

      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createError(error);
    }
  }

  public async getPushNotification(pagination: PageParam, filter: ViewPNRequest): Promise<BaseResponse> {
    try {
      const user = this.validation.checkUserIdentity();
      const limit = pagination.pageSize;
      const skip = pagination.pageSize * (pagination.pageNumber - 1);
      const sortOption = { [mongoDbTables.scheduledJobs.updatedAt]: pagination.sort };
      const query = await this.pnHelper.getFilter(filter, user);
      const scheduledPN = await this._mongoSvc.readAllByValue(collections.SCHEDULED_JOB, query, sortOption, limit, skip);
      const totalPNCount = await this._mongoSvc.getDocumentCount(collections.SCHEDULED_JOB, query);

      return this.result.createSuccess({ pushNotifications: scheduledPN, totalCount: totalPNCount });
    } catch (error) {
      return this.result.createError(error);
    }
  }

  public async getTargetAudienceCount(
    payload: TargetAudience
  ): Promise<BaseResponse> {
    try {
      let userCount;
      const demoUsers = await this._userHelper.getDemoUsers();
      let audienceGroupIdentified = false;
      if (payload.usersWithNoRecentLogin) {
        audienceGroupIdentified = true;
        userCount = await this.pnHelper.getNoRecentLoginCount(payload.numberOfLoginDays, payload.communities, demoUsers);
      }

      if (payload.usersWithNoStory) {
        audienceGroupIdentified = true;
        userCount = await this.pnHelper.getUsersWithNoStoryCount(payload.communities, demoUsers);
      }

      if (payload.usersWithDraftStory) {
        audienceGroupIdentified = true;
        userCount = await this.pnHelper.getUsersWithDraftStoryCount(payload.communities, demoUsers);
      }

      if (payload.nonCommunityUsers) {
        audienceGroupIdentified = true;
        userCount = await this.pnHelper.getNonCommunityUsersCount(payload.communities, demoUsers);
      }

      if (payload.allUsers) {
        audienceGroupIdentified = true;
        userCount = await this.pnHelper.getCountData({
          [mongoDbTables.users.active]: true,
          [mongoDbTables.users.username]: { $nin: demoUsers }
        });
      }

      if (payload.communities &&
        payload.communities.length > 0 &&
        !audienceGroupIdentified
      ) {
        userCount = await this.pnHelper.getCountData({
          [mongoDbTables.users.active]: true,
          [mongoDbTables.users.myCommunities]: {
            $in: payload.communities
          },
          [mongoDbTables.users.username]: { $nin: demoUsers }
        });
      }

      if (!userCount) {
        userCount = {
          totalCount: 0,
          pnActiveUsers: 0
        };
      }
      return this.result.createSuccess(userCount);
    } catch (error) {
      return this.result.createError(error);
    }
  }

  public async getPNMetrix(communities): Promise<BaseResponse> {
    try {
      let metrix = new PNMetricsResponse();
      metrix.subscription = new Subscription();
      const installationSearch = {
        [mongoDbTables.installations.devices]: {
          $exists: true,
          $not: { $size: 0 }
        }
      };
      const installationsUsers = await this._mongoSvc.readAllByValue(collections.INSTALLATIONS, installationSearch);
      if (installationsUsers.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.contentNotFound;

        return this.result.createError(this.result.errorInfo);
      }
      const demoUserNames = (await this._userHelper.getDemoUsers());

      const userIds = installationsUsers.map((value) => (new ObjectID(value.userId)));
      const userSearch = {
        [mongoDbTables.users.username]: { $nin: demoUserNames },
        [mongoDbTables.users.id]: { $in: userIds }
      };
      metrix.activeOptInUsers = await this._mongoSvc.getDocumentCount(collections.USERS, userSearch );

      if (communities && communities.length > 0) {
        let search;
        if (communities.includes(noCommunity) && communities.length > 1) {
          communities = communities.filter((value) => value !== noCommunity);
          search = {
            [mongoDbTables.users.username]: { $nin: demoUserNames },
            [mongoDbTables.users.id]: { $in: userIds },
            $and: [
              {
                $or: [
                  { [mongoDbTables.users.myCommunities]: [] },
                  { [mongoDbTables.users.myCommunities]: { $exists: false } },
                  { [mongoDbTables.users.myCommunities]: { $in: communities } }
                ]
              }
            ]
          };

        } else if (communities.includes(noCommunity) && communities.length === 1) {
          search = {
            [mongoDbTables.users.username]: { $nin: demoUserNames },
            [mongoDbTables.users.id]: { $in: userIds },
            $and: [
              {
                $or: [
                  { [mongoDbTables.users.myCommunities]: [] },
                  { [mongoDbTables.users.myCommunities]: { $exists: false } }
                ]
              }
            ]
          };
        } else {
          search = {
            [mongoDbTables.users.username]: { $nin: demoUserNames },
            [mongoDbTables.users.id]: { $in: userIds },
            [mongoDbTables.users.myCommunities]: { $in: communities }
          };
        }

        metrix.activeOptInCommunityUsers = await this._mongoSvc.getDocumentCount(collections.USERS, search);
        metrix = await this.getSubscriptionDetails(search, metrix);
        await this.getMaternityPreferenceCount(metrix, communities , { demoUsers: demoUserNames, installationUsers: userIds });
        return this.result.createSuccess(metrix);
      }
      metrix = await this.getSubscriptionDetails(userSearch, metrix);
      return this.result.createSuccess(metrix);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createError(error);
    }
  }

  public async getPNTemplates(adminUser): Promise<BaseResponse> {
    try {
      if (!(Object.values(SuperAdminRole).includes(adminUser.role))) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedAddDetails;

        return this.result.createError([this.result.errorInfo]);
      }

      const appVersion: AppVersionModel = await this._mongoSvc.readByValue(collections.APPVERSION, {});
      const pushNotification = await this._mongoSvc.readByValue(collections.CONTENT, {
        [mongoDbTables.content.contentType]: contentKeys.pushNotification,
        [mongoDbTables.content.language]: contentKeys.english,
        [mongoDbTables.content.version]: appVersion.content.pushNotification
      });

      if (!pushNotification) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(pushNotification);

    } catch (error) {
      return this.result.createError(error);
    }
  }

  public async updatePNTemplates(adminUser, tempId: string, payload: PushNotificationTemp): Promise<BaseResponse> {
    try {
      if (!(Object.values(SuperAdminRole).includes(adminUser.role))) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedAddDetails;

        return this.result.createError([this.result.errorInfo]);
      }
      const appVersion: AppVersionModel = await this._mongoSvc.readByValue(collections.APPVERSION, {});

      const pushNotifications: PushNotificationContent[] = await this._mongoSvc.readAllByValue(collections.CONTENT, {
        [mongoDbTables.content.contentType]: contentKeys.pushNotification,
        [mongoDbTables.content.version]: appVersion.content.pushNotification
      });

      if (pushNotifications.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.dataNotFound;

        return this.result.createError([this.result.errorInfo]);
      }

      let enPN;
      let esPN;
      delete payload.id;
      for (const pushNotification of pushNotifications) {
        if (pushNotification.language === contentKeys.english) {
          const enIndex = pushNotification.pushNotificationTemplate.findIndex(
            (pn) => pn.id.toString() === tempId
          );
          const data = { ...pushNotification.pushNotificationTemplate[enIndex], ...payload };
          pushNotification.pushNotificationTemplate[enIndex] = data;
          enPN = pushNotification.pushNotificationTemplate;
        } else {
          const esIndex = pushNotification.pushNotificationTemplate.findIndex(
            (pn) => pn.id.toString() === tempId
          );
          const data = { ...pushNotification.pushNotificationTemplate[esIndex], ...payload };;
          pushNotification.pushNotificationTemplate[esIndex] = data;
          esPN = pushNotification.pushNotificationTemplate;
        }
      }

      const enSearch = {
        [mongoDbTables.content.contentType]: contentKeys.pushNotification,
        [mongoDbTables.content.version]: appVersion.content.pushNotification,
        [mongoDbTables.content.language]: contentKeys.english
      };
      const updateEnData = {
        $set: {
          [mongoDbTables.content.pushNotificationTemplate]: enPN
        }
      };
      const enCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        enSearch,
        updateEnData
      );

      const esSearch = {
        [mongoDbTables.content.contentType]: contentKeys.pushNotification,
        [mongoDbTables.content.version]: appVersion.content.pushNotification,
        [mongoDbTables.content.language]: contentKeys.spanish
      };
      const updateEsData = {
        $set: {
          [mongoDbTables.content.helpfulInfoModule]: esPN
        }
      };
      const esCount = await this._mongoSvc.updateByQuery(
        collections.CONTENT,
        esSearch,
        updateEsData
      );

      if (enCount === 0 || esCount === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.updateFailedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.updateFaileDetail;

        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(true);

    } catch (error) {
      return this.result.createError(error);
    }
  }

  private validateCommunityAccessToPN(payload: PushNotificationRequest, admin) {
    if (admin.role === AdminRole.scadvocate) {
      const difference = payload.communities.filter((value) => !admin.communities.includes(value));
      if (payload.allUsers || difference.length > 0 || payload.bannedUsers) {
        return false;
      }

      if (
        (payload.usersWithDraftStory && payload.communities.length === 0) ||
        (payload.usersWithNoStory && payload.communities.length === 0) ||
        (payload.usersWithNoRecentLogin && payload.communities.length === 0)
      ) {
        return false;
      }
    }

    return true;
  }

  private async getSubscriptionDetails(userSearch, metrix: PNMetricsResponse) {
    // Get by subscription
    let newSearch = userSearch;
    newSearch.$and = (!newSearch.$and) ? [] : newSearch.$and;
    newSearch.$and.push({
      $or: [
        { [mongoDbTables.users.commentNotificationFlag]: true },
        { [mongoDbTables.users.commentNotificationFlag]: { $exists: false } }
      ]
    });
    metrix.subscription.commentNotification = await this._mongoSvc.getDocumentCount(collections.USERS, newSearch);
    newSearch = userSearch;
    newSearch.$and.pop();

    newSearch.$and.push({
      $or: [
        { [mongoDbTables.users.commentReactionNotificationFlag]: true },
        { [mongoDbTables.users.commentReactionNotificationFlag]: { $exists: false } }
      ]
    });
    metrix.subscription.commentReactionNotification = await this._mongoSvc.getDocumentCount(collections.USERS, newSearch);
    newSearch.$and.pop();

    newSearch.$and.push({
      $or: [
        { [mongoDbTables.users.replyNotificationFlag]: true },
        { [mongoDbTables.users.replyNotificationFlag]: { $exists: false } }
      ]
    });
    metrix.subscription.replyNotification = await this._mongoSvc.getDocumentCount(collections.USERS, newSearch);
    newSearch.$and.pop();

    newSearch.$and.push({
      $or: [
        { [mongoDbTables.users.reactionNotificationFlag]: true },
        { [mongoDbTables.users.reactionNotificationFlag]: { $exists: false } }
      ]
    });
    metrix.subscription.reactionNotification = await this._mongoSvc.getDocumentCount(collections.USERS, newSearch);
    newSearch.$and.pop();

    newSearch.$and.push({
      $or: [
        { [mongoDbTables.users.communityNotificationFlag]: true },
        { [mongoDbTables.users.communityNotificationFlag]: { $exists: false } }
      ]
    });
    metrix.subscription.communityNotification = await this._mongoSvc.getDocumentCount(collections.USERS, newSearch);

    return metrix;
  }

  private async getMaternityPreferenceCount(metrics: PNMetricsResponse, communities: string[], searchParameters: UserSearchData) {
    try {
      if (communities.includes(noCommunity) && communities.length === 1) {
        metrics.subscription.maternityNotification = 0;
        return;
      }

      if (communities.length >= 1) {
        const communityData: Community[] = await this._mongoSvc.readAllByValue(collections.COMMUNITY, { [mongoDbTables.community.active]: true });
        const maternityData = communityData.find((community) => community.title === maternityCommunity);
        if (maternityData && communities.includes(maternityData.id)) {
          const search = {
            [mongoDbTables.users.username]: { $nin: searchParameters.demoUsers },
            [mongoDbTables.users.id]: { $in: searchParameters.installationUsers },
            [mongoDbTables.users.myCommunities]: { $all: [maternityData.id] },
            [mongoDbTables.users.maternityNotificationFlag]: true
          };
          metrics.subscription.maternityNotification = await this._mongoSvc.getDocumentCount(collections.USERS, search);
        }
        else {
          metrics.subscription.maternityNotification = 0;
        }
      }

      return;
    }
    catch (error) {
      this._log.error(error as Error);
      metrics.subscription.maternityNotification = 0;
    }
  }
}
