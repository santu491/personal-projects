import { AdminDisplayTitle, AdminNotifyMessages, AdminRole, API_RESPONSE, associateInfo, collections, mongoDbTables, NotificationType, Result, SQSParams, SuperAdminRole } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP, getArgument, StringUtils } from '@anthem/communityadminapi/utils';
import { ObjectId, ObjectID } from 'mongodb';
import Container, { Service } from 'typedi';
import { AssociateGateway } from '../gateways/associateGateway';
import { UserHelperService } from '../helpers/userHelper';
import { CreateProfileRequest, UpdateProfileRequest } from '../models/adminModel';
import { Admin, LoginModel } from '../models/adminUserModel';
import { BaseResponse } from '../models/resultModel';
import { Story } from '../models/storyModel';
import { AuthorizedAdminUser, DeleteUserRequest, ExportStoryData, ExportUserData, User } from '../models/userModel';
import { AdminUserService } from './adminUserService';
import { SqsService } from './aws/sqsService';
import { RoleService } from './roleService';
import { StoryService } from './storyService';

@Service()
export class UserService {
  public roleService = Container.get(RoleService);
  public adminService = Container.get(AdminUserService);
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private storyService: StoryService,
    private associateGateway: AssociateGateway,
    private userHelper: UserHelperService,
    private sqsService: SqsService,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  /**
   * Function to Ban the user with Specific userId
   *      1. Active = False
   *      2. Delete all the Stories of the User.
   * @param userId: Id of the User to be banned.
   * @returns User
   */
  public async deleteUser(userId: string): Promise<BaseResponse> {
    try {
      const currentUser: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      if (currentUser === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      currentUser.active = false;
      const updateFilter = {
        [mongoDbTables.users.id]: new ObjectID(userId)
      };
      const updateValue = {
        $set: {
          [mongoDbTables.users.active]: false
        }
      };
      await this._mongoSvc.updateByQuery(
        collections.USERS,
        updateFilter,
        updateValue
      );
      const stories = (await this.storyService.getStoryByUserId(userId)).data
        .value;

      if (stories !== null && Array.isArray(stories) && stories.length > 0) {
        stories.forEach(async (story: Story) => {
          await this.removeStory(story.id);
        });
      }
      return this.result.createSuccess(currentUser);
    } catch (error) {
      return this.result.createError(error);
    }
  }

  public async removeStory(storyId: string): Promise<BaseResponse> {
    try {
      const story: Story = await this._mongoSvc.readByID(
        collections.STORY,
        storyId
      );
      if (story === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.storyDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      story.removed = true;
      const filter = { [mongoDbTables.story.id]: new ObjectID(storyId) };
      const setvalues = {
        $set: {
          [mongoDbTables.story.removed]: story.removed
        }
      };
      await this._mongoSvc.updateByQuery(collections.STORY, filter, setvalues);
      const storyResponse = await this.storyService.buildStoryResponse(story, null);

      return this.result.createSuccess(storyResponse);
    }
    catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getProfile(adminUser) {
    try {
      const userProfile: Admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminUser.id);
      if (userProfile === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }
      delete userProfile.password;
      userProfile.profileImage = await this.adminService.getAdminImage(adminUser.id);

      return this.result.createSuccess(userProfile);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  public async getAllProfile(pageNumber: number, pageSize: number, sort: number, adminUser): Promise<BaseResponse> {
    try {
      const sortOption = {
        [mongoDbTables.community.createdDate]: sort
      };
      const projection = {
        'projection': {
          'password': false
        }
      };
      const search = {
        [mongoDbTables.adminUser.id]:
        {
          $ne: new ObjectID(adminUser.id)
        }
      };

      const limit = pageSize;
      const skip = pageSize * (pageNumber - 1);
      const admins = [];
      const adminList = await this._mongoSvc.readAllByValue(collections.ADMINUSERS, search, sortOption, limit, skip, projection);
      for (const admin of adminList) {
        admin.profileImage = await this.adminService.getAdminImage(admin.id);
        admins.push(admin);
      }
      return this.result.createSuccess(admins);

    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updateAdminProfile(payload: UpdateProfileRequest, adminUser): Promise<BaseResponse> {
    try {
      /* Super admin editing the other admin Profile. */
      if (payload.id) {
        if (payload.role && (payload.role !== AdminRole.scadvocate)) {
          const communities = await this._mongoSvc.readAllByValue(
            collections.COMMUNITY,
            {}, null, null, null,
            {
              'projection': {
                [mongoDbTables.community.id]: 1
              }
            }
          );
          payload.communities = communities.map((c) => {
            return c.id;
          });
        }
      }
      const search = (payload.id) ? { [mongoDbTables.adminUser.id]: new ObjectID(payload.id) } : { [mongoDbTables.adminUser.id]: new ObjectID(adminUser.id) };
      delete payload.id;
      payload[mongoDbTables.adminUser.updatedAt] = new Date();

      // Add the profile Image to collection.
      if (payload.profileImage && payload.profileImage !== null) {
        await this.adminService.adminImageHandler(search[mongoDbTables.adminUser.id].toString(), payload.profileImage, true, false);
      }
      if (payload.profileImage === '') {
        await this.adminService.adminImageHandler(search[mongoDbTables.adminUser.id].toString(), payload.profileImage, false, true);
      }
      delete payload.profileImage;
      const setValues = {
        '$set': payload
      };
      const updateUser = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        search[mongoDbTables.adminUser.id].toString()
      );
      await this._mongoSvc.updateByQuery(collections.ADMINUSERS, search, setValues);
      await this.notifyOnAdminUserUpdates(payload, updateUser, adminUser);
      const response = await this._mongoSvc.readByID(
        collections.ADMINUSERS,
        search[mongoDbTables.adminUser.id].toString()
      );
      return this.result.createSuccess(response);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async createAdminProfile(payload: CreateProfileRequest, adminUser): Promise<BaseResponse> {
    try {
      /* Only the super admin can create the Admin user with the ID */
      if (!(Object.values(SuperAdminRole).includes(adminUser.role))) {
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedAddDetails;

        return this.result.createError([this.result.errorInfo]);
      }

      // If the user is persona.
      if (payload.isPersona) {
        const adminData: Admin = this.userHelper.createAdminObject(payload);
        const response = await this._mongoSvc.insertValue(collections.ADMINUSERS, adminData);

        // Notify all the active admin users about the new user.
        const scadmins = await this._mongoSvc.readAllByValue(
          collections.ADMINUSERS,
          {
            [mongoDbTables.adminUser.role]: AdminRole.scadmin,
            [mongoDbTables.adminUser.active]: true
          }
        );
        scadmins.forEach((sca) => {
          this.adminService.createActivityObject(
            sca.id,
            adminUser.id,
            NotificationType.ADMINUSER,
            `${AdminNotifyMessages.UserAdded} ${adminData.firstName} ${adminData.lastName} as ${AdminDisplayTitle[adminData.role]}.`,
            false, null, null, null, null, null, response[mongoDbTables.adminUser.id].toString()
          );
        });
        return this.result.createSuccess(response);
      }

      /* Check if the user already exists */
      const value = {
        [mongoDbTables.adminUser.username]: {
          $regex: payload.username,
          $options: 'i'
        }
      };
      const existingUser = await this._mongoSvc.readByValue(collections.ADMINUSERS, value);
      if (existingUser) {
        this.result.errorInfo.errorCode = existingUser.active ? API_RESPONSE.statusCodes[400] : API_RESPONSE.statusCodes[477];
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = existingUser.active ? API_RESPONSE.messages.adminUserExists : existingUser;
        return this.result.createError(this.result);
      }

      /* Get the Access Token */
      const onPremToken = await this.associateGateway.onPremToken();
      if (onPremToken.status !== associateInfo.STATUS) {
        throw new Error(API_RESPONSE.messages.onPremTokenError);
      }

      /* Get the user Data based on the US Domain ID */
      const userDetails = await this.userHelper.getNewAdminProfile(payload, onPremToken.access_token);
      const validationResult = this.userHelper.handleErrorResponse(userDetails);
      if (validationResult) {
        return this.result.createError(this.result.errorInfo);
      }

      // Add all the existing communities for the SCAdmins
      if (payload.role !== AdminRole.scadvocate) {
        const communities = await this._mongoSvc.readAllByValue(
          collections.COMMUNITY, {}, null, null, null,
          {
            'projection':
              { [mongoDbTables.community.id]: 1 }
          }
        );
        payload.communities = communities.map((c) => {
          return c.id;
        });
      }

      const adminData: Admin = this.userHelper.createAdminObject(payload, userDetails.user[0]);
      const response = await this._mongoSvc.insertValue(collections.ADMINUSERS, adminData);

      // Notify all the active admin users about the new user.
      const scadmins = await this._mongoSvc.readAllByValue(
        collections.ADMINUSERS,
        {
          [mongoDbTables.adminUser.role]: AdminRole.scadmin,
          [mongoDbTables.adminUser.active]: true
        }
      );
      scadmins.forEach((sca) => {
        this.adminService.createActivityObject(
          sca.id,
          adminUser.id,
          NotificationType.ADMINUSER,
          `${AdminNotifyMessages.UserAdded} ${adminData.firstName} ${adminData.lastName} as ${AdminDisplayTitle[adminData.role]}.`,
          false, null, null, null, null, null, response[mongoDbTables.adminUser.id].toString()
        );
      });

      return this.result.createSuccess(response);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async adminAuth(payload: LoginModel, admin: AuthorizedAdminUser) {
    try {
      const onPremToken = await this.associateGateway.onPremToken();
      if (onPremToken.status !== associateInfo.STATUS) {
        throw new Error(API_RESPONSE.messages.onPremTokenError);
      }

      const userDetails = await this.userHelper.getNewAdminProfile(payload, onPremToken.access_token);
      const validationResult = this.userHelper.handleErrorResponse(userDetails);
      if (validationResult) {
        return this.result.createError(this.result.errorInfo);
      }

      const webUserRequest = this.userHelper.generateWebUserRequest(onPremToken.access_token);
      delete webUserRequest.header;
      const authenticateRequest = this.userHelper.generateUserAuthRequest(payload, userDetails.user[0].userRoleEnum);

      const authenticate = await this.associateGateway.webUserAuthenticate(
        webUserRequest,
        authenticateRequest
      );

      if (!authenticate.authenticated) {
        this.result.errorInfo.title = API_RESPONSE.messages.incorrectPasswordTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.incorrectPasswordDetail;
        this.result.errorInfo.errorCode = API_RESPONSE.statusCodes[403];
        return this.result.createError(this.result.errorInfo);
      }

      admin.token = await this.userHelper.generateToken(admin);
      /* Update the admin last LogIn date */
      const search = {
        [mongoDbTables.adminUser.id]: new ObjectID(admin.id)
      };
      const value = {
        $set: {
          [mongoDbTables.adminUser.lastLogInAt]: new Date()
        }
      };
      await this._mongoSvc.updateByQuery(collections.ADMINUSERS, search, value);
      admin.rolePermissions = await this.roleService.getRoleAccess(admin.id, admin.role);
      return this.result.createSuccess(admin);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async updateActiveFlag(admin, id: string, active: boolean): Promise<BaseResponse> {
    try {
      /* Only the super admin can create the Admin user with the ID */
      if (admin.role !== AdminRole.scadmin && admin.role !== AdminRole.sysadmin) {
        this.result.errorInfo.title = API_RESPONSE.messages.notAllowedTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.notAllowedAddDetails;

        return this.result.createError([this.result.errorInfo]);
      }

      const adminToRemove = await this._mongoSvc.readByID(collections.ADMINUSERS, id);
      if (adminToRemove === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;

        return this.result.createError([this.result.errorInfo]);
      }

      const value = {
        $set: {
          [mongoDbTables.adminUser.active]: active,
          [mongoDbTables.adminUser.removed]: !(active),
          [mongoDbTables.adminUser.updatedAt]: new Date()
        }
      };
      const search = {
        [mongoDbTables.adminUser.id]: new ObjectID(id)
      };
      await this._mongoSvc.updateByQuery(collections.ADMINUSERS, search, value);

      // Notify all the active admin users about the new user.
      if (!active) {
        const scadmins = await this._mongoSvc.readAllByValue(
          collections.ADMINUSERS,
          {
            [mongoDbTables.adminUser.role]: AdminRole.scadmin,
            [mongoDbTables.adminUser.active]: true
          }
        );
        scadmins.forEach((sca) => {
          this.adminService.createActivityObject(
            sca.id,
            admin.id,
            NotificationType.ADMINUSER,
            `${AdminNotifyMessages.DeletedUser} ${adminToRemove.firstName} ${adminToRemove.lastName}.`,
            false, null, null, null, null, null, adminToRemove.id
          );
        });
      } else {
        const scadmins = await this._mongoSvc.readAllByValue(
          collections.ADMINUSERS,
          {
            [mongoDbTables.adminUser.role]: AdminRole.scadmin,
            [mongoDbTables.adminUser.active]: true
          }
        );
        scadmins.forEach((sca) => {
          this.adminService.createActivityObject(
            sca.id,
            admin.id,
            NotificationType.ADMINUSER,
            `${AdminNotifyMessages.UserAdded} ${adminToRemove.firstName} ${adminToRemove.lastName} as ${AdminDisplayTitle[adminToRemove.role]}.`,
            false, null, null, null, null, null, adminToRemove.id
          );
        });
      }

      return this.result.createSuccess(true);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  public async getUserProfile(username: string) {
    try {
      const query = {
        [mongoDbTables.users.username]: {
          $regex: `^${username}$`,
          $options: 'i'
        }
      };
      const userProfile: User = await this._mongoSvc.readByValue(
        collections.USERS,
        query
      );
      if (userProfile === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.result.createSuccess(userProfile);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  /**
   * Function to Update the optInMinor Flag for the user
   *      1. optInMinor = true/false
   * @param userId: Id of the User.
   * @param isOptIn: optInMinor flag.
   * @returns User
   */
  public async updateOptInMinor(userId: string, isOptIn: boolean): Promise<BaseResponse> {
    try {
      const currentUser: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      if (currentUser === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      currentUser.optInMinor = isOptIn;
      const updateFilter = {
        [mongoDbTables.users.id]: new ObjectID(userId)
      };
      const updateValue = {
        $set: {
          [mongoDbTables.users.optInMinor]: isOptIn
        }
      };
      await this._mongoSvc.updateByQuery(
        collections.USERS,
        updateFilter,
        updateValue
      );
      return this.result.createSuccess(currentUser);
    } catch (error) {
      return this.result.createError(error);
    }
  }

  public async deleteProfile(id: string): Promise<BaseResponse> {
    try {
      const userInfo: User = await this._mongoSvc.readByID(
        collections.USERS,
        id
      );
      if (userInfo == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const setValue = {
        $set: {
          [mongoDbTables.users.deleteRequested]: true
        }
      };
      const search = {
        [mongoDbTables.users.id]: new ObjectId(userInfo.id)
      };
      await this._mongoSvc.updateByQuery(collections.USERS, search, setValue);
      /* Push the payload to the SQS Queue. */
      const payload: DeleteUserRequest = {
        userId: id,
        username: userInfo.username,
        env: getArgument('env'),
        createdDate: new Date()
      };
      const response = await this.sqsService.addToNotificationQueue(
        payload,
        APP.config.aws.deleteProfileQueue,
        SQSParams.DELETE_PROFILE_MESSAGE_GROUP_ID
      );
      if (response) {
        return this.result.createSuccess(response);
      } else {
        this.result.errorInfo.title = API_RESPONSE.messages.internalError;
        this.result.errorInfo.detail = API_RESPONSE.messages.tryAgain;
        return this.result.createError(this.result.errorInfo);
      }
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getExportData(userId: string) {
    try {
      const userInfo: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      if (userInfo == null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.userDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      const userExportDetails: ExportUserData = new ExportUserData();
      userExportDetails.firstName = userInfo.firstName;
      userExportDetails.lastName = userInfo.lastName;
      userExportDetails.displayName = userInfo.displayName;

      const profileImage = await this._mongoSvc.getDocumentCount(
        collections.PROFILEIMAGES,
        {
          [mongoDbTables.profileImages.userId]: userId,
          [mongoDbTables.profileImages.profileImageBase64]: {
            $ne: null
          }
        }
      );
      userExportDetails.profileImageExists = +profileImage > 0;

      const userStories: ExportStoryData[] = await this._mongoSvc.readAllByValue(
        collections.STORY,
        {
          [mongoDbTables.story.authorId]: userId
        },
        {},
        null,
        null,
        {
          projection: {
            [mongoDbTables.story.communityId]: true,
            [mongoDbTables.story.published]: true
          }
        }
      );
      if (userStories.length > 0) {
        const communities = await this._mongoSvc.readAll(
          collections.COMMUNITY);
        userExportDetails.publishedStories = this.userHelper.fetchStoryCountDetails(
          userStories,
          true,
          communities
        );
        userExportDetails.unpublishedStories = this.userHelper.fetchStoryCountDetails(
          userStories,
          false,
          communities
        );
      }
      return this.result.createSuccess(userExportDetails);
    }
    catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private async notifyOnAdminUserUpdates(payload: UpdateProfileRequest, admin, updaterAdmin) {
    if (payload.role && payload.role !== admin.role) {
      // Notify all the active admin users about the new user.
      const scadmins = await this._mongoSvc.readAllByValue(
        collections.ADMINUSERS,
        {
          [mongoDbTables.adminUser.role]: AdminRole.scadmin,
          [mongoDbTables.adminUser.active]: true
        }
      );
      scadmins.forEach((sca) => {
        this.adminService.createActivityObject(
          sca.id,
          updaterAdmin.id,
          NotificationType.ADMINUSER,
          `${AdminNotifyMessages.RoleUpdated} ${admin.firstName} ${admin.lastName} role as ${AdminDisplayTitle[payload.role]}.`,
          false, null, null, null, null, null, admin.id
        );
      });
      // Notify the advocate too.
      this.adminService.createActivityObject(
        admin.id,
        updaterAdmin.id,
        NotificationType.ADMINUSER,
        `${AdminNotifyMessages.SelfRoleUpdate} ${AdminDisplayTitle[payload.role]}.`,
        false, null, null, null, null, null, admin.id
      );
    }

    if (payload.communities && !StringUtils.areEqualArray(payload.communities, admin.communities)) {
      // Notify all the active admin users about the new user.
      const scadmins = await this._mongoSvc.readAllByValue(
        collections.ADMINUSERS,
        {
          [mongoDbTables.adminUser.role]: AdminRole.scadmin,
          [mongoDbTables.adminUser.active]: true
        }
      );
      scadmins.forEach((sca) => {
        this.adminService.createActivityObject(
          sca.id,
          updaterAdmin.id,
          NotificationType.ADMINUSER,
          `${AdminNotifyMessages.CommunityChanged} ${admin.firstName} ${admin.lastName}.`,
          false, null, null, null, null, null, admin.id
        );
      });
      // Notify the advocate too.
      this.adminService.createActivityObject(
        admin.id,
        updaterAdmin.id,
        NotificationType.ADMINUSER,
        AdminNotifyMessages.SelfCommunityChanged,
        false, null, null, null, null, null, admin.id
      );
    }
  }
}
