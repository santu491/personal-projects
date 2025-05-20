import { API_RESPONSE, Result } from '@anthem/communityapi/common';
import { mockResult, mockValidation } from '@anthem/communityapi/common/baseTest';
import { RequestContext } from '@anthem/communityapi/utils';
import { mockAdminSvc } from '@anthem/communityapi/utils/mocks/mockAdminService';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ImageService } from '../../services/imageService';
import { ImageController } from '../imageController';

describe('ImageController', () => {
  let controller: ImageController;
  const mockSvc: Mockify<ImageService> = {
    uploadImage: jest.fn(),
    updateImage: jest.fn(),
    getImage: jest.fn()
  };

  const resultSvc: Mockify<Result> = {
    createSuccess: jest.fn(),
    createException: jest.fn(),
    createError: jest.fn(),
    createErrorMessage: jest.fn(),
    createExceptionWithValue: jest.fn(),
    createGuid: jest.fn(),
    errorInfo: jest.fn()
  };

  const mockRequestContext = jest.fn().mockReturnValue("{\"name\":\"~SIT3SBB000008AB\",\"id\":\"61604cdd33b45d0023d0db61\",\"firstName\":\"PHOEBE\",\"lastName\":\"STINSON\",\"active\":\"true\",\"isDevLogin\":\"true\",\"iat\":1642001503,\"exp\":1642030303,\"sub\":\"~SIT3SBB000008AB\",\"jti\":\"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019\"}");

  beforeEach(() => {
    controller = new ImageController(<any>resultSvc, <any>mockSvc, <any>mockValidation, <any>mockAdminSvc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should upload image: exception', async () => {
    const file = { mimetype: 'image/png', size: 5069, buffer: '' };
    mockSvc.uploadImage.mockImplementationOnce(() => {
      throw new Error();
    });
    RequestContext.getContextItem = mockRequestContext;
    const response = await controller.uploadImages(file);
    expect(response).toEqual(response);
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
    const file = {};
    try {
      RequestContext.getContextItem = mockRequestContext;
      mockSvc.uploadImage.mockReturnValue(expRes);
      const res = await controller.uploadImages(file);
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should upload image: Failure', async () => {
    const file = {};
    RequestContext.getContextItem = mockRequestContext;
    mockSvc.updateImage.mockImplementationOnce(() => {
      throw new Error();
    })
    await controller.uploadImages(file);
  });

  it('Should throw an error for missing file: update', async () => {
    const file = '';
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
    try {
      RequestContext.getContextItem = mockRequestContext;
      resultSvc.createError.mockReturnValue(expRes);
      const res = await controller.updateImages(file, false);
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
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
    try {
      RequestContext.getContextItem = mockRequestContext;
      resultSvc.createError.mockReturnValue(expRes);
      const res = await controller.updateImages(file, true);
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
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
    try {
      RequestContext.getContextItem = mockRequestContext;
      resultSvc.createError.mockReturnValue(expRes);
      const res = await controller.uploadImages(file);
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should throw an error for invalid file type', async () => {
    try {
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
      RequestContext.getContextItem = mockRequestContext;
      resultSvc.createError.mockReturnValue(expRes);
      const res = await controller.uploadImages(file);
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
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
    const isDelete = false;
    try {
      RequestContext.getContextItem = mockRequestContext;
      mockSvc.updateImage.mockReturnValue(expRes);
      const res = await controller.updateImages(file, isDelete);
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should update image: Failure', async () => {
    const file = {};
    const isDelete = false;
    RequestContext.getContextItem = mockRequestContext;
    mockSvc.updateImage.mockImplementationOnce(() => {
      throw new Error();
    })
    await controller.updateImages(file, isDelete);
  });

  it('Should get image: exception', async () => {
    mockSvc.getImage.mockImplementationOnce(() => {
      throw new Error();
    });
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    const response = await controller.getImage(true, true, 'sdas');
    expect(response).toEqual(response);
  });

  it('Should get image: success', async () => {
    const expRes = { Body: '', Data: '' };
    try {
      RequestContext.getContextItem = mockRequestContext;
      mockValidation.isHex.mockReturnValue(true);
      mockSvc.getImage.mockReturnValue(expRes);
      const res = await controller.getImage(true, true, 'dfsdf');
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should get image: Failure', async () => {
    RequestContext.getContextItem = mockRequestContext;
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '2d8a018e-e02c-a5f4-029a-00579t754b2c',
          errorCode: 400,
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail,
        },
      },
    };
    mockValidation.isHex.mockReturnValue(false);
    resultSvc.createError.mockReturnValue(expRes);
    const res = await controller.getImage(true, true, 'dfsdf');
    expect(res).toEqual(expRes);
  });

  // getAdminImage
  it('Should get image: success', async () => {
    try {
      const expRes = { base64Image: '' };
      mockValidation.isHex.mockReturnValue(true);
      mockAdminSvc.getAdminImage.mockReturnValue(expRes);
      const res = await controller.getAdminImage('dfsdf');
      expect(res).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should get image: exception', async () => {
    try {
      mockValidation.isHex.mockImplementation(() => {
        throw new Error();
      });
      mockResult.createException.mockReturnValue(true);
      await controller.getAdminImage('dfsdf');
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });

  it('Should get image: error', async () => {
    try {
      const expRes = {
        data: {
          isSuccess: false,
          isException: false,
          errors: {
            id: '2d8a018e-e02c-a5f4-029a-00579t754b2c',
            errorCode: 400,
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidIdDetail,
          },
        },
      };
      mockValidation.isHex.mockReturnValue(false);
      mockResult.createError.mockReturnValue(expRes);
      const data = await controller.getAdminImage('dfsdf');
      expect(data).toEqual(expRes);
    } catch (error) {
      resultSvc.createException.mockReturnValue((error as Error).message);
    }
  });
});
