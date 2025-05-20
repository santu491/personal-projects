import { APP, ConfigLoader, IConfig, mergeConfigs } from '@anthem/communityadminapi/utils';
import { Service } from 'typedi';

@Service()
export class SpringCloudConfigClient {
  private _interval: NodeJS.Timeout;
  private readonly MAX_ERRORS = 5;
  private retryErrors = 0;
  private _api: string;
  private _env: string;

  init(api: string, env: string) {
    this._api = api;
    this._env = env;
    if (APP.config.app.springCloudConfigUrl) {
      this._interval = setInterval(() => {
        this.syncConfig();
      }, 60000 * APP.config.app.configTimeout);
    }
  }

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  private async syncConfig() {
    try {
      if (this.retryErrors >= this.MAX_ERRORS) {
        clearInterval(this._interval);
        this._interval = null;
        return;
      }
      const dynamicConfig = await ConfigLoader.loadSpringCloudConfig(APP.config.app.springCloudConfigUrl, this._api, this._env);
      // eslint-disable-next-line custom-rules/no-restricted-assignments
      ((APP as unknown) as { config: Partial<IConfig> }).config = mergeConfigs(JSON.parse(JSON.stringify(APP.config)), dynamicConfig);
    } catch (error) {
      //unhandle error
      this.retryErrors++;
    }
  }
}
