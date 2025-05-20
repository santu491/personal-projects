import { ApiAdapter } from './apiAdapter';
import { ServiceProvider } from './serviceProvider';

export class Service {
  protected _serviceProvider?: ServiceProvider;

  public get serviceProvider(): ServiceProvider {
    if (!this._serviceProvider) {
      this._serviceProvider = this.createApiAdaptor();
    }
    return this._serviceProvider;
  }

  protected createApiAdaptor(): ServiceProvider {
    return new ApiAdapter();
  }
}
