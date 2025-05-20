import { useWellbeingContext } from '../context/wellbeing.sdkContext';
import { useWellbeingInfo } from '../hooks/useWellbeingInfo';
import { Screen } from '../navigation/wellbeing.navigationTypes';

export const useWellbeing = () => {
  const { welllbeingData } = useWellbeingInfo();
  const { navigation } = useWellbeingContext();

  const navigateToWellbeingPages = (url?: string) => {
    if (url) {
      navigation.navigate(Screen.CREDIBLEMIND, { url });
    }
  };

  return {
    welllbeingData,
    navigateToWellbeingPages,
  };
};
