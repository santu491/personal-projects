import { getControllerPaths, getMiddlewarePaths } from './paths';

describe('paths UTest', () => {
  beforeEach(() => {
    //nop
  });

  it('getControllerPaths testing', () => {
    expect(getControllerPaths('tcp', 'demo')).toBe('/api/tcp/demo/**/controllers/*Controller{.js,.ts}');
    expect(getControllerPaths('tcp')).toBe('/api/tcp/**/controllers/*Controller{.js,.ts}');
  });

  it('getMiddlewarePaths testing', () => {
    expect(getMiddlewarePaths('tcp')).toBe('/app/tcp/middlewares/express/*Middleware{.js,.ts}');
  });
});
