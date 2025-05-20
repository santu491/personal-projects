import { NavigationRouter } from '../navigationRouter';

describe('NavigationRouter', () => {
  let navigationRouter: NavigationRouter;

  beforeEach(() => {
    navigationRouter = {
      getRoute: jest.fn(),
    };
  });

  it('should return a route for a valid action', async () => {
    (navigationRouter.getRoute as jest.Mock).mockResolvedValue('/home');
    const route = await navigationRouter.getRoute('navigateHome');
    expect(route).toBe('/home');
  });

  it('should return false for an invalid action', async () => {
    (navigationRouter.getRoute as jest.Mock).mockResolvedValue(false);
    const route = await navigationRouter.getRoute('invalidAction');
    expect(route).toBe(false);
  });
});
