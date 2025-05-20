import { useHomeContext } from '../../sdks/home/src/context/home.sdkContext';
import { Screen } from '../../sdks/home/src/navigation/home.navigationTypes';
import { API_ENDPOINTS_JSON } from '../config/apiEndpoints';
import { RedirectURLApiType } from '../constants/constants';
import { RequestMethod } from '../models/adapters';
import { CardResourceDTO } from '../models/cardResource';

export const useWorkLifeResource = () => {
  const appContext = useHomeContext();
  const { navigation } = appContext;

  const getWorkLifeResourceLibrary = async (path: string) => {
    try {
      const response: CardResourceDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS_JSON.TELEHEALTH.endpoint,
        RequestMethod.POST,
        {
          path,
        }
      );
      const buttons = response.data.page?.cards?.banner?.buttons;

      if (buttons) {
        const learnMoreButton = Object.values(buttons).find(
          (button) => button.redirectUrl === `page:${RedirectURLApiType.WORK_LIFE_RESOURCE_LIBRARY}`
        );

        if (learnMoreButton?.page) {
          navigation.navigate(Screen.RESOURCE_LIBRARY, {
            resourceLibraryData: learnMoreButton.page,
          });
          return;
        }
      } else {
        throw new Error('An error occurred while fetching the Work Life Resource Library.');
      }
    } catch (error) {
      console.info(error);
      throw new Error('An error occurred while fetching the Work Life Resource Library.');
    }
  };

  return {
    getWorkLifeResourceLibrary,
  };
};
