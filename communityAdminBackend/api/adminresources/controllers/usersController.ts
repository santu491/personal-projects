import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  RequestValidation,
  Result,
  Validation
} from '@anthem/communityadminapi/common';
import {
  Body2,
  OpenAPI2,
  Param2,
  QueryParam2
} from '@anthem/communityadminapi/utils';
import { Get, JsonController, Post, Put } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import {
  CreateProfileRequest,
  UpdateProfileRequest
} from '../models/adminModel';
import { BaseResponse } from '../models/resultModel';
import { DeleteUserRequest } from '../models/userModel';
import { AdminUserService } from '../services/adminUserService';
import { UserService } from '../services/userService';

@JsonController(API_INFO.securePath)
export class UsersController extends BaseController {
  constructor(
    private result: Result,
    private userService: UserService,
    private validate: Validation,
    private requestValidation: RequestValidation,
    private adminUser: AdminUserService
  ) {
    super();
  }

  @Put('/banUser/:userId')
  @OpenAPI2({
    description: 'Ban the user from all communities',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async banUser(
    @Param2('userId') userId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.invalidUserIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.userService.deleteUser(userId);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Put('/profile')
  @OpenAPI2({
    description: 'Update the user profile details',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateProfile(
    @Body2() payload: UpdateProfileRequest
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      return await this.userService.updateAdminProfile(payload, currentUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/profile')
  @OpenAPI2({
    description: 'Get the admin user profile',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getProfile(): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();

      return await this.userService.getProfile(adminUser);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Get('/profile/all')
  @OpenAPI2({
    description: 'Get the admin user profile',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getAllProfile(
    @QueryParam2('pageNumber') pageNumber: number,
      @QueryParam2('pageSize') pageSize: number,
      @QueryParam2('sort') sort: number
  ): Promise<BaseResponse> {
    try {
      const adminUser = this.validate.checkUserIdentity();
      const pageParams = { pageNumber, pageSize, sort };
      const validation = this.validate.isValid(pageParams);
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validation.reason;
        this.result.createError([this.result.errorInfo]);
      }
      return await this.userService.getAllProfile(
        pageNumber,
        pageSize,
        sort,
        adminUser
      );
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Get('/profile/any')
  @OpenAPI2({
    description: 'Get the admin user profile',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getOtherProfile(
    @QueryParam2('id') userId: string
  ): Promise<BaseResponse> {
    try {
      if (this.validate.isHex(userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        this.result.createError([this.result.errorInfo]);
      }
      return await this.adminUser.getOtherProfile(userId);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Post('/profile')
  @OpenAPI2({
    description: 'Create a new admin user.',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async createProfile(
    @Body2() payload: CreateProfileRequest
  ): Promise<BaseResponse> {
    try {
      const currentUser = this.validate.checkUserIdentity();
      const validation = this.requestValidation.validateCreateAdminUser(
        payload
      );
      if (!validation.validationResult) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = validation.reason;

        return this.result.createError([this.result.errorInfo]);
      }
      return await this.userService.createAdminProfile(payload, currentUser);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Put('/profile/active')
  @OpenAPI2({
    description: 'update active flag of admin user',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateActiveFlag(@QueryParam2('id') id: string,
    @QueryParam2('active') active: boolean): Promise<BaseResponse> {
    try {
      if (!id || !this.validate.isHex(id)) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;

        return this.result.createError(this.result.errorInfo);
      }
      const currentUser = this.validate.checkUserIdentity();
      return await this.userService.updateActiveFlag(currentUser, id, active);
    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/user/profile')
  @OpenAPI2({
    description: 'Get the user profile',
    response: { ...DEFAULT_RESPONSES }
  })
  public async getUserProfile(
    @QueryParam2('username') username: string
  ): Promise<BaseResponse> {
    try {
      if (!username) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.invalidUserNameTitle;
        return this.result.createError([this.result.errorInfo]);
      }
      return await this.userService.getUserProfile(username);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Put('/user/minor/:userId')
  @OpenAPI2({
    description: 'Update users opt in minor',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async updateOptInMinor(
    @Param2('userId') userId: string,
      @QueryParam2('isOptIn', { required: true }) isOptIn: boolean
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.invalidUserIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.userService.updateOptInMinor(userId, isOptIn);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Put('/delete/user')
  @OpenAPI2({
    description: 'Delete user profile',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async deleteProfile(
    @Body2() payload: DeleteUserRequest
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(payload.userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.userService.deleteProfile(payload.userId);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }

  @Get('/user/export')
  @OpenAPI2({
    description: 'Get Export Data',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async exportProfile(
    @QueryParam2('userId') userId: string
  ): Promise<BaseResponse> {
    try {
      if (!this.validate.isHex(userId)) {
        this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      return this.userService.getExportData(userId);
    } catch (error) {
      return this.result.createError((error as Error).message);
    }
  }
}
