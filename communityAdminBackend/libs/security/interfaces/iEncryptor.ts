export interface IEncryptor {
  encrypt(textToEncrypt: string): string;
  decrypt(textToDecrypt: string): string;
}
