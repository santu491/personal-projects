import {
  mockMongo,
  mockResult
} from '@anthem/communityadminapi/common/baseTest';
import { StoryHelperService } from 'api/adminresources/helpers/storyHelper';
import { PageParam } from 'api/adminresources/models/pageParamModel';
import { ViewStoryService } from '../viewStoryService';

describe('ViewStoryService', () => {
  let service: ViewStoryService;
  let readStoryCollection;
  let getStoryAuthor;
  const pageParams: PageParam = {
    pageNumber: 1,
    pageSize: 10,
    sort: 1
  };
  beforeEach(() => {
    service = new ViewStoryService(
      <any>mockMongo,
      <any>mockResult
    );
    getStoryAuthor = jest.spyOn(StoryHelperService.prototype as any, 'getStoryAuthor');
    readStoryCollection = jest.spyOn(StoryHelperService.prototype as any, 'readStoryCollection');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Get all stories
  it('Should return all stories based on community: success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        values: {},
      },
    };
    mockMongo.readAllByValue.mockReturnValue([]);
    mockMongo.readByIDArray.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    getStoryAuthor.mockImplementation(() => {
      return true;
    });
    await service.getAllStories(pageParams, 'flagged');
  });

  it('Should return all stories based on community: Exception', async () => {
    mockMongo.readAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getAllStories(pageParams, 'published', ['communityId']);
  });

  // Get the story by id.
  it('Should get the story based on Id: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        values: {},
      },
    };

    readStoryCollection.mockImplementation(() => {
      return {
        'authorId': 'string',
        '_id': 'string'
      };
    });
    mockMongo.readAllByValue.mockReturnValue(expRes);
    mockMongo.readByID.mockReturnValue(expRes);
    mockResult.createSuccess(expRes);
    await service.getStory('stroryId');
    });
});
