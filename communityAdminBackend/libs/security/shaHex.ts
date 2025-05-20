import * as crypto from 'crypto';

export class ShaHex {
  static hash(content: string): string {
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }
}
