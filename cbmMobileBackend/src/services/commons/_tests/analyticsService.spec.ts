import {AuditService} from '../auditService';
import {AuditHelper} from '../../helpers/auditHelper';
import {AuditTable, AppEvent} from '../../../models/Audit';
import {EVENT_TYPES} from '../../../constants';

jest.mock('../../helpers/auditHelper');
jest.mock('nodemailer/lib/shared', () => ({
  getLogger: jest.fn(() => ({
    error: jest.fn(),
  })),
}));

describe('auditService', () => {
  let auditService: AuditService;
  let auditHelperMock: jest.Mocked<AuditHelper>;

  beforeEach(() => {
    auditHelperMock = new AuditHelper() as jest.Mocked<AuditHelper>;
    auditService = new AuditService();
    auditService['auditHelper'] = auditHelperMock;
  });

  describe('createInstallation', () => {
    it('should create a new installation if it does not exist', async () => {
      auditHelperMock.getInstallation.mockResolvedValue(null);
      auditHelperMock.addInstallation.mockResolvedValue();

      await auditService.createInstallation('installationId', 'sessionId');

      expect(auditHelperMock.getInstallation).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
      );
      expect(auditHelperMock.addInstallation).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
      );
    });

    it('should not create a new installation if it already exists', async () => {
      const installation: AuditTable = {
        installationId: 'installationid',
        sessionId: 'sessionId',
        createdAt: new Date(),
        updatedAt: new Date(),
        events: [],
      };
      auditHelperMock.getInstallation.mockResolvedValue(installation);

      await auditService.createInstallation('installationId', 'sessionId');

      expect(auditHelperMock.getInstallation).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
      );
      expect(auditHelperMock.addInstallation).not.toHaveBeenCalled();
    });

    it('should log an error if an exception occurs', async () => {
      const loggerMock = auditService.logger;
      auditHelperMock.getInstallation.mockRejectedValue(
        new Error('Test error'),
      );

      await auditService.createInstallation('installationId', 'sessionId');

      expect(loggerMock.error).toHaveBeenCalledWith(
        'createFAUEvent :: Error: Test error',
      );
    });
  });

  describe('updateRecentAccess', () => {
    it('should update recent access if installation exists', async () => {
      const installation: AuditTable = {
        installationId: 'installationid',
        sessionId: 'sessionId',
        createdAt: new Date(),
        updatedAt: new Date(),
        events: [],
      };
      auditHelperMock.getInstallation.mockResolvedValue(installation);
      auditHelperMock.updateRecentAccess.mockResolvedValue();

      await auditService.updateRecentAccess('installationId', 'sessionId');

      expect(auditHelperMock.getInstallation).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
      );
      expect(auditHelperMock.updateRecentAccess).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
      );
    });

    it('should not update recent access if installation does not exist', async () => {
      auditHelperMock.getInstallation.mockResolvedValue(null);

      await auditService.updateRecentAccess('installationId', 'sessionId');

      expect(auditHelperMock.getInstallation).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
      );
      expect(auditHelperMock.updateRecentAccess).not.toHaveBeenCalled();
    });

    it('should log an error if an exception occurs', async () => {
      const loggerMock = auditService.logger;
      auditHelperMock.getInstallation.mockRejectedValue(
        new Error('Test error'),
      );

      await auditService.updateRecentAccess('installationId', 'sessionId');

      expect(loggerMock.error).toHaveBeenCalledWith(
        'updateRecentAccess :: Error: Test error',
      );
    });
  });

  describe('endSession', () => {
    it('should add an end session event', async () => {
      auditHelperMock.addEvent.mockResolvedValue();

      await auditService.endSession('installationId', 'sessionId');

      expect(auditHelperMock.addEvent).toHaveBeenCalledWith(
        'installationId',
        'sessionId',
        expect.any(AppEvent),
      );
      const event = auditHelperMock.addEvent.mock.calls[0][2];
      expect(event.eventType).toBe(EVENT_TYPES.END_SESSION);
    });
  });
});
