import { useIsFocused } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { AlertModelProps } from '../../../../../shared/src/components/alertModel/alertModel';
import { AppUrl } from '../../../../../shared/src/models';
import { Header, HeaderInfo } from '../../../../../shared/src/models/src/features/header';
import { callNumber, isCredibleMindNotification } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS, APP_CONTENT, appColors } from '../../../../../src/config';
import { API_ENDPOINTS_JSON, ExperienceType, Language } from '../../../../../src/config/apiEndpoints';
import { RedirectURLApiType, SourceType } from '../../../../../src/constants/constants';
import { useAppContext } from '../../../../../src/context/appContext';
import { useWorkLifeResource } from '../../../../../src/hooks/useWorkLifeResource';
import { RequestMethod } from '../../../../../src/models/adapters';
import { getClientDetails } from '../../../../../src/util/commonUtils';
import { deviceDetails } from '../../../../../src/util/deviceDetails';
import {
  ALERT_TYPE,
  CRITICAL_EVENTS,
  RE_DIRECT_URL_API_TYPE,
  RedirectURLType,
  ResourceType,
} from '../../config/constants/home';
import { HOME_SDK_ANALYTICS } from '../../config/constants/tags';
import { useHomeContext } from '../../context/home.sdkContext';
import {
  AssessmentSurveyResponseDTO,
  CardsData,
  ClientResponseDTO,
  HomeCardsData,
  ResourceConfig,
  ResourceDTO,
} from '../../model/home';
import { Screen } from '../../navigation/home.navigationTypes';

