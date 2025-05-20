import { NotificationType } from '@anthem/communityapi/common';
import {
  mockActivityHelper,
  mockMongo,
  mockSqsSvc
} from '@anthem/communityapi/common/baseTest';
import { mockPostsServ } from '@anthem/communityapi/utils/mocks/mockPostsService';
import {
  NotificationContentType,
  NotificationMessage
} from 'api/communityresources/models/notificationModel';
import { NotificationHelper } from '../../helpers/notificationHelper';
import { UserHelper } from '../../helpers/userHelper';

describe('Notification Helper', () => {
  let service;
  let buildProfilePicturePath;
  const receiver = {
    username: '~SIT3SBB000008AB',
    firstName: 'PHOEBE',
    lastName: 'STINSON',
    gender: 'Female',
    genderRoles: {
      genderPronoun: 'she',
      genderPronounPossessive: 'her'
    },
    active: true,
    personId: '357135536',
    myCommunities: [
      '607e7c99d0a2b533bb2ae3d2',
      '60a358bc9c336e882b19bbf0',
      '60e2e7277c37b43a668a32f2',
      '61ee6acdc7422a3a7f484e3c'
    ],
    onBoardingState: 'completed',
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
    },
    displayName: 'phobia',
    updated: true,
    tou: [
      {
        acceptedVersion: '1.0',
        acceptedTimestamp: {}
      }
    ],
    user: {
      myCommunities: [
        '607e7c99d0a2b533bb2ae3d2',
        '60a358bc9c336e882b19bbf0',
        '60e2e7277c37b43a668a32f2',
        '61ee6acdc7422a3a7f484e3c'
      ]
    },
    profilePicture: 'efbad63c-305b-3d0b-d9d1-769cbcf7d100',
    id: '615adaaba0e10b0023ad3639'
  };

  const sender = {
    username: '~SIT1SB328H00001',
    firstName: 'GRACIA',
    lastName: 'BOZAK',
    active: true,
    personId: '363442609',
    cancerCommunityCard: true,
    id: '6231dcd2e9f37b4e744185ae'
  };

  beforeEach(() => {
    buildProfilePicturePath = jest.spyOn(
      UserHelper.prototype as any,
      'buildProfilePicturePath'
    );
    service = new NotificationHelper(
      <any>mockMongo,
      <any>mockSqsSvc,
      <any>mockActivityHelper,
      <any>mockPostsServ
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('notifyUser - Same User as receiver and sender', async () => {
    const message: NotificationMessage = {
      title: 'Some Reaction',
      body: 'Some Body'
    };
    await service.notifyUser(
      NotificationContentType.POST,
      'receiverId',
      'receiverId',
      'postId',
      message,
      'Some Message',
      'reaction',
      'commentId',
      NotificationType.REACTION
    );
  });

  it('notifyUser - Add Reaction to story', async () => {
    const message: NotificationMessage = {
      title: 'Some Reaction',
      body: 'Some Body'
    };
    const activityList = {
      userId: '615adaaba0e10b0023ad3639',
      activityList: [
        {
          _id: {
            _bsontype: 'ObjectId',
            id: new Uint8Array([
              98, 49, 225, 68, 172, 30, 33, 104, 99, 30, 58, 160
            ])
          },
          isActivityNotificationRead: false,
          activityCreatedDate: {},
          activityText: '615afe8af7a306001cace422',
          activityInitiator: {
            _id: {
              _bsontype: 'ObjectId',
              id: new Uint8Array([
                98, 49, 220, 210, 233, 243, 123, 78, 116, 65, 133, 174
              ])
            },
            displayName: null,
            firstName: 'GRACIA',
            profilePicture:
              'https://dev.api.sydney-community.com/v2/users/profileImageString/6231dcd2e9f37b4e744185ae'
          },
          storyLink: {
            storyId: 'Has commented on your story',
            commentId: '6231e13fac1e2168631e3a9f',
            replyId: null
          }
        },
        {
          _id: {
            _bsontype: 'ObjectId',
            id: new Uint8Array([
              98, 49, 225, 156, 172, 30, 33, 104, 99, 30, 58, 163
            ])
          },
          isActivityNotificationRead: false,
          activityCreatedDate: {},
          activityText: '615afe8af7a306001cace422',
          activityInitiator: {
            _id: {
              _bsontype: 'ObjectId',
              id: new Uint8Array([
                98, 49, 220, 210, 233, 243, 123, 78, 116, 65, 133, 174
              ])
            },
            displayName: null,
            firstName: 'GRACIA',
            profilePicture:
              'https://dev.api.sydney-community.com/v2/users/profileImageString/6231dcd2e9f37b4e744185ae'
          },
          storyLink: {
            storyId: 'Has commented on your story',
            commentId: '6231e198ac1e2168631e3aa2',
            replyId: null
          }
        },
        {
          _id: {
            _bsontype: 'ObjectId',
            id: new Uint8Array([
              98, 49, 225, 192, 172, 30, 33, 104, 99, 30, 58, 165
            ])
          },
          isActivityNotificationRead: false,
          activityCreatedDate: {},
          activityText: '615afe8af7a306001cace422',
          activityInitiator: {
            _id: {
              _bsontype: 'ObjectId',
              id: new Uint8Array([
                98, 49, 220, 210, 233, 243, 123, 78, 116, 65, 133, 174
              ])
            },
            displayName: null,
            firstName: 'GRACIA',
            profilePicture:
              'https://dev.api.sydney-community.com/v2/users/profileImageString/6231dcd2e9f37b4e744185ae'
          },
          storyLink: {
            storyId: 'Has commented on your story',
            commentId: '6231e1bbac1e2168631e3aa4',
            replyId: null
          }
        },
        {
          _id: {
            _bsontype: 'ObjectId',
            id: new Uint8Array([
              98, 49, 227, 25, 163, 23, 36, 117, 152, 9, 194, 114
            ])
          },
          isActivityNotificationRead: false,
          activityCreatedDate: {},
          activityText: '615afe8af7a306001cace422',
          activityInitiator: {
            _id: {
              _bsontype: 'ObjectId',
              id: new Uint8Array([
                98, 49, 220, 210, 233, 243, 123, 78, 116, 65, 133, 174
              ])
            },
            displayName: null,
            firstName: 'GRACIA',
            profilePicture:
              'https://dev.api.sydney-community.com/v2/users/profileImageString/6231dcd2e9f37b4e744185ae'
          },
          storyLink: {
            storyId: 'Has commented on your story',
            commentId: '6231e313a31724759809c271',
            replyId: null
          }
        },
        {
          _id: {
            _bsontype: 'ObjectId',
            id: new Uint8Array([
              98, 49, 232, 128, 52, 163, 54, 19, 202, 100, 249, 148
            ])
          },
          isActivityNotificationRead: false,
          activityCreatedDate: {},
          activityText: null,
          activityInitiator: {
            _id: {
              _bsontype: 'ObjectId',
              id: new Uint8Array([
                98, 49, 220, 210, 233, 243, 123, 78, 116, 65, 133, 174
              ])
            },
            displayName: null,
            firstName: 'GRACIA',
            profilePicture:
              'https://dev.api.sydney-community.com/v2/users/profileImageString/6231dcd2e9f37b4e744185ae'
          },
          storyLink: {
            storyId: 'Has commented on your story',
            commentId: '6231e86234a33613ca64f993',
            replyId: null
          }
        }
      ],
      id: '6231e144ac1e2168631e3aa1'
    };
    mockMongo.readByID.mockReturnValueOnce(receiver).mockReturnValue(sender);
    mockMongo.readByValue
      .mockReturnValueOnce(activityList)
      .mockReturnValue({ id: 'someId', userId: 'receiverId', devices: [] });
    mockMongo.updateByQuery.mockReturnValue(true);
    mockSqsSvc.addToNotificationQueue.mockReturnValue(true);
    buildProfilePicturePath.mockImplementation(() => {
      return Promise.resolve();
    });
    await service.notifyUser(
      NotificationContentType.STORY,
      'receiverId',
      'senderId',
      'postId',
      message,
      'Some Message',
      'reaction',
      'commentId',
      NotificationType.REACTION
    );
  });

  it('notifyUser - Add Reply to story', async () => {
    const message: NotificationMessage = {
      title: 'Some Reply',
      body: 'Some Body'
    };
    mockMongo.readByID.mockReturnValueOnce(receiver).mockReturnValue(sender);
    mockMongo.readByValue
      .mockReturnValueOnce(null)
      .mockReturnValue({ id: 'someId', userId: 'receiverId', devices: [] });
    mockMongo.insertValue.mockReturnValue(true);
    buildProfilePicturePath.mockImplementation(() => {
      return Promise.resolve();
    });
    mockSqsSvc.addToNotificationQueue.mockReturnValue(true);
    await service.notifyUser(
      NotificationContentType.STORY,
      'receiverId',
      'senderId',
      'storyId',
      message,
      'Some Message',
      'reply',
      'commentId',
      NotificationType.REPLY,
      'replyId'
    );
    expect(mockSqsSvc.addToNotificationQueue.mock.calls.length).toBe(1);
  });

  it('notifyUser - Add comment to Post', async () => {
    const message: NotificationMessage = {
      title: 'Some Reply',
      body: 'Some Body'
    };
    mockMongo.readByID.mockReturnValueOnce(receiver).mockReturnValue(sender);
    mockMongo.readByValue.mockReturnValue({
      id: 'someId',
      userId: 'receiverId',
      devices: []
    });
    mockActivityHelper.handleUserActivity.mockReturnValue({
      _id: 'activityId',
      postLink: {
        label: 'link',
        uel: 'link-url'
      }
    });
    mockMongo.insertValue.mockReturnValue(true);
    await service.notifyUser(
      NotificationContentType.POST,
      'receiverId',
      'senderId',
      'storyId',
      message,
      'Some Message',
      'reply',
      'commentId',
      NotificationType.REPLY,
      'replyId'
    );
    expect(mockSqsSvc.addToNotificationQueue.mock.calls.length).toBe(1);
  });
});
