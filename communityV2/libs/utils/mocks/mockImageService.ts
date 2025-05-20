import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ImageUploadService } from 'api/communityresources/services/imageUploadService';

export const mockImageUploadSvc: Mockify<ImageUploadService> = {
  uploadImageBase64: jest.fn()
};
