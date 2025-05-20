import {
  API_RESPONSE,
  associateInfo,
  collections,
  mongoDbTables
} from '@anthem/communityadminapi/common';
import {
  mockAssociateGateway,
  mockMongo,
  mockResult,
  mockSecureJwtToken,
  mockStoryService,
  mockUserHelperService
} from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import {
  CreateProfileRequest,
  UpdateProfileRequest
} from 'api/adminresources/models/adminModel';
import { LoginModel } from 'api/adminresources/models/adminUserModel';
import { IAssociateAuthenticateRequest } from 'api/adminresources/models/associateModel';
import { AdminRoles, AuthorizedAdminUser } from 'api/adminresources/models/userModel';
import { ObjectID } from 'mongodb';
import { AdminUserService } from '../adminUserService';
import { UserService } from '../userService';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockStoryService,
      <any>mockAssociateGateway,
      <any>mockUserHelperService,
      <any>mockSecureJwtToken,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should ban the user: Success', async () => {
    const adminValue = {
      id: '6009711ebb91ed000704a227',
      firstName: 'RAJA',
      lastName: 'BHARATHI',
      username: '~SIT3SB973932777',
      active: true,
      proxyId: null,
      hasAgreedToTerms: false,
      personId: '351771530',
    };

    mockMongo.readByID.mockReturnValue(adminValue);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockStoryService.getStoryByUserId.mockReturnValue({
      data: {
        value: []
      }
    });
    await service.deleteUser('6009711ebb91ed000704a227');
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('Should ban the user: Failure', async () => {
    mockMongo.readByID.mockReturnValue(null);
    await service.deleteUser('6009711ebb91ed000704a227');
    expect(mockResult.createError.mock.calls.length).toEqual(1);
    expect(mockResult.errorInfo['detail']).toBe(API_RESPONSE.messages.userDoesNotExist)
  });

  it('Should return admin activity for user', async () => {
    const resp = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: '61b21e9c26dbb012b69cf67e',
          list: [
            {
              authorId: '6165533770868b5286ddf7fc',
              entityId: '61b75236cf7b364deb198355',
              entityType: 'post',
              isRead: false,
              title: 'Member has reacted to your post: Eat less 100',
              createdAt: '2021-12-16T12:57:33.190Z',
              updatedAt: '2021-12-16T12:57:33.190Z',
            },
          ],
          id: '61bb37bd045ef1494fa43fe1',
        },
      },
    };
    mockMongo.readByValue.mockReturnValue(resp);
    const resData = await mockMongo.readByValue(collections.ADMINACTIVITY, {
      [mongoDbTables.activity.userId]: '61b21e9c26dbb012b69cf67e',
    });
    expect(resData).toEqual(resp);
  });

  it('Should mark activity as read', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true,
        },
      },
    };
    const userId = '61b21e9c26dbb012b69cf67e';
    const activityId = '61c10c9f46caaa5c413fbf61';
    const query = {
      [mongoDbTables.adminActivity.userId]: userId,
      [mongoDbTables.adminActivity.activityId]: new ObjectID(activityId),
    };
    const updateSetValue = {
      $set: {
        [mongoDbTables.adminActivity.activityIsRead]: true,
        [mongoDbTables.adminActivity.activityUpdatedAt]: new Date(),
      },
    };
    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(
      collections.ADMINACTIVITY,
      query,
      updateSetValue
    );
    expect(resData).toEqual(expRes);
  });

  it('Should update the admin user profile', async () => {
    const response = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          username: 'az00001',
          role: 'scadmin',
          firstName: 'Admin',
          lastName: 'SydCom',
          displayName: 'Sydney Community',
          displayTitle: '',
          profileImage: '',
          createdAt: '2021-12-09T15:19:56.426Z',
          updatedAt: '2022-01-24T09:09:09.741Z',
          aboutMe: 'Very boaring person.',
          interests: 'Publish posts.',
          location: 'Africa',
          id: '61b21e9c26dbb012b69cf67e',
        },
      },
    };

    const adminUser = {
      username: 'az00001',
      role: 'scadmin',
      firstName: 'Admin',
      lastName: 'SydCom',
      displayName: 'Sydney Community',
      displayTitle: '',
      profileImage: '',
      createdAt: '2021-12-09T15:19:56.426Z',
      updatedAt: '2022-01-24T09:09:09.741Z',
      aboutMe: 'Very boaring person.',
      interests: 'Publish posts.',
      location: 'Africa',
      password: 'password',
      id: '61b21e9c26dbb012b69cf67e',
    };
    const payload: UpdateProfileRequest = {
      lastName: 'SydCom',
      displayName: 'Sydney Community',
      aboutMe: 'Very creative person.',
      interests: 'Publish posts.',
      location: 'Texas',
      updatedAt: new Date(),
      id: '61b21e9c26dbb012b69cf67e',
      role: 'scadmin',
      displayTitle: 'Sydney Community Admin',
      firstName: '',
      communities: ['61b21e9c26dbb012b69cf67e']
    };
    const adminUserId = '61b21e9c26dbb012b69cf67e';

    mockMongo.updateByQuery.mockReturnValue(1);
    mockMongo.readByID.mockReturnValue(adminUser);
    mockResult.createSuccess.mockReturnValueOnce(response);

    await service.updateAdminProfile(payload, adminUserId);
  });

  /* GetAllProfile */
  it('Should return the admin users: Success', async () => {
    const adminUser = {
      username: 'az00001',
      role: 'scadmin',
      firstName: 'Admin',
      lastName: 'SydCom',
      displayName: 'Sydney Community',
      displayTitle: '',
      profileImage: '',
      createdAt: '2021-12-09T15:19:56.426Z',
      updatedAt: '2022-01-24T09:09:09.741Z',
      aboutMe: 'Very boaring person.',
      interests: 'Publish posts.',
      location: 'Africa',
      password: 'password',
      id: '61b21e9c26dbb012b69cf67e',
    };

    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            username: 'ah00001',
            role: 'sysadmin',
            firstName: '',
            lastName: '',
            displayName: '',
            displayTitle: '',
            profileImage: '',
            createdAt: '2021-12-09T15:19:56.426Z',
            updatedAt: '2021-12-09T15:19:56.426Z',
            aboutMe: 'Very creative person.',
            interests: 'Publish posts.',
            location: 'Texas',
            id: '61b21e9c26dbb012b69cf67d',
          },
          {
            username: 'az00002',
            role: 'scadvocate',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            createdAt: '2021-12-09T15:19:56.426Z',
            updatedAt: '2021-12-09T15:19:56.426Z',
            aboutMe: 'Very creative person.',
            interests: 'Publish posts.',
            location: 'Texas',
            id: '61b21e9c26dbb012b69cf67f',
          },
        ],
      },
    };

    mockMongo.readAllByValue.mockReturnValue(expected.data.value);
    const getAdminImage = jest.spyOn(AdminUserService.prototype, 'getAdminImage')
      getAdminImage.mockImplementation(() => {
        return Promise.resolve('image');
    })
    await service.getAllProfile(1, 10, 1, adminUser);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('Should return the admin users: Not allowed', async () => {
    const adminUser = {
      active: 'true',
      firstName: 'Raven',
      id: '61b21e9c26dbb012b69cf67f',
      jti: 'b64085014d9d188f899b0a319735e258bfa3d57570377924349a110d9f093b98',
      lastName: 'P',
      name: 'az00002',
      role: 'scadvocate',
      sub: 'az00002',
    };

    const expected = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'bea589cc-ee11-8041-f32b-f58bc36b6b79',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.notAllowedTitle,
            detail: API_RESPONSE.messages.notAllowedDetails,
          },
        ],
      },
    };

    mockMongo.readAllByValue.mockReturnValue(expected);
    mockResult.createError.mockReturnValueOnce(expected);
    await service.getAllProfile(1, 10, 1, adminUser);
  });

  /* updateAdminProfile */
  it('Should return the updated admin user: Success', async () => {
    const adminUser = {
      username: 'az00001',
      role: 'scadmin',
      firstName: 'Admin',
      lastName: 'SydCom',
      displayName: 'Sydney Community',
      displayTitle: '',
      profileImage: '',
      createdAt: '2021-12-09T15:19:56.426Z',
      updatedAt: '2022-01-24T09:09:09.741Z',
      aboutMe: 'Very boaring person.',
      interests: 'Publish posts.',
      location: 'Africa',
      password: 'password',
      id: '61b21e9c26dbb012b69cf67e',
    };

    const payload: UpdateProfileRequest = {
      role: 'sysadmin',
      firstName: '',
      lastName: '',
      displayName: 'System Admin',
      displayTitle: 'Dev Admin',
      aboutMe: 'Am a developer Admin',
      interests: 'Fix all the tech issues and help you.',
      location: 'Cloud',
      id: '61b21e9c26dbb012b69cf67d',
      updatedAt: new Date(),
      communities: [],
    };
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          username: 'ah00001',
          role: 'sysadmin',
          firstName: '',
          lastName: '',
          displayName: 'System Admin',
          displayTitle: 'Dev Admin',
          profileImage: '',
          createdAt: '2021-12-09T15:19:56.426Z',
          updatedAt: '2021-12-09T15:19:56.426Z',
          aboutMe: 'Am a developer Admin',
          interests: 'Fix all the tech issues and help you.',
          location: 'Cloud',
          id: '61b21e9c26dbb012b69cf67d',
        },
      },
    };

    mockMongo.updateByQuery.mockReturnValue(1);
    mockMongo.readByID.mockReturnValue(expected);
    mockResult.createSuccess.mockReturnValueOnce(expected);
    await service.updateAdminProfile(payload, adminUser);

  });

  it('Should return the updated admin user: Not allowed', async () => {
    const adminUser = {
      active: 'true',
      firstName: 'Raven',
      id: '61b21e9c26dbb012b69cf67f',
      jti: 'b64085014d9d188f899b0a319735e258bfa3d57570377924349a110d9f093b98',
      lastName: 'P',
      name: 'az00002',
      role: 'scadvocate',
      sub: 'az00002',
    };

    const payload: UpdateProfileRequest = {
      role: 'sysadmin',
      firstName: '',
      lastName: '',
      displayName: 'System Admin',
      displayTitle: 'Dev Admin',
      aboutMe: 'Am a developer Admin',
      interests: 'Fix all the tech issues and help you.',
      location: 'Cloud',
      id: '61b21e9c26dbb012b69cf67d',
      updatedAt: new Date(),
      communities: [],
    };

    const expected = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'bea589cc-ee11-8041-f32b-f58bc36b6b79',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.notAllowedTitle,
            detail: API_RESPONSE.messages.notAllowedDetails,
          },
        ],
      },
    };

    mockResult.createError.mockReturnValueOnce(expected);
    await service.updateAdminProfile(payload, adminUser);

  });

  it('Should return the updated admin user: Exception', async () => {
    const adminUser = {
      username: 'az00001',
      role: 'scadmin',
      firstName: 'Admin',
      lastName: 'SydCom',
      displayName: 'Sydney Community',
      displayTitle: '',
      profileImage: '',
      createdAt: '2021-12-09T15:19:56.426Z',
      updatedAt: '2022-01-24T09:09:09.741Z',
      aboutMe: 'Very boaring person.',
      interests: 'Publish posts.',
      location: 'Africa',
      password: 'password',
      id: '61b21e9c26dbb012b69cf67e',
    };

    const payload: UpdateProfileRequest = {
      role: 'sysadmin',
      firstName: '',
      lastName: '',
      displayName: 'System Admin',
      displayTitle: 'Dev Admin',
      aboutMe: 'Am a developer Admin',
      interests: 'Fix all the tech issues and help you.',
      location: 'Cloud',
      id: '61b21e9c26dbb012b69cf67d',
      updatedAt: new Date(),
      communities: [],
    };
    mockMongo.updateByQuery.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.updateAdminProfile(payload, adminUser);
  });

  /* createAdminProfile */
  it('Should return the newly created admin user: Success', async () => {
    const expected = {
      data: {
        isException: false,
        isSuccess: true,
        value: {
          username: 'AH0000X',
          role: 'scadvocate',
        },
      },
    };

    const payload: CreateProfileRequest = {
      username: 'AH0000',
      role: 'scadvocate',
      communities: [],
      isPersona: false,
      firstName: '',
      lastName: '',
      displayName: '',
      aboutMe: '',
      interests: '',
      location: ''
    };

    const adminUser = {
      username: 'AH00000',
      role: 'scadmin',
    };

    mockMongo.readByValue.mockReturnValueOnce(false);
    mockUserHelperService.getNewAdminProfile.mockImplementationOnce(() => {
      return {
        status: 200,
        user: [
          {
            firstName: 'Ananya',
            lastName: 'K',
            userAccountStatus: {
              disabled: false,
              locked: false,
            },
            memberOf: [],
          },
        ],
      };
    });
    mockMongo.insertValue.mockReturnValueOnce(true);
    mockResult.createSuccess.mockReturnValueOnce(expected);
    await service.createAdminProfile(payload, adminUser);
  });

  it('Should return the newly created admin user: Validation Error 1', async () => {
    const expected = {
      data: {
        isException: true,
        isSuccess: false,
        value: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.associateDetailError,
        },
      },
    };

    const payload: CreateProfileRequest = {
      username: 'AH0000',
      role: 'scadvocate',
      communities: [],
      isPersona: false,
      firstName: '',
      lastName: '',
      displayName: '',
      aboutMe: '',
      interests: '',
      location: ''
    };

    const adminUser = {
      username: 'AH00000',
      role: 'scadmin',
    };

    const token = {
      status: associateInfo.STATUS,
      access_token: 'token',
    };

    mockMongo.readByValue.mockReturnValue(false);
    mockAssociateGateway.onPremToken.mockReturnValueOnce(token);
    mockUserHelperService.getNewAdminProfile.mockImplementationOnce(() => {
      return {
        status: 404,
      };
    });

    mockResult.createError.mockReturnValueOnce(expected);
    await service.createAdminProfile(payload, adminUser);
  });

  it('Should return the newly created admin user: Validation Error 2', async () => {
    const expected = {
      data: {
        isException: true,
        isSuccess: false,
        value: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.associateAccountDisabled,
          errorCode: API_RESPONSE.statusCodes[476],
        },
      },
    };

    const payload: CreateProfileRequest = {
      username: 'AH0000',
      role: 'scadvocate',
      communities: [],
      isPersona: false,
      firstName: '',
      lastName: '',
      displayName: '',
      aboutMe: '',
      interests: '',
      location: ''
    };

    const adminUser = {
      username: 'AH00000',
      role: 'scadmin',
    };

    const token = {
      status: associateInfo.STATUS,
      access_token: 'token',
    };

    mockMongo.readByValue.mockReturnValue(false);
    mockAssociateGateway.onPremToken.mockReturnValueOnce(token);
    mockUserHelperService.getNewAdminProfile.mockImplementationOnce(() => {
      return {
        status: 200,
        user: [
          {
            userAccountStatus: {
              disabled: true,
              locked: false,
            },
          },
        ],
      };
    });

    mockResult.createError.mockReturnValueOnce(expected);
    await service.createAdminProfile(payload, adminUser);
  });

  it('Should return the newly created admin user: Validation Error 3', async () => {
    const expected = {
      data: {
        isException: true,
        isSuccess: false,
        value: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.associateAccountDisabled,
          errorCode: API_RESPONSE.statusCodes[476],
        },
      },
    };

    const payload: CreateProfileRequest = {
      username: 'AH0000',
      role: 'scadvocate',
      communities: [],
      isPersona: false,
      firstName: '',
      lastName: '',
      displayName: '',
      aboutMe: '',
      interests: '',
      location: ''
    };

    const adminUser = {
      username: 'AH00000',
      role: 'scadmin',
    };

    const token = {
      status: associateInfo.STATUS,
      access_token: 'token',
    };

    mockMongo.readByValue.mockReturnValue(false);
    mockAssociateGateway.onPremToken.mockReturnValueOnce(token);
    mockUserHelperService.getNewAdminProfile.mockImplementationOnce(() => {
      return {
        status: 200,
        user: [
          {
            userAccountStatus: {
              disabled: false,
              locked: true,
            },
          },
        ],
      };
    });

    mockResult.createError.mockReturnValueOnce(expected);
    await service.createAdminProfile(payload, adminUser);
  });

  it('Should return the newly created admin user: Not allowed', async () => {
    const expected = {
      errorCode: 403,
      title: 'Not allowed',
      details: 'Not allowed to add new admin details',
    };

    const payload: CreateProfileRequest = {
      username: 'AH00000',
      role: 'scadmin',
      communities: [],
      isPersona: false,
      firstName: '',
      lastName: '',
      displayName: '',
      aboutMe: '',
      interests: '',
      location: ''
    };

    const adminUser = {
      username: 'Ah00000',
      role: 'sysadmin',
      id: '61b21e9c26dbb012b69cf67e',
    };

    mockResult.createError.mockReturnValueOnce(expected);
    await service.createAdminProfile(payload, adminUser);
  });

  it('Should return the newly created admin user: Failed with duplicate user', async () => {
    const expected = {
      errorCode: 400,
      title: 'Bad Data',
      details: 'User with username already exists',
    };

    const payload: CreateProfileRequest = {
      username: 'AH0000',
      role: 'scadmin',
      communities: [],
      isPersona: false,
      firstName: '',
      lastName: '',
      displayName: '',
      aboutMe: '',
      interests: '',
      location: ''
    };

    const adminUser = {
      username: 'Ah00000',
      role: 'scadmin',
      id: '61b21e9c26dbb012b69cf67e',
    };

    mockMongo.readByValue.mockReturnValue(true);
    mockResult.createError.mockReturnValueOnce(expected);
    await service.createAdminProfile(payload, adminUser);
  });

  /* adminAuth */
  it('Should authenticate the admin user: Token failure', async () => {
    const payload: LoginModel = {
      username: 'AH0000',
      password: 'xxxx',
    };

    const adminUser: AuthorizedAdminUser = {
      username: 'Ah00000',
      role: 'scadmin',
      id: '61b21e9c26dbb012b69cf67e',
      password: '',
      token: '',
      firstName: '',
      lastName: '',
      displayName: '',
      profileImage: '',
      displayTitle: '',
      rolePermissions: new AdminRoles
    };

    const errorResponse = {
      status: 'failed',
    };

    mockAssociateGateway.onPremToken.mockReturnValueOnce(errorResponse);
    service.adminAuth(payload, adminUser);
  });

  it('Should authenticate the admin user: failure', async () => {
    const payload: LoginModel = {
      username: 'AH0000',
      password: 'xxxx',
    };

    const adminUser: AuthorizedAdminUser = {
      username: 'Ah00000',
      role: 'scadmin',
      id: '61b21e9c26dbb012b69cf67e',
      password: '',
      token: '',
      firstName: '',
      lastName: '',
      displayName: '',
      profileImage: '',
      displayTitle: '',
      rolePermissions: new AdminRoles
    };

    const response = {
      status: associateInfo.STATUS,
      access_token: 'token',
    };

    const auth: IAssociateAuthenticateRequest = {
      requestContext: {
        application: associateInfo.APPLICATION_NAME,
        requestId: 'Guid',
        username: associateInfo.APPLICATION,
      },
      username: 'Ah0000',
      password: 'xxxx',
      repositoryEnum: associateInfo.REPOSITORY_ENUM,
      userRoleEnum: associateInfo.USER_ROLE_ASSOCIATE,
    };
    const authRes = {
      authenticated: false,
    };

    const resp = {
      title: API_RESPONSE.messages.incorrectPasswordTitle,
      detail: API_RESPONSE.messages.incorrectPasswordDetail,
      errorCode: API_RESPONSE.statusCodes[403],
    };
    mockAssociateGateway.onPremToken.mockReturnValueOnce(response);
    mockUserHelperService.generateUserAuthRequest.mockImplementationOnce(() => {
      return auth;
    });

    mockAssociateGateway.webUserAuthenticate.mockReturnValueOnce(authRes);
    mockResult.createError.mockReturnValueOnce(resp);

    await service.adminAuth(payload, adminUser);
  });

  it('Should authenticate the admin user: Success', async () => {
    const payload: LoginModel = {
      username: 'AH0000',
      password: 'xxxx',
    };

    const adminUser: AuthorizedAdminUser = {
      username: 'Ah00000',
      role: 'scadmin',
      id: '61b21e9c26dbb012b69cf67e',
      password: '',
      token: '',
      firstName: '',
      lastName: '',
      displayName: '',
      profileImage: '',
      displayTitle: '',
      rolePermissions: new AdminRoles
    };

    const response = {
      status: associateInfo.STATUS,
      access_token: 'token',
    };

    const auth: IAssociateAuthenticateRequest = {
      requestContext: {
        application: associateInfo.APPLICATION_NAME,
        requestId: 'Guid',
        username: associateInfo.APPLICATION,
      },
      username: 'Ah0000',
      password: 'xxxx',
      repositoryEnum: associateInfo.REPOSITORY_ENUM,
      userRoleEnum: associateInfo.USER_ROLE_ASSOCIATE,
    };
    const authRes = {
      authenticated: true,
    };

    const resp = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          role: 'scadvocate',
          username: 'AH0000X',
        },
      },
    };

    mockAssociateGateway.onPremToken.mockReturnValue(response);
    mockUserHelperService.generateUserAuthRequest.mockImplementation(() => {
      return auth;
    });
    mockAssociateGateway.webUserAuthenticate.mockReturnValue(authRes);
    mockUserHelperService.generateToken.mockImplementation(() => {
      return 'token';
    });

    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(resp);

    await service.adminAuth(payload, adminUser);
  });

  it('Should update optIn minor for the user: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '6009711ebb91ed000704a227',
          firstName: 'RAJA',
          lastName: 'BHARATHI',
          username: '~SIT3SB973932777',
          active: false,
          proxyId: null,
          hasAgreedToTerms: false,
          personId: '351771530',
        },
      },
    };

    const adminValue = {
      id: '6009711ebb91ed000704a227',
      firstName: 'RAJA',
      lastName: 'BHARATHI',
      username: '~SIT3SB973932777',
      active: true,
      proxyId: null,
      hasAgreedToTerms: false,
      personId: '351771530',
    };

    mockMongo.readByID.mockReturnValue(adminValue);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    await service.updateOptInMinor('6009711ebb91ed000704a227', true);
  });

  it('Should update optIn minor for the user: failure', async () => {
    const expected = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.associateDetailError,
        },
      },
    };

    mockMongo.readByID.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expected);
    const result = await service.updateOptInMinor('', true);
    expect(result).toEqual(expected);
  });

  it('Get Export Data - Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          firstName: "JACK",
            lastName: "JONES",
            displayName: "Jack",
            profileImageExists: false,
            stories: [
                {
                    communityId: "60e2e7277c37b43a668a32f2",
                    published: false,
                    id: "6172ab551680c90024ce968e",
                    communityTitle: "Parenting"
                },
                {
                    communityId: "6214e8959aa982c0d09b40f5",
                    published: false,
                    id: "61a5fbee31a4e50024af2e7e",
                    communityTitle: "Cancer"
                },
                {
                    communityId: "60a358bc9c336e882b19bbf0",
                    published: false,
                    id: "61a4baaa247a0d002388c6f3",
                    communityTitle: "Weight Management"
                }
            ]
        },
      },
    };

    mockMongo.readByID.mockReturnValue({
      firstName: "JACK",
      lastName: "JONES",
      displayName: "Jack",
      id: "60a358bc9c336e882b19cbf0"
    });
    mockMongo.getDocumentCount.mockReturnValue(0);
    mockMongo.readAllByValue.mockReturnValueOnce([
      {
          communityId: "60e2e7277c37b43a668a32f2",
          published: false,
          id: "6172ab551680c90024ce968e"
      },
      {
          communityId: "6214e8959aa982c0d09b40f5",
          published: false,
          id: "61a5fbee31a4e50024af2e7e"
      },
      {
          communityId: "60a358bc9c336e882b19bbf0",
          published: false,
          id: "61a4baaa247a0d002388c6f3"
      }
    ]).mockReturnValue([
      {
          id: "60e2e7277c37b43a668a32f2",
          title: "Parenting"
      },
      {
          id: "6214e8959aa982c0d09b40f5",
          title: "Cancer"
      },
      {
          id: "60a358bc9c336e882b19bbf0",
          title: "Weight Management"
      }
    ]);
    mockResult.createSuccess.mockReturnValue(expRes);
    await service.getExportData("60a358bc9c336e882b19cbf0");
  });
});
