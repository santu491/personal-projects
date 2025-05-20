import { HttpMethod } from '@anthem/communityapi/http';
import { IRestResponse, ResponseType, RestClient } from '@anthem/communityapi/rest';
import { APP } from '@anthem/communityapi/utils';
import { Service } from 'typedi';
import { IMessageProducer } from '../models/pushNotificationModel';
import { InternalService } from './internalService';

@Service()
export class PNMessagerService {
  constructor(private _http: RestClient,
    private _internalService: InternalService) { }

  public async sendMessage(notificationObject: IMessageProducer): Promise<IRestResponse> {
    const authDetails = await this._internalService.getAuth();
    const token = authDetails['access_token'];
    return this._http.invoke<IRestResponse>({
      url: APP.config.restApi.internal.messageProducerUrl,
      method: HttpMethod.Post,
      data: notificationObject,
      headers: [
        {
          name: 'apikey',
          value: APP.config.restApi.internal.apiKey
        },
        {
          name: 'Authorization',
          value: 'Bearer ' + token
        },
        {
          name: 'Accept',
          value: 'application/json'
        }
      ],
      responseType: ResponseType.JSON
    });
  }

  public getGuid(): string {
    // Generates Guid
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      '-' +
      s4() +
      s4() +
      s4()
    );
  }
}
