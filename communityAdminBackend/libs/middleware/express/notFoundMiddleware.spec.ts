import { NotFoundMiddleware } from './notFoundMiddleware';

describe('NotFoundMiddleware UTest', () => {
  let middleware: NotFoundMiddleware;

  beforeEach(() => {
    middleware = new NotFoundMiddleware();
  });


  it('should not send 404 error if response already sent', () => {
    let status = 0;
    let body = '';
    let res: any = {
      headersSent: true
    };
    middleware.use({ url: '/api/test' } as any, res, () => {});
    expect(status).toBe(0);
    expect(body).toBe('');
  });

  afterEach(() => {
    //nop
  });
});
