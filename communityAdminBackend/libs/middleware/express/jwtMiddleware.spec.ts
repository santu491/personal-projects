import { mockJwtFilter } from '@anthem/communityadminapi/filters/mocks/mockJwtFilter';
import { JwtMiddleware } from './jwtMiddleware';

describe('JwtMiddleware UTest', () => {
  let middleware: JwtMiddleware;

  beforeEach(() => {
    middleware = new JwtMiddleware(<any>mockJwtFilter);
  });

  it('should not send 401 error when token is valid', async () => {
    let status = 0;
    let body = '1';
    let res: any = {
      status: (s: number) => {
        status = s;
        return {
          send: (r: string) => {
            body = r;
          }
        };
      }
    };
    mockJwtFilter.validateToken.mockReturnValue(true);
    await middleware.use(<any>{ url: '/api/test' }, res, () => {});
    expect(status).toBe(0);
    expect(body).toBe('1');
  });

  afterEach(() => {
    mockJwtFilter.validateToken.mockReset();
  });
});
