import {Messages} from '../../constants';
import {ManualPN} from '../../models/Notification';
import {PublicAuth} from '../../types/publicRequest';
import {APP} from '../../utils/app';
import {
  mockAuditService,
  mockPublicService,
  mockResult,
} from '../../utils/baseTest';
import {decrypt, encrypt} from '../../utils/security/encryptionHandler';
import {PublicController} from '../publicController';

jest.mock('../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../services/commons/auditService', () => ({
  AuditService: jest.fn(() => mockAuditService),
}));

jest.mock('../../services/eap/publicService', () => ({
  PublicService: jest.fn(() => mockPublicService),
}));

jest.mock('../../utils/security/encryptionHandler', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));

describe('PublicController', () => {
  let controller: PublicController;

  beforeEach(() => {
    controller = new PublicController();
    APP.config.APP_VERSION = '1.0.0';
    APP.config.env = 'dev1';
    mockAuditService.createInstallation.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('test to get the api version', async () => {
    const response = controller.version();
    expect(response).toEqual(
      `API Version: v${APP.config.APP_VERSION} ${APP.config.env}`,
    );
  });

  test('test to get the api healthCheck', async () => {
    const response = controller.healthCheck();
    expect(response).toEqual('OK');
  });

  describe('PublicAuth', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get the auth for the public access', async () => {
      const payload: PublicAuth = {
        clientId: 'client_CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      const expectedResponse = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            token: 'iuaydiu92137iuhdskj',
          },
        },
      };
      mockPublicService.publicAuth.mockResolvedValue(expectedResponse);
      const response = await controller.publicAuth(payload);
      expect(response).toBe(expectedResponse);
    });

    it('should handle errors: token exception', async () => {
      const payload: PublicAuth = {
        clientId: 'client_CBHM',
        installationId: 'installationId',
        sessionId: 'sessionId',
      };
      mockPublicService.publicAuth.mockImplementation(() => {
        throw new Error();
      });

      await controller.publicAuth(payload);
    });
  });

  describe('Notify', () => {
    const payload: ManualPN = {
      test: true,
      env: 'dev',
    };

    it('success', async () => {
      mockPublicService.notify.mockReturnValue(true);
      const response = await controller.notify(payload);
      expect(response).toBe('OK');
    });

    it('error', async () => {
      mockPublicService.notify.mockImplementation(() => {
        throw new Error();
      });
      await controller.notify(payload);
    });
  });

  describe('ForceAppUpdate', () => {
    it('error', async () => {
      mockResult.createException.mockReturnValue(Messages.platformError);
      await controller.forceAppUpdate('1.0.0', 'test' as 'ios');
    });

    it('exception', async () => {
      mockPublicService.forceAppUpdate.mockImplementation(() => {
        throw new Error();
      });
      await controller.forceAppUpdate('1.0.0', 'ios');
    });

    it('success', async () => {
      const success = {
        data: {
          isSuccess: true,
          isException: false,
          value: {
            isForceUpdate: true,
            platform:
              'https://apps.apple.com/us/app/sydney-community/id1534328339',
          },
        },
      };
      mockPublicService.forceAppUpdate.mockReturnValue(success);
      const response = await controller.forceAppUpdate('1.0.0', 'ios');
      expect(response).toBe(success);
    });
  });

  describe('encryptData', () => {
    const payload = {text: 'test'};
    it('encryptData: success', async () => {
      (encrypt as jest.Mock).mockReturnValue('encryptedText');
      const response = await controller.encryptData(payload);
      expect(response).toEqual({encryptedText: 'encryptedText'});
    });

    it('encryptData: exception', async () => {
      (encrypt as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
      await controller.encryptData(payload);
    });
  });

  describe('decryptData', () => {
    const payload = {encryptedText: 'test'};
    it('decryptData: success', async () => {
      (decrypt as jest.Mock).mockReturnValue('encryptedText');
      await controller.decryptData(payload);
    });

    it('decryptData: exception', async () => {
      (decrypt as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
      await controller.decryptData(payload);
    });
  });
});
