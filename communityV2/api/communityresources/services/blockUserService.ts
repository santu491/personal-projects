import { API_RESPONSE, collections, mongoDbTables, Result, TranslationLanguage } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { Binder } from '../models/binderModel';
import { Blocked } from '../models/blockedModel';
import { BaseResponse } from '../models/resultModel';
import { BooleanResponse, StoryResponse } from '../models/storyModel';
import { BlockedUser, User } from '../models/userModel';
import { BinderService } from './binderService';
import { StoryService } from './storyService';

@Service()
export class BlockUserService {
  constructor(
    private mongoService: MongoDatabaseClient,
    private result: Result,
    private binderService: BinderService,
    private storyService: StoryService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async blockUser(
    blockingUser: string,
    blockedUser: string
  ): Promise<BaseResponse> {
    try {
      const block = new Blocked();
      block.blockedUser = blockedUser;
      block.blockingUser = blockingUser;
      block.createdDate = new Date();

      await this.mongoService.insertValue(collections.BLOCKED, block);
      //Delete blocked user stories from my binder
      this.blockStories(blockingUser, blockedUser);
      //Delete my stories from blocked user
      this.blockStories(blockedUser, blockingUser);

      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async myBlocks(currentUserId: string): Promise<BaseResponse> {
    try {
      const value = {
        [mongoDbTables.blocked.blockingUser]: currentUserId
      };
      const myblocks: Blocked[] = await this.mongoService.readAllByValue(
        collections.BLOCKED,
        value
      );
      const blockedUsers: BlockedUser[] = [];
      for (const b of myblocks) {
        const user: User = await this.mongoService.readByID(
          collections.USERS,
          b.blockedUser
        );
        if (user !== null) {
          const blocked = new BlockedUser();
          blocked.id = user.id;
          blocked.username = user.displayName ;

          blockedUsers.push(blocked);
        }
      }
      return this.result.createSuccess(blockedUsers);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async removeUserFromBlock(
    blockingUser: string,
    blockedUser: string
  ): Promise<BaseResponse> {
    try {
      const value = { blockingUser: blockingUser, blockedUser: blockedUser };
      const response = new BooleanResponse();
      response.operation = await this.mongoService.deleteOneByValue(
        collections.BLOCKED,
        value
      );
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getBlockUserIdList(currentUserId: string) {
    try {
      const value =
      {
        $or: [
          { [mongoDbTables.blocked.blockedUser]: currentUserId },
          { [mongoDbTables.blocked.blockingUser]: currentUserId }
        ]
      };
      const blockedUsers: Blocked[] = await this.mongoService.readAllByValue(
        collections.BLOCKED,
        value
      );

      let blockUserIdList = [];

      blockedUsers.forEach((block) => {
        blockUserIdList.push(block.blockingUser);
        blockUserIdList.push(block.blockedUser);

      });

      blockUserIdList = [...new Set(blockUserIdList)];

      return blockUserIdList;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async blockStories(blockingUser: string, blockedUser: string) {
    try {
      const binderWrapper = await this.binderService.getBinderByUser(
        blockingUser,
        1
      );
      if (!binderWrapper.data.isSuccess) {
        return binderWrapper;
      }
      const binder: Binder = binderWrapper.data.value as Binder;

      if (binder?.binderStories?.length === 0) {
        this.result.errorInfo.detail =
          API_RESPONSE.messages.storyDoesNotExistInBinder;
        throw [this.result.errorInfo];
      }
      let removeFlag = false;
      for (let b = 0; b < binder.binderStories.length; b++) {
        const story = await this.storyService.getStoryById(
          binder.binderStories[b].storyId,
          null,
          TranslationLanguage.ENGLISH
        );
        const storyResponse: StoryResponse = story.data.value as StoryResponse;
        if (storyResponse?.author?.id === blockedUser) {
          removeFlag = true;
          binder.binderStories.splice(b, 1);
        }
      }
      if (removeFlag) {
        const query = {
          $set: {
            [mongoDbTables.binder.binderStories]: binder.binderStories
          }
        };
        const userId = { [mongoDbTables.binder.userId]: binder.userId };
        await this.mongoService.updateByQuery(collections.BINDER, userId, query);
      }

      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
