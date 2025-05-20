import type { ParsedUrlQueryInput } from 'querystring';

import {
  getActionFromState,
  getStateFromPath,
  LinkingOptions,
  NavigationProp,
  ParamListBase,
  PathConfig,
  PathConfigMap,
} from '@react-navigation/native';
import { set } from 'lodash';
import { Linking } from 'react-native';

import { appointmentsNavConfig } from '../../sdks/appointments/src/navigation/appointment.navigator';
import { authNavConfig } from '../../sdks/auth/src/navigation/auth.navigator';
import { chatNavConfig } from '../../sdks/chat/src/navigation/chat.navigator';
import { clientNavConfig } from '../../sdks/client/src/navigation/client.navigator';
import { homeNavConfig } from '../../sdks/home/src/navigation/home.navigator';
import { menuNavConfig } from '../../sdks/menu/src/navigation/menu.navigator';
import { notificationNavConfig } from '../../sdks/notifications/src/navigation/notification.navigator';
import { providerNavConfig } from '../../sdks/providers/src/navigation/providers.navigator';
import { wellbeingNavConfig } from '../../sdks/wellbeing/src/navigation/wellbeing.navigator';
import { NavigationHandler } from '../../shared/src/commonui/src';
import { injectQueryParams } from '../../shared/src/commonui/src/utils/injectQueryParams';
import { AppUrl, BACK_TO_PREVIOUS_PARAM, NavigationAction } from '../../shared/src/models';
import { ScreenNames } from '../config';
import { AuthContext } from '../context/authContext';
import { ChatContext } from '../context/chatContext';
import { ClientContext } from '../context/clientContext';
import { HomeContext } from '../context/homeContextWrapper';
import { NotificationContext } from '../context/notificationContext';
import { ProviderContext } from '../context/providerContext';
import { homeTabNavConfig } from './homeTabNaviagtion/homeTab.navigator';
import { CarelonNavigationRouter } from './navigationRouter.carelon';
import { navigationRef } from './navRef';
import { lowerPathname } from './utils/lowerPathname';
import { lowerPathsRecursive } from './utils/lowerPathsRecursive';
import { NavigationRouter } from './utils/navigationRouter';
import { normalizePathname } from './utils/normalizePathname';

export const HIDE_TAB_BAR_PARAM = 'hideTabBar';
export const HIDE_CHAT_PARAM = 'hideChat';

type ScreenNavigator = React.ComponentType;

// Linking config that needs to be supplied to Navigation
type CarelonLinkingOptions = LinkingOptions<ParamListBase> & {
  config: PathConfigMap<ParamListBase & {}>;
};

export class CarelonNavigationHandler implements NavigationHandler {
  public appPrefixes: LinkingOptions<{}>['prefixes'] = ['carelon://'];
  public static navigationRef = navigationRef;
  private registeredScreensNavigators: Partial<Record<string, ScreenNavigator>> = {};
  private registeredScreensConfig: PathConfig<{}> = {
    screens: {},
  };

  constructor() {
    // registering tabs
    this.registerTab(ScreenNames.HOME_TAB, homeTabNavConfig);
    this.registerTab(ScreenNames.APPOINTMENTS_TAB, appointmentsNavConfig);
    this.registerTab(ScreenNames.WELLBEING_TAB, wellbeingNavConfig);
    this.registerTab(ScreenNames.MENU_TAB, menuNavConfig);

    // registering features
    this.registerScreen(ScreenNames.AUTH_SDK, authNavConfig, AuthContext);
    this.registerScreen(ScreenNames.NOTIFICATION_SDK, notificationNavConfig, NotificationContext);
    this.registerScreen(ScreenNames.CLIENT_SDK, clientNavConfig, ClientContext);
    this.registerScreen(ScreenNames.PROVIDERS_SDK, providerNavConfig, ProviderContext);
    this.registerScreen(ScreenNames.CHAT_SDK, chatNavConfig, ChatContext);
    this.registerScreen(ScreenNames.HOME_SDK, homeNavConfig, HomeContext); // remove this sdk once testing is done.
  }

