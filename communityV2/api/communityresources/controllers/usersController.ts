import {
  API_RESPONSE,
  BaseController,
  ContentKey,
  DEFAULT_RESPONSES,
  reactionRemove,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2,
  RequestContext
} from '@anthem/communityapi/utils';
import { Get, JsonController, Post, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { InstallationRequest } from '../models/internalRequestModel';
import { PageParam } from '../models/pageParamModel';
import { UserReaction } from '../models/reactionModel';
import { BaseResponse } from '../models/resultModel';
import { LocalCategoryData } from '../models/searchTermModel';
import {
  Badge,
  DisplayNameModel,
  HelpBannerViewedData, InstallationTokenModel, OnBoarding,
  ProfilePicture,
  PushNotificationPreferencesStatus,
  UserCommunitiesModel,
  UserIdModel
} from '../models/userModel';
import { ActivityService } from '../services/activityService';
import { BlockUserService } from '../services/blockUserService';
import { InstallationService } from '../services/installationService';
import { UserService } from '../services/userService';

@JsonController(API_INFO.securePath)
export class UsersController extends BaseController {
  constructor(
    private userService: UserService,
    private validate: Validation,
    private result: Result,
    private blockUserService: BlockUserService,
    private installationService: InstallationService,
    private activityService: ActivityService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/users/getUserActivity')
  @OpenAPI2({
    description: 'Get a users activity screen',
    responses:{ ...DEFAULT_RESPONSES }
  })
  public async getUserActivity(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('language') language?: string
  ): Promise<BaseResponse>{
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }
      const pageParams: PageParam = {
        pageNumber,
        pageSize,
        sort: 1
      };
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);
      if (!currentUser.active) {
        this.result.errorInfo.title = API_RESPONSE.messages.userNotActiveTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.userNotActiveMessage;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.activityService.getUserActivity(currentUser.id, language, pageParams);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/users/:id')
  @OpenAPI2({
    description: 'Get a user by ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getUserInfo(@Param2('id') id: string): Promise<BaseResponse> {
    if (!this.validate.isHex(id)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.userService.getUserById(id);
  }

  @Put('/users/join/:communityId')
  @OpenAPI2({
    description: 'Update Community for a given User',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateCommunityId(
    @Param2('communityId') communityId: string,
      @Body2() body: UserIdModel
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(body.userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    if (!this.validate.isHex(communityId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.userService.joinCommunity(body.userId, communityId);
  }

  @Put('/users/block/:userId')
  @OpenAPI2({
    description: 'A User can Block another User',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async blockUser(
    @Param2('userId') userId: string
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);

    return this.blockUserService.blockUser(currentUser.id, userId);
  }

  @Get('/users/block/myBlocks')
  @OpenAPI2({
    description: 'Get the block list for a user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async myBlocks(): Promise<BaseResponse> {
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);
    return this.blockUserService.myBlocks(currentUser.id);
  }

  @Post('/users/logout')
  @OpenAPI2({
    description: 'Logout user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async logout(): Promise<BaseResponse> {
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);
    if (!currentUser['accessToken']) {
      this.result.errorInfo.title = API_RESPONSE.messages.noAccessTokenTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.noAccessTokenDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    const res = await this.userService.logOutUser(currentUser['accessToken']);
    return res;
  }

  @Put('/users/removeBlock/:userId')
  @OpenAPI2({
    description: 'Remove user from block list',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async removeBlock(
    @Param2('userId') userId: string
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);
    return this.blockUserService.removeUserFromBlock(
      currentUser.id,
      userId
    );
  }

  @Get('/users/userProfile/:id')
  @OpenAPI2({
    description: 'Get a full user profile by ID',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getUserProfile(@Param2('id') userId: string,
    @QueryParam2('language') language: string): Promise<BaseResponse> {
    if (!language) {
      language = TranslationLanguage.ENGLISH;
    }
    if (!this.validate.isHex(userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const userProfile = await this.userService.getUserProfileById(userId, language);

    return userProfile;
  }

  @Put('/users/resetBadge')
  @OpenAPI2({
    description: 'Reset Badge count in installations',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async resetBadgeCount(@Body2() model: Badge): Promise<BaseResponse> {
    if (!model.userName || model?.userName?.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    if (!model.deviceToken || model?.deviceToken?.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.noDeviceTokenTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.noDeviceTokenDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);

    const response = await this.userService.resetBadgeCount(model, currentUser.id);
    return response;
  }

  @Put('/users/installation')
  @OpenAPI2({
    description: 'Delete device token from installations',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deleteInstallation(
    @Body2() model: InstallationTokenModel
  ): Promise<BaseResponse> {
    if (!model.deviceToken || model?.deviceToken?.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.noDeviceTokenTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.noDeviceTokenDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);

    return this.installationService.deleteInstallationById(model, currentUser.id);
  }

  @Post('/users/installation')
  @OpenAPI2({
    description: 'Save token to installations',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async saveInstallations(
    @Body2() model: InstallationRequest
  ): Promise<BaseResponse> {
    if (!model.userName || model?.userName?.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    if (!model.deviceToken || model?.deviceToken?.length === 0) {
      this.result.errorInfo.title = API_RESPONSE.messages.noDeviceTokenTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.noDeviceTokenDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);
    return this.installationService.saveInstallations(model, currentUser.id);
  }

  @Put('/users/updateDisplayName')
  @OpenAPI2({
    description: 'Update a user profile information',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateDisplayName(@Body2() model: DisplayNameModel): Promise<BaseResponse> {
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);

    return this.userService.updateDisplayName(currentUser.id, model.displayName);
  }

  @Put('/users/termsofuse/:userId')
  @OpenAPI2({
    description: 'Update terms of use for a user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateTermsOfUse(
    @Param2('userId') userId: string
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    const user = await this.userService.updateTermsOfUse(userId);
    return user;
  }

  @Get('/users/profileImageString/:userId')
  @OpenAPI2({
    description: 'Get user profile image string',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getUserProfileImage(@Param2('userId') userId: string): Promise<BaseResponse> {
    if (!this.validate.isHex(userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const profileImage = await this.userService.getUserProfileImage(userId);

    return profileImage;
  }

  @Put('/users/markActivityAsRead/:activityId')
  @OpenAPI2({
    description: 'Mark a user activity as read',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async markActivityAsRead(
    @Param2('activityId') activityId: string
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(activityId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);

    if (!currentUser.active) {
      this.result.errorInfo.title = API_RESPONSE.messages.userNotActiveTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.userNotActiveMessage;
      return this.result.createError([this.result.errorInfo]);
    }

    return this.activityService.markActivityAsRead(currentUser.id, activityId);
  }

  @Put('/users/leave/:communityId')
  @OpenAPI2({
    description: 'Leave a Community',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async leaveCommunity(
    @Param2('communityId') communityId: string,
      @Body2() body: UserIdModel
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(body.userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    if (!this.validate.isHex(communityId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
      return this.result.createError([this.result.errorInfo]);
    }

    const user = await this.userService.leaveCommunity(body.userId, communityId);

    return user;
  }

  @Post('/users/addProfilePicture')
  @OpenAPI2({
    description: 'Add/Edit profile picture a user',
    responses:{ ...DEFAULT_RESPONSES }
  })
  public async addProfilePicture(
    @Body2() model: ProfilePicture
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(model.userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const user=await this.userService.addProfilePicture(model);
    return user;
  }

  @Put('/users/many/join')
  @OpenAPI2({
    description: 'Update Community for a given User',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async joinUserCommunities(
    @Body2() model: UserCommunitiesModel
  ): Promise<BaseResponse> {
    if (!this.validate.isHex(model.userId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    if (model.communities == null) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidCommunityId;
      return this.result.createError([this.result.errorInfo]);
    }

    const validCommunities: string[] = [];
    const errorCommunities: string[] = [];

    model.communities.forEach((community) => {
      if (this.validate.isHex(community)) {
        validCommunities.push(community);
      }
      else {
        errorCommunities.push(community);
      }
    });

    const user = await this.userService.joinUserCommunities(model.userId, validCommunities, errorCommunities);
    return user;
  }

  @Put('/users/updateOnBoardingState')
  @OpenAPI2({
    description: 'Update onBoarding state of user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateOnBoardingState(@Body2() model: OnBoarding): Promise<BaseResponse> {
    /* Get user from Request Context */
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);
    const user = await this.userService.updateOnBoardingState(currentUser.id, model.state);
    return user;
  }

  /**
   * Jira Ticket: CCX-1773 - Provide the user a better experience with help banner to use the application pages. (ME, Community or Local Service)
   * Based on the user data (flag), the help banner view is handeled in the app.
   * API to update the user based on the pages that they viewd.
   * @param userId
   * @returns user
   */
  @Put('/users/viewedHelpBanner')
  @OpenAPI2({
    description: 'Update the user with the Help Banner Viewed Details',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async viewedHelpBanner(
    @Body2() body: HelpBannerViewedData
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      // User with user ID not found
      if (currentUser.id == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.userDoesNotExist;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError(this.result.errorInfo);
      }

      // User ID is invalid
      if (!this.validate.isHex(currentUser.id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      return await this.userService.updateHelpBannerViewedData(currentUser.id, body);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/users/localCategories')
  @OpenAPI2({
    description: 'Update the local categories for the given user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateUserLocalCategories(
    @Body2() body: LocalCategoryData
  ): Promise<BaseResponse> {
    const userIdentity = RequestContext.getContextItem('userIdentity');
    const currentUser = JSON.parse(userIdentity);

    if (!this.validate.isHex(currentUser.id)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    if (body.localCategories === null) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }
    return this.userService.updateUserCategories(
      currentUser.id,
      body.localCategories
    );
  }

  @Get('/users/translations/:language')
  @OpenAPI2({
    description: 'Get Mobile APP Translations',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAppTranslations(@Param2('language') language: string): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      return await this.userService.getAppTranslations(language, ContentKey.GENERIC);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/users/reaction')
  @OpenAPI2({
    description: 'Add/Update reaction by user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async addUserReaction(
    @Body2() body: UserReaction

  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(body.userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      if (this.validate.isNullOrWhiteSpace(body.entityId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidEntityId;
        return this.result.createError([this.result.errorInfo]);
      }

      let isRemove = false;
      if (body.reaction === reactionRemove) {
        isRemove = true;
      }
      else {
        if (!this.validate.isValidateReaction(body.reaction)) {
          this.result.errorInfo.title = API_RESPONSE.messages.invalidReactionTitle;
          this.result.errorInfo.detail = API_RESPONSE.messages.invalidReaction;
          return this.result.createError([this.result.errorInfo]);
        }
      }

      return this.userService.addUserReaction(
        body,
        isRemove
      );

    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/getSnsTopics')
  @OpenAPI2({
    description: 'Test api to see aws connection',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getSNSTopics(): Promise<BaseResponse> {
    try {
      return await this.userService.getSNSTopics();
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/users/pushNotificationPreferences')
  @OpenAPI2({
    description: 'Update the user with the Push Notification Preferences Flag',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updatePushNotificationPreferences(
    @Body2() body: PushNotificationPreferencesStatus
  ): Promise<BaseResponse> {
    try {
      const userIdentity = RequestContext.getContextItem('userIdentity');
      const currentUser = JSON.parse(userIdentity);

      // User with user ID not found
      if (currentUser.id == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.userDoesNotExist;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError(this.result.errorInfo);
      }

      // User ID is invalid
      if (!this.validate.isHex(currentUser.id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }

      const user = await this.userService.updatePushNotificationPreferencesFlags(currentUser.id, body);
      return user;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }
}
