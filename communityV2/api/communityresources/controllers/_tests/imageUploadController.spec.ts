import { mockResult } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { RequestContext } from '@anthem/communityapi/utils';
import { mockImageUploadSvc } from '@anthem/communityapi/utils/mocks/mockImageService';
import { ProfilePicture } from 'api/communityresources/models/userModel';
import { ImageUploadController } from '../imageUploadController';

describe('ImageController', () => {
  let controller: ImageUploadController;

  const mockRequestContext = jest
    .fn()
    .mockReturnValue(
      '{"name":"~SIT3SBB000008AB","id":"61604cdd33b45d0023d0db61","firstName":"PHOEBE","lastName":"STINSON","active":"true","isDevLogin":"true","iat":1642001503,"exp":1642030303,"sub":"~SIT3SBB000008AB","jti":"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019"}'
    );

  beforeEach(() => {
    controller = new ImageUploadController(
      <any>mockImageUploadSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('addProfilePictureBase64 - Should upload image: success', async () => {
    const input: ProfilePicture = {
      userId: 'userId',
      profilePicture: 'profilePictureInBase64Format'
    };
    mockImageUploadSvc.uploadImageBase64.mockReturnValue(true);
    RequestContext.getContextItem = mockRequestContext;
    const response = await controller.addProfilePictureBase64(input);
    expect(response).toBe(true);
  });

  it('addProfilePictureBase64 - Should upload image: exception', async () => {
    const input: ProfilePicture = {
      userId: 'userId',
      profilePicture: 'profilePictureInBase64Format'
    };
    mockImageUploadSvc.uploadImageBase64.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    RequestContext.getContextItem = mockRequestContext;
    await controller.addProfilePictureBase64(input);
  });
});
