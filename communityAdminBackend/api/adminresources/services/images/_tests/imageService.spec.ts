import {
  API_RESPONSE
} from '@anthem/communityadminapi/common';
import { mockMongo, mockResult, mockS3Service } from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { ImageService } from '../imageService';

describe('ImageService', () => {

  let service: ImageService;
  let handleProfileImage;
  let handleGetImage;

  beforeEach(() => {
    service = new ImageService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockS3Service,
      <any>mockILogger);
    handleProfileImage = jest.spyOn(ImageService.prototype as any, 'handleProfileImage');
    handleGetImage = jest.spyOn(ImageService.prototype as any, 'handleGetImage');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* Upload Image */
  it('Should upload image to s3: upload', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          key: "1b0f9f98-f060-3ad1-ea6a-de87c8bc5404"
        }
      }
    };
    let file: Buffer;
    const userId = '';
    const isProfile = false;
    const postId = '61fa0fd06f02430023f5e270'
    const s3resp = { Key: 'aaa', Location: 'sss' };
    mockResult.createSuccess.mockReturnValue(expected);
    try {
      const res = await service.uploadImage(file, userId, isProfile, postId);
      mockS3Service.upload.mockImplementationOnce(() => {
        return s3resp;
      })
      await handleProfileImage.mockImplementation(() => { return null; });
      expect(res).toEqual(expected);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('should throw error for invalid user: upload', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: API_RESPONSE.messages.badData,
          etail: API_RESPONSE.messages.userDoesNotExist,
        }
      }
    };
    let file: Buffer;
    const userId = '';
    const isProfile = false;
    const postId = '61fa0fd06f02430023f5e270'

    mockMongo.readByID.mockReturnValueOnce(null);
    mockResult.createError.mockReturnValue(expRes);
    try {
      const result = await service.uploadImage(file, userId, isProfile, postId);
      expect(expRes).toEqual(result);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  /* Update Image */
  it('Should update or delete image from s3: update', async () => {
    const expected = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          key: "1b0f9f98-f060-3ad1-ea6a-de87c8bc5404"
        }
      }
    };
    let file: Buffer;
    const userId = '';
    const isProfile = false;
    const postId = '61fa0fd06f02430023f5e270'
    const fileName = 'abc';
    mockResult.createSuccess.mockReturnValue(expected);
    try {
      const res = await service.updateImage(file, userId, isProfile, false, postId);
      await mockS3Service.upload(file, fileName, isProfile);
      await handleProfileImage.mockImplementationOnce(() => {
        return null;
      });
      expect(res).toEqual(expected);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('should throw an error for invalid user: update', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: API_RESPONSE.messages.badData,
          etail: API_RESPONSE.messages.userDoesNotExist,
        }
      }
    };
    let file: Buffer;
    const userId = '';
    const isProfile = false;
    const postId = '61fa0fd06f02430023f5e270'

    mockMongo.readByID.mockReturnValueOnce(null);
    mockResult.createError.mockReturnValue(expRes);
    try {
      const result = await service.updateImage(file, userId, isProfile, false, postId);
      expect(expRes).toEqual(result);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('should throw an error for invalid post: update', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: API_RESPONSE.messages.badData,
          etail: API_RESPONSE.messages.postDoesNotExist,
        }
      }
    };
    let file: Buffer;
    const userId = '';
    const isProfile = false;
    const postId = ''
    mockMongo.readByID.mockReturnValueOnce(null);
    mockResult.createError.mockReturnValue(expRes);
    try {
      const result = await service.updateImage(file, userId, isProfile, false, postId);
      expect(expRes).toEqual(result);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should throw an error image from s3: update', async () => {
    const expected = {
      data: {
        isSuccess: false,
        isException: true,
        value: {
          title: API_RESPONSE.messages.badData,
          etail: API_RESPONSE.messages.tryAgain,
        }
      }
    };
    const s3resp = { Key: 'aaa', Location: 'sss' };
    let file: Buffer;
    const userId = '';
    const isProfile = false;
    const postId = '61fa0fd06f02430023f5e270'
    mockResult.createSuccess.mockReturnValue(expected);
    try {
      const res = await service.updateImage(file, userId, isProfile, false, postId);
      mockS3Service.upload.mockImplementationOnce(() => {
        return s3resp;
      })
      await handleProfileImage.mockImplementation(() => { return null; });
      expect(res).toEqual(expected);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  /* get Image */
  it('Should return image from S3: Success', async () => {
    try {
      const expctRespo = {
        Body: {
          data: [
            256
          ]
        }
      };
      const admin = {
        id: '6009711ebb91ed000704a227',
        username: '~SIT3SB973932777',
        active: true,
        proxyId: null,
        hasAgreedToTerms: false,
        personId: '351771530'
      };

      mockS3Service.getImage.mockReturnValue(expctRespo);
      await handleGetImage.mockImplementation(() => {
        return 'imageKey';
      });
      const response = await service.getImage(admin, true, false);
      expect(expctRespo).toEqual(response);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should return image from S3: Exception', async () => {
    try {
      const admin = {
        id: '6009711ebb91ed000704a227',
        active: true,
      };

      await handleGetImage.mockImplementation(() => {
        throw new Error()
      });
      await service.getImage(admin, true, false);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });
});
