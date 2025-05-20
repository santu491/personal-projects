import {APP} from '../../utils/app';
import {appConfig} from '../../utils/mockData';
import {decrypt} from '../../utils/security/encryptionHandler';
import {DynamoDBGateway} from '../dynamoDBGateway';
import {axiosPost, axiosPut} from '../../utils/httpUtil';

jest.mock('../../utils/security/encryptionHandler', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
}));
jest.mock('../../utils/httpUtil');
describe('dynambDBGateway', () => {
  let gateway: DynamoDBGateway;
  beforeEach(() => {
    APP.config.database = appConfig.database;
    APP.config.encryption = appConfig.encryption;
    gateway = new DynamoDBGateway();
    (decrypt as jest.Mock).mockReturnValue('test-key');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecords', () => {
    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockReturnValue({data: 'data'});
      const response = await gateway.getRecords({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('Error');
      await gateway.getRecords({someQuery: 'test'}).catch(error => {
        expect(error).toBe('Error');
      });
    });
  });

  describe('getAllRecords', () => {
    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockReturnValue({data: {data: 'data'}});
      const response = await gateway.getAllRecords({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('Error');
      await gateway.getAllRecords({someQuery: 'test'}).catch(error => {
        expect(error).toBe('Error');
      });
    });
  });

  describe('getMultipleRecords', () => {
    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockReturnValue({data: 'data'});
      const response = await gateway.getMultipleRecords({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('Error');
      const response = await gateway.getMultipleRecords({someQuery: 'test'});
      expect(response).toBeNull();
    });
  });

  describe('queryTable', () => {
    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockReturnValue({data: 'data'});
      const response = await gateway.queryTable({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to query table', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('Error');
      await gateway.queryTable({someQuery: 'test'}).catch(error => {
        expect(error).toBe('Error');
      });
    });
  });

  describe('upsertRecord', () => {
    it('should be able to get records', async () => {
      (axiosPost as jest.Mock).mockReturnValue({data: 'data'});
      const response = await gateway.upsertRecord({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to upsert records', async () => {
      (axiosPost as jest.Mock).mockRejectedValue('Error');
      await gateway.upsertRecord({someQuery: 'test'}).catch(error => {
        expect(error).toBe('Error');
      });
    });
  });

  describe('updateRecord', () => {
    it('should be able to get records', async () => {
      (axiosPut as jest.Mock).mockReturnValue({data: 'data'});
      const response = await gateway.updateRecord({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to update records', async () => {
      (axiosPut as jest.Mock).mockRejectedValue('Error');
      await gateway.updateRecord({someQuery: 'test'}).catch(error => {
        expect(error).toBe('Error');
      });
    });
  });

  describe('deleteRecord', () => {
    it('should be able to get records', async () => {
      (axiosPut as jest.Mock).mockReturnValue({data: 'data'});
      const response = await gateway.deleteRecord({someQuery: 'test'});
      expect(response).toBeDefined();
    });

    it('should be able to delete records', async () => {
      (axiosPut as jest.Mock).mockRejectedValue('Error');
      await gateway.deleteRecord({someQuery: 'test'}).catch(error => {
        expect(error).toBe('Error');
      });
    });
  });
});
