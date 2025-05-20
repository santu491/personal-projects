import {
  API_RESPONSE,
  collections, ConstCommunityNames, helpCardBanner,
  mongoDbTables, NotificationDeepLink, NotificationMessages, NotificationType, REACTIONS, Result, SQSParams, TranslationLanguage, Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP, getArgument } from '@anthem/communityapi/utils';
import { ListPlatformApplicationsCommand, ListTopicsCommand, SNSClient } from '@aws-sdk/client-sns';
import { ObjectId } from 'mongodb';
import Container, { Service } from 'typedi';
import { Blocked } from '../models/blockedModel';
import { Community } from '../models/communitiesModel';
import { Installations } from '../models/internalRequestModel';
import { ProfileImage } from '../models/profileImageModel';
import { Reaction, ReactionLog, UserReaction } from '../models/reactionModel';
import { BaseResponse } from '../models/resultModel';
import { SearchTerm } from '../models/searchTermModel';
import { BooleanResponse, Story } from '../models/storyModel';
import {
  AppVersion,
  Badge,
  BlockedUser, CommunityInfo, ProfilePicture,
  PushNotificationPreferencesStatus,
  Tou,
  User, UserModel,
  UserProfile
} from '../models/userModel';
import { Schedule } from './aws/schedule';
import { SqsService } from './aws/sqsService';
import { CommunitiesHelper } from './helpers/communitiesHelper';
import { NotificationHelper } from './helpers/notificationHelper';
import { ReactionHelper } from './helpers/reactionHelper';
import { UserHelper } from './helpers/userHelper';
import { InternalService } from './internalService';
import { PublicService } from './publicService';
import { PushNotifications } from './pushNotifications';
import { SearchTermService } from './searchTermService';
import { StoryService } from './storyService';

@Service()
export class UserService {
  userHelper = Container.get(UserHelper);
  storyService = Container.get(StoryService);
  reactionHelper = Container.get(ReactionHelper);
  publicService = Container.get(PublicService);
  pushNotification = Container.get(PushNotifications);
  schedule = Container.get(Schedule);
  constructor(
    private mongoService: MongoDatabaseClient,
    private result: Result,
    private _internalService: InternalService,
    private searchTermService: SearchTermService,
    @LoggerParam(__filename) private _log: ILogger,
    private validate: Validation,
    private sqsService: SqsService,
    private communitiesHelper: CommunitiesHelper,
    private notificationHelper: NotificationHelper
  ) { }

