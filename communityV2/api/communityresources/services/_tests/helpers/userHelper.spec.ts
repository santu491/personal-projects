import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { APP } from '@anthem/communityapi/utils';
import { UserHelper } from '../../helpers/userHelper';

describe('UserHelper', () => {
  let service;
  let readById;
  let readByValue;
  let updateManyByQuery;
  const baseUrl = APP.config.restApi.userProfile.BaseUrlPath;
  const user = {
    myCommunities: ['607e7c99d0a2b533bb2ae3d2', '60a358bc9c336e882b19bbf0'],
    firstName: 'PHOEBE',
    lastName: 'STINSON',
    username: '~SIT3SBB000008AB',
    gender: 'Female',
    genderRoles: {
      genderPronoun: 'she',
      genderPronounPossessive: 'her'
    },
    displayName: 'Dicta DCt',
    age: 48,
    profilePicture: '5ee7f66c-6754-7800-59e5-4cd57158884a.jpg',
    active: true,
    hasAgreedToTerms: false,
    personId: '357135536',
    memberData: null,
    __v: 0,
    createdAt: '2021-08-11T06:25:35.815Z',
    updatedAt: '2021-08-11T06:25:35.815Z',
    onBoardingState: 'completed',
    localCategories: [
      '61013eb670dbd030d83c8c5f',
      '61013eb670dbd030d83c8c61',
      '61013eb670dbd030d83c8c64'
    ],
    id: '60646605a450020007eae236',
    attributes: {
      communityHelpCardBanner: true,
      localServiceHelpCardBanner: true,
      meTabHelpCardBanner: false,
      localCategoryHelpCardBanner: true,
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: false,
      reactionNotificationFlag: true,
      commentReactionNotificationFlag: true,
      replyNotificationFlag: true
    }
  };

  const userImage = {
    profileImageBase64: 'profileImageBas64'
  };

  beforeEach(() => {
    service = new UserHelper();
    readById = jest.spyOn(MongoDatabaseClient.prototype, 'readByID');
    readByValue = jest.spyOn(MongoDatabaseClient.prototype, 'readByValue');
    updateManyByQuery = jest.spyOn(
      MongoDatabaseClient.prototype,
      'updateManyByQuery'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('buildProfilePicturePath - return null', () => {
    const res = service.buildProfilePicturePath(' ');
    expect(res).toBeNull;
  });

  it('buildProfilePicturePath - return userId with path', () => {
    readByValue.mockImplementation(() => {
      return Promise.resolve(userImage);
    });
    // mockMongo.readByValue.mockReturnValue(userImage);
    service.buildProfilePicturePath('userId');
  });

  it('buildProfilePicturePath - return null', () => {
    // mockMongo.readByValue.mockReturnValue(null);
    readByValue.mockImplementation(() => Promise.resolve(null));
    service.buildProfilePicturePath(baseUrl + 'userId');
  });

  it('getAuthor - success', async () => {
    readById.mockImplementation(() => {
      return Promise.resolve(user);
    });
    const result = await service.getAuthor('60646605a450020007eae236');
    expect(result.id).toEqual('60646605a450020007eae236');
  });

  it('getActivityUser - success', async () => {
    readById.mockImplementation(() => {
      return Promise.resolve(user);
    });
    const result = await service.getActivityUser('60646605a450020007eae236');
    expect(result.id).toEqual('60646605a450020007eae236');
  });

  it('updateActivitiesDisplayName - success', async () => {
    updateManyByQuery.mockImplementation(() => {
      return Promise.resolve(1);
    });
    await service.updateActivitiesDisplayName(
      '60646605a450020007eae236',
      '60646605a450020007eae237'
    );
  });

  it('updateBinderDisplayName - success', async () => {
    updateManyByQuery.mockImplementation(() => {
      return Promise.resolve(1);
    });
    await service.updateBinderDisplayName('60646605a450020007eae236', [
      '60646605a450020007eae237',
      '60646605a450020007eae238'
    ]);
  });

  it('getUserWithoutAttributes - with attributes', async () => {
    const res = service.getUserWithoutAttributes(user);
    expect(res).not.toEqual(user);
  });
});
