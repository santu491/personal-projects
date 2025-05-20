import { ImageSourcePropType } from 'react-native';

import { NavigationType } from '../config/constants/constants';

export interface Menu {
  action?: {
    hideTabBar?: boolean;
    imagePath?: ImageSourcePropType;
    navigationType?: NavigationType;
    screenName?: string;
    showAlert?: boolean;
  };
  data?: MenuList[];
  description?: string;
  icon?: string;
  label?: string;
  onPress?: () => void;
  openURLInNewTab?: string;
  path?: string;
  redirectUrl?: string;
  title?: string;
}

export interface MenuList {
  label: string;
  value: string | undefined;
}

export interface DetailDataList {
  listData?: MenuList[];
  title?: string;
}

export interface AccountResponseDTO {
  data?: string;
}

export interface FooterData {
  data?: MenuItem[];
  experienceType?: string;
  icon: string;
  id: string;
  label: string;
  openURLInNewTab: boolean;
  redirectUrl: string;
  type: string;
}

export interface MenuSubItem {
  experienceType?: string;
  icon?: string;
  id: string;
  label: string;
  openURLInNewTab: boolean;
  redirectUrl: string;
  type: string;
}

export interface MenuItem {
  data?: MenuSubItem[];
  environments?: string[];
  expanded?: boolean;
  experienceType?: string;
  icon?: string;
  id: string;
  isPrimaryButton?: boolean;
  label: string;
  openURLInNewTab: boolean;
  redirectUrl: string;
  type: string;
}

export enum MenuType {
  BUTTON = 'menuItem.button',
  FOOTERITEM = 'footerItem',
  MENUITEM = 'menuItem.list',
  MENUSUBITEM = 'menuItem.list.child',
  SEARCH = 'menuItem.search',
}

export enum ExperienceType {
  PUBLIC = 'public',
  SECURE = 'secure',
}

export enum MenuImageName {
  ANGLEDOWN = 'AngleDown',
  ANGLEUP = 'AngleUp',
  CALENDARPLUS = 'calendarPlus',
  CUSTOMERSUPPORT = 'customerSupport',
  DENTAL = 'dental',
  HOSPITALINDEMNITY = 'hospitalIndemnity',
  IDVERIFIED = 'idVerified',
  PEOPLE = 'people',
  SUPPLEMENTALHEALTH = 'supplementalHealth',
  USERMALECIRCLE = 'userMaleCircle',
}
