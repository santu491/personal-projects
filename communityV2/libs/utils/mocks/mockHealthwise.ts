import { HealthwiseGateway } from 'api/communityresources/gateways/healthwiseGateway';

import { HealthWiseService } from 'api/communityresources/services/healthWiseService';
import { HealthwiseTokenService } from 'api/communityresources/services/healthwiseTokenService';
import { Mockify } from './mockify';

export const mockHealthwiseGateway: Mockify<HealthwiseGateway> = {
  postAuth: jest.fn(),
  getTopicById: jest.fn(),
  getArticleTopic: jest.fn(),
  getArticleById: jest.fn()
};

export const mockHealthwiseService: Mockify<HealthWiseService> = {
  getTopic: jest.fn(),
  getVideoTopic: jest.fn(),
  getArticleTopic: jest.fn(),
  getArticleTopicByTopicId: jest.fn(),
  getArticleById: jest.fn(),
  getTheContentBasedOnTheLink: jest.fn(),
  getContent: jest.fn()
};

export const mockHealthTokenService: Mockify<HealthwiseTokenService> = {
  postAuth: jest.fn()
};
