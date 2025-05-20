import { mockCommentHelper, mockMongo, mockNotificationHelper, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { DeleteStoryCommentRequest } from "api/communityresources/models/storyModel";
import { CommentService } from "../commentService";

describe('Comment Service', () => {
  let service;
  beforeEach(() => {
    service = new CommentService(<any>mockMongo, <any>mockResult, <any>mockCommentHelper, <any>mockNotificationHelper,  <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const storyRawData = {
    _id: '6026964ee7965700083c86a4',
    authorId: "600949c9bb91ed000704a209",
    author: {
      displayName: 'Dude Rads',
      id: '600949c9bb91ed000704a209',
      gender: 'Male',
      genderRoles: {
        GenderPronoun: 'he',
        GenderPronounPossessive: 'his'
      },
      profilePicture:
        'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/06fdf701-842a-4b22-9d8f-2baa24148822.jpg',
      fullName: 'TOMMY TAD',
      firstName: 'Male',
      communities: [
        '5f07537bc12e0c22d00f5d21',
        '5f369ba97b79ea14f85fb0ec',
        '5f189ba00d5f552cf445b8c2',
        '5f245386aa271e24b0c6fd88',
        '5f22db56a374bc4e80d80a9b',
        '5f0753f6c12e0c22d00f5d23',
        '5f245386aa271e24b0c6fd89',
        '5f3d2eef5617cc2e401b8adf',
        '5f0e744536b382377497ecef'
      ],
      age: 32
    },
    CreatedDate: '2021-02-12T14:53:02.625Z',
    UpdatedDate: '2021-02-18T11:17:24.282Z',
    answer: [
      {
        _id: '602697cee7965700083c86a7',
        PromptId: null,
        Question: 'test1',
        QuestionAuthorId: null,
        QuestionAuthorFirstName: null,
        QuestionAuthorDisplayName: null,
        QuestionAuthorProfilePicture: null,
        SensitiveContentText: null,
        Response: 'Test 1',
        Order: 0,
        CreatedDate: '2021-02-12T14:59:26.255Z',
        UpdatedDate: '2021-02-18T11:17:21.939Z',
        Type: 'UserQuestion'
      },
      {
        _id: '6026964ee7965700083c869b',
        PromptId: '5f9c4d59fdfbb52b2c86c991',
        Question:
          'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
        QuestionAuthorId: null,
        QuestionAuthorFirstName: null,
        QuestionAuthorDisplayName: null,
        QuestionAuthorProfilePicture: null,
        SensitiveContentText: null,
        Response: 'Testing the fields 1-retest',
        Order: 0,
        CreatedDate: '2021-02-12T14:53:02.625Z',
        UpdatedDate: '2021-02-18T11:17:21.939Z',
        Type: 'PromptQuestion'
      },
      {
        _id: '6026964ee7965700083c869d',
        PromptId: '5f9c5238fdfbb52b2c86c9b9',
        Question: 'What happened after that?',
        QuestionAuthorId: null,
        QuestionAuthorFirstName: null,
        QuestionAuthorDisplayName: null,
        QuestionAuthorProfilePicture: null,
        SensitiveContentText: null,
        Response: 'test',
        Order: 0,
        CreatedDate: '2021-02-12T14:53:02.625Z',
        UpdatedDate: '2021-02-18T11:17:21.939Z',
        Type: 'PromptQuestion'
      },
      {
        _id: '6026964ee7965700083c869f',
        PromptId: '5f9c4e96fdfbb52b2c86c99b',
        Question: 'What was it like to learn the diagnosis?',
        QuestionAuthorId: null,
        QuestionAuthorFirstName: null,
        QuestionAuthorDisplayName: null,
        QuestionAuthorProfilePicture: null,
        SensitiveContentText: null,
        Response: 'Testing the fields 2',
        Order: 0,
        CreatedDate: '2021-02-12T14:53:02.625Z',
        UpdatedDate: '2021-02-18T11:17:21.939Z',
        Type: 'PromptQuestion'
      },
      {
        _id: '6026964ee7965700083c86a1',
        PromptId: '5f9c4f3efdfbb52b2c86c9a5',
        Question: 'How did you decide what to do?',
        QuestionAuthorId: null,
        QuestionAuthorFirstName: null,
        QuestionAuthorDisplayName: null,
        QuestionAuthorProfilePicture: null,
        SensitiveContentText: null,
        Response: 'Testing 4',
        Order: 0,
        CreatedDate: '2021-02-12T14:53:02.625Z',
        UpdatedDate: '2021-02-18T11:17:21.939Z',
        Type: 'PromptQuestion'
      },
      {
        _id: '6026964ee7965700083c86a3',
        PromptId: '5f9c4fcdfdfbb52b2c86c9af',
        Question: 'How did you adjust to your new routine?',
        QuestionAuthorId: null,
        QuestionAuthorFirstName: null,
        QuestionAuthorDisplayName: null,
        QuestionAuthorProfilePicture: null,
        SensitiveContentText: null,
        Response: 'Testing 5',
        Order: 0,
        CreatedDate: '2021-02-12T14:53:02.625Z',
        UpdatedDate: '2021-02-18T11:17:21.939Z',
        Type: 'PromptQuestion'
      }
    ],
    DisplayName: 'Dude Rads',
    AuthorAgeWhenStoryBegan: 25,
    Relation: 'Myself',
    FeaturedQuote: 'Jab thak hai jaan....',
    RelationAgeWhenDiagnosed: 22,
    CommunityId: '5f245386aa271e24b0c6fd89',
    CommunityName: 'Advanced or Metastatic Prostate Cancer',
    StoryText: 'Placeholder story text',
    Published: true,
    Removed: false,
    Flagged: false,
    HasStoryBeenPublishedOnce: true,
    comments: [
      {
        _id: "6239b5be4385b35c2a222635",
        comment: "Test Comment",
        createdAt: "2022-03-22T11:40:46.984Z",
        updatedAt: "2022-03-24T14:23:41.533Z",
        flagged: false,
        removed: false,
        isCommentTextProfane: false,
        author: {
          id: "6176bf16958ba4002420de22",
          firstName: "CALVIN",
          lastName: "C",
          displayName: null
        },
        replies: [
          {
            _id: "623c522c01607f0214f68e29",
            comment: "replying",
            createdAt: "2022-03-24T11:12:44.748Z",
            updatedAt: "2022-03-24T14:22:01.670Z",
            flagged: false,
            removed: false,
            isCommentTextProfane: false,
            author: {
              id: "6176bf16958ba4002420de22",
              firstName: "CALVIN",
              lastName: "C",
              displayName: "testName"
            },
            reactions: {
              log: [
                {
                  userId: "61af64ad583c599ddb4f1bed",
                  reaction: "celebrate",
                  createdDate: "2022-03-24T14:22:01.670Z",
                  updatedDate: "2022-03-24T14:22:01.670Z"
                }
              ],
              count: {
                like: 0,
                care: 0,
                celebrate: 1,
                good_idea: 0,
                total: 1
              }
            }
          },
          {
            _id: "623c535401607f0214f68e2c",
            comment: "replying",
            createdAt: "2022-03-24T11:17:40.653Z",
            updatedAt: "2022-03-24T11:17:40.653Z",
            flagged: false,
            removed: false,
            isCommentTextProfane: false,
            author: {
              id: "61af64ad583c599ddb4f1bed",
              firstName: "GA",
              lastName: "JONES",
              displayName: "Nonsense"
            }
          }
        ],
        reactions: {
          log: [
            {
              userId: "61af64ad583c599ddb4f1bed",
              reaction: "like",
              createdDate: "2022-03-24T14:22:49.710Z",
              updatedDate: "2022-03-24T14:22:49.710Z"
            }
          ],
          count: {
            like: 1,
            care: 0,
            celebrate: 0,
            good_idea: 0,
            total: 1
          }
        }
      }
    ]
  };

  it('removeComment - delete reply success', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: "623c522c01607f0214f68e29",
      storyId: "6026964ee7965700083c86a4"
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
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    mockCommentHelper.getReplyStory.mockReturnValue(storyRawData);
    const res = await service.removeComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('removeComment - delete comment success', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: undefined,
      storyId: "6026964ee7965700083c86a4"
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
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    const res = await service.removeComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('flagComment - flag reply success', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: "623c522c01607f0214f68e29",
      storyId: "6026964ee7965700083c86a4"
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
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockResult.createSuccess.mockReturnValue(expRes);
    mockCommentHelper.getReplyStory.mockReturnValue(storyRawData);
    mockCommentHelper.getUpdateCommentQuery.mockReturnValue({});
    mockCommentHelper.reportToAdmin.mockReturnValue(true);
    const res = await service.flagComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('flagComment - flag comment success', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: undefined,
      storyId: "6026964ee7965700083c86a4"
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
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockMongo.updateByQuery.mockReturnValue(1);
    mockCommentHelper.getUpdateCommentQuery.mockReturnValue({});
    mockResult.createSuccess.mockReturnValue(expRes);
    mockCommentHelper.reportToAdmin.mockReturnValue(true);

    const res = await service.flagComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('flagComment - Comment not found error', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: undefined,
      storyId: "6026964ee7965700083c86a4"
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Bad Data',
            detail: 'Comment does not exist'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.flagComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('flagComment - Reply not found error', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: "623c522c01607f0214f68e29",
      storyId: "6026964ee7965700083c86a4"
    };

    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Bad Data',
            detail: 'Reply does not exist'
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    mockCommentHelper.getReplyStory.mockReturnValue(null);
    const res = await service.flagComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('removeComment - comment does not exist error', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: undefined,
      storyId: "6026964ee7965700083c86a4"
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Bad Data',
            detail: 'Comment does not exist'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.removeComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('removeComment - Comment No permission to delete comment', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: undefined,
      storyId: "6026964ee7965700083c86a4"
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Bad Data',
            detail: 'User is not the author of the comment'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.removeComment(payload, 'userId');
    expect(res).toEqual(expRes);
  });

  it('removeComment - reply does not exist error', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: "623c522c01607f0214f68e29",
      storyId: "623c522c01607f0214f68e29"
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Bad Data',
            detail: 'Reply does not exist'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockMongo.updateByQuery.mockReturnValue(0);
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.removeComment(payload, '600949c9bb91ed000704a209');
    expect(res).toEqual(expRes);
  });

  it('removeComment - No permission to delete comment', async () => {
    const payload: DeleteStoryCommentRequest = {
      commentId: "6239b5be4385b35c2a222635",
      replyId: "623c522c01607f0214f68e29",
      storyId: "6026964ee7965700083c86a4"
    };

    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Bad Data',
            detail: 'User is not the author of the comment'
          }
        ]
      }
    };
    mockMongo.readByValue.mockReturnValue(storyRawData);
    mockCommentHelper.getReplyStory.mockReturnValue(storyRawData);
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.removeComment(payload, 'userId');
    expect(res).toEqual(expRes);
  });
});
