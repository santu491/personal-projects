import * as crypto from 'crypto';
import { KEYS } from '../common';

export class Md5Hex {
  static hash(content: string): string {
    return crypto.createHash(KEYS.MD5).update(content).digest(KEYS.HEX);
  }
}
