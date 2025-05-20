import {
  NotificationMessages,
  TranslationLanguage
} from '@anthem/communityapi/common';
import {
  mockCommunity,
  mockMongo
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { ActivityHelper } from '../../helpers/activityHelper';

describe('Activity Helper', () => {
  let service;

  beforeEach(() => {
    service = new ActivityHelper(
      <any>mockCommunity,
      <any>mockMongo,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('translateActivities - success', async () => {
    const activities = require('../data/activities.json');
    const communities = require('../data/communitiesRawData.json');
    mockCommunity.getAllCommunities.mockReturnValue({
      data: {
        isSuccess: true,
        isException: false,
        value: communities
      }
    });
    const activitySize = activities.length;
    await service.translateActivities(activities, TranslationLanguage.SPANISH);
    expect(activitySize).toBeGreaterThan(0);
  });

  it('handleUserActivity - add to existing activity', async () => {
    const activities = require('../data/activities.json');
    const user = require('../data/user.json');
    mockMongo.readByValue.mockReturnValue({
      id: '6186d0bd1ff0af0022de7898',
      userId: 'userId',
      activitiesList: activities
    });
    mockMongo.updateByQuery.mockReturnValue(true);
    const result = await service.handleUserActivity(
      '62261e3095da9115d3a2809d',
      user,
      '6186d0bd1ff0af0022de7898',
      NotificationMessages.ReactionActivityTitle,
      '62261e3195ea9115d3b2809d'
    );
    expect(result.activityText).toBe(
      NotificationMessages.ReactionActivityTitle
    );
  });

  it('handleUserActivity - add to new activity', async () => {
    const user = require('../data/user.json');
    mockMongo.readByValue.mockReturnValue(null);
    mockMongo.updateByQuery.mockReturnValue(true);
    const result = await service.handleUserActivity(
      '62261e3095da9115d3a2809d',
      user,
      '6186d0bd1ff0af0022de7898',
      NotificationMessages.ReactionActivityTitle,
      '62261e3195ea9115d3b2809d'
    );
    expect(result.activityText).toBe(
      NotificationMessages.ReactionActivityTitle
    );
  });
});
