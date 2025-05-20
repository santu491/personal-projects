import {Messages} from '../../constants';
import {mockContentService, mockResult} from '../../utils/baseTest';
import {ContentController} from '../contentController';

jest.mock('../../utils/responseUtil', () => ({
  ResponseUtil: jest.fn(() => mockResult),
}));

jest.mock('../../services/eap/contentService', () => ({
  ContentService: jest.fn(() => mockContentService),
}));

describe('ContentController', () => {
  let controller: ContentController;

  beforeEach(() => {
    controller = new ContentController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getContentDetails', () => {
    it('getContentDetails: success', async () => {
      const contentData = {
        data: {
          isSuccess: true,
          value: {
            content: 'test',
          },
        },
      };
      mockContentService.getContentService.mockReturnValue(contentData);
      const response = await controller.getContentDetails('test', 'en');
      expect(response).toBe(contentData);
    });

    it('getContentService: error', async () => {
      mockResult.createException.mockReturnValue(Messages.contentError);
      await controller.getContentDetails('test', 'en');
    });

    it('getContentService: exception', async () => {
      mockContentService.getContentService.mockImplementation(() => {
        throw new Error();
      });
      await controller.getContentDetails('test', 'en');
    });
  });
});
