import {
  mockCacheUtil,
  mockMongo,
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import {
  mockHealthTokenService,
  mockHealthwiseGateway
} from '@anthem/communityapi/utils/mocks/mockHealthwise';
import { HealthWiseService } from '../healthWiseService';

describe('healthWiseService', () => {
  let svc: HealthWiseService;

  beforeEach(() => {
    svc = new HealthWiseService(
      mockHealthwiseGateway as any,
      mockHealthTokenService as any,
      mockValidation as any,
      mockCacheUtil as any,
      <any>mockResult,
      <any>mockMongo,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  mockResult.createSuccess.mockImplementation((data) => {
    return {
      data: {
        isSuccess: true,
        isException: false,
        value: data
      }
    }
  });

  mockResult.createError.mockImplementation((data) => {
    return {
      data: {
        isSuccess: false,
        isException: false,
        errors: data
      }
    }
  });

  const articles = require('./data/healthwise-response.json');
  const helpfulInfo = require('./data/helpfulInfo-raw.json');
  const authResponse = {
    access_token: 'AccessToken',
    expires_in: 72
  };

  describe('getArticleTopicByTopicId', () => {
    it('should return success', async () => {
      mockMongo.readByValue.mockReturnValue({
        content: {
          helpfulInfo: '1.0'
        }
      });
      mockMongo.readAllByValue.mockReturnValue(helpfulInfo.raw);
      mockCacheUtil.getCache.mockReturnValue(null);
      mockHealthTokenService.postAuth.mockReturnValue(authResponse);
      mockHealthwiseGateway.getTopicById.mockReturnValue(articles);
      await svc.getArticleTopicByTopicId('abu3814', 'en', '/v2/healthWise/articleTopic/abt0686');
      expect(mockResult.createSuccess.mock.calls.length).toBe(2);
    });

    it('should return error', async () => {
      mockCacheUtil.getCache.mockReturnValue(authResponse);
      mockHealthwiseGateway.getTopicById.mockReturnValue(null);
      await svc.getArticleTopicByTopicId('abu3814', 'en', '/v2/healthWise/articleTopic/abt0686');
      expect(mockResult.createError.mock.calls.length).toBe(2);
    });

    it('should return healthwise data deleted error', async () => {
      mockMongo.readByValue.mockReturnValue({
        content: {
          helpfulInfo: '1.0'
        }
      });
      mockMongo.readAllByValue.mockReturnValue(helpfulInfo.raw);
      mockCacheUtil.getCache.mockReturnValue(null);
      mockHealthTokenService.postAuth.mockReturnValue(authResponse);
      mockHealthwiseGateway.getTopicById.mockReturnValue(articles);
      await svc.getArticleTopicByTopicId('abu3814', 'en', '/v2/healthWise/articleTopic/abt0696');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });

  describe('getArticleTopic', async () => {
    it('should return success', async () => {
      mockCacheUtil.getCache.mockReturnValue(null);
      mockHealthTokenService.postAuth.mockReturnValue(authResponse);
      mockHealthwiseGateway.getArticleTopic.mockReturnValue(articles);
      await svc.getArticleTopic(
        'HWCV_05501',
        'selfCareTxOptions',
        'FullDetail',
        'en',
        ''
      );
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockCacheUtil.getCache.mockReturnValue(authResponse);
      mockHealthwiseGateway.getArticleTopic.mockReturnValue(null);
      await svc.getArticleTopic(
        'HWCV_05501',
        'selfCareTxOptions',
        'FullDetail',
        'en',
        ''
      );
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });

  describe('getVideoTopic', async () => {
    it('error', async () => {
      mockCacheUtil.getCache.mockReturnValue(null);
      mockCacheUtil.setCache.mockReturnValue(true);
      mockHealthTokenService.postAuth.mockReturnValue('cache');
      mockHealthwiseGateway.getTopicById.mockReturnValue(null);

      await svc.getVideoTopic('topicId', 'en', 'link');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('exception', async () => {
      mockCacheUtil.getCache.mockImplementation(() => {
        throw new Error();
      });

      await svc.getVideoTopic('topicId', 'en', 'link');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
