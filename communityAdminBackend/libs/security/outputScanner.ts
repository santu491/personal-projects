import { Service } from 'typedi';
import { EncryptionUtil } from './encryptionUtil';

interface IInputObject {
  [key: string]: Array<unknown> | object | string;
}

@Service()
export class OutputScanner {
  protected _errorProps: string[] = [];
  protected _errorInfo: { [key: string]: string } = {};
  protected _encryptedProps: string[] = [];

  constructor(errorProps: string[], errorInfo: { [key: string]: string } = {}, encryptedProps: string[]) {
    this._errorProps = errorProps;
    this._errorInfo = errorInfo;
    this._encryptedProps = encryptedProps;
  }

  scanInput(input: string | object | Array<unknown>, httpStatus: string, propPath = 'root', propName = '') {
    if (Array.isArray(input)) {
      for (let item of input) {
        item = this.scanInput((item as unknown) as string | object | Array<unknown>, httpStatus, `${propPath}`, propName);
      }
    } else if (typeof input === 'object' && !(input instanceof Buffer)) {
      for (const prop in input) {
        const cPropPath = `${propPath}.${prop}`;
        if (this.propNeedErrorSuppress(prop, cPropPath)) {
          (input as IInputObject)[prop] = this.suppressErrors(prop, cPropPath, httpStatus);
        } else {
          (input as IInputObject)[prop] = this.scanInput((input as IInputObject)[prop], httpStatus, cPropPath, prop);
        }
      }
    } else if (input != null && !(input instanceof Buffer) && typeof input !== 'undefined') {
      input = this.cleanInput(propName, `${propPath}`, input, httpStatus);
    }

    return input;
  }

  protected cleanInput(propName: string, propPath: string, value: string | object, httpStatus: string): string | object {
    if (this.propNeedErrorSuppress(propName, propPath)) {
      return this.suppressErrors(propName, propPath, httpStatus);
    } else if (typeof value === 'string' && this.propNeedEncrypted(propName, propPath)) {
      return this.encryptProp(value, propName);
    }

    return value;
  }

  protected suppressErrors(propName: string, propPath: string, httpStatus: string): string {
    const defaultError = this._errorInfo[`${propName}`] || this._errorInfo[`${propPath}`] || 'Application Error';
    return this._errorInfo[`${httpStatus}.${propName}`] || this._errorInfo[`${httpStatus}.${propPath}`] || defaultError;
  }

  protected propNeedErrorSuppress(propName: string, propPath: string): boolean {
    return this._errorProps.indexOf(propPath) >= 0 || this._errorProps.indexOf(propName) >= 0;
  }

  protected propNeedEncrypted(propName: string, propPath: string): boolean {
    return this._encryptedProps.indexOf(propPath) >= 0 || this._encryptedProps.indexOf(propName) >= 0;
  }

  protected encryptProp(value: string, propName: string): string {
    return EncryptionUtil.encrypt(value, 'aes');
  }
}
