import {
  mockResult,
  mockValidation,
  mockVersionService
} from '@anthem/communityadminapi/common/baseTest';
import { AppVersionModel } from 'api/adminresources/models/appVersionModel';
import { VersionController } from '../versionController';

describe('VersionController', () => {
  let controller: VersionController;

  const mockifiedUserContext = jest
    .fn()
    .mockReturnValue(
      '{"id":"61b21e9c26dbb012b69cf67e","name":"az00001","active":"true","role":"scadmin","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
    );

  beforeEach(() => {
    controller = new VersionController(
      <any>mockResult,
      <any>mockValidation,
      <any>mockVersionService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* Get App Version */
  it('Should get app version: exception', async () => {
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.getAppVersion();
  });

  it('Should get app version: success', async () => {
    const expRes: AppVersionModel = {
      ios: '1.0.0',
      android: '1.0.0',
      tou: '1.0',
      content: {
        public: '1.0.0',
        generic: '1.0.0',
        helpfulInfo: '1.0.0',
        prompts: '1.0.0',
        pushNotification: ''
      },
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
      imageFilter: false
    };

    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockVersionService.getAppVersion.mockReturnValue(expRes);
    const response = await controller.getAppVersion();
    expect(response).toEqual(expRes);
  });

  /* Update App Version */
  it('Should update app version: exception', async () => {
    const payload: AppVersionModel = {
      ios: '1.0.0',
      android: '1.0.0',
      tou: '1.0',
      content: {
        public: '1.0.0',
        generic: '1.0.0',
        helpfulInfo: '1.0.0',
        prompts: '1.0.0',
        pushNotification: ''
      },
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
      imageFilter: false
    };
    mockValidation.checkUserIdentity.mockImplementation(() => {
      throw new Error();
    });
    await controller.updateAppVersion(payload);
  });

  it('Should update app version: success', async () => {
    const payload: AppVersionModel = {
      ios: '1.0.0',
      android: '1.0.0',
      tou: '1.0',
      content: {
        public: '1.0.0',
        generic: '1.0.0',
        helpfulInfo: '1.0.0',
        prompts: '1.0.0',
        pushNotification: ''
      },
      id: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: '',
      imageFilter: false
    };
    mockValidation.checkUserIdentity.mockReturnValue(mockifiedUserContext);
    mockVersionService.updateAppVersion.mockReturnValue(payload);
    const data = await controller.updateAppVersion(payload);
    expect(data).toEqual(payload);
  });
});
