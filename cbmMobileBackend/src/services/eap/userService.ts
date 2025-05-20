import {
  APIResponseCodes,
  DB_TABLE_NAMES,
  DynamoDbConstants,
  Messages,
  Platform,
} from '../../constants';
import {DynamoDBGateway} from '../../gateway/dynamoDBGateway';
import {DeviceInfo} from '../../models/Users';
import {MemberOAuthPayload} from '../../types/customRequest';
import {InstallationTokenModel} from '../../types/userRequest';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';

export class UserService {
  result = new ResponseUtil();
  dynamoDb = new DynamoDBGateway();
  private Logger = logger();
  private className = this.constructor.name;

  public async badgeReset(
    model: InstallationTokenModel,
    memberOAuth: MemberOAuthPayload,
  ) {
    try {
      const userQuery = {
        [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
        [DynamoDbConstants.KEY]: {
          iamguid: memberOAuth.iamguid,
          clientName: memberOAuth.clientName,
        },
      };
      const userData = await this.dynamoDb.getRecords(userQuery);
      if (!userData.data.isSuccess) {
        return this.result.createException(
          Messages.userNotFound,
          APIResponseCodes.BAD_REQUEST,
        );
      }

      // Reset badge count for user Device
      const updatedDeviceInfo = userData.data.value.deviceInfo.map(
        (device: DeviceInfo) => {
          if (
            device.deviceToken === model.deviceToken &&
            device.platform === Platform.ios
          ) {
            return {...device, badge: model.count};
          }
          return device;
        },
      );

      const updateQuery = {
        [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
        [DynamoDbConstants.KEY]: {
          iamguid: memberOAuth.iamguid,
          clientName: memberOAuth.clientName,
        },
        [DynamoDbConstants.UPDATE_EXPRESSION]: `SET deviceInfo = :deviceInfo`,
        [DynamoDbConstants.EXPRESSION_ATTRIBUTE_VALUES]: {
          ':deviceInfo': updatedDeviceInfo,
        },
      };
      const response = await this.dynamoDb.updateRecord(updateQuery);
      if (!response.data.isSuccess) {
        return this.result.createException(Messages.updateError);
      }

      return this.result.createSuccess(Messages.updateSuccess);
    } catch (error) {
      this.Logger.error(`${this.className} - badgeReset :: ${error}`);
      return error;
    }
  }
}
