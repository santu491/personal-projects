import { API_RESPONSE } from '@anthem/communityadminapi/common';
import {
  mockContentService,
  mockResult,
  mockValidation,
} from '@anthem/communityadminapi/common/baseTest';
import { TrainingLinkRequest } from 'api/adminresources/models/contentModel';
import { ContentController } from '../contentController';

describe('ContentController', () => {
  let controller: ContentController;

  beforeEach(() => {
    controller = new ContentController(
      <any>mockContentService,
      <any>mockResult,
      <any>mockValidation
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockifiedUserContext = jest
    .fn()
    .mockReturnValue(
      '{"id":"61b21e9c26dbb012b69cf67e","name":"az00001","active":"true","role":"scadmin","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
    );

  it('Should Return the Admin content: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          contentType: 'admin',
          language: 'en',
          version: '1.0.0',
          deepLink: [],
          id: '61e6ece444aff493ad916359',
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockContentService.getAdminContent.mockReturnValue(expRes);
    const res = await controller.getAdminContent();
    expect(res).toEqual(expRes);
  });

  it('Should Return the Admin content: failure', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.userDoesNotExist,
        },
      },
    };

    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getAdminContent();
    expect(res).toEqual(expRes);
  });

  it('Should Return the Admin content: exception', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockContentService.getAdminContent.mockImplementation(() => {
      throw new Error();
    });
    await controller.getAdminContent();
  });

  it('Should update content: exception', async () => {
    const file = {};
    const language = 'en';
    const version = '1.0';
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.updateContent(file, language, version);
  });

  it('Should update content: file error', async () => {
    const file = null;
    const language = 'en';
    const version = '1.0';
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.fileNotFound,
        },
      },
    };
    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.updateContent(file, language, version);
    expect(res).toEqual(expRes);
  });

  it('Should update content: mime type error', async () => {
    const file = {};
    const language = 'en';
    const version = '1.0';
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.uploadJsonFile,
        },
      },
    };
    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.updateContent(file, language, version);
    expect(res).toEqual(expRes);
  });

  it('Should update content: success', async () => {
    const file = {
      mimetype: 'application/json',
    };
    const language = 'en';
    const version = '1.0';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          data: '',
        },
      },
    };
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockContentService.updateContent.mockReturnValue(expRes);
    const res = await controller.updateContent(file, language, version);
    expect(res).toEqual(expRes);
  });

  it('Get content: exception', async () => {
    const language = 'en';
    const version = '1.0';
    const type = 'test';
    mockContentService.getContent.mockImplementation(() => {
      throw new Error();
    });
    await controller.getContent(language, version, type);
  });

  it('Get content: success', async () => {
    const language = 'en';
    const version = '1.0';
    const type = 'test';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          data: '',
        },
      },
    };
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockContentService.getContent.mockReturnValue(expRes);
    const res = await controller.getContent(language, version, type);
    expect(res).toEqual(expRes);
  });

  it('Get content options: exception', async () => {
    const key = 'version';
    mockContentService.getContentOptions.mockImplementation(() => {
      throw new Error();
    });
    await controller.getContentOptions(key);
  });

  it('Get content options: invalid key error', async () => {
    const key = 'test';
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.invalidContentKey,
        },
      },
    };
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getContentOptions(key);
    expect(res).toEqual(expRes);
  });

  it('Get content options: success', async () => {
    const key = 'version';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [],
      },
    };
    mockValidation.isHex.mockReturnValue(true);
    mockContentService.getContentOptions.mockReturnValue(expRes);
    const res = await controller.getContentOptions(key);
    expect(res).toEqual(expRes);
  });

  //getPreviewImages
  it('should call getPreviewImages service', async () => {
    mockValidation.isValidUrl.mockReturnValue(true);
    await controller.getPreviewImages({
      url: 'link/to/image',
    });
    expect(mockContentService.getPreviewImages.mock.calls.length).toBe(1);
  });

  it('should create an invalid url error', async () => {
    mockValidation.isValidUrl.mockReturnValue(false);
    await controller.getPreviewImages({
      url: 'link/to/image',
    });
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  //getDeeplinkData
  it('should call getDeepLinkData service', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(true);
    await controller.getDeeplinkData('communityId', 'en');
    expect(mockContentService.getDeeplinkContent.mock.calls.length).toBe(1);
  });

  it('should return error with user identity', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(null);
    await controller.getDeeplinkData('communityId', 'en');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('should return error with not valid id', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockReturnValue(false);
    await controller.getDeeplinkData('communityId', 'en');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('should return error', async () => {
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockValidation.isHex.mockImplementation(() => {
      throw new Error()
    });
    await controller.getDeeplinkData('communityId', 'en');
  });

  //getContentVersions
  it("Get the content versions", async () => {
    mockContentService.getContentVersions.mockReturnValue(true);
    const data = await controller.getContentVersions('public', 'en');
    expect(data).toEqual(true);
  });

  it("Get the content versions", async () => {
    mockContentService.getContentVersions.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getContentVersions('public', 'en');
  })

  // getContentLink
  it("Should content links", async () => {
    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockContentService.getDeeplinkContent.mockReturnValue(true);
    await controller.getContentLink('libId', 'en', 'communityId');
  });

  it("Should content links", async () => {
    mockValidation.checkUserIdentity.mockReturnValue(false);
    mockResult.createError.mockReturnValue(true);
    await controller.getContentLink('libId', 'en', 'communityId');
  });

  it("Should content links", async () => {
    mockValidation.checkUserIdentity.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(true);
    await controller.getContentLink('libId', 'en', 'communityId');
  });

  it("Should content links", async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getContentLink('libId', 'en', 'communityId');
  });

  // getTouContent
  it("Should return Tou Content", async () => {
    mockContentService.getTouContent.mockReturnValue(true);
    await controller.getTouContent('en');
  });

  it("Should return Tou Content", async () => {
    mockContentService.getTouContent.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await controller.getTouContent('en');
  });

  describe('updateTrainingLinks', () => {
    const sectionRequest: TrainingLinkRequest = {
      sectionTitle: 'Test Title',
      link: [
        {
          title: 'Test',
          url: 'test-url',
        },
      ],
      sectionId: 'sectionId'
    };

    it('should call create section service', async () => {
      mockValidation.isNullOrWhiteSpace
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true);
      await controller.updateTrainingLinks(sectionRequest);
      expect(mockContentService.createLinkSection.mock.calls.length).toBe(1);
    });

    it('should call update section service', async () => {
      mockValidation.isNullOrWhiteSpace
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(false);
      await controller.updateTrainingLinks(sectionRequest);
      expect(mockContentService.updateLinkSection.mock.calls.length).toBe(1);
    });

    it('should return error for section title', async () => {
      mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
      await controller.updateTrainingLinks(sectionRequest);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should return error for null links', async () => {
      mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false).mockReturnValue(true);
      await controller.updateTrainingLinks(sectionRequest);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('shoudl call an exception', async () => {
      mockValidation.isNullOrWhiteSpace
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true);
      mockContentService.createLinkSection.mockRejectedValue({});

      await controller.updateTrainingLinks(sectionRequest);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getLatestContent', () => {
    it('should call content service', async () => {
      await controller.getLatestContent('public', 'en');
      expect(mockContentService.getLatestContent.mock.calls.length).toBe(1);
    });

    it('should return error for invalid contentType', async () => {
      await controller.getLatestContent('test', 'en');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('should return error for invalid contentType', async () => {
      await controller.getLatestContent('public', 'en');
      mockContentService.getLatestContent.mockImplementation(() => {
        throw new Error()
      });
      expect(mockResult.createException.mock.calls.length).toBe(0);
    });
  });
});
