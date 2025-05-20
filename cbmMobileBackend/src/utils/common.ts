import minimist from 'minimist';
import {
  APIResponseCodes,
  CommonConstants,
  DB_TABLE_NAMES,
  DynamoDbConstants,
  Messages,
  REGEX_CONSTANTS,
} from '../constants';
import {EAPMemberProfileService} from '../services/eap/eapMemberProfileService';
import {MemberOAuthPayload} from '../types/customRequest';
import {ResponseUtil} from '../utils/responseUtil';
import logger from './logger';
import {DynamoDBGateway} from '../gateway/dynamoDBGateway';

/**
 * Function that give the difference between two dates in minutes
 * @param timeOne Date
 * @param timeTwo Date
 * @returns number ()
 */

export const timeDiffInMinutes = (timeA: Date, timeB: Date): number => {
  if (timeA > timeB) {
    return Math.round((timeA.getTime() - timeB.getTime()) / 60000);
  } else {
    return Math.round((timeB.getTime() - timeA.getTime()) / 60000);
  }
};

export const capitalizeStr = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getArgument = (key: string): string => {
  const args = minimist(process.argv.slice(2));
  return (
    args[key] || process.env[`npm_config_${key}`] || process.env[`${key}`] || ''
  );
};

export const randomString = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const replaceAll = (
  actualString: string,
  patterns: {pattern: string | RegExp; value: string}[],
) => {
  if (!actualString) return actualString;
  patterns.forEach(({pattern, value}) => {
    actualString = actualString.replace(
      new RegExp(pattern, REGEX_CONSTANTS.GLOBAL),
      value,
    );
  });
  return actualString;
};

export const getAccessToken = async () => {
  const memberService = new EAPMemberProfileService();
  const accessToken = await memberService.getEAPMemberAuthAccessToken();
  if (!accessToken) {
    throw new Error(Messages.memberEAPauthorizationError);
  }
  return accessToken;
};

export const getAppConfig = async () => {
  const dbGateway = new DynamoDBGateway();
  const appConfigData = await dbGateway.getRecords({
    [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.CONFIG,
    [DynamoDbConstants.KEY]: {
      env: getDatabaseENV(),
      appName: CommonConstants.app,
    },
  });
  if (!appConfigData?.data?.isSuccess) {
    throw new Error(Messages.appVersionError);
  }
  return appConfigData.data.value;
};

export const handleErrorMessage = (error: unknown, defaultMessage: string) => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  logger().error(errorMessage, error);
  return errorMessage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGatewayResponse = (status: APIResponseCodes, data: any) => {
  return status === APIResponseCodes.SUCCESS
    ? {status, data}
    : {status, message: data};
};

export const validateMemberOAuthPayload = (payload: MemberOAuthPayload) => {
  if (!payload.userName || !payload.iamguid || !payload.clientName) {
    throw new ResponseUtil().createException(
      Messages.invalidAuthError,
      APIResponseCodes.BAD_REQUEST,
    );
  }
};

export const getDatabaseENV = () => {
  const apiENV = getArgument('env');
  switch (apiENV) {
    case 'dev1':
    case 'dev2':
      return 'dev';
    case 'sit1':
    case 'sit2':
      return 'sit';
    case 'uat1':
    case 'uat2':
      return 'uat';
    case 'perf':
      return 'perf';
    case 'dr':
      return 'dr';
    case 'prod':
      return 'prod';
    default:
      return null;
  }
};

export function toCamelCase(input: string): string {
  return input
    ? input
        .split('-')
        .map((word, index) => {
          if (index === 0) {
            return word.toLowerCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('')
    : input;
}

export function titleCaseToCamelCase(input: string): string {
  if (!input) return input;

  const words = input.split(' ');
  const camelCaseString = words
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  return camelCaseString;
}

export function mergeObjects(response: object[]): object {
  if (!response || response.length === 0) {
    return {};
  }

  const mergedObject = response.reduce(
    (acc: {[key: string]: any}, current: {[key: string]: any}) => {
      Object.keys(current).forEach(key => {
        if (acc.hasOwnProperty(key)) {
          // If the key already exists, combine the values into an array
          if (Array.isArray(acc[key])) {
            acc[key].push(current[key]);
          } else {
            acc[key] = [acc[key], current[key]];
          }
        } else {
          // If the key does not exist, simply add it
          acc[key] = current[key];
        }
      });
      return acc;
    },
    {},
  );

  return mergedObject;
}

export function replaceSingleAttributeObjects(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const newObj: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const keys = Object.keys(value);

        if (keys.length === 1) {
          const newKey = key; // `${key}${capitalizeFirstLetter(keys[0])}`;
          newObj[newKey] = value[keys[0]];
        } else {
          newObj[key] = replaceSingleAttributeObjects(value);
        }
      } else {
        newObj[key] = replaceSingleAttributeObjects(value);
      }
    }
  }

  return newObj;
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertPathToEncoded(input: string): string {
  return input ? input.replace(/\//g, '%2F') : input;
}

/**
 * Gets the last segment of a string separated by slashes.
 * @param {string} input - The input string.
 * @returns {string} The last segment of the input string.
 */
export function getLastSegment(input: string): string {
  const segments = input.split('/');
  return segments[segments.length - 1]
    .toLowerCase()
    .replace(/[-_\/](.)/g, (_, group1) => group1.toUpperCase());
}
