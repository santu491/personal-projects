import { mockMongo } from "@anthem/communityapi/common/baseTest";
import { TranslationLanguage } from "@anthem/communityapi/common/constants";
import { ObjectId } from "mongodb";
import { CommunitiesHelper } from "../../helpers/communitiesHelper";


describe('Communities Helper', () => {
  let service;

  beforeEach(() => {
    service = new CommunitiesHelper(<any>mockMongo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getMultipleCommunities - success', async () => {
    const communityIds = ['607e7c99d0a2b533bb2ae3d2', '60e2e7277c37b43a668a32f2'];
    const communities = require('../data/communities-filtered.json');
    for (const community of communities) {
      community._id = new ObjectId(community._id);
    }
    mockMongo.readByIDArray.mockReturnValue(communities);

    const buildCommunity = jest.spyOn(CommunitiesHelper.prototype as any, 'buildCommunity');
    buildCommunity.mockImplementationOnce(() => { return Promise.resolve(true) })
    await service.getMultipleCommunities(
      communityIds,
      TranslationLanguage.ENGLISH
    );
  });
});
