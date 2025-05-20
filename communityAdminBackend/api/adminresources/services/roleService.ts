import { API_RESPONSE, collections, mongoDbTables, Result } from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { Service } from 'typedi';

@Service()
export class RoleService {
  constructor(
    private _mongoSvc: MongoDatabaseClient,
    private result: Result
  ) { }

  public async getRoleAccess(adminId: string, role: string) {
    const adminRole = await this._mongoSvc.readByValue(collections.ADMINROLES, { [mongoDbTables.adminRoles.role]: role });
    const admin = await this._mongoSvc.readByID(collections.ADMINUSERS, adminId);
    if (!adminRole || !admin || admin.role !== role) {
      this.result.errorInfo.title = API_RESPONSE.messages.badData;
      this.result.errorInfo.detail = API_RESPONSE.messages.invalidAdminWithRole;
      return this.result.createError(this.result.errorInfo);
    }

    return adminRole.permissions;
  }
}
