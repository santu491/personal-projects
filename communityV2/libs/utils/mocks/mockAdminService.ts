import { AdminService } from 'api/communityresources/services/adminService';
import { Mockify } from './mockify';

export const mockAdminSvc: Mockify<AdminService> = {
  getAdminProfile: jest.fn(),
  getAdminImage: jest.fn()
};