  public async getUserById(id: string): Promise<BaseResponse> {
    try {
      const userInfo: User = await this.mongoService.readByID(
        collections.USERS,
        id
      );
      if (userInfo == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      userInfo.profilePicture = await this.userHelper.buildProfilePicturePath(id);
      if (userInfo.hasAgreedToTerms === undefined) {
        userInfo.hasAgreedToTerms = false;
      }
      return this.result.createSuccess(this.userHelper.getUserWithoutAttributes(userInfo));
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async joinCommunity(
    userId: string,
    communityId: string
  ): Promise<BaseResponse> {
    try {
      const userObj: BaseResponse = await this.validateJoinOrLeave(
        userId,
        communityId
      );
      const user: User = userObj.data.value as User;

      if (user.myCommunities == null) {
        user.myCommunities = [];
      }
      if (user.myCommunities.includes(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userIsInCommunity;
        return this.result.createError([this.result.errorInfo]);
      }
      user.myCommunities.push(communityId);

      const communityDetails = user.attributes.communityDetails?.filter((data) => data.communityId === communityId);
      const newCommunityData = (user.attributes.communityDetails) ? {
        $set: {
          [mongoDbTables.users.myCommunities]: user.myCommunities
        },
        $push: {
          [mongoDbTables.users.communityDetails]: {
            [mongoDbTables.users.communityId]: communityId,
            [mongoDbTables.users.visitCount]: 0,
            [mongoDbTables.users.dueDateEnteredOnce]: false
          }
        }
      } : {
        $set: {
          [mongoDbTables.users.myCommunities]: user.myCommunities,
          [mongoDbTables.users.communityDetails]: [{
            [mongoDbTables.users.communityId]: communityId,
            [mongoDbTables.users.visitCount]: 0,
            [mongoDbTables.users.dueDateEnteredOnce]: false
          }]
        }
      };
      const query = (communityDetails && communityDetails?.length > 0) ?
        {
          $set: {
            [mongoDbTables.users.myCommunities]: user.myCommunities
          }
        } : newCommunityData;
      const userObject = { [mongoDbTables.users.id]: new ObjectId(userId) };
      const updatedUser = await this.mongoService.findAndUpdateOne(collections.USERS, userObject, query);

      if (updatedUser === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.failedToUpdate;

        return this.result.createError([this.result.errorInfo]);
      }

      updatedUser.profilePicture = await this.userHelper.buildProfilePicturePath(userId);
      return this.result.createSuccess(updatedUser);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async logOutUser(token: string): Promise<BaseResponse> {
    try {
      const resp = await this._internalService.revokeAccessToken(token);
      return this.result.createSuccess(resp);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async resetBadgeCount(model: Badge, userId: string): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(collections.USERS, userId);

      /* Reset badge count in installations collection */
      const updateQuery = {
        $set: {
          [mongoDbTables.installations.badge]: model.count
        }
      };
      const userIdObj = {
        [mongoDbTables.installations.userId]: user.id,
        [mongoDbTables.installations.deviceToken]: model.deviceToken
      };
      const resp = await this.mongoService.updateByQuery(collections.INSTALLATIONS, userIdObj, updateQuery);
      return this.result.createSuccess(resp);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateDisplayName(userId: string, displayName: string): Promise<BaseResponse> {
    try {
      const currentUser: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );
      if (currentUser == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      currentUser.displayName = displayName;

      const updateQuery = {
        $set: {
          [mongoDbTables.users.displayName]: displayName
        }
      };
      const userIdObj = { [mongoDbTables.users.id]: new ObjectId(userId) };
      await this.mongoService.updateByQuery(collections.USERS, userIdObj, updateQuery);

      currentUser.profilePicture = await this.userHelper.buildProfilePicturePath(currentUser.id);

      //Updating display names in stories
      const value = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.authorId]: userId
      };
      const stories: Story[] = await this.mongoService.readAllByValue(
        collections.STORY,
        value
      );

      if (stories && Array.isArray(stories) && stories.length > 0) {
        this.storyService.updateDisplayNameInStory(userId, displayName);
        const storyIds = stories.map((story) => {
          return story.id;
        });
        this.userHelper.updateBinderDisplayName(displayName, storyIds);
      }

      this.userHelper.updateActivitiesDisplayName(userId, displayName);

      return this.result.createSuccess(this.userHelper.getUserWithoutAttributes(currentUser));
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateTermsOfUse(userId: string): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );
      if (user == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const appVersion: AppVersion = await this.mongoService.readByValue(
        collections.APPVERSION,
        {}
      );
      if (!user.tou) {
        user.tou = [];
      }
      const isTouVersionAccepted = user.tou.find(
        (tou) => tou.version === appVersion.tou
      );

      const userObject = { [mongoDbTables.users.id]: new ObjectId(userId) };
      const query = {
        $set: {
          [mongoDbTables.users.tou]: user.tou
        }
      };
      if (!isTouVersionAccepted) {
        const tou = new Tou();
        tou.version = appVersion.tou;
        tou.acceptedAt = new Date();
        user.tou.push(tou);

        await this.mongoService.updateByQuery(
          collections.USERS,
          userObject,
          query
        );
      } else {
        isTouVersionAccepted.acceptedAt = new Date();
        const index = user.tou.findIndex((t) => t.version === appVersion.tou);
        user.tou[index] = isTouVersionAccepted;

        await this.mongoService.updateByQuery(
          collections.USERS,
          userObject,
          query
        );
      }
      user.hasAgreedToTerms = true;
      return this.result.createSuccess(this.userHelper.getUserWithoutAttributes(user));
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public userFromModel(model: UserModel): User {
    const user = new User();
    user.username = model.username;
    user.displayName = model.displayName;
    user.active = true;
    user.hasAgreedToTerms = false;

    return user;
  }

  public async getUserProfileById(
    userId: string,
    language: string
  ): Promise<BaseResponse> {
    try {
      const userProfile = new UserProfile();

      const user: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );
      if (user == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      userProfile.user = this.userHelper.getUserWithoutAttributes(user);
      userProfile.user.profilePicture = await this.userHelper.buildProfilePicturePath(user.id);

      if (userProfile.user.myCommunities) {
        userProfile.communities = await this.communitiesHelper.getMultipleCommunities(userProfile.user.myCommunities, language);
      }

      const value = {
        [mongoDbTables.blocked.blockingUser]: userId
      };
      const myblocks: Blocked[] = await this.mongoService.readAllByValue(
        collections.BLOCKED,
        value
      );

      const blockedUsers: BlockedUser[] = [];

      for (const b of myblocks) {
        const userObject: User = await this.mongoService.readByID(
          collections.USERS,
          b.blockedUser
        );
        if (userObject) {
          const blockedUser = new BlockedUser();
          blockedUser.username = userObject.displayName;
          blockedUser.id = userObject.id;

          blockedUsers.push(blockedUser);
        }
      }

      userProfile.blockedUsers = blockedUsers;

      return this.result.createSuccess(userProfile);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getUserProfileImage(userId: string): Promise<BaseResponse> {
    try {
      const profileImage: ProfileImage = await this.mongoService.readByValue(
        collections.PROFILEIMAGES,
        { [mongoDbTables.profileImages.userId]: userId }
      );
      if (profileImage == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.noDataResponseTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noDataResponseDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(profileImage);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async leaveCommunity(
    userId: string,
    communityId: string
  ): Promise<BaseResponse> {
    try {
      const userObj: BaseResponse = await this.validateJoinOrLeave(
        userId,
        communityId
      );
      const user: User = userObj.data.value as User;

      if (user.myCommunities == null || !user.myCommunities.includes(communityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userIsNotInCommunity;
        return this.result.createError([this.result.errorInfo]);
      }
      const communityIndex = user.myCommunities.indexOf(communityId);
      user.myCommunities.splice(communityIndex, 1);

      const communityDetailIndex = user.attributes.communityDetails?.findIndex((data) => data.communityId === communityId);
      if ( communityDetailIndex > -1 &&
        (!user.attributes.communityDetails[communityDetailIndex].dueDate ||
        user.attributes.communityDetails[communityDetailIndex]?.dueDate === '')) {
        user.attributes.communityDetails.splice(communityDetailIndex, 1);
      }

      const query = {
        $set: {
          [mongoDbTables.users.myCommunities]: user.myCommunities,
          [mongoDbTables.users.communityDetails]: user.attributes.communityDetails
        }
      };

      const userObject = { [mongoDbTables.users.id]: new ObjectId(userId) };
      await this.mongoService.updateByQuery(collections.USERS, userObject, query);

      // Delete the User Scheduled Community Based PNs.
      const leftCommunity: Community = await this.mongoService.readByID(collections.COMMUNITY, communityId);
      if (leftCommunity.parent === ConstCommunityNames.MATERNITY) {
        await this.schedule.cancelJob(userId);
      }

      //Remove user stories from that community.
      const filter = {
        [mongoDbTables.story.removed]: false,
        [mongoDbTables.story.published]: true,
        [mongoDbTables.story.authorId]: userId,
        [mongoDbTables.story.communityId]: communityId
      };

      const stories: Story[] = await this.mongoService.readAllByValue(
        collections.STORY,
        filter
      );

      for (const story of stories) {
        const flag = await this.storyService.setPublished(userId, story.id, false);

        if (!flag.data.isSuccess) {
          this.result.errorInfo.title = API_RESPONSE.messages.badData;
          this.result.errorInfo.detail = JSON.stringify(flag.data.errors);
          return this.result.createError([this.result.errorInfo]);
        }
      }

      user.profilePicture = await this.userHelper.buildProfilePicturePath(userId);
      return this.result.createSuccess(user);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addProfilePicture(model: ProfilePicture): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(collections.USERS, model.userId);
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const profilePictureFileName = await this.uploadProfilePicture(model, this.result.createGuid());
      if (!this.validate.isNullOrWhiteSpace(profilePictureFileName) && !profilePictureFileName.includes('error')) {
        user.profilePicture = profilePictureFileName;
      }
      else {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.profilePictureNotBase64;
        return this.result.createError([this.result.errorInfo]);
      }
      const updateFilter = { [mongoDbTables.users.id]: new ObjectId(model.userId) };
      const updateValue = {
        $set: {
          [mongoDbTables.users.profilePicture]: user.profilePicture
        }
      };
      await this.mongoService.updateByQuery(collections.USERS, updateFilter, updateValue);
      user.profilePicture = await this.userHelper.buildProfilePicturePath(user.id);
      return this.result.createSuccess(this.userHelper.getUserWithoutAttributes(user));
    }
    catch (error) {
      return this.result.createException(error);
    }
  }

  public async joinUserCommunities(
    userId: string,
    communities: string[],
    errorCommunities: string[]
  ): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );

      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const communityDetails = [];
      user.myCommunities = [];

      for (const community of communities) {
        const comm: Community = await this.mongoService.readByID(
          collections.COMMUNITY,
          community
        );
        if (comm === null) {
          errorCommunities.push(community);
        }
        else {
          communityDetails.push({
            communityId: community,
            visitCount: 0,
            dueDateEnteredOnce: false
          } as CommunityInfo);
          user.myCommunities.push(community);
        }
      }

      const query = {
        $set: {
          [mongoDbTables.users.myCommunities]: user.myCommunities,
          [mongoDbTables.users.communityDetails]: communityDetails
        }
      };

      const userObject = { [mongoDbTables.users.id]: new ObjectId(userId) };
      await this.mongoService.updateByQuery(collections.USERS, userObject, query);
      user.profilePicture = await this.userHelper.buildProfilePicturePath(userId);

      if (errorCommunities.length > 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
        return this.result.createError(errorCommunities);
      }

      return this.result.createSuccess(this.userHelper.getUserWithoutAttributes(user));
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateOnBoardingState(userId: string, state: string): Promise<BaseResponse> {
    try {
      /* Get user from User collection */
      const currentUser: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );
      /* Check if user exists or not */
      if (currentUser == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      currentUser.onBoardingState = state;
      /* Update onBoardingState value in User collection */
      const updateQuery = {
        $set: {
          [mongoDbTables.users.onBoardingState]: state
        }
      };
      const userIdObj = { [mongoDbTables.users.id]: new ObjectId(userId) };
      await this.mongoService.updateByQuery(collections.USERS, userIdObj, updateQuery);
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  /**
   * One of the following values can be updated in Users Collection
   * meTabHelpCardBanner, localServiceHelpCardBanner, communityHelpCardBanner, localCategoryHelpCardBanner, cancerCommunityCard
   * @param userId user ID
   * @param bannerData the value to be added to db
   * @returns success or failure of update
   */
  public async updateHelpBannerViewedData(userId: string, bannerData: object) {
    try {
      const currentUser: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );

      if (currentUser == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (helpCardBanner.includes(Object.keys(bannerData)[0])) {
        const updateUser = {
          $set: {
            [mongoDbTables.users[Object.keys(bannerData)[0]]]: true
          }
        };

        const userIdObj = { [mongoDbTables.users.id]: new ObjectId(userId) };
        const res = await this.mongoService.updateByQuery(
          collections.USERS,
          userIdObj,
          updateUser
        );
        const response = new BooleanResponse();
        response.operation = res > 0 ? true : false;
        return this.result.createSuccess(response);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.noDataResponseDetail;
        return this.result.createError([this.result.errorInfo]);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateUserCategories(
    userId: string,
    categories: string[]
  ): Promise<BaseResponse> {
    try {
      const user: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );
      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const validCategories: string[] = [];
      const errorCategories: string[] = [];
      const availableCategories = [];

      if (categories.length > 0) {
        categories.forEach((category) => {
          if (this.validate.isHex(category)) {
            validCategories.push(category);
          } else {
            errorCategories.push(category);
          }
        });
      }

      user.localCategories = [];

      const searchTermsObject = await this.searchTermService.getAllSearchTerms(TranslationLanguage.ENGLISH);
      const searchTerms = searchTermsObject.data.value as SearchTerm[];

      for (const category of validCategories) {
        const filteredData =
          searchTerms.length > 0 &&
          searchTerms.find((searchTrem) => searchTrem.id === category);
        if (filteredData) {
          availableCategories.push(category);
        } else {
          errorCategories.push(category);
        }
      }
      user.localCategories = availableCategories;

      const updateUser = {
        $set: {
          [mongoDbTables.users.localCategories]: user.localCategories
        }
      };
      const userIdObj = { [mongoDbTables.users.id]: new ObjectId(userId) };
      await this.mongoService.updateByQuery(
        collections.USERS,
        userIdObj,
        updateUser
      );
      if (errorCategories.length > 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = `${API_RESPONSE.messages.invalidIds
        } : ${errorCategories.toString()}`;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(this.userHelper.getUserWithoutAttributes(user));
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAppTranslations(language: string, contentType: string): Promise<BaseResponse> {
    try {
      return await this.publicService.getAppTranslations(language, contentType);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async addUserReaction(userReaction: UserReaction, isRemove: boolean): Promise<BaseResponse> {
    try {
      const currentUser: User = await this.mongoService.readByID(
        collections.USERS,
        userReaction.userId
      );
      if (currentUser === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const userStory: Story = await this.mongoService.readByID(
        collections.STORY,
        userReaction.entityId
      );
      if (userStory === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      let storyReactionObject: Reaction = userStory.reaction ?? this.reactionHelper.createReactionObject();

      const objIndex = storyReactionObject.log.findIndex((reactions) => reactions.userId === userReaction.userId);

      if (objIndex === -1 && isRemove) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.noAvailableReaction;
        return this.result.createError([this.result.errorInfo]);
      }

      storyReactionObject = this.reactionHelper.updateReactionObject(storyReactionObject, objIndex, userReaction.reaction, isRemove);

      if (objIndex === -1 && !isRemove) {
        const reaction = new ReactionLog();
        reaction.userId = userReaction.userId;
        reaction.reaction = userReaction.reaction;
        reaction.createdDate = new Date();
        reaction.updatedDate = new Date();

        storyReactionObject.log.push(reaction);

        /**
         * When a new reaction is added then only we are creating the PN.
         * Create the Activity for the Story Author regarding the PN.
         * So, push this reaction detail to the Story SQS Queue to get notified through PN.
         */

        // Update the Activity of the user with reaction activity Details.
        const activity = await this.notificationHelper.handleStoryActivity(
          userStory.authorId,
          currentUser,
          NotificationMessages.ReactionActivityTitle,
          userStory.id
        );

        // Get the user Installations for the device details.
        const installation: Installations = await this.mongoService.readByValue(
          collections.INSTALLATIONS,
          { [mongoDbTables.installations.userId]: userStory.authorId }
        );

        const author: User = await this.mongoService.readByID(
          collections.USERS,
          userStory.authorId
        );

        if (author !== null && author.active && installation !== null && author.attributes.reactionNotificationFlag) {
          /* Push the notification to the SQS Queue. */
          const notificationData = {
            type: NotificationType.REACTION,
            receiverId: userStory.authorId,
            senderId: currentUser.id,
            title: NotificationMessages.ReactionTitle,
            body: NotificationMessages.ReactionContent,
            communityId: userStory.communityId,
            activityObjId: activity[mongoDbTables.activity.id].toString(),
            deepLink: NotificationDeepLink.ACTIVITY,
            createdDate: new Date(),
            env: getArgument('env'),
            deepLinkInApp: {
              storyId: userReaction.entityId
            }
          };
          await this.sqsService.addToNotificationQueue(notificationData, APP.config.aws.userActivityQueue, SQSParams.ACTIVITY_MESSAGE_GROUP_ID);
        }
      }
      userStory.reaction = storyReactionObject;

      const filter = { _id: new ObjectId(userStory.id) };
      const setvalues = {
        $set: { reaction: storyReactionObject }
      };
      await this.mongoService.updateByQuery(collections.STORY, filter, setvalues);

      const userReactionObject = this.reactionHelper.getReactionForCurrentUser(userStory.reaction, userReaction.userId);
      userStory[REACTIONS.REACTION_COUNT] = userReactionObject.reactionCount;
      userStory[REACTIONS.USER_REACTION] = userReactionObject.userReaction;

      delete userStory.reaction;

      return this.result.createSuccess(userStory);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getSNSTopics(): Promise<BaseResponse> {
    try {
      const snsClient = new SNSClient({ apiVersion: APP.config.aws.apiVersion, region: APP.config.aws.region1 });

      const listTopicCommand = new ListTopicsCommand({});
      const listTopics = snsClient.send(listTopicCommand);

      const listPlatAppCommand = new ListPlatformApplicationsCommand({});
      const apps = await snsClient.send(listPlatAppCommand);

      const topics = await listTopics.then((data) => data.Topics);

      return this.result.createSuccess([topics, apps]);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updatePushNotificationPreferencesFlags(userId: string, pushNotificationPreferencesFlags: PushNotificationPreferencesStatus) {
    try {
      // Get user from User collection
      const currentUser: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );

      /* Check if user exists or not */
      if (currentUser == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const pnSetValues = currentUser?.attributes ? currentUser.attributes : {};
      for (const pn in pushNotificationPreferencesFlags) {
        pnSetValues[pn] = pushNotificationPreferencesFlags[pn];
      }

      const setvalues = {
        $set: { attributes: pnSetValues }
      };

      // Update the user with the help banner viewd data.
      const userIdObj = { [mongoDbTables.users.id]: new ObjectId(userId) };
      await this.mongoService.updateByQuery(
        collections.USERS,
        userIdObj,
        setvalues
      );
      const response = new BooleanResponse();
      response.operation = true;
      return this.result.createSuccess(response);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async uploadProfilePicture(userModel: ProfilePicture, pictureId: string) {
    try {
      const picture = await this.mongoService.readByValue(collections.PROFILEIMAGES, { [mongoDbTables.profileImages.userId]: userModel.userId });
      if (picture === undefined || picture === null) {
        const profileImageObject = new ProfileImage();
        profileImageObject.userId = userModel.userId;
        profileImageObject.profileImageBase64 = userModel.profilePicture;
        await this.mongoService.insertValue(collections.PROFILEIMAGES, profileImageObject);
      }
      else {
        const updateFilter = { [mongoDbTables.profileImages.userId]: userModel.userId };
        const updateValue = {
          $set: {
            [mongoDbTables.profileImages.profileImageBase64]: userModel.profilePicture
          }
        };
        await this.mongoService.updateByQuery(collections.PROFILEIMAGES, updateFilter, updateValue);
      }
      return `${pictureId}.jpg`;
    }
    catch (error) {
      return `error:${(error as Error).message}`;
    }
  }

  private async validateJoinOrLeave(
    userId: string,
    communityId: string
  ): Promise<BaseResponse> {
    try {
      const community = await this.mongoService.readByID(
        collections.COMMUNITY,
        communityId
      );
      if (community === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const user: User = await this.mongoService.readByID(
        collections.USERS,
        userId
      );

      if (user === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(user);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
