import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';

import { AlertModelProps } from '../../../../../shared/src/components/alertModel/alertModel';
import { AppUrl } from '../../../../../shared/src/models';
import { callNumber } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS, appColors } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { useProviderContext } from '../../context/provider.sdkContext';
import { AssessmentResponseDTO } from '../../model/assessmentStatusResponse';
import { Screen } from '../../navigation/providers.navigationTypes';
interface AppointmentInfo {
  description: string;
  title: string;
}

export const useScheduleAppointment = () => {
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertModelProps | undefined>(undefined);
  const { t } = useTranslation();
  const {
    serviceProvider,
    appointmentAssessmentStatus,
    scheduleAppointmentInfo,
    setAppointmentAssessmentStatus,
    setScheduleAppointmentInfo,
    isAddOrRemoveCounselorEnabled,
    setSelectedProviders,
    memberAppointmentStatus,
    navigation,
    navigationHandler,
    client,
  } = useProviderContext();
  const appointmentInfo: AppointmentInfo[] = useMemo(() => {
    const isClinicalQuestionnaire = appointmentAssessmentStatus
      ? [
          {
            title: t('appointment.clinicalQuestionnaire.title'),
            description: t('appointment.clinicalQuestionnaire.description'),
          },
        ]
      : [];
    return [
      ...isClinicalQuestionnaire,
      {
        title: t('appointment.counselorSetting.title'),
        description: t('appointment.counselorSetting.description'),
      },
      {
        title: t('appointment.review.title'),
        description: t('appointment.review.description'),
      },
    ];
  }, [appointmentAssessmentStatus, t]);

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const onPressLeftArrow = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      onPressLeftArrow();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation, onPressLeftArrow]);

  const checkAssessmentStatus = useCallback(async () => {
    try {
      const endpoint = `${API_ENDPOINTS.ASSESSMENT_STATUS}`;
      const response: AssessmentResponseDTO = await serviceProvider.callService(endpoint, RequestMethod.GET, null, {
        isSecureToken: true,
      });
      setAppointmentAssessmentStatus(response.data ? response.data : false);
    } catch (error) {
      setAppointmentAssessmentStatus(false);
    }
  }, [serviceProvider, setAppointmentAssessmentStatus]);

  const onPressContinue = () => {
    if (scheduleAppointmentInfo && !isAddOrRemoveCounselorEnabled) {
      setScheduleAppointmentInfo(undefined);
    }

    if (appointmentAssessmentStatus) {
      navigation.navigate(Screen.CLINICAL_QUESTIONNAIRE, { appointmentFlowStatus: false });
    } else {
      navigation.navigate(Screen.COUNSELOR_SETTINGS);
    }
  };

  useEffect(() => {
    checkAssessmentStatus();
  }, [checkAssessmentStatus]);

  const onPressContinueWithCounselor = useCallback(() => {
    closeAlert();
    if (memberAppointmentStatus?.data) {
      setSelectedProviders(memberAppointmentStatus.data);
    }
  }, [memberAppointmentStatus?.data, setSelectedProviders]);

  const onPressCancel = useCallback(() => {
    closeAlert();
    navigationHandler.linkTo({ action: AppUrl.HOME });
  }, [navigationHandler]);

  const closeAlert = () => {
    setIsAlertEnabled(false);
  };

  const providerName = useMemo(
    () =>
      memberAppointmentStatus?.data && memberAppointmentStatus.data.length > 0
        ? `${memberAppointmentStatus.data[0].firstName} ${memberAppointmentStatus.data[0].lastName}`
        : '',
    [memberAppointmentStatus?.data]
  );

  const showAlert = useCallback(() => {
    if (memberAppointmentStatus?.data && memberAppointmentStatus.data.length > 0) {
      setAlertInfo({
        onHandlePrimaryButton: onPressContinueWithCounselor,
        onHandleSecondaryButton: onPressCancel,
        title: t('appointment.alert.preSelected.title'),
        subTitle: t('appointment.alert.preSelected.message').replace(
          '{name}',
          `${memberAppointmentStatus.data[0].firstName} ${memberAppointmentStatus.data[0].lastName}`
        ),
        primaryButtonTitle: t('appointment.alert.preSelected.primaryButton'),
        secondaryButtonTitle: t('appointment.alert.preSelected.secondaryButton'),
        isError: true,
        errorIndicatorIconColor: appColors.lightDarkGray,
        modalVisible: true,
      });
      setIsAlertEnabled(true);
    }
  }, [memberAppointmentStatus?.data, onPressCancel, onPressContinueWithCounselor, t]);

  useEffect(() => {
    if (
      memberAppointmentStatus?.isContinue &&
      memberAppointmentStatus.data &&
      memberAppointmentStatus.data.length > 0
    ) {
      showAlert();
    }
  }, [memberAppointmentStatus?.data, memberAppointmentStatus?.isContinue, showAlert]);

  const onPressContact = useCallback(() => {
    if (client) {
      callNumber(client.supportNumber);
    }
  }, [client]);

  return {
    clientSupportNumber: client?.supportNumber,
    providerName,
    appointmentInfo,
    onPressContinue,
    onPressLeftArrow,
    isAlertEnabled,
    alertInfo,
    onPressContact,
  };
};
