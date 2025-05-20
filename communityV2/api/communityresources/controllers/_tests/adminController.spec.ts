import {
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { mockAdminSvc } from '@anthem/communityapi/utils/mocks/mockAdminService';
import { AdminController } from '../adminController';

describe('AdminController', () => {
  let ctrl: AdminController;

  beforeEach(() => {
    ctrl = new AdminController(
      <any>mockAdminSvc,
      <any>mockValidation,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should get admin profile by id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          username: 'ah00001',
          role: 'sysadmin',
          firstName: '',
          lastName: '',
          displayName: '',
          displayTitle: '',
          profileImage: '',
          createdAt: '2021-12-09T15:19:56.426Z',
          updatedAt: '2021-12-09T15:19:56.426Z',
          id: '61b21e9c26dbb012b69cf67d'
        }
      }
    };
    try {
      mockValidation.isHex.mockReturnValue(true);
      mockAdminSvc.getAdminProfile.mockReturnValue(expRes);
      const res = await ctrl.getAdminProfile('61b21e9c26dbb012b69cf67d');
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue(error);
    }
  });

  it('should throw an error if id is not hex string', async () => {
    const id = '61b21e9c26dbb012b69cf67';
    const errRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579b754b2c',
          errorCode: 400,
          title: 'Incorrect id',
          detail: 'This is not a valid id'
        }
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(errRes);
    const res = await ctrl.getAdminProfile(id);
    expect(res).toEqual(errRes);
  });

  it('should throw an error if exception', async () => {
    mockValidation.isHex.mockImplementation(() => {
      throw new Error()
    })
    mockResult.createException.mockReturnValue(true);
    await ctrl.getAdminProfile("61b21e9c26dbb012b69cf67");
  });
});
