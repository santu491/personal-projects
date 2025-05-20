import {
  API_RESPONSE,
  collections,
  mongoDbTables,
  queryStrings,
  Result,
  TranslationLanguage,
  translationLiterals,
  Validation
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database/mongoDatabaseClient';
import { ILogger, LoggerParam } from '@anthem/communityapi/logger';
import { Service } from 'typedi';
import {
  Community,
  CommunityCategory
} from '../models/communitiesModel';
import { PageParamModel } from '../models/pageParamModel';
import { BaseResponse } from '../models/resultModel';
import { User } from '../models/userModel';
import { CommunitiesHelper } from './helpers/communitiesHelper';

@Service()
export class CommunityService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result,
    private validate: Validation,
    private communitiesHelper: CommunitiesHelper,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async getAllCommunities(pageParams, language): Promise<BaseResponse> {
    try {
      let sortedCommunityList = [];
      const pageParam = new PageParamModel();
      pageParam.setPageNumber(pageParams.pageNumber);
      pageParam.setPageSize(pageParams.pageSize);
      pageParam.sort = pageParams.sort;
      const communityList = await this._mongoSvc.readAll(collections.COMMUNITY);
      communityList.forEach((community) => {
        if (language in community.displayName && community.displayName[language] !== '') {
          community.title = community.displayName[language];
        }
      });
      const start = (pageParams.pageNumber - 1) * pageParams.pageSize;
      const end = start + pageParams.pageSize;

      if (pageParam != null) {
        sortedCommunityList = this.validate.sort(
          communityList,
          pageParam.sort,
          mongoDbTables.community.createdAt
        );
      }

      sortedCommunityList = sortedCommunityList.slice(start, end);

      return this.result.createSuccess(sortedCommunityList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommunityById(id: string, language: string): Promise<BaseResponse> {
    try {
      const community: Community = await this._mongoSvc.readByID(
        collections.COMMUNITY,
        id
      );
      if (community === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }

      if (language in community.displayName && community.displayName[language] !== '') {
        community.title = community.displayName[language];
      }

      //Add categoryName parameter
      if (community.category === translationLiterals.cancer.en) {
        community[mongoDbTables.community.categoryName] = translationLiterals.cancer[language];
      }
      else {
        const category: Community = await this._mongoSvc.readByValue(
          collections.COMMUNITY,
          { title: community.category }
        );
        community[mongoDbTables.community.categoryName] = category.displayName[language];
      }
      return this.result.createSuccess(community);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAllCategories(language): Promise<BaseResponse> {
    try {
      const categoryList: CommunityCategory[] = [];
      const getAllCommunities = await this._mongoSvc.readAll(collections.COMMUNITY);

      // Change all the literals in getAllCommunities to spanish
      getAllCommunities.forEach((community) => {
        const categoryObj = getAllCommunities.filter((c) => c.displayName[TranslationLanguage.ENGLISH] === community.category)[0];
        if (language in community.displayName && community.displayName[language] !== '') {
          community.title = community.displayName[language];
        }
        community[mongoDbTables.community.categoryName] = categoryObj.displayName[language] === '' ? categoryObj.title : categoryObj.displayName[language];
      });

      if (getAllCommunities === null || getAllCommunities.length === 0) {
        return this.result.createSuccess(categoryList);
      }

      const categoryMap = {};

      getAllCommunities.forEach((community) => {
        if (community.categoryId in categoryMap) {
          categoryMap[community.categoryId].communities.push(this.getCommunityCategoryFromCommunity(community));
        }
        else {
          categoryMap[community.categoryId] = {
            category: community.category,
            categoryId: community.categoryId,
            parent: community.parent,
            categoryName: community[mongoDbTables.community.categoryName],
            communities: []
          };
          categoryMap[community.categoryId].communities.push(this.getCommunityCategoryFromCommunity(community));
        }
      });

      const communityArray = [];

      for (const [, community] of Object.entries(categoryMap)) {
        communityArray.push(community);
      }

      return this.result.createSuccess(communityArray);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommunities(
    pageParam: PageParamModel
  ): Promise<BaseResponse> {
    try {
      const communityList = await this._mongoSvc.readAll(collections.COMMUNITY);
      let sortedCommunityList = [];
      if (pageParam !== null) {
        const start = (pageParam.pageNumber - 1) * pageParam.pageSize;
        const end = start + pageParam.pageSize;
        sortedCommunityList = this.validate.sort(
          communityList,
          pageParam.sort,
          mongoDbTables.community.createdAt
        );
        sortedCommunityList = sortedCommunityList.slice(start, end);
      }
      return this.result.createSuccess(sortedCommunityList);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getAllCommunitiesNested(language: string): Promise<BaseResponse> {
    try {
      const communityList = await this._mongoSvc.readAllByValue(collections.COMMUNITY, {
        [mongoDbTables.community.active]: true
      });
      if (communityList === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail =
          API_RESPONSE.messages.communityDoesNotExist;
        return this.result.createError([this.result.errorInfo]);
      }
      const communityParentMap = {};
      const communityParentCount = {};

      communityList.forEach((community) => {
        if (community.parent in communityParentCount) {
          communityParentCount[community.parent] = communityParentCount[community.parent] + 1;
        } else {
          communityParentCount[community.parent] = 1;
        }

        if (community.parent in communityParentMap) {
          communityParentMap[community.parent].push(community);
        } else {
          communityParentMap[community.parent] = [];
          communityParentMap[community.parent].push(community);
        }
      });

      const communityMap = {};

      for (const [, communityArray] of Object.entries(
        communityParentMap
      )) {
        if (Array.isArray(communityArray)) {
          communityArray.forEach((community) => {
            if (community.category in communityMap) {
              communityMap[community.category].push(community);
            } else {
              communityMap[community.category] = [];
              communityMap[community.category].push(community);
            }
          });
        }
      }

      let nestedCommunityObject = [];
      const multiCommunityHandlerObj = {};

      for (const [category, communityArray] of Object.entries(communityMap)) {
        if (Array.isArray(communityArray)) {
          if (
            communityArray.length === 1 &&
            category === communityArray[0].parent
          ) {
            nestedCommunityObject.push({
              id:
                communityArray[0].id,
              name: category,
              isChecked: false,
              children: null
            });
          } else {
            if (!(communityArray[0].parent in multiCommunityHandlerObj)) {
              multiCommunityHandlerObj[communityArray[0].parent] = {
                id: communityArray[0].parent,
                name: communityArray[0].parent,
                isChecked: false,
                count: communityParentCount[communityArray[0].parent],
                children: []
              };
            }

            if (communityArray.length === 1) {
              multiCommunityHandlerObj[communityArray[0].parent].children.push({
                id:
                  communityArray[0].id,
                name: category,
                isChecked: false,
                children: null
              });
            } else {
              const childCommunityList = [];

              communityArray.forEach((childCommunity) => {
                childCommunityList.push({
                  id:
                    childCommunity.id,
                  name: childCommunity.title,
                  isChecked: false,
                  children: null
                });

                let addFlag = true;
                multiCommunityHandlerObj[
                  communityArray[0].parent
                ].children.forEach((child) => {
                  if (child.name === category) {
                    addFlag = false;
                  }
                });

                if (addFlag) {
                  multiCommunityHandlerObj[
                    communityArray[0].parent
                  ].children.push({
                    id: communityArray[0].categoryId,
                    name: category,
                    isChecked: false,
                    children: childCommunityList,
                    count: communityArray.length
                  });
                }
              });
            }
          }
        }
      }

      const childrenAttribute = 'children';

      for (const [, value] of Object.entries(multiCommunityHandlerObj)) {
        if (value && value[childrenAttribute] && Array.isArray(value[childrenAttribute])) {
          value[childrenAttribute].sort((a, b) => (a.name > b.name) ? 1 : (a.name === b.name) ? ((a.name > b.name) ? 1 : -1) : -1);
        }
        nestedCommunityObject.push(value);
      }
      nestedCommunityObject.sort((a, b) => a.name > b.name ? 1 : -1);

      if (language !== TranslationLanguage.ENGLISH) {
        nestedCommunityObject = this.translateCommunityName(nestedCommunityObject, communityList, language);
      }

      return this.result.createSuccess(nestedCommunityObject);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getMyCommunities(
    language: string,
    userId: string
  ): Promise<BaseResponse> {
    try {
      let communities: Community[] = [];
      const user: User = await this._mongoSvc.readByID(
        collections.USERS,
        userId
      );
      if (user?.myCommunities) {
        communities = await this.communitiesHelper.getMultipleCommunities(user.myCommunities, language);
      }
      return this.result.createSuccess(communities);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  /**
   * Executes an aggregate pipeline in stages to retrieve an identifier as to the most recent activity
   * @param activeCommunityId Get the community id
   * @returns return recent activity for that community id
   */
  public async getActivePageForCommunity(
    activeCommunityId: string
  ): Promise<BaseResponse> {
    try {
      const getPostForCommunity = {
        $match: {
          [mongoDbTables.posts.published]: true,
          [mongoDbTables.posts.communities]: {
            $elemMatch: { $in: [ activeCommunityId ] }
          }
        }
      };
      const sortOnPublishedDate = {
        $sort: { [mongoDbTables.posts.publishedAt]: -1 }
      };
      const limitToOne = { $limit: 1 };
      // the name od post publishedAt is changed so that the story publishedAt is not affected
      const changeNameOfPublishedDate = {
        $project: {
          [queryStrings.communityRecentActivity.projectAsPostPublishedAt]: queryStrings.communityRecentActivity.publishedAtValue,
          [mongoDbTables.posts.communities]: 1
        }
      };
      const lookupInStoriesWithCommunityId = {
        $lookup: {
          from: collections.STORY,
          localField: mongoDbTables.posts.communities,
          foreignField: mongoDbTables.story.communityId,
          as: queryStrings.communityRecentActivity.lookupName
        }
      };
      //Filter the lookup stories for only those that are published
      const filterPublishedStories = {
        $project: {
          [queryStrings.communityRecentActivity.projectAsPublishedStories]: {
            $map: {
              input: {
                $filter: {
                  input: queryStrings.communityRecentActivity.lookupValue,
                  as: queryStrings.communityRecentActivity.filterAsStory,
                  cond: queryStrings.communityRecentActivity.filterCondition
                }
              },
              as: queryStrings.communityRecentActivity.mapAsPublishedStory,
              in: {
                [mongoDbTables.story.published]: queryStrings.communityRecentActivity.publishedValueOfStory,
                [mongoDbTables.story.publishedAt]: queryStrings.communityRecentActivity.publishedAtValueOfStory
              }
            }
          },
          [queryStrings.communityRecentActivity.projectAsPostPublishedAt]: 1
        }
      };
      const unwindStories = { $unwind: queryStrings.communityRecentActivity.projectAsPublishedStoriesValue };
      const filterStoriesWithDate = {
        $redact: {
          $cond: [
            { $gt: [queryStrings.communityRecentActivity.projectAsPostPublishedAtValue, queryStrings.communityRecentActivity.publishedAtOfStories] },
            queryStrings.prune,
            queryStrings.keep
          ]
        }
      };

      const storyRecentActivity = await this._mongoSvc.readByAggregate(collections.POSTS,
        [getPostForCommunity, sortOnPublishedDate, limitToOne, changeNameOfPublishedDate, lookupInStoriesWithCommunityId, filterPublishedStories, unwindStories, filterStoriesWithDate]);

      return this.result.createSuccess({ [ activeCommunityId ]: storyRecentActivity.length > 0 ? 'STORY': 'POSTS' });
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getCommunityImage(id: string): Promise<BaseResponse> {
    try {
      const query = {
        [mongoDbTables.communityImage.communityId]: id
      };
      const image = await this._mongoSvc.readByValue(collections.COMMUNITYIMAGES, query);
      if (image === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.missingImage;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(image);

    } catch (error) {
      return this.result.createException((error as Error).message);
    }
  }

  private translateCommunityName(nestedCommunities, communityList, language) {
    nestedCommunities.forEach((communityObj) => {
      const communityName = communityObj.name;
      const community = communityList.filter((c) => c.title === communityName)[0];
      if (community !== undefined) {
        if (language in community.displayName && community.displayName[language] !== '') {
          communityObj.name = community.displayName[language];
        }
      }
      if (communityName === translationLiterals.cancer.en) {
        communityObj.name = translationLiterals.cancer.es;
      }
      if (communityObj.children !== null) {
        communityObj.children = this.translateCommunityName(communityObj.children, communityList, language);
      }
    });
    return nestedCommunities;
  }

  private getCommunityCategoryFromCommunity(category) {
    delete category[mongoDbTables.community.category];
    delete category[mongoDbTables.community.createdBy];
    delete category[mongoDbTables.community.categoryId];

    return category;
  }
}
