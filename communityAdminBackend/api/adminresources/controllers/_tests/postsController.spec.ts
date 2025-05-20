import { API_RESPONSE, ValidationResponse } from '@anthem/communityadminapi/common';
import { mockPostService, mockRequestValidator, mockResult, mockValidation } from '@anthem/communityadminapi/common/baseTest';
import { Author, CommentRequest, PostRequest, ReplyRequest } from 'api/adminresources/models/postsModel';
import { PostsController } from '../postsController';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(() => {
    controller = new PostsController(<any>mockPostService, <any>mockResult, <any>mockValidation, <any>mockRequestValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockifiedUserContext = jest.fn().mockReturnValue(
    '{"id":"61b21e9c26dbb012b69cf67e","name":"az00001","active":"true","role":"scadmin","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
  );

  const payload: PostRequest = {
    communities: ["5f9ab4ec2ebea500072e6e48"],
    content: {
      en: {
        title: "titlee-en",
        body: "body",
        deepLink: {
          url: 'test',
          label: 'test'
        },
        poll: null
      },
      es: {
        title: "titlee-en",
        body: "body",
        deepLink: {
          url: 'test',
          label: 'test'
        },
        poll: null
      },
      pnDetails: {
        title: "title",
        body: "body",
      },
      image: "",
      link: {
        en: {
          url: '',
          title: '',
          description: ''
        },
        es: {
          url: '',
          title: '',
          description: ''
        },
        isImageUploaded: false,
        imageBase64: '',
        imageLink: ''
      }
    },
    published: false,
    isNotify: true,
    id: '',
    author: new Author,
    isProfane: false,
    publishOn: ''
  };

  /* upsertPost */
  it('Should create/update post: admin user error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertPost(payload);
    expect(res).toEqual(expRes);
  });

  it('Should create/update post: model error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.incorrectModel
        },
      },
    };

    const validation: ValidationResponse = {
      validationResult: false,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.isValidPostModel.mockReturnValue(validation);

    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertPost(payload);
    expect(res).toEqual(expRes);
  });

  it('Should create/update post: communities id error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail:  API_RESPONSE.messages.invalidCommunities
        },
      },
    };

    const validation: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.isValidPostModel.mockReturnValue(validation);

    mockResult.createError.mockReturnValue(expRes);
    await controller.upsertPost(payload);
  });

  it('Should create/update post: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          communities: ["5f9ab4ec2ebea500072e6e48"],
          authorId: "5f9ab4ec2ebea500072e6e47",
          authorRole: "SCAdmin",
          content: {
            en: {
              title: "titlee-en",
              body: "body",
              link: "",
              deepLink: "",
            },
            es: {},
            image: "",
          },
          updatedDate: "2021-11-18T05:26:32.253Z",
          published: false,
          isNotify: true,
          flagged: false,
          removed: false,
          hasContentBeenPublishedOnce: false,
          createdDate: "2021-11-18T05:25:14.187Z",
          id: "6195e3c2a22e24ae1b517e0d",
        },
      },
    };

    const validation: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.isValidPostModel.mockReturnValue(validation);
    mockPostService.upsertPost.mockReturnValue(expRes);
    const res = await controller.upsertPost(payload);
    expect(res).toEqual(expRes);
  });

  it('Should create/update post: exception', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    })
    await controller.upsertPost(payload);
  });

  /* deletePost */
  it("Should delete a post: admin user error", async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.deletePost("6195fb9f3dec1863a94c0b53");
    expect(data).toEqual(expRes);
  });

  it("Should delete a post: postId error", async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.deletePost("xxx");
    expect(data).toEqual(expRes);
  });

  it("Should delete a post: exception", async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    })
    await controller.deletePost("xxx");
  });

  it("Should delete a post: success", async () => {
    const expRes = {
      data: {
        "isSuccess": true,
        "isException": false,
        "value": {
          "operation": true
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockPostService.deletePost.mockReturnValue(expRes);
    const data = await controller.deletePost("6195fb9f3dec1863a94c0b53");
    expect(data).toEqual(expRes);
  });


  /* getPost */
  it('Should return post: admin user error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getPost('xxx', false, true);
    expect(res).toEqual(expRes);
  });

  it("Should return post: postId error", async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.getPost("xxx", false, true);
    expect(data).toEqual(expRes);
  });

  it("Should delete a post: exception", async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    })
    await controller.getPost("xxx", false, true);
  });

  it("Should delete a post: success", async () => {
    const expRes = {
      data: {
        "isSuccess": true,
        "isException": false,
        "value": {
          "operation": true
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    mockPostService.getPost.mockReturnValue(expRes);
    const data = await controller.getPost("6195fb9f3dec1863a94c0b53", false, true);
    expect(data).toEqual(expRes);
  });

  /* getAllPosts */
  it('Should get all the posts: admin user error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getAllPost(1, 10, 1, [], []);
    expect(res).toEqual(expRes);
  });

  it('Should get all the posts: validation error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData
        },
      },
    };

    const validation: ValidationResponse = {
      validationResult: false,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isValid.mockReturnValue(validation);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getAllPost(1, 10, 1, [], []);
    expect(res).toEqual(expRes);
  });

  it('Should get all the posts: success', async () => {
    const expRes = {
      data: {
        "isSuccess": true,
        "isException": false,
        "value": {
          "operation": true
        }
      }
    };

    const validation: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isValid.mockReturnValue(validation);
    mockPostService.getAllPosts.mockReturnValue(expRes);
    const res = await controller.getAllPost(1, 10, 1, [], []);
    expect(res).toEqual(expRes);
  });

  it('Should get all the posts: exception', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    })
    await controller.getAllPost(1, 2, 1, [], []);
  });

  /* getAllCommunityPosts */
  it('Should get posts based on community: Admin user error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    await controller.getAllCommunityPosts(['testId'], 1, 10, 1, true);
  });

  it('Should get posts based on community: Post Id error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    await controller.getAllCommunityPosts(['testId'], 1, 10, 1, true);
  });

  it('Should get posts based on community: Published  Error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    await controller.getAllCommunityPosts(['testId'], 1, 10, 1, null);
  });

  it('Should get posts based on community: Page Name validation', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const validation: ValidationResponse = {
      validationResult: false,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isValid.mockReturnValue(validation);
    mockResult.createError.mockReturnValue(expRes);
    await controller.getAllCommunityPosts(['testId'], 1, 10, 1, true);
  });

  it('Should get posts based on community: Success', async () => {
    const expRes = {
      data: {
        "isSuccess": true,
        "isException": false,
        "values": {
        }
      }
    };

    const validation: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isValid.mockReturnValue(validation);
    mockPostService.getCommunityPosts.mockReturnValue(expRes);
    await controller.getAllCommunityPosts(['testId'], 1, 10, 1, true);
  });

  it('Should get posts based on community: exception', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    })
    await controller.getAllCommunityPosts(['testId'], 1, 10, 1, true);
  });

  /* upsertComment */
  it('Should add/update comment: User Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        },
      },
    };

    const payload: CommentRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Post Id error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: CommentRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Whitespace Error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: CommentRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Success', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: CommentRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatedWords.mockReturnValue(payload.comment);
    mockPostService.upsertComment.mockReturnValue(expRes);
    const res = await controller.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Exception', async () => {
    const payload: CommentRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.upsertComment(payload);
  });

  /* upsertReply */

  it('Should add/update comment: User Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist
        },
      },
    };

    const payload: ReplyRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      commentId: 'commentId',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Post Id error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: ReplyRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      commentId: 'commentId',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Comment Id error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: ReplyRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      commentId: 'commentId',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Whitespace Error', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors": {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: ReplyRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      commentId: 'commentId',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Success', async () => {
    const expRes = {
      data: {
        "isSuccess": false,
        "isException": true,
        "errors":
        {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    const payload: ReplyRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      commentId: 'commentId',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatedWords.mockReturnValue(payload.comment);
    mockPostService.upsertReply.mockReturnValue(expRes);
    const res = await controller.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add/update comment: Exception', async () => {
    const payload: ReplyRequest = {
      id: '',
      postId: 'postId',
      comment: 'test',
      commentId: 'commentId',
      isProfane: false
    };

    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.upsertReply(payload);
  });



  it('Should Return Success after adding a new comment to post', async () => {
    const payload = {
      postId: "61965e0de4cece637614e1c3",
      authorId: "6197d7664b8aa1e7702a13e5",
      comment: "Hey gud eve"
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: "61a69f4f1649fb5fb41c1ecd",
          authorId: "6197d7664b8aa1e7702a13e5",
          comment: "Hey gud eve",
          createdAt: "2021-11-30T22:01:51.980Z",
          updatedAt: "2021-11-30T22:01:51.980Z",
          flagged: false,
          removed: false
        }
      }
    };
    mockPostService.upsertComment.mockReturnValue(expRes);
    const res = await mockPostService.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should Return Success after updating comments in DB', async () => {
    const payload = {
      id: "61a69c8600791e17b05145e8",
      postId: "61965e0de4cece637614e1c3",
      authorId: "6197d7664b8aa1e7702a13e5",
      comment: "Hey gud noon"
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
    mockPostService.upsertComment.mockReturnValue(expRes);
    const res = await mockPostService.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should Return Success after updating reply to the comments in DB', async () => {
    const payload = {
      authorId: '6197d7664b8aa1e7702a13e5',
      comment: 'Crazy',
      id: '61a86f4a83f2c1b38162ae57',
      commentId: '61a7db54a1f5b34408b17deb',
      postId: '61965e0de4cece637614e1c3'
    };
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "operation": true
        }
      }
    };
    mockPostService.upsertReply.mockReturnValue(expRes);
    const res = await mockPostService.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('Should Return Success after adding reply to the comments in DB', async () => {
    const payload = {
      "postId": "61965e0de4cece637614e1c3",
      "commentId": "61a7db54a1f5b34408b17deb",
      "authorId": "6197d7664b8aa1e7702a13e5",
      "comment": "Crazy dfvdfv"
    };
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": {
          "authorId": "6197d7664b8aa1e7702a13e5",
          "comment": "Crazy dfvdfv",
          "createdAt": "2021-12-02T07:07:42.356Z",
          "updatedAt": "2021-12-02T07:07:42.356Z",
          "flagged": false,
          "removed": false,
          "id": "61a870be140ef6b4fba02a6e"
        }
      }
    };
    mockPostService.upsertReply.mockReturnValue(expRes);
    const res = await mockPostService.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it("Should delete a comment based on postId and commentId", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockPostService.deleteComment.mockReturnValue(expRes);
    const data = await mockPostService.deleteComment("61965e0de4cece637614e1c3", "61a69f4f1649fb5fb41c1ecd");
    expect(data).toEqual(expRes);
  });

  it("Should flag a comment based on postId and commentId", async () => {
    const payload = {
      postId: "61965e0de4cece637614e1c3",
      commentId: "61a69f4f1649fb5fb41c1ecd",
      flagged: true
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
    mockPostService.flagComment.mockReturnValue(expRes);
    const data = await mockPostService.flagComment(payload);
    expect(data).toEqual(expRes);
  });

  it("Should return success after adding reaction to the post", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload = {
      "userId": "6197d7664b8aa1e7702a13e5",
      "reaction": "remove",
      "postId": "619cd1d0efed65263306ce0f"
    };
    mockPostService.addReaction.mockReturnValue(expRes);
    const data = await mockPostService.addReaction(payload);
    expect(data).toEqual(expRes);
  });

  it("Should return failure after adding reaction to the reply", async () => {
    const expRes = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "errors": {
          "id": "544846ab-229b-c171-1892-e3f7dcc6b6ee",
          "errorCode": 400,
          "title": "Incorrect Model",
          "detail": "Invalid/Missing comment Id"
        }
      }
    };

    const payload = {
      "userId": "6197d7664b8aa1e7702a13e5",
      "reaction": "remove",
      "postId": "619cd1d0efed65263306ce0f",
      "replyId": "61aa1f53d566f5b0d40b932c"
    };
    mockPostService.addReaction.mockReturnValue(expRes);
    const data = await mockPostService.addReaction(payload);
    expect(data).toEqual(expRes);
  });

  it("Should flag a post based on postId", async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    mockPostService.flagPost.mockReturnValue(expRes);
    const data = await mockPostService.flagPost("619ce6d6d93b51202339e1a6", true);
    expect(data).toEqual(expRes);
  });

  it("Should flag a reply based on postId, commentId and replyId", async () => {
    const payload = {
      postId: "61965e0de4cece637614e1c3",
      commentId: "61a69f4f1649fb5fb41c1ecd",
      replyId: "61aa1f53d566f5b0d40b932c",
      flagged: true
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
    mockPostService.flagOrDeleteReply.mockReturnValue(expRes);
    const data = await mockPostService.flagOrDeleteReply(payload, false);
    expect(data).toEqual(expRes);
  });

  it("Should delete a reply based on postId, commentId and replyId", async () => {
    const payload = {
      postId: "61965e0de4cece637614e1c3",
      commentId: "61a69f4f1649fb5fb41c1ecd",
      replyId: "61aa1f53d566f5b0d40b932c",
      flagged: true
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
    mockPostService.flagOrDeleteReply.mockReturnValue(expRes);
    const data = await mockPostService.flagOrDeleteReply(payload, true);
    expect(data).toEqual(expRes);
  });
});
