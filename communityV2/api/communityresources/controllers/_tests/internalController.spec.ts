import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { InternalService } from '../../services/internalService';
import { InternalController } from '../internalController';

describe('InternalController', () => {
  let ctrl: InternalController;
  const userNm: string = 'mockUser';
  const touRequest: any = { userNm };

  const mockSvc: Mockify<InternalService> = {
    getTermsOfUse: jest.fn(),
    updateTermsOfUse: jest.fn(),
    getAuth: jest.fn(),
    getMemberInfo: jest.fn(),
    validateAccessToken: jest.fn(),
    revokeAccessToken: jest.fn(),
  };

  beforeEach(() => {
    ctrl = new InternalController(<any>mockSvc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update terms of use', async () => {
    const expResp = {
      status: true
    };
    mockSvc.updateTermsOfUse.mockReturnValue(expResp);
    const resp = await ctrl.updateTermsOfUse(touRequest);
    expect(resp).toBe(expResp);
  });
});
