import { useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS_JSON, APP_CONTENT, ENV } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { useLogout } from '../../../../../src/hooks/useLogout';
import { RequestMethod } from '../../../../../src/models/adapters';
import { AssessmentSurveyResponseDTO } from '../../../../home/src/model/home';
import { footerData } from '../../__mocks__/menu';
import { MENU_ID, RE_DIRECT_URL_API_TYPE, RedirectURLType } from '../../config/constants/constants';
import { useMenuContext } from '../../context/menu.sdkContext';
import { useGetProfileInfo } from '../../hooks/useGetProfileInfo';
import { Menu, MenuItem, MenuType } from '../../models/menu';
import { Screen } from '../../navigation/menu.navigationTypes';

export const useMenu = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState<MenuItem[] | undefined>();
  const context = useMenuContext();
  const appContext = useAppContext();
  const { handleLogout } = useLogout();

  useEffect(() => {
    const data = footerData.find((menu) => menu.id === MENU_ID)?.data;
    setMenuData(data);
  }, []);

  const { loggedInMenuData } = useGetProfileInfo();
  const { userProfileData, navigationHandler, loggedIn, assessmentsSurveyId, navigation, host } = context;

  const assessmentAlertConfirm = async () => {
    if (assessmentsSurveyId) {
      const clientDetails = appContext.client;
      if (!clientDetails) {
        throw new Error('Client details not found');
      }
      const { userName } = clientDetails;
      if (userName) {
        const header = { clientName: userName, isSecureToken: loggedIn, surveyId: assessmentsSurveyId };
        try {
          const response: AssessmentSurveyResponseDTO = await context.serviceProvider.callService(
            API_ENDPOINTS_JSON.ASSESSMENT_SURVEY.endpoint,
            RequestMethod.GET,
            null,
            header
          );
          if (response.data.assessmentUrl) {
            Linking.openURL(response.data.assessmentUrl);
          } else {
            console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
          }
        } catch (error) {
          console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
        }
      }
    }
  };

  const assessmentAlertDismiss = () => {
    setIsSuccess(false);
  };

  const navigateToLogin = () => {
    navigationHandler.linkTo({ action: AppUrl.LOGIN });
  };

  const navigateToPersonalScreen = () => {
    navigationHandler.linkTo({ action: AppUrl.PERSONAL_DETAILS });
  };

  const navigateToHomeScreen = () => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  };

  /* code to handle screen navigation */
  const handleScreenNavigation = async () => {
    if (loggedIn) {
      try {
        setLoading(true);
        await handleLogout(navigateToHomeScreen);
      } finally {
        setLoading(false);
      }
    } else {
      navigateToPersonalScreen();
    }
  };

  const handleRedirectURLs = (item: Menu) => {
    const [redirectionType, redirectionPath] = item.redirectUrl?.split(':') || [];

    const handleApiRedirection = () => {
      if (redirectionPath.includes('assessments')) {
        setIsSuccess(true);
      }
    };

    const handleHttpsRedirection = () => {
      if (item.redirectUrl) {
        const url = item.redirectUrl.startsWith('http') ? item.redirectUrl : `${host}${item.redirectUrl}`;
        Linking.openURL(url);
      }
    };

    const handlePageRedirection = () => {
      switch (redirectionPath) {
        case RE_DIRECT_URL_API_TYPE.PROVIDERS_TELE_HEALTH:
          navigationHandler.linkTo({ action: AppUrl.FIND_COUNSELOR });
          break;
        case RE_DIRECT_URL_API_TYPE.WELLNESS:
          navigationHandler.linkTo({ action: AppUrl.WELLBEING });
          break;
        case RE_DIRECT_URL_API_TYPE.CARD_DETAILS:
          navigation.navigate(Screen.RESOURCE, {
            path: item.path ?? '',
          });
          break;
      }
    };

    const handleCredibleMindRedirection = (url?: string) => {
      navigation.navigate(Screen.CREDIBLE_MIND, { url: url ?? redirectionPath });
    };

    switch (redirectionType) {
      case RedirectURLType.API:
        handleApiRedirection();
        break;
      case RedirectURLType.PAGE:
        handlePageRedirection();
        break;

      case RedirectURLType.CREDIBLE_MIND:
        handleCredibleMindRedirection();
        break;

      default:
        handleHttpsRedirection();
        break;
    }
  };

  const handleProfileNavigation = (item: Menu) => {
    if (item.redirectUrl) {
      handleRedirectURLs(item);
    } else {
      item.onPress?.();
    }
  };

  const onMenuItemPress = (expanded: boolean, menuItemIndex: number) => {
    if (expanded) {
      const data = menuData?.map((section, index) => ({
        ...section,
        expanded: index === menuItemIndex,
      }));
      setMenuData(data);
    }
  };

  const onMenuSelectedItemPress = (items: MenuItem) => {
    //TODO: temporary added for the network logger, later this need to be removed
    if (ENV && items.environments?.includes(ENV) && items.redirectUrl === 'page:networkLogger') {
      navigation.navigate(Screen.NETWORK_WATCH_LOGGER, undefined);
    }

    if (ENV && items.environments?.includes(ENV) && items.redirectUrl === 'page:changeClient') {
      appContext.setClient(undefined);
      navigationHandler.linkTo({ action: AppUrl.CLIENT_SEARCH, params: { showHeaderBackIcon: true } });
    }

    if (ENV && items.environments?.includes(ENV) && items.redirectUrl === 'page:aepAssurence') {
      navigation.navigate(Screen.ANALYTICS_LOG);
    }
  };

  return {
    loggedInMenuData,
    handleScreenNavigation,
    handleProfileNavigation,
    loggedIn,
    userProfileData,
    navigateToLogin,
    navigateToHomeScreen,
    isSuccess,
    loading,
    assessmentAlertConfirm,
    assessmentAlertDismiss,
    menuData,
    buttonsData: menuData?.filter((data) => data.type === MenuType.BUTTON),
    onMenuItemPress,
    onMenuSelectedItemPress,
  };
};
