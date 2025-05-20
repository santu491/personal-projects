import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP } from '@anthem/communityadminapi/utils';
import * as S3 from 'aws-sdk/clients/s3';
import { Service } from 'typedi';

@Service()
export class S3Service {
  constructor(@LoggerParam(__filename) private _log: ILogger) { }

  public async upload(
    file: Buffer,
    fileName: string,
    isProfile: boolean
  ): Promise<S3.ManagedUpload.SendData> {
    try {
      const s3Client = new S3({ apiVersion: APP.config.aws.apiVersion });
      const params: S3.Types.PutObjectRequest = {
        Bucket: isProfile ?
          APP.config.aws.profileBucket :
          APP.config.aws.postBucket,
        Key: fileName,
        Body: file.buffer
      };
      const resp: S3.ManagedUpload.SendData = await s3Client.upload(params).promise();
      return resp;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async delete(fileName: string, isProfile: boolean): Promise<boolean> {
    try {
      const s3Client = new S3({ apiVersion: APP.config.aws.apiVersion });
      const params: S3.DeleteObjectRequest = {
        Bucket: isProfile ?
          APP.config.aws.profileBucket :
          APP.config.aws.postBucket,
        Key: fileName
      };
      const resp: S3.Types.DeleteObjectOutput = await s3Client.deleteObject(params).promise();
      return resp.DeleteMarker;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async getImage(imageKey: string, isProfile: boolean) {
    try {
      const s3Client = new S3({ apiVersion: APP.config.aws.apiVersion });
      const params = {
        Bucket: isProfile ? APP.config.aws.profileBucket : APP.config.aws.postBucket,
        Key: imageKey
      };
      const response: S3.Types.GetObjectOutput = await s3Client.getObject(params).promise();
      return response;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
