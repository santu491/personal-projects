import { mockGateway } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { HttpError } from 'routing-controllers';
import { InternalService } from '../internalService';

describe('InternalService', () => {
  let svc: InternalService;
  const userNm: string = 'mockUser';
  const token: string = 'abcdefg';

  beforeEach(() => {
    svc = new InternalService(<any>mockGateway, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTermsOfUse', async () => {
    it('success', async () => {
      const expResp = {
        status: 'true',
        lstLoginDt: '2020-12-21',
        registrationDt: '2020-04-28',
      };
      mockGateway.getTermsOfUse.mockReturnValue(expResp);
      await svc.getTermsOfUse(userNm);
    });

    it('error/exception', async () => {
      try {
        mockGateway.getTermsOfUse.mockReturnValue(false);
        mockILogger.error.mockReturnValue(1);
        expect(await svc.getTermsOfUse(userNm)).toThrow(HttpError);
      } catch (error) {
        expect((error as HttpError).message.indexOf('Terms Of Use Service failed') >= 0).toBeTruthy();
      }
    });
  });

  describe('updateTermsOfUse', async () => {
    it('success', async () => {
      mockGateway.updateAcceptedTOU.mockReturnValue(true);
      let resp = await svc.updateTermsOfUse(userNm);
      expect(resp).toBe(true);
    });

    it('exception', async () => {
      try {
        mockGateway.updateAcceptedTOU.mockImplementation(() => {
          throw new Error();
        });
        mockILogger.error.mockReturnValue(1);
        expect(await svc.updateTermsOfUse(userNm)).toThrow(HttpError);
      } catch (error) {
        expect((error as HttpError).message.indexOf('Terms Of Use Service - update failed') >= 0).toBeTruthy();
      }
    });
  });

  describe('getAuth', async () => {
    it('success', async () => {
      mockGateway.getAuth.mockReturnValue(true);
      let resp = await svc.getAuth();
      expect(resp).toBe(true);
    });

    it('error', async () => {
      try {
        mockGateway.getAuth.mockReturnValue(false);
        mockILogger.error.mockReturnValue(1);
        expect(await svc.getAuth()).toThrow(HttpError);
      } catch (error) {
        expect((error as HttpError).message.indexOf('Get Access Token Request failed') >= 0).toBeTruthy();
      }
    });
  });

  describe('getMemberInfo', async () => {
    it('success', async () => {
      const expResp = {
        member: {
          registrationTypeCd: 'MEMBER',
          eligibility: [
            {}
          ],
        },
      };
      mockGateway.getMemberInfo.mockReturnValue(expResp);
      let resp = await svc.getMemberInfo(token, userNm);
      expect(resp).toBe(expResp);
    });

    it('exception', async () => {
      try {
        mockGateway.getMemberInfo.mockReturnValue(false);
        mockILogger.error.mockReturnValue(1);
        expect(await svc.getMemberInfo(token, userNm)).toThrow(HttpError);
      } catch (error) {
        expect((error as HttpError).message.indexOf('Get Access Token Request failed') >= 0).toBeTruthy();
      }
    });
  });

  describe('validateAccessToken', async () => {
    it('success', async () => {
      const token: string = 'abcdefg';
      const expResp = { "lstLoginDt": "2021-02-10", "registrationDt": "2020-04-28", "status": "true" };
      mockGateway.validateAccessToken.mockReturnValue(expResp);
      let resp = await svc.validateAccessToken(token);
      expect(resp).toBe(expResp);
    });

    it('exception', async () => {
      try {
        mockGateway.validateAccessToken.mockReturnValue(false);
        mockILogger.error.mockReturnValue(1);
        expect(await svc.validateAccessToken('abcdefg')).toThrow(HttpError);
      } catch (error) {
        expect((error as HttpError).message.indexOf('Validate Access Token Request failed') >= 0).toBeTruthy();
      }
    });
  });

  describe('revokeAccessToken', async () => {
    it('success', async () => {
      const token: string = 'abcdefg';
      const expResp = { "revoke": true };
      mockGateway.revokeAccessToken.mockReturnValue(expResp);
      let resp = await svc.revokeAccessToken(token);
      expect(resp).toEqual(expResp);
    });

    it('exception', async () => {
      try {
        const token: string = 'abcdefg';
        mockGateway.revokeAccessToken.mockReturnValue(false);
        mockILogger.error.mockReturnValue(1);
        expect(await svc.revokeAccessToken(token)).toThrow(HttpError);
      } catch (error) {
        expect((error as HttpError).message.indexOf('Revoke Access Token Request failed') >= 0).toBeTruthy();
      }
    });
  });
});
