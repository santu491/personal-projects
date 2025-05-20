import { associateInfo } from "@anthem/communityadminapi/common";
import { mockAssociateGateway, mockMongo, mockResult } from "@anthem/communityadminapi/common/baseTest";
import { mockSecureJwtToken } from "@anthem/communityadminapi/filters/mocks/mockSecureJwtToken";
import { APP } from "@anthem/communityadminapi/utils";
import { CreateProfileRequest } from "api/adminresources/models/adminModel";
import { LoginModel } from "api/adminresources/models/adminUserModel";
import { IAssociateAuthenticateRequest, IAssociateSearchRequest, IAssociateSearchResponse, IUser } from "api/adminresources/models/associateModel";
import { Community } from "api/adminresources/models/communitiesModel";
import { AdminUser } from "api/adminresources/models/userModel";
import { UserHelperService } from "../userHelper";

describe('UserHelperService', () => {
  let userHelper: UserHelperService;

  beforeEach(() => {
    userHelper = new UserHelperService(<any>mockResult, <any>mockMongo, <any>mockAssociateGateway, <any>mockSecureJwtToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* generateUserRequestObject */
  it('Should get the generated user request object', async () => {
    const expRes: IAssociateSearchRequest = {
      searchUserFilter: {
        username: 'test',
        repositoryEnum: [associateInfo.REPOSITORY_ENUM],
        userRoleEnum: [associateInfo.USER_ROLE_ASSOCIATE, associateInfo.USER_ROLE_NON_ASSOCIATE]
      },
      requestContext: {
        application: associateInfo.APPLICATION,
        requestId: 'guid',
        username: associateInfo.APPLICATION
      }
    };

    mockResult.createGuid.mockReturnValue('guid');
    const result = userHelper.generateUserRequestObject('test');
    expect(result).toEqual(expRes);

  });

  /* generateUserAuthRequest */
  it('Should return the generated User Auth Request', async () => {
    const payload: LoginModel = {
      username: "username",
      password: "password"
    };

    const expectResp: IAssociateAuthenticateRequest = {
      requestContext: {
        application: associateInfo.APPLICATION_NAME,
        requestId: 'test',
        username: associateInfo.APPLICATION
      },
      username: 'username',
      password: 'password',
      repositoryEnum: associateInfo.REPOSITORY_ENUM,
      userRoleEnum: 'userRole'
    };

    mockResult.createGuid.mockReturnValue('test');
    const result = await userHelper.generateUserAuthRequest(payload, 'userRole');
    expect(result).toEqual(expectResp);
  })

  /* handleErrorResponse */
  it('Should return the Error Response of associate SOA API: User Not found', async () => {
    const userData: IAssociateSearchResponse = {
      status: 404,
      responseContext: {
        confirmationNumber: 'string'
      },
      user: []
    };

    const result = userHelper.handleErrorResponse(userData);
    expect(true).toEqual(result);
  });

  it('Should return the Error Response of associate SOA API: User disbaled', async () => {
    const userData: IAssociateSearchResponse = {
      status: 200,
      responseContext: {
        confirmationNumber: 'string'
      },
      user: [
        {
          emailAddress: 'string',
          username: 'username',
          iamGuid: 'test',
          repositoryEnum: 'enum',
          userRoleEnum: 'ASSCOIATE',
          firstName: 'firstName',
          lastName: 'lastName',
          dn: 'dn',
          memberOf: ['test'],
          userAccountStatus: {
            disabled: true,
            locked: false,
            forceChangePassword: false,
            badSecretAnsCount: 1,
            badPasswordCount: 2,
            isUserNameValid: false,
            isSecretQuestionValid: false
          }
        }
      ]
    };

    const result = userHelper.handleErrorResponse(userData);
    expect(true).toEqual(result);
  });

  it('Should return the Error Response of associate SOA API: User locked', async () => {
    const userData: IAssociateSearchResponse = {
      status: 200,
      responseContext: {
        confirmationNumber: 'string'
      },
      user: [
        {
          emailAddress: 'string',
          username: 'username',
          iamGuid: 'test',
          repositoryEnum: 'enum',
          userRoleEnum: 'ASSCOIATE',
          firstName: 'firstName',
          lastName: 'lastName',
          dn: 'dn',
          memberOf: ['test'],
          userAccountStatus: {
            disabled: false,
            locked: true,
            forceChangePassword: false,
            badSecretAnsCount: 1,
            badPasswordCount: 2,
            isUserNameValid: false,
            isSecretQuestionValid: false
          }
        }
      ]
    };

    const result = userHelper.handleErrorResponse(userData);
    expect(true).toEqual(result);
  });

  /* createAdminObject */
  it('Should build admin user object', async () => {
    const payload: CreateProfileRequest = {
      username: 'username',
      role: "scadvocate",
      communities: ["communityId"],
      isPersona: false,
      firstName: "First Name",
      lastName: "",
      displayName: "Display Name",
      aboutMe: "",
      interests: "",
      location: ""
    };

    const user: IUser = {
      emailAddress: 'string',
      username: 'username',
      iamGuid: 'test',
      repositoryEnum: 'enum',
      userRoleEnum: 'ASSCOIATE',
      firstName: 'firstName',
      lastName: 'lastName',
      dn: 'dn',
      memberOf: ['test'],
      userAccountStatus: {
        disabled: false,
        locked: true,
        forceChangePassword: false,
        badSecretAnsCount: 1,
        badPasswordCount: 2,
        isUserNameValid: false,
        isSecretQuestionValid: false
      }
    };

    userHelper.createAdminObject(payload, user);
  });

  /* generateWebUserRequest */
  it('Should generate the WebUserRequest', async () => {
    const response = {
      token: 'token',
      apiKey: APP.config.restApi.onPrem.apiKey,
      header: APP.config.restApi.webUserHeader,
    };

    const resData = userHelper.generateWebUserRequest('token');
    expect(resData).toEqual(response);
  });

  /* generateToken */
  it('Should get the admin user token', async () => {
    const payload: AdminUser = {
      id: "",
      username: "",
      firstName: "",
      lastName: "",
      displayName: "",
      profileImage: "",
      role: "",
      displayTitle: ""
    };

    const expRes = 'token';

    mockSecureJwtToken.generateToken.mockReturnValue(expRes);
    await userHelper.generateToken(payload);
  });

  it('Fetch Story Count Details - Success', async () => {
    const storyData = [
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
        published: true,
        id: "61a4baaa247a0d002388c6f3"
      }
    ];
    const communititesData: Community[] = [
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Diabetes",
        "category": "Diabetes",
        "categoryId": "607e7c92d0a2b533bb2ae3d1",
        "color": "#286CE2",
        "type": "clinical",
        "parent": "Diabetes",
        "createdDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedBy": "2022-01-24T09:01:01.395Z",
        "displayName": {
          "en": "Diabetes",
          "es": "Diabetes"
        },
        "id": "607e7c99d0a2b533bb2ae3d2",
        "image": "",
        isNew: false,
        active: true
      },
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Weight Management",
        "category": "Weight Management",
        "categoryId": "60a3589d9c336e882b19bbef",
        "color": "#286CE2",
        "type": "non-clinical",
        "parent": "Weight Management",
        "createdDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedBy": "2022-01-24T09:01:01.395Z",
        "displayName": {
          "en": "Weight Management",
          "es": "Control de peso"
        },
        "id": "60a358bc9c336e882b19bbf0",
        "image": "",
        isNew: false,
        active: true
      },
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Parenting",
        "category": "Parenting",
        "categoryId": "60ed47c4fd042c828fca117e",
        "color": "#286CE2",
        "type": "non-clinical",
        "parent": "Parenting",
        "createdDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedBy": "2022-01-24T09:01:01.395Z",
        "displayName": {
          "en": "Parenting",
          "es": "Crianza"
        },
        "id": "60e2e7277c37b43a668a32f2",
        "image": "",
        isNew: false,
        active: true
      },
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Cancer",
        "category": "Cancer",
        "categoryId": "5f8759dc54fdb7a2c9ae9d0f",
        "color": "#286CE2",
        "type": "non-clinical",
        "parent": "Cancer",
        "createdDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedDate": new Date("2022-01-24T09:01:01.395Z"),
        "updatedBy": "2022-01-24T09:01:01.395Z",
        "displayName": {
          "en": "Cancer",
          "es": "Cáncer"
        },
        "id": "61ee6acdc7422a3a7f484e3c",
        "image": "",
        isNew: false,
        active: true
      }
    ];
    userHelper.fetchStoryCountDetails(storyData, true, communititesData);
  });
});
