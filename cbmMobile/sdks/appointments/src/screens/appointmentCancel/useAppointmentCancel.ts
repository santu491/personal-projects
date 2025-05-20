import { useRoute } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native-gesture-handler';

import { convertDistanceString, formatTo24Hour } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { getRequestCurrentStatusMessage, showCancelOption } from '../../config/util/utils';
import { CancelRequestType, CancelScreenType } from '../../constants/constants';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../hooks/useGetRequestDetails';
import { ClinicalQuestions } from '../../models/appointmentContextInfo';
import {
  AppointmentCurrentStatus,
  AppointmentListDataDTO,
  AppointmentsResponseDTO,
  CancelRequestDTO,
  CancelResponseDTO,
  RequestCurrentStatus,
} from '../../models/appointments';
import { AppointmentDetailsRequestsScreenProps, Screen } from '../../navigation/appointment.navigationTypes';

export const useAppointmentCancel = () => {
  const { t } = useTranslation();
  const appointmentContext = useAppointmentContext();
  const { navigation } = appointmentContext;
  const [isCancelAlert, setIsCancelAlert] = useState(false);
  const [isRequestCanceled, setIsRequestCanceled] = useState(false);
  const [cancelRequestType, setCancelRequestType] = useState<CancelRequestType>();
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState<string>();
  const { getRequestDateAndTime } = useGetRequestDetails();
  const listRef = useRef<FlatList>(null);
  const { screenType, appointmentCurrentStatus } = useRoute<AppointmentDetailsRequestsScreenProps['route']>().params;

  const getButtonsData = useMemo(() => {
    let isCancel = false;
    let isCancelAll = false;
    let isConfirm = false;

    switch (screenType) {
      case CancelScreenType.APPOINTMENT_DETAIL_REQUEST:
        isCancel = true;
        isCancelAll = true;
        isConfirm = true;
        break;
      case CancelScreenType.CANCEL_REQUEST:
        isCancel = true;
        isCancelAll = true;
        break;
      case CancelScreenType.MULTIPLE_PENDING_REQUESTS:
        isCancel = true;
        isConfirm = true;
        break;
      default:
        break;
    }

    return { isCancel, isCancelAll, isConfirm };
  }, [screenType]);

  const providerDetails = useMemo(() => {
    return appointmentContext.selectedProviders?.map((request) => {
      const problemData: ClinicalQuestions | undefined = request.clinicalQuestions;
      return {
        listData: [
          {
            label: t('appointments.appointmentDetailsContent.qualification'),
            value: request.title,
          },
          {
            label: t('appointments.appointmentDetailsContent.specialty'),
            value: request.providerType,
          },
          {
            label: t('appointments.problem'),
            value: problemData
              ? `${problemData.questionnaire.length > 0 ? problemData.questionnaire[0].presentingProblem : ''}`
              : '',
          },
          {
            label: t('appointments.appointmentDetailsContent.milesAway'),
            value: `${convertDistanceString(request.distance)} ${t('appointments.milesAwayValue')}`,
          },
          {
            label: t('appointments.appointmentDetailsContent.dateTime'),
            value: getRequestDateAndTime(request),
          },
          {
            label: t('appointments.appointmentDetailsContent.status'),
            value: `${getRequestCurrentStatusMessage(request.currentStatus)}`,
          },
        ],
        title: `${toPascalCase(request.firstName)} ${toPascalCase(request.lastName)}, ${request.title}`,
        providerId: request.providerId,
        status: request.currentStatus,
      };
    });
  }, [appointmentContext.selectedProviders, getRequestDateAndTime, t]);

  const isCancelAll = providerDetails?.every((provider) => showCancelOption(provider.status));

  const navigateToAppointmentHistory = () => {
    navigation.navigate(Screen.APPOINTMENTS_HISTORY);
  };

  const transformAppointmentData = (appointmentData: AppointmentListDataDTO) => {
    const providers = appointmentData.selectedProviders?.map((provider) => {
      const currentStatus =
        provider.currentStatus === RequestCurrentStatus.ACCEPTED && provider.isNewTimeProposed
          ? RequestCurrentStatus.NEW_TIME_PROPOSED
          : provider.currentStatus;
      return {
        currentStatus,
        distance: provider.distance,
        memberPrefferedSlot: appointmentData.memberPrefferedSlot,
        providerPrefferedDateAndTime: provider.providerPrefferedDateAndTime,
        providerType: provider.providerType,
        clinicalQuestions: appointmentData.clinicalQuestions,
        firstName: provider.firstName,
        lastName: provider.lastName,
        name: provider.name,
        title: provider.title,
        providerId: provider.providerId,
        appointmentId: appointmentData.id,
        isNewTimeProposed: provider.isNewTimeProposed,
        memberApprovedTimeForEmail: formatTo24Hour(provider.providerPrefferedDateAndTime),
        workFlowStatus: provider.workFlowStatus,
      };
    });
    appointmentContext.setSelectedProviders(providers);
  };

  const getAppointmentData = async () => {
    const appointmentId = appointmentContext.selectedProviders
      ? appointmentContext.selectedProviders[0]?.appointmentId
      : undefined;
    try {
      setLoading(true);
      const response: AppointmentsResponseDTO = await appointmentContext.serviceProvider.callService(
        `${API_ENDPOINTS.APPOINTMENT_BY_ID}/${appointmentId}`,
        RequestMethod.GET,
        null,
        { isSecureToken: true }
      );
      setLoading(false);
      const appointmentData = response.data as AppointmentListDataDTO;
      transformAppointmentData(appointmentData);
    } catch (error) {
      setLoading(false);
      console.warn('Error fetching appoinment details', error);
    } finally {
      setLoading(false);
    }
  };

  const onAlertPrimaryButtonPress = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
      case CancelRequestType.CANCEL_ALL:
      case CancelRequestType.CONFIRM:
        setIsCancelAlert(false);
        cancelRequests();
        break;
      case CancelRequestType.REQUEST_CANCELED:
        setIsRequestCanceled(false);
        if (
          (appointmentContext.selectedProviders && appointmentContext.selectedProviders.length === 1) ||
          appointmentCurrentStatus === AppointmentCurrentStatus.IS_APPROVED
        ) {
          navigateToAppointmentHistory();
        } else {
          getAppointmentData();
          handleScrollToTop();
        }
        break;
      case CancelRequestType.REQUESTS_CANCELED:
      case CancelRequestType.REQUEST_CONFIRMED:
        setIsRequestCanceled(false);
        navigateToAppointmentHistory();
        break;
      case CancelRequestType.SERVER_ERROR:
        setIsCancelAlert(false);
        setIsRequestCanceled(false);
        break;
      default:
        break;
    }
  };

  const onAlertSecondaryButtonPress = () => {
    setIsRequestCanceled(false);
    setIsCancelAlert(false);
    if (cancelRequestType === CancelRequestType.CONFIRM) {
      navigation.goBack();
    }
  };

  const cancelRequests = async () => {
    try {
      setLoading(true);
      const requestData =
        appointmentContext.selectedProviders?.find((provider) => provider.providerId === providerId) ??
        appointmentContext.selectedProviders?.[0];
      const request: CancelRequestDTO = {
        id: requestData ? requestData.appointmentId : undefined,
      };
      if (providerId) {
        request.providerId = `${providerId}`; // Need to send as string so used like this.
        request.lastUpdatedStatus = requestData?.workFlowStatus?.length
          ? requestData.workFlowStatus[requestData.workFlowStatus.length - 1]?.action
          : undefined;
        if (cancelRequestType === CancelRequestType.CANCEL) {
          request.status =
            requestData?.currentStatus === RequestCurrentStatus.ACCEPTED
              ? RequestCurrentStatus.MBR_CANCEL
              : RequestCurrentStatus.REJECTED;
        } else {
          request.status = RequestCurrentStatus.APPROVED;
          request.appointmentScheduledDateAndTime = requestData?.providerPrefferedDateAndTime;
          request.memberApprovedTimeForEmail = requestData?.memberApprovedTimeForEmail;
        }
      } else {
        request.status = RequestCurrentStatus.MBR_CANCEL;
      }
      const response: CancelResponseDTO = await appointmentContext.serviceProvider.callService(
        API_ENDPOINTS.SUBMIT_APPOINTMENT,
        RequestMethod.PUT,
        request,
        { isSecureToken: true }
      );
      setLoading(false);
      if (response.data) {
        if (providerId) {
          const requestStatus =
            cancelRequestType === CancelRequestType.CANCEL
              ? CancelRequestType.REQUEST_CANCELED
              : CancelRequestType.REQUEST_CONFIRMED;
          setCancelRequestType(requestStatus);
          setIsRequestCanceled(true);
        } else {
          setIsRequestCanceled(true);
          setCancelRequestType(CancelRequestType.REQUESTS_CANCELED);
        }
      }
    } catch (error) {
      setLoading(false);
      setIsRequestCanceled(true);
      setIsCancelAlert(true);
      setCancelRequestType(CancelRequestType.SERVER_ERROR);
    }
  };

  const onHandleCancelRequest = (id?: string) => {
    setCancelRequestType(CancelRequestType.CANCEL);
    setIsCancelAlert(true);
    setProviderId(id);
  };

  const onHandleCancelAll = () => {
    setIsCancelAlert(true);
    setCancelRequestType(CancelRequestType.CANCEL_ALL);
    setProviderId(undefined);
  };

  const onHandleConfirmRequest = (id?: string) => {
    setProviderId(id);
    setIsCancelAlert(true);
    setCancelRequestType(CancelRequestType.CONFIRM);
  };

  const cancelAlertTitle = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
        return t('appointments.appointmentDetailsContent.cancelAlertTitle');
      case CancelRequestType.CANCEL_ALL:
        return t('appointments.appointmentDetailsContent.cancelAllAlertTitle');
      case CancelRequestType.CONFIRM:
        return t('appointments.appointmentDetailsContent.confirmRequest');
      case CancelRequestType.REQUEST_CANCELED:
        return t('appointments.appointmentDetailsContent.requestCanceledTitle');
      case CancelRequestType.REQUESTS_CANCELED:
        return t('appointments.appointmentDetailsContent.allRequestCanceledTitle');
      case CancelRequestType.REQUEST_CONFIRMED:
        return t('appointments.appointmentDetailsContent.confirmRequestButton');
      case CancelRequestType.SERVER_ERROR:
        return t('appointments.errors.title');
      default:
        return '';
    }
  };

  const cancelAlertDescription = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
        return t('appointments.appointmentDetailsContent.cancelAlertDescription');
      case CancelRequestType.CANCEL_ALL:
        return t('appointments.appointmentDetailsContent.cancelAllAlertDescription');
      case CancelRequestType.CONFIRM:
        return t('appointments.appointmentDetailsContent.confirmRequestDescription');
      case CancelRequestType.REQUEST_CANCELED:
        return t('appointments.appointmentDetailsContent.requestCanceledDescription');
      case CancelRequestType.REQUESTS_CANCELED:
        return t('appointments.appointmentDetailsContent.allRequestCanceledDescription');
      case CancelRequestType.REQUEST_CONFIRMED:
        return t('appointments.appointmentDetailsContent.requestConfirmedDescription');
      case CancelRequestType.SERVER_ERROR:
        return t('appointments.errors.description');
      default:
        return '';
    }
  };

  const primaryButtonTitle = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
        return t('appointments.appointmentDetailsContent.cancelAlertPrimaryButton');
      case CancelRequestType.CONFIRM:
        return t('appointments.appointmentDetailsContent.confirmAlertPrimaryButton');
      case CancelRequestType.CANCEL_ALL:
        return t('appointments.appointmentDetailsContent.cancelAllAlertPrimaryButton');
      case CancelRequestType.REQUEST_CANCELED:
      case CancelRequestType.REQUESTS_CANCELED:
      case CancelRequestType.REQUEST_CONFIRMED:
        return t('appointments.appointmentDetailsContent.cancelSuccessButton');
      case CancelRequestType.SERVER_ERROR:
        return t('appointments.errors.tryAgainButton');
      default:
        return '';
    }
  };

  const secondaryButtonTitle = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
        return t('appointments.appointmentDetailsContent.cancelAlertSecondaryButton');
      case CancelRequestType.CANCEL_ALL:
        return t('appointments.appointmentDetailsContent.cancelAllAlertSecondaryButton');
      case CancelRequestType.CONFIRM:
        return t('appointments.appointmentDetailsContent.previousButton');
      case CancelRequestType.REQUEST_CANCELED:
      case CancelRequestType.REQUESTS_CANCELED:
      case CancelRequestType.REQUEST_CONFIRMED:
        return undefined;
      case CancelRequestType.SERVER_ERROR:
        return undefined;
      default:
        return '';
    }
  };

  const providersCount = useCallback(() => {
    const count = appointmentContext.selectedProviders ? appointmentContext.selectedProviders.length : 0;
    return count < 10 && count !== 0 ? `(0${count})` : `(${count})`;
  }, [appointmentContext.selectedProviders]);

  const getHeaderTitles = useMemo(() => {
    let title: string = '';
    let description: string | undefined;
    switch (screenType) {
      case CancelScreenType.APPOINTMENT_DETAIL_REQUEST:
        title = `${t('appointments.appointmentDetailsContent.requests')} ${providersCount()}`;
        description = undefined;
        break;
      case CancelScreenType.CANCEL_REQUEST:
        title = `${t('appointments.cancelRequest')}`;
        description = undefined;
        break;
      case CancelScreenType.MULTIPLE_PENDING_REQUESTS:
        title = `${t('appointments.pendingRequests')}`;
        description = providerDetails ? t('appointments.pendingConfirmDescription') : undefined;
        break;
      default:
        break;
    }
    return { title, description };
  }, [providerDetails, providersCount, screenType, t]);

  const handleScrollToTop = useCallback(() => {
    listRef.current?.scrollToIndex({ animated: true, index: 0 });
  }, []);

  return {
    providerDetails,
    onHandleCancelRequest,
    onHandleCancelAll,
    isCancelAlert,
    isRequestCanceled,
    onAlertPrimaryButtonPress,
    onAlertSecondaryButtonPress,
    cancelAlertTitle,
    cancelAlertDescription,
    primaryButtonTitle,
    secondaryButtonTitle,
    loading,
    providersCount,
    isCancelAll,
    onHandleConfirmRequest,
    buttonsData: getButtonsData,
    headersData: getHeaderTitles,
    selectedProvider: appointmentContext.selectedProviders?.find((provider) => provider.providerId === providerId),
    cancelRequestType,
    listRef,
    screenType,
    appointmentCurrentStatus,
  };
};
