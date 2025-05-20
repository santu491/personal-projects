import type { LinkingOptions, NavigationProp, ParamListBase } from '@react-navigation/native';
import type { ComponentType } from 'react';

import { AppUrl, NavigationAction, Params } from '../../../models';

export interface ParamsRecursive {
  [key: string]: Params[keyof Params] | ParamsRecursive;
}

export type ScreenNavigator = ComponentType;

export interface NavigationHandler<ParamList extends {} = {}> {
  linkTo: <Destination extends AppUrl>(options: NavigationAction<Destination>) => Promise<boolean>;
  linkingOptions?: LinkingOptions<ParamList>;
  registeredScreens: Partial<Record<string, ScreenNavigator>>;
  requestHideTabBar: (navigation: NavigationProp<ParamListBase, string>) => void;
}

export type NestedNavigatorParams<NavParams extends ParamListBase> = {
  [K in keyof NavParams]: undefined extends NavParams[K]
    ? { params?: NavParams[K]; screen: K }
    : { params: NavParams[K]; screen: K };
}[keyof NavParams];
