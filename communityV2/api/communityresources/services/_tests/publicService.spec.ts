import { collections, mongoDbTables } from '@anthem/communityapi/common';
import { mockMongo } from '@anthem/communityapi/common/baseTest';
import { ObjectId } from 'mongodb';

describe('PublicService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return App version from database', async () => {
    const expRes = {
      _id: '601c1c415c474da1053b976b',
      Ios: '1.1.0',
      Android: '1.1.0'
    };
    mockMongo.readByValue.mockReturnValue(expRes);
    const data = await mockMongo.readByValue(collections.APPVERSION, {});
    expect(data).toEqual(expRes);
  });

  it('Should Return user successfully for valid userName', async () => {
    const expRes = {
      _id: '60646f69a450020007eae243',
      FirstName: 'GARRET',
      LastName: 'BODOVSKY',
      Username: '~SIT3SB422I10091',
      Token: null,
      Email: null,
      Gender: 'Female',
      GenderRoles: { GenderPronoun: 'she', GenderPronounPossessive: 'her' },
      PhoneNumber: null,
      DeviceId: null,
      DeviceType: null,
      DisplayName: null,
      DateOfBirth: null,
      UserLocation: null,
      UserGeoLocation: null,
      Age: 60,
      ProfilePicture: '2baa8dc6-02b0-4b10-889e-eb7173f24a04.jpg',
      MyCommunities: [
        '5f0753f6c12e0c22d00f5d23',
        '5f22db56a374bc4e80d80a9b',
        '5f07537bc12e0c22d00f5d21',
        '5f0e744536b382377497ecef',
        '5f245386aa271e24b0c6fd88',
        '5f0753b7c12e0c22d00f5d22',
        '60a358bc9c336e882b19bbf0',
        '607e7c99d0a2b533bb2ae3d2'
      ],
      MyFilters: null,
      Active: true,
      ProxyId: null,
      HasAgreedToTerms: false,
      PersonId: '348105858'
    };
    mockMongo.readByValue.mockReturnValue(expRes);
    const resData = await mockMongo.readByValue(collections.USERS, {
      [mongoDbTables.users.username]: '~SIT3SB422I10091'
    });
    expect(resData).toEqual(expRes);
  });

  it('Should Return all Flagged story', async () => {
    const value = {
      [mongoDbTables.story.removed]: false,
      [mongoDbTables.story.flagged]: true
    };
    const sort = { [mongoDbTables.question.createdDate]: -1 };
    const expRes = [
      {
        _id: '6082fe653f91d30007c6b692',
        CommunityId: '5f07537bc12e0c22d00f5d21',
        AuthorId: '6082eee27134f1000795645c',
        AuthorAgeWhenStoryBegan: 33,
        Relation: 'Myself',
        DisplayName: 'KURIb',
        RelationAgeWhenDiagnosed: 33,
        FeaturedQuote: 'Story  creation',
        Answer: [
          {
            _id: '6082fe653f91d30007c6b691',
            PromptId: '5f9c4ceafdfbb52b2c86c988',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'tests',
            Order: 0,
            CreatedDate: '2021-04-23T17:05:41.332Z',
            UpdatedDate: '2021-04-23T17:05:41.332Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-04-23T17:05:41.332Z',
        UpdatedDate: '2021-04-27T12:22:33.378Z',
        Published: true,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '6064b727a450020007eae293',
        CommunityId: '5f07537bc12e0c22d00f5d21',
        AuthorId: '60646e9aa450020007eae241',
        AuthorAgeWhenStoryBegan: 22,
        Relation: 'Father',
        DisplayName: '',
        RelationAgeWhenDiagnosed: 53,
        FeaturedQuote: 'For the rat race is on 🔥',
        Answer: [
          {
            _id: '6064b727a450020007eae292',
            PromptId: '5f9c4ceafdfbb52b2c86c988',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response:
              "Get a few minutes late but I'll call you in about an hr 😘",
            Order: 0,
            CreatedDate: '2021-03-31T17:53:43.021Z',
            UpdatedDate: '2021-04-12T13:35:13.845Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60744c7e7e23450007186443',
            PromptId: '5f9c4e57fdfbb52b2c86c992',
            Question: 'What was it like to learn the diagnosis?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: '',
            Response: 'C',
            Order: 0,
            CreatedDate: '2021-04-12T13:34:54.189Z',
            UpdatedDate: '2021-04-12T13:35:13.845Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60744c7f7e23450007186444',
            PromptId: '5f9c4f92fdfbb52b2c86c9a6',
            Question: 'How did you adjust to your new routine?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: '',
            Response: 'Gg',
            Order: 0,
            CreatedDate: '2021-04-12T13:34:55.303Z',
            UpdatedDate: '2021-04-12T13:35:13.845Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60744c827e23450007186445',
            PromptId: '5f9c5200fdfbb52b2c86c9b0',
            Question: 'What happened after that?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            Response: 'Ugh',
            Order: 0,
            CreatedDate: '2021-04-12T13:34:58.070Z',
            UpdatedDate: '2021-04-12T13:35:13.845Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60744c837e23450007186446',
            PromptId: '5f9c4f04fdfbb52b2c86c99c',
            Question: 'How did you decide what to do?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: '',
            Response: 'Did',
            Order: 0,
            CreatedDate: '2021-04-12T13:34:59.101Z',
            UpdatedDate: '2021-04-12T13:35:13.845Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '6099067cef1ff90007bba675',
            PromptId: null,
            Question: 'How are you ☺ 💗 ',
            QuestionAuthorId: '60646605a450020007eae236',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'tygsv buga j ',
            Order: 0,
            CreatedDate: '2021-05-10T10:10:04.465Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-03-31T17:53:43.021Z',
        UpdatedDate: '2021-05-10T10:10:04.465Z',
        Published: true,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '6064667da450020007eae23c',
        CommunityId: '5f07537bc12e0c22d00f5d21',
        AuthorId: '60646605a450020007eae236',
        AuthorAgeWhenStoryBegan: 45,
        Relation: 'Father',
        DisplayName: 'pheebs',
        RelationAgeWhenDiagnosed: 23,
        FeaturedQuote: 'CX - Ted Talk',
        Answer: [
          {
            _id: '607d7068e216c90007547587',
            PromptId: null,
            Question: 'test - ',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Tested',
            Order: 0,
            CreatedDate: '2021-04-19T11:58:32.788Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60797607e216c90007547518',
            PromptId: null,
            Question: "For the house and I don't have to work",
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: "Sure u don't 🤭",
            Order: 0,
            CreatedDate: '2021-04-16T11:33:27.705Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60795b69e216c900075474fc',
            PromptId: null,
            Question: 'hi',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'This is without emoticon ',
            Order: 0,
            CreatedDate: '2021-04-16T09:39:53.792Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60795b52e216c900075474f8',
            PromptId: null,
            Question: 'hi',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: '😀',
            Order: 0,
            CreatedDate: '2021-04-16T09:39:30.646Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60795b15e216c900075474f5',
            PromptId: null,
            Question: 'Hi test ',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Answering cami to check if there are issues\n',
            Order: 0,
            CreatedDate: '2021-04-16T09:38:29.413Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60795a60e216c900075474f3',
            PromptId: null,
            Question: 'Hey ',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Hi',
            Order: 0,
            CreatedDate: '2021-04-16T09:35:28.560Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60795a3ce216c900075474f1',
            PromptId: null,
            Question: 'Hey ',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Hi 👋 ',
            Order: 0,
            CreatedDate: '2021-04-16T09:34:52.359Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60782792b38c960008122de5',
            PromptId: null,
            Question: 'Hi Pheebs',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'Hi... how will the demo go?',
            Order: 0,
            CreatedDate: '2021-04-15T11:46:26.316Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'UserQuestion'
          },
          {
            _id: '6064667da450020007eae239',
            PromptId: '5f9c4e57fdfbb52b2c86c992',
            Question: 'What was it like to learn the diagnosis?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response:
              'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
            Order: 0,
            CreatedDate: '2021-03-31T12:09:33.814Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '6064667da450020007eae23b',
            PromptId: '5f9c4f04fdfbb52b2c86c99c',
            Question: 'How did you decide what to do?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response:
              "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose... just sometimes",
            Order: 0,
            CreatedDate: '2021-03-31T12:09:33.814Z',
            UpdatedDate: '2021-05-10T09:16:38.677Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2021-03-31T12:09:33.815Z',
        UpdatedDate: '2021-05-10T09:16:43.028Z',
        Published: true,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '5fd21d139b971f0007f87ba9',
        CommunityId: '5f0753b7c12e0c22d00f5d22',
        AuthorId: '5fcfa0919b971f0007f87b89',
        AuthorAgeWhenStoryBegan: 43,
        Relation: 'Father',
        DisplayName: 'RAJA',
        RelationAgeWhenDiagnosed: 69,
        FeaturedQuote:
          'His laugh rose and fell and rose again, and I told myself I could love him for that alone.',
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
        StoryText: 'Placeholder story text',
        CreatedDate: '2020-12-10T13:05:23.006Z',
        UpdatedDate: '2020-12-10T13:05:29.092Z',
        Published: true,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '5fcfa27a9b971f0007f87b8d',
        CommunityId: '5f07537bc12e0c22d00f5d21',
        AuthorId: '5fcfa0919b971f0007f87b89',
        AuthorAgeWhenStoryBegan: 36,
        Relation: 'Mother',
        DisplayName: 'Raja',
        RelationAgeWhenDiagnosed: 63,
        FeaturedQuote:
          'Live as if you were to die tomorrow. Learn as if you were to live forever',
        Answer: [
          {
            _id: '60062b8fc67c8b0007a00aa0',
            PromptId: null,
            Question: 'Hi ',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'What’s up!',
            Order: 0,
            CreatedDate: '2021-01-19T00:45:03.096Z',
            UpdatedDate: '2021-01-19T00:45:37.711Z',
            Type: 'UserQuestion'
          },
          {
            _id: '60062b1bc67c8b0007a00a9f',
            PromptId: null,
            Question: 'Hi ',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'What’s up!',
            Order: 0,
            CreatedDate: '2021-01-19T00:43:07.353Z',
            UpdatedDate: '2021-01-19T00:45:37.711Z',
            Type: 'UserQuestion'
          },
          {
            _id: '5fcfa27a9b971f0007f87b8c',
            PromptId: '5fa1784190745f000786469f',
            Question: 'Did you have any issues with claims',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'All the claims were settled. We didnt face any issues',
            Order: 0,
            CreatedDate: '2020-12-08T10:27:46.000Z',
            UpdatedDate: '2021-01-19T00:45:37.711Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2020-12-08T15:57:46.446Z',
        UpdatedDate: '2021-01-19T00:45:38.096Z',
        Published: true,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '5fcf5e2f9b971f0007f87b84',
        CommunityId: '5f0e744536b382377497ecef',
        AuthorId: '5fc8d625e3f3460007cb34ec',
        AuthorAgeWhenStoryBegan: 44,
        Relation: 'Myself',
        DisplayName: 'joyix',
        RelationAgeWhenDiagnosed: 44,
        FeaturedQuote:
          'Friendshp. is born at the moment when one man says to another "What! You too? I thought that no u 2',
        Answer: [
          {
            _id: '5fcf5e2f9b971f0007f87b83',
            PromptId: '5fbba9c6e3f3460007cb3454',
            Question: 'Chemotherapy',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eget lacus lobortis, iaculis felis id, dictum magna. Vestibulum at nisl nec leo tincidunt pulvinar. Vestibulum semper, arcu pulvinar commodo vestibulum, elit eros ultrices neque, ac tempor nibh urna sit amet dui. In dictum eros aliquet nibh dignissim, et sagittis enim ultricies. Sed tempor eros tristique orci consectetur, a euismod nunc luctus. Donec tincidunt ***** at erat malesuada, sed lobortis urna porta. Mauris condimentum nibh quam, ut sodales neque mattis et. Suspendisse potenti. Praesent sit amet risus sit amet ipsum vestibulum euismod ut ut nisl.',
            Order: 0,
            CreatedDate: '2020-12-08T05:36:23.000Z',
            UpdatedDate: '2020-12-08T05:36:23.000Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '603cf25d2405060008e42c9d',
            PromptId: null,
            Question: 'API Automation test question',
            QuestionAuthorId: '602a5727e7965700083c86c3',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'API response for an answer',
            Order: 0,
            CreatedDate: '2021-03-01T13:55:41.337Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          },
          {
            _id: '603cf6ae2405060008e42ca1',
            PromptId: null,
            Question: 'API Automation test question',
            QuestionAuthorId: '602a5727e7965700083c86c3',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'API response for an answer',
            Order: 0,
            CreatedDate: '2021-03-01T14:14:06.417Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          },
          {
            _id: '603cf7022405060008e42ca3',
            PromptId: null,
            Question: 'API Automation test question',
            QuestionAuthorId: '602a5727e7965700083c86c3',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'API response for an answer',
            Order: 0,
            CreatedDate: '2021-03-01T14:15:30.945Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          },
          {
            _id: '603e27d22405060008e42ca7',
            PromptId: null,
            Question: 'API Automation test question',
            QuestionAuthorId: '602a5727e7965700083c86c3',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'API response for an answer',
            Order: 0,
            CreatedDate: '2021-03-02T11:56:02.316Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          },
          {
            _id: '603e2a312405060008e42ca9',
            PromptId: null,
            Question: 'API Automation test question',
            QuestionAuthorId: '602a5727e7965700083c86c3',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'API response for an answer',
            Order: 0,
            CreatedDate: '2021-03-02T12:06:09.062Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          },
          {
            _id: '603e2de62405060008e42cad',
            PromptId: null,
            Question: 'API Automation test question',
            QuestionAuthorId: '602a5727e7965700083c86c3',
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: null,
            Response: 'API response for an answer',
            Order: 0,
            CreatedDate: '2021-03-02T12:21:58.929Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          }
        ],
        StoryText: 'Placeholder story text',
        CreatedDate: '2020-12-08T11:06:23.195Z',
        UpdatedDate: '2021-03-02T12:25:13.177Z',
        Published: false,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      },
      {
        _id: '5fa271bc90745f00078646a6',
        CommunityId: '5f0753b7c12e0c22d00f5d22',
        AuthorId: '5f9af8cd3a694a9c6c61c9fc',
        AuthorAgeWhenStoryBegan: 28,
        Relation: 'Father',
        DisplayName: '',
        RelationAgeWhenDiagnosed: 62,
        FeaturedQuote: "There's a lake of abyss right ahead :P",
        Answer: [
          {
            _id: '607a8db5e216c90007547555',
            PromptId: '5f9c4cfafdfbb52b2c86c989',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: '',
            Response: 'Rodina',
            Order: 0,
            CreatedDate: '2021-04-17T07:26:45.301Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '607a8c28e216c90007547552',
            PromptId: null,
            Question: 'How are you doing now ?',
            QuestionAuthorId: '5f99844130b711000703cd74',
            QuestionAuthorFirstName: 'George',
            QuestionAuthorDisplayName: 'IamGAJones',
            QuestionAuthorProfilePicture:
              'https://sit.api.communitycareexplorer.com/communitiesapi/v1/v1/api/Users/ProfileImage/6e014d87-b83f-4f13-b7f2-cdb956bf8e08.jpg',
            SensitiveContentText: null,
            Response: 'Nothing',
            Order: 0,
            CreatedDate: '2021-04-17T07:20:08.638Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'UserQuestion'
          },
          {
            _id: '5fbd0ef4e3f3460007cb3461',
            PromptId: '5fae731290745f00078646ae',
            Question: 'Did you have any issues with claims',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: '',
            Response: 'Test story creation',
            Order: 0,
            CreatedDate: '2020-11-24T08:17:32.000Z',
            UpdatedDate: '2020-11-24T08:17:32.000Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '5fa271bc90745f00078646a5',
            PromptId: null,
            Question: 'SO this is a question',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: 'could contain sensitive content',
            Response: 'It was pretty hard and painfu;',
            Order: 0,
            CreatedDate: '2020-11-04T03:47:48.000Z',
            UpdatedDate: '2020-11-24T08:17:32.000Z',
            Type: 'PromptQuestion'
          },
          {
            _id: '60956058ef1ff90007bba641',
            PromptId: '5f9c4f0afdfbb52b2c86c99d',
            Question: 'How did you decide what to do?',
            QuestionAuthorId: null,
            QuestionAuthorFirstName: null,
            QuestionAuthorDisplayName: null,
            QuestionAuthorProfilePicture: null,
            SensitiveContentText: '',
            Response: '3',
            Order: 0,
            CreatedDate: '2021-05-07T15:44:24.783Z',
            UpdatedDate: '0001-01-01T00:00:00.000Z',
            Type: 'PromptQuestion'
          }
        ],
        StoryText: 'This is a test text. I have the power',
        CreatedDate: '2020-11-04T09:17:48.093Z',
        UpdatedDate: '2021-05-07T15:44:24.783Z',
        Published: false,
        Flagged: true,
        Removed: false,
        HasStoryBeenPublishedOnce: true
      }
    ];
    mockMongo.readAllByValue.mockReturnValue(expRes);
    const data = await mockMongo.readAllByValue(collections.STORY, value, sort);
    expect(data).toEqual(expRes);
  });

  it('should login a user with oidc access and id tokens', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            FirstName: 'Test',
            LastName: 'User',
            Username: 'TestUser',
            Token: '',
            Email: 'test.user@legatohealth.com',
            Gender: 'male',
            GenderRoles: {
              GenderPronoun: 'he',
              GenderPronounPossessive: 'his'
            },
            PhoneNumber: '+15133493193',
            DeviceId: '123456',
            DeviceType: 'IoS',
            DisplayName: 'TestUser1',
            UserLocation: {
              StreetAddress1: '123 main st',
              StreetAddress2: '',
              City: 'Mason',
              State: 'OH',
              ZipCode: '45034'
            },
            UserGeoLocation: {
              Latitude: 39.3600586,
              Longitude: -84.309939,
              Altitude: 21888950.96112314
            },
            HasAgreedToTerms: false,
            DateOfBirth: '01/10/1980',
            Age: 41,
            _id: '6005ac61f4c602d901e0fe57'
          }
        ]
      }
    };
    const filter = { [mongoDbTables.users.username]: '~sit3gajones' };
    mockMongo.readByValue.mockReturnValue(expRes);
    const data = await mockMongo.readByValue(collections.STORY, filter);
    expect(data).toEqual(expRes);
  });

  it('Should Return Content Translations from database', async () => {
    const expRes = {
      _id: new ObjectId("614d78b30b2a67ed15af34f5"),
      language: "en",
      secure: false,
      data: {
        onboarding: {
          content: {
            bottomButtons: {
              saveContinueLabel: "Save and Continue",
              skipStepButton: "Skip This Step"
            },
            topButtons: {
              exitButton: "Yes, Exit",
              continueSetupButton: "No, Continue Set Up"
            },
            communityScreen: {
              preferencesLabel: "preferences",
              label: "Which communities are you interested in?",
              selectLabel: "SELECT ALL THAT APPLY",
              expandedButton: "expanded",
              collapsedButton: "collapsed"
            },
            settingsScreen: {
              label: "Settings",
              saveContinueLabel: "Save and Continue",
              stayConnectedLabel: "Stay connected to activity within the communities you join and improve search results by enabling these settings",
              enablePushLabel: "Enable push notifications",
              programsNearLabel: "Find free and reduced-cost aid and programs near you.",
              tailorLocationLabel: "We can tailor these to your location if you enable location services.",
              recommendationsLabel: "Get better recommendations",
              enableLocationLabel: "Enable location services",
              orLabel: "or",
              enterZiPCode: "Enter your ZIP Code",
              validZipCode: "Please enter a valid USA ZIP code"
            },
            touScreen: {
              warning: {
                touViolation: {
                  title: "Terms of use violation",
                  message: "We detected inappropriate language in your answer. We have replaced the language with asterisks and highlighted the field. You can continue with your asterisks in place or change the language."
                }
              },
              publicProfileLabel: "Public Profile",
              preferencesLabel: "Preferences",
              waysToHelpLabel: "Ways We Can Help",
              settingsLabel: "Settings",
              letsLabel: "let's",
              personalizeLabel: "personalize",
              yourExperienceLabel: "your experience",
              setUpAccountLabel: "In the next few screens, we'll help set up your account and start you on your way.",
              participationLabel: "Participation Guidelines",
              touMessage: {
                label1: "Our goal is to create a welcoming space where members feel comfortable freely sharing knowledge and experience with others. That’s why we are asking everyone to review and adhere to our",
                label2: "Terms of Use",
                label3: "and",
                label4: "Privacy Policies",
                label5: "Privacy Policies",
                label6: "before continuing.",
                label7: "By accepting user agrees to abide by the Terms of Use and Privacy Policies.",
                label8: "I agree to abide by the Terms of Use and Privacy Policies.",
                submitButton: "Submit"
              }
            },
            localServicesScreen: {
              message: "Everybody needs a little help now and then - that's what communities are for! Select any of these categories and the app will help connect you to free and low-cost services in your area.",
              checkedLabel: "Checked",
              unCheckedLabel: "Unchecked",
              waysHelpLabel: "ways we can help"
            },
            profileScreen: {
              label: "Profile, OnBoarding Screen",
              nextLabel: "Next",
              skipLabel: "Skip On Profile",
              chooseLibraryLabel: "Choose from Library",
              removeCurrentPhotoLabel: "Remove Current Photo",
              photoErrorLabel: "Photo Error",
              pleaseRetryLabel: "Please retry",
              okLabel: "OK",
              displayNameUpdatedMessage: "display name updated successfully",
              photoUpdatedSuccessfullyMessage: "Photo updated successfully",
              photoDeletedSuccessfullyMessage: "Photo removed successfully",
              photoDeletedErrorMessage: "photo delete failed",
              uploadErrorMessage: "Upload Error",
              pleaseRetryMessage: "Please retry.",
              profilePhotoChangeMessage: "Change Profile Photo",
              enterOptionalNameMessage: "Enter an optional nickname here",
              otherMembersMessage: "Other members will see you as",
              errors: {
                displayNameLabel: "An error occurred updating the display name",
                largePhotoLabel: "Photo Error','Please select a smaller photo",
                photoLabel: "Photo Error,Please retry",
                uploadPhotoLabel: "Photo Upload Error,Please retry",
                invalidResponseLabel: "Invalid Response,Please retry."
              }
            },
            profileScreenHeader: {
              publicLabel: "public",
              profileLabel: "profile",
              personalizePostMessage: "Personalize your posts and help others engage with them by adding a profile picture and nickname here."
            },
            uploadProfilePhoto: {
              addPhotoLabel: "Add profile photo",
              editPhotoLabel: "Edit profile photo"
            },
            communitiesSummaryScreen: {
              label: "Community",
              readLabel: "Read",
              articleVideoLabel: "Articles and Videos",
              editLabel: "Edit",
              joinLabel: "Join a Community"
            },
            localServicesSummaryScreen: {
              thereAreLabel: "There are ",
              nearLabel: "local services near you.",
              programsNearLabel: "Find free and reduced-cost aid and programs near you.",
              findLabel: "Find Local Services for",
              needsLabel: "needs",
              label: "Local Services",
              exploreLabel: "Explore All Local Services"
            },
            OnBoardingSummaryScreen: {
              takeToHomePageLabel: "Take Me to the Homepage",
              setupSummaryLabel: "setup summary",
              readyToGoLabel: "Your account is personalized and ready to go. What would you like to do next?",
              adjustSettingsLabel: "You can adjust these settings in the profile section of the app.",
              partOfLabel: "You're now part of",
              noPartCommunityLabel: "You aren't part of a community yet.",
              selectOneToExploreLabel: "Select one to explore first.",
              readArticlesLabel: "Read Articles and Videos",
              deepDiveInterestedLabel: "Do a deep dive into your interests"
            },
            shareStoryScreen: {
              experienceLabel: "Ready to talk about your experience with",
              myStoryLabel: "Share My Story"
            },
            termsScreen: {
              acceptLabel: "Our communities are welcoming and inclusive places where members feel comfortable freely sharing knowledge and experience with others. That'92s why we ask everyone to review and accept our",
              label: "Terms of Use",
              andLabel: "and",
              privacyPolicyLabel: "Privacy Policies",
              beforeContinuingLabel: "before continuing.",
              agreeTermsOfUse: "I agree to follow the Terms of Use and Privacy Policies."
            }
          },
          warnings: {},
          errors: {}
        },
        local: {
          content: {
            filterLabel: {
              moreFiltersLabel: "See more filters",
              removeLabel: "Remove",
              filterLabel: "Filter"
            },
            header: {
              enterZipCodeLabel: "Enter your zipcode",
              findLocalServicesLabel: "Find Local Services",
              discoverServiceZipCodeLabel: "Enter your ZIP code to discover free or reduced cost services like medical care, food, job training, and more.",
              searchLocalLabel: "Search around you for local help & services",
              searchLabel: "Search",
              enterValueToSearchLabel: "Please enter the value to search",
              quickSearchCategory: "QUICK CATEGORY SEARCH"
            },
            searchResultItem: {
              informationAbout: "Information about "
            },
            filterBar: {
              enterYourZipCodeLabel: "Enter your zipcode",
              showingLabel: "Showing",
              resultsNearLabel: "results near",
              filterButton: "This is a filter button"
            },
            filterModalIndex: {
              backLabel: "Back",
              programFilterLabel: "Program Filters",
              applyFilterLabel: "Apply Filter(s)"
            },
            locationModal: {
              permissionNotGrantedLabel: "Location Permission not Granted",
              userMyCurrentLocationLabel: "Use My Current Location",
              enterZipCodeLabel: "Enter ZIP Code",
              searchByZipCodeLabel: "Search by zip code",
              cancelLabel: "Cancel",
              enterValidZipCodeLabel: "Please enter a valid USA ZIP code",
              unitedStatesLabel: "United States",
              updateLocationLabel: "Update Location"
            },
            locationPermissionModal: {
              warning: {
                locationLabel: "Location",
                locationAllowMessage: "Allowing Sydney Community to access your location is the easiest way to enable us to connect you to services in your area.",
                manualZipCodeEntryMessage: "But if you prefer, you can enter your ZIP Code manually in the Local Services section.",
                continueButton: "Continue",
                okButton: "Okay",
                closeButton: "Close"
              }
            },
            localResourceDetailRedesignScreen: {
              warning: {
                removeBookmarkLabel: "Are you sure you'd like to remove this bookmark?",
                yesButton: "Yes, remove bookmark",
                noButton: "No, keep bookmark"
              },
              errors: {
                installEmailClientLabel: "Please install an email client to proceed."
              },
              callLabel: "Call resource",
              emailLabel: "Email resource",
              websiteLabel: "Website URL",
              sundayLabel: "Sunday",
              mondayLabel: "Monday",
              tuesdayLabel: "Tuesday",
              wednesdayLabel: "Wednesday",
              thursdayLabel: "Thursday",
              fridayLabel: "Friday",
              saturdayLabel: "Saturday",
              closedLabel: "Closed",
              actionNotSupportedLabel: "Action not supported by your device",
              moreLocationsLabel: "More Locations",
              providedServicesLabel: "Services this Program Provides",
              programServesLabel: "Populations this Program Serves",
              eligibilityLabel: "Eligibility",
              followLabel: "Follow the Next Steps to find out if this program has eligibility criteria.",
              languageLabel: "Language",
              costLabel: "Cost",
              coverageAreaLabel: "Coverage Area",
              lastUpdatedLabel: "Last Updated"
            },
            localSearch: {
              clearTextLabel: "Clear Text",
              searchLabel: "Search",
              backLabel: "back",
              localLabel: "local",
              searchLocalLabel: "Search for local resources",
              tryAgainLabel: "Try Again"
            },
            localScreen: {
              errorFetchingResourceLabel: "Error fetching resources",
              recommendedLabel: "Recommended",
              costsServiceLabel: "* Costs for services aren’t covered by your Anthem plan"
            },
            moreLocationsScreen: {
              goBackLabel: "Go Back",
              moreLocationsLabel: "More Locations"
            }
          },
          warnings: {},
          errors: {}
        },
        meTab: {
          content: {
            profileScreen: {
              chooseLibraryButton: "Choose from Library",
              removeCurrentPhotoButton: "Remove Current Photo",
              enterNickNameLabel: "Enter Nickname",
              storiesLabel: "stories",
              articlesLabel: "articles",
              localLabel: "local",
              changeProfilePhotoButton: "Change Profile Photo",
              warnings: {},
              errors: {
                removingPhoto: "Error removing photo','Please retry."
              }
            },
            editProfileScreen: {
              title: "Edit Profile",
              areLabel: "How old were you when this story began?*",
              enterYourAgeLabel: "Enter your age",
              enterTheirAgeLabel: "Enter their age",
              enterTextHereLabel: "Enter Text here",
              remainingCharactersLabel: "characters remaining",
              warnings: {
                enterAgeMessage: "Please enter an age between 18 and 130.",
                dateOfBirthMessage: "Please enter a valid date of birth",
                invalidZipCodeMessage: "Invalid zip code"
              }
            }
          },
          warnings: {},
          errors: {
            authorAge: "Author age must be between 1 and 150",
            relationAge: "Relation age must be between 1 and 150"
          }
        },
        staticScreens: {
          content: {
            discoverLabel: "Discover and Share Stories Our communities are here to help you. Discover other people&apos;s stories, ask questions, get inspired and share your own story.",
            browseHelpfulInformationLabel: "Browse Helpful Information Find information to help you keep informed on how take care of yourself and your loved ones.",
            searchLocalServicesLabel: "Search and find Local Services Get recommendations for concerns such as food, housing, transportation and more.",
            nextLabel: "Next",
            skipLabel: "Skip"
          },
          warnings: {},
          errors: {}
        },
        communityScreens: {
          content: {
            joinCommunitiesHeader: {
              title: "Join a Community",
              selectLabel: "Please select a community to join.",
              suggestLabel: "We add communities regularly. Use the Suggest button to recommend one.",
              ineligibleLabel: "There are no more communities that you are eligible to join."
            },
            joinCommunity: {
              welcomeLabel: "Welcome to the Community",
              inspirationLabel: "Fellow members hope you'92ll find inspiration in their stories and encourage you to share your story, too!",
              goToCommunityLabel: "Go to Community",
              joinAnotherCommunityLabel: "Join Another Community"
            },
            editCommunity: {
              title: "Edit Community",
              storyPublishedLabel: "Story Published!",
              previewStoryLabel: "Preview your story in your profile and publish when you'92re ready.",
              publishedStoryLabel: "Story Updated and Published!",
              storyUpdatedLabel: "Story Updated!",
              editedStoryLabel: "You've edited your story and we published your story",
              previewStory: "Preview your story in your profile and publish when you'92re ready",
              publishedToCommunityLabel: "We've published your story to the community.",
              removedModeratorStoryLabel: "Your story has been removed by the moderator. Read our Terms of Use to learn more",
              readTOULabel: "Read Terms of Use",
              publishYourStory: "Publish Your Story",
              joinedCommunity: "You've joined the",
              newJoinedCommunityLabel: "community, but you haven't shared your story.",
              tellYourStoryLabel: "Tell Your Story",
              shareJourneyLabel: "Share your journey with the community"
            },
            bookmarks: {
              addLabel: "Add Bookmarks",
              haveNotBookmarkedLabel: "You haven'92t bookmarked any {story/localService/ helpful information} yet. To bookmark something of interest please use the bookmark icon.",
              helpfulInfoLabel: "helpful info",
              localResourcesLabel: "local resources",
              storiesLabel: "Stories",
              articlesLabel: "articles",
              servicesLabel: "Services"
            },
            editStoryScreen: {
              relations: {
                mySelfLabel: "Myself",
                husbandLabel: "Husband",
                wifeLabel: "Wife",
                motherLabel: "Mother",
                fatherLabel: "Father",
                grandMotherLabel: "GrandMother",
                grandFatherLabel: "GrandFather",
                sonLabel: "Son",
                daughterLabel: "Daughter",
                brotherLabel: "Brother",
                sisterLabel: "Sister",
                friendLabel: "Friend"
              },
              createStoryScreen: {
                storyPlaceholderText: "Placeholder story text",
                previewShareStoryLabel: "Preview and Share Story",
                enterTitleOfStory: "Please enter title of your story",
                storyBeganLabel: "Please enter the age when this story began",
                whoHasThisConditionLabel: "Please enter who has this condition",
                relationAgeLabel: "relationAge",
                diagnosedAgeLabel: "Please enter the age when they were diagnosed",
                closePreviewLabel: "Close Preview"
              },
              storyScreen: {
                meetLabel: "Meet",
                thisIsLabel: "This is",
                storyLabel: "Story",
                storyMenuLabel: "STORY MENU",
                reportStoryLabel: "Report Story",
                questionMenuLabel: "QUESTION MENU",
                editYourStory: "Edit your Story",
                hideYourStoryLabel: "Hide your Story"
              },
              bottomButtons: {
                primary: "Save and Share",
                secondary: "Save as Draft",
                titleOfStoryLabel: "What is the title of your story?*",
                sensitiveContentText: "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
                moreInformationButton: "More Information"
              }
            }
          },
          warnings: {
            leaveCommunity: {
              title: "Leave Community",
              message: "Are you sure you want to leave this community? By leaving this community, your stories will be unpublished. If you decide to rejoin later, you will need to republish them."
            },
            storySharedAlready: {
              title: "Story Already Shared",
              message: "You have already shared your story in this community. Would you like to update your existing story?"
            },
            unpublishedStroy: {
              noLongerTitle: "This story is no longer shared",
              unpublishedTitle: "This story is no longer published",
              message: "The author has unpublished the story."
            },
            removedStroy: {
              title: "Your story has been removed",
              message: "Your story has been removed by the moderator. Read our Terms of Use to learn more."
            },
            publishStory: {
              title: "Before you publish",
              message: "By publishing this story, you are agreeing to make your name, photo, and content visible to the public. Are you sure you want to publish this story?"
            },
            storyUpdatedPublished: {
              title: "Story Updated and Published",
              message: "You’ve edited your story and we published it!"
            },
            storyUpdatedSaved: {
              updatedTitle: "Story Updated",
              savedTitle: "Story Saved",
              message: "Preview your story in your profile and share it when you’re ready."
            },
            storyShared: {
              title: "Story Shared",
              message: "Thank you for sharing your story with the community."
            },
            reportStory: {
              title: "Report Story",
              message: "Are you sure you want to report this story?",
              actionText: "Report",
              cancelText: "Cancel"
            },
            questionSubmitted: {
              title: "Question Submitted!",
              message1: "Check back later to see",
              message2: "s response to your question."
            },
            storyReported: {
              title: "Story Reported",
              message: "This story has been reported and will be reviewed by the moderators."
            },
            reportFailed: {
              title: "Report failed",
              message: "Please try again later."
            },
            storyNoLongerAvailable: "This story is no longer available"
          },
          errors: {
            storyRemoved: "This story has been removed",
            removeStory: "Your story has been removed",
            publishingStory: "There was an error while publishing the story",
            submittingStory: "There was an error submitting the story"
          }
        },
        loginScreen: {
          content: {
            authIntroScreen: {
              sydneyCommunityLabel: "Sydney Community",
              showMoreInfoLabel: "Show More Info",
              moreOptionsLabel: "More Options",
              connectingTextLabel: "Connecting you to others who've been where you are and providing support for your health care needs.",
              signInLabel: "Sign In with Sydney Health",
              forgotUserNameLabel: "Forgot Username or Password?",
              registrationLabel: "Don't have an account?",
              menuScreen: {
                menuLabel: "Menu",
                signingInTitle: "Using Sydney Health Login",
                signingInMessage: "Signing in with your Sydney Health username and password helps us personalize your experience by auto-populating your name, date of birth",
                contactUsLabel: "Contact Us",
                contactUsMessage: "If you have a general question or an issue using Sydney Community App, please contact us at",
                contactUsEmail: "communitytechnicalsupport@anthem.com",
                privacyPolicyLabel: "Privacy Policy",
                termsOfUseLabel: "Terms of Use",
                devLoginLabel: "Dev Login",
                version: "Version",
                emailUsLabel: "Email Us"
              }
            }
          },
          warnings: {},
          errors: {
            emptyUserNamePassword: "Username or password not provided"
          }
        },
        welcomScreen: {
          content: {
            welcomeMessage: {
              label1: "Welcome",
              label2: "to Sydney",
              label3: "Communities"
            }
          },
          warnings: {},
          errors: {}
        },
        commonWarnings: {
          header: {
            savedLabel: "saved",
            doneLabel: "done",
            cautionLabel: "caution",
            title: "warning",
            welcomeLabel: "welcome",
            infoLabel: "info",
            editLabel: "edit",
            connectionLabel: "connection",
            notViewableLabel: "notViewable",
            updateLabel: "update"
          },
          internetConnection: {
            title: "Can't Connect",
            message: "Please check your internet connection and then try again"
          },
          stayLoggedIn: {
            title: "Do you want to stay logged in?",
            message: "You’ve been inactive for a while. For your security, we’ll automatically log you out in 2 minutes."
          },
          doNotMissLabel: {
            title: "Don't miss a thing",
            message: "Receive notifications about new stories and activity on your stories and questions. To enable go to your settings."
          },
          exitAppSetup: {
            title: "Exit App Set Up",
            message: "Are you sure you want to exit app setup? You will be redirected to the app's home page."
          },
          updateRequired: {
            title: "Update Required",
            message: "A new version is available. Please update the app to continue."
          },
          restrictedAccount: {
            title: "Restricted account",
            message: "We have restricted your account due to violations of our Terms of Use. You will no longer be able to interact with other member's Stories, share your own Stories, or message other members. If you had a Story, it has been unpublished. Read our Terms of Use to learn more."
          },
          pushNotification: {
            title: "Turn On Notifications",
            message: "We'll let you know when new stories are posted, you've been asked a question, or question you asked has received an answer."
          },
          cantGetResults: {
            title: "Couldn't get results",
            message: "Sorry we can't retrieve any results right now."
          },
          logOut: {
            title: "Log Out",
            message: "Are you sure you want to log out?"
          },
          unKnownProblem: {
            title: "Whoops!",
            message: "An unknown problem occurred.",
            actionText: "Back to Story Menu"
          },
          blockUser: {
            title: "Block User",
            message: "Blocking this user will prevent any of your story content from being accessible to them, and you will not see theirs. Any bookmarks you have from this user will be removed and inaccessible. Do you want to block this user?",
            actionText: "Block"
          },
          invalidRequestFillPrompt: {
            title: "Invalid Request",
            message: "Please make sure to fill out at least one prompt"
          }
        },
        commonErrors: {
          error1: "Something went wrong with the login. Please try again",
          unableToOpenURL: "Unable to open URL",
          actionNotSupported: "Action not supported by your device",
          invalidData: "Invalid Profile Data','Please check the data.",
          requestError: "Request Error','Please retry",
          invalidRequest: "Invalid Request",
          authorNotFound: "ERROR: Author id not found"
        }
      }
    };
    mockMongo.readByValue.mockReturnValue(expRes);
    const data = await mockMongo.readByValue(collections.CONTENT, { language : 'en', secure: false });
    expect(data).toEqual(expRes);
  });
});
