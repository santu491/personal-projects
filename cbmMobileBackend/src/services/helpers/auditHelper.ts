import {DB_TABLE_NAMES} from '../../constants';
import {DynamoDBGateway} from '../../gateway/dynamoDBGateway';
import {AuditTable, AppEvent} from '../../models/Audit';

export class AuditHelper {
  private dbGateway = new DynamoDBGateway();

  /**
   * Returns the audit data for the given installation id
   * @param installationId installation id pertaining to the app user
   * @returns the audit data
   */
  async getInstallation(
    installationId: string,
    sessionId: string,
  ): Promise<AuditTable | null> {
    try {
      const getQuery = {
        TableName: DB_TABLE_NAMES.AUDIT,
        Key: {
          installationId: installationId,
          sessionId: sessionId,
        },
      };

      const userInstallationResponse =
        await this.dbGateway.getRecords(getQuery);

      if (userInstallationResponse?.data?.isSuccess) {
        return userInstallationResponse.data.value;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Adds an event to the audit data for the given installation id
   * @param installationId installation id for a user
   * @param event event to be added to the audit data
   */
  async addEvent(installationId: string, sessionId: string, event: AppEvent) {
    const putQuery = {
      TableName: DB_TABLE_NAMES.AUDIT,
      Key: {
        installationId: installationId,
        sessionId: sessionId,
      },
      UpdateExpression:
        'set #events = list_append(if_not_exists(#events, :empty_list), :event), updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#events': 'events',
      },
      ExpressionAttributeValues: {
        ':empty_list': [],
        ':event': [event],
        ':updatedAt': new Date(),
      },
      ReturnValues: 'ALL_NEW',
    };

    await this.dbGateway.updateRecord(putQuery);
  }

  /**
   * Creates an audit record for the given installation id
   * @param installationId installation id pertaining to the app user
   */
  async addInstallation(installationId: string, sessionId: string) {
    const putQuery = {
      TableName: DB_TABLE_NAMES.AUDIT,
      Item: {
        installationId: installationId,
        sessionId: sessionId,
        createdAt: new Date(),
        events: [],
        updatedAt: new Date(),
      },
    };

    await this.dbGateway.upsertRecord(putQuery);
  }

  async updateRecentAccess(installationId: string, sessionId: string) {
    const putQuery = {
      TableName: DB_TABLE_NAMES.AUDIT,
      Key: {
        installationId: installationId,
        sessionId: sessionId,
      },
      UpdateExpression: 'set updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':updatedAt': new Date(),
      },
      ReturnValues: 'ALL_NEW',
    };

    await this.dbGateway.updateRecord(putQuery);
  }
}
