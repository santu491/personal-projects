import { collections } from '@anthem/communityapi/common';
import { mockMongo } from '@anthem/communityapi/common/baseTest';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { SearchTermService } from '../searchTermService';

describe('AdminService', () => {
  const mockSvc: Mockify<SearchTermService> = {
    getAllSearchTerms: jest.fn(),
    getAllLocalCategoriesByUser: jest.fn(),
    getUserRecommendedResources: jest.fn()
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return all Community documents in a List', async () => {
    const expRes = [
      {
        id: '61013eb670dbd030d83c8c5f',
        term: 'food',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c60',
        term: 'housing',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c61',
        term: 'goods',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c62',
        term: 'transit',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c63',
        term: 'health',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c64',
        term: 'money',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c65',
        term: 'care',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c66',
        term: 'education',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c67',
        term: 'work',
        createdDate: '2021-07-28T11:25:42.255Z'
      },
      {
        id: '61013eb670dbd030d83c8c68',
        term: 'legal',
        createdDate: '2021-07-28T11:25:42.255Z'
      }
    ];

    mockMongo.readAll.mockReturnValue(expRes);
    const resData = await mockMongo.readAll(collections.SEARCHTERM);
    expect(resData).toEqual(expRes);
  });

  it('Should Return User Recommended Resources', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          userId: '60646605a450020007eae236',
          zipcode: 12345,
          resources: [
            {
              title: 'Community Resources',
              count: 3,
              children: [
                {
                  id: '5f0e744536b382377497ecef',
                  name: 'Anal Cancer',
                  count: '150'
                },
                {
                  id: '5f369ba97b79ea14f85fb0ec',
                  name: 'Metastatic or Recurrent Breast Cancer',
                  count: '150'
                },
                {
                  id: '60e2e7277c37b43a668a32f2',
                  name: 'Parenting',
                  count: '36'
                }
              ]
            },
            {
              title: 'SDOH Resources',
              count: 3,
              children: [
                {
                  id: '61013eb670dbd030d83c8c5f',
                  name: 'food',
                  count: '29'
                },
                {
                  id: '61013eb670dbd030d83c8c61',
                  name: 'goods',
                  count: '20'
                },
                {
                  id: '61013eb670dbd030d83c8c64',
                  name: 'money',
                  count: '11'
                }
              ]
            }
          ]
        }
      }
    };

    mockSvc.getUserRecommendedResources.mockReturnValue(expRes);
    const res = await mockSvc.getUserRecommendedResources(
      '61013eb670dbd030d83c8c68',
      '12345',
      ['Anal Cancer', 'Metastatic or Recurrent Breast Cancer', 'Parenting'],
      ['food', 'goods', 'money']
    );
    expect(res).toEqual(expRes);
  });
});
