import { API_RESPONSE } from '@anthem/communityadminapi/common';
import {
  mockMongo,
  mockResult,
  mockValidation
} from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { TrainingLinkRequest } from 'api/adminresources/models/contentModel';
import { ContentService } from '../contentService';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    service = new ContentService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockValidation,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return Admin Content from the Contents', async () => {
    const expRes = {
      contentType: 'admin',
      language: 'en',
      version: '1.0.0',
      deepLink: [],
      updatedAt: '2022-01-18T16:37:56.980Z',
      createdAt: '2022-01-18T16:37:56.980Z',
      id: '61e6ece444aff493ad916359',
    };
    mockMongo.readByValue.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    await service.getAdminContent();
  });

  it('Should return Admin Content from the Contents: Exception', async () => {
    mockMongo.readByValue.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getAdminContent();
  });

  it('Should return Admin Content from the Contents: Error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.noAdminContent,
          detail: API_RESPONSE.messages.noAdminContentDetails,
        },
      },
    };
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    await service.getAdminContent();
  });

  it('Should update content: Exception', async () => {
    let file: Buffer;
    const userId = '';
    const language = 'en';
    const type = 'test';
    mockMongo.readByID.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.updateContent(file, userId, language, type);
  });

  it('Should update content: Error', async () => {
    let file: Buffer;
    const userId = '';
    const language = 'en';
    const type = 'test';
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
    mockMongo.readByID.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    await service.updateContent(file, userId, language, type);
  });

  it('Should update content: Success', async () => {
    const file = {
      buffer: "{\"preLogin\":\"preLogin\"}"
    };
    const userId = '';
    const language = 'en';
    const version = '1.0';
    const type = 'test';
    const payload = {
      language: language,
      version: version,
      contentType: type,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      updatedBy: userId,
      data: ''
    }
    mockMongo.insertValue.mockReturnValue(payload);
    mockResult.createSuccess.mockReturnValue(payload);
    await service.updateContent(file, userId, language, type);
  });

  it('Get content: Exception', async () => {
    const language = 'en';
    const version = '1.0';
    const type = 'test';
    mockMongo.readByValue.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getContent(language, version, type);
  });

  it('Get content: Error', async () => {
    const language = 'en';
    const version = '1.0';
    const type = 'test';
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.contentNotFound,
        },
      },
    };
    mockMongo.readByValue.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    await service.getContent(language, version, type);
  });

  it('Should get content: Success', async () => {
    const language = 'en';
    const version = '1.0';
    const type = 'test';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {}
      }
    };
    mockMongo.readByValue.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    await service.getContent(language, version, type);
  });

  it('Get content options: Exception', async () => {
    const key = 'version';
    mockMongo.getDistinct.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getContentOptions(key);
  });

  it('Get content options: Error', async () => {
    const key = 'version';
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        errors: {
          title: API_RESPONSE.messages.badData,
          detail: API_RESPONSE.messages.contentNotFound,
        },
      },
    };
    mockMongo.getDistinct.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    await service.getContentOptions(key);
  });

  it('Should get content options: Success', async () => {
    const key = 'test';
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {}
      }
    };
    mockMongo.getDistinct.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    await service.getContentOptions(key);
  });

  describe('createLinkSection', () => {
    const payload: TrainingLinkRequest = {
      sectionTitle: 'New Test Section',
      sectionId: '',
      link: []
    };

    it('should create section Link', async () => {
      mockMongo.readByValue.mockReturnValue({
        content: {
          trainingLinks: '1.0'
        }
      });
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.createLinkSection(payload);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
      expect(mockResult.createSuccess).toHaveBeenCalledWith(true);
    });

    it('should return update failure', async () => {
      mockMongo.readByValue.mockReturnValue({
        content: {
          trainingLinks: '1.0'
        }
      });
      mockMongo.updateByQuery.mockReturnValue(0);
      await service.createLinkSection(payload);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
      expect(mockResult.createSuccess).toHaveBeenCalledWith(false);
    });
  });

  describe('updateLinkSection', async () => {
    const payload: TrainingLinkRequest = {
      sectionTitle: 'New Test Section',
      sectionId: '',
      link: []
    };

    it('should update section Link', async () => {
      mockMongo.readByValue.mockReturnValue({
        content: {
          trainingLinks: '1.0'
        }
      });
      mockMongo.updateByQuery.mockReturnValue(1);
      await service.updateLinkSection(payload);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
      expect(mockResult.createSuccess).toHaveBeenCalledWith(true);
    });

    it('should return update failure', async () => {
      mockMongo.readByValue.mockReturnValue({
        content: {
          trainingLinks: '1.0'
        }
      });
      mockMongo.updateByQuery.mockReturnValue(0);
      await service.updateLinkSection(payload);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
      expect(mockResult.createSuccess).toHaveBeenCalledWith(false);
    });
  });
});
