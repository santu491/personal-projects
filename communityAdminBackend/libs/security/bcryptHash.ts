import * as bcrypt from 'bcrypt';

export class BcryptHash {
  static async hash(content: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(content, saltRounds);
  }

  static async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
