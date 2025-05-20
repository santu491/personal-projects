import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertDistanceString, formatProviderDate, formatTo24Hour } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { ProviderDetailProps } from '../../components/providerDetails/providerDetails';
import { getRequestCurrentStatusMessage } from '../../config/util/utils';
import { CancelRequestType } from '../../constants/constants';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../hooks/useGetRequestDetails';
import { ClinicalQuestions, SelectedProvider } from '../../models/appointmentContextInfo';
import {
  AppointmentListDataDTO,
  AppointmentsResponseDTO,
  CancelRequestDTO,
  RequestCurrentStatus,
  RequestHistoryApi,
} from '../../models/appointments';
import { Screen } from '../../navigation/appointment.navigationTypes';

export const useConfirmedRequests = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);

  const [confirmedRequestsList, setConfirmedRequestsList] = useState<ProviderDetailProps[]>();
  const [otherRequestList, setOtherRequestList] = useState<ProviderDetailProps[]>();
  const [isCancelAlert, setIsCancelAlert] = useState(false);
  const [isRequestCanceled, setIsRequestCanceled] = useState(false);
  const [cancelRequestType, setCancelRequestType] = useState<CancelRequestType>();
  const [providerId, setProviderId] = useState<string>();
  const appointmentContext = useAppointmentContext();
  const { getRequestDateAndTime } = useGetRequestDetails();
  const { navigation } = appointmentContext;

  const onHandleViewOtherRequests = () => {
    const dateOfInitiation = formatProviderDate(appointmentContext.selectedProviders?.[0]?.dateOfInitiation);
    navigation.navigate(Screen.VIEW_OTHER_REQUESTS, {
      otherRequestList,
      dateOfInitiation,
    });
  };

  const transformRequestListToDetailList = useCallback(
    (requestList?: SelectedProvider[]) => {
      const detailList = requestList?.map((request) => {
        const problemData: ClinicalQuestions | undefined = request.clinicalQuestions;
        return {
          listData: [
            {
              label: t('appointments.appointmentDetailsContent.qualification'),
              value: request.title,
            },
            {
              label: t('appointments.specialty'),
              value: request.providerType,
            },
            {
              label: t('appointments.problem'),
              value: problemData
                ? `${problemData.questionnaire.length > 0 ? problemData.questionnaire[0].presentingProblem : ''}`
                : '',
            },
            {
              label: t('appointments.milesAway'),
              value: `${convertDistanceString(request.distance)} ${t('appointments.milesAwayValue')}`,
            },
            {
              label: t('appointments.dateTime'),
              value: getRequestDateAndTime(request),
            },
            {
              label: t('appointments.status'),
              value: `${getRequestCurrentStatusMessage(request.currentStatus)}`,
            },
          ],
          title: `${toPascalCase(request.firstName)} ${toPascalCase(request.lastName)}, ${request.title}`,
          status: request.currentStatus,
          dateOfInitiation: formatProviderDate(request.dateOfInitiation),
          providerId: request.providerId,
        };
      });
      return detailList;
    },
    [getRequestDateAndTime, t]
  );

  const transformInActiveRequestsResponse = useCallback(
    (inActiveRequests: AppointmentListDataDTO[]) => {
      if (inActiveRequests.length === 0) {
        return;
      }
      const requestDetails = inActiveRequests[0];
      const requestListData = requestDetails.selectedProviders?.map((request) => {
        const currentStatus =
          request.currentStatus === RequestCurrentStatus.ACCEPTED && request.isNewTimeProposed
            ? RequestCurrentStatus.NEW_TIME_PROPOSED
            : request.currentStatus;
        return {
          currentStatus,
          distance: request.distance,
          memberPrefferedSlot: requestDetails.memberPrefferedSlot,
          providerType: request.providerType,
          firstName: request.firstName,
          lastName: request.lastName,
          name: request.name,
          title: request.title,
          clinicalQuestions: requestDetails.clinicalQuestions,
          isNewTimeProposed: request.isNewTimeProposed,
          providerPrefferedDateAndTime: request.providerPrefferedDateAndTime,
          dateOfInitiation: requestDetails.dateOfInitiation,
          providerId: request.providerId,
          appointmentId: requestDetails.id,
          memberApprovedTimeForEmail: formatTo24Hour(request.providerPrefferedDateAndTime),
          workFlowStatus: request.workFlowStatus,
        };
      });

      appointmentContext.setSelectedProviders(requestListData);
      const confirmedRequests = requestListData?.filter(
        (request) => request.currentStatus === RequestCurrentStatus.APPROVED
      );

      const unConfirmedRequests = requestListData?.filter(
        (request) => request.currentStatus !== RequestCurrentStatus.APPROVED
      );
      const confirmedData = transformRequestListToDetailList(confirmedRequests);
      setConfirmedRequestsList(confirmedData);

      const unConfirmedData = transformRequestListToDetailList(unConfirmedRequests);
      setOtherRequestList(unConfirmedData);
    },
    [appointmentContext, transformRequestListToDetailList]
  );

  const getConfirmedRequestsListApi = useCallback(async () => {
    setLoading(true);
    const queryParams = {
      status: RequestHistoryApi.CONFIRMED,
    };
    const params = new URLSearchParams(queryParams).toString();
    try {
      const confirmedRequestsUrl = `${API_ENDPOINTS.APPOINTMENT_REQUESTS}?${params}`;
      const response: AppointmentsResponseDTO = await appointmentContext.serviceProvider.callService(
        confirmedRequestsUrl,
        RequestMethod.GET,
        null,
        {
          isSecureToken: true,
        }
      );
      setLoading(false);
      const requestsListData = response.data as AppointmentListDataDTO[];
      transformInActiveRequestsResponse(requestsListData);
    } catch (error) {
      setLoading(false);
      setConfirmedRequestsList([]);
      setIsServerError(true);
    }
  }, [appointmentContext.serviceProvider, transformInActiveRequestsResponse]);

  const onAlertPrimaryButtonPress = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
        cancelRequests(RequestCurrentStatus.MBR_CANCEL);
        setIsCancelAlert(false);
        break;
      case CancelRequestType.REQUEST_CANCELED:
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
  };

  const cancelRequests = async (cancelStatus: string) => {
    try {
      setLoading(true);
      const requestData =
        appointmentContext.selectedProviders?.find((provider) => provider.providerId === providerId) ??
        appointmentContext.selectedProviders?.[0];
      const request: CancelRequestDTO = {
        id: requestData?.appointmentId,
        providerId: `${providerId}`,
        status: cancelStatus,
        lastUpdatedStatus: requestData?.workFlowStatus?.length
          ? requestData.workFlowStatus[requestData.workFlowStatus.length - 1]?.action
          : undefined,
      };

      await appointmentContext.serviceProvider.callService(
        API_ENDPOINTS.SUBMIT_APPOINTMENT,
        RequestMethod.PUT,
        request,
        { isSecureToken: true }
      );
      setLoading(false);
      setIsRequestCanceled(true);
      setIsCancelAlert(false);
      setCancelRequestType(CancelRequestType.REQUEST_CANCELED);
    } catch (error) {
      setLoading(false);
      setCancelRequestType(CancelRequestType.SERVER_ERROR);
      setIsRequestCanceled(true);
      setIsCancelAlert(true);
    }
  };

  const cancelAlertTitle = () => {
    switch (cancelRequestType) {
      case CancelRequestType.CANCEL:
        return t('appointments.appointmentDetailsContent.cancelAlertTitle');
      case CancelRequestType.REQUEST_CANCELED:
        return t('appointments.appointmentDetailsContent.requestCanceledTitle');
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
      case CancelRequestType.REQUEST_CANCELED:
        return t('appointments.appointmentDetailsContent.requestCanceledDescription');
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
      case CancelRequestType.REQUEST_CANCELED:
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
      case CancelRequestType.REQUEST_CANCELED:
        return undefined;
      case CancelRequestType.SERVER_ERROR:
        return undefined;
      default:
        return '';
    }
  };

  const onHandleCancelRequest = (id?: string) => {
    setCancelRequestType(CancelRequestType.CANCEL);
    setIsCancelAlert(true);
    setProviderId(id);
  };

  const navigateToAppointmentHistory = () => {
    navigation.navigate(Screen.APPOINTMENTS_HISTORY);
  };

  useEffect(() => {
    getConfirmedRequestsListApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressTryAgain = () => {
    setIsServerError(false);
    getConfirmedRequestsListApi();
  };

  return {
    getConfirmedRequestsListApi,
    confirmedRequestsList,
    loading,
    onHandleViewOtherRequests,
    onHandleCancelRequest,
    isCancelAlert,
    isRequestCanceled,
    onAlertPrimaryButtonPress,
    onAlertSecondaryButtonPress,
    cancelAlertTitle,
    cancelAlertDescription,
    primaryButtonTitle,
    secondaryButtonTitle,
    cancelRequestType,
    isServerError,
    onPressTryAgain,
  };
};
