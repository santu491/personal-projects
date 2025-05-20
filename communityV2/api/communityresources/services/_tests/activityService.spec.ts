import { API_RESPONSE, TranslationLanguage } from '@anthem/communityapi/common';
import {
  mockActivityHelper,
  mockBlockUserService,
  mockMongo,
  mockResult,
  mockUserHelper,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { PageParam } from 'api/communityresources/models/pageParamModel';
import { ActivityService } from '../activityService';

describe('Activity Service', () => {
  let service: ActivityService;
  beforeEach(() => {
    service = new ActivityService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockValidation,
      <any>mockBlockUserService,
      <any>mockActivityHelper,
      <any>mockUserHelper,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const activityList = require('./data/activitiesRaw.json');
  const userData = require('./data/activitiesRaw.json');

  it('markActivityAsRead - success', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockMongo.readByValue.mockReturnValue({ 'activity': 'data' });
    mockMongo.updateByQuery.mockReturnValue({ modifiedCount: 1 });
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const actualResponse = await service.markActivityAsRead('userId', '62065e392715d2002aa45fba');
    expect(actualResponse).toBe(expectedResult);
  });

  it('markActivityAsRead - Activity does not exist', async () => {
    const expectedResult = {
      data: {
        isSuccess: false,
        isException: true,
        value: [
          {
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.activityDoesNotExist
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expectedResult);
    const actualResponse = await service.markActivityAsRead('userId', '62065e392715d2002aa45fba');
    expect(actualResponse).toBe(expectedResult);
  });

  it('getUserActivity - success', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {
          id: 'activityId',
          userId: 'userId',
          activityList: activityList
        }
      }
    };
    const pageParam: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };
    mockMongo.readByValue.mockReturnValueOnce(expectedResult.data.value).mockReturnValue(userData);
    mockBlockUserService.getBlockUserIdList.mockReturnValue([]);
    mockValidation.sort.mockReturnValue(activityList);
    mockResult.createSuccess.mockReturnValue(expectedResult);

    const actualResult = await service.getUserActivity('userId', TranslationLanguage.ENGLISH, pageParam);
    expect(actualResult).toBe(expectedResult);
  });

  it('getUserActivity - no user activity', async () => {
    const expectedResult = {
      data: {
        isSuccess: true,
        value: {}
      }
    };
    const pageParam: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createSuccess.mockReturnValue(expectedResult);

    const actualResult = await service.getUserActivity('userId', TranslationLanguage.ENGLISH, pageParam);
    expect(actualResult).toBe(expectedResult);
  });
});
