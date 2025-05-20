import { AuditCode, AuditHelper, AuditParam } from '@anthem/communityadminapi/audit';
import { BufferStream, HttpClient, IHttpRequest, IHttpResponse } from '@anthem/communityadminapi/http';
import { Audit, ILogger, LoggerParam } from '@anthem/communityadminapi/logger';
import { APP } from '@anthem/communityadminapi/utils';
import { ClassTransformOptions } from 'class-transformer';
import { ClassType } from 'class-transformer/cjs/ClassTransformer';
import { HttpError } from 'routing-controllers';
import { Service } from 'typedi';
import { IRestRequest, ResponseType } from './interfaces/iRestRequest';
import { JsonTransformer } from './jsonTransformer';
import { RestRequestInterceptor } from './restReqInterceptor';

@Service()
export class RestClient {
  constructor(private http: HttpClient, @LoggerParam(__filename) private log: ILogger, private _jsonTrans: JsonTransformer) {
    this.http.addRequestInterceptor(new RestRequestInterceptor());
  }

  invoke<T>(request: IRestRequest, responseClass?: ClassType<unknown>, transformOptions: ClassTransformOptions = {}): Promise<T> {
    const startTime = new Date();
    const options: IHttpRequest = {
      url: request.url,
      urlParams: request.urlParams,
      headers: request.headers,
      method: request.method,
      timeout: request.timeout,
      data: request.data,
      noSsl: APP.config.restApi.noSsl,
      proxy: APP.config.restApi.proxy,
      requestInterceptors: request.requestInterceptors,
      responseInterceptors: request.responseInterceptors,
      isMultiPartRequest: request.isMultiPartRequest,
      cacheable: request.cacheable,
      cacheExpiry: request.cacheExpiry,
      isFormData: request.isFormData,
      keepAlive: APP.config.restApi.keepAliveSocket,
      skipReplaceHost: request.skipReplaceHost,
      resetCache: request.resetCache
    };

    if (request.responseType === ResponseType.BINARY || request.responseType === ResponseType.BINARY_RAW) {
      options.raw = true;
    }
    return this.http.request(options).then(
      (response) => {
        if (!request.skipAudit) {
          this.audit(request, response, startTime);
        }
        const rawResponse = response;
        if (request.responseType === ResponseType.BINARY) {
          rawResponse.body = this.handleBinaryResponses(response);
        } else {
          if (responseClass) {
            const r = this._jsonTrans.jsonToClass<T>(response.body as string, responseClass) as object;
            rawResponse.body = r;
          } else {
            rawResponse.body = response.body;
          }
        }

        if (request.allowRawResponse) {
          return rawResponse;
        } else {
          return rawResponse.body;
        }
      },
      (err) => {
        this.audit(request, err, startTime);
        //Instead of throwing HTTPException to routing-controllers we can return the execption to controller and handle there in case it needs to do so.
        if (request.allowExceptions === true) {
          return err;
        } else {
          throw new HttpError(err.status, err.body);
        }
      }
    );
  }

  //tslint:disable
  protected handleBinaryResponses(resp: IHttpResponse): typeof BufferStream {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return new BufferStream(resp.body as Buffer);
  }
  //tslint:enable

  protected audit(request: IRestRequest, response: IHttpResponse, startTime: Date) {
    try {
      const endTime = (new Date() as unknown) as number;
      const audit = new Audit();
      audit.code = AuditCode.REST_GATEWAY;
      audit.parameters = [
        {
          name: AuditParam.HTTP_METHOD,
          value: request.method
        },
        {
          name: AuditParam.RESPONSE_STATUS,
          value: response.status
        },
        {
          name: AuditParam.REQUESTNAME,
          value: this.getRequestNameForAudit(request)
        },
        {
          name: AuditParam.OUT_URL,
          value: this.getRequestUrlForAudit(response.requestUrl)
        },
        {
          name: AuditParam.ELAPSED,
          value: endTime - ((startTime as unknown) as number)
        },
        {
          name: AuditParam.REQUEST,
          value: this.getRequestForAudit(request)
        },
        {
          name: AuditParam.RESPONSE,
          value: this.getResponseForAudit(request, response)
        }
      ];

      this.log.audit(audit);
    } catch (e) {
      this.log.error(`error CALLED_HTTP_GATEWAY audit: ${e}`);
    }
  }

  protected getRequestUrlForAudit(url: string): string {
    return AuditHelper.maskUrlParams(url);
  }

  protected getRequestNameForAudit(request: IRestRequest): string {
    if (typeof request.requestName === 'undefined' || request.requestName === '') {
      if (request.url) {
        const p1 = request.url.lastIndexOf('/');
        const p2 = request.url.indexOf('?', p1);
        request.requestName = (request.method ? request.method : '') + request.url.substring(p1 + 1, p2 >= 0 ? p2 : undefined) + 'Request';
        return request.requestName;
      }
      return '';
    }
    return request.requestName;
  }

  protected getRequestForAudit(request: IRestRequest): string {
    let req = '';
    if (typeof request.data === 'undefined') {
      return req;
    }

    let data = request.data;
    if (request.isMultiPartRequest) {
      //pick only data portion from multipart request, and drop files from audit
      const { files, ...rest } = request.data as { files: Blob[], [key: string]: unknown};
      data = rest;
    }

    try {
      req = JSON.stringify(this.needRequestMasking(request.url) ? AuditHelper.maskProps(data) : data);
    } catch (e) {
      this.log.error(`error parsing request to json: ${e}`);
    }

    return req;
  }

  protected getResponseForAudit(request: IRestRequest, response: IHttpResponse): string {
    if (response.status >= 200 && response.status <= 206 && this.needSkipResponseBody(request.url)) {
      return 'response body skipped';
    }

    let resp = '';
    if (request.responseType === ResponseType.JSON) {
      try {
        resp = JSON.stringify(this.needResponseMasking(request.url) ? AuditHelper.maskProps(response.body) : response.body);
      } catch (e) {
        this.log.error(`error parsing response content-type: ${response.headers['content-type'] || ''}`);
        this.log.error(`error parsing response to json: ${e}`);
      }
    } else if (request.responseType === ResponseType.TEXT) {
      resp = response.body as string;
    }

    //do not handle binary responses
    return resp;
  }

  protected needRequestMasking(url: string): boolean {
    for (const regExString of APP.config.audit.restMaskRequestUrls || []) {
      const regex = new RegExp(regExString, 'gi');
      if (regex.test(url)) {
        return true;
      }
    }

    return false;
  }

  protected needResponseMasking(url: string): boolean {
    for (const regExString of APP.config.audit.restMaskResponseUrls || []) {
      const regex = new RegExp(regExString, 'gi');
      if (regex.test(url)) {
        return true;
      }
    }

    return false;
  }

  private needSkipResponseBody(url: string) {
    for (const regExString of APP.config.audit.restBodyOptional || []) {
      const regex = new RegExp(regExString, 'gi');
      if (regex.test(url)) {
        return true;
      }
    }

    return false;
  }
}
