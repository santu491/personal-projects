import {
  mockMongo,
  mockResult
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { LibraryService } from '../libraryService';
import { PublicService } from '../publicService';

describe('LibraryService', () => {
  let service: LibraryService;
  let getAppTranslations;

  beforeEach(() => {
    service = new LibraryService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockILogger
    );
    getAppTranslations = jest.spyOn(
      PublicService.prototype,
      'getAppTranslations'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return html reference content', async () => {
    getAppTranslations.mockImplementation(() =>
      Promise.resolve({
        data: {
          value: {
            data: {
              helpfulInfoModule: [
                {
                  helpfulInfoId: 'someId'
                },
                {
                  helpfulInfoId: 'libraryId',
                  sections: [
                    {
                      content: [
                        {
                          _id: '',
                          communityId: '',
                          type: 'HWTopic',
                          contentId: 'Library2',
                          title: 'Living With Cancer',
                          description:
                            'A video collection about dealing with the social and emotional effects of cancer',
                          link: '/v1/api/library/content/5f804eeb326b36caf1bd8e25',
                          video: '',
                          thumbnail: ''
                        },
                        {
                          _id: '',
                          communityId: '',
                          type: 'HWTopic',
                          contentId: 'Library1',
                          title: 'Caregiver Resources',
                          description:
                            'Read about the range of treatments available for you when diagnosed',
                          link: '/v1/api/library/content/5ff3453577b01e2046c36a18',
                          video: '',
                          thumbnail: ''
                        },
                        {
                          _id: '',
                          communityId: '',
                          type: 'HWTopic',
                          contentId: 'Library',
                          title: 'Symptom Management Toolkit',
                          description:
                            'Read about symptomps, causes, diagnostics, and more',
                          link: '/v1/api/library/content/5f907b60e48e5c8c0285c71d',
                          video: '',
                          thumbnail: ''
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      })
    );
    await service.getReferenceContent(
      'libraryId',
      'Library',
      true,
      'en',
      '/link/referenceContent'
    );
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('Should return library does not exist', async () => {
    getAppTranslations.mockImplementation(() =>
      Promise.resolve({
        data: {
          value: {
            data: {
              helpfulInfoModule: [
                {
                  helpfulInfoId: 'someId'
                }
              ]
            }
          }
        }
      })
    );
    await service.getReferenceContent(
      'libraryId',
      'Library',
      true,
      'en',
      '/link/referenceContent'
    );
    expect(mockResult.createError).toHaveBeenCalled();
  });

  it('Should return content does not exist', async () => {
    getAppTranslations.mockImplementation(() =>
      Promise.resolve({
        data: {
          value: {
            data: {
              helpfulInfoModule: [
                {
                  helpfulInfoId: 'libraryId',
                  sections: [
                    {
                      content: [
                        {
                          _id: '',
                          communityId: '',
                          type: 'HWTopic',
                          contentId: 'Library2',
                          title: 'Living With Cancer',
                          description:
                            'A video collection about dealing with the social and emotional effects of cancer',
                          link: '/v1/api/library/content/5f804eeb326b36caf1bd8e25',
                          video: '',
                          thumbnail: ''
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        }
      })
    );
    await service.getReferenceContent(
      'libraryId',
      'Library',
      true,
      'en',
      '/link/referenceContent'
    );
    expect(mockResult.createError).toHaveBeenCalled();
  });
});
