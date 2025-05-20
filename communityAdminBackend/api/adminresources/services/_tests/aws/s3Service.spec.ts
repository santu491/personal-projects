import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { S3Service } from '../../aws/s3Service';

jest.mock('aws-sdk/clients/s3', () => {
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
    const isProfile = true;
    try {
      const actualValue = await service.upload(file, fileName, isProfile);
      expect(actualValue).toEqual(null);
    } catch (error) {}
  });

  it('Should delete image from s3', async () => {
    const fileName = 'aaa';
    const isProfile = true;
    try {
      const actualValue = await service.delete(fileName, isProfile);
      expect(actualValue).toEqual(null);
    } catch (error) {}
  });

  it('Should get the image form the S3 based on the key', async () => {
    const imageKey = 'someImage';
    const isProfile = true;
    try {
      const res = await service.getImage(imageKey, isProfile);
      expect(res).toEqual(null);
    } catch (error) {}
  });
});