export const useHomeView = () => {
  const { t } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertModelProps | undefined>(undefined);
  const context = useHomeContext();
  const appContext = useAppContext();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [supportNumber, setSupportNumber] = useState<string | undefined>(undefined);
  const [isShownErrorMessage, setIsShownErrorMessage] = useState(false);

  const {
    loggedIn,
    navigationHandler,
    navigation,
    memberAppointmentStatus,
    pushNotificationPayload,
    homeContent,
    exploreMoreCoursesAndResourcesContent,
    setHost,
    host,
    trendingTopics,
    exploreMoreTopics,

    client,
    setAssessmentsSurveyId,
    assessmentsSurveyId,
    setWpoClientName,
    setHeaderInfo,
    setHomeData,
    homeData,
    headerInfo,
    metrics,
  } = context;

  const { setMemberAppointStatus } = useAppContext();

  const { getWorkLifeResourceLibrary } = useWorkLifeResource();

  deviceDetails();

  const assessmentAlertConfirm = useCallback(async () => {
    setIsSuccess(false);
    setIsAlertEnabled(false);
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
          const alertContent: AlertModelProps = {
            onHandlePrimaryButton: assessmentAlertDismiss,
            title: t('authErrors.tryAgainButton'),
            subTitle: t('home.assessmentErrorMessage'),
            primaryButtonTitle: t('home.ok'),
            modalVisible: true,
            isError: true,
          };
          setAlertInfo(alertContent);
          setIsAlertEnabled(true);
        }
      }
    }
  }, [assessmentsSurveyId, appContext.client, loggedIn, context.serviceProvider, t]);

  const assessmentAlertDismiss = () => {
    setIsSuccess(false);
    setIsAlertEnabled(false);
  };

  const navigateToLearnMore = () => {
    navigation.navigate(Screen.CREDIBLEMIND, { url: CRITICAL_EVENTS });
  };

  const navigateToDetails = async (data: CardsData) => {
    const [redirectionType, redirectionPath] = data.redirectUrl?.split(':') || [];
    if (data.internalNavigation && data.onPress) {
      data.onPress();
    } else if (data.redirectUrl && data.redirectUrl.includes('assessments')) {
      showAlert(ALERT_TYPE.SUPPORT);
    } else if (redirectionType === RedirectURLType.PAGE && redirectionPath === RE_DIRECT_URL_API_TYPE.WELLNESS) {
      navigationHandler.linkTo({ action: AppUrl.WELLBEING });
    } else if (
      redirectionType === RedirectURLType.PAGE &&
      redirectionPath === RedirectURLApiType.WORK_LIFE_RESOURCE_LIBRARY &&
      data.path
    ) {
      fetchWorkLifeResource(data.path);
    } else if (redirectionType === RedirectURLType.PAGE && redirectionPath === RE_DIRECT_URL_API_TYPE.CARD_DETAILS) {
      navigation.navigate(Screen.RESOURCE, {
        path: data.path ?? '',
      });
    } else if (
      redirectionType === RedirectURLType.PAGE &&
      redirectionPath === RE_DIRECT_URL_API_TYPE.PROVIDERS_FIND_COUNSELOR
    ) {
      navigationHandler.linkTo({ action: AppUrl.FIND_COUNSELOR });
    } else if (redirectionType === RedirectURLType.CREDIBLE_MIND) {
      navigation.navigate(Screen.CREDIBLEMIND, { url: redirectionPath });
    } else {
      const url = data.redirectUrl?.startsWith('http') ? data.redirectUrl : `${host}${data.redirectUrl}`;
      Linking.openURL(url);
    }
  };

  const fetchWorkLifeResource = async (path: string) => {
    try {
      setLoading(true);
      await getWorkLifeResourceLibrary(path);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.info(error);
      showAlert(ALERT_TYPE.TRY_AGAIN);
    }
  };

  const navigateToExplore = () => {
    navigation.navigate(Screen.EXPLORE_MORE_RESOURCES);
  };

  const resetAlert = useCallback(() => {
    setIsAlertEnabled(false);
    setMemberAppointStatus(undefined);
    setAlertInfo(undefined);
  }, [setMemberAppointStatus]);

  const onPressPendingRequest = useCallback(() => {
    resetAlert();
    navigationHandler.linkTo({ action: AppUrl.PENDING_REQUESTS });
  }, [navigationHandler, resetAlert]);

  const onPressConfirmedRequest = useCallback(() => {
    resetAlert();
    navigationHandler.linkTo({ action: AppUrl.PENDING_REQUESTS });
  }, [navigationHandler, resetAlert]);

  const onPressDismiss = useCallback(() => {
    setIsAlertEnabled(false);
  }, []);

  const showAlert = useCallback(
    (type: string) => {
      let alertContent: AlertModelProps = {
        onHandlePrimaryButton: assessmentAlertConfirm,
        title: t('home.disclaimer'),
        subTitle: t('home.assessmentAlertMessage'),
        primaryButtonTitle: t('home.agree'),
        modalVisible: true,
      };
      switch (type) {
        case ALERT_TYPE.SUPPORT:
          alertContent = {
            ...alertContent,
            onHandlePrimaryButton: assessmentAlertConfirm,
            onHandleSecondaryButton: assessmentAlertDismiss,
            title: t('home.disclaimer'),
            subTitle: t('home.assessmentAlertMessage'),
            primaryButtonTitle: t('home.agree'),
            secondaryButtonTitle: t('home.cancel'),
            showIndicatorIcon: false,
          };
          break;
        case ALERT_TYPE.PENDING_REQUEST:
          alertContent = {
            ...alertContent,
            onHandlePrimaryButton: onPressPendingRequest,
            title: t('home.alert.pendingRequest.title'),
            subTitle: t('home.alert.pendingRequest.message'),
            primaryButtonTitle: t('home.alert.pendingRequest.primaryButton'),
            showIndicatorIcon: true,
            isError: true,
            errorIndicatorIconColor: appColors.lightDarkGray,
          };
          break;
        case ALERT_TYPE.APPOINTMENT_CONFIRMED:
          alertContent = {
            ...alertContent,
            onHandlePrimaryButton: onPressConfirmedRequest,
            title: t('home.alert.appointmentConfirmed.title'),
            subTitle: t('home.alert.appointmentConfirmed.message'),
            primaryButtonTitle: t('home.alert.appointmentConfirmed.primaryButton'),
            showIndicatorIcon: true,
          };
          break;
        case ALERT_TYPE.TRY_AGAIN:
          alertContent = {
            ...alertContent,
            onHandlePrimaryButton: onPressDismiss,
            title: t('authErrors.tryAgainButton'),
            subTitle: t('home.assessmentErrorMessage'),
            primaryButtonTitle: t('home.ok'),
            showIndicatorIcon: true,
            isError: true,
          };
          break;

        default:
          break;
      }
      setAlertInfo(alertContent);
      setIsAlertEnabled(true);
    },
    [assessmentAlertConfirm, onPressConfirmedRequest, onPressPendingRequest, onPressDismiss, t]
  );

  const onPressContact = () => {
    if (supportNumber) {
      callNumber(supportNumber);
    }
  };

  const getSupportNumber = useCallback(async () => {
    try {
      const clientDetails = await getClientDetails();
      setSupportNumber(clientDetails.supportNumber);
      if (client && clientDetails.userName !== client.userName && loggedIn) {
        setLoading(true);
        const clientUrl = `${API_ENDPOINTS.CLIENT}/${client.userName}`;
        const response: ClientResponseDTO = await appContext.serviceProvider.callService(
          clientUrl,
          RequestMethod.GET,
          null
        );
        if (response.data.supportNumber) {
          setSupportNumber(response.data.supportNumber);
        }
      }
      setIsShownErrorMessage(true);
    } catch (error) {
      console.info(error);
    } finally {
      setLoading(false);
    }
  }, [appContext.serviceProvider, client, loggedIn]);

  const updateHeaderInfo = useCallback(
    (headerData: HeaderInfo[]) => {
      const header = headerData.reduce<Header>((acc, item) => {
        acc[String(item.id)] = item;
        return acc;
      }, {});
      setHeaderInfo(header);
    },
    [setHeaderInfo]
  );

  const transformHomeCardsResonse = useCallback(
    (data?: HomeCardsData[]) => {
      const filteredData = data?.filter((item) => item.id !== 'genesysChat');
      setHomeData(filteredData);
    },
    [setHomeData]
  );

  const fetchHomeCardsInfo = useCallback(async () => {
    setLoading(true);
    const url = `/${loggedIn ? ExperienceType.SECURE : ExperienceType.PUBLIC}/${appContext.client?.source}/${Language.EN}${API_ENDPOINTS.CLIENT}/${appContext.client?.clientUri}/home/components`;
    try {
      const response: ResourceDTO = await context.serviceProvider.callService(url, RequestMethod.GET, null);

      const headerDataInfo: HeaderInfo[] | undefined = response.data.header;
      const homeDataInfo: HomeCardsData[] = response.data.body as HomeCardsData[] | [];
      if (headerDataInfo) {
        updateHeaderInfo(headerDataInfo);
      }
      transformHomeCardsResonse(homeDataInfo);
      setLoading(false);
      setIsShownErrorMessage(false);
      const resourceConfig = homeDataInfo.find((item) => item.id === ResourceType.CONFIG) as ResourceConfig | undefined;
      setWpoClientName(resourceConfig?.wpoClientName);
      setHost(appContext.client?.source === SourceType.MHSUD ? resourceConfig?.mhsudHost : resourceConfig?.eapHost);
      const genesysChatContent = homeDataInfo.find((item) => item.id === ResourceType.GENESYS_CHAT);
      if (genesysChatContent) {
        appContext.setGenesysChat(genesysChatContent);
      }

      if (resourceConfig?.assessmentsSurveyId) {
        setAssessmentsSurveyId(resourceConfig.assessmentsSurveyId);
      }
    } catch (error) {
      console.log('error...', error);
      console.info(error);
      setLoading(false);
      getSupportNumber();
    }
  }, [
    loggedIn,
    appContext,
    context.serviceProvider,
    transformHomeCardsResonse,
    setWpoClientName,
    setHost,
    updateHeaderInfo,
    setAssessmentsSurveyId,
    getSupportNumber,
  ]);

  useEffect(() => {
    if (!homeContent || appContext.client?.shouldUpdateHomeInfo) {
      fetchHomeCardsInfo();
      if (appContext.client) {
        appContext.setClient({
          ...appContext.client,
          shouldUpdateHomeInfo: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  //analytics
  useEffect(() => {
    metrics.trackState(HOME_SDK_ANALYTICS.STATES.HOME_SCREEN);
  }, [metrics]);

  useEffect(() => {
    if (isCredibleMindNotification(pushNotificationPayload)) {
      navigationHandler.linkTo({
        action: AppUrl.CREDIBLEMIND_WELLBEING,
        params: { url: pushNotificationPayload?.data.deepLink },
      });
    }

    if (memberAppointmentStatus) {
      if (memberAppointmentStatus.isPending) {
        showAlert(ALERT_TYPE.PENDING_REQUEST);
      } else if (memberAppointmentStatus.isAppointmentConfirmed) {
        showAlert(ALERT_TYPE.APPOINTMENT_CONFIRMED);
      }
    } else {
      setAlertInfo(undefined);
    }
  }, [memberAppointmentStatus, navigationHandler, pushNotificationPayload, showAlert]);

  return {
    isSuccess,
    assessmentAlertDismiss,
    assessmentAlertConfirm,
    alertInfo,
    isAlertEnabled,
    navigateToLearnMore,
    homeContent,
    host,
    loading,
    navigateToDetails,
    navigateToExplore,
    exploreMoreCoursesAndResourcesContent,
    loggedIn,
    showAlert,
    onPressConfirmedRequest,
    fetchHomeCardsInfo,
    onPressPendingRequest,
    trendingTopics,
    exploreMoreTopics,
    supportNumber,
    onPressContact,
    isShownErrorMessage,
    homeData,
    headerInfo,
  };
};
