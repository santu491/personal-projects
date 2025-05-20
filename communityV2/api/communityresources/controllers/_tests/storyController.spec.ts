import { API_RESPONSE, TranslationLanguage } from '@anthem/communityapi/common';
import { mockCommentService, mockRequestContext, mockResult, mockStory, mockValidation } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { RequestContext } from '@anthem/communityapi/utils';
import { CommentRequest } from 'api/communityresources/models/postsModel';
import { DeleteStoryCommentRequest, StoryCommentRequest, StoryReactionRequest, StoryReplyRequest } from 'api/communityresources/models/storyModel';
import { StoryController } from '../storyController';

describe('StoryController', () => {
  let ctrl;

  const storyId = '61dd8c62889ea4001519e705';

  beforeEach(() => {
    ctrl = new StoryController(<any>mockStory, <any>mockValidation, <any>mockResult, <any>mockCommentService, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return all Stories', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: -1 };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            Id: '602f92764396fa0007b56411',
            Author: {
              displayName: 'Magpie',
              id: '5fc8d134e3f3460007cb34e7',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/b2b34648-1823-49c7-aae2-872791a09111.jpg',
              fullName: 'NUNEZ FIGURE',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f369ba97b79ea14f85fb0ec',
                '5f0753b7c12e0c22d00f5d22',
                '5f245386aa271e24b0c6fd89',
                '5f22db56a374bc4e80d80a9b',
                '5f0753f6c12e0c22d00f5d23',
                '5f3d2eef5617cc2e401b8adf',
                '5f0e744536b382377497ecef',
                '5f189ba00d5f552cf445b8c2'
              ],
              age: 47
            },
            CreatedDate: '2021-02-19T10:27:02.674Z',
            UpdatedDate: '2021-02-19T10:28:46.185Z',
            Answer: [
              {
                _id: '602f92764396fa0007b56408',
                PromptId: '5f9c4cfafdfbb52b2c86c989',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test\n\n\n\n\n\n\n\nTest',
                Order: 0,
                CreatedDate: '2021-02-19T10:27:02.674Z',
                UpdatedDate: '2021-02-19T10:27:02.674Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602f92764396fa0007b5640a',
                PromptId: '5f9c4e61fdfbb52b2c86c993',
                Question: 'What was it like to learn the diagnosis?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Welcome',
                Order: 0,
                CreatedDate: '2021-02-19T10:27:02.674Z',
                UpdatedDate: '2021-02-19T10:27:02.674Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602f92764396fa0007b5640c',
                PromptId: '5f9c4f0afdfbb52b2c86c99d',
                Question: 'How did you decide what to do?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test',
                Order: 0,
                CreatedDate: '2021-02-19T10:27:02.674Z',
                UpdatedDate: '2021-02-19T10:27:02.674Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602f92764396fa0007b5640e',
                PromptId: '5f9c4f99fdfbb52b2c86c9a7',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test',
                Order: 0,
                CreatedDate: '2021-02-19T10:27:02.674Z',
                UpdatedDate: '2021-02-19T10:27:02.674Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602f92764396fa0007b56410',
                PromptId: '5f9c520afdfbb52b2c86c9b1',
                Question: 'What happened after that?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: '****** up',
                Order: 0,
                CreatedDate: '2021-02-19T10:27:02.674Z',
                UpdatedDate: '2021-02-19T10:27:02.674Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'Magpie',
            AuthorId: '5fc8d134e3f3460007cb34e7',
            AuthorAgeWhenStoryBegan: 25,
            Relation: 'Sister',
            FeaturedQuote: 'When it snowed...it all began',
            RelationAgeWhenDiagnosed: 28,
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            CommunityName: 'Oral Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '602e40d64396fa0007b563ec',
            Author: {
              displayName: 'Magpie',
              id: '5fc8d134e3f3460007cb34e7',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/b2b34648-1823-49c7-aae2-872791a09111.jpg',
              fullName: 'NUNEZ FIGURE',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f369ba97b79ea14f85fb0ec',
                '5f0753b7c12e0c22d00f5d22',
                '5f245386aa271e24b0c6fd89',
                '5f22db56a374bc4e80d80a9b',
                '5f0753f6c12e0c22d00f5d23',
                '5f3d2eef5617cc2e401b8adf',
                '5f0e744536b382377497ecef',
                '5f189ba00d5f552cf445b8c2'
              ],
              age: 47
            },
            CreatedDate: '2021-02-18T10:26:30.802Z',
            UpdatedDate: '2021-02-18T10:29:10.362Z',
            Answer: [
              {
                _id: '602e41724396fa0007b563ed',
                PromptId: '5f9c4f1cfdfbb52b2c86c9a0',
                Question: 'How did you decide what to do?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: '',
                Response: 'Retest',
                Order: 0,
                CreatedDate: '2021-02-18T10:29:06.151Z',
                UpdatedDate: '2021-02-18T10:29:08.214Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602e40d64396fa0007b563e5',
                PromptId: '5f9c4d15fdfbb52b2c86c98c',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test ',
                Order: 0,
                CreatedDate: '2021-02-18T10:26:30.802Z',
                UpdatedDate: '2021-02-18T10:29:08.214Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602e40d64396fa0007b563e7',
                PromptId: '5f9c4e74fdfbb52b2c86c996',
                Question: 'What was it like to learn the diagnosis?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test',
                Order: 0,
                CreatedDate: '2021-02-18T10:26:30.802Z',
                UpdatedDate: '2021-02-18T10:29:08.214Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602e40d64396fa0007b563e9',
                PromptId: '5f9c521bfdfbb52b2c86c9b4',
                Question: 'What happened after that?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: '****',
                Order: 0,
                CreatedDate: '2021-02-18T10:26:30.802Z',
                UpdatedDate: '2021-02-18T10:29:08.214Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602e40d64396fa0007b563eb',
                PromptId: '5f9c4fadfdfbb52b2c86c9aa',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: '****',
                Order: 0,
                CreatedDate: '2021-02-18T10:26:30.802Z',
                UpdatedDate: '2021-02-18T10:29:08.214Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'Magpie',
            AuthorId: '5fc8d134e3f3460007cb34e7',
            AuthorAgeWhenStoryBegan: 22,
            Relation: 'Husband',
            FeaturedQuote: 'Life as it goes...',
            RelationAgeWhenDiagnosed: 28,
            CommunityId: '5f189ba00d5f552cf445b8c2',
            CommunityName: 'Colorectal Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '602e29a24396fa0007b563d3',
            Author: {
              displayName: 'Smilido',
              id: '5fcf1d379b971f0007f87b7a',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/848e20ea-179e-40c6-ab93-34d8f1b7ec7d.jpg',
              fullName: 'VVFIRST VVLAST',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f0e744536b382377497ecef',
                '5f22db56a374bc4e80d80a9b',
                '5f0753b7c12e0c22d00f5d22'
              ],
              age: 40
            },
            CreatedDate: '2021-02-18T08:47:30.776Z',
            UpdatedDate: '2021-02-18T09:06:43.349Z',
            Answer: [
              {
                _id: '602e2e234396fa0007b563dc',
                PromptId: null,
                Question: '****',
                QuestionAuthorId: '5fc8d134e3f3460007cb34e7',
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: '****',
                Order: 0,
                CreatedDate: '2021-02-18T09:06:43.349Z',
                UpdatedDate: '0001-01-01T00:00:00.000Z',
                Type: 'UserQuestion'
              },
              {
                _id: '602e2ae14396fa0007b563d6',
                PromptId: null,
                Question: ' sunshinehi',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'HI ',
                Order: 0,
                CreatedDate: '2021-02-18T08:52:49.039Z',
                UpdatedDate: '2021-02-18T08:56:29.986Z',
                Type: 'UserQuestion'
              },
              {
                _id: '602e29a24396fa0007b563d0',
                PromptId: '5f9c4d0bfdfbb52b2c86c98b',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  "Cancer is the uncontrolled growth of abnormal cells in the body. Cancer develops when the body's normal control mechanism stops working.",
                Order: 0,
                CreatedDate: '2021-02-18T08:47:30.775Z',
                UpdatedDate: '2021-02-18T08:56:29.986Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602e29a24396fa0007b563d2',
                PromptId: '5f9c5216fdfbb52b2c86c9b3',
                Question: 'What happened after that?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: '34 ****',
                Order: 0,
                CreatedDate: '2021-02-18T08:47:30.775Z',
                UpdatedDate: '2021-02-18T08:56:29.986Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'Smilido',
            AuthorId: '5fcf1d379b971f0007f87b7a',
            AuthorAgeWhenStoryBegan: 22,
            Relation: 'Myself',
            FeaturedQuote: 'Hi there!',
            RelationAgeWhenDiagnosed: 22,
            CommunityId: '5f0e744536b382377497ecef',
            CommunityName: 'Anal Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: true,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '602bbb79e7965700083c86fa',
            Author: {
              displayName: null,
              id: '602a5727e7965700083c86c3',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture: null,
              fullName: 'MICHAEL SMITH',
              firstName: 'Male',
              communities: ['5f0753b7c12e0c22d00f5d22'],
              age: 29
            },
            CreatedDate: '2021-02-16T12:32:57.174Z',
            UpdatedDate: '2021-02-16T13:33:48.285Z',
            Answer: [
              {
                _id: '602bbdf9e7965700083c86fd',
                PromptId: '5f9c4cfafdfbb52b2c86c989',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: '',
                Response:
                  'Sed mattis, tortor eu porta iaculis, ligula ipsum sagittis sem, non feugiat felis nunc venenatis purus. Maecenas porta augue ut semper fermentum.',
                Order: 0,
                CreatedDate: '2021-02-16T12:43:37.453Z',
                UpdatedDate: '2021-02-16T12:58:46.231Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602bbb79e7965700083c86f3',
                PromptId: '5f9c4e61fdfbb52b2c86c993',
                Question: 'What was it like to learn the diagnosis?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'Duis ante lacus, fermentum sit amet urna in, pellentesque iaculis diam. Quisque pellentesque felis vel enim commodo, non porttitor lacus scelerisque.',
                Order: 0,
                CreatedDate: '2021-02-16T12:32:57.174Z',
                UpdatedDate: '2021-02-16T12:58:46.231Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602bbb79e7965700083c86f5',
                PromptId: '5f9c520afdfbb52b2c86c9b1',
                Question: 'What happened after that?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'roin eget sapien lorem. Duis dictum facilisis augue, suscipit aliquet dui porttitor nec. In bibendum, quam at auctor iaculis, eros velit porttitor lectus, sed commodo velit erat nec justo.',
                Order: 0,
                CreatedDate: '2021-02-16T12:32:57.174Z',
                UpdatedDate: '2021-02-16T12:58:46.231Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602bbb79e7965700083c86f7',
                PromptId: '5f9c4f99fdfbb52b2c86c9a7',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'Pellentesque ac neque fringilla, sagittis odio id, pretium orci. Maecenas vitae purus in justo suscipit congue. Aliquam erat volutpat. Morbi semper dui molestie turpis varius aliquet vitae eget lacus.',
                Order: 0,
                CreatedDate: '2021-02-16T12:32:57.174Z',
                UpdatedDate: '2021-02-16T12:58:46.231Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '602bbb79e7965700083c86f9',
                PromptId: '5f9c4f0afdfbb52b2c86c99d',
                Question: 'How did you decide what to do?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'uisque rutrum orci eu libero consectetur tincidunt. Vestibulum nec sapien non odio maximus maximus. Pellentesque maximus augue commodo nunc porttitor mattis feugiat rhoncus mi. Nulla malesuada lectus id mauris vehicula faucibus. ',
                Order: 0,
                CreatedDate: '2021-02-16T12:32:57.174Z',
                UpdatedDate: '2021-02-16T12:58:46.231Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: '',
            AuthorId: '602a5727e7965700083c86c3',
            AuthorAgeWhenStoryBegan: 26,
            Relation: 'Husband',
            FeaturedQuote: 'Quarantined Work is so .... speechless',
            RelationAgeWhenDiagnosed: 30,
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            CommunityName: 'Oral Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '602a63c5e7965700083c86cc',
            Author: {
              displayName: 'Dude Rads',
              id: '600949c9bb91ed000704a209',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/06fdf701-842a-4b22-9d8f-2baa24148822.jpg',
              fullName: 'TOMMY TAD',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f369ba97b79ea14f85fb0ec',
                '5f189ba00d5f552cf445b8c2',
                '5f245386aa271e24b0c6fd88',
                '5f22db56a374bc4e80d80a9b',
                '5f0753f6c12e0c22d00f5d23',
                '5f245386aa271e24b0c6fd89',
                '5f3d2eef5617cc2e401b8adf',
                '5f0e744536b382377497ecef'
              ],
              age: 32
            },
            CreatedDate: '2021-02-15T12:06:29.085Z',
            UpdatedDate: '2021-02-18T11:21:06.596Z',
            Answer: [
              {
                _id: '602e4da24396fa0007b563f0',
                PromptId: null,
                Question: 'test',
                QuestionAuthorId: '5fc8d134e3f3460007cb34e7',
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Hi there ',
                Order: 0,
                CreatedDate: '2021-02-18T11:21:06.596Z',
                UpdatedDate: '0001-01-01T00:00:00.000Z',
                Type: 'UserQuestion'
              },
              {
                _id: '602b6980e7965700083c86e9',
                PromptId: '5f9c4e7ffdfbb52b2c86c998',
                Question: 'What was it like to learn the diagnosis?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: '',
                Response: 'Anthem was great',
                Order: 0,
                CreatedDate: '2021-02-16T06:43:12.124Z',
                UpdatedDate: '0001-01-01T00:00:00.000Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'Dude Rads',
            AuthorId: '600949c9bb91ed000704a209',
            AuthorAgeWhenStoryBegan: 4,
            Relation: 'Grandmother',
            FeaturedQuote: 'Laugh loudly',
            RelationAgeWhenDiagnosed: 45,
            CommunityId: '5f369ba97b79ea14f85fb0ec',
            CommunityName: 'Metastatic or Recurrent Breast Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '6026964ee7965700083c86a4',
            Author: {
              displayName: 'Dude Rads',
              id: '600949c9bb91ed000704a209',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/06fdf701-842a-4b22-9d8f-2baa24148822.jpg',
              fullName: 'TOMMY TAD',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f369ba97b79ea14f85fb0ec',
                '5f189ba00d5f552cf445b8c2',
                '5f245386aa271e24b0c6fd88',
                '5f22db56a374bc4e80d80a9b',
                '5f0753f6c12e0c22d00f5d23',
                '5f245386aa271e24b0c6fd89',
                '5f3d2eef5617cc2e401b8adf',
                '5f0e744536b382377497ecef'
              ],
              age: 32
            },
            CreatedDate: '2021-02-12T14:53:02.625Z',
            UpdatedDate: '2021-02-18T11:17:24.282Z',
            Answer: [
              {
                _id: '602697cee7965700083c86a7',
                PromptId: null,
                Question: 'test1',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test 1',
                Order: 0,
                CreatedDate: '2021-02-12T14:59:26.255Z',
                UpdatedDate: '2021-02-18T11:17:21.939Z',
                Type: 'UserQuestion'
              },
              {
                _id: '6026964ee7965700083c869b',
                PromptId: '5f9c4d59fdfbb52b2c86c991',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Testing the fields 1-retest',
                Order: 0,
                CreatedDate: '2021-02-12T14:53:02.625Z',
                UpdatedDate: '2021-02-18T11:17:21.939Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '6026964ee7965700083c869d',
                PromptId: '5f9c5238fdfbb52b2c86c9b9',
                Question: 'What happened after that?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'test',
                Order: 0,
                CreatedDate: '2021-02-12T14:53:02.625Z',
                UpdatedDate: '2021-02-18T11:17:21.939Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '6026964ee7965700083c869f',
                PromptId: '5f9c4e96fdfbb52b2c86c99b',
                Question: 'What was it like to learn the diagnosis?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Testing the fields 2',
                Order: 0,
                CreatedDate: '2021-02-12T14:53:02.625Z',
                UpdatedDate: '2021-02-18T11:17:21.939Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '6026964ee7965700083c86a1',
                PromptId: '5f9c4f3efdfbb52b2c86c9a5',
                Question: 'How did you decide what to do?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Testing 4',
                Order: 0,
                CreatedDate: '2021-02-12T14:53:02.625Z',
                UpdatedDate: '2021-02-18T11:17:21.939Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '6026964ee7965700083c86a3',
                PromptId: '5f9c4fcdfdfbb52b2c86c9af',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Testing 5',
                Order: 0,
                CreatedDate: '2021-02-12T14:53:02.625Z',
                UpdatedDate: '2021-02-18T11:17:21.939Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'Dude Rads',
            AuthorId: '600949c9bb91ed000704a209',
            AuthorAgeWhenStoryBegan: 25,
            Relation: 'Myself',
            FeaturedQuote: 'Jab thak hai jaan....',
            RelationAgeWhenDiagnosed: 22,
            CommunityId: '5f245386aa271e24b0c6fd89',
            CommunityName: 'Advanced or Metastatic Prostate Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '60265b6ee7965700083c8677',
            Author: {
              displayName: 'Dave',
              id: '60094636bb91ed000704a201',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/bb92fd8a-3a0b-414a-ab60-2a8bb1bf9514.jpg',
              fullName: 'DAVID GILBERTSON',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f22db56a374bc4e80d80a9b',
                '5f0e744536b382377497ecef',
                '5f0753b7c12e0c22d00f5d22'
              ],
              age: 41
            },
            CreatedDate: '2021-02-12T10:41:50.224Z',
            UpdatedDate: '2021-02-12T10:42:01.982Z',
            Answer: [
              {
                _id: '60265b6ee7965700083c8674',
                PromptId: '5f9c4cfafdfbb52b2c86c989',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'Maecenas et posuere magna. Cras interdum ipsum sapien, ac bibendum risus vehicula at. Curabitur sed dolor eget nibh vehicula volutpat id vitae nibh. Maecenas et posuere magna. Cras interdum ipsum sapien, ac bibendum risus vehicula at. Curabitur sed dolor eget nibh vehicula volutpat id vitae nibh. ',
                Order: 0,
                CreatedDate: '2021-02-12T10:41:50.224Z',
                UpdatedDate: '2021-02-12T10:41:50.224Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '60265b6ee7965700083c8676',
                PromptId: '5f9c4f99fdfbb52b2c86c9a7',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'Maecenas et posuere magna. Cras interdum ipsum sapien, ac bibendum risus vehicula at. Curabitur sed dolor eget nibh vehicula volutpat id vitae nibh. ',
                Order: 0,
                CreatedDate: '2021-02-12T10:41:50.224Z',
                UpdatedDate: '2021-02-12T10:41:50.224Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'DAve',
            AuthorId: '60094636bb91ed000704a201',
            AuthorAgeWhenStoryBegan: 30,
            Relation: 'Mother',
            FeaturedQuote:
              'This is a story to retest 262 with some other realtion',
            RelationAgeWhenDiagnosed: 58,
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            CommunityName: 'Oral Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '60265888e7965700083c8672',
            Author: {
              displayName: 'Dave',
              id: '60094636bb91ed000704a201',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/bb92fd8a-3a0b-414a-ab60-2a8bb1bf9514.jpg',
              fullName: 'DAVID GILBERTSON',
              firstName: 'Male',
              communities: [
                '5f07537bc12e0c22d00f5d21',
                '5f22db56a374bc4e80d80a9b',
                '5f0e744536b382377497ecef',
                '5f0753b7c12e0c22d00f5d22'
              ],
              age: 41
            },
            CreatedDate: '2021-02-12T10:29:28.717Z',
            UpdatedDate: '2021-02-12T10:29:43.672Z',
            Answer: [
              {
                _id: '60265888e7965700083c866f',
                PromptId: '5f9c4e7afdfbb52b2c86c997',
                Question: 'What was it like to learn the diagnosis?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'Maecenas volutpat nunc tellus, ac egestas leo mollis eu. Quisque non orci id sapien luctus eleifend vel ut dolor. Vestibulum dictum at nulla id faucibus. Proin eget sapien lorem. ',
                Order: 0,
                CreatedDate: '2021-02-12T10:29:28.717Z',
                UpdatedDate: '2021-02-12T10:29:28.717Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '60265888e7965700083c8671',
                PromptId: '5f9c4fb4fdfbb52b2c86c9ab',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'Donec est quam, tincidunt non orci ut, ornare vulputate nisi. Morbi posuere felis et justo maximus, gravida egestas ***** varius. Suspendisse posuere tellus enim. Donec nec ultrices sapien.',
                Order: 0,
                CreatedDate: '2021-02-12T10:29:28.717Z',
                UpdatedDate: '2021-02-12T10:29:28.717Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'DAve',
            AuthorId: '60094636bb91ed000704a201',
            AuthorAgeWhenStoryBegan: 36,
            Relation: 'Myself',
            FeaturedQuote:
              'This is a retest for CCX-262 story with myself abd age',
            RelationAgeWhenDiagnosed: 36,
            CommunityId: '5f22db56a374bc4e80d80a9b',
            CommunityName: 'Male Breast Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '6026551ee7965700083c8664',
            Author: {
              displayName: 'Lanie1',
              id: '601bb12c782c46861888ab35',
              gender: 'Female',
              genderRoles: {
                GenderPronoun: 'she',
                GenderPronounPossessive: 'her'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/34f70d47-49e3-4376-9841-06aa483c5345.jpg',
              fullName: 'LANIE DAVIS',
              firstName: 'Female',
              communities: [
                '5f189ba00d5f552cf445b8c2',
                '5f369ba97b79ea14f85fb0ec'
              ],
              age: 56
            },
            CreatedDate: '2021-02-12T10:14:54.415Z',
            UpdatedDate: '2021-02-12T12:44:17.277Z',
            Answer: [
              {
                _id: '60265628e7965700083c8668',
                PromptId: null,
                Question: 'Test question',
                QuestionAuthorId: '600a85370d85c00007f16447',
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test reply',
                Order: 0,
                CreatedDate: '2021-02-12T10:19:20.229Z',
                UpdatedDate: '0001-01-01T00:00:00.000Z',
                Type: 'UserQuestion'
              },
              {
                _id: '6026551ee7965700083c8663',
                PromptId: '5f9c4d15fdfbb52b2c86c98c',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test',
                Order: 0,
                CreatedDate: '2021-02-12T10:14:54.415Z',
                UpdatedDate: '2021-02-12T10:14:54.415Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'Lanie',
            AuthorId: '601bb12c782c46861888ab35',
            AuthorAgeWhenStoryBegan: 30,
            Relation: 'Myself',
            FeaturedQuote: 'Test story',
            RelationAgeWhenDiagnosed: 30,
            CommunityId: '5f189ba00d5f552cf445b8c2',
            CommunityName: 'Colorectal Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '6023dd9433000f0007c238c6',
            Author: {
              displayName: null,
              id: '6023dcc933000f0007c238be',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture: null,
              fullName: 'THOMAS STOKES',
              firstName: 'Male',
              communities: ['5f0e744536b382377497ecef'],
              age: 39
            },
            CreatedDate: '2021-02-10T13:20:20.905Z',
            UpdatedDate: '2021-02-10T13:20:30.919Z',
            Answer: [
              {
                _id: '6023dd9433000f0007c238c1',
                PromptId: '5f9c4d0bfdfbb52b2c86c98b',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'LOREM ipsum door sit amet. it seems to just take me to the appropriate story, but does not land me on the portion of the page that has Q&A, but at the top of the story.',
                Order: 0,
                CreatedDate: '2021-02-10T13:20:20.905Z',
                UpdatedDate: '2021-02-10T13:20:20.905Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '6023dd9433000f0007c238c3',
                PromptId: '5f9c4fa7fdfbb52b2c86c9a9',
                Question: 'How did you adjust to your new routine?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'it seems to just take me to the appropriate story, but does not land me on the portion of the page that has Q&A, but at the top of the story.',
                Order: 0,
                CreatedDate: '2021-02-10T13:20:20.905Z',
                UpdatedDate: '2021-02-10T13:20:20.905Z',
                Type: 'PromptQuestion'
              },
              {
                _id: '6023dd9433000f0007c238c5',
                PromptId: '5f9c5216fdfbb52b2c86c9b3',
                Question: 'What happened after that?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'it seems to just take me to the appropriate story, but does not land me on the portion of the page that has Q&A, but at the top of the story.',
                Order: 0,
                CreatedDate: '2021-02-10T13:20:20.905Z',
                UpdatedDate: '2021-02-10T13:20:20.905Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'THOMAS',
            AuthorId: '6023dcc933000f0007c238be',
            AuthorAgeWhenStoryBegan: 42,
            Relation: 'Mother',
            FeaturedQuote: 'What is likely to be a regression issue',
            RelationAgeWhenDiagnosed: 63,
            CommunityId: '5f0e744536b382377497ecef',
            CommunityName: 'Anal Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({ validationResult: true });
    mockStory.getAllStories.mockReturnValue(expRes);
    const data = await ctrl.getAllStories(pageParams);

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving Stories', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: 2 };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'Sort can be 1 or -1'
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({ validationResult: false, reason: 'Sort can be 1 or -1' });
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getAllStories(pageParams);
    expect(res).toEqual(expRes);
  });

  it('Should Return a Story by the ID', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          Id: '5fd21d139b971f0007f87ba9',
          Author: {
            displayName: 'Raja',
            id: '5fcfa0919b971f0007f87b89',
            gender: 'Male',
            genderRoles: {
              GenderPronoun: 'he',
              GenderPronounPossessive: 'his'
            },
            profilePicture: null,
            fullName: 'RAJA BHARATHI',
            firstName: 'Male',
            communities: [
              '5f07537bc12e0c22d00f5d21',
              '5f0753b7c12e0c22d00f5d22',
              '5f22db56a374bc4e80d80a9b',
              '5f245386aa271e24b0c6fd88'
            ],
            age: 50
          },
          CreatedDate: '2020-12-10T13:05:23.006Z',
          UpdatedDate: '2020-12-10T13:05:29.092Z',
          Answer: [
            {
              _id: '5fd21d139b971f0007f87ba8',
              PromptId: '5fae731290745f00078646ae',
              Question: 'Did you have any issues with claims',
              SensitiveContentText: null,
              Response:
                'Nulla mattis bibendum malesuada. Ut euismod felis ut elit sodales, nec lobortis odio tristique. Phasellus in lorem ornare, tempor ante in, volutpat sem. Curabitur posuere eget mauris nec accumsan. Ut et dignissim tortor, vel lacinia libero. Maecenas bibendum ornare est, eu ornare dolor fermentum sit amet. Maecenas sit amet hendrerit enim, at eleifend risus. Curabitur nec facilisis nulla. Nunc posuere eget odio et molestie. Nam eget egestas lacus.',
              Order: 0,
              CreatedDate: '2020-10-11T23:56:00.000Z',
              UpdatedDate: '2020-10-11T23:56:00.000Z',
              Type: 'PromptQuestion'
            }
          ],
          DisplayName: 'RAJA',
          AuthorId: '5fcfa0919b971f0007f87b89',
          AuthorAgeWhenStoryBegan: 43,
          Relation: 'Father',
          FeaturedQuote:
            'His laugh rose and fell and rose again, and I told myself I could love him for that alone.',
          RelationAgeWhenDiagnosed: 69,
          CommunityId: '5f0753b7c12e0c22d00f5d22',
          CommunityName: 'Oral Cancer',
          StoryText: 'Placeholder story text',
          Published: true,
          Removed: false,
          Flagged: true,
          HasStoryBeenPublishedOnce: true
        }
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    RequestContext.getContextItem = mockRequestContext;
    mockStory.getStoryById.mockReturnValue(expRes);
    const data = await ctrl.getStoryById(
      '5fd21d139b971f0007f87ba9',
      false, ''
    );

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving specific story', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidIdDetail
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getStoryById('600ab0cc0d85c00007f16449', false, TranslationLanguage.ENGLISH);
    expect(res).toEqual(expRes);
  });

  it('Should Return all stories for a specific user by ID', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            Id: '5fbf90c8e3f3460007cb347c',
            Author: {
              displayName: 'This is nickN',
              id: '5fbe32a8e3f3460007cb3467',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture: null,
              fullName: 'LIVE TEST',
              firstName: 'Male',
              communities: [
                '5f0753f6c12e0c22d00f5d23',
                '5f369ba97b79ea14f85fb0ec',
                '5f0753b7c12e0c22d00f5d22'
              ],
              age: 64
            },
            CreatedDate: '2020-11-26T11:26:00.612Z',
            UpdatedDate: '2021-03-08T12:52:14.393Z',
            Answer: [
              {
                _id: '5fbf90c8e3f3460007cb347b',
                PromptId: '5fae731290745f00078646ae',
                Question: 'Did you have any issues with claims',
                SensitiveContentText: null,
                Response: 'Nice',
                Order: 0,
                CreatedDate: '2020-11-26T05:56:00.000Z',
                UpdatedDate: '2020-11-26T05:56:00.000Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'This is nickN',
            AuthorId: '5fbe32a8e3f3460007cb3467',
            AuthorAgeWhenStoryBegan: 45,
            Relation: 'Myself',
            FeaturedQuote: 'Good',
            RelationAgeWhenDiagnosed: 45,
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            CommunityName: 'Oral Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '5fbf971ce3f3460007cb3480',
            Author: {
              displayName: 'This is nickN',
              id: '5fbe32a8e3f3460007cb3467',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture: null,
              fullName: 'LIVE TEST',
              firstName: 'Male',
              communities: [
                '5f0753f6c12e0c22d00f5d23',
                '5f369ba97b79ea14f85fb0ec',
                '5f0753b7c12e0c22d00f5d22'
              ],
              age: 64
            },
            CreatedDate: '2020-11-26T11:53:00.567Z',
            UpdatedDate: '2021-03-23T14:30:07.021Z',
            Answer: [
              {
                _id: '5fbf971ce3f3460007cb347f',
                PromptId: '5fbba9c6e3f3460007cb3454',
                Question: 'Chemotherapy',
                SensitiveContentText: null,
                Response: 'Good',
                Order: 0,
                CreatedDate: '2020-11-26T06:23:00.000Z',
                UpdatedDate: '2020-11-26T06:23:00.000Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'This is nickN',
            AuthorId: '5fbe32a8e3f3460007cb3467',
            AuthorAgeWhenStoryBegan: 45,
            Relation: 'Myself',
            FeaturedQuote: 'Nice',
            RelationAgeWhenDiagnosed: 45,
            CommunityId: '5f0e744536b382377497ecef',
            CommunityName: 'Anal Cancer',
            StoryText: 'Placeholder story text',
            Published: false,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '5fbf8f62e3f3460007cb3479',
            Author: {
              displayName: 'This is nickN',
              id: '5fbe32a8e3f3460007cb3467',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture: null,
              fullName: 'LIVE TEST',
              firstName: 'Male',
              communities: [
                '5f0753f6c12e0c22d00f5d23',
                '5f369ba97b79ea14f85fb0ec',
                '5f0753b7c12e0c22d00f5d22'
              ],
              age: 64
            },
            CreatedDate: '2020-11-26T11:20:02.633Z',
            UpdatedDate: '2020-11-27T09:13:56.254Z',
            Answer: [
              {
                _id: '5fbf8f62e3f3460007cb3478',
                PromptId: '5fa1784190745f000786469f',
                Question: 'Did you have any issues with claims',
                SensitiveContentText: null,
                Response: 'Yes',
                Order: 0,
                CreatedDate: '2020-11-26T05:50:02.000Z',
                UpdatedDate: '2020-11-26T05:50:02.000Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'This is nickN',
            AuthorId: '5fbe32a8e3f3460007cb3467',
            AuthorAgeWhenStoryBegan: 45,
            Relation: 'Myself',
            FeaturedQuote: 'Good',
            RelationAgeWhenDiagnosed: 45,
            CommunityId: '5f07537bc12e0c22d00f5d21',
            CommunityName: 'Lung Cancer',
            StoryText: 'Placeholder story text',
            Published: false,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    mockStory.getStoryByUserId.mockReturnValue(expRes);
    const data = await ctrl.getStoryByUserId('5fbe32a8e3f3460007cb3467');

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving all stories for a specific user by ID', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidIdDetail
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getStoryByUserId(' ');
    expect(res).toEqual(expRes);
  });

  it('Should Return all stories for a single community', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            Id: '6048af5f3228460007242445',
            Author: {
              displayName: null,
              id: '602fa7234396fa0007b56412',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/e260712f-25ff-4de9-b7a5-88e1f8a70ca1.jpg',
              fullName: 'KEVIN ANDREW',
              firstName: 'Male',
              communities: [
                '5f3d2eef5617cc2e401b8adf',
                '5f189ba00d5f552cf445b8c2',
                '5f245386aa271e24b0c6fd89',
                '5f0e744536b382377497ecef',
                '5f22db56a374bc4e80d80a9b',
                '5f0753f6c12e0c22d00f5d23',
                '5f369ba97b79ea14f85fb0ec',
                '5f0753b7c12e0c22d00f5d22',
                '5f07537bc12e0c22d00f5d21',
                '5f245386aa271e24b0c6fd88'
              ],
              age: 51
            },
            CreatedDate: '2021-03-10T11:37:03.343Z',
            UpdatedDate: '2021-03-10T11:37:24.457Z',
            Answer: [
              {
                _id: '6048af5f3228460007242444',
                PromptId: '5f9c4ceafdfbb52b2c86c988',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test',
                Order: 0,
                CreatedDate: '2021-03-10T11:37:03.343Z',
                UpdatedDate: '2021-03-10T11:37:03.343Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: 'KEVIN',
            AuthorId: '602fa7234396fa0007b56412',
            AuthorAgeWhenStoryBegan: 34,
            Relation: 'Sister',
            FeaturedQuote: 'Test demo PN',
            RelationAgeWhenDiagnosed: 32,
            CommunityId: '5f07537bc12e0c22d00f5d21',
            CommunityName: 'Lung Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          },
          {
            Id: '6048913e3228460007242438',
            Author: {
              displayName: null,
              id: '60477f3e3228460007242422',
              gender: 'Male',
              genderRoles: {
                GenderPronoun: 'he',
                GenderPronounPossessive: 'his'
              },
              profilePicture: null,
              fullName: 'KING LIAM',
              firstName: 'Male',
              communities: [
                '5f0e744536b382377497ecef',
                '5f0753f6c12e0c22d00f5d23',
                '5f07537bc12e0c22d00f5d21',
                '5f245386aa271e24b0c6fd89',
                '5f245386aa271e24b0c6fd88'
              ],
              age: 41
            },
            CreatedDate: '2021-03-10T09:28:30.594Z',
            UpdatedDate: '2021-03-10T11:54:55.733Z',
            Answer: [
              {
                _id: '6048b38f3228460007242449',
                PromptId: null,
                Question: 'How are you doing \n',
                QuestionAuthorId: '5f99844130b711000703cd74',
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response: 'Test Answer',
                Order: 0,
                CreatedDate: '2021-03-10T11:54:55.733Z',
                UpdatedDate: '0001-01-01T00:00:00.000Z',
                Type: 'UserQuestion'
              },
              {
                _id: '6048913e3228460007242437',
                PromptId: '5f9c4ceafdfbb52b2c86c988',
                Question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                QuestionAuthorId: null,
                QuestionAuthorFirstName: null,
                QuestionAuthorDisplayName: null,
                QuestionAuthorProfilePicture: null,
                SensitiveContentText: null,
                Response:
                  'What is Appium?\nAPPIUM is a freely distributed open source mobile application UI Testing framework. Appium allows native, hybrid and web application testing and supports automation test on physical devices as well as an emulator or simulator both. ',
                Order: 0,
                CreatedDate: '2021-03-10T09:28:30.594Z',
                UpdatedDate: '2021-03-10T11:48:30.961Z',
                Type: 'PromptQuestion'
              }
            ],
            DisplayName: '',
            AuthorId: '60477f3e3228460007242422',
            AuthorAgeWhenStoryBegan: 34,
            Relation: 'Myself',
            FeaturedQuote: 'Leave community and check fro Push Notification',
            RelationAgeWhenDiagnosed: 34,
            CommunityId: '5f07537bc12e0c22d00f5d21',
            CommunityName: 'Lung Cancer',
            StoryText: 'Placeholder story text',
            Published: true,
            Removed: false,
            Flagged: false,
            HasStoryBeenPublishedOnce: true
          }
        ]
      }
    };
    const pageParams = { pageNumber: 1, pageSize: 2, sort: -1 };
    mockValidation.isHex.mockReturnValue(true);
    RequestContext.getContextItem = mockRequestContext;
    mockStory.getByCommunity.mockReturnValue(expRes);
    const data = await ctrl.getByCommunity(
      '5f07537bc12e0c22d00f5d21',
      pageParams.pageNumber, pageParams.pageSize, pageParams.sort
    );

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving all stories for a single community', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidIdDetail
          }
        ]
      }
    };
    const pageParams = { pageNumber: 1, pageSize: 2, sort: -1 };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.getByCommunity(
      ' ', pageParams.pageNumber, pageParams.pageSize, pageParams.sort
    );
    expect(res).toEqual(expRes);
  });

  it('Should add answer to prompt and return story', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          author: {
            displayName: 'IamGAJones',
            id: '5f99844130b711000703cd74',
            gender: 'Male',
            genderRoles: {
              genderPronoun: 'he',
              genderPronounPossessive: 'his'
            },
            profilePicture:
              'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6e014d87-b83f-4f13-b7f2-cdb956bf8e08.jpg',
            fullName: 'George JONES',
            firstName: 'Male',
            communities: [
              '5f07537bc12e0c22d00f5d21',
              '5f189ba00d5f552cf445b8c2',
              '5f0753b7c12e0c22d00f5d22',
              '5f0753f6c12e0c22d00f5d23',
              '5f0e744536b382377497ecef',
              '5f369ba97b79ea14f85fb0ec',
              '5f22db56a374bc4e80d80a9b',
              '5f3d2eef5617cc2e401b8adf',
              '5f245386aa271e24b0c6fd89',
              '5f245386aa271e24b0c6fd88',
              '607e7c99d0a2b533bb2ae3d2'
            ],
            age: 42
          },
          createdAt: '2020-11-26T13:10:37.259Z',
          updatedDate: '2021-04-15T11:38:13.214Z',
          answer: [
            {
              id: '60911bd6a151292c1d5f4dce',
              response: 'Random checkers',
              question:
                'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
              sensitiveContentText: '',
              createdDate: '2021-05-04T10:03:02.178Z',
              order: 0,
              type: '1'
            },
            {
              id: '5fbfa94de3f3460007cb348c',
              promptId: '5fbba9c6e3f3460007cb3454',
              question: 'Chemotherapy',
              questionAuthorId: null,
              questionAuthorFirstName: null,
              questionAuthorDisplayName: null,
              questionAuthorProfilePicture: null,
              sensitiveContentText: null,
              response: 'Goo',
              order: 0,
              createdDate: '2020-11-26T07:40:37.000Z',
              updatedDate: '2021-04-15T11:38:13.214Z',
              type: 'PromptQuestion'
            }
          ],
          displayName: 'IamGAJones',
          authorId: '5f99844130b711000703cd74',
          authorAgeWhenStoryBegan: 45,
          relation: 'Myself',
          featuredQuote: 'Nice',
          relationAgeWhenDiagnosed: 45,
          communityId: '5f189ba00d5f552cf445b8c2',
          communityName: 'Colorectal Cancer',
          storyText: 'Placeholder story text',
          published: false,
          removed: false,
          flagged: false,
          hasStoryBeenPublishedOnce: true
        }
      }
    };
    const model = {
      StoryId: '5fbfa94de3f3460007cb348d',
      PromptId: '5f9c4d15fdfbb52b2c86c98c',
      CurrentUserId: '5f99844130b711000703cd74',
      Answer: 'Random checkers',
      IsPromptAnswerProfane: false,
      languageData: TranslationLanguage.ENGLISH
    };
    mockValidation.isValidPromptAnswerModel.mockReturnValue({ validationResult: true });
    mockStory.createAnswersForPrompt.mockReturnValue(expRes);
    const data = await ctrl.createAnswersForPrompt(model);

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while Creating Answers for Prompts when COMMUNITY ID MISMATCH', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'b6bca2d1-c75b-ba0a-cdaa-d153e0ecdac8',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Prompts CommunityId and Storys CommunityId must be same'
          }
        ]
      }
    };
    const model = {
      StoryId: '5fbfa94de3f3460007cb348d',
      PromptId: '5f9c4ceafdfbb52b2c86c988',
      CurrentUserId: '5f99844130b711000703cd74',
      Answer: 'Random checkers',
      IsPromptAnswerProfane: false,
      langaugeData: TranslationLanguage.ENGLISH
    };
    mockValidation.isValidPromptAnswerModel.mockReturnValue({ validationResult: false, reason: 'Prompts CommunityId and Storys CommunityId must be same' });
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.createAnswersForPrompt(model);

    expect(data).toEqual(expRes);
  });

  it('Should update story and return with success response', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          author: {
            displayName: 'IamGAJones',
            id: '5f99844130b711000703cd74',
            gender: 'Male',
            genderRoles: {
              genderPronoun: 'he',
              genderPronounPossessive: 'his'
            },
            profilePicture:
              'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6e014d87-b83f-4f13-b7f2-cdb956bf8e08.jpg',
            fullName: 'George JONES',
            firstName: 'Male',
            communities: [
              '5f07537bc12e0c22d00f5d21',
              '5f189ba00d5f552cf445b8c2',
              '5f0753b7c12e0c22d00f5d22',
              '5f0753f6c12e0c22d00f5d23',
              '5f0e744536b382377497ecef',
              '5f369ba97b79ea14f85fb0ec',
              '5f22db56a374bc4e80d80a9b',
              '5f3d2eef5617cc2e401b8adf',
              '5f245386aa271e24b0c6fd89',
              '5f245386aa271e24b0c6fd88',
              '607e7c99d0a2b533bb2ae3d2'
            ],
            age: 42
          },
          createdAt: '2020-11-03T14:31:25.287Z',
          updatedDate: '2021-05-07T11:35:52.268Z',
          answer: [
            {
              id: '5fa169bd90745f000786469d',
              promptId: '5f9c4d51fdfbb52b2c86c990',
              question: 'Was it difficult',
              sensitiveContentText: '',
              response: 'random texting',
              order: 0,
              type: 'PromptQuestion',
              createdDate: '11/03/2020 14:31:25',
              updatedDate: '2021-05-07T11:35:52.268Z'
            },
            {
              id: '60952618170b2c3188043b11',
              promptId: '5f9c4d51fdfbb52b2c86c990',
              question: 'Describe the Cheotherapy',
              sensitiveContentText: 'Very sensitive',
              response: 'random texting',
              order: 0,
              type: 'PromptQuestion',
              createdDate: '',
              updatedDate: '2021-05-07T11:35:52.268Z'
            }
          ],
          displayName: 'QA Jones',
          authorId: '5f99844130b711000703cd74',
          authorAgeWhenStoryBegan: 29,
          relation: 'uncle',
          featuredQuote: 'random texting',
          relationAgeWhenDiagnosed: 45,
          communityId: '5f245386aa271e24b0c6fd88',
          communityName: 'Prostate Cancer',
          storyText: 'random texting',
          published: false,
          removed: false,
          flagged: false,
          hasStoryBeenPublishedOnce: true
        }
      }
    };
    const model = {
      id: '5fa169bd90745f000786469e',
      authorId: '5f99844130b711000703cd74',
      authorAgeWhenStoryBegan: 29,
      relation: 'uncle',
      displayName: 'QA Jones',
      relationAgeWhenDiagnosed: 45,
      featuredQuote: 'random texting',
      answers: [
        {
          id: '5fa169bd90745f000786469d',
          promptId: '5f9c4d51fdfbb52b2c86c990',
          question: 'Was it difficult',
          sensitiveContentText: '',
          response: 'random texting',
          order: 0,
          createdDate: '11/03/2020 14:31:25',
          updatedDate: '11/03/2020 14:31:25',
          type: 'PromptQuestion'
        },
        {
          id: '',
          promptId: '5f9c4d51fdfbb52b2c86c990',
          question: 'Describe the Cheotherapy',
          sensitiveContentText: 'Very sensitive',
          response: 'random texting',
          order: '1',
          type: 'PromptQuestion',
          createdDate: ''
        }
      ],
      storyText: 'random texting',
      communityId: '5f245386aa271e24b0c6fd88'
    };
    mockValidation.isValidStoryModel.mockReturnValue({ validationResult: true });
    RequestContext.getContextItem = mockRequestContext;
    mockStory.updateStory.mockReturnValue(expRes);
    const data = await ctrl.updateStory(model);

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while updating when INVALID STORY ID IS FOUND', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: 'Incorrect model',
          detail: 'StoryID incorrect, this value is required'
        }
      }
    };
    const model = {
      id: '',
      authorId: '5f99844130b711000703cd74',
      authorAgeWhenStoryBegan: 29,
      relation: 'uncle',
      displayName: 'QA Jones',
      relationAgeWhenDiagnosed: 45,
      featuredQuote: 'random texting',
      answers: [
        {
          id: '5fa169bd90745f000786469d',
          promptId: '5f9c4d51fdfbb52b2c86c990',
          question: 'Was it difficult',
          sensitiveContentText: '',
          response: 'random texting',
          order: 0,
          createdDate: '11/03/2020 14:31:25',
          updatedDate: '11/03/2020 14:31:25',
          type: 'PromptQuestion'
        },
        {
          id: '',
          promptId: '5f9c4d51fdfbb52b2c86c990',
          question: 'Describe the Cheotherapy',
          sensitiveContentText: 'Very sensitive',
          response: 'random texting',
          order: '1',
          type: 'PromptQuestion',
          createdDate: ''
        }
      ],
      storyText: 'random texting',
      communityId: '5f245386aa271e24b0c6fd88'
    };
    mockValidation.isValidStoryModel.mockReturnValue({ validationResult: false, reason: 'StoryID incorrect, this value is required' });
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.updateStory(model);

    expect(res).toEqual(expRes);
  });

  it('Should Return Error when user is not acive', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: 'User not active',
          detail: 'This user is not active and has read only access'
        }
      }
    };
    const model = {
      id: '5fa169bd90745f000786469e',
      authorId: '5f99844130b711000703cd74',
      authorAgeWhenStoryBegan: 200,
      relation: 'uncle',
      displayName: 'QA Jones',
      relationAgeWhenDiagnosed: 45,
      featuredQuote: 'random texting',
      answers: [
        {
          id: '5fa169bd90745f000786469d',
          promptId: '5f9c4d51fdfbb52b2c86c990',
          question: 'Was it difficult',
          sensitiveContentText: '',
          response: 'random texting',
          order: 0,
          createdDate: '11/03/2020 14:31:25',
          updatedDate: '11/03/2020 14:31:25',
          type: 'PromptQuestion'
        },
        {
          id: '',
          promptId: '5f9c4d51fdfbb52b2c86c990',
          question: 'Describe the Cheotherapy',
          sensitiveContentText: 'Very sensitive',
          response: 'random texting',
          order: '1',
          type: 'PromptQuestion',
          createdDate: ''
        }
      ],
      storyText: 'random texting',
      communityId: '5f245386aa271e24b0c6fd88'
    };
    mockValidation.isValidStoryModel.mockReturnValue({ validationResult: true });
    mockResult.createError.mockReturnValue(expRes);
    RequestContext.getContextItem = jest.fn().mockReturnValue("{\"name\":\"~SIT3SBB000008AB\",\"id\":\"61604cdd33b45d0023d0db61\",\"firstName\":\"PHOEBE\",\"lastName\":\"STINSON\",\"active\":false,\"isDevLogin\":\"true\",\"iat\":1642001503,\"exp\":1642030303,\"sub\":\"~SIT3SBB000008AB\",\"jti\":\"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019\"}");
    const data = await ctrl.updateStory(model);

    expect(data).toEqual(expRes);
  });

  it('Should Return story based on community id and user id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: '5fbe41b8e3f3460007cb346c',
            author: {
              displayName: 'IamGAJones',
              id: '5f99844130b711000703cd74',
              gender: 'Male',
              genderRoles: {
                genderPronoun: 'he',
                genderPronounPossessive: 'his'
              },
              profilePicture:
                'http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6e014d87-b83f-4f13-b7f2-cdb956bf8e08.jpg',
              fullName: 'George JONES',
              firstName: 'Male',
              communities: [
                '5f189ba00d5f552cf445b8c2',
                '5f22db56a374bc4e80d80a9b',
                '5f0e744536b382377497ecef',
                '5f0753f6c12e0c22d00f5d23',
                '5f245386aa271e24b0c6fd89',
                '5f0753b7c12e0c22d00f5d22',
                '5f369ba97b79ea14f85fb0ec',
                '5f3d2eef5617cc2e401b8adf',
                '5f245386aa271e24b0c6fd88',
                '607e7c99d0a2b533bb2ae3d2',
                '5f07537bc12e0c22d00f5d21'
              ],
              age: 42
            },
            createdAt: '2020-11-25T11:36:24.827Z',
            updatedDate: '2021-05-11T10:32:12.918Z',
            answer: [
              {
                id: '6098f41aef1ff90007bba667',
                promptId: '5f9c4cfafdfbb52b2c86c989',
                question:
                  'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: '',
                response: '1',
                order: 0,
                createdDate: '2021-05-10T08:51:38.491Z',
                updatedDate: '2021-05-11T10:32:11.733Z',
                type: 'PromptQuestion'
              },
              {
                id: '6098f41aef1ff90007bba666',
                promptId: '5f9c4f99fdfbb52b2c86c9a7',
                question: 'How did you adjust to your new routine?',
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: '',
                response: '5',
                order: 0,
                createdDate: '2021-05-10T08:51:38.484Z',
                updatedDate: '2021-05-11T10:32:11.733Z',
                type: 'PromptQuestion'
              },
              {
                id: '6098f41aef1ff90007bba665',
                promptId: '5f9c520afdfbb52b2c86c9b1',
                question: 'What happened after that?',
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText:
                  "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
                response: '6',
                order: 0,
                createdDate: '2021-05-10T08:51:38.484Z',
                updatedDate: '2021-05-11T10:32:11.733Z',
                type: 'PromptQuestion'
              },
              {
                id: '6098f26aef1ff90007bba662',
                promptId: '5f9c4f0afdfbb52b2c86c99d',
                question: 'How did you decide what to do?',
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: '',
                response: '3',
                order: 0,
                createdDate: '2021-05-10T08:44:26.430Z',
                updatedDate: '2021-05-11T10:32:11.733Z',
                type: 'PromptQuestion'
              },
              {
                id: '6098ef92ef1ff90007bba660',
                promptId: '5f9c4e61fdfbb52b2c86c993',
                question: 'What was it like to learn the diagnosis?',
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: '',
                response: '2',
                order: 0,
                createdDate: '2021-05-10T08:32:18.741Z',
                updatedDate: '2021-05-11T10:32:11.733Z',
                type: 'PromptQuestion'
              }
            ],
            displayName: 'IamGAJones',
            authorId: '5f99844130b711000703cd74',
            authorAgeWhenStoryBegan: 32,
            relation: 'Grandfather',
            featuredQuote:
              "Something1. User can click on 'Read All Stories' button in featured stories screen to view a **** 77",
            relationAgeWhenDiagnosed: 32,
            communityId: '5f0753b7c12e0c22d00f5d22',
            communityName: 'Oral Cancer',
            storyText: 'Placeholder story text',
            published: true,
            removed: false,
            flagged: false,
            hasStoryBeenPublishedOnce: true
          }
        ]
      }
    };
    const pageParams = { pageNumber: 1, pageSize: 2, sort: -1 };
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValue(true);
    mockStory.getByCommunityAndStoryAuthor.mockReturnValue(expRes);
    const data = await ctrl.getByCommunityAndStoryAuthor(
      '5f0753b7c12e0c22d00f5d22',
      '5f99844130b711000703cd74',
      pageParams.pageNumber, pageParams.pageSize, pageParams.sort
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return error for invalid Id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: 'Incorrect id',
          detail: 'This is not a valid id'
        }
      }
    };
    const pageParams = { pageNumber: 1, pageSize: 2, sort: -1 };
    mockValidation.isHex.mockReturnValueOnce(false).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getByCommunityAndStoryAuthor(
      '',
      '',
      pageParams.pageNumber, pageParams.pageSize, pageParams.sort
    );
    expect(data).toEqual(expRes);
  });

  it('Should return success response while publishing a story', async () => {
    const expRes = {
      data: { isSuccess: true, isException: false, value: { operation: true } }
    };

    mockValidation.isHex.mockReturnValue(true);
    RequestContext.getContextItem = mockRequestContext;
    mockStory.setPublished.mockReturnValue(expRes);
    const response = await ctrl.setPublished(
      '60097b89bb91ed000704a22d',
      true
    );

    expect(response).toEqual(expRes);
  });

  it('Should return error response while publishing a story', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const response = await ctrl.setPublished(
      '60097b89bb91ed000704a22d',
      false
    );
    expect(response).toEqual(expRes);
  });

  it('Should remove the prompt from the story based on promptId', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          author: {
            id: '5fc4e899e3f3460007cb34a3',
            profilePicture:
              'https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Users/ProfileImage/496f385f-01aa-42d8-8316-505aeb738d19.jpg',
            displayName: 'BOSS BABY',
            fullName: 'Darla Karla',
            firstName: 'Darla',
            gender: 'male',
            age: 40,
            genderRoles: {
              genderPronoun: 'he',
              genderPronounPossessive: 'his'
            },
            communities: []
          },
          communityName: 'Metastatic or Recurrent Breast Cancer',
          id: '600193e33a36e60008a0ebb3',
          communityId: '5f369ba97b79ea14f85fb0ec',
          authorId: '5fc4e899e3f3460007cb34a3',
          authorAgeWhenStoryBegan: 25,
          relation: 'Myself',
          displayName: 'BOSS BABY',
          relationAgeWhenDiagnosed: 25,
          featuredQuote:
            '“You are braver than you believe, stronger than you seem, smarter than you think, and twice as beaut',
          answer: [
            {
              id: '6006aa22c67c8b0007a00aac',
              question: 'How do  u track ****',
              response: 'By  killing it',
              order: 0,
              createdDate: '2021-01-19T09:45:06.319Z',
              updatedDate: '2021-01-19T17:19:08.481Z',
              type: 'UserQuestion'
            },
            {
              id: '6006a611c67c8b0007a00aa9',
              question: 'how the **** did you survive man',
              response: 'Life is a roller coaster',
              order: 0,
              createdDate: '2021-01-19T09:27:45.148Z',
              updatedDate: '2021-01-19T17:19:08.481Z',
              type: 'UserQuestion'
            },
            {
              id: '600193e33a36e60008a0ebac',
              promptId: '5f9c4d43fdfbb52b2c86c98e',
              question:
                'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
              response:
                'As a cancerous tumor grows, the bloodstream or lymphatic system may carry cancer cells to other parts of the body. During this process, the cancer cells grow and may develop into new tumors.',
              order: 0,
              createdDate: '2021-01-15T13:08:51.001Z',
              updatedDate: '2021-01-19T17:19:08.481Z',
              type: 'PromptQuestion'
            }
          ],
          storyText: 'Placeholder story text',
          createdAt: '2021-01-15T13:08:51.002Z',
          updatedDate: '2021-06-03T12:26:55.483Z',
          published: false,
          flagged: false,
          removed: false,
          hasStoryBeenPublishedOnce: true
        }
      }
    };

    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValue(true);
    RequestContext.getContextItem = mockRequestContext;
    mockStory.removePromptFromStory.mockReturnValue(expRes);
    const response = await ctrl.removePrompt(
      '5fc4e899e3f3460007cb34a3',
      '600193e33a36e60008a0ebb3'
    );
    expect(response).toEqual(expRes);
  });

  it('removePrompt - Should return an error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: API_RESPONSE.messages.badModelTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.isHex.mockReturnValueOnce(false).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const response = await ctrl.removePrompt(
      'invalid',
      'invalid'
    );
    expect(response).toEqual(expRes);
  });

  it('Should return success response while set a Flag for Story', async () => {
    const expRes = {
      data: { isSuccess: true, isException: false, value: { operation: true } }
    };

    mockValidation.isHex.mockReturnValue(true);
    mockStory.flagStory.mockReturnValue(expRes);
    const response = await ctrl.flagStory('5fc9fe96e3f3460007cb34f3');

    expect(response).toEqual(expRes);
  });

  it('removePrompt - Should return an error', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: API_RESPONSE.messages.invalidIdTitle,
          detail: API_RESPONSE.messages.invalidIdDetail
        }
      }
    };

    mockValidation.isHex.mockReturnValueOnce(false).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const response = await ctrl.flagStory('5fc9fe96e3f3460007cb34f3');
    expect(response).toEqual(expRes);
  });

  it('Should create a Story', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '60c73cbaab98d530201408cb',
          author: {
            displayName: null,
            id: '5fe9e13017c68a0007446a32',
            gender: 'Male',
            genderRoles: {
              genderPronoun: 'he',
              genderPronounPossessive: 'his'
            },
            profilePicture: null,
            fullName: 'RICHARD RICO',
            firstName: 'RICHARD',
            communities: [
              '5f07537bc12e0c22d00f5d21',
              '5f0753b7c12e0c22d00f5d22',
              '5f3d2eef5617cc2e401b8adf',
              '5f0e744536b382377497ecef',
              '5f245386aa271e24b0c6fd88',
              '5f369ba97b79ea14f85fb0ec',
              '5f22db56a374bc4e80d80a9b',
              '5f0753f6c12e0c22d00f5d23',
              '5f189ba00d5f552cf445b8c2',
              '607e7c99d0a2b533bb2ae3d2'
            ],
            age: 70
          },
          createdAt: '2021-06-14T11:25:46.854Z',
          updatedDate: '2021-06-14T11:25:46.854Z',
          answer: [
            {
              id: '60c73cbaab98d530201408ca',
              promptId: '5f9c4d39fdfbb52b2c86c98d',
              question:
                'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
              sensitiveContentText: 'string',
              response: 'Hello1',
              order: 0,
              type: 'PromptQuestion',
              createdDate: '2021-06-14T11:25:46.854Z',
              updatedDate: '2021-06-14T11:25:46.854Z'
            }
          ],
          displayName: 'RICHARD',
          authorId: '5fe9e13017c68a0007446a32',
          authorAgeWhenStoryBegan: 34,
          relation: 'Myself',
          featuredQuote: 'Story123',
          relationAgeWhenDiagnosed: 30,
          communityId: '5f22db56a374bc4e80d80a9b',
          communityName: 'Male Breast Cancer',
          storyText: 'cancer',
          published: false
        }
      }
    };

    const data = {
      id: '5f9c4d39fdfbb52b2c86c98d',
      answers: [
        {
          id: '5f9c4d39fdfbb52b2c86c98d',
          promptId: '5f9c4d39fdfbb52b2c86c98d',
          response: 'Hello1',
          question:
            'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
          sensitiveContentText: 'string',
          order: null,
          type: 'string',
          createdDate: new Date(),
          isResponseProfane: true
        }
      ],
      authorAgeWhenStoryBegan: 34,
      authorId: '5fe9e13017c68a0007446a32',
      communityId: '5f22db56a374bc4e80d80a9b',
      displayName: 'RICHARD',
      featuredQuote: 'Story123',
      relation: 'Myself',
      relationAgeWhenDiagnosed: 30,
      storyText: 'cancer',
      isFeatureQuoteProfane: false,
      isStoryTextProfane: false
    };
    mockValidation.isValidStoryModel.mockReturnValue({validationResult:true});
    RequestContext.getContextItem = mockRequestContext;
    mockStory.create.mockReturnValue(expRes);
    const response = await ctrl.create(data, false);
    expect(response).toEqual(expRes);
  });

  it('Should create a Story - Invalid story model', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: API_RESPONSE.messages.badData,
          detail: 'AuthorID incorrect, this value is required'
        }
      }
    };

    const data = {
      id: '5f9c4d39fdfbb52b2c86c98d',
      answers: [
        {
          id: '5f9c4d39fdfbb52b2c86c98d',
          promptId: '5f9c4d39fdfbb52b2c86c98d',
          response: 'Hello1',
          question:
            'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
          sensitiveContentText: 'string',
          order: null,
          type: 'string',
          createdDate: new Date(),
          isResponseProfane: true
        }
      ],
      authorAgeWhenStoryBegan: 34,
      authorId: '5fe9e13017c68a0007446a32',
      communityId: '5f22db56a374bc4e80d80a9b',
      displayName: 'RICHARD',
      featuredQuote: 'Story123',
      relation: 'Myself',
      relationAgeWhenDiagnosed: 30,
      storyText: 'cancer',
      isFeatureQuoteProfane: false,
      isStoryTextProfane: false
    };
    mockValidation.isValidStoryModel.mockReturnValue({validationResult:false, reason: 'AuthorID incorrect, this value is required'});
    mockResult.createError.mockReturnValue(expRes);
    const response = await ctrl.create(data, true);
    expect(response).toEqual(expRes);
  });

  it('Should create a Story - Inactive User', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: '0e3bcda6-6d60-740a-e1de-0d4da3646666',
          errorCode: 400,
          title: API_RESPONSE.messages.userNotActiveTitle,
          detail: API_RESPONSE.messages.userNotActiveMessage
        }
      }
    };

    const data = {
      id: '5f9c4d39fdfbb52b2c86c98d',
      answers: [
        {
          id: '5f9c4d39fdfbb52b2c86c98d',
          promptId: '5f9c4d39fdfbb52b2c86c98d',
          response: 'Hello1',
          question:
            'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
          sensitiveContentText: 'string',
          order: null,
          type: 'string',
          createdDate: new Date(),
          isResponseProfane: true
        }
      ],
      authorAgeWhenStoryBegan: 34,
      authorId: '5fe9e13017c68a0007446a32',
      communityId: '5f22db56a374bc4e80d80a9b',
      displayName: 'RICHARD',
      featuredQuote: 'Story123',
      relation: 'Myself',
      relationAgeWhenDiagnosed: 30,
      storyText: 'cancer',
      isFeatureQuoteProfane: false,
      isStoryTextProfane: false
    };
    mockValidation.isValidStoryModel.mockReturnValue({ validationResult: true });
    RequestContext.getContextItem = jest.fn().mockReturnValue("{\"name\":\"~SIT3SBB000008AB\",\"id\":\"61604cdd33b45d0023d0db61\",\"firstName\":\"PHOEBE\",\"lastName\":\"STINSON\",\"active\":false,\"isDevLogin\":\"true\",\"iat\":1642001503,\"exp\":1642030303,\"sub\":\"~SIT3SBB000008AB\",\"jti\":\"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019\"}");
    mockResult.createError.mockReturnValue(expRes);
    const response = await ctrl.create(data, true);
    expect(response).toEqual(expRes);
  });

  it('UpsertComment - Valid Parameters - Create a comment', async () => {
    const successMsg = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: 'Test  Comments - for',
          createdAt: '2022-01-12T09:47:11.310Z',
          updatedAt: '2022-01-12T09:47:11.310Z',
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: '61604cdd33b45d0023d0db61',
            firstName: 'PHOEBE',
            lastName: 'STINSON',
            displayName: 'Phoebe '
          },
          id: '61dea39f735a68397ff34a0a'
        }
      }
    };
    const payload: CommentRequest = {
      postId: '',
      comment: 'Test  Comments - for',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: false
    });

    mockStory.upsertComment.mockReturnValue(successMsg);
    const data = await mockStory.upsertComment(
      payload,
      '61715d5de55bbf001ddbf8c6'
    );
    expect(data).toEqual(successMsg);
  });

  it('removeComment - story id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteStoryCommentRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.removeComment(payload);
    expect(res).toEqual(expRes);
  });

  it('RemoveComment - reply id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteStoryCommentRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID'
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.removeComment(payload);
    expect(res).toEqual(expRes);
  });

  it('RemoveComment - delete comment successfully', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload: DeleteStoryCommentRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID'
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockCommentService.removeComment.mockReturnValue(expRes);
    const res = await ctrl.removeComment(payload);
    expect(res).toEqual(expRes);
  });

  it('upsertReply - add new reply', async () => {
    const payload: StoryReplyRequest = {
      id: undefined,
      storyId: storyId,
      commentId: 'commentId',
      comment: 'Test comment',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: "Test comment",
          createdAt: "2022-03-24T11:17:40.653Z",
          updatedAt: "2022-03-24T11:17:40.653Z",
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: "61af64ad583c599ddb4f1bed",
            firstName: "GA",
            lastName: "JONES",
            displayName: "Nonsense"
          },
          id: "623c535401607f0214f68e2c"
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({ moderationFlag: false });
    mockStory.upsertReply.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('upsertReply - add new reply', async () => {
    const payload: StoryReplyRequest = {
      id: undefined,
      storyId: storyId,
      commentId: 'commentId',
      comment: 'Test comment',
      isCommentTextProfane: false
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: "replying",
          createdAt: "2022-03-24T11:17:40.653Z",
          updatedAt: "2022-03-24T11:17:40.653Z",
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: "61af64ad583c599ddb4f1bed",
            firstName: "GA",
            lastName: "JONES",
            displayName: "Nonsense"
          },
          id: "623c535401607f0214f68e2c"
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({ moderationFlag: false });
    mockStory.upsertReply.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - story id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: StoryReplyRequest = {
      id: undefined,
      storyId: storyId,
      commentId: 'commentId',
      comment: 'Test comment',
      isCommentTextProfane: false
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - reply null check', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Bad data",
          detail: "Comment cannot be empty"
        }
      }
    };
    const payload: StoryReplyRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      comment: null,
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertReply - reply is moderated', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        message: 'CommentModerationError',
        value:
        {
          storyId: storyId,
          comment: 'profaneContent',
          isCommentTextProfane: true
        }
      }
    };
    const payload: StoryReplyRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      comment: 'profaneContent',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: true
    });
    mockResult.createExceptionWithValue.mockReturnValue(expRes);
    const res = await ctrl.upsertReply(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - Valid Parameters - Create a comment', async () => {
    const successMsg = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          comment: 'Test  Comments - for',
          createdAt: '2022-01-12T09:47:11.310Z',
          updatedAt: '2022-01-12T09:47:11.310Z',
          flagged: false,
          removed: false,
          isCommentTextProfane: false,
          author: {
            id: '61604cdd33b45d0023d0db61',
            firstName: 'PHOEBE',
            lastName: 'STINSON',
            displayName: 'Phoebe '
          },
          id: '61dea39f735a68397ff34a0a'
        }
      }
    };
    const payload: StoryCommentRequest = {
      storyId: storyId,
      comment: 'Test  Comments - for',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: false
    });

    mockStory.upsertComment.mockReturnValue(successMsg);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(successMsg);
  });

  it('UpsertComment - Valid Parameters - Edit a comment', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload: StoryCommentRequest = {
      storyId: storyId,
      comment: 'Test  Comments - for',
      id: '61dea39f735a68397ff34a0a',
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: false
    });
    mockStory.upsertComment.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - post id not hex string', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: StoryCommentRequest = {
      storyId: storyId,
      comment: 'Test  Comments - for',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - comment null check', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Bad data",
          detail: "Comment cannot be empty"
        }
      }
    };
    const payload: StoryCommentRequest = {
      storyId: storyId,
      comment: null,
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('UpsertComment - comment is moderated', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        message: 'CommentModerationError',
        value:
        {
          storyId: storyId,
          comment: 'profaneContent',
          isCommentTextProfane: true
        }
      }
    };
    const payload: StoryCommentRequest = {
      storyId: storyId,
      comment: 'profaneContent',
      id: undefined,
      isCommentTextProfane: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.moderatePostCommentModelContent.mockReturnValue({
      commentModel: payload, moderationFlag: true
    });
    mockResult.createExceptionWithValue.mockReturnValue(expRes);
    const res = await ctrl.upsertComment(payload);
    expect(res).toEqual(expRes);
  });

  it('FlagComment - comment incorrect id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteStoryCommentRequest = {
      storyId: storyId,
      commentId: "commentId",
      replyId: "replyId"
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.flagComment(payload);
    expect(res).toEqual(expRes);
  });

  it('FlagComment - reply incorrect id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: DeleteStoryCommentRequest = {
      storyId: storyId,
      commentId: "commentId",
      replyId: "replyId"
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValueOnce(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.flagComment(payload);
    expect(res).toEqual(expRes);
  });

  it('FlagComment - flag comment successfully', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          operation: true
        }
      }
    };
    const payload: DeleteStoryCommentRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: undefined
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true);
    mockCommentService.flagComment.mockReturnValue(expRes);
    const res = await ctrl.flagComment(payload);
    expect(res).toEqual(expRes);
  });

  it('upsertReaction - react successfully', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
      }
    };
    const payload: StoryReactionRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID',
      reaction: 'like',
      type: 'reply',
      language: TranslationLanguage.ENGLISH
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(true);
    mockStory.upsertReaction.mockReturnValue(expRes);
    const res = await ctrl.upsertReaction(payload);
    expect(res).toEqual(expRes);
  });

  it('upsertReaction - invalid story id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        errors:
        {
          id: "2d8a018e-e02c-a5f4-029a-00579b754b2c",
          errorCode: 403,
          title: "Incorrect id",
          detail: "This is not a valid id"
        }
      }
    };
    const payload: StoryReactionRequest = {
      storyId: storyId,
      commentId: '61dea39f735a68397ff34a0a',
      replyId: 'replyID',
      reaction: 'like',
      type: 'reply',
      language: TranslationLanguage.ENGLISH
    };

    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const res = await ctrl.upsertReaction(payload);
    expect(res).toEqual(expRes);
  });

  describe('deleteStoryById', () => {
    it('shoucld return success', async () => {
      mockValidation.isHex.mockReturnValue(true);
      RequestContext.getContextItem = mockRequestContext;
      await ctrl.deleteStoryById('61ee6acdc7422a3a7f484e3c');
      expect(mockStory.deleteStoryById.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      mockValidation.isHex.mockReturnValue(false);
      await ctrl.deleteStoryById('userId');
      expect(mockResult.createError.mock.calls.length).toBe(1);
    });
  });
});
