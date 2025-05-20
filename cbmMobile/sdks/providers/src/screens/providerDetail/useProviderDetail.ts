import { useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { AlertModelProps } from '../../../../../shared/src/components/alertModel/alertModel';
import { AppUrl } from '../../../../../shared/src/models';
import { callNumber, ContactType, openMap } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS_JSON, appColors, ExperienceType, Language, ScreenNames } from '../../../../../src/config';
import { SourceType } from '../../../../../src/constants/constants';
import { useAppContext } from '../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../src/models/adapters';
import { ALERT_TYPE, MHSUD_PARAMETERS } from '../../config/constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';
import {
  DetailedSectionData,
  MhsudDisclaimerResponseDTO,
  OptionsDataResponseDTO,
  ProfileCorrectionForm,
  ProfileCorrectionFormSubmit,
  ReportProfileCorrectionForm,
  TooltipCheck,
} from '../../model/providerSearchResponse';
import { ProviderDetailScreenProps, Screen } from '../../navigation/providers.navigationTypes';
import { getSelectedProviderDetails } from '../../utils/selectedProviderDetails';
import { useProviderInfo } from './useProviderInfo';

export const useProviderDetail = () => {
  const providerContext = useProviderContext();
  const {
    setSelectedProviders,
    setNavigateScreen,
    loggedIn,
    memberAppointmentStatus,
    navigation,
    navigationHandler,
    serviceProvider,
    client,
    selectedPlanInfo,
    eapPlanName,
  } = providerContext;
  const { setMemberAppointStatus } = useAppContext();
  const { t } = useTranslation();
  const providerRouteParams = useRoute<ProviderDetailScreenProps['route']>().params;
  const { data, contacts } = useProviderInfo(providerRouteParams.provider);
  const providerDetailResponse = providerRouteParams.provider;
  const [viewAll, setViewAll] = useState(false);
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertModelProps | undefined>(undefined);
  const [isLoginDrawerEnabled, setIsLoginDrawerEnabled] = React.useState(false);
  const [isCreateAccountDrawerEnabled, setIsCreateAccountDrawerEnabled] = React.useState(false);
  const [toolTipVisible, setToolTipVisible] = useState<TooltipCheck>();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isProfileCorrectionModalShow, setIsProfileCorrectionModalShow] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ReportProfileCorrectionForm>();
  const [showSubmitSuccessAlert, setShowSubmitSuccessAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleSelectOption = () => {
    getProfileContent();
  };

  const handleShowMore = () => {
    setViewAll(true);
  };

  const navigateToLoginScreen = useCallback(() => {
    if (client?.source === SourceType.MHSUD) {
      setIsLoginDrawerEnabled(true);
    } else {
      navigationHandler.linkTo({ action: AppUrl.LOGIN });
    }
  }, [navigationHandler, client]);

  const updateSelectedProvider = useCallback(() => {
    const selectedProvider = getSelectedProviderDetails(providerRouteParams.provider);
    setSelectedProviders([{ ...selectedProvider, beaconLocationId: selectedProvider.beaconLocationId }]);
  }, [providerRouteParams.provider, setSelectedProviders]);

  const navigateToScheduleAppointment = useCallback(() => {
    updateSelectedProvider();
    navigation.navigate(Screen.SCHEDULE_APPOINTMENT);
  }, [navigation, updateSelectedProvider]);

  const navigateToPendingRequest = useCallback(() => {
    setIsAlertEnabled(false);
    setMemberAppointStatus(undefined);
    navigationHandler.linkTo({ action: AppUrl.PENDING_REQUESTS });
  }, [navigationHandler, setMemberAppointStatus]);

  const navigateToConfirmedRequest = useCallback(() => {
    setIsAlertEnabled(false);
    setMemberAppointStatus(undefined);
    navigationHandler.linkTo({ action: AppUrl.CONFIRMED_REQUESTS });
  }, [navigationHandler, setMemberAppointStatus]);

  const showAlert = useCallback(
    (type: string) => {
      let alertContent: AlertModelProps = {
        onHandlePrimaryButton: closeAlert,
        title: t('providers.alert.pendingRequest.title'),
        subTitle: t('providers.alert.pendingRequest.message'),
        primaryButtonTitle: t('providers.alert.pendingRequest.primaryButton'),
        modalVisible: true,
      };
      switch (type) {
        case ALERT_TYPE.PENDING_REQUEST:
          alertContent = {
            ...alertContent,
            onHandleSecondaryButton: closeAlert,
            onHandlePrimaryButton: navigateToPendingRequest,
            title: t('providers.alert.pendingRequest.title'),
            subTitle: t('providers.alert.pendingRequest.message'),
            primaryButtonTitle: t('providers.alert.pendingRequest.primaryButton'),
            secondaryButtonTitle: t('providers.alert.pendingRequest.secondaryButton'),
            isError: true,
            errorIndicatorIconColor: appColors.lightDarkGray,
          };
          break;
        case ALERT_TYPE.APPOINTMENT_CONFIRMED:
          alertContent = {
            ...alertContent,
            onHandlePrimaryButton: navigateToConfirmedRequest,
            title: t('providers.alert.appointmentConfirmed.title'),
            subTitle: t('providers.alert.appointmentConfirmed.message'),
            primaryButtonTitle: t('providers.alert.continue'),
          };
          break;
        default:
          break;
      }
      setAlertInfo(alertContent);
      setIsAlertEnabled(true);
    },
    [navigateToConfirmedRequest, navigateToPendingRequest, t]
  );

  const onPressRequestAppointment = useCallback(() => {
    if (loggedIn) {
      if (memberAppointmentStatus?.isPending) {
        showAlert(ALERT_TYPE.PENDING_REQUEST);
      } else if (memberAppointmentStatus?.isAppointmentConfirmed) {
        showAlert(ALERT_TYPE.APPOINTMENT_CONFIRMED);
      } else if (memberAppointmentStatus?.isContinue) {
        navigateToScheduleAppointment();
      }
    } else {
      updateSelectedProvider();
      setNavigateScreen(ScreenNames.SCHEDULE_APPOINTMENT);
      navigateToLoginScreen();
    }
  }, [
    loggedIn,
    memberAppointmentStatus?.isAppointmentConfirmed,
    memberAppointmentStatus?.isContinue,
    memberAppointmentStatus?.isPending,
    navigateToLoginScreen,
    navigateToScheduleAppointment,
    setNavigateScreen,
    showAlert,
    updateSelectedProvider,
  ]);

  const closeAlert = () => {
    setIsAlertEnabled(false);
  };

  const onPressContact = (contact: DetailedSectionData) => {
    if (typeof contact.description === 'string' && contact.description.toLowerCase() !== 'not available') {
      switch (contact.type) {
        case ContactType.PHONE:
          callNumber(contact.description);
          break;
        case ContactType.EMAIL:
          Linking.openURL(`mailto:${contact.description}`);

          break;
        case ContactType.WEBSITE:
          Linking.openURL(
            contact.description.startsWith('http') ? contact.description : 'http://' + contact.description
          );
          break;
        case ContactType.ADDRESS:
          const location = providerRouteParams.provider.contact?.address.location;

          if (location?.lat && location.lon) {
            openMap(location.lat, location.lon);
          }
          break;
      }
    }
  };

  const navigateToMhsudLoginScreen = useCallback(() => {
    onCloseLoginDrawer();
    navigationHandler.linkTo({ action: AppUrl.LOGIN_MHSUD });
  }, [navigationHandler]);

  const onCloseLoginDrawer = () => {
    setIsLoginDrawerEnabled(false);
  };

  const onCloseCreateAccountDrawer = () => {
    setIsCreateAccountDrawerEnabled(false);
  };

  const navigateToCreateAccount = () => {
    onCloseCreateAccountDrawer();
    navigationHandler.linkTo({ action: AppUrl.CREATE_ACCOUNT_MHSUD });
  };

  const onPressCreateAccountButton = () => {
    onCloseLoginDrawer();
    setIsCreateAccountDrawerEnabled(true);
  };

  const onPressToolTip = (tooltipData: TooltipCheck) => {
    setToolTipVisible((prev) =>
      prev !== undefined ? (prev.title === tooltipData.title ? undefined : tooltipData) : tooltipData
    );
  };

  const onToolTipClose = () => {
    setToolTipVisible(undefined);
  };

  const getProfileContent = async () => {
    setLoading(true);
    const profileInfoResponse: MhsudDisclaimerResponseDTO = await serviceProvider.callService(
      `/${loggedIn ? ExperienceType.SECURE : ExperienceType.PUBLIC}/${SourceType.MHSUD}/${Language.EN}${API_ENDPOINTS_JSON.TELEHEALTH.endpoint}`,
      RequestMethod.POST,
      {
        path:
          client?.source === SourceType.EAP
            ? `/emblemhealth/${Language.EN}/home/find-provider/view-provider-profile`
            : `/${client?.clientUri}/${Language.EN}/home/find-provider/view-provider-profile`,
        parameters: MHSUD_PARAMETERS,
        type: 'model',
      }
    );
    const profileCorrectionForm = profileInfoResponse.data?.reportProfileCorrectionForm;
    const profileOptions = transformOptionsData(profileCorrectionForm?.options.data);
    setProfileInfo({
      comments: profileCorrectionForm?.comments,
      name: profileCorrectionForm?.name,
      email: profileCorrectionForm?.email,
      contactInformationLabel: profileCorrectionForm?.contactInformationLabel?.replace('<p>', '').replace('</p>', ''),
      description: profileCorrectionForm?.description,
      title: profileCorrectionForm?.title,
      providerName: fullName,
      profileOptions,
    });
    setLoading(false);
    setIsProfileCorrectionModalShow(true);
  };

  const handleProfileSubmit = async (profileCorrection: ProfileCorrectionForm) => {
    setLoading(true);
    const submitData: ProfileCorrectionFormSubmit = {
      ...profileCorrection,
      planId: (client?.source === SourceType.EAP ? client.planId : selectedPlanInfo?.planId) ?? '',
      planName: (client?.source === SourceType.EAP ? eapPlanName : selectedPlanInfo?.memberFacingPlanName) ?? '',
      providerSource: {
        locationSourceId: providerDetailResponse.sourceSystem?.location.id ?? '',
        locationSourceKeyName: providerDetailResponse.sourceSystem?.location.keyName ?? '',
        sourceId: providerDetailResponse.sourceSystem?.id ?? '',
        sourceName: providerDetailResponse.sourceSystem?.keyName ?? '',
      },
    };
    try {
      await serviceProvider.callService(
        API_ENDPOINTS_JSON.PROFILE_CORRECTION_FORM.endpoint,
        RequestMethod.POST,
        submitData,
        { isSecureToken: true }
      );
      setShowSubmitSuccessAlert(true);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const transformOptionsData = (optionsData: OptionsDataResponseDTO[] | undefined) => {
    return optionsData?.map((option) => {
      return {
        ...option,
        selected: false,
      };
    });
  };

  const fullName = React.useMemo(() => {
    const { firstName, lastName } = providerDetailResponse.name
      ? providerDetailResponse.name
      : { firstName: '', lastName: '' };
    return `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
  }, [providerDetailResponse.name]);

  const closeProfileCorrectionModal = () => {
    setIsProfileCorrectionModalShow(false);
  };

  const onSubmitAlertButonPress = () => {
    setShowSubmitSuccessAlert(false);
  };

  return {
    providerDetailResponse,
    onPressRequestAppointment,
    isAlertEnabled,
    alertInfo,
    data,
    contacts,
    handleShowMore,
    viewAll,
    onPressContact,
    isLoginDrawerEnabled,
    isCreateAccountDrawerEnabled,
    navigateToMhsudLoginScreen,
    navigateToCreateAccount,
    onPressCreateAccountButton,
    onCloseLoginDrawer,
    onCloseCreateAccountDrawer,
    toolTipVisible,
    onPressToolTip,
    onToolTipClose,
    toggleDropdown,
    handleSelectOption,
    isDropdownVisible,
    isProfileCorrectionModalShow,
    closeProfileCorrectionModal,
    profileInfo,
    handleProfileSubmit,
    showSubmitSuccessAlert,
    onSubmitAlertButonPress,
    loading,
  };
};
