import { mockMongo, mockNotificationHelper, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { UserAttributeService } from "../userAttributeService";

describe('UserAttributeService', async () => {
  let service;
  const userData = require('./data/user.json');

  beforeEach(() => {
    service = new UserAttributeService(<any>mockMongo, <any>mockResult, <any>mockNotificationHelper, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('update story promotion -', async () => {
    mockMongo.readByID.mockReturnValue(userData);
    mockMongo.updateByQuery.mockReturnValue(1);
    await service.updateStoryPromotion(userData, true);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('update story promotion', async () => {
    mockMongo.readByID.mockReturnValue(userData);
    mockMongo.updateByQuery.mockReturnValue(1);
    await service.updateStoryPromotion(userData, false);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });
});
