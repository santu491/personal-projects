export type Method = 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';

export interface EndpointParams {
  endpoint: string;
  headers?: { [header: string]: string };
  method: Method;
  options?: {
    allowedInEmulation?: boolean;
    cold?: boolean;
    noAuthentication?: boolean;
    noCommonHeaders?: boolean;
    precareAuthentication?: boolean;
    sslPinningDisabled?: boolean;
  };
  responseType?: 'base64';
  timeout?: number;
}

export type EndpointConfig = {
  [endpoint: string]: EndpointParams;
};

export class ServiceEndpoint<Config extends EndpointConfig> {
  protected params?: Map<string, string | undefined>;

  constructor(public readonly configKey: keyof Config & string) {}

  public hasEndpoint(endpointConfig: Config): boolean {
    return Boolean(endpointConfig[this.configKey]);
  }

  public getMethod(endpointConfig: Config): Method {
    const endpoint = this.getEndpointParams(endpointConfig);
    return endpoint.method;
  }

  public getOptions(endpointConfig: Config) {
    const endpoint = this.getEndpointParams(endpointConfig);
    return endpoint.options ?? {};
  }

  public getResponseType(endpointConfig: Config): EndpointParams['responseType'] {
    const endpoint = this.getEndpointParams(endpointConfig);
    return endpoint.responseType;
  }

  public getHeaders(endpointConfig: Config): EndpointParams['headers'] {
    const endpoint = this.getEndpointParams(endpointConfig);
    return endpoint.headers;
  }

  public getEndpoint(endpointConfig: Config): string {
    const endpointTemplate = this.getEndpointParams(endpointConfig).endpoint;

    if (!endpointTemplate) {
      throw new Error(`endpoint not available: ${this.configKey}`);
    }
    let endpoint = endpointTemplate;
    // there's 2 different things to do here
    // if there's defined params in the URL we want to be able to swap those out
    // if there's params passed in that aren't defined in the URL we want to append them
    if (this.params) {
      this.params.forEach((value: string | undefined, key: string) => {
        if (value === undefined) {
          return;
        }
        const needsReplacement = `{${key}}`;
        value = encodeURIComponent(value);
        if (endpoint.includes(needsReplacement)) {
          endpoint = endpoint.replace(needsReplacement, value);
        } else {
          endpoint += endpoint.includes('?') ? '&' : '?';
          endpoint += `${key}=${value}`;
        }
      });
    }
    endpoint = this.removeUnsetQueryParams(endpoint);
    return endpoint;
  }

  public getParams(): Map<string, string | undefined> | undefined {
    return this.params;
  }

  public setParams<T extends string>(
    params:
      | Map<string, string | undefined>
      | Array<[string, string | undefined]>
      | Partial<Record<T, string | { toString: () => string }>>
  ): ServiceEndpoint<Config> {
    this.params = new Map<string, string | undefined>(
      Array.isArray(params) || params instanceof Map ? params : Object.entries(params).map(([k, v]) => [k, String(v)])
    );
    return this;
  }

  protected getEndpointParams(endpointConfig: Config): EndpointParams {
    const endpoint = endpointConfig[this.configKey];
    return endpoint as EndpointParams;
  }

  protected removeUnsetQueryParams(url: string): string {
    let cleanUrl = url.replace(/[?&]\w+={\w+}/g, '');
    if (cleanUrl.includes('&') && !cleanUrl.includes('?')) {
      // Ensures that if the first query param is removed and but are more after, the first & is changed to a ?
      cleanUrl = cleanUrl.replace('&', '?');
    }

    return cleanUrl;
  }
}
