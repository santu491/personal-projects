import {
  API_RESPONSE,
  Result,
  collections,
  mongoDbTables
} from '@anthem/communityadminapi/common';
import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { PartnerRequest, Partners } from '../models/partnersModel';

@Service()
export class PartnersService {
  constructor(
    private result: Result,
    private mongoSvc: MongoDatabaseClient,
    @LoggerParam(__filename) private _log: ILogger
  ) {}

  public async createPartner(partnerModel: PartnerRequest) {
    try {
      const partnerData = this.createPartnerModel(partnerModel);

      const partner = await this.mongoSvc.insertValue(
        collections.PARTNERS,
        partnerData
      );
      partner.id = partner[mongoDbTables.partners.id];
      delete partner[mongoDbTables.partners.id];

      return this.result.createSuccess(partner);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPartnerById(id: string) {
    try {
      const partner = await this.mongoSvc.readByID(collections.PARTNERS, id);
      if (partner === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.imageNotFound;
        return this.result.createError([this.result.errorInfo]);
      }

      return this.result.createSuccess(partner);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async getPartners(active: boolean) {
    try {
      let partners;
      if (active) {
        partners = await this.mongoSvc.readAllByValue(collections.PARTNERS, {
          [mongoDbTables.partners.active]: active
        });
      }
      else {
        partners = await this.mongoSvc.readAll(collections.PARTNERS);
      }

      return this.result.createSuccess(partners);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  public async updatePartner(partnerId: string, partnerModel: PartnerRequest) {
    try {
      const partnerData = this.createPartnerModel(partnerModel);

      const partner = await this.mongoSvc.readByID(
        collections.PARTNERS,
        partnerId
      );
      if (partner === null) {
        this.result.errorInfo.title = API_RESPONSE.messages.badData;
        this.result.errorInfo.detail = API_RESPONSE.messages.invalidIdTitle;
        return this.result.createError([this.result.errorInfo]);
      }
      const query = {
        [mongoDbTables.partners.id]: new ObjectID(partnerId)
      };
      const updateQuery = {
        $set: partnerData
      };
      const updateStatus = await this.mongoSvc.updateByQuery(
        collections.PARTNERS,
        query,
        updateQuery
      );

      return this.result.createSuccess(updateStatus > 0);
    } catch (error) {
      this._log.error(error as Error);
      return this.result.createException((error as Error).message);
    }
  }

  private createPartnerModel(request: PartnerRequest): Partners {
    return {
      title: request.title,
      logoImage: request.logoImage,
      active: request?.active ?? true,
      articleImage: request?.articleImage ?? null,
      type: request?.type ?? null
    };
  }
}
