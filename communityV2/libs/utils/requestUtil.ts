import { Service } from 'typedi';
import { APP } from './app';

@Service()
export class RequestUtil {
  static getUsername(headers: { [key: string]: string }, params: { [key: string]: string }) {
    let username = headers['smuniversalid'];
    if (!username || username.toLowerCase() === APP.config.jwt.emulationUsername) {
      username = headers['emulateuser'] || params['emulateuser'] || params['EMULATEUSER'];
    }
    return username || '';
  }

  static getAuthToken(headers: { [key: string]: string }, params: { [key: string]: string }): string {
    return (headers['authorization'] || params['authorization'] || params['Authorization'] || '').replace('Bearer', '').trim();
  }

  static getWebGuid(headers: { [key: string]: string }, body: { [key: string]: string }): string {
    return headers['webGuid'] || body['webGuid'] || '';
  }

  static getmetaConsumer(headers: { [key: string]: string }, body: { [key: string]: string }): string {
    return headers['meta-consumer'] || body['meta-consumer'] || '';
  }
}
