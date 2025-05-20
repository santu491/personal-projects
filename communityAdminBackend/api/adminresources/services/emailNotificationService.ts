import {
  API_RESPONSE,
  batchSize,
  collections,
  mongoDbTables,
  Result,
  SQSParams,
  SuperAdminRole
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';
import { UserHelperService } from '../helpers/userHelper';
import { EmailNotification } from '../models/pushNotificationModel';
import { BaseResponse } from '../models/resultModel';
import { SqsService } from './aws/sqsService';

@Service()
export class EmailNotificationService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private sqsService: SqsService,
    @LoggerParam(__filename) private _log: ILogger,
    private _userHelper: UserHelperService
  ) {}

  public async triggerMassEmail(adminUser): Promise<BaseResponse> {
    try {
      if (!Object.values(SuperAdminRole).includes(adminUser.role)) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.notAllowedAddDetails;

        return this.result.createError([this.result.errorInfo]);
      }
      let totalUserCount: number = await this._mongoSvc.getRowCount(
        collections.USERS,
        {}
      );
      let skip = 0;
      while (totalUserCount !== 0) {
        const emailMessageData: EmailNotification = {
          skip: skip,
          limit: batchSize,
          createdDate: new Date(),
          env: getArgument('env')
        };
        await this.sqsService.addToNotificationQueue(
          emailMessageData,
          APP.config.aws.emailQueue,
          SQSParams.EMAIL_NOTIFICATION
        );
        skip = skip + batchSize;
        totalUserCount =
          totalUserCount > batchSize
            ? totalUserCount - batchSize
            : totalUserCount;
        if (totalUserCount <= batchSize) {
          totalUserCount = 0;
        }
      }
      await this._mongoSvc.updateByQuery(
        collections.APPVERSION,
        {},
        {
          $set: {
            [mongoDbTables.appVersion.touNotifiedAt]: new Date()
          }
        }
      );
      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async touMassEmailInfo(): Promise<BaseResponse> {
    try {
      const getAppVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const demoUsers = await this._userHelper.getDemoUsers();
      const getAllUsersQuery = {
        [mongoDbTables.users.username]: { $nin: demoUsers }
      };

      const getMailReceivedUsersQuery = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.tou]: {
          $elemMatch: {
            [mongoDbTables.users.touVersion]: getAppVersion.tou,
            [mongoDbTables.users.touNotifiedAt]: { $exists: true, $ne: '' }
          }
        }
      };

      const getallCommercialUsersQuery = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.memberType]: 'eMember'
      };

      const getMailReceivedCommercialUsersQuery = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.memberType]: 'eMember',
        [mongoDbTables.users.tou]: {
          $elemMatch: {
            [mongoDbTables.users.touVersion]: getAppVersion.tou,
            [mongoDbTables.users.touNotifiedAt]: { $exists: true, $ne: '' }
          }
        }
      };

      const getalldMedicaidUsersQuery = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.memberType]: { $ne: 'eMember' }
      };
      const getMailReceivedMedicaidUsersQuery = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.memberType]: { $ne: 'eMember' },
        [mongoDbTables.users.tou]: {
          $elemMatch: {
            [mongoDbTables.users.touVersion]: getAppVersion.tou,
            [mongoDbTables.users.touNotifiedAt]: { $exists: true, $ne: '' }
          }
        }
      };

      const [
        allUsers,
        receivedEmailWithAllUsers,
        allCommercailUsers,
        receivedEmailWithCommericalUsers,
        allMedicaidUsers,
        receivedEmailWithMedicaidUsers
      ] = await Promise.all([
        this._mongoSvc.getRowCount(collections.USERS, getAllUsersQuery),
        this._mongoSvc.getRowCount(
          collections.USERS,
          getMailReceivedUsersQuery
        ),
        this._mongoSvc.getRowCount(
          collections.USERS,
          getallCommercialUsersQuery
        ),

        this._mongoSvc.getRowCount(
          collections.USERS,
          getMailReceivedCommercialUsersQuery
        ),
        this._mongoSvc.getRowCount(
          collections.USERS,
          getalldMedicaidUsersQuery
        ),
        this._mongoSvc.getRowCount(
          collections.USERS,
          getMailReceivedMedicaidUsersQuery
        )
      ]);
      const data = {
        touVersion: getAppVersion.tou,
        lastUpdatedTouAt: getAppVersion.touNotifiedAt,
        allUsers: {
          totalUsersCount: allUsers,
          emailReceivedCount: receivedEmailWithAllUsers
        },
        commercialUsers: {
          totalUsersCount: allCommercailUsers,
          emailReceivedCount: receivedEmailWithCommericalUsers
        },

        medicaidUsers: {
          totalUsersCount: allMedicaidUsers,
          emailReceivedCount: receivedEmailWithMedicaidUsers
        }
      };
      return this.result.createSuccess(data);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }
}
