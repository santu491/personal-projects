import { mockMongo, mockPublicService, mockResult, mockUserHelperService, mockUserService } from '@anthem/communityadminapi/common/baseTest';
import { mockMetricsHelper } from '@anthem/communityadminapi/utils/mocks/mockHelpers';
import { Metrics } from 'api/adminresources/models/metricsModel';
import { PublicService } from '../publicService';

describe('PublicService', () => {
  let service;
  beforeEach(() => {
    service = new PublicService(<any> mockMongo, <any>mockResult, <any>mockUserService, <any>mockMetricsHelper, <any>mockUserHelperService)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return metrics', async () => {
    const expRes: Metrics = {
      usersCount: {
        totalCount: 0,
        medicaidUserCount: 0
      },
      usersByCommunity: 0,
      usersJoinedMoreThanOneCommunity: {},
      usersOptedForPn: 0,
      unPublishedStoriesPerCommunity: {},
      unPublishedStoriesCount: 0,
      storiesCount: 0,
      storiesPerCommunity: {},
      publishedStoriesCount: 0
    };
    mockUserHelperService.getDemoUsers.mockReturnValue([]);
    mockMetricsHelper.getUsersCount.mockReturnValue({ totalCount: 0,
      medicaidUserCount: 0
    });
    mockMetricsHelper.getPNEnabledUserCount.mockReturnValue(0);
    mockMongo.getUsersPerCommunity.mockReturnValue(0);
    mockMetricsHelper.getUsersWhoJoinedMoreThanOneCommunity.mockReturnValue({});
    mockMongo.getDocumentCount.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValue(0);
    mockMongo.getStoriesPerCommunity.mockReturnValueOnce({}).mockReturnValue({});
    mockMongo.readAllByValue.mockReturnValue([{userId: '607e7c99d0a2b533bb2ae3d2'}])
    mockPublicService.getData.mockReturnValue(expRes);
    const resData = await service.getData();
    expect(resData).toEqual(expRes);
  });

  it('Should Return metrics - Member', async () => {
    const expRes: Metrics = {
      usersCount: {
        totalCount: 1
      },
      usersByCommunity: 0,
      usersJoinedMoreThanOneCommunity: {},
      usersOptedForPn: 0,
      unPublishedStoriesPerCommunity: {},
      unPublishedStoriesCount: 0,
      storiesCount: 0,
      storiesPerCommunity: {},
      publishedStoriesCount: 0
    }
    mockUserHelperService.getDemoUsers.mockReturnValue([]);
    mockMetricsHelper.getUsersCount.mockReturnValue({ totalCount: 0 });
    mockMetricsHelper.getPNEnabledUserCount.mockReturnValue(0);
    mockMongo.getUsersPerCommunity.mockReturnValue(0);
    mockMetricsHelper.getUsersWhoJoinedMoreThanOneCommunity.mockReturnValue({});
    mockMongo.getDocumentCount.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValue(0);
    mockMongo.getStoriesPerCommunity.mockReturnValueOnce({}).mockReturnValue({});
    mockMongo.readAllByValue.mockReturnValueOnce([{}]).mockReturnValue([{userId: '607e7c99d0a2b533bb2ae3d2'}])
    mockPublicService.getData.mockReturnValue(expRes);
    mockPublicService.getMemberData.mockReturnValue(expRes);
    const resData = await service.getMemberData('eMember');
    expect(resData).toEqual(expRes);
  });

  it('should login a user with oidc access and id tokens', async () => {
    const login = {
      username: 'SCAdmin',
      password: 'bf671fa4fdb938a4e02b7237af9586f485ba8a8506b82a7f1940380fabed23f9'
    }
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: ''
      }
    };
    mockMongo.readByValue.mockReturnValue({});
    mockUserService.adminAuth.mockReturnValue(expRes);
    const data = await service.login(login);
    expect(data).toEqual(expRes);
  });
});
