import {
  collections,
  mongoDbTables,
  TranslationLanguage
} from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { Community } from 'api/communityresources/models/communitiesModel';
import { ObjectId } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class CommunitiesHelper {
  constructor(private mongoService: MongoDatabaseClient) {}

  /**
   * Returns communities object for the strings passed
   * @param communitiesList community ids
   * @param language language
   * @returns communities as objects
   */
  public async getMultipleCommunities(communitiesList: string[], language) {
    const communityIdArray = [];
    communitiesList.forEach((community) => {
      communityIdArray.push(new ObjectId(community));
    });

    const communitiesData = await this.mongoService.readByIDArray(
      collections.COMMUNITY,
      communityIdArray
    );
    const communities = communitiesData;

    communities.forEach(async (community) => {
      await this.buildCommunity(community, language);
    });

    return communities;
  }

  public async buildCommunity(
    community: Community,
    language: string
  ): Promise<void> {
    community.id = community[mongoDbTables.community.id].toHexString();
    delete community[mongoDbTables.community.id];
    community[mongoDbTables.community.categoryName] = community.category;

    if (language !== TranslationLanguage.ENGLISH) {
      if (
        language in community.displayName &&
        community.displayName[language] !== ''
      ) {
        community.title = community.displayName[language];
      }
      //set category name with translated content
      if (community.category === community.displayName.en) {
        community[mongoDbTables.community.categoryName] = community.title;
      } else {
        const categoryCommunity: Community = await this.mongoService.readByValue(
          collections.COMMUNITY,
          { title: community.category }
        );
        community[mongoDbTables.community.categoryName] =
          categoryCommunity.displayName[language] !== ''
            ? categoryCommunity.displayName[language]
            : categoryCommunity.displayName.en;
      }
    }
  }
}
