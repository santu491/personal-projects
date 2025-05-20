import { ReactionHelper } from "../../helpers/reactionHelper";

describe('Reaction Helper', () => {
  let service;

  beforeEach(() => {
    service = new ReactionHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updateReactionObject - new reaction success', async () => {
    const reactionObject = {
      count: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      log: []
    };
    const res = service.updateReactionObject(reactionObject, -1, 'like', false);
    expect(res).toEqual({
      count: {
        like: 1,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 1
      },
      log: []
    })
  });

  it('updateReactionObject - change reaction success', async () => {
    const reactionObject = {
      count: {
        like: 1,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 1
      },
      log: [
        {
          userId : "61af64ad583c599ddb4f1bed",
          reaction : "like",
          createdDate : "2022-03-10T17:24:42.636Z",
          updatedDate : "2022-03-10T17:24:42.636Z"
        }
      ]
    };


    const res = service.updateReactionObject(reactionObject, 0, 'care', false);
    reactionObject.count.like--;
    reactionObject.count.care++;
    reactionObject.log[0].updatedDate = new Date().toString();
    expect(res).toEqual(reactionObject)
  });

  it('updateReactionObject - remove reaction', async () => {
    const reactionObject = {
      count: {
        like: 1,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 1
      },
      log: [
        {
          userId : "61af64ad583c599ddb4f1bed",
          reaction : "like",
          createdDate : "2022-03-10T17:24:42.636Z",
          updatedDate : "2022-03-10T17:24:42.636Z"
        }
      ]
    };


    const res = service.updateReactionObject(reactionObject, 0, 'remove', true);
    reactionObject.count.like--;
    reactionObject.count.total--;
    reactionObject.log[0].updatedDate = new Date().toString();
    expect(res).toEqual(reactionObject)
  });

  it('updateReactionObject - new reaction celebrate', async () => {
    const reactionObject = {
      count: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      log: []
    };
    const res = service.updateReactionObject(reactionObject, -1, 'celebrate', false);
    expect(res).toEqual({
      count: {
        like: 0,
        care: 0,
        celebrate: 1,
        good_idea: 0,
        total: 1
      },
      log: []
    })
  });

  it('updateReactionObject - new reaction good idea', async () => {
    const reactionObject = {
      count: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      log: []
    };
    const res = service.updateReactionObject(reactionObject, -1, 'good_idea', false);
    expect(res).toEqual({
      count: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 1,
        total: 1
      },
      log: []
    })
  });

  it('handleStoryReactions - edit reaction', async () => {
    const storyReaction = {
      count: {
        like: 0,
        care: 0,
        celebrate: 1,
        good_idea: 0,
        total: 1
      },
      log: [
        {
          userId: "61af64ad583c599ddb4f1bed",
          reaction: "celebrate",
          createdDate: "2022-03-10T17:24:42.636Z",
          updatedDate: "2022-03-10T17:24:42.636Z"
        }
      ]
    };
    const reactionRequest = {
      storyId: "storyId",
      reaction: "like",
      type: "comment"
    };
    const res = await service.handleStoryReactions(storyReaction, reactionRequest, 0, false, 'userId');
    storyReaction.count.like++;
    storyReaction.count.celebrate--;
    storyReaction.log[0].updatedDate = new Date().toString();
    expect(res).toEqual(storyReaction);
  });

  it('handleStoryReactions - Remove reaction', async () => {
    const storyReaction = {
      count: {
        like: 0,
        care: 0,
        celebrate: 1,
        good_idea: 0,
        total: 1
      },
      log: [
        {
          userId: "61af64ad583c599ddb4f1bed",
          reaction: "celebrate",
          createdDate: "2022-03-10T17:24:42.636Z",
          updatedDate: "2022-03-10T17:24:42.636Z"
        }
      ]
    };
    const reactionRequest = {
      storyId: "storyId",
      reaction: "remove",
      type: "comment"
    };
    const res = await service.handleStoryReactions(storyReaction, reactionRequest, 0, true, 'userId');
    storyReaction.count.celebrate--;
    storyReaction.count.total--;
    storyReaction.log[0].updatedDate = new Date().toString();
    storyReaction.log[0].reaction = 'remove';
    expect(res).toEqual(storyReaction);
  });

  it('handleStoryReactions - edit reaction', async () => {
    const storyReaction = {
      count: {
        like: 0,
        care: 0,
        celebrate: 1,
        good_idea: 0,
        total: 1
      },
      log: [
        {
          userId: "61af64ad583c599ddb4f1bed",
          reaction: "celebrate",
          createdDate: "2022-03-10T17:24:42.636Z",
          updatedDate: "2022-03-10T17:24:42.636Z"
        }
      ]
    };
    const reactionRequest = {
      storyId: "storyId",
      reaction: "like",
      type: "comment"
    };
    const res = await service.handleStoryReactions(storyReaction, reactionRequest, -1, false, 'userId');
    expect(res.log.length).toEqual(2);
  });
});
