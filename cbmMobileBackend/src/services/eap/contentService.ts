import {DB_TABLE_NAMES, DynamoDbConstants, Messages} from '../../constants';
import {DynamoDBGateway} from '../../gateway/dynamoDBGateway';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';

export class ContentService {
  private result = new ResponseUtil();
  private dynamoGatway = new DynamoDBGateway();
  private Logger = logger();
  private className = this.constructor.name;

  public async getContentService(contentKey: string, language: string) {
    try {
      const contentData = await this.dynamoGatway.getRecords({
        [DynamoDbConstants.TABLE_NAME]: DB_TABLE_NAMES.CONTENT,
        [DynamoDbConstants.KEY]: {
          contentKey,
          language,
        },
      });
      if (!contentData?.data?.isSuccess || !contentData.data?.value?.content) {
        return this.result.createException(Messages.contentError);
      }
      return this.result.createSuccess(contentData.data.value.content);
    } catch (error: any) {
      this.Logger.error(`${this.className} - getContentService :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        Messages.contentError,
      );
    }
  }
}
