import { APP, ConfigLoader } from '@anthem/communityapi/utils';
import { SpringCloudConfigClient } from './springCloudConfigClient';

describe('SpringCloudConfigClient UTest', () => {
  let client: SpringCloudConfigClient;

  beforeEach(() => {
    APP.config.app.springCloudConfigUrl = 'http://sprinturl';
    APP.config.app.configTimeout = 1;
    ConfigLoader.loadSpringCloudConfig = jest.fn();
    client = new SpringCloudConfigClient();
    jest.useFakeTimers();
  });

  it('should load config from spring client config url periodically', () => {
    let p = new Promise((res) => {
      res({ app: { mock: 'mockconfigvalue' } });
    });
    (ConfigLoader.loadSpringCloudConfig as any).mockReturnValue(p);
    client.init('engage', 'local');
    jest.advanceTimersByTime(60001);
    expect((ConfigLoader.loadSpringCloudConfig as any).mock.calls.length).toBe(1);
    client.stop();
    p.then(() => {
      expect((APP as any).config.app.mock).toBe('mockconfigvalue');
    });
  });

  it('should handle spring cloud config url request errors gracefully', () => {
    let p = new Promise((res, rej) => {
      rej();
    });
    (ConfigLoader.loadSpringCloudConfig as any).mockReturnValue(p);
    client.init('engage', 'local');
    jest.advanceTimersByTime(60001);
    expect((ConfigLoader.loadSpringCloudConfig as any).mock.calls.length).toBe(1);
    client.stop();
    p.then(
      () => {
        expect(false).toBeTruthy();
      },
      () => {
        expect(true).toBeTruthy();
      }
    );
  });

  afterEach(() => {
    (ConfigLoader.loadSpringCloudConfig as any).mockReset();
  });
});
