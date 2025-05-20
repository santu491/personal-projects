import {
  API_RESPONSE,
  ValidationResponse
} from '@anthem/communityadminapi/common';
import {
  mockAdminUserService,
  mockRequestValidator,
  mockResult,
  mockUserService,
  mockValidation
} from '@anthem/communityadminapi/common/baseTest';
import {
  CreateProfileRequest,
  UpdateProfileRequest
} from 'api/adminresources/models/adminModel';
import { UsersController } from '../usersController';

describe('UserController', () => {
  let controller: UsersController;

  const mockifiedUserContext = jest
    .fn()
    .mockReturnValue(
      '{"id":"61b21e9c26dbb012b69cf67e","name":"az00001","active":"true","role":"scadvocate","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
    );
  const mockifiedInvalidUserContext = jest
    .fn()
    .mockReturnValue(
      '{"id":"61b21e9c26dbb012b69cf000","name":"az00001","active":"true","role":"scadmin","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
  );

  beforeEach(() => {
    controller = new UsersController(
      <any>mockResult,
      <any>mockUserService,
      <any>mockValidation,
      <any>mockRequestValidator,
      <any>mockAdminUserService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return reponse of ban user: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '6009711ebb91ed000704a227',
          firstName: 'RAJA',
          lastName: 'BHARATHI',
          username: '~SIT3SB973932777',
          token: null,
          email: null,
          gender: 'Male',
          genderRoles: {
            genderPronoun: 'he',
            genderPronounPossessive: 'his',
          },
          phoneNumber: null,
          deviceId: null,
          deviceType: null,
          displayName: 'raja',
          dateOfBirth: null,
          userLocation: null,
          userGeoLocation: null,
          age: 51,
          profilePicture:
            'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6009711ebb91ed000704a227',
          myCommunities: [
            '5f07537bc12e0c22d00f5d21',
            '5f22db56a374bc4e80d80a9b',
            '5f0753b7c12e0c22d00f5d22',
            '607e7c99d0a2b533bb2ae3d2',
          ],
          myFilters: null,
          active: false,
          proxyId: null,
          hasAgreedToTerms: false,
          personId: '351771530',
        },
      },
    };

    mockValidation.isHex.mockReturnValue(true);
    mockUserService.deleteUser.mockReturnValue(expRes);
    const data = await controller.banUser('6009711ebb91ed000704a227');
    expect(data).toEqual(expRes);
  });

  it('Should return reponse of ban user: Failure', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidUserIdDetail,
          },
        ],
      },
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.banUser('6009711ebb91ed00070');
    expect(data).toEqual(expRes);
  });

  it('Should return reponse of ban user: Exception', async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockUserService.deleteUser.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.banUser('6009711ebb91ed00070');
  });

  /* GetProfile */
  it('Should return the admin profile: Success', async () => {
    const expected = {
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
          updatedAt: '2022-01-24T10:21:37.517Z',
          aboutMe: 'Very creative person.',
          interests: 'Publish posts.',
          location: 'Texas',
          id: '61b21e9c26dbb012b69cf67e',
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockUserService.getProfile.mockReturnValue(expected);
    const response = await controller.getProfile();
    expect(response).toEqual(expected);
  });

  it('Should return the admin profile: Failure', async () => {
    const expected = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: 'Bad Data',
          detail: 'User with the ID does not exists',
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(
      mockifiedInvalidUserContext
    );
    mockUserService.getProfile.mockReturnValue(expected);
    const response = await controller.getProfile();
    expect(response).toEqual(expected);
  });

  it('Should return the admin profile: Exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(null);
    mockUserService.getProfile.mockImplementation(() => {
      throw new Error();
    });
    await controller.getProfile();
  });

  /* getAllProfile */
  it('Should return all the admin usres: Success', async () => {
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
    const validate: ValidationResponse = {
      validationResult: true,
      reason: '',
    };
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isValid.mockReturnValue(validate);
    mockUserService.getAllProfile.mockReturnValue(expected);
    const response = await controller.getAllProfile(1, 10, 1);
    expect(response).toEqual(expected);
  });

  it('Should return all the admin usres: Success', async () => {
    const expected = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.sortInvalid,
          },
        ],
      },
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: API_RESPONSE.messages.sortInvalid,
    };
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isValid.mockReturnValue(validate);
    mockUserService.getAllProfile.mockReturnValue(expected);
    const response = await controller.getAllProfile(1, 10, -5);
    expect(response).toEqual(expected);
  });

  it('Should return all the admin usres: Exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockUserService.getAllProfile.mockImplementation(() => {
      throw new Error();
    });
    await controller.getAllProfile(1, 10, 1);
  });

  /* updateProfile */
  it('Should return success after the updates: Success', async () => {
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

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockUserService.updateAdminProfile.mockReturnValue(expected);
    const response = await controller.updateProfile(payload);
    expect(response).toEqual(response);
  });

  it('Should return success after the updates: Exception', async () => {
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

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockUserService.updateAdminProfile.mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await controller.updateProfile(payload);
    expect(response).toEqual(response);
  });

  /* createAdminProfile */
  it('Should add new admin user: Success', async () => {
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

    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          username: 'AH00000',
          createdAt: '2022-02-07T18:58:27.616Z',
          updatedAt: '2022-02-07T18:58:27.616Z',
          role: 'scadmin',
          _id: '62016bd3256b484a00ce0376',
        },
      },
    };

    const validate: ValidationResponse = {
      validationResult: true,
      reason: '',
    };
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.validateCreateAdminUser.mockReturnValue(validate);
    mockUserService.createAdminProfile.mockReturnValue(expected);
    const response = await controller.createProfile(payload);
    expect(response).toEqual(expected);
  });

  it('Should add new admin user: Failure', async () => {
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

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockUserService.createAdminProfile.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.createProfile(payload);
  });

  /* Opt In Minor */
  it('Should return reponse of optIn user: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '6009711ebb91ed000704a227',
          firstName: 'RAJA',
          lastName: 'BHARATHI',
          username: '~SIT3SB973932777',
          token: null,
          email: null,
          gender: 'Male',
          genderRoles: {
            genderPronoun: 'he',
            genderPronounPossessive: 'his',
          },
          phoneNumber: null,
          deviceId: null,
          deviceType: null,
          displayName: 'raja',
          dateOfBirth: null,
          userLocation: null,
          userGeoLocation: null,
          age: 51,
          profilePicture:
            'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6009711ebb91ed000704a227',
          myCommunities: [
            '5f07537bc12e0c22d00f5d21',
            '5f22db56a374bc4e80d80a9b',
            '5f0753b7c12e0c22d00f5d22',
            '607e7c99d0a2b533bb2ae3d2',
          ],
          myFilters: null,
          active: false,
          proxyId: null,
          hasAgreedToTerms: false,
          personId: '351771530',
          optInMinor: true,
        },
      },
    };

    mockValidation.isHex.mockReturnValue(true);
    mockUserService.updateOptInMinor.mockReturnValue(expRes);
    const data = await controller.updateOptInMinor(
      '6009711ebb91ed000704a227',
      true
    );
    expect(data).toEqual(expRes);
  });

  it('Should return reponse of optIn user: Failure', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidUserIdDetail,
          },
        ],
      },
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.updateOptInMinor('6009711ebb91ed00070', true);
    expect(data).toEqual(expRes);
  });

  it('Should return reponse of optIn user: Exception', async () => {
    mockValidation.isHex.mockReturnValue(true);
    mockUserService.updateOptInMinor.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.updateOptInMinor('6009711ebb91ed00070', true);
  });

  /* Get User Profile */
  it('Should return the user profile: Success', async () => {
    const expected = {
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
          updatedAt: '2022-01-24T10:21:37.517Z',
          aboutMe: 'Very creative person.',
          interests: 'Publish posts.',
          location: 'Texas',
          id: '61b21e9c26dbb012b69cf67e',
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockUserService.getUserProfile.mockReturnValue(expected);
    const response = await controller.getUserProfile('~sit3gajones');
    expect(response).toEqual(expected);
  });

  it('Should return the user profile: Failure', async () => {
    const expected = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            detail: 'User ID is invalid',
            errorCode: 400,
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            title: 'Incorrect id',
          },
        ],
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(
      mockifiedInvalidUserContext
    );
    mockUserService.getUserProfile.mockReturnValue(expected);
    const response = await controller.getUserProfile('');
    expect(response).toEqual(expected);
  });

  it('Should return the user profile: Exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(null);
    mockUserService.getUserProfile.mockImplementation(() => {
      throw new Error();
    });
    await controller.getUserProfile('');
  });

  it('Get Export Data - success', async () => {
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

    mockValidation.isHex.mockReturnValue(true);
    mockUserService.getExportData.mockReturnValue(expRes);

    const data = await controller.exportProfile("60e2e7277c37b43a668a32f2");
    expect(data).toEqual(expRes);
  });

  it('Get Export Data - fail', async () => {
    const expRes = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "errors": [
          {
            "id": "e8a95902-856c-f72e-93d6-47ff6dc7e0e0",
            "errorCode": 400,
            "title": "Bad data",
            "detail": "User with the ID does not exists"
          }]
      }
    };

    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);

    const data = await controller.exportProfile("60e2e7277c37b43a668a32f2");
    expect(data).toEqual(expRes);
  });
});
