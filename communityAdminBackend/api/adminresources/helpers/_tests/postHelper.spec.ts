import { mockMongo, mockResult, mockSchedule, mockSqsService } from "@anthem/communityadminapi/common/baseTest";
import { mockILogger } from "@anthem/communityadminapi/logger/mocks/mockILogger";
import { Admin } from "api/adminresources/models/adminUserModel";
import { Author, CommentRequest, Post, PostRequest } from "api/adminresources/models/postsModel";
import { PostHelperService } from "../postHelper";

describe('PostHelperService', () => {
  let postHelper: PostHelperService;
  let publishPost;
  let notifyOnNewPost;

  beforeEach(() => {
    postHelper = new PostHelperService(<any>mockResult, <any>mockMongo, <any>mockSqsService, <any>mockSchedule, <any>mockILogger);
    publishPost = jest.spyOn(PostHelperService.prototype as any, 'publishPost');
    notifyOnNewPost = jest.spyOn(PostHelperService.prototype as any, 'notifyOnNewPost');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const post: Post = {
    "communities": [
      "60e2e7277c37b43a668a32f2"
    ],
    "content": {
      "en": {
        "title": "New set of posts",
        "body": "new test post",
        "deepLink": {
          "url": "me/join-community",
          "label": "Join Community"
        },
        "poll": null
      },
      "es": {
        "title": "New set of posts",
        "body": "new test post",
        "deepLink": {
          "url": "me/join-community",
          "label": "únete a la comunidad"
        },
        "poll": null
      },
      "image": "testImage",
      "link": {
        isImageUploaded: false,
        imageBase64: '',
        imageLink: 'link',
        en: {
          url: '',
          title: '',
          description: ''
        },
        es: {
          url: '',
          title: '',
          description: ''
        }
      },
      pnDetails: {
        title: '',
        body: ''
      }
    },
    "createdDate": new Date(),
    "updatedDate": new Date(),
    "published": true,
    "isNotify": false,
    "hasContentBeenPublishedOnce": false,
    "flagged": false,
    "removed": false,
    "editedAfterPublish": false,
    "author": {
      "firstName": "test",
      "lastName": "test",
      "role": "scadmin",
      "displayName": "test",
      "displayTitle": "test",
      "profileImage": "test",
      "id": "620f6b36201af71c6b942f20"
    },
    "id": "6214d582003cacb81f9ff737",
    comments: [],
    reactions: {
      count: {
        'care': 0,
        'celebrate': 0,
        'good_idea': 0,
        'like': 0,
        'total': 0
      },
      log: []
    },
    publishedAt: new Date(),
    createdBy: "",
    updatedBy: "",
    isProfane: false,
    status: "",
    publishOn: ""
  };

  const postRequest: PostRequest ={
    "communities": ["60e2e7277c37b43a668a32f2"],
    "content": {
      "en": {
        "title": "New set of posts",
        "body": "new test post",
        "deepLink": {
          "url": "me/join-community",
          "label": "Join Community"
        },
        "poll": null
      },
      "es": {
        "title": "New set of posts",
        "body": "new test post",
        "deepLink": {
          "url": "me/join-community",
          "label": "únete a la comunidad"
        },
        "poll": null
      },
      "image": "",
      "link": {
        isImageUploaded: false,
        imageBase64: '',
        imageLink: 'link',
        en: {
          url: '',
          title: '',
          description: ''
        },
        es: {
          url: '',
          title: '',
          description: ''
        }
      },
      pnDetails: {
        title: '',
        body: ''
      }
    },
    "published": false,
    "isNotify": false,
    id: "postId",
    author: new Author,
    isProfane: false,
    publishOn: ""
  }

  const adminUser: Admin = {
    "username": "az00001",
    "role": "scadmin",
    "firstName": "Admin",
    "lastName": "SydCom",
    "displayName": "Sydney Community",
    "displayTitle": "",
    "profileImage": "",
    "createdAt": new Date(),
    "updatedAt": new Date(),
    "password": "password",
    "id": "61b21e9c26dbb012b69cf67e",
    category: "",
    active: false,
    communities: [],
    isPersona: false,
    location: "",
    aboutMe: ""
  };

  /* upsertPostHelper */
  it('Should trigger the PN on post publish: new post', async () => {
    post.published = true;
    post.isNotify = true;
    await publishPost.mockImplementation(() => {
      return;
    });

    await notifyOnNewPost.mockImplementation(() => {
      return;
    });

    await postHelper.upsertPostHelper(post, postRequest, true);

  });

  it('Should trigger the PN on post publish: draft post', async () => {
    post.published = true;
    post.isNotify = true;

    await publishPost.mockImplementation(async () => {
      return;
    });

    await notifyOnNewPost.mockImplementation(async () => {
      return;
    });

    await postHelper.upsertPostHelper(post, postRequest, false);
  });

  /* createCommentObject */
  it('Should create Comment', () => {
    const request: CommentRequest = {
      id: "id",
      postId: "postId",
      comment: "commentId",
      isProfane: false
    };
    postHelper.createCommentObject(request, adminUser);
  });

  /* createReactionObject */
  it('Should create request Object', () => {
    postHelper.createReactionObject();
  });

  it('updateBinderPost - should update successcully', async () => {
    mockMongo.updateManyByQuery.mockReturnValue(1);
    postHelper.updateBinderPost(post);
  });

});
