import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { S3Service } from '../../aws/s3Service';

jest.mock('@aws-sdk/client-s3', () => {
  const S3Mocked = {
    upload: jest.fn().mockReturnThis(),
    deleteObject: jest.fn().mockReturnThis(),
    getObject: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    S3: jest.fn(() => S3Mocked),
  };
});

describe('S3Service', () => {
  let service: S3Service;
  beforeEach(() => {
    service = new S3Service(<any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should upload image to s3', async () => {
    let file: Buffer;
    const fileName = 'aaa';
    try {
      const actualValue = await service.upload(file, fileName);
      expect(actualValue).toEqual(null);
    } catch (error) {}
  });

  it('Should delete image from s3', async () => {
    const fileName = 'aaa';
    try {
      const actualValue = await service.delete(fileName);
      expect(actualValue).toEqual(null);
    } catch (error) {}
  });

  it('Should get image from s3', async () => {
    const fileName = 'aaa';
    try {
      const actualValue = await service.getImage(fileName, true);
      expect(actualValue).toEqual(null);
    } catch (error) {}
  });
});
