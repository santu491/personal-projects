import { mockLogger, mockMongo, mockResult, mockSqsService } from "@anthem/communityadminapi/common/baseTest";
import { AppMemberService } from "../appMemberService";

describe('AppMemberService', () => {
  let service: AppMemberService;

  beforeEach(() => {
    service = new AppMemberService(<any>mockMongo, <any>mockResult, <any>mockSqsService, <any>mockLogger)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get the delete requested user list', () => {
    it('get list of delete requested user', async () => {
      await service.getDeleteRequestedUsers();
      expect(mockMongo.readAllByValue.mock.calls.length).toBe(1);
    });

    it('should return exception', async () => {
      await service.getDeleteRequestedUsers();
      mockMongo.readAllByValue.mockImplementation(() => {
        throw new Error()
      });
      expect(mockResult.createException.mock.calls.length).toBe(0);
    });
  });

  describe('updateUserDeleteRequest', () => {
    it('Update the delete requested user', async () => {
      mockMongo.readByID.mockReturnValue(true);
      mockSqsService.addToNotificationQueue.mockReturnValue(true)

      await service.updateUserDeleteRequest(true, 'userId');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('Update the delete requested user', async () => {
      mockMongo.updateByQuery.mockReturnValue(true);

      await service.updateUserDeleteRequest(false, '62065e392715d2002aa55fba');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('Update the delete requested user', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error()
      });

      await service.updateUserDeleteRequest(true, 'userId');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
