import {
  Result, collections, mongoDbTables
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import { PollResponse, PollResponseRequest, UserResponse } from '../models/pollModel';
import { Options, Post } from '../models/postsModel';
import { BaseResponse } from '../models/resultModel';

@Service()
export class PollService {
  constructor(
    private mongoSvc: MongoDatabaseClient,
    private result: Result,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async userPollResponse(payload: PollResponseRequest, user): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.pollResponse.postId]: payload.postId
      };
      let pollResponse: PollResponse = await this.mongoSvc.readByValue(collections.POLLRESPONSE, query);
      if (!pollResponse) {
        pollResponse = await this.createPollResponse(payload.postId);
      }

      let userData: UserResponse;
      let userDataIndex;
      const post: Post = await this.mongoSvc.readByID(collections.POSTS, payload.postId);
      post.content.en.poll.options.forEach((option: Options) => {
        userDataIndex = pollResponse.userResponse[option.id].findIndex((responseData) => responseData.userId === user.id);
        if (userDataIndex > -1) {
          pollResponse.userResponse[option.id].splice(userDataIndex, 1);
          userData = {
            userId: user.id,
            edited: true
          };
        }
      });

      if (!userData) {
        userData = {
          userId: user.id,
          edited: false
        };
      }
      pollResponse.userResponse[payload.optionId].push(userData);
      await this.mongoSvc.updateByQuery(collections.POLLRESPONSE, query, {
        $set: {
          [mongoDbTables.pollResponse.userResponse]: pollResponse.userResponse
        }
      }, query);

      const result = await this.userResponseResults(pollResponse, payload.postId);
      return this.result.createSuccess(result);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async calculatePollResult(post: Post, userId: string) {
    let totalResponse = 0;
    const pollResponse = await this.mongoSvc.readByValue(collections.POLLRESPONSE, { [mongoDbTables.pollResponse.postId]: post.id.toString() });
    if (pollResponse === null) {
      post.content[mongoDbTables.posts.poll].options.forEach((option: Options) => {
        option.result = {
          voteCount: 0,
          userResponse: false,
          percentage: 0
        };
      });
      return post;
    }
    post.content[mongoDbTables.posts.poll].options.forEach((option: Options) => {
      option.result = {
        voteCount: pollResponse.userResponse[option.id].length,
        userResponse: pollResponse.userResponse[option.id].findIndex((data) => data.userId === userId) > -1,
        percentage: 0
      };
      totalResponse += option.result.voteCount;
    });
    post.content[mongoDbTables.posts.poll].options.forEach((option: Options) => {
      option.result.percentage = ((totalResponse > 0) ? pollResponse.userResponse[option.id].length * 100 / totalResponse : 0);
    });
    const publishedDate = new Date(post.publishedAt);
    publishedDate.setDate(publishedDate.getDate() + post.content[mongoDbTables.posts.poll].endsOn);
    post.content[mongoDbTables.posts.poll].endsOnDate = publishedDate;

    return post;
  }

  public async userResponseResults(pollResponse: PollResponse, postId: string) {
    const post: Post = await this.mongoSvc.readByID(collections.POSTS, postId);
    let totalResponse = 0;
    const result = [];
    post.content.en.poll.options.forEach((option: Options) => {
      totalResponse += pollResponse.userResponse[option.id].length;
    });
    post.content.en.poll.options.forEach((option: Options) => {
      const data = {
        optionId: option.id,
        percentage: ((totalResponse > 0) ? pollResponse.userResponse[option.id].length * 100 / totalResponse : 0)
      };
      result.push(data);
    });

    return result;
  }

  private async createPollResponse(postId: string) {
    try {
      const post: Post = await this.mongoSvc.readByID(collections.POSTS, postId);
      const userResponse = {};
      post.content.en.poll.options.forEach((option: Options) => {
        userResponse[option.id] = [];
      });
      const pollResponseData: PollResponse = {
        postId: postId,
        userResponse: userResponse
      };
      const pollresponse = await this.mongoSvc.insertValue(collections.POLLRESPONSE, pollResponseData);
      return pollresponse;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
