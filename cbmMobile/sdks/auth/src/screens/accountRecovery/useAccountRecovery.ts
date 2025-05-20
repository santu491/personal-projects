import { useUserContext } from '../../context/auth.sdkContext';
import { Screen } from '../../navigation/auth.navigationTypes';

export const useAccountRecovery = () => {
  const { navigation } = useUserContext();

  const navigateToResetSecretScreen = () => {
    navigation.navigate(Screen.RESET_SECRET);
  };

  return {
    navigateToResetSecretScreen,
  };
};
