import { useRoute } from '@react-navigation/native';

import { ViewOtherRequestsScreenProps } from '../../navigation/appointment.navigationTypes';

export const useViewOtherRequests = () => {
  const { otherRequestList, dateOfInitiation } = useRoute<ViewOtherRequestsScreenProps['route']>().params;

  return {
    otherRequestList,
    dateOfInitiation,
  };
};
