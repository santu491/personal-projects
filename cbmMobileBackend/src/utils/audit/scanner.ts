import {APP} from '../app';
import {encrypt} from '../security/encryptionHandler';

export class Scanner {
  private static instance: Scanner;
  protected _maskProps: string[] = [];
  protected _encryptProps: string[] = [];

  private constructor() {
    this._maskProps = APP.config.security.maskedFields;
    this._encryptProps = APP.config.security.encryptedFields;
  }

  public static getInstance(): Scanner {
    if (!Scanner.instance) {
      Scanner.instance = new Scanner();
    }
    return Scanner.instance;
  }

  scanInput(
    input: Array<unknown> | object | string,
    propPath = 'root',
    propName = '',
    maxLength = 8000,
  ) {
    if (Array.isArray(input)) {
      for (const item of input) {
        this.scanInput(
          item as Array<unknown> | object | string,
          `${propPath}`,
          propName,
          maxLength,
        );
      }
    } else if (typeof input === 'object' && !(input instanceof Buffer)) {
      for (const prop in input) {
        (input as any)[prop] = this.scanInput(
          (input as any)[prop],
          `${propPath}.${prop}`,
          prop,
          maxLength,
        );
      }
    } else if (
      input != null &&
      !(input instanceof Buffer) &&
      typeof input !== 'undefined'
    ) {
      input = this.cleanInput(
        propName,
        `${propPath}`,
        typeof input === 'string' ? input : String(input),
      );
    }

    return input;
  }

  scanUrl(url: string) {
    const urlParts = url?.split('?');
    const newUrl = urlParts[0];
    const params = urlParts[1].split('&').map((param: string) => {
      const paramParts = param.split('=');
      if (this.fieldNeedMasking(paramParts[0], 'dummy')) {
        return `${paramParts[0]}=${this.maskedValue()}`;
      }
      if (this.fieldNeedEncrypting(paramParts[0], 'dummy')) {
        return `${paramParts[0]}=${this.maskedValue()}`;
      }
      return param;
    });
    return `${newUrl}?${params.join('&')}`;
  }

  protected maskedValue() {
    return '********';
  }

  protected cleanInput(
    propName: string,
    propPath: string,
    value: string,
  ): string {
    if (
      typeof value === 'string' &&
      this.fieldNeedMasking(propName, propPath)
    ) {
      return this.maskedValue();
    }

    if (
      typeof value === 'string' &&
      this.fieldNeedEncrypting(propName, propPath)
    ) {
      return encrypt(value);
    }

    return value;
  }

  protected fieldNeedMasking(propName: string, propPath: string): boolean {
    return (
      this._maskProps.indexOf(propPath) >= 0 ||
      this._maskProps.indexOf(propName) >= 0
    );
  }

  protected fieldNeedEncrypting(propName: string, propPath: string): boolean {
    return (
      this._encryptProps.indexOf(propPath) >= 0 ||
      this._encryptProps.indexOf(propName) >= 0
    );
  }
}
