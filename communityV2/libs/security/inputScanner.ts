import * as ESAPI from 'node-esapi';
import * as sanitizeHtml from 'sanitize-html';
import { Service } from 'typedi';
import { EncryptionUtil } from './encryptionUtil';
import { HtmlSanitizer } from './htmlSanitizer';
import { SecurityError } from './securityError';

interface IInputObject {
  [key: string]: Array<unknown> | object | string;
}

@Service()
export class InputScanner {
  protected _maskProps: string[] = [];
  protected _encodeProps: string[] = [];
  protected _passthroughProps: string[] = [];
  protected _whitelistProps: { [key: string]: string } = {};
  protected _htmlSanitizer: HtmlSanitizer;
  protected _encryptedProps: string[] = [];

  constructor(
    maskProps: string[],
    encodeProps: string[],
    passthroughProps: string[],
    whitelistProps = {},
    sanitizerConfig: { allowedTags?: string[]; allowedAttributes?: { [index: string]: sanitizeHtml.AllowedAttribute[] } | boolean } = {},
    encryptedProps: string[]
  ) {
    this._encodeProps = encodeProps || [];
    this._maskProps = maskProps || [];
    this._passthroughProps = passthroughProps || [];
    this._whitelistProps = whitelistProps || {};
    this._htmlSanitizer = new HtmlSanitizer(sanitizerConfig.allowedTags, sanitizerConfig.allowedAttributes);
    this._encryptedProps = encryptedProps || [];
  }

  scanInput(input: Array<unknown> | object | string, propPath = 'root', propName = '', maxLength = 8000) {
    if (Array.isArray(input)) {
      for (const item of input) {
        this.scanInput(item as Array<unknown> | object | string, `${propPath}`, propName, maxLength);
      }
    } else if (typeof input === 'object' && !(input instanceof Buffer)) {
      for (const prop in input) {
        (input as IInputObject)[prop] = this.scanInput((input as IInputObject)[prop], `${propPath}.${prop}`, prop, maxLength);
      }
    } else if (input != null && !(input instanceof Buffer) && typeof input !== 'undefined') {
      // Commenting below code to allow base64 string in request body
      // if (input.toString().length > maxLength) {
      //   throw new SecurityError(`json value ${propName} exceeds max length ${maxLength}`);
      // }
      input = this.cleanInput(propName, `${propPath}`, input);
    }

    return input;
  }

  scanUrlParams(url: string): string {
    if (url.indexOf('?') >= 0) {
      let params = url.split('?')[1].split('&');
      let newUrl = `${url.split('?')[0]}?`;
      params = (params || []).map((param: string) => {
        const paramParts = param.split('=');
        if (paramParts.length > 1 && this.propNeedMasking(paramParts[0], 'dummy')) {
          return `${paramParts[0]}=****`;
        }

        return param;
      });

      newUrl = newUrl + params.join('&');
      return newUrl;
    }

    return url;
  }

  protected maskSensitiveProp(input: string): string {
    return '****';
  }

  protected cleanInput(propName: string, propPath: string, value: string): string {
    if (typeof value === 'string' && this.propNeedMasking(propName, propPath)) {
      return this.maskSensitiveProp(value);
    }

    if (typeof value === 'string' && this.propSkipCleaning(propName, propPath)) {
      return value;
    }

    if (typeof value === 'string' && this.propNeedDencrypted(propName, propPath)) {
      return this.dencryptProp(value);
    }

    if (typeof value === 'string' && this.propNeedEncoding(propName, propPath)) {
      return ESAPI.encoder().encodeForHTML(value);
    } else {
      return this.sanitizeInput(propName, propPath, value);
    }
  }

  protected propNeedDencrypted(propName: string, propPath: string): boolean {
    return this._encryptedProps.indexOf(propPath) >= 0 || this._encryptedProps.indexOf(propName) >= 0;
  }

  protected dencryptProp(value: string): string {
    return EncryptionUtil.decrypt(value, 'aes');
  }

  protected sanitizeInput(propName: string, propPath: string, value: string): string {
    if (typeof value === 'string') {
      const whitelistRegEx = this.propNeedWhitelistSanitize(propName, propPath);
      if (whitelistRegEx) {
        if (!new RegExp(whitelistRegEx as string, 'ig').test(value)) {
          throw new SecurityError(`Invalid whitelist characters on ${propPath}`);
        }
        return value;
      }
      return this._htmlSanitizer.sanitize(value);
    } else {
      return value;
    }
  }

  protected propNeedWhitelistSanitize(propName: string, propPath: string): boolean | string {
    if (typeof this._whitelistProps[propPath] !== 'undefined') {
      return this._whitelistProps[propPath];
    } else if (typeof this._whitelistProps[propName] !== 'undefined') {
      return this._whitelistProps[propName];
    } else if (typeof this._whitelistProps.default !== 'undefined') {
      return this._whitelistProps.default;
    } else {
      return false;
    }
  }

  protected propNeedMasking(propName: string, propPath: string): boolean {
    return this._maskProps.indexOf(propPath) >= 0 || this._maskProps.indexOf(propName) >= 0;
  }

  protected propNeedEncoding(propName: string, propPath: string): boolean {
    return this._encodeProps.indexOf(propPath) >= 0 || this._encodeProps.indexOf(propName) >= 0;
  }

  protected propSkipCleaning(propName: string, propPath: string): boolean {
    return this._passthroughProps.indexOf(propPath) >= 0 || this._passthroughProps.indexOf(propName) >= 0;
  }
}
