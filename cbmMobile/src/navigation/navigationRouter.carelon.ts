import { NavigationRouter } from './utils/navigationRouter';

export class CarelonNavigationRouter implements NavigationRouter {
  constructor() {}

  public async getRoute(navigationUrl: string): Promise<string | false> {
    return navigationUrl;
  }
}
