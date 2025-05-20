import {
  API_RESPONSE,
  BaseController,
  BASE_URL_EXTENSION,
  DEFAULT_RESPONSES,
  Result,
  Validation
} from '@anthem/communityapi/common';
import { OpenAPI2, Param2 } from '@anthem/communityapi/utils';
import { Get, JsonController } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { PostImageService } from '../services/postImageService';

@JsonController(API_INFO.securePath + BASE_URL_EXTENSION.IMAGE)
export class PostImageController extends BaseController {
  constructor(
    private result: Result,
    private imageService: PostImageService,
    private validate: Validation
  ) {
    super();
  }

  @Get('/post/:postId')
  @OpenAPI2({
    description: 'Get post image string',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getPostImage(@Param2('postId') postId: string): Promise<BaseResponse> {
    if (!this.validate.isHex(postId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    const profileImage = await this.imageService.getPostImage(postId);

    return profileImage;
  }
}
