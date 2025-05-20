import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatTo24Hour } from '../../../../../shared/src/utils/utils';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { CancelScreenType } from '../../constants/constants';
import { useAppointmentContext } from '../../context/appointments.sdkContext';
import {
  AppointmentCurrentStatus,
  AppointmentListDataDTO,
  AppointmentsMenu,
  AppointmentsResponseDTO,
  RequestCurrentStatus,
} from '../../models/appointments';
import { Screen } from '../../navigation/appointment.navigationTypes';

export const useAppointmentDetails = () => {
  const { t } = useTranslation();
  const appointmentContext = useAppointmentContext();
  const { navigation } = appointmentContext;
  const [loading, setLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentCurrentStatus | undefined>();
  const [appointmentDetailsList, setAppointmentDetailsList] = useState<AppointmentsMenu[] | undefined>();

  const transformAppointmentDetails = useCallback(() => {
    return [
      {
        label: t('appointments.appointmentDetailsContent.clinicalQuestionnaire'),
        action: Screen.CLINICAL_QUESTIONNAIRE_DETAILS,
      },
      {
        label: t('appointments.appointmentDetailsContent.proposedDaysAndTime'),
        action: Screen.PROPOSED_DAYS_AND_TIME,
      },
      {
        label: t('appointments.appointmentDetailsContent.requests'),
        action: Screen.APPOINTMENT_DETAILS_REQUESTS,
      },
    ];
  }, [t]);

  const transformAppointmentData = useCallback(
    (appointmentData: AppointmentListDataDTO) => {
      const appointmentCurrentStatus = appointmentData.isApproved
        ? AppointmentCurrentStatus.IS_APPROVED
        : appointmentData.isInactivated
          ? AppointmentCurrentStatus.IS_IN_ACTIVATED
          : AppointmentCurrentStatus.IS_INITIATED;
      setAppointmentStatus(appointmentCurrentStatus);
      const providers = appointmentData.selectedProviders?.map((provider) => {
        return {
          currentStatus:
            provider.currentStatus === RequestCurrentStatus.ACCEPTED && provider.isNewTimeProposed
              ? RequestCurrentStatus.NEW_TIME_PROPOSED
              : provider.currentStatus,
          distance: provider.distance,
          memberPrefferedSlot: appointmentData.memberPrefferedSlot,
          clinicalQuestions: appointmentData.clinicalQuestions,
          providerPrefferedDateAndTime: provider.providerPrefferedDateAndTime,
          providerType: provider.providerType,
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
      if (providers && providers.length > 0) {
        appointmentContext.setSelectedProviders(providers);
        const appointmentList = transformAppointmentDetails();
        setAppointmentDetailsList(appointmentList);
      } else {
        appointmentContext.setSelectedProviders([]);
        setAppointmentDetailsList(undefined);
      }
    },
    [appointmentContext, transformAppointmentDetails]
  );

  const getAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response: AppointmentsResponseDTO = await appointmentContext.serviceProvider.callService(
        API_ENDPOINTS.APPOINTMENT_DETAILS,
        RequestMethod.GET,
        null,
        { isSecureToken: true }
      );
      setLoading(false);
      if (response.data) {
        const appointmentData = response.data as AppointmentListDataDTO;
        transformAppointmentData(appointmentData);
      } else {
        setAppointmentDetailsList(undefined);
      }
    } catch (error) {
      setLoading(false);
      setIsServerError(true);
    }
  }, [appointmentContext, transformAppointmentData]);

  useEffect(() => {
    getAppointmentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigation = (item: Screen) => {
    if (item === Screen.APPOINTMENT_DETAILS_REQUESTS) {
      navigation.navigate(item, {
        screenType: CancelScreenType.APPOINTMENT_DETAIL_REQUEST,
        appointmentCurrentStatus: appointmentStatus,
      });
    } else {
      if (item !== Screen.VIEW_OTHER_REQUESTS) {
        navigation.navigate(item);
      }
    }
  };

  const onPressTryAgain = () => {
    setIsServerError(false);
    getAppointmentDetails();
  };

  return {
    handleNavigation,
    loading,
    onPressTryAgain,
    isServerError,
    appointmentContext,
    appointmentDetailsList,
  };
};
