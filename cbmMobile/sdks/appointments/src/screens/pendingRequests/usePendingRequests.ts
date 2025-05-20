import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatTo24Hour } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { ProviderDetailProps } from '../../components/providerDetails/providerDetails';
import { getRequestCurrentStatusMessage } from '../../config/util/utils';
import { CancelScreenType } from '../../constants/constants';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../hooks/useGetRequestDetails';
import { ClinicalQuestions, SelectedProvider } from '../../models/appointmentContextInfo';
import {
  AppointmentListDataDTO,
  AppointmentsResponseDTO,
  RequestCurrentStatus,
  RequestHistoryApi,
  RequestLabels,
} from '../../models/appointments';
import { Screen } from '../../navigation/appointment.navigationTypes';

export const usePendingRequests = () => {
  const { t } = useTranslation();
  const { getRequestDateAndTime } = useGetRequestDetails();
  const [loading, setLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [pendingRequestsList, setPendingRequestsList] = useState<ProviderDetailProps | undefined>();
  const appointmentContext = useAppointmentContext();
  const { navigation } = appointmentContext;

  const transformRequestListToDetailList = useCallback(
    (requestList?: SelectedProvider[]) => {
      const detailList = requestList?.map((request) => {
        const problemData: ClinicalQuestions | undefined = request.clinicalQuestions;
        return {
          listData: [
            {
              label: requestList.length > 1 ? t('appointments.counselors') : t('appointments.counselor'),
              value: `${toPascalCase(request.firstName)} ${toPascalCase(request.lastName)}`,
            },
            {
              label: t('appointments.problem'),
              value: problemData
                ? `${problemData.questionnaire.length > 0 ? problemData.questionnaire[0].presentingProblem : ''}`
                : '',
            },
            {
              label: t('appointments.dateTime'),
              value: getRequestDateAndTime(request),
            },
            {
              label: t('appointments.status'),
              value: getRequestCurrentStatusMessage(
                requestList.length > 1 ? RequestLabels.MULTIPLE_RESPONSES : request.currentStatus
              ),
            },
          ],
          title: t('appointments.pendingRequests'),
          status: requestList.length > 1 ? RequestLabels.MULTIPLE_RESPONSES : request.currentStatus,
          providerId: request.providerId,
          requestCount: requestList.length > 1 ? `+${requestList.length - 1}` : undefined,
        };
      });
      if (detailList && detailList.length > 0) {
        setPendingRequestsList(detailList[0]);
      }
      return detailList;
    },
    [getRequestDateAndTime, t]
  );

  const transformPendingRequestsResponse = useCallback(
    (pendingRequests: AppointmentListDataDTO[]) => {
      if (pendingRequests.length === 0) {
        return;
      }
      const requestDetails = pendingRequests[0];
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
          providerId: request.providerId,
          appointmentId: requestDetails.id,
          memberApprovedTimeForEmail: formatTo24Hour(request.providerPrefferedDateAndTime),
          workFlowStatus: request.workFlowStatus,
        };
      });
      appointmentContext.setSelectedProviders(requestListData);
      transformRequestListToDetailList(requestListData);
    },
    [appointmentContext, transformRequestListToDetailList]
  );

  const getPendingRequestsListApi = useCallback(async () => {
    setLoading(true);
    const queryParams = {
      status: RequestHistoryApi.PENDING,
    };
    const params = new URLSearchParams(queryParams).toString();
    try {
      const inActiveRequestsUrl = `${API_ENDPOINTS.APPOINTMENT_REQUESTS}?${params}`;
      const response: AppointmentsResponseDTO = await appointmentContext.serviceProvider.callService(
        inActiveRequestsUrl,
        RequestMethod.GET,
        null,
        {
          isSecureToken: true,
        }
      );
      setLoading(false);
      const pendingRequestData = response.data as AppointmentListDataDTO[];
      transformPendingRequestsResponse(pendingRequestData);
    } catch (error) {
      setLoading(false);
      setPendingRequestsList(undefined);
      setIsServerError(true);
    }
  }, [appointmentContext.serviceProvider, transformPendingRequestsResponse]);

  useEffect(() => {
    getPendingRequestsListApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressTryAgain = () => {
    setIsServerError(false);
    getPendingRequestsListApi();
  };

  const onPressContinueButton = () => {
    navigation.navigate(Screen.APPOINTMENT_DETAILS_REQUESTS, {
      screenType: CancelScreenType.MULTIPLE_PENDING_REQUESTS,
    });
  };

  const onPressCancelRequest = () => {
    navigation.navigate(Screen.APPOINTMENT_DETAILS_REQUESTS, { screenType: CancelScreenType.CANCEL_REQUEST });
  };

  return {
    pendingRequestsList,
    loading,
    onPressContinueButton,
    onPressCancelRequest,
    isServerError,
    onPressTryAgain,
  };
};
