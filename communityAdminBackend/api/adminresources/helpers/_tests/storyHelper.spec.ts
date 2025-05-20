import { mockMongo, mockPostHelper, mockResult, mockSqsService } from "@anthem/communityadminapi/common/baseTest";
import { mockILogger } from "@anthem/communityadminapi/logger/mocks/mockILogger";
import { Admin } from "api/adminresources/models/adminUserModel";
import { Installations, User } from "api/adminresources/models/userModel";
import { StoryHelperService } from "../storyHelper";

describe('StoryHelperService', () => {
  let storyHelper: StoryHelperService;
  let handleUserActivityForStory;
  let notifyUserOverStory;

  beforeEach(() => {
    storyHelper = new StoryHelperService(<any>mockMongo, <any>mockSqsService, <any>mockResult, <any>mockPostHelper, <any>mockILogger, );
    notifyUserOverStory = jest.spyOn(StoryHelperService.prototype as any, 'notifyUserOverStory');
    handleUserActivityForStory = jest.spyOn(StoryHelperService.prototype as any, 'handleUserActivityForStory');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const payload = {
    'storyId': 'storyId',
    'commentId': 'commentId',
    'comment': 'Thanks for you reply'
  };

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
    category: "",
    password: "",
    active: false,
    communities: [],
    isPersona: false,
    location: "",
    aboutMe: ""
  };

  const story = {
    "_id": "storyId",
    "authorId": "615adaaba0e10b0023ad3639",
    "featuredQuote": "Cancer test ****",
    "answer": [],
    "communityId": "60e2e7277c37b43a668a32f2",
    "storyText": "Placeholder story text",
    "authorAgeWhenStoryBegan": 21,
    "relation": "Husband",
    "displayName": "",
    "relationAgeWhenDiagnosed": 5,
    "createdDate": new Date(),
    "updatedDate": new Date(),
    "published": true,
    "flagged": false,
    "removed": false,
    "hasStoryBeenPublishedOnce": true,
    "comments": [
      {
        "_id": "commentId",
        "comment": "Hey Admin here!!",
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "flagged": false,
        "removed": false,
        "author": {
          "id": "622b417fb3add3c1b5cb1c84",
          "firstName": "Ananya",
          "lastName": "K",
          "displayName": "",
          "displayTitle": "Sydney Community",
          "role": "scadmin"
        }
      },
    ]
  };

  const installation: Installations = {
    "id": "installationId",
    "userId": "621ddbd37f1d1600238d2b29",
    "devices": [
      {
        "locale": "en-US",
        "osVersion": "29",
        "platform": "android",
        "timeZoneOffset": 300,
        "deviceToken": "e2ix4yBgR1i4u4gQ1TESO0:APA91bHT3qX6H6CqUxc7UTmOEJA8je3uHe019v67JQX2pqQuDm8p1-I2yo8OyPI6vHDL6zo5T_VirTZc4vxpkSrp8ystD29v89Mp-201TXAFkWPp3TVRcbVa4JOOxTHNtsYUm4EFcf9c",
        "id": "622321dce4573f0023a4d8a3",
        "endpointArn": "arn:aws:sns:us-east-1:498126410249:endpoint/GCM/sydcom-andriod-sit/6fc69b8a-c486-3c72-b225-0345ce74fb9b",
        "createdTimestamp": new Date(),
        "updatedTimestamp": new Date(),
        "badge": 0
      }
    ]
  };

  const user: User = {
    "id": "userId",
    "username": "~SIT3SB062T95713",
    "firstName": "TAKUR",
    "lastName": "JANVI",
    "active": true,
    "personId": "348428504",
    "onBoardingState": "completed",
    "displayName": "",
    "profilePicture": "fbe3fe3a-4399-b77d-0e59-95bfa6f01592",
    "myCommunities": [
      "60a358bc9c336e882b19bbf0"
    ],
    "attributes": {
      "answerNotificationFlag": true,
      "communityNotificationFlag": true,
      "questionNotificationFlag": true,
      "reactionNotificationFlag": true,
      "commentReactionNotificationFlag": true,
      "replyNotificationFlag": true,
      "commentNotificationFlag": false
    },
    "token": "",
    "gender": "",
    "genderRoles": {
      "genderPronoun": "she",
      "genderPronounPossessive": "her"
    },
    "age": 0,
    "hasAgreedToTerms": false,
    "localCategories": [],
    optInMinor: false
  };

  /* userNotification */
  it('Should notify the user: Comment', async () => {
    mockMongo.readByID.mockReturnValue(story);
    notifyUserOverStory.mockImplementation(() => {
      return true;
    });

    await storyHelper.userNotification(payload, 'comment', admin, 'commentId');
  });

  it('Should notify the user: Reply', async () => {
    mockMongo.readByID.mockReturnValue(story);
    notifyUserOverStory.mockImplementation(() => {
      return true;
    });

    await storyHelper.userNotification(payload, 'reply', admin, 'commentId', 'replyId');
  });

  /* handleUserActivityForStory */
  it('Should create activity for users', async () => {
    mockMongo.readByID.mockReturnValue(admin);
    mockMongo.readAllByValue.mockReturnValue(installation);
    mockMongo.updateByQuery.mockReturnValue(true);

    await storyHelper.handleUserActivityForStory(user, 'storyId', 'adminId', 'message', 'commentId', 'replyId');

  });

  it('Should create activity for users', async () => {
    mockMongo.readByID.mockReturnValue(admin);
    mockMongo.readAllByValue.mockReturnValue(null);
    mockMongo.insertValue.mockReturnValue(true);

    await storyHelper.handleUserActivityForStory(user, 'storyId', 'adminId', 'message', 'commentId', 'replyId');

  });

  /* notifyUserOverStory */
  it('Should notify the user: Reply', async () => {
    mockMongo.readByID.mockReturnValue(admin);
    handleUserActivityForStory.mockImplementation(() => {
      return 'activityId';
    });
    mockMongo.readByValue.mockReturnValue(installation);
    mockSqsService.addToNotificationQueue.mockReturnValue(true);

    await storyHelper.notifyUserOverStory('userId', 'storyId', 'adminId', 'messageTitle', 'messageBody', 'reply', 'notification', 'commentId', 'replyId');
  });

  it('Should notify the user: Comment', async () => {
    mockMongo.readByID.mockReturnValue(admin);
    handleUserActivityForStory.mockImplementation(() => {
      return 'activityId';
    });
    mockMongo.readByValue.mockReturnValue(installation);
    mockSqsService.addToNotificationQueue.mockReturnValue(true);

    await storyHelper.notifyUserOverStory('userId', 'storyId', 'adminId', 'messageTitle', 'messageBody', 'comment', 'notification', 'commentId');
  });


});
