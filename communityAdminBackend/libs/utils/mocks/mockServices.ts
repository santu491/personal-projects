import { DashboardService } from 'api/adminresources/services/dashboardService';
import { MetricsService } from 'api/adminresources/services/metricsService';
import { Mockify } from './mockify';

export const mockDashboardSvc: Mockify<DashboardService> = {
  getActiveUsersCount: jest.fn(),
  getNewUsersCount: jest.fn(),
  getLatestPost: jest.fn(),
  getPostActivities: jest.fn(),
  getUserData: jest.fn()
};

export const mockMetricsSvc: Mockify<MetricsService> = {
  getCommunityMetrics: jest.fn()
};
