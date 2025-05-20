import { collections, mongoDbTables } from '@anthem/communityapi/common';
import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { Service } from 'typedi';

@Service()
export class LoginServiceHelper {
  constructor(private mongoService: MongoDatabaseClient) {}

  async isDemoUser(username?: string) {
    let isDemoUser = false;

    /* Query to ignore the case */
    const query = { $regex: username, $options: 'i' };

    const user = await this.mongoService.readByValue(collections.DEMOUSERS, {
      [mongoDbTables.demousers.username]: query
    });
    if (user) {
      isDemoUser = true;
    }
    return isDemoUser;
  }
}
