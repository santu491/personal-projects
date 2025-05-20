import { API_RESPONSE } from '@anthem/communityadminapi/common';
import { mockMongo, mockPushNotificationHelper, mockResult, mockSchedule, mockValidation, mockifiedUserContext } from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { UserHelperService } from 'api/adminresources/helpers/userHelper';
import { PageParam } from 'api/adminresources/models/pageParamModel';
import { PushNotificationRequest, TargetAudience, ViewPNRequest } from 'api/adminresources/models/pushNotificationModel';
import { PushNotificationService } from '../pushNotificationService';

describe('PushNotificationService', () => {
  let service: PushNotificationService;
  let getDemoUsers;

  beforeEach(() => {
    service = new PushNotificationService(
      <any>mockResult,
      <any>mockSchedule,
      <any>mockMongo,
      <any>mockPushNotificationHelper,
      <any>mockValidation,
      <any>mockILogger
    );
    getDemoUsers = jest.spyOn(UserHelperService.prototype as any, 'getDemoUsers');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createPnPayload: PushNotificationRequest = {
    title: "",
    body: "",
    sendOn: "",
    communities: ["communityId"],
    nonCommunityUsers: false,
    allUsers: false,
    bannedUsers: false,
    deepLink: {
      label: '',
      url: ''
    },
    isScheduled: false,
    usersWithNoStory: false,
    usersWithDraftStory: false,
    usersWithNoRecentLogin: false,
    numberOfLoginDays: 0,
    id: ''
  };
  const admin ={
    id: 'id',
    username: 'username',
    firstName: 'fisrName',
    lastName: 'lastName',
    displayName: 'displayName',
    profileImage: 'image',
    role: 'scadvocate',
    communities: ["randomID", "communityId"],
    displayTitle: 'displayTitle'
  };

  // Create Push Notifications
  it('Should creating a new scheduled PN: Advocate Validation', async () => {
    const expResult = {
      title: API_RESPONSE.messages.notAllowedTitle,
      detail: API_RESPONSE.messages.notAllowedCommunity
    };

    mockMongo.readByID.mockReturnValue(admin);
    mockResult.createError.mockReturnValue(expResult);

    const resData = await service.createPushNotification({
      ...createPnPayload,
      allUsers: true
    }, 'adminId');
    expect(resData).toEqual(expResult);
  });

  it('Should creating a new scheduled PN: Schedule failed.', async () => {
    const expResult = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.tryAgain
    };

    mockMongo.readByID.mockReturnValue(admin);
    mockPushNotificationHelper.createPushNotificationData.mockReturnValue(true);
    mockSchedule.schedulePNJob.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expResult);

    const resData = await service.createPushNotification(createPnPayload, 'adminId');
    expect(resData).toEqual(expResult);
  });

  it('Should creating a new scheduled PN: Schedule Success.', async () => {
    const expResult = { data: true};
    mockMongo.readByID.mockReturnValue(admin);
    mockPushNotificationHelper.createPushNotificationData.mockReturnValue(true);
    mockSchedule.schedulePNJob.mockReturnValue(true);
    mockResult.createSuccess.mockReturnValue(expResult);

    const resData = await service.createPushNotification(createPnPayload, 'adminId');
    expect(resData).toEqual(expResult);
  });

  it('Should creating a new scheduled PN: Exception', async () => {
    mockMongo.readByID.mockImplementation(() => {
      throw new Error()
    })
    await service.createPushNotification(createPnPayload, 'adminId');
  });

  // Update Push Notifications
  it('Should update the scheduled PN: Schedule failed.', async () => {
    const expResult = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.tryAgain
    };

    mockMongo.readByID.mockReturnValue(admin);
    mockPushNotificationHelper.createPushNotificationData.mockReturnValue(true);
    mockSchedule.schedulePNJob.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expResult);

    const resData = await service.createPushNotification(createPnPayload, 'adminId');
    expect(resData).toEqual(expResult);
  });

  it('Should return pn Audience count: communities', async () => {
    const payload: TargetAudience = {
      communities: ["communityId"],
      bannedUsers: false,
      nonCommunityUsers: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: false,
      usersWithNoStory: false,
      numberOfLoginDays: 0,
      allUsers: false
    };

    const expResult = { data: { isSuccess: true, value: 46 }};

    getDemoUsers.mockImplementation(() => {
      return Promise.resolve([])
    });
    mockMongo.getDocumentCount.mockReturnValue(42);
    mockResult.createSuccess.mockReturnValue(expResult);
    const result = await service.getTargetAudienceCount(payload);
    expect(result).toEqual(expResult);
  });

  it('Should return pn Audience count: 0', async () => {
    const payload: TargetAudience = {
      communities: [],
      bannedUsers: false,
      nonCommunityUsers: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: false,
      usersWithNoStory: false,
      numberOfLoginDays: 0,
      allUsers: false
    };

    const expResult = { data: { isSuccess: true, isException: false, value: 0 } };

    getDemoUsers.mockImplementation(() => {
      return Promise.resolve([])
    });
    mockResult.createSuccess.mockReturnValue(expResult);
    await service.getTargetAudienceCount(payload);
  });

  it('Should return pn Audience count: allother cases', async () => {
    const payload: TargetAudience = {
      communities: ["communityId"],
      bannedUsers: false,
      nonCommunityUsers: true,
      usersWithDraftStory: true,
      usersWithNoRecentLogin: true,
      usersWithNoStory: true,
      numberOfLoginDays: 0,
      allUsers: false
    };

    const expResult = { data: { isSuccess: true, isException: false, value: 25 } };

    getDemoUsers.mockImplementation(() => {
      return Promise.resolve([])
    });
    mockPushNotificationHelper.getNoRecentLoginCount.mockReturnValue(25);
    mockPushNotificationHelper.getUsersWithNoStoryCount.mockReturnValue(25);
    mockPushNotificationHelper.getUsersWithDraftStoryCount.mockReturnValue(25);
    mockPushNotificationHelper.getNonCommunityUsersCount.mockReturnValue(25);
    mockResult.createSuccess.mockReturnValue(expResult);
    const result = await service.getTargetAudienceCount(payload);
    expect(result).toEqual(expResult);
  });

  it('Should return pn Audience count: all user cases', async () => {
    const payload: TargetAudience = {
      communities: ["communityId"],
      bannedUsers: false,
      nonCommunityUsers: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: false,
      usersWithNoStory: false,
      numberOfLoginDays: 0,
      allUsers: true
    };

    const expResult = { data: { isSuccess: true, isException: false, value: 25 } };

    getDemoUsers.mockImplementation(() => {
      return Promise.resolve([])
    });
    mockPushNotificationHelper.getCountData.mockReturnValue(25);
    mockResult.createSuccess.mockReturnValue(expResult);
    const result = await service.getTargetAudienceCount(payload);
    expect(result).toEqual(expResult);
  });

  it('getPNMetrix - success', async () => {
    mockMongo.readAllByValue.mockReturnValueOnce([
      {
        userId: '617711878c1ec568209d2614'
      },
      {
        userId: '608142209184f81ffab0221b'
      }
    ]).mockReturnValue([]);
    mockMongo.getDocumentCount.mockReturnValue(12);
    await service.getPNMetrix(['communityId', 'communityId1']);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPNMetrix - no community success', async () => {
    mockMongo.readAllByValue.mockReturnValueOnce([
      {
        userId: '617711878c1ec568209d2614'
      },
      {
        userId: '608142209184f81ffab0221b'
      }
    ]).mockReturnValue([]);
    mockMongo.getDocumentCount.mockReturnValue(12);
    await service.getPNMetrix(['noCommunity']);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPNMetrix - all community success', async () => {
    mockMongo.readAllByValue.mockReturnValueOnce([
      {
        userId: '617711878c1ec568209d2614'
      },
      {
        userId: '608142209184f81ffab0221b'
      }
    ]).mockReturnValue([]);
    mockMongo.getDocumentCount.mockReturnValue(12);
    await service.getPNMetrix(['noCommunity','communityId', 'communityId1']);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPNMetrix - just user data success', async () => {
    mockMongo.readAllByValue.mockReturnValueOnce([
      {
        userId: '617711878c1ec568209d2614'
      },
      {
        userId: '608142209184f81ffab0221b'
      }
    ]).mockReturnValue([]);
    mockMongo.getDocumentCount.mockReturnValue(12);
    await service.getPNMetrix([]);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPNMetrix - error', async () => {
    mockMongo.readAllByValue.mockReturnValueOnce([]).mockReturnValue([]);
    mockMongo.getDocumentCount.mockReturnValue(12);
    await service.getPNMetrix([]);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });


  it('getPushNotification - should return PN', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    const pageNum: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };
    const viewPn: ViewPNRequest = {
      communities: [],
      status: []
    };
    mockPushNotificationHelper.getFilter.mockReturnValue({ 'query': 'data' });
    mockMongo.readAllByValue.mockReturnValue([]);
    mockMongo.getDocumentCount.mockReturnValue(10);
    await service.getPushNotification(pageNum, viewPn);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    expect(mockResult.createSuccess).toBeCalledWith({
      pushNotifications: [],
      totalCount: 10
    });
  });
});
