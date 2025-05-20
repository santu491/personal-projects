import { API_RESPONSE, collections, mongoDbTables, queryStrings } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { APP } from '@anthem/communityapi/utils';
import { ObjectId } from 'mongodb';
import Container from 'typedi';
import { ActivityAuthor } from '../../models/postsModel';
import { Author, User } from '../../models/userModel';

export class UserHelper {
  mongoService = Container.get(MongoDatabaseClient);

  /**
   * Returns user profile picture path for given user id
   * @param userId User ID
   * @returns user image path
   */
  public async buildProfilePicturePath(userId: string) {
    if (!userId || /^ *$/.test(userId)) {
      return null;
    }

    const userImage = await this.mongoService.readByValue(collections.PROFILEIMAGES, { [mongoDbTables.profileImages.userId]: userId });
    if(!userImage || userImage.profileImageBase64 === null) {
      return null;
    }

    return APP.config.restApi.userProfile.BaseUrlPath + userId;
  }

  /**
   * Return Author Object
   * @param authorId Author Id
   * @returns User Object
   */
  public async getAuthor(authorId: string): Promise<Author> {
    const user: User = await this.mongoService.readByID(
      collections.USERS,
      authorId
    );
    if (user === null) {
      throw new Error(API_RESPONSE.messages.authorDoesNotExist);
    }
    const author = new Author();
    author.displayName = user.displayName;
    author.id = user.id;
    author.profilePicture = user.profilePicture;
    author.communities = user.myCommunities ?? [];
    author.age = user.age;

    return author;
  }

  /**
   * Returns an Activity Author Object
   * @param userId User Id
   * @returns Returns Author
   */
  public async getActivityUser(userId: string): Promise<ActivityAuthor> {
    const author = new ActivityAuthor();
    const user = await this.mongoService.readByID(
      collections.USERS,
      userId
    );
    author.id = user.id;
    author.displayName = user.displayName;
    author.profilePicture = user.profilePicture;
    return author;
  }

  /**
   * Updates display name for activity initiator in Activity collections
   * @param userId User Id
   * @param displayName Display Name
   */
  public async updateActivitiesDisplayName(userId: string, displayName: string) {
    const userIdObject = new ObjectId(userId);
    const query = {
      [mongoDbTables.activity.activityList]: {
        $elemMatch: {
          [mongoDbTables.activity.activityInitiatorId]: userIdObject
        }
      }
    };

    const updateValue = {
      $set: {
        [mongoDbTables.activity.activityInitiatorDisplayName]: displayName
      }
    };

    const arrayFilters = {
      upsert: true,
      [queryStrings.arrayFilters]: [{ [mongoDbTables.activity.activityInitiatorIdFilter]: userIdObject }]
    };

    this.mongoService.updateManyByQuery(
      collections.ACTIVITY,
      query,
      updateValue,
      arrayFilters
    );
  }

  public async updateBinderDisplayName(displayName: string, storyIds: string[]) {
    const findValue = {
      [mongoDbTables.binder.storyPath]: {
        $in: storyIds
      }
    };
    const setValue = {
      $set: {
        [mongoDbTables.binder.binderStoryDisplayName]: displayName
      }
    };
    const arrayFilters = {
      [queryStrings.arrayFilters]: [
        {
          [mongoDbTables.binder.binderStoryIdFilter]: {
            $in: storyIds
          }
        }
      ]
    };

    this.mongoService.updateManyByQuery(
      collections.BINDER,
      findValue,
      setValue,
      arrayFilters
    );
  }

  public getUserWithoutAttributes(user) {
    if (user?.attributes) {
      const response = { ...user, ...user.attributes };
      delete response.attributes;
      return response;
    }
    return user;
  }

  public async setStoryPromotionReminder(userId: string) {
    this.mongoService.updateByQuery(
      collections.USERS,
      {
        [mongoDbTables.users.id]: new ObjectId(userId)
      },
      {
        $set: {
          [mongoDbTables.users.remindStoryPromotion]: false
        }
      }
    );
  }

  public async buildAdminImagePath(adminId: string) {
    const query = {
      [mongoDbTables.adminImages.adminId]: adminId
    };
    const image = await this.mongoService.readByValue(collections.ADMINUSERIMAGES, query);
    if (!image || (image[mongoDbTables.adminImages.imageBase64] === null)) {
      return null;
    }

    if (!adminId || /^ *$/.test(adminId)) {
      return null;
    }

    return APP.config.restApi.userProfile.AdminImagePath + adminId;
  }
}
