import {MemberOAuthPayload} from '../../types/customRequest';
import {InstallationRequest} from '../../types/installationRequest';
import {mockInstallationService} from '../../utils/baseTest';
import {ResponseUtil} from '../../utils/responseUtil';
import {InstallationController} from '../installationController';

jest.mock('../../services/eap/installationService', () => ({
  saveInstallation: jest.fn(),
  deleteInstallation: jest.fn(),
  InstallationService: jest.fn(() => mockInstallationService),
}));

describe('InstallationController', () => {
  let controller: InstallationController;
  let mockRequest: InstallationRequest;
  let user: MemberOAuthPayload;

  beforeEach(() => {
    controller = new InstallationController();
    mockRequest = {
      deviceToken:
        '8a9c71abd0335e5c112d50da83f544ca673e0b502c54289e86f2b99dd84b0028',
      platform: 'ios',
      appVersion: '0.0.1',
      osVersion: '17.3.1',
      locale: 'en-US',
      timeZoneOffset: -330,
      badge: 0,
    };
    user = {
      clientId: 'clientName',
      iamguid: 'iamguid',
      userName: 'userName',
      permissions: ['*'],
      clientName: 'clientName',
      installationId: 'installationId',
      sessionId: 'sessionId',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register installation in DB', async () => {
    (mockInstallationService.saveInstallation as jest.Mock).mockResolvedValue(
      'Installation added successfully',
    );

    const response = await controller.saveInstallation(user, mockRequest);

    expect(response).toBe('Installation added successfully');
  });

  it('should return error if iamguid or clientName is missing', async () => {
    (mockInstallationService.saveInstallation as jest.Mock).mockResolvedValue(
      'Installation added successfully',
    );

    const response = await controller.saveInstallation(
      {
        clientId: '',
        installationId: 'installationId',
        sessionId: 'sessionId',
      },
      mockRequest,
    );

    expect(response).toEqual(
      new ResponseUtil().createException('User not found'),
    );
  });

  it('should register installation in DB - exception', async () => {
    (mockInstallationService.saveInstallation as jest.Mock).mockRejectedValue(
      'Error while saving device details',
    );

    const response = await controller.saveInstallation(user, mockRequest);

    expect(response).toEqual(
      new ResponseUtil().createException('Error while saving device details'),
    );
  });

  it('should delete user installation in DB', async () => {
    (mockInstallationService.deleteInstallation as jest.Mock).mockResolvedValue(
      'Installation deleted successfully',
    );

    const response = await controller.deleteInstallationDevice(
      user,
      mockRequest,
    );

    expect(response).toBe('Installation deleted successfully');
  });

  it('should handle errors: delete user installation', async () => {
    const error = new Error('Failed to delete installation');
    (mockInstallationService.deleteInstallation as jest.Mock).mockRejectedValue(
      error,
    );

    const response = await controller.deleteInstallationDevice(
      user,
      mockRequest,
    );
    expect(response).toBe(error);
  });
});
