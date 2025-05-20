import { ValidationResponse } from '@anthem/communityadminapi/common';
import { mockRequestValidator, mockResult, mockStoryCommentService, mockValidation } from '@anthem/communityadminapi/common/baseTest';
import { ReactionRequest } from 'api/adminresources/models/postsModel';
import { StoryCommentRequest } from 'api/adminresources/models/storyModel';
import { StoryCommentsController } from '../storyCommentsController';

describe('StoryCommentsController', () => {
  let controller: StoryCommentsController;

  beforeEach(() => {
    controller = new StoryCommentsController(<any>mockStoryCommentService, <any>mockResult, <any>mockValidation, <any>mockRequestValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  // Flag Comments
  it('Should flag a comment: Success', async () => {
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
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "flagged": false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockStoryCommentService.flagComment.mockReturnValue(expRes);
    const res = await controller.flagComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should flag a comment: CheckUser', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: {
          operation: false
        }
      }
    };

    const payload = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "flagged": false
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.flagComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should flag a comment: Invalid Id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: {
          operation: false
        }
      }
    };

    const payload = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "flagged": false
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.flagComment(payload);
    expect(res).toEqual(expRes);
  });

  it('Should flag a comment: exception', async () => {

    const payload = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "flagged": false
    };

    mockValidation.checkUserIdentity.mockImplementation(() =>
    {
      throw new Error;
    });
    mockResult.createException.mockReturnValue(true);
    await controller.flagComment(payload);
  });

  // reactions
  it('Should add the reaction to story/comment/reply: User validation', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: {
          operation: false
        }
      }
    };

    const payload: ReactionRequest = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "reaction": 'like'
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.addReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add the reaction to story/comment/reply: validation failure', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: {
          operation: false
        }
      }
    };

    const validate: ValidationResponse = {
      validationResult: false,
      reason: ''
    }

    const payload: ReactionRequest = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "reaction": 'like'
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockRequestValidator.isValidReactionRequest.mockReturnValue(validate);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.addReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add the reaction to story/comment/reply: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        values: {
          operation: true
        }
      }
    };

    const validate: ValidationResponse = {
      validationResult: true,
      reason: ''
    }

    const payload: ReactionRequest = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "reaction": 'like'
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockRequestValidator.isValidReactionRequest.mockReturnValue(validate);
    mockStoryCommentService.addReaction.mockReturnValue(expRes);
    const res = await controller.addReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('Should add the reaction to story/comment/reply: exception', async () => {
    const payload: ReactionRequest = {
      "id": "615afe8af7a306001cace422",
      "commentId": "6231e313a31724759809c271",
      "replyId": "6231e738f2605185464d30d4",
      "reaction": 'like'
    };

    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.addReaction(payload);
  });

  // Story Comments
  it('Should add comments to the story: Validation Failure', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: {
          operation: false
        }
      }
    };

    const payload: StoryCommentRequest = {
      storyId: "615afe8af7a306001cace422",
      comment: 'Test',
      id: '615afe8af7a306001cace422',
      isProfane: false,
      authorId: ''
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const resp = await controller.storyComment(payload);
    expect(resp).toEqual(expRes);
  });

  it('Should add comments to the story: Validation Failure', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: {
          operation: false
        }
      }
    };

    const payload: StoryCommentRequest = {
      storyId: "615afe8af7a306001cace422",
      comment: 'Test',
      id: '615afe8af7a306001cace422',
      isProfane: false,
      authorId: ''
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const resp = await controller.storyComment(payload);
    expect(resp).toEqual(expRes);
  })

  it('Should add comments to the story: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        values: {
          operation: true
        }
      }
    };

    const payload: StoryCommentRequest = {
      storyId: "615afe8af7a306001cace422",
      comment: 'Test',
      id: '615afe8af7a306001cace422',
      isProfane: false,
      authorId: ''
    };

    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockStoryCommentService.upsertComment.mockReturnValue(expRes);
    const resp = await controller.storyComment(payload);
    expect(resp).toEqual(expRes);
  })

  it('Should add comments to the story: exception', async () => {
    const payload: StoryCommentRequest = {
      storyId: "615afe8af7a306001cace422",
      comment: 'Test',
      id: '615afe8af7a306001cace422',
      isProfane: false,
      authorId: ''
    };

    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.storyComment(payload);
  })

});
