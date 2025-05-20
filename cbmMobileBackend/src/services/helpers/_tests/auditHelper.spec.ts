import {AuditHelper} from '../auditHelper';
import {DB_TABLE_NAMES} from '../../../constants';
import {AppEvent} from '../../../models/Audit';
import {mockDynamoDBGateway} from '../../../utils/baseTest';

jest.mock('../../../gateway/dynamoDBGateway', () => ({
  DynamoDBGateway: jest.fn(() => mockDynamoDBGateway),
}));

describe('auditHelper', () => {
  let auditHelper: AuditHelper;

  beforeEach(() => {
    auditHelper = new AuditHelper();
  });

  describe('getInstallation', () => {
    it('should return audit data for the given installation id', async () => {
      const installationId = 'test-installation-id';
      const sessionId = 'test-session-id';
      const mockResponse = {
        data: {
          isSuccess: true,
          value: {installationId, sessionId},
        },
      };

      mockDynamoDBGateway.getRecords.mockResolvedValue(mockResponse);

      const result = await auditHelper.getInstallation(
        installationId,
        sessionId,
      );

      expect(result).toEqual(mockResponse.data.value);
      expect(mockDynamoDBGateway.getRecords).toHaveBeenCalledWith({
        TableName: DB_TABLE_NAMES.AUDIT,
        Key: {installationId, sessionId},
      });
    });

    it('should return null if no data is found', async () => {
      const installationId = 'test-installation-id';
      const sessionId = 'test-session-id';
      const mockResponse = {
        data: {
          isSuccess: false,
        },
      };

      mockDynamoDBGateway.getRecords.mockResolvedValue(mockResponse);

      const result = await auditHelper.getInstallation(
        installationId,
        sessionId,
      );

      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const installationId = 'test-installation-id';
      const sessionId = 'test-session-id';

      mockDynamoDBGateway.getRecords.mockRejectedValue(new Error('Test error'));

      const result = await auditHelper.getInstallation(
        installationId,
        sessionId,
      );

      expect(result).toBeNull();
    });
  });

  describe('addEvent', () => {
    it('should add an event to the audit data', async () => {
      const installationId = 'test-installation-id';
      const sessionId = 'test-session-id';
      const event: AppEvent = {
        eventType: 'test-event',
        timestamp: new Date(),
        screen: '',
        eventData: undefined,
      };

      await auditHelper.addEvent(installationId, sessionId, event);

      expect(mockDynamoDBGateway.updateRecord).toHaveBeenCalledWith({
        TableName: DB_TABLE_NAMES.AUDIT,
        Key: {installationId, sessionId},
        UpdateExpression:
          'set #events = list_append(if_not_exists(#events, :empty_list), :event), updatedAt = :updatedAt',
        ExpressionAttributeNames: {'#events': 'events'},
        ExpressionAttributeValues: {
          ':empty_list': [],
          ':event': [event],
          ':updatedAt': expect.any(Date),
        },
        ReturnValues: 'ALL_NEW',
      });
    });
  });

  describe('addInstallation', () => {
    it('should create an audit record for the given installation id', async () => {
      const installationId = 'test-installation-id';
      const sessionId = 'test-session-id';

      await auditHelper.addInstallation(installationId, sessionId);

      expect(mockDynamoDBGateway.upsertRecord).toHaveBeenCalledWith({
        TableName: DB_TABLE_NAMES.AUDIT,
        Item: {
          installationId,
          sessionId,
          createdAt: expect.any(Date),
          events: [],
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('updateRecentAccess', () => {
    it('should update the recent access time for the given installation id', async () => {
      const installationId = 'test-installation-id';
      const sessionId = 'test-session-id';

      await auditHelper.updateRecentAccess(installationId, sessionId);

      expect(mockDynamoDBGateway.updateRecord).toHaveBeenCalledWith({
        TableName: DB_TABLE_NAMES.AUDIT,
        Key: {installationId, sessionId},
        UpdateExpression: 'set updatedAt = :updatedAt',
        ExpressionAttributeValues: {':updatedAt': expect.any(Date)},
        ReturnValues: 'ALL_NEW',
      });
    });
  });
});
