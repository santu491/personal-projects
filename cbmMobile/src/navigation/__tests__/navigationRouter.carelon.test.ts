import { CarelonNavigationRouter } from '../navigationRouter.carelon';

describe('CarelonNavigationRouter', () => {
  let router: CarelonNavigationRouter;

  beforeEach(() => {
    router = new CarelonNavigationRouter();
  });

  test('should return the navigation URL when getRoute is called', async () => {
    const navigationUrl = 'http://example.com';
    const result = await router.getRoute(navigationUrl);
    expect(result).toBe(navigationUrl);
  });

  test('should return false when getRoute is called with an empty string', async () => {
    const navigationUrl = '';
    const result = await router.getRoute(navigationUrl);
    expect(result).toBe('');
  });
});
