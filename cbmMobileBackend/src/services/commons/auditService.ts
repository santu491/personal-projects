import {getLogger} from 'nodemailer/lib/shared';
import {AuditHelper} from '../helpers/auditHelper';
import {EVENT_TYPES} from '../../constants';
import {AppEvent} from '../../models/Audit';

export class AuditService {
  private auditHelper = new AuditHelper();
  logger = getLogger();

  async createInstallation(installationId: string, sessionId: string) {
    try {
      const userInstallation = await this.auditHelper.getInstallation(
        installationId,
        sessionId,
      );

      if (!userInstallation) {
        //Create Installation
        await this.auditHelper.addInstallation(installationId, sessionId);
      }
    } catch (error) {
      this.logger.error(`createFAUEvent :: ${error}`);
      return;
    }
  }

  async updateRecentAccess(installationId: string, sessionId: string) {
    try {
      const userInstallation = await this.auditHelper.getInstallation(
        installationId,
        sessionId,
      );
      if (userInstallation) {
        await this.auditHelper.updateRecentAccess(installationId, sessionId);
      }
    } catch (error) {
      this.logger.error(`updateRecentAccess :: ${error}`);
      return;
    }
  }

  async endSession(installationId: string, sessionId: string) {
    const endSessionEvent = new AppEvent(EVENT_TYPES.END_SESSION);
    await this.auditHelper.addEvent(installationId, sessionId, endSessionEvent);
  }
}
