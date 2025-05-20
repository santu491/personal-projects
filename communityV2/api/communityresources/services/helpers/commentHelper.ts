import { API_RESPONSE, collections, mongoDbTables, PostResponse, queryStrings, REACTIONS, storyReactionsType, TranslationLanguage, translationLiterals } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { APP } from '@anthem/communityapi/utils';
import { Community } from 'api/communityresources/models/communitiesModel';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { CommentAuthor, CommentModel, FlaggedUserLog } from '../../models/postsModel';
import { Story } from '../../models/storyModel';
import { User } from '../../models/userModel';
import { EmailService } from '../emailService';
import { NotificationHelper } from './notificationHelper';
import { PostsHelper } from './postsHelper';
import { ReactionHelper } from './reactionHelper';

@Service()
export class CommentHelper {
  mongoSvc = Container.get(MongoDatabaseClient);
  postsHelper = Container.get(PostsHelper);
  reactionHelper = Container.get(ReactionHelper);
  emailService = Container.get(EmailService);
  notificationHelper = Container.get(NotificationHelper);

  /**
   * Builds comments object
   * @param comments comments
   * @param commentAuthors author of the comments
   * @param replyAuthors author of the replies
   * @param currentUser user accessing the API
   */
  public async buildComment(
    comments: CommentModel[],
    commentAuthors: User[],
    replyAuthors: User[],
    currentUser: string,
    language: string
  ): Promise<CommentModel[]> {
    let filteredComments: CommentModel[] = [];
    if (comments ?? false) {
      filteredComments = await this.modifyComment(comments, currentUser, commentAuthors, language, PostResponse.COMMENT);
      for (const comment of filteredComments) {
        if (comment.removedBy) {
          delete comment?.replies;
        }
        if (comment?.replies) {
          comment.replies = await this.modifyComment(comment.replies, currentUser, replyAuthors, language, PostResponse.REPLY);
        }
      }
    }
    return filteredComments;
  }

  /**
   * Creates and returns a comment object
   * @param request Request Body with comment and isCommentTextProfane flag
   * @param authorId Author of comment
   * @returns Comment Object
   */
  public async createCommentObject(request, authorId: string) {
    const comment = new CommentModel();
    comment[mongoDbTables.story.id] = new ObjectId();

    const user: User = await this.mongoSvc.readByID(collections.USERS, authorId);
    const author = new CommentAuthor();
    author.id = new ObjectId(authorId);
    author.displayName = user.displayName;

    comment.comment = request.comment;
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    comment.flagged = false;
    comment.removed = false;
    comment.isCommentTextProfane = request.isCommentTextProfane;
    comment.author = author;

    delete comment.postId;
    return comment;
  }

  /**
   * Returns the number of comments
   * @param comments Comments
   * @returns comment count
   */
  public getCommentCount(comments: CommentModel[]) {
    let count = 0;
    if (comments ?? false) {
      const publishedComments = comments.filter((c) => c.removed === false);
      count += publishedComments.length;
      publishedComments.forEach((comment) => {
        if (comment.replies ?? false) {
          const publishedReplies = comment.replies.filter((r) => r.removed === false);
          count += publishedReplies.length;
        }
      });
    }
    return count;
  }

  /**
   * Returns a story object from querying
   * @param storyId story Id
   * @param commentId Comment Id
   * @param replyId Reply Id
   * @returns Story Object if exists
   */
  public async getReplyStory(storyId: string, commentId: string, replyId: string) {
    const query = {
      [mongoDbTables.story.id]: new ObjectId(storyId),
      [mongoDbTables.story.comments]: {
        [queryStrings.elemMatch]: {
          [mongoDbTables.story.id]: new ObjectId(commentId),
          [mongoDbTables.story.replies]: {
            [queryStrings.elemMatch]: {
              [mongoDbTables.story.id]: new ObjectId(replyId)
            }
          }
        }
      }
    };

    return this.mongoSvc.readByValue(
      collections.STORY,
      query
    );
  }

  /**
   * checks flagged user log and returns if user already exists in log
   * @param flaggedUserLog Flagged User Log
   * @param userId User Id
   * @returns true or false
   */
  public hasUserFlagged(flaggedUserLog: FlaggedUserLog[], userId: string) {
    if (flaggedUserLog === undefined || flaggedUserLog.length === 0) {
      return false;
    }
    const userLog = flaggedUserLog.filter((log) => log.userId === userId);
    return userLog.length > 0 ? true : false;
  }

