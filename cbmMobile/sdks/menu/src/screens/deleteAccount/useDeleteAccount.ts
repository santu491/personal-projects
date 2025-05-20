import { useEffect, useState } from 'react';

import { AppUrl } from '../../../../../shared/src/models';
import { Service } from '../../../../../src/adapters/api/service';
import { API_ENDPOINTS, APP_CONTENT } from '../../../../../src/config';
import { useAppContext } from '../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../src/models/adapters';
import { useMenuContext } from '../../context/menu.sdkContext';

export const useDeleteAccount = () => {
  const appContext = useAppContext();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [enableDeleteButton, setEnableDeleteButton] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { navigationHandler } = appContext;
  const { navigation } = useMenuContext();

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const handleCancel = () => {
    setShowBottomSheet(false);
  };

  const handleCheckboxConfirmation = () => {
    setEnableDeleteButton(!enableDeleteButton);
  };

  const handleDeleteAccountBottomSheet = () => {
    setShowBottomSheet(true);
    setEnableDeleteButton(false);
  };

  const handleDeleteAccount = async () => {
    try {
      if (enableDeleteButton) {
        await appContext.serviceProvider.callService(API_ENDPOINTS.DELETE_ACCOUNT, RequestMethod.POST, null, {});
        setShowBottomSheet(false);
        setShowAlert(true);
        setEnableDeleteButton(false);
        appContext.setLoggedIn(false);
        appContext.setServiceProvider(new Service().serviceProvider);
      }
    } catch (error) {
      setShowAlert(false);
      setShowBottomSheet(true);
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  };

  const navigateToHome = () => {
    setShowAlert(false);
    navigationHandler.linkTo({ action: AppUrl.HOME });
  };

  return {
    showBottomSheet,
    showAlert,
    setShowBottomSheet,
    handleDeleteAccount,
    handleCheckboxConfirmation,
    enableDeleteButton,
    handleCancel,
    navigateToHome,
    handleDeleteAccountBottomSheet,
  };
};
