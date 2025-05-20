import { API_RESPONSE, collections, mongoDbTables, Result, SNSEnum } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Device, InstallationRequest, Installations } from '../models/internalRequestModel';
import { BaseResponse } from '../models/resultModel';
import { InstallationTokenModel, User } from '../models/userModel';
import { SnsService } from './aws/snsService';

@Service()
export class InstallationService {
  constructor(
    private mongoService: MongoDatabaseClient,
    private result: Result,
    private snsService: SnsService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async saveInstallations(
    model: InstallationRequest,
    currentUserId
  ): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(collections.USERS, currentUserId);
      let endpointArn;

      if (model.platform === SNSEnum.IOS) {

        endpointArn = await this.snsService.addEndpoint(model);
        if (endpointArn === null) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidTokenTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidTokenTitle;
          return this.result.createError([this.result.errorInfo]);
        }
      }

      /* Handle the two uses having same device token. */
      await this.handleInstallations(user.id, model.deviceToken, endpointArn);

      // Storing the Installtions to the Community V2 DB.
      let installations: Installations = await this.mongoService.readByValue(collections.INSTALLATIONS, {
        [mongoDbTables.installations.userId]: user.id
      });

      delete model.userName;
      const device: Device = {
        ...model,
        id: new ObjectId().toHexString(),
        endpointArn: endpointArn ?? null,
        createdTimestamp: new Date(),
        updatedTimestamp: new Date(),
        badge: 0
      };

      if (installations !== null) {
        const data = installations.devices.filter((value) =>
          value.deviceToken === model.deviceToken
        )[0];

        if (data) {
          this.result.errorInfo.title = API_RESPONSE.messages.duplicateTokenTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.duplicateTokenDetail;
          return this.result.createError([this.result.errorInfo]);
        }

        installations.devices.push(device);
        const filter = { [mongoDbTables.installations.userId]: user.id };
        const setvalues = {
          $set: { [mongoDbTables.installations.devices]: installations.devices }
        };
        await this.mongoService.updateByQuery(collections.INSTALLATIONS, filter, setvalues);
      }
      else {
        installations = new Installations();
        installations.userId = user.id;
        const devices: Device[] = [];
        devices.push(device);
        installations.devices = devices;
        await this.mongoService.insertValue(collections.INSTALLATIONS, installations);
      }

      return this.result.createSuccess(installations);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async deleteInstallationById(
    model: InstallationTokenModel,
    userId: string
  ): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(collections.USERS, userId);
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const search = {
        [mongoDbTables.installations.userId]: userId,
        [mongoDbTables.installations.deviceToken]: model.deviceToken
      };

      const projection = {
        'projection': {
          [mongoDbTables.installations.userId]: true,
          [mongoDbTables.installations.deviceItem]: true
        }
      };

      const installation: Installations = await this.mongoService.readByValue(collections.INSTALLATIONS, search, projection);
      if (installation === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.installationDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const query = {
        [mongoDbTables.installations.userId]: installation.userId,
        [mongoDbTables.installations.devices]: {
          '$elemMatch': {
            [mongoDbTables.installations.deviceId]: installation.devices[0].id,
            [mongoDbTables.installations.token]: installation.devices[0].deviceToken
          }
        }
      };

      const setValue = {
        '$pull': {
          [mongoDbTables.installations.devices]: {
            [mongoDbTables.installations.deviceId]: installation.devices[0].id,
            [mongoDbTables.installations.token]: installation.devices[0].deviceToken
          }
        }
      };
      await this.mongoService.updateByQuery(collections.INSTALLATIONS, query, setValue);
      return this.result.createSuccess(true);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async handleInstallations(userId: string, deviceToken: string, endpointArn?: string) {
    try {
      const search = {
        [mongoDbTables.installations.userId]: {
          '$ne': userId
        },
        [mongoDbTables.installations.deviceToken]: deviceToken
      };

      const projection = {
        'projection': {
          [mongoDbTables.installations.userId]: true,
          [mongoDbTables.installations.deviceItem]: true
        }
      };

      const installations = await this.mongoService.readAllByValue(collections.INSTALLATIONS, search, {}, null, null, projection);
      if (installations.length !== 0) {
        installations.forEach(async (installation: Installations) => {
          const duplicateIds = installation.devices.map((value) => {
            return value[mongoDbTables.installations.deviceId];
          });

          const query = {
            [mongoDbTables.installations.userId]: installation.userId,
            [mongoDbTables.installations.devices]: {
              '$elemMatch': {
                [mongoDbTables.installations.deviceId]: {
                  '$in': duplicateIds
                }
              }
            }
          };

          const setValue = {
            '$pull': {
              [mongoDbTables.installations.devices]: {
                [mongoDbTables.installations.deviceId]: {
                  '$in': duplicateIds
                }
              }
            }
          };
          await this.mongoService.updateByQuery(collections.INSTALLATIONS, query, setValue);
        });
      }
      return true;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