  /**
   * Send email to Admin
   * @param story Story
   * @param entity Type of flagged element
   */
  public async reportToAdmin(story: Story, entity: string) {
    const community: Community = await this.mongoSvc.readByID(
      collections.COMMUNITY,
      story.communityId
    );

    let emailTitle = '';
    switch (entity) {
      case storyReactionsType[0]:
        emailTitle = `${API_RESPONSE.messages.flagEmailSubject} ${community.title} community`;
        break;
      case storyReactionsType[1]:
        emailTitle = `${API_RESPONSE.messages.flaggedComment} ${community.title} community`;
        break;
      case storyReactionsType[2]:
        emailTitle = `${API_RESPONSE.messages.flaggedReply} ${community.title} community`;
        break;
      default:
        emailTitle = API_RESPONSE.messages.flaggedContent;
        break;
    }

    const html = this.emailService.htmlForFlagStoryComment(
      story.id,
      APP.config.smtpSettings.adminUrl,
      entity
    );
    this.emailService.sendEmailMessage(APP.config.smtpSettings,
      APP.config.smtpSettings.flagReviewEmail,
      emailTitle,
      html);
  }

  public getUpdateCommentQuery(comment: CommentModel, userId: string, userLog: FlaggedUserLog, commentType: string) {
    let query;
    if (commentType === storyReactionsType[1]) {
      if (comment.flaggedUserLog === undefined) {
        query = {
          $set: {
            [mongoDbTables.story.commentFlagged]: true,
            [mongoDbTables.story.commentUpdatedAt]: new Date(),
            [mongoDbTables.story.commentFlaggedLog]: [userLog]
          }
        };
      }
      else {
        query = {
          $set: {
            [mongoDbTables.story.commentFlagged]: true,
            [mongoDbTables.story.commentUpdatedAt]: new Date()
          }
        };
        if (!this.hasUserFlagged(comment.flaggedUserLog, userId)) {
          query['$push'] = {
            [mongoDbTables.story.commentFlaggedLog]: userLog
          };
        }
      }
    }
    else if (commentType === storyReactionsType[2]) {
      if (comment.flaggedUserLog === undefined) {
        query = {
          $set: {
            [mongoDbTables.story.replyFlagged]: true,
            [mongoDbTables.story.replyUpdatedAt]: new Date(),
            [mongoDbTables.story.replyFlaggedLog]: [userLog]
          }
        };
      }
      else {
        query = {
          $set: {
            [mongoDbTables.story.replyFlagged]: true,
            [mongoDbTables.story.replyUpdatedAt]: new Date()
          }
        };
        if (!this.hasUserFlagged(comment.flaggedUserLog, userId)) {
          query['$push'] = {
            [mongoDbTables.story.replyFlaggedLog]: userLog
          };
        }
      }
    }

    return query;
  }

  /**
   * Returns comments with updated author data and comment content
   * @param comments comments to edited
   * @param currentUser current User id
   * @param authors authors of comments
   * @param language language
   * @returns filtered comments
   */
  private async modifyComment(
    comments: CommentModel[],
    currentUser: string,
    authors: User[],
    language?: string,
    type?: string
  ): Promise<CommentModel[]> {
    if (!comments) { return undefined; }
    const processedComments: CommentModel[] = [];
    for (const comment of comments) {
      const commentReactionData = this.reactionHelper.getReactionForCurrentUser(comment.reactions, currentUser);
      comment[REACTIONS.REACTION_COUNT] = commentReactionData.reactionCount;
      comment[REACTIONS.USER_REACTION] = commentReactionData.userReaction;
      delete comment?.reactions;
      comment.id = comment[mongoDbTables.story.id];
      delete comment[mongoDbTables.story.id];
      comment[mongoDbTables.story.userFlagged] = comment.flagged ? this.hasUserFlagged(comment.flaggedUserLog, currentUser) : false;
      delete comment.flaggedUserLog;
      if (!comment.removed) {
        processedComments.push(comment);
      }
      else {
        if (comment.removedBy) {
          await this.modifyToRemovedComment(comment, language ?? TranslationLanguage.ENGLISH, type);
          processedComments.push(comment);
        }
      }
    }
    await this.postsHelper.addAuthor(processedComments, authors);

    return processedComments;
  }

  /**
   * changes the removed comment content
   * @param commentElement removed comment to be modified
   * @param language language
   */
  private async modifyToRemovedComment(commentElement: CommentModel, language: string, type?: string) {
    const adminUser = await this.mongoSvc.readByID(collections.ADMINUSERS, commentElement.removedBy);
    if (adminUser !== null) {
      commentElement.comment = translationLiterals.deletedCommentMessage[language];
      commentElement.author = {
        id: adminUser.id.toString(),
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        displayName: adminUser.displayName,
        displayTitle: adminUser.displayTitle,
        profileImage: adminUser.profileImage,
        role: adminUser.role
      };
    } else {
      commentElement.comment = (type === PostResponse.COMMENT) ? translationLiterals.selfDeletedCommentMessage[language] : translationLiterals.selfDeletedReplyMessage[language];
    }
    commentElement[REACTIONS.REACTION_COUNT] = 0;
    commentElement[REACTIONS.USER_REACTION] = null;
  }
}
