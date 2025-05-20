import { mongoDbTables, storyReactionsType } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { APP } from '@anthem/communityapi/utils';
import { FlaggedUserLog } from 'api/communityresources/models/postsModel';
import { Story } from 'api/communityresources/models/storyModel';
import { ObjectId } from 'mongodb';
import { EmailService } from '../../emailService';
import { CommentHelper } from '../../helpers/commentHelper';

describe('Comment Helper', () => {
  let service;
  const smtpSettings = {
    smtpServer: 'awsrelay.anthem.com',
    flagReviewEmail: 'email@legato.com',
    adminEmail: 'email@legato.com',
    fromEmailAddress: 'noreply@anthem.com',
    fromEmailName: 'SydneyCommunity',
    sendEmail: true,
    smtpPort: 587,
    apiPath: 'adminPublicUrl',
    adminUrl: 'adminUrl',
    username: 'username',
    password: 'password',
    service: ''
  };
  APP.config.smtpSettings = smtpSettings;
  beforeEach(() => {
    service = new CommentHelper();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  const story: Story = {
    id: '60a3589d9c336e882b19bbef',
    communityId: '60a3589d9c336e992b19bbef',
    authorId: '60a3589d9c336f982b19bbef',
    authorAgeWhenStoryBegan: 0,
    relation: '',
    displayName: '',
    relationAgeWhenDiagnosed: 0,
    featuredQuote: '',
    answer: [],
    storyText: '',
    published: false,
    publishedAt: new Date('2021-12-02T04:54:06.472Z'),
    flagged: false,
    removed: false,
    hasStoryBeenPublishedOnce: false,
    reaction: {
      count: {
        like: 0,
        care: 0,
        good_idea: 0,
        celebrate: 0,
        total: 0
      },
      log: []
    },
    allowComments: false,
    comments: [
      {
        author: {
          id: new ObjectId('60a358bc9c336e882b19bbf0'),
          firstName: 'jest',
          lastName: 'test',
          role: '',
          displayName: 'tester',
          displayTitle: '',
          profileImage: ''
        },
        flagged: false,
        removed: false,
        reactions: {
          count: {
            like: 0,
            care: 0,
            good_idea: 0,
            celebrate: 0,
            total: 0
          },
          log: []
        },
        createdAt: new Date('2021-12-02T04:54:06.472Z'),
        updatedAt: new Date('2021-12-02T04:54:06.472Z'),
        replies: [],
        isCommentTextProfane: false,
        flaggedUserLog: undefined,
        id: '60a358bc9c336e882b19bbf0',
        comment: 'Test Comment',
        postId: undefined,
        removedBy: undefined
      }
    ],
    createdAt: undefined,
    updatedAt: undefined
  };

  const flaggedComment = {
    author: {
      id: new ObjectId('60a358bc9c336e882b19bbf0'),
      firstName: 'jest',
      lastName: 'test',
      role: '',
      displayName: 'tester',
      displayTitle: '',
      profileImage: ''
    },
    flagged: true,
    removed: false,
    reactions: {
      count: {
        like: 0,
        care: 0,
        good_idea: 0,
        celebrate: 0,
        total: 0
      },
      log: []
    },
    createdAt: new Date('2021-12-02T04:54:06.472Z'),
    updatedAt: new Date('2021-12-02T04:54:06.472Z'),
    replies: [],
    isCommentTextProfane: false,
    flaggedUserLog: [
      {
        userId: '60a3589d9c336e882b19bbef',
        createdDate: new Date('2021-12-02T04:54:06.472Z')
      },
      {
        userId: '60a3589d9c336e882b19dbef',
        createdDate: new Date('2021-12-02T04:54:06.472Z')
      }
    ],
    id: '60a358bc9c336e882b19bbf0',
    comment: 'Test Comment',
    postId: undefined
  };

  const commentsListRaw = [
    {
      _id: '617568ee2de22014dc3d3b6e',
      comment: 'Test question',
      createdAt: '2021-10-20T09:34:42.413Z',
      updatedAt: '2021-10-20T09:34:42.413Z',
      flagged: false,
      removed: false,
      isCommentTextProfane: false,
      author: {
        id: '615ae89ee0f29800159df141'
      },
      replies: [
        {
          _id: '616fe56817b2150eb2825696',
          comment: 'testAnswere',
          createdAt: '2021-10-20T09:34:42.413Z',
          updatedAt: '2021-10-20T09:34:42.413Z',
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: '61756be48fe3545260b6bff0'
          }
        }
      ]
    },
    {
      _id: '617019eea42c88c41359aaf8',
      comment: 'Test question',
      createdAt: '2021-10-20T13:30:22.641Z',
      updatedAt: '2021-10-20T13:30:22.641Z',
      flagged: false,
      removed: false,
      isCommentTextProfane: false,
      author: {
        id: '61756be48fe3545260b6bff0'
      },
      reaction: {
        log: [
          {
            userId: '617568ee2de22014dc3d3b6e',
            reaction: 'like',
            createdDate: '2021-11-17T18:52:43.653Z',
            updatedDate: '2021-11-17T18:52:43.653Z'
          },
          {
            userId: '61af64ad583c599ddb4f1bed',
            reaction: 'like',
            createdDate: '2022-02-11T13:58:24.193Z',
            updatedDate: '2022-02-11T13:58:24.193Z'
          }
        ],
        count: {
          like: 2,
          care: 0,
          celebrate: 0,
          good_idea: 0,
          total: 2
        }
      }
    }
  ];

  const usersListRaw = [
    {
      _id: '617568ee2de22014dc3d3b6e',
      username: '~SIT3SB952T95629',
      firstName: 'SIMONE',
      lastName: 'COLINS',
      active: true,
      personId: '348101878',
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ],
      commentReactionNotificationFlag: true,
      replyNotificationFlag: true,
      displayName: 'Test Name'
    },
    {
      _id: '61756be48fe3545260b6bff0',
      username: '~SIT3SB755T95714',
      firstName: 'JESUS',
      lastName: 'GLOW',
      active: true,
      personId: '323024497',
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ],
      commentReactionNotificationFlag: true,
      replyNotificationFlag: true
    }
  ];

  it('getCommentCount - success', () => {
    expect(service.getCommentCount(commentsListRaw)).toEqual(3);
  });

  it('getCommentCount - success', () => {
    expect(service.getCommentCount(undefined)).toEqual(0);
  });

  it('reportToAdmin - comment - success', async () => {
    jest
      .spyOn(MongoDatabaseClient.prototype, 'readByID')
      .mockImplementation(() => {
        return Promise.resolve({
          _id: '60a358bc9c336e882b19bbf0',
          createdBy: '5f99844130b711000703cd74',
          title: 'Weight Management',
          category: 'Weight Management',
          categoryId: '60a3589d9c336e882b19bbef',
          color: '#286CE2',
          type: 'non-clinical',
          parent: 'Weight Management',
          createdDate: '2021-05-18T06:03:32.976Z',
          __v: 0,
          createdAt: '2021-08-10T12:48:34.702Z',
          updatedAt: '2021-12-02T04:54:06.472Z',
          displayName: {
            en: 'Weight Management',
            es: 'Control del peso'
          }
        });
      });
    jest
      .spyOn(EmailService.prototype, 'htmlForFlagStoryComment')
      .mockImplementation(() => {
        return 'html content';
      });
    jest
      .spyOn(EmailService.prototype, 'sendEmailMessage')
      .mockImplementation(() => {
        return Promise.resolve(true);
      });

    await service.reportToAdmin(story, 'comment');
  });

  it('reportToAdmin - reply - success', async () => {
    jest
      .spyOn(MongoDatabaseClient.prototype, 'readByID')
      .mockImplementation(() => {
        return Promise.resolve({
          _id: '60a358bc9c336e882b19bbf0',
          createdBy: '5f99844130b711000703cd74',
          title: 'Weight Management',
          category: 'Weight Management',
          categoryId: '60a3589d9c336e882b19bbef',
          color: '#286CE2',
          type: 'non-clinical',
          parent: 'Weight Management',
          createdDate: '2021-05-18T06:03:32.976Z',
          __v: 0,
          createdAt: '2021-08-10T12:48:34.702Z',
          updatedAt: '2021-12-02T04:54:06.472Z',
          displayName: {
            en: 'Weight Management',
            es: 'Control del peso'
          }
        });
      });
    jest
      .spyOn(EmailService.prototype, 'htmlForFlagStoryComment')
      .mockImplementation(() => {
        return 'html content';
      });
    jest
      .spyOn(EmailService.prototype, 'sendEmailMessage')
      .mockImplementation(() => {
        return Promise.resolve(true);
      });

    await service.reportToAdmin(story, 'reply');
  });

  it('reportToAdmin - story - success', async () => {
    jest
      .spyOn(MongoDatabaseClient.prototype, 'readByID')
      .mockImplementation(() => {
        return Promise.resolve({
          _id: '60a358bc9c336e882b19bbf0',
          createdBy: '5f99844130b711000703cd74',
          title: 'Weight Management',
          category: 'Weight Management',
          categoryId: '60a3589d9c336e882b19bbef',
          color: '#286CE2',
          type: 'non-clinical',
          parent: 'Weight Management',
          createdDate: '2021-05-18T06:03:32.976Z',
          __v: 0,
          createdAt: '2021-08-10T12:48:34.702Z',
          updatedAt: '2021-12-02T04:54:06.472Z',
          displayName: {
            en: 'Weight Management',
            es: 'Control del peso'
          }
        });
      });
    jest
      .spyOn(EmailService.prototype, 'htmlForFlagStoryComment')
      .mockImplementation(() => {
        return 'html content';
      });
    jest
      .spyOn(EmailService.prototype, 'sendEmailMessage')
      .mockImplementation(() => {
        return Promise.resolve(true);
      });

    await service.reportToAdmin(story, 'story');
  });

  it('hasUserFlagged - Not flagged with Undefined', () => {
    expect(service.hasUserFlagged(undefined, 'userId')).toBe(false);
  });

  it('hasUserFlagged - Not flagged with no value', () => {
    expect(service.hasUserFlagged([], 'userId')).toBe(false);
  });

  it('hasUserFlagged - should return false', () => {
    const flagLog: FlaggedUserLog[] = [
      {
        userId: '60a3589d9c336e882b19bbef',
        createdDate: new Date('2021-12-02T04:54:06.472Z')
      },
      {
        userId: '60a3589d9c336e882b19dbef',
        createdDate: new Date('2021-12-02T04:54:06.472Z')
      }
    ];
    expect(service.hasUserFlagged(flagLog, '60a3589d9c336e883b19dbef')).toBe(
      false
    );
  });

  it('hasUserFlagged - should return true', () => {
    const flagLog: FlaggedUserLog[] = [
      {
        userId: '60a3589d9c336e882b19bbef',
        createdDate: new Date('2021-12-02T04:54:06.472Z')
      },
      {
        userId: '60a3589d9c336e882b19dbef',
        createdDate: new Date('2021-12-02T04:54:06.472Z')
      }
    ];
    expect(service.hasUserFlagged(flagLog, '60a3589d9c336e882b19dbef')).toBe(
      true
    );
  });

  it('getReplyStory', async () => {
    jest
      .spyOn(MongoDatabaseClient.prototype, 'readByValue')
      .mockImplementation(() => {
        return Promise.resolve(story);
      });
    const res = await service.getReplyStory(
      '60a3589d9c336e882b19bbef',
      '60a3589d9c336e882b19bbef',
      '60a3589d9c336e882b19bbef'
    );
    expect(res).toEqual(story);
  });

  it('getUpdateCommentQuery - query for comment with no userlog', () => {
    const inputFlagLog = {
      userId: 'userId',
      createdDate: new Date('2021-12-02T04:54:06.472Z')
    };
    const outputObject = {
      $set: {
        [mongoDbTables.story.commentFlagged]: true,
        [mongoDbTables.story.commentUpdatedAt]: new Date(),
        [mongoDbTables.story.commentFlaggedLog]: [inputFlagLog]
      }
    };
    expect(
      service.getUpdateCommentQuery(
        story.comments[0],
        '60a3589d9c336e882b19bbef',
        inputFlagLog,
        storyReactionsType[1]
      )
    ).toEqual(outputObject);
  });

  it('getUpdateCommentQuery - query for comment with userlog', () => {
    const inputFlagLog = {
      userId: 'userId',
      createdDate: new Date('2021-12-02T04:54:06.472Z')
    };
    const outputObject = {
      $set: {
        [mongoDbTables.story.commentFlagged]: true,
        [mongoDbTables.story.commentUpdatedAt]: new Date()
      }
    };
    expect(
      service.getUpdateCommentQuery(
        flaggedComment,
        '60a3589d9c336e882b19bbef',
        inputFlagLog,
        storyReactionsType[1]
      )
    ).toEqual(outputObject);
  });

  it('getUpdateCommentQuery - query for comment without userlog', () => {
    const inputFlagLog = {
      userId: 'userId',
      createdDate: new Date('2021-12-02T04:54:06.472Z')
    };
    const outputObject = {
      $set: {
        [mongoDbTables.story.commentFlagged]: true,
        [mongoDbTables.story.commentUpdatedAt]: new Date()
      },
      $push: {
        [mongoDbTables.story.commentFlaggedLog]: inputFlagLog
      }
    };
    expect(
      service.getUpdateCommentQuery(
        flaggedComment,
        '60a3589d9c336e882b19bcef',
        inputFlagLog,
        storyReactionsType[1]
      )
    ).toEqual(outputObject);
  });

  it('getUpdateCommentQuery - query for reply with no userlog', () => {
    const inputFlagLog = {
      userId: 'userId',
      createdDate: new Date('2021-12-02T04:54:06.472Z')
    };
    const outputObject = {
      $set: {
        [mongoDbTables.story.replyFlagged]: true,
        [mongoDbTables.story.replyUpdatedAt]: new Date(),
        [mongoDbTables.story.replyFlaggedLog]: [inputFlagLog]
      }
    };
    const res = service.getUpdateCommentQuery(
      story.comments[0],
      '60a3589d9c336e882b19bbef',
      inputFlagLog,
      storyReactionsType[2]
    );
    expect(res).toEqual(outputObject);
  });

  it('getUpdateCommentQuery - query for comment with userlog', () => {
    const inputFlagLog = {
      userId: 'userId',
      createdDate: new Date('2021-12-02T04:54:06.472Z')
    };
    const outputObject = {
      $set: {
        [mongoDbTables.story.replyFlagged]: true,
        [mongoDbTables.story.replyUpdatedAt]: new Date()
      }
    };
    const res = service.getUpdateCommentQuery(
      flaggedComment,
      '60a3589d9c336e882b19bbef',
      inputFlagLog,
      storyReactionsType[2]
    );
    expect(res['$set']).toEqual(outputObject['$set']);
  });

  it('getUpdateCommentQuery - query for comment without userlog', () => {
    const inputFlagLog = {
      userId: 'userId',
      createdDate: new Date('2021-12-02T04:54:06.472Z')
    };
    const outputObject = {
      $set: {
        [mongoDbTables.story.replyFlagged]: true,
        [mongoDbTables.story.replyUpdatedAt]: new Date()
      },
      $push: {
        [mongoDbTables.story.replyFlaggedLog]: inputFlagLog
      }
    };
    const res = service.getUpdateCommentQuery(
      flaggedComment,
      '60a3589d9c336e882b19bcef',
      inputFlagLog,
      storyReactionsType[2]
    );
    expect(res['$push']).toEqual(outputObject['$push']);
  });

  it('createCommentObject - success', async () => {
    const request = {
      comment: 'comment',
      isCommentTextProfane: false
    };
    const userId = '617568ee2de22014dc3d3b6e';
    jest
      .spyOn(MongoDatabaseClient.prototype, 'readByID')
      .mockImplementation(() => {
        return Promise.resolve(usersListRaw[0]);
      });
    const res = await service.createCommentObject(request, userId);
    expect(res.author.id).toEqual(new ObjectId(userId));
    expect(res.author.displayName).toEqual('Test Name');
    expect(res.comment).toEqual('comment');
    expect(res.removed).toEqual(false);
  });
});
