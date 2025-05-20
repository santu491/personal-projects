import { useEffect } from 'react';

import { AppUrl } from '../../../../../shared/src/models';
import { useMenuContext } from '../../context/menu.sdkContext';

export const useProfileDetailsPage = () => {
  const { navigationHandler, navigation } = useMenuContext();

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const handleEditPhoneNumber = () => {
    navigationHandler.linkTo({ action: AppUrl.UPDATE_PHONE_NUMBER });
  };

  return {
    handleEditPhoneNumber,
  };
};
