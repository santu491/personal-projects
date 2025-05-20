import { TranslationLanguage } from '@anthem/communityapi/common';
import {
  mockEmail,
  mockMongo,
  mockPostImage,
  mockReactionHelper,
  mockResult,
  mockUser,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { APP } from '@anthem/communityapi/utils';
import { PageParam } from 'api/communityresources/models/pageParamModel';
import {
  CommentRequest,
  DeleteCommentRequest,
  ReactionRequest,
  ReplyRequest
} from 'api/communityresources/models/postsModel';
import { ObjectId } from 'mongodb';
import { CommentHelper } from '../helpers/commentHelper';
import { NotificationHelper } from '../helpers/notificationHelper';
import { PostsHelper } from '../helpers/postsHelper';
import { PostsService } from '../postsService';

describe('PostsService', () => {
  let svc: PostsService;
  let updateContent;
  let getCommentCount;
  let buildPostObject;
  let upsertPostReaction;
  let upsertCommentReaction;
  let upsertReplyReaction;

  const authorId = '61965e0de4cece637614e1c3';
  const postId = '61965e0de4cece637614e1c3';
  const commentId = '61a69c8600791e17b05145e8';

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
    username: 'test',
    password: 'tst12',
    service: '123'
  };
  APP.config.smtpSettings = smtpSettings;

  const post = {
    communities: ['5f245386aa271e24b0c6fd88'],
    content: {
      en: {
        title: 'Fresh New post 22',
        body: 'New post body.',
        link: '',
        deepLink: ''
      },
      es: {
        title: '',
        body: '',
        link: '',
        deepLink: ''
      },
      image: ''
    },
    createdDate: '2022-01-11T07:31:44.112Z',
    updatedDate: '2022-01-11T07:31:44.112Z',
    published: true,
    isNotify: true,
    hasContentBeenPublishedOnce: false,
    flagged: false,
    removed: false,
    author: {
      firstName: 'Raven',
      lastName: 'P',
      displayName: 'Raven P',
      role: 'scadvocate',
      id: '61b21e9c26dbb012b69cf67f',
      profileImage: '',
      displayTitle: 'Community Advocate'
    },
    comments: [
      {
        _id: '61e1593ced4916dc990d7b5e',
        comment: 'Admin Comment',
        createdAt: '2022-01-14T11:06:36.215Z',
        updatedAt: '2022-01-14T11:06:36.215Z',
        flagged: false,
        removed: false,
        author: {
          id: '61b21e9c26dbb012b69cf67f',
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          displayTitle: 'Community Advocate',
          profileImage: '',
          role: 'scadvocate'
        },
        replies: [
          {
            _id: '61e15962ed4916dc990d7b5f',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:07:14.535Z',
            updatedAt: '2022-01-14T11:07:14.535Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            }
          }
        ]
      }
    ],
    _id: postId,
    id: postId
  };

  const community = {
    createdBy: '1e6e6f123bd56464475293af',
    title: 'Prostate Cancer',
    category: 'Prostate Cancer',
    categoryId: '5f875a0854fdb7a2c9ae9d13',
    type: 'clinical',
    parent: 'Cancer',
    createdDate: {},
    createdAt: {},
    updatedAt: {},
    displayName: {
      en: 'Prostate Cancer',
      es: 'Cancer de prostata'
    },
    id: '5f245386aa271e24b0c6fd88'
  };

  const adminUser = {
    username: 'az00002',
    role: 'scadvocate',
    firstName: 'Raven',
    lastName: 'P',
    displayName: 'Raven P',
    displayTitle: 'Community Advocate',
    profileImage: '',
    password:
      'ced892cf12edf9fffa4abc2966afd106f02f46bd52e8b83eb4b5f7543972d6b6',
    createdAt: {},
    updatedAt: {},
    id: '61b21e9c26dbb012b69cf67f'
  };

  beforeEach(() => {
    svc = new PostsService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockEmail,
      <any>mockValidation,
      <any>mockPostImage,
      <any>mockUser,
      <any>mockILogger
    );
    // createCommentObject = jest.spyOn(PostsService.prototype as any, 'createCommentObject');
    // createActivityObject = jest.spyOn(PostsService.prototype as any, 'createActivityObject');
    updateContent = jest.spyOn(PostsHelper.prototype as any, 'updateContent');
    getCommentCount = jest.spyOn(
      CommentHelper.prototype as any,
      'getCommentCount'
    );
    buildPostObject = jest.spyOn(
      PostsService.prototype as any,
      'buildPostObject'
    );
    upsertPostReaction = jest.spyOn(
      PostsService.prototype as any,
      'upsertPostReaction'
    );
    upsertCommentReaction = jest.spyOn(
      PostsService.prototype as any,
      'upsertCommentReaction'
    );
    upsertReplyReaction = jest.spyOn(
      PostsService.prototype as any,
      'upsertReplyReaction'
    );
    // getReplyPost = jest.spyOn(PostsService.prototype as any, 'getReplyPost');
    // hasUserFlagged = jest.spyOn(PostsService.prototype as any, 'hasUserFlagged');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('UpsertComment - Edit a comment', async () => {
    const payload: CommentRequest = {
      id: commentId,
      postId: postId,
      comment: 'Comment',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: 'New Comment',
          createdAt: {},
          updatedAt: {},
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: 'AuthorId',
            firstName: 'PHOEBE',
            lastName: 'STINSON',
            displayName: ''
          },
          id: 'NewID'
        }
      }
    };
    mockMongo.readByID.mockReturnValueOnce(post).mockReturnValueOnce(adminUser);
    mockMongo.readByValue.mockReturnValueOnce(community).mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.upsertComment(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('GetAllPosts - sucess in EN', async () => {
    const pageParam: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };

    const multiplePost = [
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: postId
      },
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: '61b21e9c26dbb012b69cf67f'
      },
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: '61b21e9c26dbb012b69cf67f'
      }
    ];
    const published = true;
    const userId = authorId;
    const language = TranslationLanguage.ENGLISH;
    const resPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        title: 'Fresh New post 22',
        body: 'New post body.',
        link: '<url>',
        deepLink: '<string>',
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: false,
      hasContentBeenPublishedOnce: true,
      flagged: false,
      removed: false,
      editedAfterPublish: false,
      author: {
        firstName: '',
        lastName: '',
        displayName: 'Sydney Community',
        role: 'scadmin',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: ''
      },
      id: '61dd326072ca93197fa8794d',
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null',
      commentCount: 0
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [resPost, resPost, resPost]
      }
    };
    mockMongo.readAllByValue.mockReturnValue(multiplePost);
    updateContent.mockImplementation((content, language) => {
      return {
        content: { ...content[language], image: content.image }
      };
    });
    mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null'
    });
    getCommentCount.mockImplementation((c) => {
      return c.comments.length;
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    jest.spyOn(PostsHelper.prototype, 'formatPosts').mockImplementation(() => {
      return Promise.resolve();
    });
    const resData = await svc.getAllPosts(
      pageParam,
      published,
      userId,
      language
    );
    expect(resData).toEqual(expRes);
  });

  it('GetAllPostsForCommunity - for a community', async () => {
    const pageParam: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };

    const multiplePost = [
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: postId
      },
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: '61b21e9c26dbb012b69cf67f'
      },
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: '61b21e9c26dbb012b69cf67f'
      }
    ];
    const published = true;
    const userId = authorId;
    const language = TranslationLanguage.ENGLISH;
    const communityId = '5f245386aa271e24b0c6fd88';
    const resPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        title: 'Fresh New post 22',
        body: 'New post body.',
        link: '<url>',
        deepLink: '<string>',
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: false,
      hasContentBeenPublishedOnce: true,
      flagged: false,
      removed: false,
      editedAfterPublish: false,
      author: {
        firstName: '',
        lastName: '',
        displayName: 'Sydney Community',
        role: 'scadmin',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: ''
      },
      id: '61dd326072ca93197fa8794d',
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null',
      commentCount: 0
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [resPost, resPost, resPost]
      }
    };
    mockMongo.readAllByValue.mockReturnValue(multiplePost);
    updateContent.mockImplementation((content, language) => {
      return {
        content: { ...content[language], image: content.image }
      };
    });
    mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null'
    });
    getCommentCount.mockImplementation((c) => {
      return c.comments.length;
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    jest.spyOn(PostsHelper.prototype, 'formatPosts').mockImplementation(() => {
      return Promise.resolve();
    });
    const resData = await svc.getAllPostsForCommunity(
      pageParam,
      published,
      userId,
      communityId,
      language
    );
    expect(resData).toEqual(expRes);
  });

  it('GetAllPostsForCommunity - community as null', async () => {
    const pageParam: PageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    };

    const multiplePost = [
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: postId
      },
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: '61b21e9c26dbb012b69cf67f'
      },
      {
        communities: ['5f245386aa271e24b0c6fd88'],
        content: {
          en: {
            title: 'Fresh New post 22',
            body: 'New post body.',
            link: '',
            deepLink: ''
          },
          es: {
            title: '',
            body: '',
            link: '',
            deepLink: ''
          },
          image: ''
        },
        createdDate: '2022-01-11T07:31:44.112Z',
        updatedDate: '2022-01-11T07:31:44.112Z',
        published: true,
        isNotify: true,
        hasContentBeenPublishedOnce: false,
        flagged: false,
        removed: false,
        author: {
          firstName: 'Raven',
          lastName: 'P',
          displayName: 'Raven P',
          role: 'scadvocate',
          id: '61b21e9c26dbb012b69cf67f',
          profileImage: '',
          displayTitle: 'Community Advocate'
        },
        comments: [
          {
            id: '61e1593ced4916dc990d7b5e',
            comment: 'Admin Comment',
            createdAt: '2022-01-14T11:06:36.215Z',
            updatedAt: '2022-01-14T11:06:36.215Z',
            flagged: false,
            removed: false,
            author: {
              id: '61b21e9c26dbb012b69cf67f',
              firstName: 'Raven',
              lastName: 'P',
              displayName: 'Raven P',
              displayTitle: 'Community Advocate',
              profileImage: '',
              role: 'scadvocate'
            },
            replies: [
              {
                id: '61e15962ed4916dc990d7b5f',
                comment: 'Admin Comment',
                createdAt: '2022-01-14T11:07:14.535Z',
                updatedAt: '2022-01-14T11:07:14.535Z',
                flagged: false,
                removed: false,
                author: {
                  id: '61b21e9c26dbb012b69cf67f',
                  firstName: 'Raven',
                  lastName: 'P',
                  displayName: 'Raven P',
                  displayTitle: 'Community Advocate',
                  profileImage: '',
                  role: 'scadvocate'
                }
              }
            ]
          }
        ],
        id: '61b21e9c26dbb012b69cf67f'
      }
    ];
    const published = true;
    const userId = authorId;
    const language = TranslationLanguage.ENGLISH;
    const communityId = 'null';
    const resPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        title: 'Fresh New post 22',
        body: 'New post body.',
        link: '<url>',
        deepLink: '<string>',
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: false,
      hasContentBeenPublishedOnce: true,
      flagged: false,
      removed: false,
      editedAfterPublish: false,
      author: {
        firstName: '',
        lastName: '',
        displayName: 'Sydney Community',
        role: 'scadmin',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: ''
      },
      id: '61dd326072ca93197fa8794d',
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null',
      commentCount: 0
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [resPost, resPost, resPost]
      }
    };
    mockMongo.readAllByValue.mockReturnValue(multiplePost);
    updateContent.mockImplementation((content, language) => {
      return {
        content: { ...content[language], image: content.image }
      };
    });
    mockReactionHelper.getReactionForCurrentUser.mockReturnValue({
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null'
    });
    getCommentCount.mockImplementation((c) => {
      return c.comments.length;
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    jest.spyOn(PostsHelper.prototype, 'formatPosts').mockImplementation(() => {
      return Promise.resolve();
    });
    const resData = await svc.getAllPostsForCommunity(
      pageParam,
      published,
      userId,
      communityId,
      language
    );
    expect(resData).toEqual(expRes);
  });

  it('GetPostById - success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: post
      }
    };
    const language = TranslationLanguage.ENGLISH;
    const userObj = {
      _id: '6172824a0ef89c4f30b6116d',
      username: '~sit3sub970634126',
      firstName: 'LAL',
      lastName: 'KAREEM',
      active: true,
      personId: '340147559',
      onBoardingState: 'completed',
      myCommunities: ['5f245386aa271e24b0c6fd88'],
      displayName: 'lal',
      communityHelpCardBanner: true,
      meTabHelpCardBanner: false,
      localCategoryHelpCardBanner: true,
      localServiceHelpCardBanner: true,
      updated: true,
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ]
    };
    const readByAggregateVal = [
      { ...post, commentAuthors: { ...userObj }, replyAuthors: { ...userObj } }
    ];
    mockMongo.readByAggregate.mockReturnValue(readByAggregateVal);
    buildPostObject.mockImplementation(() => {
      return post;
    });
    mockPostImage.buildPostImagePath.mockImplementation(() => {
      return Promise.resolve();
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    await svc.getPostById(postId, authorId, language);
  });

  it('GetPostById - Post not found', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Post does not exists.'
          }
        ]
      }
    };
    const language = TranslationLanguage.ENGLISH;
    const readByAggregateVal = null;
    mockMongo.readByAggregate.mockReturnValue(readByAggregateVal);

    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.getPostById(postId, authorId, language);
    expect(resData).toEqual(expRes);
  });

  it('upsertReaction - post success', async () => {
    const payload: ReactionRequest = {
      postId: postId,
      reaction: 'like',
      type: 'post',
      commentId: undefined,
      replyId: undefined,
      language: undefined
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          ...post,
          reactionCount: {
            like: 0,
            care: 0,
            celebrate: 0,
            good_idea: 0,
            total: 0
          },
          userReaction: 'null'
        }
      }
    };
    const userObj = {
      _id: '6172824a0ef89c4f30b6116d',
      username: '~sit3sub970634126',
      firstName: 'LAL',
      lastName: 'KAREEM',
      active: true,
      personId: '340147559',
      onBoardingState: 'completed',
      myCommunities: ['5f245386aa271e24b0c6fd88'],
      displayName: 'lal',
      communityHelpCardBanner: true,
      meTabHelpCardBanner: false,
      localCategoryHelpCardBanner: true,
      localServiceHelpCardBanner: true,
      updated: true,
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ]
    };
    const readByAggregateVal = [
      { ...post, commentAuthors: { ...userObj }, replyAuthors: { ...userObj } }
    ];
    mockMongo.readByAggregate.mockReturnValue(readByAggregateVal);
    buildPostObject.mockImplementation(() => {
      return expRes.data.value;
    });
    upsertPostReaction.mockImplementation(() => {
      return {
        operation: true
      };
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.upsertReaction(payload, false, authorId);
    expect(resData).toEqual(expRes);
  });

  it('upsertReaction - post fail', async () => {
    const payload: ReactionRequest = {
      postId: postId,
      reaction: 'like',
      type: 'post',
      commentId: undefined,
      replyId: undefined,
      language: TranslationLanguage.ENGLISH
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Post does not exists.'
          }
        ]
      }
    };
    const userObj = {
      _id: '6172824a0ef89c4f30b6116d',
      username: '~sit3sub970634126',
      firstName: 'LAL',
      lastName: 'KAREEM',
      active: true,
      personId: '340147559',
      onBoardingState: 'completed',
      myCommunities: ['5f245386aa271e24b0c6fd88'],
      displayName: 'lal',
      communityHelpCardBanner: true,
      meTabHelpCardBanner: false,
      localCategoryHelpCardBanner: true,
      localServiceHelpCardBanner: true,
      updated: true,
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ]
    };
    const readByAggregateVal = [
      { ...post, commentAuthors: { ...userObj }, replyAuthors: { ...userObj } }
    ];
    mockMongo.readByAggregate.mockReturnValue(readByAggregateVal);
    upsertPostReaction.mockImplementation(() => {
      return {
        operation: false
      };
    });
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.upsertReaction(payload, false, authorId);
    expect(resData).toEqual(expRes);
  });

  it('upsertReaction - comment success', async () => {
    const payload: ReactionRequest = {
      postId: postId,
      reaction: 'like',
      type: 'comment',
      commentId: '6172824a0ef89c4f30b6116d',
      replyId: undefined,
      language: TranslationLanguage.ENGLISH
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          ...post,
          reactionCount: {
            like: 0,
            care: 0,
            celebrate: 0,
            good_idea: 0,
            total: 0
          },
          userReaction: 'null'
        }
      }
    };
    const userObj = {
      _id: '6172824a0ef89c4f30b6116d',
      username: '~sit3sub970634126',
      firstName: 'LAL',
      lastName: 'KAREEM',
      active: true,
      personId: '340147559',
      onBoardingState: 'completed',
      myCommunities: ['5f245386aa271e24b0c6fd88'],
      displayName: 'lal',
      communityHelpCardBanner: true,
      meTabHelpCardBanner: false,
      localCategoryHelpCardBanner: true,
      localServiceHelpCardBanner: true,
      updated: true,
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ]
    };
    const readByAggregateVal = [
      { ...post, commentAuthors: { ...userObj }, replyAuthors: { ...userObj } }
    ];
    mockMongo.readByAggregate.mockReturnValue(readByAggregateVal);
    buildPostObject.mockImplementation(() => {
      return expRes.data.value;
    });
    upsertCommentReaction.mockImplementation(() => {
      return {
        operation: true
      };
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.upsertReaction(payload, false, authorId);
    expect(resData).toEqual(expRes);
  });

  it('upsertReaction - reply success', async () => {
    const payload: ReactionRequest = {
      postId: postId,
      reaction: 'like',
      type: 'reply',
      commentId: '6172824a0ef89c4f30b6116d',
      replyId: '6272824a0ef89c4f30b6216d',
      language: TranslationLanguage.ENGLISH
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          ...post,
          reactionCount: {
            like: 0,
            care: 0,
            celebrate: 0,
            good_idea: 0,
            total: 0
          },
          userReaction: 'null'
        }
      }
    };
    const userObj = {
      _id: '6172824a0ef89c4f30b6116d',
      username: '~sit3sub970634126',
      firstName: 'LAL',
      lastName: 'KAREEM',
      active: true,
      personId: '340147559',
      onBoardingState: 'completed',
      myCommunities: ['5f245386aa271e24b0c6fd88'],
      displayName: 'lal',
      communityHelpCardBanner: true,
      meTabHelpCardBanner: false,
      localCategoryHelpCardBanner: true,
      localServiceHelpCardBanner: true,
      updated: true,
      answerNotificationFlag: true,
      communityNotificationFlag: true,
      questionNotificationFlag: true,
      reactionNotificationFlag: true,
      tou: [
        {
          acceptedVersion: '1.0',
          acceptedTimestamp: '2022-01-03T13:30:04.322Z'
        }
      ]
    };
    const readByAggregateVal = [
      { ...post, commentAuthors: { ...userObj }, replyAuthors: { ...userObj } }
    ];
    mockMongo.readByAggregate.mockReturnValue(readByAggregateVal);
    buildPostObject.mockImplementation(() => {
      return expRes.data.value;
    });
    upsertReplyReaction.mockImplementation(() => {
      return {
        operation: true
      };
    });
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.upsertReaction(payload, false, authorId);
    expect(resData).toEqual(expRes);
  });

  it('UpsertReply - edit reply', async () => {
    const payload: ReplyRequest = {
      id: '61e15962ed4916dc990d7b5f',
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      comment: 'Test Reply',
      isCommentTextProfane: false
    };
    const community = {
      title: 'Some Community'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockMongo.readByValue.mockReturnValueOnce(post).mockReturnValue(post);
    mockMongo.readByID.mockReturnValue(community);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.upsertReply(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('RemoveComment - Comment does not exist', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Comment does not exists.'
          }
        ]
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByID.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.removeComment(
      payload,
      '61e1593ced4916dc990d7b5e'
    );
    expect(resData).toEqual(expRes);
  });

  it('RemoveComment - Comment does not exist', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Comment does not exists.'
          }
        ]
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByID.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.removeComment(
      payload,
      '61e1593ced4916dc990d7b5e'
    );
    expect(resData).toEqual(expRes);
  });

  it('RemoveComment - Check Author for comment', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '222193b2-5082-077c-345a-991fff2f19ba',
            errorCode: 400,
            title: 'Bad data',
            detail: 'User is not the author of the comment'
          }
        ]
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByID.mockReturnValue(commentPost);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.removeComment(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('RemoveComment - remove comment successfully', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByID.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.removeComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('UpsertReply - create reply to non admin user', async () => {
    const payload: ReplyRequest = {
      id: undefined,
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      comment: 'Test Reply',
      isCommentTextProfane: false
    };
    const community = {
      title: 'Some Community'
    };
    mockMongo.readByValue
      .mockReturnValueOnce(post)
      .mockReturnValueOnce(null)
      .mockReturnValue(post);
    mockMongo.readByID.mockReturnValue(adminUser);
    mockMongo.readByID
      .mockReturnValueOnce(community)
      .mockReturnValueOnce(adminUser)
      .mockReturnValue(adminUser);
    mockMongo.updateByQuery.mockReturnValue(1);
    jest
      .spyOn(NotificationHelper.prototype, 'notifyUser')
      .mockImplementation(() => {
        return Promise.resolve();
      });
    mockResult.createSuccess.mockReturnValue(post);
    const resData = await svc.upsertReply(payload, authorId);
    expect(resData).toEqual(post);
  });

  it('UpsertReply - comment does not exist', async () => {
    const payload: ReplyRequest = {
      id: '61e15962ed4916dc990d7b5f',
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      comment: 'Test Reply',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Comment does not exists.'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.upsertReply(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('UpsertComment - Post check', async () => {
    const payload: CommentRequest = {
      id: undefined,
      postId: postId,
      comment: 'Comment',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Post does not exists.'
          }
        ]
      }
    };
    mockMongo.readByID.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);

    const resData = await svc.upsertComment(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('UpsertComment - create a comment', async () => {
    const payload: CommentRequest = {
      id: undefined,
      postId: postId,
      comment: 'Comment',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: 'New Comment',
          createdAt: {},
          updatedAt: {},
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: 'AuthorId',
            firstName: 'PHOEBE',
            lastName: 'STINSON',
            displayName: ''
          },
          id: 'NewID'
        }
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByID
      .mockReturnValueOnce(commentPost)
      .mockReturnValue(adminUser);
    mockMongo.readByValue
      .mockReturnValueOnce(community)
      .mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockEmail.htmlForReply.mockReturnValue(true);
    mockEmail.sendEmailMessage.mockReturnValue(true);
    jest
      .spyOn(NotificationHelper.prototype, 'notifyUser')
      .mockImplementation(() => {
        return Promise.resolve();
      });
    mockResult.createSuccess.mockReturnValue(expRes);
    const toHexString = jest.spyOn(ObjectId.prototype as any, 'toHexString');
    toHexString.mockImplementation(() => {
      return 'hexString';
    });

    const resData = await svc.upsertComment(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('UpsertComment - Comment check', async () => {
    const payload: CommentRequest = {
      id: commentId,
      postId: postId,
      comment: 'Comment',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Comment does not exists.'
          }
        ]
      }
    };
    mockMongo.readByID.mockReturnValue(post);
    mockMongo.readByValue.mockReturnValue(community);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.upsertComment(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('UpsertReply - Reply does not exist', async () => {
    const payload: ReplyRequest = {
      id: '61e15962ed4916dc990d7b5f',
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      comment: 'Test Reply',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Comment does not exists.'
          }
        ]
      }
    };
    const community = {
      title: 'Some Community'
    };
    mockMongo.readByID.mockReturnValue(community);
    mockMongo.readByValue.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.upsertReply(payload, authorId);
    expect(resData).toEqual(expRes);
  });

  it('ReportComment - report comment successfully', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockMongo.readByValue.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    mockMongo.readByID.mockReturnValue(adminUser);
    mockEmail.htmlForFlagComment.mockReturnValue(true);
    mockEmail.sendEmailMessage.mockReturnValue(true);
    const resData = await svc.reportComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('UpsertReply - create reply to admin user', async () => {
    const payload: ReplyRequest = {
      id: undefined,
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      comment: 'Test Reply',
      isCommentTextProfane: false
    };
    const community = {
      title: 'Some Community'
    };
    mockMongo.readByValue
      .mockReturnValueOnce(post)
      .mockReturnValueOnce(community)
      .mockReturnValueOnce(adminUser)
      .mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(1);
    jest
      .spyOn(NotificationHelper.prototype, 'notifyUser')
      .mockImplementation(() => {
        return Promise.resolve();
      });
    mockResult.createSuccess.mockReturnValue(post);
    const resData = await svc.upsertReply(payload, authorId);
    expect(resData).toEqual(post);
  });

  it('RemoveComment - remove reply successfully', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: '61e15962ed4916dc990d7b5f'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockMongo.readByID.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await svc.removeComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('RemoveComment - Check Author for reply', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: '61e15962ed4916dc990d7b5f'
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '222193b2-5082-077c-345a-991fff2f19ba',
            errorCode: 400,
            title: 'Bad data',
            detail: 'User is not the author of the comment'
          }
        ]
      }
    };
    mockMongo.readByID.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.removeComment(
      payload,
      '61e1593ced4916dc990d7b5e'
    );
    expect(resData).toEqual(expRes);
  });

  it('CheckForKeywords - empty return', async () => {
    const comment = 'comment';
    const communityName = 'community';
    const postTitle = 'postTitle';
    const userId = '61e1593ced4916dc990d7b5e';
    const type = 'comment';
    const commentId = '61e1593ced4916dc990d7b5e';
    const replyId = '61e15962ed4916dc990d7b5f';
    mockValidation.identifySpecialKeyWords.mockReturnValue(false);
    const resData = await svc.checkForKeyWords(
      comment,
      communityName,
      authorId,
      postTitle,
      userId,
      postId,
      type,
      commentId,
      replyId
    );
    expect(resData).toEqual(undefined);
  });

  it('CheckForKeywords - functionality', async () => {
    const comment = 'comment';
    const communityName = 'community';
    const postTitle = 'postTitle';
    const userId = '61e1593ced4916dc990d7b5e';
    const type = 'comment';
    const commentId = '61e1593ced4916dc990d7b5e';
    const replyId = '61e15962ed4916dc990d7b5f';
    mockValidation.identifySpecialKeyWords.mockReturnValue(true);
    mockEmail.htmlForKeywords.mockReturnValue('message');
    mockEmail.sendEmailMessage.mockReturnValue(true);
    const resData = await svc.checkForKeyWords(
      comment,
      communityName,
      authorId,
      postTitle,
      userId,
      postId,
      type,
      commentId,
      replyId
    );
    expect(resData).toEqual(undefined);
  });

  it('ReportComment - report comment successfully - already flagged', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          flaggedUserLog: [
            {
              userId: '615adaaba0e10b0023ad3639',
              createdDate: '2022-02-04T15:06:29.981Z'
            }
          ],
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByValue.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    mockMongo.readByID.mockReturnValue(adminUser);
    const resData = await svc.reportComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('ReportComment - report comment successfully - Not flagged by that user', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          flaggedUserLog: [
            {
              userId: '615adaaba0e10b0023ad3639',
              createdDate: '2022-02-04T15:06:29.981Z'
            }
          ],
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              }
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByValue.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    mockMongo.readByID.mockReturnValue(adminUser);
    mockEmail.htmlForFlagComment.mockReturnValue(true);
    mockEmail.sendEmailMessage.mockReturnValue(true);
    const resData = await svc.reportComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('ReportComment - report reply successfully - already flagged', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: '61e15962ed4916dc990d7b5f'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          flaggedUserLog: [
            {
              userId: '615adaaba0e10b0023ad3639',
              createdDate: '2022-02-04T15:06:29.981Z'
            }
          ],
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              },
              flaggedUserLog: [
                {
                  userId: '615adaaba0e10b0023ad3639',
                  createdDate: '2022-02-04T15:06:29.981Z'
                }
              ]
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByValue.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockMongo.readByID.mockReturnValue(adminUser);
    const resData = await svc.reportComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('ReportComment - report reply successfully - Not flagged by that user', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: '61e15962ed4916dc990d7b5f'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const commentPost = {
      communities: ['5f245386aa271e24b0c6fd88'],
      content: {
        en: {
          title: 'Fresh New post 22',
          body: 'New post body.',
          link: '',
          deepLink: ''
        },
        es: {
          title: '',
          body: '',
          link: '',
          deepLink: ''
        },
        image: ''
      },
      createdDate: '2022-01-11T07:31:44.112Z',
      updatedDate: '2022-01-11T07:31:44.112Z',
      published: true,
      isNotify: true,
      hasContentBeenPublishedOnce: false,
      flagged: false,
      removed: false,
      author: {
        firstName: 'Raven',
        lastName: 'P',
        displayName: 'Raven P',
        role: 'scadvocate',
        id: '61b21e9c26dbb012b69cf67f',
        profileImage: '',
        displayTitle: 'Community Advocate'
      },
      comments: [
        {
          _id: '61e1593ced4916dc990d7b5e',
          comment: 'Admin Comment',
          createdAt: '2022-01-14T11:06:36.215Z',
          updatedAt: '2022-01-14T11:06:36.215Z',
          flagged: false,
          removed: false,
          author: {
            id: '61b21e9c26dbb012b69cf67f',
            firstName: 'Raven',
            lastName: 'P',
            displayName: 'Raven P',
            displayTitle: 'Community Advocate',
            profileImage: '',
            role: 'scadvocate'
          },
          flaggedUserLog: [
            {
              userId: '615adaaba0e10b0023ad3639',
              createdDate: '2022-02-04T15:06:29.981Z'
            }
          ],
          replies: [
            {
              _id: '61e15962ed4916dc990d7b5f',
              comment: 'Admin Comment',
              createdAt: '2022-01-14T11:07:14.535Z',
              updatedAt: '2022-01-14T11:07:14.535Z',
              flagged: false,
              removed: false,
              author: {
                id: '61b21e9c26dbb012b69cf67f',
                firstName: 'Raven',
                lastName: 'P',
                displayName: 'Raven P',
                displayTitle: 'Community Advocate',
                profileImage: '',
                role: 'scadvocate'
              },
              flaggedUserLog: [
                {
                  userId: '615adaaba0e10b0023ad3639',
                  createdDate: '2022-02-04T15:06:29.981Z'
                }
              ]
            }
          ]
        }
      ],
      _id: postId
    };
    mockMongo.readByValue.mockReturnValue(commentPost);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockMongo.readByID.mockReturnValue(adminUser);
    mockEmail.htmlForFlagComment.mockReturnValue(true);
    mockEmail.sendEmailMessage.mockReturnValue(true);
    const resData = await svc.reportComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('ReportComment - report reply successfully', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: '61e15962ed4916dc990d7b5f'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockMongo.readByValue.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockMongo.readByID.mockReturnValue(adminUser);
    mockEmail.htmlForFlagComment.mockReturnValue(true);
    mockEmail.sendEmailMessage.mockReturnValue(true);
    const resData = await svc.reportComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });

  it('ReportComment - Comment does not exist', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: undefined
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Comment does not exists.'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.reportComment(
      payload,
      '61e1593ced4916dc990d7b5e'
    );
    expect(resData).toEqual(expRes);
  });

  it('RemoveComment - Reply does not exist', async () => {
    const payload: DeleteCommentRequest = {
      postId: postId,
      commentId: '61e1593ced4916dc990d7b5e',
      replyId: '61e15962ed4916dc990d7b5f'
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '0b471e52-80ab-d83a-f9b4-ce30d82cfc12',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Reply does not exists.'
          }
        ]
      }
    };
    mockMongo.readByID.mockReturnValue(post);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await svc.removeComment(
      payload,
      '61b21e9c26dbb012b69cf67f'
    );
    expect(resData).toEqual(expRes);
  });
});
