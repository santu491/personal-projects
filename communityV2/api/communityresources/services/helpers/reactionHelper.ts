import { ReactionEnum, reactionRemove } from '@anthem/communityapi/common';
import { Service } from 'typedi';
import { Reaction, ReactionCount, ReactionLog } from '../../models/reactionModel';
import { StoryReactionRequest } from '../../models/storyModel';

@Service()
export class ReactionHelper {
  /**
   * Update the reaction object for given item
   * @param reactionObject reaction Object
   * @param userIndex index of user in reaction log
   * @param reaction reaction type
   * @param isRemove remove
   * @returns updated reaction object
   */
  public updateReactionObject(reactionObject: Reaction, userIndex: number, reaction: string, isRemove: boolean) {
    if (!isRemove) {
      switch (reaction) {
        case ReactionEnum.REACTION_LIKE: reactionObject.count.like++;
          break;
        case ReactionEnum.REACTION_CARE: reactionObject.count.care++;
          break;
        case ReactionEnum.REACTION_CELIBRATE: reactionObject.count.celebrate++;
          break;
        case ReactionEnum.REACTION_GOOD_IDEA: reactionObject.count.good_idea++;
          break;
        default: break;
      }

      reactionObject.count.total++;
    }

    if (userIndex !== -1) {
      if (reactionObject.count[reactionObject.log[userIndex].reaction]) {
        reactionObject.count[reactionObject.log[userIndex].reaction]--;
      }

      if (reactionObject.log[userIndex].reaction !== reactionRemove) {
        reactionObject.count.total--;
      }

      reactionObject.log[userIndex].reaction = reaction;
      reactionObject.log[userIndex].updatedDate = new Date();
    }

    return reactionObject;
  }

  public async handleStoryReactions(
    storyReaction: Reaction,
    reactionRequest: StoryReactionRequest,
    objIndex: number,
    isRemove: boolean,
    userId: string) {
    storyReaction = this.updateReactionObject(storyReaction, objIndex, reactionRequest.reaction, isRemove);
    if (objIndex === -1 && !isRemove) {
      const r = new ReactionLog();
      r.userId = userId;
      r.reaction = reactionRequest.reaction;
      r.createdDate = new Date();
      r.updatedDate = new Date();
      storyReaction.log.push(r);
    }

    return storyReaction;
  }

  public getReactionForCurrentUser(reactionObject: Reaction, userId: string) {
    const returnObject = {
      reactionCount: {
        like: 0,
        care: 0,
        celebrate: 0,
        good_idea: 0,
        total: 0
      },
      userReaction: 'null'
    };

    if (reactionObject) {
      const objIndex = reactionObject.log.findIndex((reactions) => reactions.userId === userId);

      returnObject.reactionCount = reactionObject.count;

      if (objIndex !== -1) {
        returnObject.userReaction = reactionObject.log[objIndex].reaction;
      }
    }

    return returnObject;
  }

  public createReactionObject() {
    const reactionObject = new Reaction();
    reactionObject.log = [];
    reactionObject.count = {
      like: 0,
      care: 0,
      celebrate: 0,
      good_idea: 0,
      total: 0
    };
    return reactionObject;
  }

  public createReactionCount(reactionLog: ReactionLog[]) {
    let reactionCount = new ReactionCount();
    reactionCount = {
      like: 0,
      care: 0,
      celebrate: 0,
      good_idea: 0,
      total: 0
    };
    for (const log of reactionLog) {
      switch (log.reaction) {
        case ReactionEnum.REACTION_LIKE:
          reactionCount.like++;
          reactionCount.total++;
          break;
        case ReactionEnum.REACTION_CARE:
          reactionCount.care++;
          reactionCount.total++;
          break;
        case ReactionEnum.REACTION_CELIBRATE:
          reactionCount.celebrate++;
          reactionCount.total++;
          break;
        case ReactionEnum.REACTION_GOOD_IDEA:
          reactionCount.good_idea++;
          reactionCount.total++;
          break;
        default: break;
      }
    }

    return reactionCount;
  }

}
