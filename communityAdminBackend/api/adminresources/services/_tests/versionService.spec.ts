import {
  mockMongo,
  mockResult
} from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { AppVersionModel } from 'api/adminresources/models/appVersionModel';
import { VersionService } from '../versionService';

describe('VersionService', () => {
  let service: VersionService;

  beforeEach(() => {
    service = new VersionService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return app version: success', async () => {
    const resp = [
      {
        ios: '1.0.0',
        android: '1.0.0',
        tou: '1.0',
        content: {
          public: '1.0.0',
          generic: '1.0.0',
          helpfulInfo: '1.0.0',
          prompts: '1.0.0',
        },
        id: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '',
        updatedBy: '',
      },
    ];
    mockMongo.readAll.mockReturnValue(resp);
    mockResult.createSuccess.mockReturnValue(resp);
    await service.getAppVersion();
  });

  it('Should return app version: Exception', async () => {
    mockMongo.readAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getAppVersion();
  });

  it('Should update version: Exception', async () => {
    const payload: AppVersionModel = {
      ios: '1.0.0',
      android: '1.0.0',
      tou: '1.0',
      content: {
        public: '1.0.0',
        generic: '1.0.0',
        helpfulInfo: '1.0.0',
        prompts: '1.0.0',
        pushNotification: '1.0'
      },
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
      imageFilter: false
    };
    const admin = {
      id: 'id',
      username: 'username',
      firstName: 'fisrName',
      lastName: 'lastName',
      displayName: 'displayName',
      profileImage: 'image',
      role: 'role',
      displayTitle: 'displayTitle',
    };

    mockMongo.updateByQuery.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.updateAppVersion(payload, admin);
  });

  it('Should update version: success', async () => {
    const payload: AppVersionModel = {
      ios: '1.0.0',
      android: '1.0.0',
      tou: '1.0',
      content: {
        public: '1.0.0',
        generic: '1.0.0',
        helpfulInfo: '1.0.0',
        prompts: '1.0.0',
        pushNotification: '1.0'
      },
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
      imageFilter: false
    };
    const admin = {
      id: 'id',
      username: 'username',
      firstName: 'fisrName',
      lastName: 'lastName',
      displayName: 'displayName',
      profileImage: 'image',
      role: 'role',
      displayTitle: 'displayTitle',
    };
    mockMongo.updateByQuery.mockReturnValue(payload);
    mockResult.createSuccess.mockReturnValue(payload);
    await service.updateAppVersion(payload, admin);
  });
});
