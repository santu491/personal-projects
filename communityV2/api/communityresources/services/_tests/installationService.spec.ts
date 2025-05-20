import {
  mockMongo,
  mockResult,
  mockSnsSvc
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { InstallationRequest } from 'api/communityresources/models/internalRequestModel';
import { MemberData, User } from 'api/communityresources/models/userModel';
import { InstallationService } from '../installationService';

describe('Image Upload Service', () => {
  let service: InstallationService;
  beforeEach(() => {
    service = new InstallationService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockSnsSvc,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user: User = {
    id: '5f99844130b711000703cd74',
    firstName: 'GA',
    lastName: 'JONES',
    username: '~sit3gajones',
    age: 42,
    profilePicture: 'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/5f99844130b711000703cd74',
    myCommunities: [
      '5f07537bc12e0c22d00f5d21',
      '5f22db56a374bc4e80d80a9b',
      '5f0e744536b382377497ecef',
      '5f189ba00d5f552cf445b8c2',
      '5f0753f6c12e0c22d00f5d23',
      '5f0753b7c12e0c22d00f5d22'
    ],
    active: true,
    hasAgreedToTerms: false,
    token: '',
    displayName: '',
    contacts: [],
    personId: '',
    onBoardingState: '',
    localCategories: [],
    tou: [],
    memberData: new MemberData,
    loginTreatDetails: undefined,
    secretQuestionAnswers: [],
    cancerCommunityCard: false,
    deleteRequested: false,
    dummy2FACheck: false,
    recoveryTreatDetails: undefined
  };

  const installatonModel: InstallationRequest = {
    userName: '',
    appVersion: '',
    locale: '',
    osVersion: '',
    platform: '',
    timeZoneOffset: 0,
    deviceToken: ''
  }

  const installation = {
    id: '',
    userId: '',
    devices: [
      {
        "deviceToken" : "af0b392330994b848ea853320626fa6042848ba78945ea84f11ef2e363998352",
        "id" : "64526392b71d9a0023edb640"
    }
    ]
  }

  describe('saveInstallations', async () => {
    it('error', async () => {
      mockMongo.readByID.mockReturnValueOnce(user);
      mockSnsSvc.addEndpoint.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);

      await service.saveInstallations(installatonModel, 'userId');
    });

    it('success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockSnsSvc.addEndpoint.mockReturnValue('endPointARN');

      mockMongo.readAllByValue.mockReturnValue([installation]);
      mockMongo.updateByQuery.mockResolvedValue(1);

      mockMongo.readByValue.mockReturnValue(installation);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(1);

      await service.saveInstallations(installatonModel, 'userId');
    });

    it('success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockSnsSvc.addEndpoint.mockReturnValue('endPointARN');

      mockMongo.readAllByValue.mockReturnValue([installation]);
      mockMongo.updateByQuery.mockReturnValue(1);

      mockMongo.readByValue.mockReturnValue(null);
      mockMongo.insertValue.mockReturnValue(1);
      mockResult.createSuccess.mockResolvedValue(1);

      await service.saveInstallations(installatonModel, 'userId');
    });

    it('exception', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockSnsSvc.addEndpoint.mockReturnValue('endPointARN');
      mockMongo.readAllByValue.mockImplementation(() => {
        throw new Error()
      });
      mockILogger.error.mockReturnValue(1);
      mockResult.createException.mockReturnValue(1);

      await service.saveInstallations(installatonModel, 'userId');
    });

    it('exception', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);

      await service.saveInstallations(installatonModel, 'userId');
      mockResult.createException.mockReturnValue(1);
    });
  });

  describe('deleteInstallationById', async () => {
    it('error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);

      await service.deleteInstallationById(installatonModel, 'userId');
    });

    it('error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);

      await service.deleteInstallationById(installatonModel, 'userId');
    });

    it('success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockMongo.readByValue.mockReturnValue([installation]);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockResult.createSuccess.mockReturnValue(1);

      await service.deleteInstallationById(installatonModel, 'userId');
    });

    it('exception', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);
      mockResult.createException.mockReturnValue(1);

      await service.deleteInstallationById(installatonModel, 'userId');
    });
  });
});
