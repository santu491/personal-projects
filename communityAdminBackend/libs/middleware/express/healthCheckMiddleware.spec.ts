import { HealthCheckUtil } from '@anthem/communityadminapi/common';
import { HealthCheckMiddleware } from './healthCheckMiddleware';

describe('HealthCheckMiddleware UTest', () => {
  let middleware: HealthCheckMiddleware;

  beforeEach(() => {
    HealthCheckUtil.checkHealth = jest.fn();
    middleware = new HealthCheckMiddleware();
  });

  it('should not send 200 if url is not for health check', () => {
    let status = 0;
    let body: any = '1';
    let res: any = {
      status: (s: number) => {
        status = s;
        return {
          send: (r: string) => {
            body = r;
          }
        }
      }
    };
    (<any>HealthCheckUtil.checkHealth).mockReturnValue(true);
    middleware.use(<any>{
      url: 'http:/test/url/api/hea1lth'
    }, res, () => { });
    expect(status).toBe(0);
    expect(body).toBe('1');
  });

  it('should not send 200 if health check is false', () => {
    let status = 0;
    let body: any = '1';
    let res: any = {
      status: (s: number) => {
        status = s;
        return {
          send: (r: string) => {
            body = r;
          }
        }
      }
    };
    (<any>HealthCheckUtil.checkHealth).mockReturnValue(false);
    middleware.use(<any>{
      url: 'http:/test/api/url/health'
    }, res, () => { });
    expect(status).toBe(0);
    expect(body).toBe('1');
  });

  afterEach(() => {
    (<any>HealthCheckUtil.checkHealth).mockReset();
  });
});
