import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { convertDistanceString, formatTo24Hour } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { ProviderDetailProps } from '../../components/providerDetails/providerDetails';
import { getRequestCurrentStatusMessage } from '../../config/util/utils';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import { useGetRequestDetails } from '../../hooks/useGetRequestDetails';
import { ClinicalQuestions, SelectedProvider } from '../../models/appointmentContextInfo';
import {
  AppointmentListDataDTO,
  AppointmentsResponseDTO,
  RequestCurrentStatus,
  RequestHistoryApi,
} from '../../models/appointments';

export const useInActiveRequests = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [inActiveRequestsList, setInActiveRequestsList] = useState<ProviderDetailProps[]>([]);
  const appointmentContext = useAppointmentContext();
  const { getRequestDateAndTime } = useGetRequestDetails();

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
              value: getRequestCurrentStatusMessage(request.currentStatus),
            },
          ],
          title: `${toPascalCase(request.firstName)} ${toPascalCase(request.lastName)}, ${request.title}`,
          status: request.currentStatus,
          providerId: request.providerId,
        };
      });
      if (detailList) {
        setInActiveRequestsList((prevList) => [...prevList, ...detailList]);
      }
    },
    [getRequestDateAndTime, t]
  );

  const transformInActiveRequestsResponse = useCallback(
    (inActiveRequests: AppointmentListDataDTO[]) => {
      if (inActiveRequests.length === 0) {
        return;
      }

      inActiveRequests.map((requestDetails) => {
        const requestListData = requestDetails.selectedProviders?.map((request) => {
          const currentStatus =
            request.currentStatus === RequestCurrentStatus.ACCEPTED && request.isNewTimeProposed
              ? RequestCurrentStatus.NEW_TIME_PROPOSED
              : request.currentStatus;
          return {
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
            currentStatus,
            memberApprovedTimeForEmail: formatTo24Hour(request.providerPrefferedDateAndTime),
          };
        });
        transformRequestListToDetailList(requestListData);
      });
    },
    [transformRequestListToDetailList]
  );

  const getInActiveRequestsListApi = useCallback(async () => {
    setLoading(true);
    const queryParams = {
      status: RequestHistoryApi.CANCELED,
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
      const requestsListData = response.data as AppointmentListDataDTO[];
      transformInActiveRequestsResponse(requestsListData);
    } catch (error) {
      setInActiveRequestsList([]);
      setLoading(false);
      setIsServerError(true);
    }
  }, [appointmentContext.serviceProvider, transformInActiveRequestsResponse]);

  useEffect(() => {
    getInActiveRequestsListApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressTryAgain = () => {
    setIsServerError(false);
    getInActiveRequestsListApi();
  };

  return {
    getInActiveRequestsListApi,
    inActiveRequestsList,
    loading,
    isServerError,
    onPressTryAgain,
  };
};
