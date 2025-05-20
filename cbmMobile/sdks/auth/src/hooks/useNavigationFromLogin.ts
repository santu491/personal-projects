import { useCallback } from 'react';

import { AppUrl } from '../../../../shared/src/models';
import { API_ENDPOINTS, APP_CONTENT, ScreenNames } from '../../../../src/config';
import { useAppContext } from '../../../../src/context/appContext';
import { RequestMethod } from '../../../../src/models/adapters';
import { AppointmentTabStatusResponseDTO } from '../../../appointments/src/models/appointments';
import { ProviderAppointmentStatusDTO } from '../../../providers/src/model/providerFilter';

export const useNavigationFromLogin = () => {
  const appContext = useAppContext();
  const { setMemberAppointStatus, setNavigateScreen, navigateScreen, navigationHandler } = appContext;

  const providerMemberStatusAPI = async (iamguid?: string) => {
    try {
      const headers = { iamguid: iamguid ?? '', isSecureToken: true };

      const result: ProviderAppointmentStatusDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.PROVIDER_MEMBER_STATUS,
        RequestMethod.GET,
        null,
        headers
      );
      const resData = result.data;

      if (resData.success) {
        setMemberAppointStatus({
          isAppointmentConfirmed: false,
          isContinue: true,
          isPending: false,
          data: (resData.data && resData.data[0] && resData.data[0].selectedProviders) ?? [],
        });
        navigationHandler.linkTo({ action: AppUrl.SCHEDULE_APPOINTMENT });
      } else {
        await getAppointmentTabStatus();
      }
    } catch (error) {
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  };

  const getAppointmentTabStatus = useCallback(async () => {
    try {
      const response: AppointmentTabStatusResponseDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.APPOINTMENT_TAB_STATUS,
        RequestMethod.GET,
        null,
        { isSecureToken: true }
      );

      setMemberAppointStatus({
        isAppointmentConfirmed: response.data.isApproved,
        isContinue: false,
        isPending: response.data.isInitiated,
      });
      navigationHandler.linkTo({ action: AppUrl.HOME });
    } catch (error) {}
  }, [navigationHandler, appContext.serviceProvider, setMemberAppointStatus]);

  const navigationFromLogin = async (iamguid?: string) => {
    switch (navigateScreen) {
      case ScreenNames.SCHEDULE_APPOINTMENT:
        await providerMemberStatusAPI(iamguid);
        break;
      default:
        navigationHandler.linkTo({ action: AppUrl.HOME });
        break;
    }
    setNavigateScreen(undefined);
  };

  return {
    navigationFromLogin,
  };
};
