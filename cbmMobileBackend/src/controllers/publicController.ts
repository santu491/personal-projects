import {
  Body,
  Get,
  HeaderParam,
  JsonController,
  Post,
} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';
import {
  DecryptSpec,
  EncryptSpec,
  ForceAppUpdateSpec,
  NotifySpec,
  PublicAuthSpec,
} from '../apiDetails/Public';
import {Messages, Platform} from '../constants';
import {ManualPN} from '../models/Notification';
import {API_PATHS, PUBLIC_ROUTES} from '../routingConstants';
import {PublicService} from '../services/eap/publicService';
import {PublicAuth} from '../types/publicRequest';
import {APP} from '../utils/app';
import logger from '../utils/logger';
import {ResponseUtil} from '../utils/responseUtil';
import {decrypt, encrypt} from '../utils/security/encryptionHandler';
import {AuditService} from '../services/commons/auditService';

@JsonController(API_PATHS.public)
export class PublicController {
  private publicService = new PublicService();
  private result = new ResponseUtil();
  private Logger = logger();
  private className = this.constructor.name;

  /**
   * APP version
   * @route GET /version
   * @access Public
   * @returns OK
   */
  @Get(PUBLIC_ROUTES.version)
  version() {
    return 'API Version: v' + APP.config.APP_VERSION + ' ' + APP.config.env;
  }

  /**
   * App version
   * @route GET /health
   * @access Public
   * @returns OK
   */
  @Get(PUBLIC_ROUTES.health)
  healthCheck() {
    return 'OK';
  }

  /**
   * Public Access Token for the Client
   * @route POST /auth
   * @access Public
   * @returns {object} - Access Token
   * @param clientId string
   */
  @OpenAPI(PublicAuthSpec)
  @Post(PUBLIC_ROUTES.auth)
  async publicAuth(@Body() payload: PublicAuth) {
    try {
      const response = await this.publicService.publicAuth(payload);

      const auditService = new AuditService();
      if (payload?.installationId && payload?.sessionId) {
        await auditService.createInstallation(
          payload.installationId,
          payload.sessionId,
        );
      }

      return response;
    } catch (error) {
      this.Logger.error(`${this.className} - publicAuth :: ${error}`);
      return error;
    }
  }

  /**
   * Manually trigger PN for Users.
   * @returns
   */
  @OpenAPI(NotifySpec)
  @Post(PUBLIC_ROUTES.notify)
  async notify(@Body() payload: ManualPN) {
    try {
      await this.publicService.notify(payload);

      return 'OK';
    } catch (error) {
      this.Logger.error(`${this.className} - notify :: ${error}`);
      return error;
    }
  }

  /**
   * Verify the version of App
   * @route GET /app/update
   * @access public
   * @returns {object}
   */
  @OpenAPI(ForceAppUpdateSpec)
  @Get(PUBLIC_ROUTES.fau)
  async forceAppUpdate(
    @HeaderParam('version', {required: true}) version: string,
    @HeaderParam('platform', {required: true}) platform: 'ios' | 'android',
  ) {
    try {
      if (platform !== Platform.ios && platform !== Platform.android) {
        return this.result.createException(Messages.platformError);
      }
      return await this.publicService.forceAppUpdate(version, platform);
    } catch (error) {
      this.Logger.error(`${this.className} - forceAppUpdate :: ${error}`);
      return error;
    }
  }

  /**
   * Encrypt data.
   * @param payload - The data to be encrypted.
   * @returns The encrypted data.
   */
  @OpenAPI(EncryptSpec)
  @Post(PUBLIC_ROUTES.encrypt)
  async encryptData(@Body() payload: {text: string}) {
    try {
      const encryptedText = encrypt(payload.text);
      return {encryptedText};
    } catch (error) {
      this.Logger.error(`${this.className} - encryptData :: ${error}`);
      return {error: 'Encryption failed', details: error};
    }
  }

  /**
   * Decrypt data.
   * @param payload - The data to be decrypted.
   * @returns The decrypted data.
   */
  @OpenAPI(DecryptSpec)
  @Post(PUBLIC_ROUTES.decrypt)
  async decryptData(@Body() payload: {encryptedText: string}) {
    try {
      const decryptedText = decrypt(payload.encryptedText);
      return {decryptedText};
    } catch (error) {
      this.Logger.error(`${this.className} - decryptData :: ${error}`);
      return {error: 'Decryption failed', details: error};
    }
  }
}
