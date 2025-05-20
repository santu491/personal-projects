import { mockMongo } from '@anthem/communityapi/common/baseTest';
import { collections } from '@anthem/communityapi/common/constants';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { ReactionService } from '../reactionService';

describe('AdminService', () => {

  const mockSvc: Mockify<ReactionService> = {
    getEntityReactions: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return List of All Reactions for an Entity', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '612786cdfe6f87002b445669',
            reaction: 'like',
            createdDate: '2021-10-12T06:37:29.767Z',
            updatedDate: '2021-10-12T06:37:29.767Z',
            id: '61652d29d3afcaf7a3795bbc'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '614afa039c1463002ad1cac7',
            reaction: 'like',
            createdDate: '2021-10-12T06:38:00.783Z',
            updatedDate: '2021-10-12T06:38:00.783Z',
            id: '61652d48d3afcaf7a3795bbd'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '612e12231933190023f3e67e',
            reaction: 'like',
            createdDate: '2021-10-12T06:38:09.029Z',
            updatedDate: '2021-10-12T06:38:09.029Z',
            id: '61652d51d3afcaf7a3795bbe'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '613617fdf1a74700240c3b7e',
            reaction: 'like',
            createdDate: '2021-10-12T06:38:16.429Z',
            updatedDate: '2021-10-12T06:38:16.429Z',
            id: '61652d58d3afcaf7a3795bbf'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '612e419e62f14f001dfa4340',
            reaction: 'care',
            createdDate: '2021-10-12T06:38:25.817Z',
            updatedDate: '2021-10-12T06:38:25.817Z',
            id: '61652d61d3afcaf7a3795bc0'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '612f7c2d8f962b00246deb09',
            reaction: 'care',
            createdDate: '2021-10-12T06:38:35.338Z',
            updatedDate: '2021-10-12T06:38:35.338Z',
            id: '61652d6bd3afcaf7a3795bc1'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '614c675a8d0953002337ef89',
            reaction: 'celebrate',
            createdDate: '2021-10-12T06:38:47.033Z',
            updatedDate: '2021-10-12T06:38:47.033Z',
            id: '61652d77d3afcaf7a3795bc2'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '612cf5b16921eb0016e396b6',
            reaction: 'celebrate',
            createdDate: '2021-10-12T06:38:54.563Z',
            updatedDate: '2021-10-12T06:38:54.563Z',
            id: '61652d7ed3afcaf7a3795bc3'
          },
          {
            entityId: '6135c400db890b002f7af0e6',
            userId: '614c63ce8d0953002337ef88',
            reaction: 'celebrate',
            createdDate: '2021-10-12T06:39:04.117Z',
            updatedDate: '2021-10-12T06:39:04.117Z',
            id: '61652d88d3afcaf7a3795bc4'
          }
        ]
      }
    };

    const filter = {
      entityId: '6135c400db890b002f7af0e6'
    };

    mockMongo.readAllByValue.mockReturnValue(expRes);
    const res = await mockMongo.readAllByValue(collections.REACTIONS, filter);
    expect(res).toEqual(expRes);
  });

  it('Should Return List of All Reactions for an Entity from DB', async () => {
    const expRes = [
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '612786cdfe6f87002b445669',
        reaction: 'like',
        createdDate: '2021-10-12T06:37:29.767Z',
        updatedDate: '2021-10-12T06:37:29.767Z',
        id: '61652d29d3afcaf7a3795bbc'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '614afa039c1463002ad1cac7',
        reaction: 'like',
        createdDate: '2021-10-12T06:38:00.783Z',
        updatedDate: '2021-10-12T06:38:00.783Z',
        id: '61652d48d3afcaf7a3795bbd'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '612e12231933190023f3e67e',
        reaction: 'like',
        createdDate: '2021-10-12T06:38:09.029Z',
        updatedDate: '2021-10-12T06:38:09.029Z',
        id: '61652d51d3afcaf7a3795bbe'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '613617fdf1a74700240c3b7e',
        reaction: 'like',
        createdDate: '2021-10-12T06:38:16.429Z',
        updatedDate: '2021-10-12T06:38:16.429Z',
        id: '61652d58d3afcaf7a3795bbf'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '612e419e62f14f001dfa4340',
        reaction: 'care',
        createdDate: '2021-10-12T06:38:25.817Z',
        updatedDate: '2021-10-12T06:38:25.817Z',
        id: '61652d61d3afcaf7a3795bc0'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '612f7c2d8f962b00246deb09',
        reaction: 'care',
        createdDate: '2021-10-12T06:38:35.338Z',
        updatedDate: '2021-10-12T06:38:35.338Z',
        id: '61652d6bd3afcaf7a3795bc1'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '614c675a8d0953002337ef89',
        reaction: 'celebrate',
        createdDate: '2021-10-12T06:38:47.033Z',
        updatedDate: '2021-10-12T06:38:47.033Z',
        id: '61652d77d3afcaf7a3795bc2'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '612cf5b16921eb0016e396b6',
        reaction: 'celebrate',
        createdDate: '2021-10-12T06:38:54.563Z',
        updatedDate: '2021-10-12T06:38:54.563Z',
        id: '61652d7ed3afcaf7a3795bc3'
      },
      {
        entityId: '6135c400db890b002f7af0e6',
        userId: '614c63ce8d0953002337ef88',
        reaction: 'celebrate',
        createdDate: '2021-10-12T06:39:04.117Z',
        updatedDate: '2021-10-12T06:39:04.117Z',
        id: '61652d88d3afcaf7a3795bc4'
      }
    ];

    mockSvc.getEntityReactions.mockReturnValue(expRes);
    const res = await mockSvc.getEntityReactions('6135c400db890b002f7af0e6');
    expect(res).toEqual(expRes);
  });
});
