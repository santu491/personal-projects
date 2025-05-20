import {
  API_RESPONSE,
  BaseController,
  DEFAULT_RESPONSES,
  Result,
  TranslationLanguage,
  Validation
} from '@anthem/communityapi/common';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import {
  Body2, OpenAPI2,
  Param2,
  QueryParam2
} from '@anthem/communityapi/utils';
import { ContentType, Get, JsonController, Post } from 'routing-controllers';
import { API_INFO } from '../apiInfo';
import { BaseResponse } from '../models/resultModel';
import { DevAuthModel } from '../models/userModel';
import { PartnerService } from '../services/partnerService';
import { PublicService } from '../services/publicService';

@JsonController(API_INFO.contextPath)
export class PublicController extends BaseController {
  constructor(
    private publicService: PublicService,
    private result: Result,
    private validate: Validation,
    private partnerService: PartnerService,
    @LoggerParam(__filename) private _log: ILogger
  ) {
    super();
  }

  @Get('/users/version')
  @OpenAPI2({
    description: 'Get API version',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async version(): Promise<string> {
    try {
      const version = await this.publicService.getAppVersion();
      return version;
    } catch (error) {
      this._log.error(error as Error);
      return (error as Error).message;
    }
  }

  @Get('/users/appInit')
  @OpenAPI2({
    description: 'Get APP version',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAppMinVersion(): Promise<BaseResponse> {
    try {
      const appVersion = await this.publicService.getAppMinVersion();
      return appVersion;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Post('/users/authenticate')
  @OpenAPI2({
    description: 'Generate a token for DEV login',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async devAuthenticate(
    @Body2() model: DevAuthModel
  ): Promise<BaseResponse> {
    try {
      if (!model.username || model?.username?.length === 0) {
        this.result.errorInfo.title = API_RESPONSE.messages.noUserNameTitle;
        this.result.errorInfo.detail = API_RESPONSE.messages.noUserNameDetail;
        return this.result.createError([this.result.errorInfo]);
      }
      const user = await this.publicService.devAuthenticate(model);
      return user;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/service_health')
  @ContentType('text/html')
  @OpenAPI2({
    description: 'Application Health',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async checkHealth(): Promise<BaseResponse | string> {
    try {
      const healthStatus = await this.publicService.checkHealth();
      let stringBuilder: string =
        '<html>\r\n' +
        '<head>\r\n' +
        '    <meta charset="utf-8">\r\n' +
        '    <meta name="viewport" content="width=device-width">\r\n' +
        '    <title>Admin Tool</title>\r\n' +
        '    <style id="style">\r\n' +
        '        body {\r\n' +
        '            background: #f5f5f5;\r\n' +
        '        }\r\n' +
        '        h1 {\r\n' +
        '            text-align: center;\r\n' +
        '            font-family: arial;\r\n' +
        '            color: #5a5a5a;\r\n' +
        '        }\r\n' +
        '        ul {\r\n' +
        '            display: flex;\r\n' +
        '            list-style: none;\r\n' +
        '            flex-wrap: wrap;\r\n' +
        '            align-items: flex-start;\r\n' +
        '            justify-content: center;\r\n' +
        '            flex-basis: 80%;\r\n' +
        '        }\r\n' +
        '        li {\r\n' +
        '            flex-basis: 20%;\r\n' +
        '            display: flex;\r\n' +
        '            flex-direction: column;\r\n' +
        '            margin-bottom: 20px;\r\n' +
        '            align-items: center;\r\n' +
        '            border: 1px solid grey;\r\n' +
        '            margin: 5px;\r\n' +
        '            padding: 5px;\r\n' +
        '            background-color: white;\r\n' +
        '        }\r\n' +
        '        span {\r\n' +
        '            font-family: arial;\r\n' +
        '            font-size: 14px;\r\n' +
        '            color: #5a5a5a;\r\n' +
        '            text-align: center;\r\n' +
        '        }\r\n' +
        '        img {\r\n' +
        '            margin: 5px;\r\n' +
        '            border-radius: 3px;\r\n' +
        '            box-shadow: 1px 1px 3px rgba(0,0,0,0.2);\r\n' +
        '            height: 100px;\r\n' +
        '        }\r\n' +
        '        input {\r\n' +
        '            margin-bottom: 14px;\r\n' +
        '        }\r\n' +
        '    </style>\r\n' +
        '</head>\r\n' +
        '<body>\r\n' +
        '    <h1>Connected Services</h1>\r\n' +
        '    <ul id="stories">';

      const data = JSON.parse(JSON.stringify(healthStatus.data.value));
      data.forEach((health) => {
        stringBuilder += ` <li>${health.serviceName}<br>${health.status}<br>${
          health.error ?? ''
        }</li>\r\n`;
      });
      stringBuilder += '    </ul>\r\n' + '</body>\r\n' + '</html>\r\n';

      return stringBuilder;
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/users/translations/:language')
  @OpenAPI2({
    description: 'Get Mobile APP Translations',
    responses: { ...DEFAULT_RESPONSES }
  })
  public async getAppTranslations(
    @Param2('language') language: string
  ): Promise<BaseResponse> {
    try {
      if (!language) {
        language = TranslationLanguage.ENGLISH;
      }

      return await this.publicService.getAppData(language);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  @Get('/partner/:partnerId/logo')
  @OpenAPI2({
    description: 'Get partner logo image string',
    responses: { ...DEFAULT_RESPONSES }
  })
  getPartnerImage(
  @Param2('partnerId') partnerId: string,
    @QueryParam2('isArticle') isArticle: boolean
  ) {
    if (!this.validate.isHex(partnerId)) {
      this.result.errorInfo.title = API_RESPONSE.messages.invalidIdTitle;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidUserIdDetail;
      return this.result.createError([this.result.errorInfo]);
    }

    return this.partnerService.getParterLogo(partnerId, isArticle);
  }
}
