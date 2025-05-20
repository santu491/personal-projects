import {StatusCodes} from 'http-status-codes';
import {
  DB_TABLE_NAMES,
  DynamoDbConstants,
  Messages,
  Platform,
} from '../../constants';
import {DynamoDBGateway} from '../../gateway/dynamoDBGateway';
import {EAPMemberProfileGateway} from '../../gateway/eapMemberProfileGateway';
import {
  DeviceDetails,
  InstallationRequest,
} from '../../types/installationRequest';
import logger from '../../utils/logger';
import {
  addDeviceToken,
  disableDeviceToken,
} from '../../utils/notifications/sns';
import {ResponseUtil} from '../../utils/responseUtil';
import {User} from '../../models/Users';

export class InstallationService {
  result = new ResponseUtil();
  dbGateway = new DynamoDBGateway();
  memberProfileGateway = new EAPMemberProfileGateway();
  private Logger = logger();
  private className = this.constructor.name;

  private isDuplicateDevice = (userData: any, deviceToken: string) => {
    const deviceExists = userData.deviceInfo?.find(
      (device: DeviceDetails) => device.deviceToken === deviceToken,
    );
    if (deviceExists) {
      return true;
    }
    return false;
  };

  private async isRegisteredDevice(deviceToken: string) {
    const users = await this.dbGateway.getAllRecords({
      [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
    });
    if (!users.isSuccess || users.value.length === 0) {
      return true;
    }

    const filteredUsers = users.value?.filter((item: User) =>
      item.deviceInfo?.some(device => device.deviceToken === deviceToken),
    );

    // If the device is already registered, clear that device from those users.
    if (filteredUsers.length > 0) {
      filteredUsers.forEach(async (userItem: User) => {
        const query = {
          [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.USERS,
          Key: {
            iamguid: userItem.iamguid,
            clientName: userItem.clientName,
          },
          [DynamoDbConstants.UPDATE_EXPRESSION]: `${DynamoDbConstants.REMOVE} deviceInfo[${userItem.deviceInfo?.findIndex(device => device.deviceToken === deviceToken)}]`,
        };
        await this.dbGateway.updateRecord(query);
      });
    }

    return false;
  }

  /**
   * Function that saves the user device details in the DB.
   * @param request - InstallationRequest
   * @returns responseUtil
   */
  async saveInstallation(
    request: InstallationRequest,
    iamguid: string,
    clientName: string,
  ) {
    try {
      const userData = await this.memberProfileGateway.getMemberDbData(
        iamguid,
        clientName,
      );

      if (!userData) {
        return this.result.createException(
          Messages.notFoundError,
          StatusCodes.BAD_REQUEST,
        );
      }

      if (this.isDuplicateDevice(userData, request.deviceToken)) {
        return this.result.createSuccess(Messages.deviceAlreadyRegistered);
      }

      if (await this.isRegisteredDevice(request.deviceToken)) {
        return this.result.createException(Messages.duplicateDeviceRegistered);
      }

      const deviceDetails: DeviceDetails = {
        appVersion: request.appVersion,
        locale: request.locale,
        platform: request.platform,
        deviceToken: request.deviceToken,
        createdTS: new Date(),
        updatedTS: new Date(),
        badge: 0,
      };
      if (request?.timeZoneOffset) {
        deviceDetails.timeZoneOffset = request.timeZoneOffset;
      }
      if (request?.osVersion) {
        deviceDetails.osVersion = request.osVersion;
      }

      if (request.platform === Platform.ios) {
        // Subscribe the user for the SNS Application.
        const endpointArn = await addDeviceToken({
          platform: request.platform,
          deviceToken: request.deviceToken,
        });
        if (!endpointArn) {
          return this.result.createException(
            Messages.endpointNotFound,
            StatusCodes.BAD_REQUEST,
          );
        }
        deviceDetails.endpointArn = endpointArn;
      }

      const updateQuery = {
        TableName: DB_TABLE_NAMES.USERS,
        Key: {
          iamguid,
          clientName,
        },
        [DynamoDbConstants.UPDATE_EXPRESSION]: `${DynamoDbConstants.SET} #deviceInfo = list_append(if_not_exists(#deviceInfo, :empty_list), :device)`,
        [DynamoDbConstants.EXPRESSION_ATTRBUTE_NAMES]: {
          '#deviceInfo': 'deviceInfo',
        },
        [DynamoDbConstants.EXPRESSION_ATTRIBUTE_VALUES]: {
          ':empty_list': [],
          ':device': [deviceDetails],
        },
        [DynamoDbConstants.RETURN_VALUES]: DynamoDbConstants.UPDATED_NEW,
      };

      const response = await this.dbGateway.updateRecord(updateQuery);
      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - saveInstallation :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.somethingWentWrong,
      );
    }
  }

  /**
   * Function that deleted the device installation
   * @param token
   * @param userId
   * @returns response on deletion
   */
  async deleteInstallation(token: string, iamguid: string, clientName: string) {
    try {
      const userData = await this.memberProfileGateway.getMemberDbData(
        iamguid,
        clientName,
      );

      if (!userData) {
        return this.result.createException(
          Messages.notFoundError,
          StatusCodes.BAD_REQUEST,
        );
      }

      const deviceIndex =
        userData?.deviceInfo?.findIndex(
          (device: DeviceDetails) => device.deviceToken === token,
        ) ?? -1;

      if (deviceIndex === -1) {
        return this.result.createException(
          Messages.notFoundError,
          StatusCodes.BAD_REQUEST,
        );
      }
      const deviceInfo = userData.deviceInfo[deviceIndex];
      if (deviceInfo.platform === Platform.ios) {
        await disableDeviceToken(deviceInfo.endpointArn);
      }

      const response = await this.dbGateway.updateRecord({
        TableName: `${DB_TABLE_NAMES.USERS}`,
        Key: {
          iamguid,
          clientName,
        },
        UpdateExpression: `${DynamoDbConstants.REMOVE} deviceInfo[${deviceIndex}]`,
      });

      return response?.data?.isSuccess
        ? this.result.createSuccess(Messages.deleteSuccess, StatusCodes.OK)
        : this.result.createException(
            Messages.apiFailure,
            StatusCodes.NOT_MODIFIED,
          );
    } catch (error: any) {
      this.Logger.error(`${this.className} - deleteInstallation :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.deleteError,
      );
    }
  }
}
