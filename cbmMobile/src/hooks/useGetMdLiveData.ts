import { useState } from 'react';
import { Linking } from 'react-native';

import { AssessmentSurveyResponseDTO } from '../../sdks/home/src/model/home';
import { CreateMDLiveAppointmentRequest } from '../../shared/src/models/src/features/appointments';
import { API_ENDPOINTS } from '../config';
import { useAppContext } from '../context/appContext';
import { RequestMethod } from '../models/adapters';

export const useGetMdLiveData = () => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const appContext = useAppContext();

  const getMdLiveData = async (questionnaire: CreateMDLiveAppointmentRequest[]) => {
    const req = {
      questionnaire,
    };
    setLoading(true);
    try {
      const surveyResponse: AssessmentSurveyResponseDTO = await appContext.serviceProvider.callService(
        API_ENDPOINTS.EMOTIONAL_SUPPORT,
        RequestMethod.POST,
        req,
        { isSecureToken: true }
      );
      setLoading(false);
      if (surveyResponse.data.uri) {
        const url = `${surveyResponse.data.uri}?cw_auth_token=${surveyResponse.data.serviceToken}`;
        Linking.openURL(url);
      }
    } catch (error) {
      setShowError(true);
      setLoading(false);
    }
  };

  return {
    getMdLiveData,
    loading,
    showError,
    setShowError,
  };
};
