import { useTranslation } from 'react-i18next';

import { formatProviderDate, formatTime } from '../../../../shared/src/utils/utils';
import { SelectedProvider } from '../models/appointmentContextInfo';

export const useGetRequestDetails = () => {
  const { t } = useTranslation();

  const getRequestDateAndTime = (request: SelectedProvider) => {
    if (request.providerPrefferedDateAndTime) {
      return `${formatProviderDate(request.providerPrefferedDateAndTime)}//${formatTime(request.providerPrefferedDateAndTime)}`;
    } else if (request.memberPrefferedSlot.days) {
      return `${request.memberPrefferedSlot.days.join(', ')}//${request.memberPrefferedSlot.time}`;
    } else {
      return t('appointments.availableCounselor');
    }
  };

  return {
    getRequestDateAndTime,
  };
};
