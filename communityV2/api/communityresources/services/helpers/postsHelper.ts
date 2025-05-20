import { collections, mongoDbTables, REACTIONS, TranslationLanguage } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { CommentModel, Content, Post } from '../../models/postsModel';
import { User } from '../../models/userModel';
import { CommentHelper } from './commentHelper';
import { ReactionHelper } from './reactionHelper';
import { UserHelper } from './userHelper';

@Service({ transient: true })
export class PostsHelper {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private userHelper: UserHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  /**
   * Add Author Details to Comments
   * @param comments Comment or Reply Array
   * @param authors Author Array
   */
  public async addAuthor(comments: CommentModel[], authors: User[]) {
    const adminAuthors = [];
    let isAdminAuthorPresent = false;
    for (const comment of comments) {
      if (mongoDbTables.adminUser.role in comment.author) {
        adminAuthors.push(new ObjectId(comment.author.id));
        isAdminAuthorPresent = true;
      }
      const authorObj = authors.filter((author) => {
        return author[mongoDbTables.posts.id].toString() === comment.author.id.toString();
      })[0];
      if (authorObj ?? false) {
        comment.author.displayName = authorObj.displayName ?? null;
        comment.author.firstName = authorObj.firstName;
        comment.author.lastName = authorObj.lastName;
        comment.author.profileImage = await Container.get(UserHelper).buildProfilePicturePath(authorObj[mongoDbTables.posts.id].toString());
      }
    }
    if (isAdminAuthorPresent) { await this.mapAdminToComments(comments, adminAuthors); }
  }

  public async mapAuthorToPost(post: Post, authorId: string) {
    try {
      const admin = await this._mongoSvc.readByID(collections.ADMINUSERS, authorId);
      if (admin === null) { return; }
      post.author.firstName = admin.firstName;
      post.author.lastName = admin.lastName;
      post.author.displayName = admin.displayName;
      post.author.profileImage = await this.userHelper.buildAdminImagePath(admin.id);
      post.author.role = admin.role;
    } catch (error) {
      this._log.error(error as Error);
    }
  }

  public async formatPosts(post: Post, userId: string, language: string) {
    await this.mapAuthorToPost(post, post.author.id);
    post.content = this.updateContent(post.content, language);
    const reactionData = Container.get(ReactionHelper).getReactionForCurrentUser(post.reactions, userId);
    post[REACTIONS.REACTION_COUNT] = reactionData.reactionCount;
    post[REACTIONS.USER_REACTION] = reactionData.userReaction;
    post.commentCount = post?.comments ? Container.get(CommentHelper).getCommentCount(post?.comments) : 0;
    delete post.comments;
  }

  public updateContent(content: Content, language: string) {
    if (language === TranslationLanguage.SPANISH && content[language].title === '') {
      language = TranslationLanguage.ENGLISH;
    }
    let tempContent = { ...content[language], image: content.image };
    if (content.link) {
      tempContent = {
        ...tempContent,
        link: {
          ...content.link[language],
          ...content.link
        }
      };
      delete tempContent.link.en;
      delete tempContent.link.es;
    }
    return tempContent;
  }

  private async mapAdminToComments(comments: CommentModel[], authors: ObjectId[]) {
    try {
      const query = {
        [mongoDbTables.posts.id]: {
          $in: authors
        }
      };
      const adminUsers = await this._mongoSvc.readAllByValue(collections.ADMINUSERS, query);
      for(const comment of comments) {
        if (mongoDbTables.adminUser.role in comment.author) {
          const admin = adminUsers.filter((user) => user.id === comment.author.id)[0];
          comment.author.firstName = admin.firstName;
          comment.author.lastName = admin.lastName;
          comment.author.displayName = admin.displayName;
          comment.author.profileImage = await this.userHelper.buildAdminImagePath(admin.id);
          comment.author.role = admin.role;
        }
      }
    } catch (error) {
      this._log.error(error as Error);
    }
  }
}
