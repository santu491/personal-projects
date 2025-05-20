import { TranslationLanguage } from "@anthem/communityapi/common";
import { mockMongo, mockUserHelper } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { APP } from "@anthem/communityapi/utils";
import { ObjectId } from "mongodb";
import { PostsHelper } from "../../helpers/postsHelper";
import { ReactionHelper } from "../../helpers/reactionHelper";
import { UserHelper } from "../../helpers/userHelper";

describe('Posts Helper', () => {
  let service;

  beforeEach(() => {
    service = new PostsHelper(<any>mockMongo,<any>mockUserHelper, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const comments = [
    {
      comment: "Admin comment",
      createdAt: {
      },
      updatedAt: {
      },
      flagged: false,
      removed: false,
      author: {
        id: "6197d6364b8aa1e7702a13e3",
        firstName: "Admin",
        lastName: "",
        displayName: "Sydney Community",
        displayTitle: "",
        profileImage: "",
        role: "scadmin",
      },
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 1,
        good_idea: 1,
        total: 2,
      },
      userReaction: "null",
      id: "61f93e6130a1d5002f36e6b2",
      userFlagged: false,
    },
    {
      _id: "61f93e8aca70b400247d611e",
      comment: "User reply/n",
      createdAt: {
      },
      updatedAt: {
      },
      flagged: false,
      removed: false,
      isCommentTextProfane: false,
      author: {
        id: "611b89667f07f467cae13a44",
        firstName: "GA",
        lastName: "JONES",
        displayName: "Test",
      },
      replies: [
        {
          comment: "admin reply",
          createdAt: {
          },
          updatedAt: {
          },
          flagged: false,
          removed: false,
          author: {
            id: "6197d6364b8aa1e7702a13e3",
            firstName: "Admin",
            lastName: "",
            displayName: "Sydney Community",
            displayTitle: "",
            profileImage: "",
            role: "scadmin",
          },
          reactionCount: {
            like: 0,
            care: 0,
            celebrate: 0,
            good_idea: 1,
            total: 1,
          },
          userReaction: "null",
          id: "61f93ec1c5c36c0024a461a7",
          userFlagged: false,
        },
      ],
      reactionCount: {
        like: 1,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 1,
      },
      userReaction: "null",
    },
    {
      comment: "Test ",
      createdAt: {
      },
      updatedAt: {
      },
      flagged: false,
      removed: false,
      isCommentTextProfane: false,
      author: {
        id: "611b89667f07f467cae13a44",
        firstName: "GA",
        lastName: "JONES",
        displayName: "",
      },
      reactionCount: {
        like: 0,
        care: 1,
        celebrate: 0,
        good_idea: 0,
        total: 1,
      },
      userReaction: "null",
      id: "61fbae0016fe660023ef9657",
      userFlagged: false,
    },
    {
      comment: "Ffff",
      createdAt: {
      },
      updatedAt: {
      },
      flagged: false,
      removed: false,
      isCommentTextProfane: false,
      author: {
        id: "611b89667f07f467cae13a44",
        firstName: "GA",
        lastName: "JONES",
        displayName: "",
      },
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0,
      },
      userReaction: "null",
      id: "61fbc0ef16fe660023ef966a",
      userFlagged: false,
    },
  ];

  const post = {
    communities: [
      "5f245386aa271e24b0c6fd88",
    ],
    content: {
      en: {
        title: "Fresh New post 22",
        body: "New post body.",
        link: "",
        deepLink: "",
      },
      es: {
        title: "",
        body: "",
        link: "",
        deepLink: "",
      },
      image: "",
    },
    createdDate: "2022-01-11T07:31:44.112Z",
    updatedDate: "2022-01-11T07:31:44.112Z",
    published: true,
    isNotify: true,
    hasContentBeenPublishedOnce: false,
    flagged: false,
    removed: false,
    author: {
      firstName: "Raven",
      lastName: "P",
      displayName: "Raven P",
      role: "scadvocate",
      id: "61b21e9c26dbb012b69cf67f",
      profileImage: "",
      displayTitle: "Community Advocate",
    },
    id: 'postId',
    comments: comments
  };

  it('addAuthor - success', async () => {
    const authors = [
      {
        _id: "611b89667f07f467cae13a44",
        username: "~sit3gajones",
        firstName: "GA",
        lastName: "JONES",
        active: true,
        personId: "700203802",
        tou: [
          {
            acceptedVersion: "1.0",
            acceptedTimestamp: {
            },
          },
        ],
        onBoardingState: "completed",
        communityHelpCardBanner: true,
        meTabHelpCardBanner: true,
        myCommunities: [
          "60e2e7277c37b43a668a32f2",
          "6214e8959aa982c0d09b40f5",
          "607e7c99d0a2b533bb2ae3d2",
          "60a358bc9c336e882b19bbf0",
        ],
        answerNotificationFlag: true,
        communityNotificationFlag: true,
        questionNotificationFlag: true,
        reactionNotificationFlag: true,
        localServiceHelpCardBanner: true,
        profilePicture: "18e11c25-0d38-1a7e-b453-d513accd4c3c.jpg",
        displayName: "Iron Man",
        localCategoryHelpCardBanner: true,
        localCategories: [
          "61013eb670dbd030d83c8c61",
        ],
        commentReactionNotificationFlag: true,
        replyNotificationFlag: true,
        cancerCommunityCard: true,
      }
    ];
    jest.spyOn(UserHelper.prototype, 'buildProfilePicturePath').mockImplementation((id) => {
      return Promise.resolve(APP.config.restApi.userProfile.BaseUrlPath + id);
    });
    const res = await service.addAuthor(comments, authors);
    expect(res).toBe(undefined);
  });

  it('addAuthor - No Object', async () => {
    const authors = [
      {
        _id: new ObjectId("60e2e7277c37b43a668a32f2"),
        username: "~sit3gajones",
        firstName: "GA",
        lastName: "JONES",
        active: true,
        personId: "700203802",
        tou: [
          {
            acceptedVersion: "1.0",
            acceptedTimestamp: {
            },
          },
        ],
        onBoardingState: "completed",
        communityHelpCardBanner: true,
        meTabHelpCardBanner: true,
        myCommunities: [
          "60e2e7277c37b43a668a32f2",
          "6214e8959aa982c0d09b40f5",
          "607e7c99d0a2b533bb2ae3d2",
          "60a358bc9c336e882b19bbf0",
        ],
        answerNotificationFlag: true,
        communityNotificationFlag: true,
        questionNotificationFlag: true,
        reactionNotificationFlag: true,
        localServiceHelpCardBanner: true,
        profilePicture: "18e11c25-0d38-1a7e-b453-d513accd4c3c.jpg",
        displayName: "Iron Man",
        localCategoryHelpCardBanner: true,
        localCategories: [
          "61013eb670dbd030d83c8c61",
        ],
        commentReactionNotificationFlag: true,
        replyNotificationFlag: true,
        cancerCommunityCard: true,
      }
    ];
    jest.spyOn(UserHelper.prototype, 'buildProfilePicturePath').mockImplementation((userId) => {
      return Promise.resolve(APP.config.restApi.userProfile.BaseUrlPath + userId);
    });
    const res = await service.addAuthor(comments, authors);
    expect(res).toBe(undefined);
  });

  it('mapAuthorToPost - null', async () => {
    mockMongo.readByID.mockReturnValue(null);
    await service.mapAuthorToPost(post, "authorId");
  });

  it('mapAuthorToPost - success', async () => {
    mockMongo.readByID.mockReturnValue({
      _id: "611b89667f07f467cae13a44",
      username: "~sit3gajones",
      firstName: "GA",
      lastName: "JONES",
      active: true,
      personId: "700203802",
      displayName: "Iron Man",
      localCategoryHelpCardBanner: true,
    });
    await service.mapAuthorToPost(post, "authorId");
  });

  it('updateContent - English', () => {
    const content = {
      en: {
        title: "ME Ways we can Help",
        body: "ME Ways we can Help",
        link: "",
        deepLink: "me/ways-we-can-help"
      },
      es: {
        title: "ME Ways we can Help - spanish",
        body: "ME Ways we can Help - spanish",
        link: "",
        deepLink: "me/ways-we-can-help"
      },
      image: ""
    };
    const res = service.updateContent(content, TranslationLanguage.ENGLISH);
    expect(res).toEqual({ ...content.en, image: content.image });
  });

  it('updateContent - Espanol', () => {
    const content = {
      en: {
        title: "ME Ways we can Help",
        body: "ME Ways we can Help",
        link: "",
        deepLink: "me/ways-we-can-help"
      },
      es: {
        title: "ME Ways we can Help - spanish",
        body: "ME Ways we can Help - spanish",
        link: "",
        deepLink: "me/ways-we-can-help"
      },
      image: ""
    };
    const res = service.updateContent(content, TranslationLanguage.SPANISH);
    expect(res).toEqual({ ...content.es, image: content.image });
  });

  it('updateContent - Default English', () => {
    const content = {
      en: {
        title: "ME Ways we can Help",
        body: "ME Ways we can Help",
        link: "",
        deepLink: "me/ways-we-can-help"
      },
      es: {
        title: "",
        body: "",
        link: "",
        deepLink: ""
      },
      image: ""
    };
    const res = service.updateContent(content, TranslationLanguage.SPANISH);
    expect(res).toEqual({ ...content.en, image: content.image });
  });

  it('formatPosts - success', async () => {
    jest.spyOn(ReactionHelper.prototype, 'getReactionForCurrentUser').mockImplementation(() => {
      return { reactionCount: { like: 0, care: 0, celebrate: 1, good_idea: 0, total: 1 }, userReaction: null };
    });
    const res = await service.formatPosts(post, "611b89667f07f467cae13a44", TranslationLanguage.ENGLISH);
    expect(res).toBe(undefined);
  });
});
