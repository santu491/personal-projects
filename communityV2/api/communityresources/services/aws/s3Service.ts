
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { APP } from '@anthem/communityapi/utils';
import { DeleteObjectCommand, DeleteObjectCommandInput, DeleteObjectCommandOutput, GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, PutObjectCommand, PutObjectCommandInput, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Service } from 'typedi';

@Service()
export class S3Service {
  constructor(@LoggerParam(__filename) private _log: ILogger) { }

  public async upload(
    file: Buffer,
    fileName: string
  ): Promise<PutObjectCommandOutput> {
    try {
      const s3Client = new S3Client({ apiVersion: APP.config.aws.apiVersion });
      const params: PutObjectCommandInput = {
        Bucket: APP.config.aws.profileBucket,
        Key: fileName,
        Body: file
      };
      const putCommand = new PutObjectCommand(params);
      const resp: PutObjectCommandOutput = await s3Client.send(putCommand);
      return resp;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async delete(fileName: string): Promise<DeleteObjectCommandOutput> {
    try {
      const s3Client = new S3Client({ apiVersion: APP.config.aws.apiVersion });
      const params: DeleteObjectCommandInput = {
        Bucket: APP.config.aws.profileBucket,
        Key: fileName
      };
      const deleteCmnd = new DeleteObjectCommand(params);
      const resp: DeleteObjectCommandOutput = await s3Client.send(deleteCmnd);

      return resp;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }

  public async getImage(fileName: string, isProfile: boolean): Promise<GetObjectCommandOutput> {
    try {
      const s3Client = new S3Client({ apiVersion: APP.config.aws.apiVersion });
      const params: GetObjectCommandInput = {
        Bucket: isProfile ? APP.config.aws.profileBucket : APP.config.aws.postBucket,
        Key: fileName
      };
      const getCmd = new GetObjectCommand(params);
      const resp: GetObjectCommandOutput = await s3Client.send(getCmd);

      return resp;
    } catch (error) {
      this._log.error(error as Error);
      return null;
    }
  }
}
