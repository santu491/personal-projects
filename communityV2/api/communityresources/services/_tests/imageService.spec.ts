import { mockMongo, mockResult, mockS3Svc } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { MemberData, User } from 'api/communityresources/models/userModel';
import { ImageService } from '../imageService';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    service = new ImageService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockS3Svc,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const user: User = {
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    token: '',
    displayName: '',
    age: 0,
    profilePicture: '',
    myCommunities: [],
    contacts: [],
    active: false,
    hasAgreedToTerms: false,
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
  let file: Buffer;
  const s3resp = { Key: 'aaa', Location: 'sss' };

  const post = {
    content: {
      image: "fileName"
    }
  }

  describe('uploadImage', async () => {
    it('error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      await service.uploadImage(file, '601c1c415c474da1053b976b');

      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockResult.createGuid.mockReturnValue(1);
      mockS3Svc.upload.mockReturnValue(s3resp);
      mockMongo.updateByQuery.mockReturnValue(1);

      await service.uploadImage(file, '601c1c415c474da1053b976b');
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockResult.createGuid.mockReturnValue(1);
      mockS3Svc.upload.mockReturnValue(null);

      await service.uploadImage(file, '601c1c415c474da1053b976b');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('exception', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);

      await service.uploadImage(file, '601c1c415c474da1053b976b');
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('updateImage', async () => {
    it('error', async () => {
      mockMongo.readByID.mockReturnValue(null);

      await service.updateImage(file, '601c1c415c474da1053b976b', false);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('isDelete', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockS3Svc.delete.mockReturnValue({DeleteMarker: true});
      mockMongo.updateByQuery.mockReturnValue(1);

      await service.updateImage(file, '601c1c415c474da1053b976b', true);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('success', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockS3Svc.upload.mockReturnValue(s3resp);

      await service.updateImage(file, '601c1c415c474da1053b976b', false);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('error', async () => {
      mockMongo.readByID.mockReturnValue(user);
      mockS3Svc.upload.mockReturnValue(null);

      await service.updateImage(file, '601c1c415c474da1053b976b', false);
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });

    it('exception', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);

      await service.updateImage(file, '601c1c415c474da1053b976b', false);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });

  describe('getImage', async () => {
    it('Error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);
      await service.getImage(true, false, "601c1c415c474da1053b976b");
    });

    it('Error', async () => {
      mockMongo.readByID.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);
      await service.getImage(true, true, "601c1c415c474da1053b976b");
    });

    it('Error', async () => {
      mockMongo.readByID.mockReturnValue(post);
      mockS3Svc.getImage.mockReturnValue(null);
      mockResult.createError.mockReturnValue(1);

      await service.getImage(true, false, "601c1c415c474da1053b976b");
    });

    it('Success', async () => {
      mockMongo.readByID.mockReturnValue(post);
      mockS3Svc.getImage.mockReturnValue({body: "body"});

      await service.getImage(true, false, "601c1c415c474da1053b976b");
    });

    it('Exception', async () => {
      mockMongo.readByID.mockImplementation(() => {
        throw new Error();
      });

      await service.getImage(true, false, "601c1c415c474da1053b976b");
    });
  });
});
