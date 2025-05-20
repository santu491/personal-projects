import { API_RESPONSE, ValidationResponse } from "@anthem/communityadminapi/common";
import { mockPushNotificationService, mockRequestValidator, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { PushNotificationRequest, TargetAudience, ViewPNRequest } from "api/adminresources/models/pushNotificationModel";
import { PushNotificationController } from "../pushNotificationController";

describe('PushNotificationController', () => {
  let controller: PushNotificationController;

  beforeEach(() => {
    controller = new PushNotificationController(<any>mockResult, <any>mockValidation, <any>mockRequestValidator, <any>mockPushNotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockifiedUserContext = jest.fn().mockReturnValue("{\"id\":\"61b21e9c26dbb012b69cf67e\",\"name\":\"az00001\",\"active\":\"true\",\"role\":\"scadmin\",\"iat\":1643012245,\"exp\":1643041045,\"sub\":\"az00001\",\"jti\":\"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433\"}");
  const pnRequestMock: PushNotificationRequest = {
    id: "",
    title: "title",
    body: "",
    sendOn: "",
    communities: [],
    nonCommunityUsers: false,
    allUsers: false,
    bannedUsers: false,
    deepLink: {
      url: '',
      label: '',
      copyright: ''
    },
    isScheduled: false,
    usersWithNoStory: false,
    usersWithDraftStory: false,
    usersWithNoRecentLogin: false,
    numberOfLoginDays: 0
  };

  it('Should create a new pushNotification: User Error', async () => {
    const payload: PushNotificationRequest = {
      title: "",
      body: "",
      sendOn: "",
      communities: [],
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
      id: ""
    };

    const expResult = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.userDoesNotExist
    }

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expResult);
    const response = await controller.pushNotification(payload);
    expect(response).toEqual(expResult);
  });

  it('Should create a new pushNotification: Validation Error', async () => {
    const payload: PushNotificationRequest = {
      title: "",
      body: "",
      sendOn: "",
      communities: [],
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
      id: ""
    };

    const validate: ValidationResponse = {
      validationResult: true,
      reason: ""
    };

    const expResult = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.userDoesNotExist
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.pushNotificationValidation.mockReturnValue(validate);
    mockResult.createError.mockReturnValue(expResult);
    const response = await controller.pushNotification(payload);
    expect(response).toEqual(expResult);
  });

  it('Should create a new pushNotification: Success', async () => {
    const payload: PushNotificationRequest = {
      title: "",
      body: "",
      sendOn: "",
      communities: [],
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
      id: ""
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: ""
    };

    const expResult = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": true
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.pushNotificationValidation.mockReturnValue(validate);
    mockPushNotificationService.createPushNotification.mockReturnValue(expResult);
    const response = await controller.pushNotification(payload);
    expect(response).toEqual(expResult);
  });

  it('Should create a new pushNotification: Exception', async () => {
    const payload: PushNotificationRequest = {
      title: "",
      body: "",
      sendOn: "",
      communities: [],
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
      id: ""
    };

    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.pushNotification(payload);
  });

  // Get Push Notification
  it('Should get pushNotification: User Error', async () => {
    const payload: ViewPNRequest = {
      communities: [],
      status: []
    };

    const expResult = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.userDoesNotExist
    }

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expResult);
    const response = await controller.getPushNotifications(payload, 1, 10, 1);
    expect(response).toEqual(expResult);
  });

  it('Should get pushNotification: Validation Error', async () => {
    const payload: ViewPNRequest = {
      communities: [],
      status: []
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: API_RESPONSE.messages.userDoesNotExist
    };

    const expResult = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.userDoesNotExist
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isValid.mockReturnValue(validate);
    mockResult.createError.mockReturnValue(expResult);
    const response = await controller.getPushNotifications(payload, 1, 10, 1);
    expect(response).toEqual(expResult);
  });

  it('Should get pushNotification: Success', async () => {
    const payload: ViewPNRequest = {
      communities: [],
      status: []
    };

    const validate1: ValidationResponse = {
      validationResult: false,
      reason: ""
    };
    const validate2: ValidationResponse = {
      validationResult: true,
      reason: ""
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.validCommunityArray.mockReturnValue(validate1);
    mockRequestValidator.isValid.mockReturnValue(validate2);
    await controller.getPushNotifications(payload, 1, 10, 1);
  });

  it('Should get pushNotification: Exception', async () => {
    const payload: ViewPNRequest = {
      communities: [],
      status: []
    };

    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.getPushNotifications(payload, 1, 10, 1);
  });

  it('Should get pn audience count: Success', async () => {
    const payload: TargetAudience = {
      communities: ["communityId"],
      bannedUsers: false,
      nonCommunityUsers: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: true,
      usersWithNoStory: false,
      numberOfLoginDays: 30,
      allUsers: false
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockPushNotificationService.getTargetAudienceCount.mockReturnValue(46);
    const response = await controller.getTargetAudienceCount(payload);
    expect(response).toEqual(46);
  });

  it('Should get pn audience count: Community Validateion Error', async () => {
    const payload: TargetAudience = {
      communities: ["communityId"],
      bannedUsers: false,
      nonCommunityUsers: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: true,
      usersWithNoStory: false,
      numberOfLoginDays: 30,
      allUsers: false
    }

    const result = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.invalidCommunityId,
      errorCode: 400
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(result)
    const response = await controller.getTargetAudienceCount(payload);
    expect(response).toEqual(result);
  });

  it('Should get pn audience count: User Validateion Error', async () => {
    const payload: TargetAudience = {
      communities: ["communityId"],
      bannedUsers: false,
      nonCommunityUsers: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: true,
      usersWithNoStory: false,
      numberOfLoginDays: 30,
      allUsers: false
    }

    const result = {
      title: API_RESPONSE.messages.badData,
      detail: API_RESPONSE.messages.userDoesNotExist,
      errorCode: 400
    };

    mockValidation.checkUserIdentity.mockReturnValue(null);
    mockResult.createError.mockReturnValue(result)
    mockPushNotificationService.getTargetAudienceCount.mockReturnValue(46);
    const response = await controller.getTargetAudienceCount(payload);
    expect(response).toEqual(result);
  });

  // Get the PN Metrix
  it('Should get pn metrix: Success', async () => {
    const result = {
      validationResult: false
    };
    mockResult.createSuccess.mockReturnValue(true);
    mockRequestValidator.validCommunityArray.mockReturnValue(result);
    mockPushNotificationService.getPNMetrix();

    await controller.getPNMetrix([]);
  });

  it('Should get pn metrix: Validation Error', async () => {
    const result = {
      validationResult: true
    };
    mockResult.createError.mockReturnValue(true);
    mockRequestValidator.validCommunityArray.mockReturnValue(result);
    mockPushNotificationService.getPNMetrix();

    await controller.getPNMetrix(["communityId"]);
  });

  it('updatePushNotification - user not found error', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(null);
    await controller.updatePushNotification(pnRequestMock);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('updatePushNotification - invalid input error', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.pushNotificationValidation.mockReturnValue({
      validationResult: true
    });
    await controller.updatePushNotification(pnRequestMock);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('updatePushNotification - success', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.pushNotificationValidation.mockReturnValue({
      validationResult: false
    });
    mockPushNotificationService.updatePushNotification.mockReturnValue({})
    await controller.updatePushNotification(pnRequestMock);
    expect(mockPushNotificationService.updatePushNotification.mock.calls.length).toBe(1);
  });

  it('removePushNotification - success', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockPushNotificationService.removePushNotification.mockReturnValue({})
    await controller.removePushNotification('id');
    expect(mockPushNotificationService.removePushNotification.mock.calls.length).toBe(1);
  });

  it('removePushNotification - user not found error', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(null);
    await controller.removePushNotification('id');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('removePushNotification - bad data', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    await controller.removePushNotification('id');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });
});
