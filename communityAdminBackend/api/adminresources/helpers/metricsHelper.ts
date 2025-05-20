import {
  collections,
  genericQueryValue,
  MEMBER_TYPE,
  mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { Service } from 'typedi';
import { FindQuery } from '../models/commonModel';

@Service()
export class MetricsHelper {
  constructor(private _mongoSvc: MongoDatabaseClient) {}

  async getUsersCount(demoUsers: RegExp[], fromDate?: string, toDate?: string) {
    const result = {};
    const totalCount = await this._mongoSvc.getUsersCountByMemberType(
      collections.USERS,
      demoUsers,
      '',
      fromDate,
      toDate
    );
    result['totalCount'] = totalCount;
    result['commercialUsers'] = await this._mongoSvc.getUsersCountByMemberType(
      collections.USERS,
      demoUsers,
      'eMember',
      fromDate,
      toDate
    );

    let findQuery: FindQuery = {
      [genericQueryValue.match]: {
        [mongoDbTables.users.username]: { [genericQueryValue.notIn]: demoUsers },
        [mongoDbTables.users.memberType]: {
          [genericQueryValue.notIn]: [MEMBER_TYPE.SYDNEY_HEALTH]
        }
      }
    };

    if (fromDate && toDate) {
      findQuery = {
        [genericQueryValue.match]: {
          [mongoDbTables.users.username]: { [genericQueryValue.notIn]: demoUsers },
          [mongoDbTables.users.memberType]: {
            [genericQueryValue.notIn]: [MEMBER_TYPE.SYDNEY_HEALTH]
          },
          [mongoDbTables.users.createdAt]: {
            [genericQueryValue.greaterThanEqual]: new Date(fromDate),
            [genericQueryValue.lessThan]: new Date(toDate)
          }
        }
      };
    }

    const distinctMarketsQuery: FindQuery[] = [
      findQuery,
      {
        [genericQueryValue.group]: {
          [mongoDbTables.users.id]: '$memberType',
          [genericQueryValue.count]: { [genericQueryValue.sum]: 1 }
        }
      },
      {
        [genericQueryValue.group]: {
          _id: null,
          counts: {
            $push: { k: '$_id', v: '$count' }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: '$counts' }
        }
      }
    ];

    const distinctMarkets = await this._mongoSvc.readByAggregate(
      collections.USERS,
      distinctMarketsQuery
    );
    result['medicaidUsers'] = this.sortMarketBrands(distinctMarkets[0]);

    return result;
  }

  async getUsersWhoJoinedMoreThanOneCommunity<T>(
    demoUsers: RegExp[],
    fromDate?: string,
    toDate?: string,
    memberType?: string
  ) {
    const result = [];
    const communityCountFilter = [];

    let zeroSearchFilter = {};
    if (memberType) {
      zeroSearchFilter = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        [mongoDbTables.users.memberType]: memberType,
        $or: [
          { [mongoDbTables.users.myCommunities]: { $exists: false } },
          { [mongoDbTables.users.myCommunities]: [] }
        ]
      };
      communityCountFilter.push({
        $match: {
          [mongoDbTables.users.username]: { $nin: demoUsers },
          [mongoDbTables.users.memberType]: memberType
        }
      });
    }
    else {
      zeroSearchFilter = {
        [mongoDbTables.users.username]: { $nin: demoUsers },
        $or: [
          { [mongoDbTables.users.myCommunities]: { $exists: false } },
          { [mongoDbTables.users.myCommunities]: [] }
        ]
      };
      communityCountFilter.push({
        $match: {
          [mongoDbTables.users.username]: { $nin: demoUsers }
        }
      });
    }

    if (fromDate && toDate) {
      zeroSearchFilter[mongoDbTables.users.createdAt] = {
        $gte: new Date(fromDate),
        $lt: new Date(toDate)
      };
      communityCountFilter[0].$match[mongoDbTables.users.createdAt] = {
        [genericQueryValue.greaterThanEqual]: new Date(fromDate),
        [genericQueryValue.lessThan]: new Date(toDate)
      };
    }

    const zeroCommunityUsers = await this._mongoSvc.getDocumentCount(
      collections.USERS,
      zeroSearchFilter
    );

    result.push({
      numberOfCommunities: 0,
      userCount: zeroCommunityUsers
    });

    communityCountFilter.push(...[
      {
        $unwind: mongoDbTables.users.myCommunitiesValue
      },
      {
        $group: {
          _id: genericQueryValue.idValue,
          size: {
            $sum: 1
          }
        }
      },
      {
        $group: {
          _id: genericQueryValue.size,
          frequency: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          size: genericQueryValue.idValue,
          frequency: 1,
          _id: 0
        }
      },
      {
        $sort: {
          size: 1
        }
      }
    ]);

    const communityUserCount = await this._mongoSvc.readByAggregate(
      collections.USERS,
      communityCountFilter
    );

    for (const communityCount of communityUserCount) {
      result.push({
        numberOfCommunities: communityCount['size'],
        userCount: communityCount['frequency']
      });
    }
    return result;
  }

  /**
   * Gives a count of user which enabled pn
   * @param userIds User Ids for which installation needs to be checked
   * @returns userCount
   */
  public async getPNEnabledUserCount(userIds: string[]) {
    const installationSearch = {
      [mongoDbTables.installations.userId]: {
        $in: userIds
      },
      [mongoDbTables.installations.devices]: {
        $exists: true,
        $not: { $size: 0 }
      }
    };
    const result = await this._mongoSvc.getRowCount(collections.INSTALLATIONS, installationSearch);
    return result ?? 0;
  }

  private sortMarketBrands(brandsObject) {
    const sortableArray = [];
    for (const brand in brandsObject) {
      const marketsections = brand.split('-');
      sortableArray.push([
        marketsections[marketsections.length - 1],
        brand,
        brandsObject[brand]
      ]);
    }
    sortableArray.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });
    const sortedBrands = {};
    sortableArray.forEach((arr) => {
      sortedBrands[arr[1]] = arr[2];
    });
    return sortedBrands;
  }
}
