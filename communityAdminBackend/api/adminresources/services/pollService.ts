import { collections, mongoDbTables } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { Service } from 'typedi';
import { PollOption, Post } from '../models/postsModel';

@Service()
export class PollService {

  constructor(
    private _mongoSvc: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async calculatePollResult(post: Post) {
    try {
      let totalResponse = 0;
      let responseEdit = 0;
      const pollResponse = await this._mongoSvc.readByValue(collections.POLLRESPONSE, { [mongoDbTables.pollResponse.postId]: post.id.toString() });
      if (pollResponse === null) {
        post.numberOfVotes = totalResponse;
        post.numberOfVoteEdit = responseEdit;
        return;
      }
      post.content.en[mongoDbTables.posts.poll].options.forEach((option: PollOption) => {
        option.result = {
          voteCount: pollResponse.userResponse[option.id].length,
          percentage: 0
        };
        totalResponse += option.result.voteCount;
        responseEdit += pollResponse.userResponse[option.id].filter((data) => data.edited).length;
      });
      post.content.en[mongoDbTables.posts.poll].options.forEach((option: PollOption) => {
        option.result.percentage = ((totalResponse > 0) ? pollResponse.userResponse[option.id].length * 100 / totalResponse : 0);
      });
      post.numberOfVotes = totalResponse;
      post.numberOfVoteEdit = responseEdit;
    } catch (error) {
      this._log.error(error as Error);
    }
  }
}
