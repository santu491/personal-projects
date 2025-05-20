import { collections, mongoDbTables } from '@anthem/communityadminapi/common';
import { mockMongo } from '@anthem/communityadminapi/common/baseTest';
import { ObjectID } from 'mongodb';

describe('StoryService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return all stories for a specific user by ID', async () => {
    const expRes = [
      {
        _id: '5fbf90c8e3f3460007cb347c',
        CommunityId: '5f0753b7c12e0c22d00f5d22',
        AuthorId: '5fbe32a8e3f3460007cb3467',
        AuthorAgeWhenStoryBegan: 45,
        Relation: 'Myself',
        DisplayName: 'This is nickN',
        RelationAgeWhenDiagnosed: 45,
        FeaturedQuote: 'Good',
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
        StoryText: 'Placeholder story text',
        CreatedDate: '2020-11-26T11:26:00.612Z',
        UpdatedDate: '2021-03-08T12:52:14.393Z',
        Published: true,
        Flagged: false,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '5fbf971ce3f3460007cb3480',
        CommunityId: '5f0e744536b382377497ecef',
        AuthorId: '5fbe32a8e3f3460007cb3467',
        AuthorAgeWhenStoryBegan: 45,
        Relation: 'Myself',
        DisplayName: 'This is nickN',
        RelationAgeWhenDiagnosed: 45,
        FeaturedQuote: 'Nice',
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
        StoryText: 'Placeholder story text',
        CreatedDate: '2020-11-26T11:53:00.567Z',
        UpdatedDate: '2021-03-23T14:30:07.021Z',
        Published: false,
        Flagged: false,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '5fbf8f62e3f3460007cb3479',
        CommunityId: '5f07537bc12e0c22d00f5d21',
        AuthorId: '5fbe32a8e3f3460007cb3467',
        AuthorAgeWhenStoryBegan: 45,
        Relation: 'Myself',
        DisplayName: 'This is nickN',
        RelationAgeWhenDiagnosed: 45,
        FeaturedQuote: 'Good',
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
        StoryText: 'Placeholder story text',
        CreatedDate: '2020-11-26T11:20:02.633Z',
        UpdatedDate: '2020-11-27T09:13:56.254Z',
        Published: false,
        Flagged: false,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      }
    ];
    const value = {
      [mongoDbTables.story.removed]: false,
      [mongoDbTables.story.authorId]: '5fbe32a8e3f3460007cb3467'
    };
    mockMongo.readAllByValue.mockReturnValue(expRes);
    const resData = await mockMongo.readAllByValue(collections.STORY, value);
    expect(resData).toEqual(expRes);
  });

  it('Should return removed story', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            id: "5fbe41b8e3f3460007cb346c",
            author: {
              displayName: "IamGAJones",
              id: "5f99844130b711000703cd74",
              gender: "Male",
              genderRoles: {
                genderPronoun: "he",
                genderPronounPossessive: "his",
              },
              profilePicture:
                "http://localhost:65418/communitiesapi/v1/v1/api/Users/ProfileImage/6e014d87-b83f-4f13-b7f2-cdb956bf8e08.jpg",
              fullName: "George JONES",
              firstName: "Male",
              communities: [
                "5f189ba00d5f552cf445b8c2",
                "5f22db56a374bc4e80d80a9b",
                "5f0e744536b382377497ecef",
                "5f0753f6c12e0c22d00f5d23",
                "5f245386aa271e24b0c6fd89",
                "5f0753b7c12e0c22d00f5d22",
                "5f369ba97b79ea14f85fb0ec",
                "5f3d2eef5617cc2e401b8adf",
                "5f245386aa271e24b0c6fd88",
                "607e7c99d0a2b533bb2ae3d2",
                "5f07537bc12e0c22d00f5d21",
              ],
              age: 42,
            },
            createdDate: "2020-11-25T11:36:24.827Z",
            updatedDate: "2021-05-11T10:32:12.918Z",
            answer: [
              {
                id: "6098f41aef1ff90007bba667",
                promptId: "5f9c4cfafdfbb52b2c86c989",
                question:
                  "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: "",
                response: "1",
                order: 0,
                createdDate: "2021-05-10T08:51:38.491Z",
                updatedDate: "2021-05-11T10:32:11.733Z",
                type: "PromptQuestion",
              },
              {
                id: "6098f41aef1ff90007bba666",
                promptId: "5f9c4f99fdfbb52b2c86c9a7",
                question: "How did you adjust to your new routine?",
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: "",
                response: "5",
                order: 0,
                createdDate: "2021-05-10T08:51:38.484Z",
                updatedDate: "2021-05-11T10:32:11.733Z",
                type: "PromptQuestion",
              },
              {
                id: "6098f41aef1ff90007bba665",
                promptId: "5f9c520afdfbb52b2c86c9b1",
                question: "What happened after that?",
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText:
                  "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
                response: "6",
                order: 0,
                createdDate: "2021-05-10T08:51:38.484Z",
                updatedDate: "2021-05-11T10:32:11.733Z",
                type: "PromptQuestion",
              },
              {
                id: "6098f26aef1ff90007bba662",
                promptId: "5f9c4f0afdfbb52b2c86c99d",
                question: "How did you decide what to do?",
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: "",
                response: "3",
                order: 0,
                createdDate: "2021-05-10T08:44:26.430Z",
                updatedDate: "2021-05-11T10:32:11.733Z",
                type: "PromptQuestion",
              },
              {
                id: "6098ef92ef1ff90007bba660",
                promptId: "5f9c4e61fdfbb52b2c86c993",
                question: "What was it like to learn the diagnosis?",
                questionAuthorId: null,
                questionAuthorFirstName: null,
                questionAuthorDisplayName: null,
                questionAuthorProfilePicture: null,
                sensitiveContentText: "",
                response: "2",
                order: 0,
                createdDate: "2021-05-10T08:32:18.741Z",
                updatedDate: "2021-05-11T10:32:11.733Z",
                type: "PromptQuestion",
              },
            ],
            displayName: "IamGAJones",
            authorId: "5f99844130b711000703cd74",
            authorAgeWhenStoryBegan: 32,
            relation: "Grandfather",
            featuredQuote:
              "Something1. User can click on 'Read All Stories' button in featured stories screen to view a **** 77",
            relationAgeWhenDiagnosed: 32,
            communityId: "5f0753b7c12e0c22d00f5d22",
            communityName: "Oral Cancer",
            storyText: "Placeholder story text",
            published: true,
            removed: true,
            flagged: false,
            hasStoryBeenPublishedOnce: true,
          },
        ],
      },
    };

    const filter = { [mongoDbTables.story.id]: new ObjectID("5fbe41b8e3f3460007cb346c") };
    const setvalues = {
      $set: {
        [mongoDbTables.story.removed]: true
      }
    };

    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(collections.STORY, filter, setvalues);
    expect(resData).toEqual(expRes);
  });

  it('Should mark the story as flagged', async () => {
    const expRes = 1
    const filter = { [mongoDbTables.story.id]: new ObjectID("5fbe41b8e3f3460007cb346c") };
    const setvalues = {
      $set: {
        [mongoDbTables.story.flagged]: false
      }
    };

    mockMongo.updateByQuery.mockReturnValue(expRes);
    const resData = await mockMongo.updateByQuery(collections.STORY, filter, setvalues);
    expect(resData).toEqual(expRes);
  });

  it('Should return story from story Id', async () => {
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
          createdDate: '2021-06-14T11:25:46.854Z',
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
    mockMongo.readByID.mockReturnValue(expRes);
    const resData = await mockMongo.readByID(
      collections.STORY,
      '60c73cbaab98d530201408cb'
    );
    expect(resData).toEqual(expRes);
  });

  it('Should Return all removed Story', async () => {
    const value = {
      [mongoDbTables.story.removed]: true
    };
    const sort = { [mongoDbTables.story.createdDate]: -1 };
    const expRes = [
      {
        _id: '60aca398027ac10007e458cc',
        CommunityId: '5f0753b7c12e0c22d00f5d22',
        AuthorId: '60097b89bb91ed000704a22d',
        AuthorAgeWhenStoryBegan: 20,
        Relation: 'Father',
        DisplayName: 'TOMAS',
        RelationAgeWhenDiagnosed: 40,
        FeaturedQuote: 'Test',
        Answer: [
          {
            _id: '60aca398027ac10007e458cb',
            PromptId: '5f9c4cfafdfbb52b2c86c989',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Test',
            Order: 0,
            CreatedDate: '2021-05-25T07:13:28.966Z',
            UpdatedDate: '2021-05-25T07:13:28.966Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-05-25T07:13:28.966Z',
        UpdatedDate: '2021-05-25T07:13:28.966Z',
        Published: false,
        Flagged: false,
        Removed: true,
        HasStoryBeenPublishedOnce: false
      },
      {
        _id: '60894d1078c1e30007032326',
        CommunityId: '5f0e744536b382377497ecef',
        AuthorId: '5ff5b590c0931200070f0bf6',
        AuthorAgeWhenStoryBegan: 23,
        Relation: 'Myself',
        DisplayName: '',
        RelationAgeWhenDiagnosed: 23,
        FeaturedQuote: 'Lets the ball roll',
        Answer: [
          {
            _id: '60894d1078c1e30007032321',
            PromptId: '5f9c4d0bfdfbb52b2c86c98b',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'test',
            Order: 0,
            CreatedDate: '2021-04-28T11:54:56.424Z',
            UpdatedDate: '2021-04-28T11:56:03.307Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60894d1078c1e30007032323',
            PromptId: '5f9c4e6efdfbb52b2c86c995',
            Question: 'What was it like to learn the diagnosis?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'test',
            Order: 0,
            CreatedDate: '2021-04-28T11:54:56.424Z',
            UpdatedDate: '2021-04-28T11:56:03.307Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60894d1078c1e30007032325',
            PromptId: '5f9c4f16fdfbb52b2c86c99f',
            Question: 'How did you decide what to do?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'test',
            Order: 0,
            CreatedDate: '2021-04-28T11:54:56.424Z',
            UpdatedDate: '2021-04-28T11:56:03.307Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-04-28T11:54:56.424Z',
        UpdatedDate: '2021-04-28T11:56:03.524Z',
        Published: true,
        Flagged: false,
        Removed: true,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '608944e178c1e30007032316',
        CommunityId: '5f0753b7c12e0c22d00f5d22',
        AuthorId: '5ff5b590c0931200070f0bf6',
        AuthorAgeWhenStoryBegan: 45,
        Relation: 'Myself',
        DisplayName: 'TONY',
        RelationAgeWhenDiagnosed: 45,
        FeaturedQuote: 'blah blah',
        Answer: [
          {
            _id: '608944e178c1e30007032315',
            PromptId: '5f9c4e61fdfbb52b2c86c993',
            Question: 'What was it like to learn the diagnosis?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'TEST',
            Order: 0,
            CreatedDate: '2021-04-28T11:20:01.063Z',
            UpdatedDate: '2021-04-28T11:20:01.063Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '6089464878c1e3000703231c',
            PromptId: null,
            Question: 'HI',
            QuestionAuthorId: '60893f4d78c1e3000703230c',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: '****',
            Order: 0,
            CreatedDate: '2021-04-28T11:26:00.131Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-04-28T11:20:01.063Z',
        UpdatedDate: '2021-04-28T12:03:57.420Z',
        Published: true,
        Flagged: true,
        Removed: true,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '607ffcf37134f10007956311',
        CommunityId: '607e7c99d0a2b533bb2ae3d2',
        AuthorId: '6007fc4ac67c8b0007a00aec',
        AuthorAgeWhenStoryBegan: 20,
        Relation: 'Myself',
        DisplayName: 'Name',
        RelationAgeWhenDiagnosed: 20,
        FeaturedQuote: 'Diabet',
        Answer: [
          {
            _id: '607ffcf37134f10007956310',
            PromptId: '607ed34c4b9db58c6e7ffa90',
            Question: 'What was it like to learn the diagnosis?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Hi',
            Order: 0,
            CreatedDate: '2021-04-21T10:22:43.338Z',
            UpdatedDate: '2021-04-21T11:28:21.982Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-04-21T10:22:43.338Z',
        UpdatedDate: '2021-04-25T04:12:31.762Z',
        Published: false,
        Flagged: false,
        Removed: true,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '6048e1493228460007242486',
        CommunityId: '5f22db56a374bc4e80d80a9b',
        AuthorId: '5fd72f8d52adcf0007120dfa',
        AuthorAgeWhenStoryBegan: 56,
        Relation: 'Husband',
        DisplayName: 'WWE',
        RelationAgeWhenDiagnosed: 60,
        FeaturedQuote: 'Iteration Demo43',
        Answer: [
          {
            _id: '6048e1493228460007242485',
            PromptId: '5f9c4fb4fdfbb52b2c86c9ab',
            Question: 'How did you adjust to your new routine?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'This is a test scenarosi',
            Order: 0,
            CreatedDate: '2021-03-10T15:10:01.833Z',
            UpdatedDate: '2021-03-10T15:10:01.833Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-03-10T15:10:01.833Z',
        UpdatedDate: '2021-03-11T09:47:43.850Z',
        Published: false,
        Flagged: false,
        Removed: true,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '6048d5a73228460007242475',
        CommunityId: '5f0e744536b382377497ecef',
        AuthorId: '5fd72f8d52adcf0007120dfa',
        AuthorAgeWhenStoryBegan: 45,
        Relation: 'Myself',
        DisplayName: 'WWE',
        RelationAgeWhenDiagnosed: 45,
        FeaturedQuote: 'Notifications go go',
        Answer: [
          {
            _id: '6048d5a73228460007242472',
            PromptId: '5f9c4d0bfdfbb52b2c86c98b',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'IT was the most hardest thing I had to do',
            Order: 0,
            CreatedDate: '2021-03-10T14:20:23.222Z',
            UpdatedDate: '2021-03-10T14:20:23.222Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '6048d5a73228460007242474',
            PromptId: '5f9c4e6efdfbb52b2c86c995',
            Question: 'What was it like to learn the diagnosis?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'test',
            Order: 0,
            CreatedDate: '2021-03-10T14:20:23.222Z',
            UpdatedDate: '2021-03-10T14:20:23.222Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '6049ec6132284600072424a4',
            PromptId: null,
            Question: '****',
            QuestionAuthorId: '5fcf1d379b971f0007f87b7a',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: '****',
            Order: 0,
            CreatedDate: '2021-03-11T10:09:37.149Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-03-10T14:20:23.222Z',
        UpdatedDate: '2021-03-11T10:09:37.149Z',
        Published: true,
        Flagged: true,
        Removed: true,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '60461d825e5dd3000722775a',
        CommunityId: '5f22db56a374bc4e80d80a9b',
        AuthorId: '604255e51e2f9e00084080f1',
        AuthorAgeWhenStoryBegan: 25,
        Relation: 'Husband',
        DisplayName: 'Willy',
        RelationAgeWhenDiagnosed: 53,
        FeaturedQuote: 'Let  the  sun rise',
        Answer: [
          {
            _id: '60461d825e5dd30007227759',
            PromptId: '5f9c4d39fdfbb52b2c86c98d',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'test1',
            Order: 0,
            CreatedDate: '2021-03-08T12:50:10.102Z',
            UpdatedDate: '2021-03-08T12:50:10.102Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-03-08T12:50:10.102Z',
        UpdatedDate: '2021-03-08T12:50:10.102Z',
        Published: false,
        Flagged: false,
        Removed: true,
        HasStoryBeenPublishedOnce: false
      }
    ];

    mockMongo.readAllByValue.mockReturnValue(expRes);
    const resData = await mockMongo.readAllByValue(
      collections.STORY,
      value,
      sort
    );
    expect(resData).toEqual(expRes);
  });

  it("Should return true when the user question is aswered for the story.", async () => {
    const expRes = 1;

    const filter = { _id: new ObjectID('5fbfa94de3f3460007cb348d') };
    const setvalues = {
      $set: {
        [mongoDbTables.story.answer]: [
          {
            _id: '5fbfa94de3f3460007cb348c',
            PromptId: '5fbba9c6e3f3460007cb3454',
            Question: 'Chemotherapy',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Goo',
            Order: 0,
            CreatedDate: '2020-11-26T07:40:37.000Z',
            UpdatedDate: '2021-04-15T11:38:13.214Z',
            Type: 'PromptQuestion'
          }
        ],
        [mongoDbTables.story.updateDate]: new Date()
      }
    };

    mockMongo.updateByQuery.mockReturnValue(expRes);
    const data = await mockMongo.updateByQuery(
      collections.STORY,
      filter,
      setvalues
    );
    expect(data).toEqual(expRes);
  });

  it('Should set flagged in story collection', async () => {
    const expRes = 1;

    const updateQuery = {
      $set: {
        flagged: true
      }
    };
    const storyObj = { [mongoDbTables.story.id]: '5fc9fe96e3f3460007cb34f3' };

    mockMongo.updateByQuery.mockReturnValue(expRes);
    const data = await mockMongo.updateByQuery(
      collections.STORY,
      storyObj,
      updateQuery
    );
    expect(data).toEqual(expRes);
  });

});
