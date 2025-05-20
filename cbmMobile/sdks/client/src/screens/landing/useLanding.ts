import { useClientContext } from '../../context/client.sdkContext';
import { Screen } from '../../navigation/client.navigationTypes';

export const useLanding = () => {
  const { navigation } = useClientContext();

  const navigateEapBenefits = () => {
    navigation.navigate(Screen.EAP_BENEFITS);
  };

  return {
    navigateEapBenefits,
  };
};
