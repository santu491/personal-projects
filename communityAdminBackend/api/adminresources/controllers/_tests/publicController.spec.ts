import { API_RESPONSE } from '@anthem/communityadminapi/common';
import {
  mockPublicService,
  mockResult,
  mockValidation
} from '@anthem/communityadminapi/common/baseTest';
import { APP } from '@anthem/communityadminapi/utils';
import { LoginModel } from 'api/adminresources/models/adminUserModel';
import { PublicController } from '../publicController';

describe('PublicController', () => {
  let controller: PublicController;

  beforeEach(() => {
    controller = new PublicController(<any>mockPublicService, <any>mockResult, <any>mockValidation);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return API version: Success', async () => {
    const expRes = `${APP.config.app.apiVersion} ${APP.config.env}`;

    const data = controller.version();
    expect(data).toBe(expRes);
  });

  it('Should Return App Metrics: Success', async () => {
    const metrix = {
      data: {
        value: {
          usersCount: {
            totalCount: 314,
            commercialUsers: 297,
            medicaidUsers: {
              'gbdMSS-SMPLY-FL': 1,
              'gbdMSS-ABCBS-IN': 4,
              'gbdMSS-EBCBS-NY': 2,
              'gbdMSS-AGP-TX': 2,
              'gbdMSS-AGP-WA': 4,
              'gbdMSS-UNICARE-WV': 4,
            },
          },
          usersByCommunity: [
            {
              id: '607e7c99d0a2b533bb2ae3d2',
              title: 'Diabetes',
              userCount: 145,
            },
            {
              id: '60e2e7277c37b43a668a32f2',
              title: 'Parenting',
              userCount: 133,
            },
            {
              id: '60a358bc9c336e882b19bbf0',
              title: 'Weight Management',
              userCount: 117,
            },
            { id: '6214e8959aa982c0d09b40f5', title: 'Cancer', userCount: 160 },
          ],
          usersJoinedMoreThanOneCommunity: [
            { numberOfCommunities: 0, userCount: 71 },
            { numberOfCommunities: 1, userCount: 80 },
            { numberOfCommunities: 2, userCount: 67 },
            { numberOfCommunities: 3, userCount: 43 },
            { numberOfCommunities: 4, userCount: 53 },
          ],
          storiesCount: 240,
          publishedStoriesCount: 129,
          unPublishedStoriesCount: 111,
          storiesPerCommunity: [
            {
              id: '607e7c99d0a2b533bb2ae3d2',
              title: 'Diabetes',
              storiesCount: 34,
            },
            {
              id: '60e2e7277c37b43a668a32f2',
              title: 'Parenting',
              storiesCount: 28,
            },
            {
              id: '60a358bc9c336e882b19bbf0',
              title: 'Weight Management',
              storiesCount: 25,
            },
            {
              id: '6214e8959aa982c0d09b40f5',
              title: 'Cancer',
              storiesCount: 42,
            },
          ],
          unPublishedStoriesPerCommunity: [
            {
              id: '60a358bc9c336e882b19bbf0',
              title: 'Weight Management',
              storiesCount: 21,
            },
            {
              id: '6214e8959aa982c0d09b40f5',
              title: 'Cancer',
              storiesCount: 36,
            },
            {
              id: '60e2e7277c37b43a668a32f2',
              title: 'Parenting',
              storiesCount: 24,
            },
            {
              id: '607e7c99d0a2b533bb2ae3d2',
              title: 'Diabetes',
              storiesCount: 30,
            },
          ],
          usersOptedForPn: 46,
        },
      },
    };

    mockPublicService.getData.mockReturnValue(metrix.data.value);
    mockResult.createSuccess.mockReturnValue(metrix)
    const response = await controller.getAppMetrics(undefined, undefined, undefined);
    expect(response).toBe(metrix);
  });

  it('Should Return App Metrics: Success', async () => {
    mockPublicService.getData.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createError.mockReturnValue({});
    await controller.getAppMetrics(undefined, undefined, undefined);
  });

  it('Admin logIn: Failed', async () => {
    const login: LoginModel = {
      username: '',
      password: '',
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.enterAdminLoginDetails,
          detail: API_RESPONSE.messages.enterAdminLoginDetails,
        },
      },
    };

    mockResult.createError.mockReturnValue(expRes);
    const resp = await controller.login(login);
    expect(resp).toEqual(expRes);
  });

  it('Admin logIn: Failed', async () => {
    const login: LoginModel = {
      username: 'AH0000',
      password: 'pass',
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          username: 'AH0000',
          id: 'userId',
        },
      },
    };

    mockPublicService.login.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resp = await controller.login(login);
    expect(resp).toEqual(expRes);
  });

  it('Admin logIn: Failed', async () => {
    const login: LoginModel = {
      username: 'AH0000',
      password: 'pass',
    };

    mockPublicService.login.mockImplementation(() => {
      throw new Error();
    });
    await controller.login(login);
  });

  it('Should Return App Metrics: Success - Member Data', async () => {
    const metrix = {
      data: {
        value: {
          usersCount: {
            totalCount: 314
          },
          usersByCommunity: [
            {
              id: '607e7c99d0a2b533bb2ae3d2',
              title: 'Diabetes',
              userCount: 145,
            },
            {
              id: '60e2e7277c37b43a668a32f2',
              title: 'Parenting',
              userCount: 133,
            },
            {
              id: '60a358bc9c336e882b19bbf0',
              title: 'Weight Management',
              userCount: 117,
            },
            { id: '6214e8959aa982c0d09b40f5', title: 'Cancer', userCount: 160 },
          ],
          usersJoinedMoreThanOneCommunity: [
            { numberOfCommunities: 0, userCount: 71 },
            { numberOfCommunities: 1, userCount: 80 },
            { numberOfCommunities: 2, userCount: 67 },
            { numberOfCommunities: 3, userCount: 43 },
            { numberOfCommunities: 4, userCount: 53 },
          ],
          storiesCount: 240,
          publishedStoriesCount: 129,
          unPublishedStoriesCount: 111,
          storiesPerCommunity: [
            {
              id: '607e7c99d0a2b533bb2ae3d2',
              title: 'Diabetes',
              storiesCount: 34,
            },
            {
              id: '60e2e7277c37b43a668a32f2',
              title: 'Parenting',
              storiesCount: 28,
            },
            {
              id: '60a358bc9c336e882b19bbf0',
              title: 'Weight Management',
              storiesCount: 25,
            },
            {
              id: '6214e8959aa982c0d09b40f5',
              title: 'Cancer',
              storiesCount: 42,
            },
          ],
          unPublishedStoriesPerCommunity: [
            {
              id: '60a358bc9c336e882b19bbf0',
              title: 'Weight Management',
              storiesCount: 21,
            },
            {
              id: '6214e8959aa982c0d09b40f5',
              title: 'Cancer',
              storiesCount: 36,
            },
            {
              id: '60e2e7277c37b43a668a32f2',
              title: 'Parenting',
              storiesCount: 24,
            },
            {
              id: '607e7c99d0a2b533bb2ae3d2',
              title: 'Diabetes',
              storiesCount: 30,
            },
          ],
          usersOptedForPn: 46,
        },
      },
    };

    mockPublicService.getMemberData.mockReturnValue(metrix.data.value);
    mockResult.createSuccess.mockReturnValue(metrix)
    const response = await controller.getAppMetrics('eMember', undefined, undefined);
    expect(response).toBe(metrix);
  });
});