  public requestHideTabBar = (navigation: NavigationProp<ParamListBase, string>): void => {
    // there can be a race condition on initial render and the tabbar won't re-render
    navigation.setParams({ [HIDE_TAB_BAR_PARAM]: true });
    setTimeout(() => navigation.setParams({ [HIDE_TAB_BAR_PARAM]: true }), 0);
  };

  public requestHideChat = (navigation: NavigationProp<ParamListBase, string>): void => {
    // there can be a race condition on initial render and the tabbar won't re-render
    navigation.setParams({ [HIDE_CHAT_PARAM]: true });
    setTimeout(() => navigation.setParams({ [HIDE_CHAT_PARAM]: true }), 0);
  };

  public linkTo = async <Target extends AppUrl>(originalAction: NavigationAction<Target>): Promise<boolean> => {
    const action = { ...originalAction };
    const params: ParsedUrlQueryInput = action.params ?? {};
    if (action[BACK_TO_PREVIOUS_PARAM]) {
      params[BACK_TO_PREVIOUS_PARAM] = true;
    }

    return this.linkToAppUrl(action.action, params);
  };

  public get linkingOptions(): LinkingOptions<ParamListBase> {
    return this.linking;
  }

  public get registeredScreens() {
    return this.registeredScreensNavigators;
  }

  private registerScreen(screenName: ScreenNames, config: PathConfig<ParamListBase>, stackNavigator: ScreenNavigator) {
    if (!this.registeredScreensConfig.screens) {
      return;
    }
    this.registeredScreensNavigators[screenName] = stackNavigator;
    this.registerTab(screenName, config);
  }

  private registerTab<T extends PathConfig<ParamListBase>>(tabName: ScreenNames, config: T) {
    set(this.linking.config.screens, tabName, lowerPathsRecursive(config));
  }

  private linking: CarelonLinkingOptions = {
    enabled: true,
    // deep link prefixes
    prefixes: this.appPrefixes,
    config: {
      initialRouteName: ScreenNames.HOME_TAB,
      screens: {},
    },
  };

  private _navigationRouter: NavigationRouter | undefined;
  public get navigationRouter(): NavigationRouter {
    if (!this._navigationRouter) {
      this._navigationRouter = new CarelonNavigationRouter();
    }
    return this._navigationRouter;
  }

  async processDeepLink(receivedUrl: string): Promise<string | false> {
    return this.handleNavigableUrl(receivedUrl);
  }

  public async linkToDeepLink(url: string) {
    const processedUrl = await this.processDeepLink(url);
    if (processedUrl && this.isInternalNavigableUrl(processedUrl)) {
      this.linkToAppUrl(processedUrl);
    } else {
      Linking.openURL(url);
    }
  }

  async handleNavigableUrl(url: string): Promise<string | false> {
    return this.navigationRouter.getRoute(lowerPathname(normalizePathname(url)));
  }

  isInternalNavigableUrl(url: string): url is AppUrl {
    const state = getStateFromPath(url, this.linkingOptions.config);
    return !!state;
  }

  /**
   * replicate @react-navigation Linking navigation handling
   * @link https://reactnavigation.org/docs/configuring-links/
   */
  private linkToAppUrl = async (appUrl: AppUrl, params?: ParsedUrlQueryInput): Promise<boolean> => {
    const config = this.linkingOptions.config;
    const targetLinkingUrl = await this.handleNavigableUrl(injectQueryParams(appUrl, params));
    if (!targetLinkingUrl) {
      return true; // url was rewritten to empty, navigation was canceled
    }

    const state = getStateFromPath(targetLinkingUrl, config);

    const root = navigationRef.current;
    if (state && root) {
      const action = getActionFromState(state, config);
      if (action !== undefined) {
        root.dispatch(action);
      } else {
        root.reset(state);
      }
      return true;
    }
    return false;
  };
}
