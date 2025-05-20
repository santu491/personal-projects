import {Scanner} from './scanner';

export class AuditFilter {
  getAuditedBody = (input: any) => {
    let req = '';
    if (typeof input?.data === 'undefined') {
      return req;
    }

    req = JSON.stringify(this.maskData(input.data));
    return req;
  };

  getRequestUrl = (config: any) => {
    if (config?.url?.indexOf('?') >= 0) {
      return Scanner.getInstance().scanUrl(config.url);
    }
    return config.url;
  };

  maskData(input: object | string | Array<unknown> | unknown) {
    let inputCopy;
    try {
      if (typeof input === 'string') {
        inputCopy = JSON.parse(input);
      } else {
        inputCopy = input;
      }
    } catch (error) {
      inputCopy = input;
    } finally {
      if (typeof inputCopy === 'object' || Array.isArray(inputCopy)) {
        inputCopy = Scanner.getInstance().scanInput(
          JSON.parse(JSON.stringify(inputCopy)),
        );
      }
    }
    return inputCopy;
  }

  getAuditedRequestHeaders = (input: unknown) => {
    let req = '';
    if (typeof input === 'undefined') {
      return req;
    }

    req = JSON.stringify(this.maskData(input));
    return req;
  };

  getAuditedRequestBody = (input: unknown) => {
    let req = '';
    if (typeof input === 'undefined') {
      return req;
    }

    req = JSON.stringify(this.maskData(input));
    return req;
  };
}
