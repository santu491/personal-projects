import React, { useState } from 'react';

import { AppUrl } from '../../../../../../shared/src/models';
import { useUserContext } from '../../../context/auth.sdkContext';

export const useLogin = () => {
  const [value, setValue] = useState('');
  const [isCreateAccountDrawerEnabled, setIsCreateAccountDrawerEnabled] = React.useState(false);
  const { navigationHandler } = useUserContext();

  const handleLogin = () => {
    // Handle login logic here
  };

  const handleCreateAccount = () => {
    setIsCreateAccountDrawerEnabled(true);
  };

  const onChangeText = (text: string) => {
    setValue(text);
  };

  const onCloseCreateAccountDrawer = () => {
    setIsCreateAccountDrawerEnabled(false);
  };

  const navigateToCreateAccount = () => {
    // Need to Implement the create account screen
    setIsCreateAccountDrawerEnabled(false);
    navigationHandler.linkTo({ action: AppUrl.CREATE_ACCOUNT_MHSUD });
  };

  return {
    handleLogin,

    handleCreateAccount,
    onChangeText,
    onCloseCreateAccountDrawer,
    navigateToCreateAccount,
    value,
    isCreateAccountDrawerEnabled,
  };
};
