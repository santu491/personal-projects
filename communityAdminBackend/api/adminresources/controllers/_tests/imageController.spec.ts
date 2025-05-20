import { API_RESPONSE, ValidationResponse } from '@anthem/communityadminapi/common';
import { mockImageService, mockRequestValidator, mockResult, mockValidation } from '@anthem/communityadminapi/common/baseTest';
import { ImageController } from '../ImageController';

describe('ImageController', () => {
  let controller: ImageController;

  const mockifiedUserContext = jest.fn().mockReturnValue("{\"id\":\"61b21e9c26dbb012b69cf67e\",\"name\":\"az00001\",\"active\":\"true\",\"role\":\"scadmin\",\"iat\":1643012245,\"exp\":1643041045,\"sub\":\"az00001\",\"jti\":\"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433\"}");

  beforeEach(() => {
    controller = new ImageController(<any>mockResult, <any>mockImageService, <any>mockValidation, <any>mockRequestValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* upload Image */
  it('Should upload image: exception', async () => {
    const file = { mimetype: 'image/png', size: 5069, buffer: '' };
    const postId = '61fa0fd06f02430023f5e270';
    const isProfile = false;

    mockValidation.checkUserIdentity.mockImplementationOnce(() => {
      throw new Error();
    });
    await controller.uploadImages(file, isProfile, postId);
  });

  it('Should upload image: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          key: "1b0f9f98-f060-3ad1-ea6a-de87c8bc5404"
        }
      }
    };
    const file = {
      mimetype: 'jpg'
    };
    const postId = '61fa0fd06f02430023f5e270';
    const isProfile = false;
    try {
      mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
      mockValidation.isHex.mockReturnValue(true);
      mockImageService.uploadImage.mockReturnValue(expRes);
      const res = await controller.uploadImages(file, isProfile, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should upload image: Failure', async () => {
    const file = {};
    const postId = '61fa0fd06f02430023f5e270';
    const isProfile = false;
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockImageService.uploadImage.mockImplementationOnce(() => {
      throw new Error();
    })
    await controller.uploadImages(file, isProfile, postId);
  });

  it('Should throw an error for missing file', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579b754b2c',
          errorCode: 400,
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.missingImage,
        },
      },
    };
    const file = '';
    const postId = '61fa0fd06f02430023f5e270';
    try {
      mockResult.createError.mockReturnValue(expRes);
      const res = await controller.uploadImages(file, true, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should throw an error for invalid file type', async () => {
    const file = { mimetype: '' };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579b754b2c',
          errorCode: 400,
          title: API_RESPONSE.messages.badData,
          detail: `${file.mimetype} ${API_RESPONSE.messages.invalidMimeType}`,
        },
      },
    };
    const postId = '61fa0fd06f02430023f5e270';
    try {
      mockResult.createError.mockReturnValue(expRes);
      const res = await controller.uploadImages(file, true, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should throw an error for invalid post id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidPostId,
        },
      },
    };
    const file = {
      mimetype: 'jpg'
    };
    const postId = 'werer';
    const isProfile = false;
    try {
      mockValidation.isHex.mockReturnValue(false);
      mockResult.createError.mockReturnValue(expRes);
      const res = await controller.uploadImages(file, isProfile, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  /* Update Images */
  it('Should throw an error for missing file: update', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579b754b2c',
          errorCode: 400,
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.missingImage,
        },
      },
    };
    const file = '';
    const postId = '61fa0fd06f02430023f5e270';
    try {
      mockResult.createError.mockReturnValue(expRes);
      const res = await controller.updateImages(file, true, false, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should throw an error for invalid file type: update', async () => {
    const file = { mimetype: '' };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579b754b2c',
          errorCode: 400,
          title: API_RESPONSE.messages.badData,
          detail: `${file.mimetype} ${API_RESPONSE.messages.invalidMimeType}`,
        },
      },
    };
    const postId = '61fa0fd06f02430023f5e270';
    try {
      mockResult.createError.mockReturnValue(expRes);
      const res = await controller.updateImages(file, true, false, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should update image: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          key: "1b0f9f98-f060-3ad1-ea6a-de87c8bc5404"
        }
      }
    };
    const file = {};
    const postId = '61fa0fd06f02430023f5e270';
    const isProfile = true;
    const isDelete = true;
    try {
      mockImageService.updateImage.mockReturnValue(expRes);
      const res = await controller.updateImages(file, isProfile, isDelete, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should update image: Failure', async () => {
    const file = {};
    const postId = '61fa0fd06f02430023f5e270';
    const isProfile = false;
    const isDelete = false;
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockImageService.updateImage.mockImplementationOnce(() => {
      throw new Error();
    })
    await controller.updateImages(file, isProfile, isDelete, postId);
  });

  it('Should throw an error for invalid post id: update', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidPostId,
        },
      },
    };
    const file = '';
    const postId = 'werer';
    const isProfile = false;
    try {
      mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
      mockValidation.isHex.mockReturnValue(false);
      mockResult.createError.mockReturnValue(expRes);
      const res = await controller.updateImages(file, isProfile, true, postId);
      expect(res).toEqual(expRes);
    } catch (error) {
      mockResult.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should throw an error an exception', async () => {
    const file = '';
    const postId = 'postId';
    const isProfile = false;
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error()
    });
    await controller.updateImages(file, isProfile, false, postId);

  });

  /* GetImage */
  it('Should return the image from S3: success', async () => {
    const expRes = {
      type: Buffer,
      data: [
        200
      ]
    };

    const validationResponse: ValidationResponse = {
      validationResult: false,
      reason: ''
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.getImageValidation.mockReturnValue(validationResponse);
    mockImageService.getImage.mockReturnValue(expRes);
    const response = await controller.getImage(true, false, null);
    expect(response).toEqual(expRes);

  });

  it('Should return the image from S3: validation error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.invalidPostIdDetail
        }
      }
    };

    const validationResponse: ValidationResponse = {
      validationResult: true,
      reason: API_RESPONSE.messages.invalidPostIdDetail
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.getImageValidation.mockReturnValue(validationResponse);
    mockResult.createError.mockReturnValue(expRes);
    const response = await controller.getImage(true, false, null);
    expect(response).toEqual(expRes);
  });

  it('Should return the image from S3: exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockRequestValidator.getImageValidation.mockImplementation(() => {
      throw new Error()
    })
    await controller.getImage(true, false, null);
  });
});
