/* eslint-disable no-console */
import { API_RESPONSE, collections, mongoDbTables, Result } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import * as tf from '@tensorflow/tfjs-node';
import { Service } from 'typedi';
import { BaseResponse } from '../models/resultModel';
import { NSFWLoader } from '../services/helpers/nsfwLoader';

@Service()
export class ImageUploadService {

  constructor(
    private _result: Result,
    private _mongoSvc: MongoDatabaseClient,
    private _nsfw: NSFWLoader,
    @LoggerParam(__filename) private _log: ILogger
  ) { }

  public async uploadImageBase64(
    profilePicture: string,
    userId: string
  ): Promise<BaseResponse> {
    try {
      const appVersion = await this._mongoSvc.readByValue(
        collections.APPVERSION,
        {}
      );
      const isImageFilterEnabled =
        appVersion?.imageFilter === undefined ||
        appVersion?.imageFilter === null
          ? true
          : appVersion?.imageFilter;

      if (isImageFilterEnabled && profilePicture) {
        const binaryString = atob(profilePicture);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const image: tf.Tensor3D = tf.node.decodeImage(bytes, 3) as tf.Tensor3D;
        const nsfwModel = await this._nsfw.getNsfwModel();
        const predictions = await nsfwModel.classify(image);

        if (!this.isImageAppropriate(predictions)) {
          this._result.errorInfo.title = API_RESPONSE.messages.badData;
          this._result.errorInfo.detail = 'The image is inappropriate';
          this._result.errorInfo.errorCode = API_RESPONSE.statusCodes[433];
          return this._result.createError([this._result.errorInfo]);
        }
      }

      const updateQuery = {
        [mongoDbTables.profileImages.userId]: userId
      };
      const modifiedCount = await this._mongoSvc.replaceByQuery(collections.PROFILEIMAGES, updateQuery, {
        [mongoDbTables.profileImages.userId]: userId,
        [mongoDbTables.profileImages.profileImageBase64]: profilePicture
      });

      return this._result.createSuccess(modifiedCount >= 0 ? true: false);
    }
    catch (error) {
      this._log.error(error as Error);
      return this._result.createException(error);
    }
  }

  private isImageAppropriate(predictionData: { className: string, probability: number }[]) {
    const adultContentList = ['Porn', 'Sexy', 'Hentai'];
    if (predictionData.length > 0) {
      const topContent = predictionData[0];
      if (
        adultContentList.includes(topContent.className) &&
        topContent.probability > 0.7
      ) {
        return false;
      }
    }
    return true;
  }
}
