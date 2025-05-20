import { mockLogger, mockMongo } from '@anthem/communityadminapi/common/baseTest';
import { Admin } from 'api/adminresources/models/adminUserModel';
import { PushNotificationRequest } from 'api/adminresources/models/pushNotificationModel';
import { PushNotificationHelper } from '../pushNotificationHelper';

describe('PushNotificationHelper', () => {
  let pnHanlder: PushNotificationHelper;

  beforeEach(() => {
    pnHanlder = new PushNotificationHelper(
      <any>mockMongo,
      <any>mockLogger,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return the PN details', async () => {
    const payload: PushNotificationRequest = {
      title: '',
      body: '',
      sendOn: '',
      communities: [],
      nonCommunityUsers: false,
      allUsers: false,
      bannedUsers: false,
      deepLink: {
        url: '',
        label: ''
      },
      isScheduled: false,
      usersWithNoStory: false,
      usersWithDraftStory: false,
      usersWithNoRecentLogin: false,
      numberOfLoginDays: 0,
      id: ''
    }
    const admin: Admin = {
      id: 'id',
      username: 'username',
      firstName: 'fisrName',
      lastName: 'lastName',
      displayName: 'displayName',
      profileImage: 'image',
      role: 'role',
      displayTitle: 'displayTitle',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: '',
      password: '',
      active: false,
      communities: [],
      isPersona: false,
      location: '',
      aboutMe: ''
    };

    await pnHanlder.createPushNotificationData(payload, admin);
  });

  it('get no recent login count - with number of days undefined', async () => {
    mockMongo.getDocumentCount.mockReturnValue(32);
    mockMongo.readAllByValue.mockReturnValue([
      { _id: "userId1" },
      { _id: "userId2" },
      { _id: "userId3" }
    ]);
    const result = await pnHanlder.getNoRecentLoginCount(undefined, []);
    expect(result).toEqual({"pnActiveUsers": 32, "totalCount": 3});
  });

  it('get no recent login count - with number of days', async () => {
    mockMongo.getDocumentCount.mockReturnValue(12);
    mockMongo.readAllByValue.mockReturnValue([
      { _id: "userId1" },
      { _id: "userId2" },
      { _id: "userId3" }
    ]);
    const result = await pnHanlder.getNoRecentLoginCount(60, ['communityId']);
    expect(result).toEqual({"pnActiveUsers": 12, "totalCount": 3});
  });

  it('get users with no story - communities empty', async () => {
    mockMongo.readAllByValue.mockReturnValue([
      { authorId: '62d141f4faedd20015be7a3d' },
      { authorId: '62d1416bf784ca001ca64b80' }
    ]
    );
    mockMongo.getDocumentCount.mockReturnValue(32);
    const result = await pnHanlder.getUsersWithNoStoryCount([]);
    expect(result).toEqual({"pnActiveUsers": 32, "totalCount": 2});
  });

  it('get users with draft story - communities empty', async () => {
    mockMongo.readAllByValue.mockReturnValue([
      { authorId: '62d141f4faedd20015be7a3d' },
      { authorId: '62d1416bf784ca001ca64b80' }
    ]
    );
    mockMongo.getDocumentCount.mockReturnValue(32);
    const result = await pnHanlder.getUsersWithDraftStoryCount([]);
    expect(result).toEqual({"pnActiveUsers": 32, "totalCount": 2});
  });

  it('get users with draft story - communities not empty', async () => {
    mockMongo.readAllByValue.mockReturnValue([
      { authorId: '62d141f4faedd20015be7a3d' },
      { authorId: '62d1416bf784ca001ca64b80' }
    ]
    );
    mockMongo.getDocumentCount.mockReturnValue(32);
    const result = await pnHanlder.getUsersWithDraftStoryCount(['communityId']);
    expect(result).toEqual({"pnActiveUsers": 32, "totalCount": 2});
  });

  it('get users with no communties - communities empty', async () => {
    mockMongo.getDocumentCount.mockReturnValue(32);
    const result = await pnHanlder.getNonCommunityUsersCount([]);
    expect(result).toEqual({"pnActiveUsers": 32, "totalCount": 2});
  });
});
