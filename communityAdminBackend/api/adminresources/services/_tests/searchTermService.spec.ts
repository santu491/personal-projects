import { collections } from '@anthem/communityadminapi/common';
import { mockMongo } from '@anthem/communityadminapi/common/baseTest';

describe('SearchTermService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return Success after creating a new Search Term entry in DB', async () => {
    const expRes = {
      _id: '610140afe2816167d1dde25b',
      term: 'random',
      createdDate: '2021-07-28T11:33:55.943Z'
    };
    mockMongo.insertValue.mockReturnValue(expRes);
    const resData = await mockMongo.insertValue(collections.SEARCHTERM, {
      term: 'random',
      createdDate: '2021-07-28T11:33:55.943Z'
    });
    expect(resData).toEqual(expRes);
  });
});
