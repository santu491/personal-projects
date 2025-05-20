import { API_ENDPOINTS_JSON } from '../../../../src/config';
import { RequestMethod } from '../../../../src/models/adapters';
import { useUserContext } from '../context/auth.sdkContext';
import { UserProfileResponseDTO } from '../models/profile';

export const useProfileDetails = () => {
  const userContext = useUserContext();

  const getProfileDetails = async () => {
    try {
      const response: UserProfileResponseDTO = await userContext.serviceProvider.callService(
        API_ENDPOINTS_JSON.PROFILE_DETAILS.endpoint,
        RequestMethod.GET,
        null
      );
      userContext.setUserProfileData(response.data.data);
    } catch (error) {
      console.info(error);
    }
  };

  return {
    getProfileDetails,
  };
};
