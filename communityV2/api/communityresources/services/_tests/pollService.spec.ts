import { mockMongo, mockResult } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { PollResponse, PollResponseRequest } from 'api/communityresources/models/pollModel';
import { MemberData, User } from 'api/communityresources/models/userModel';
import { PollService } from '../pollService';

describe('InternalService', () => {
  let svc: PollService;

  beforeEach(() => {
    svc = new PollService(<any>mockMongo, <any>mockResult, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const post = {
    "id": "64a53aec4db62b0cd4248745",
    "communities": [
      "6214e8959aa982c0d09b40f5"
    ],
    "content": {
      "es": {
        "title": "",
        "body": "",
        "deepLink": null,
        "poll": {
          "question": "xx1",
          "endsOn": 2,
          "options": [
            {
              "id": "fd694e56b70bba9327253775",
              "text": ""
            },
            {
              "id": "3d54a4a7208bc588e7a0c14d",
              "text": ""
            }
          ]
        }
      },
      "en": {
        "title": "test",
        "body": "<font face=\"Arial\">test</font>",
        "deepLink": null,
        "poll": {
          "question": "xx1",
          "endsOn": 2,
          "options": [
            {
              "id": "fd694e56b70bba9327253775",
              "text": "aa1"
            },
            {
              "id": "3d54a4a7208bc588e7a0c14d",
              "text": "bb1"
            }
          ]
        }
      }
    },
    "published": false
  }

  const pollResponse: PollResponse = {
    "postId": "64761123a00c2f0023908a3c",
    "userResponse": {
      "3d54a4a7208bc588e7a0c14d": [],
      "fd694e56b70bba9327253775": [
        {
          "userId": "64130bd75ee70100292c8296",
          "edited": true
        }
      ]
    }
  };

  const pollRequest: PollResponseRequest = {
    postId: '64a53aec4db62b0cd4248745',
    optionId: 'fd694e56b70bba9327253775',
    isEdited: false
  };

  const user: User = {
    id: '64130bd75ee70100292c8296',
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
    loginTreatDetails: undefined,
    secretQuestionAnswers: [],
    cancerCommunityCard: false,
    deleteRequested: false,
    dummy2FACheck: false,
    recoveryTreatDetails: undefined,
    memberData: new MemberData()
  }

  describe('userPollResponse', async () => {
    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(null);
      mockMongo.readByID.mockReturnValue(post);
      mockMongo.insertValue.mockReturnValue(pollResponse);
      mockMongo.readByID.mockReturnValue(post);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue(post);

      await svc.userPollResponse(pollRequest, user);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('success', async () => {
      mockMongo.readByValue.mockReturnValue(pollResponse);
      mockMongo.readByID.mockReturnValue(post);
      mockMongo.updateByQuery.mockReturnValue(1);
      mockMongo.readByID.mockReturnValue(post);

      await svc.userPollResponse(pollRequest, user);
      expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    });

    it('error/exception', async () => {
      mockMongo.readByValue.mockImplementation(() => {
        throw new Error();
      });
      mockILogger.error.mockReturnValue(1);

      await svc.userPollResponse(pollRequest, user);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
