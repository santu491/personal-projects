import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { AppUrl } from '../../../shared/src/models';
import { ScreenNames } from '../../config';
import { CarelonNavigationHandler, HIDE_TAB_BAR_PARAM } from '../navigationHandler';

describe('CarelonNavigationHandler', () => {
  let navigationHandler: CarelonNavigationHandler;

  beforeEach(() => {
    navigationHandler = new CarelonNavigationHandler();
  });

  it('should register tabs and screens on initialization', () => {
    expect(navigationHandler.registeredScreens).toHaveProperty(ScreenNames.HOME_SDK);
  });

  it('should request to hide tab bar', () => {
    const navigation = { setParams: jest.fn() } as unknown as NavigationProp<ParamListBase, string>;
    navigationHandler.requestHideTabBar(navigation);
    expect(navigation.setParams).toHaveBeenCalledWith({ [HIDE_TAB_BAR_PARAM]: true });
  });

  it('should link to app URL', async () => {
    const action = { action: AppUrl.HOME_SDK };
    const result = await navigationHandler.linkTo(action);
    expect(result).toBe(false);
  });

  it('should process deep link', async () => {
    const url = 'carelon://some/path';
    const result = await navigationHandler.processDeepLink(url);
    expect(result).toBe(url);
  });

  it('should handle navigable URL', async () => {
    const url = 'carelon://some/path';
    const result = await navigationHandler.handleNavigableUrl(url);
    expect(result).toBe(url);
  });

  it('should check if URL is internal navigable URL', () => {
    const url = 'carelon://some/path';
    const result = navigationHandler.isInternalNavigableUrl(url);
    expect(result).toBe(true);
  });
});
