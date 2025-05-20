import {
  mockCommunitiesHelper,
  mockMongo,
  mockResult,
  mockValidation,
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { Community } from 'api/communityresources/models/communitiesModel';
import { PageParamModel } from 'api/communityresources/models/pageParamModel';
import { CommunityService } from '../communityServies';

describe('CommunityService', () => {
  let svc: CommunityService;
  beforeEach(() => {
    svc = new CommunityService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockValidation,
      <any>mockCommunitiesHelper,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const community: Community = {
    "id": "607e7c99d0a2b533bb2ae3d2",
    "createdBy": "5f99844130b711000703cd74",
    "title": "Diabetes",
    "category": "Diabetes",
    "categoryId": "607e7c92d0a2b533bb2ae3d1",
    "type": "clinical",
    "parent": "Diabetes",
    "createdAt": new Date(),
    "displayName": {
      "en": "Diabetes",
      "es": "Diabetes"
    },
    "image": '',
    updatedAt: new Date(),
    updatedBy: ''
  };
  const user = {
    id: '',
    myCommunities: ["5f99844130b711000703cd74"],
  }

  describe('getAllCommunities', async () => {
    it('should return success', async () => {
      mockMongo.readAll.mockReturnValue([community]);
      mockValidation.sort.mockReturnValue([community]);

      await svc.getAllCommunities(
        { pageNumber: 1, pageSize: 10, sort: 1 },
        'en'
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      mockMongo.readAll.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);

      await svc.getAllCommunities(
        { pageNumber: 1, pageSize: 10, sort: 1 },
        'en'
      );
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getCommunityById', async () => {
    it('', async () => {
      mockMongo.readByID.mockReturnValue(community);
      mockMongo.readByValue.mockReturnValue(community);

      await svc.getCommunityById('id', 'en');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await svc.getCommunityById('id', 'en');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error();
      })
      mockILogger.error.mockReturnValue(1);
      await svc.getCommunityById('id', 'en');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getAllCategories', async () => {
    it('success', async () => {
      mockMongo.readAll.mockReturnValue([community]);
      await svc.getAllCategories('en');

      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('success', async () => {
      mockMongo.readAll.mockReturnValue([]);

      await svc.getAllCategories('en');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('exception', async () => {
      mockMongo.readAll.mockRejectedValue(new Error());
      await svc.getAllCategories('en');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getCommunities', async () => {
    it('success', async () => {
      mockMongo.readAll.mockReturnValue([community]);
      mockValidation.sort.mockReturnValue([community]);
      mockResult.createSuccess([community]);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.getCommunities({pageNumber: 1, pageSize: 2, sort: 1} as PageParamModel);
    });

    it('exceptions', async () => {
      mockMongo.readAll.mockImplementation(() => {
        throw new Error()
      });
      mockILogger.error.mockReturnValue(1);

      await svc.getCommunities({ pageNumber: 1, pageSize: 2, sort: 1 } as PageParamModel);
      mockResult.createException.mockReturnValue(1);
    });
  });

  describe('getAllCommunitiesNested', async () => {
    it('error', async () => {
      mockMongo.readAll.mockReturnValue(null);

      await svc.getAllCommunitiesNested('en');
      mockResult.createError.mockReturnValue(1);
    });

    it('success', async () => {
      mockMongo.readAll.mockReturnValue([community]);
      await svc.getAllCommunitiesNested('en');
      mockResult.createSuccess.mockReturnValue(1);
    });

    it('success', async () => {
      mockMongo.readAll.mockReturnValue([community]);
      await svc.getAllCommunitiesNested('es');
      mockResult.createSuccess.mockReturnValue(1);
    });

    it('exception', async () => {
      mockMongo.readAll.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);
      await svc.getAllCommunitiesNested('en');
      mockResult.createException.mockReturnValue(1);
    });
  });

  describe('getMyCommunities', async () => {
    it('success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockCommunitiesHelper.getMultipleCommunities.mockReturnValue([community]);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.getMyCommunities('en', 'userId');
    });

    it('exception', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error()
      });
      mockILogger.error.mockReturnValue(1);
      await svc.getMyCommunities('en', 'userId');
      mockResult.createException.mockReturnValue(1);
    });
  });

  describe('getActivePageForCommunity', async () => {
    it('getActivePageForCommunity - story success', async () => {
      mockMongo.readByAggregate.mockReturnValue([{}, {}, {}]);
      mockResult.createSuccess.mockReturnValue(1);

      await svc.getActivePageForCommunity('6214e8959aa982c0d09b40f5');
    });

    it('getActivePageForCommunity - story success', async () => {
      mockMongo.readByAggregate.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);
      mockResult.createException.mockReturnValue(1);

      await svc.getActivePageForCommunity('6214e8959aa982c0d09b40f5');
    });
  });

  describe('getCommunityImage', async () => {
    it('error', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);

      await svc.getCommunityImage('id');
    });

    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(true);
      await svc.getCommunityImage('id');
      mockResult.createSuccess.mockReturnValue(1);
    });

    it('exception', async () => {
      mockMongo.readByValue.mockImplementation(() => {
        throw new Error();
      });
      mockResult.createException.mockReturnValue(1);

      await svc.getCommunityImage('id');
    });
  });
});
