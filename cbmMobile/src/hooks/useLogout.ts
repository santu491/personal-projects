import { Alert } from 'react-native';

import { Service } from '../adapters/api/service';
import { APP_CONTENT } from '../config';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { useAppContext } from '../context/appContext';
import { RequestMethod } from '../models/adapters';

export const useLogout = () => {
  const { serviceProvider, setLoggedIn, setServiceProvider, setIsAutoLogOut } = useAppContext();

  const handleLogout = async (onLogOut?: () => void) => {
    try {
      await serviceProvider.callService(API_ENDPOINTS.LOGOUT, RequestMethod.PUT, null, {});
      setLoggedIn(false);
      setServiceProvider(new Service().serviceProvider);
      setIsAutoLogOut(true);
      if (onLogOut) {
        onLogOut();
      }
    } catch (error) {
      Alert.alert(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  };

  return {
    handleLogout,
  };
};
