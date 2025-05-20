// import { BannerButtonPage } from '../../../../../src/models/cardResource';
import { AppUrl } from './appUrls';

export type Params = Record<string, string | number | boolean | null>;

export const BACK_TO_PREVIOUS_PARAM = 'backToPrevious';

type ParamListBase = Record<string, object | undefined>;

export type GlobalNavigationParams<T extends ParamListBase, Keys extends keyof T = keyof T> = {
  [K in Keys]: T[K] & ({ [BACK_TO_PREVIOUS_PARAM]?: boolean; onBackPress?: () => boolean } | undefined);
};

/**
 * Navigation params are the valid cross-feature public navigation params for a particular AppUrl.
 * Almost like a function signature for an AppUrl navigation.
 *
 * private/internal route params should NOT be included here.
 */
export interface NavigationParams {
  [AppUrl.LOGIN]: undefined;
  [AppUrl.NOTIFICATIONS]: undefined;
  [AppUrl.LANDING]: undefined;
  [AppUrl.MENU]: undefined;
  [AppUrl.PROFILE]: undefined;
  [AppUrl.WELLBEING]: undefined;
  [AppUrl.APPOINTMENTS_TAB]: undefined;
  [AppUrl.MENU_TAB]: undefined;
  [AppUrl.PROVIDERS_TAB]: undefined;
  [AppUrl.WELLBEING_TAB]: undefined;
  [AppUrl.APPOINTMENTS_HISTORY]: undefined;
  [AppUrl.CONFIRMED_REQUESTS]: undefined;
  [AppUrl.INACTIVE_REQUESTS]: undefined;
  [AppUrl.PENDING_REQUESTS]: undefined;
  [AppUrl.HOME]: undefined;
  [AppUrl.HOME_SDK]: undefined;
  [AppUrl.PERSONAL_DETAILS]: undefined;
  [AppUrl.SCHEDULE_APPOINTMENT]: undefined;
  [AppUrl.UPDATE_PHONE_NUMBER]: undefined;
  [AppUrl.FIND_COUNSELOR]: undefined;
  [AppUrl.CLINICAL_QUESTIONNAIRE]: { appointmentFlowStatus: boolean };
  [AppUrl.CREDIBLEMIND]: { url: string };
  [AppUrl.CREDIBLEMIND_WELLBEING]: { url: string };
  [AppUrl.START_CHAT]: undefined;
  [AppUrl.CHAT]: undefined;
  [AppUrl.CLIENT_SEARCH]: { showHeaderBackIcon?: boolean };
}

export interface NavigationAction<Destination extends AppUrl> {
  [BACK_TO_PREVIOUS_PARAM]?: boolean;
  action: Destination;
  params?: Destination extends keyof NavigationParams ? NavigationParams[Destination] : never;
}
