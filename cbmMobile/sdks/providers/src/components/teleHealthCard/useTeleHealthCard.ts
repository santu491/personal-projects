import { useCallback, useState } from 'react';
import { Linking } from 'react-native';

import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RedirectURLType } from '../../../../../src/constants/constants';
import { useGetMdLiveData } from '../../../../../src/hooks/useGetMdLiveData';
import { RequestMethod } from '../../../../../src/models/adapters';
import { RE_DIRECT_URL_API_TYPE } from '../../config/constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';
import { AssessmentResponseDTO } from '../../model/assessmentStatusResponse';
import { SearchProvider } from '../../model/providerSearchResponse';

export const useTeleHelathCard = (providerInfo: SearchProvider) => {
  const context = useProviderContext();
  const { client, navigationHandler, loggedIn } = context;
  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const { getMdLiveData, setShowError, showError } = useGetMdLiveData();

  const getClinicalQuestionnaireData = useCallback(async () => {
    navigationHandler.linkTo({ action: AppUrl.CLINICAL_QUESTIONNAIRE, params: { appointmentFlowStatus: true } });
  }, [navigationHandler]);

  const assessmentAlertConfirm = useCallback(async () => {
    if (loggedIn) {
      setLoading(true);
      try {
        const questionnaire = [
          {
            presentingProblem: null,

            answer: null,

            jobMissedDays: null,

            lessProductivedays: null,
          },
        ];
        const endpoint = `${API_ENDPOINTS.ASSESSMENT_STATUS}`;
        const response: AssessmentResponseDTO = await context.serviceProvider.callService(
          endpoint,
          RequestMethod.GET,
          null,
          {
            isSecureToken: true,
          }
        );
        setLoading(false);
        if (response.data) {
          getClinicalQuestionnaireData();
        } else {
          getMdLiveData(questionnaire);
        }
      } catch (error) {
        setModelVisible(true);
        setLoading(false);
      }
    } else {
      navigationHandler.linkTo({ action: AppUrl.LOGIN });
    }
  }, [context.serviceProvider, getClinicalQuestionnaireData, getMdLiveData, loggedIn, navigationHandler]);

  const handleTryAgain: () => void = useCallback(() => {
    showError ? setShowError(false) : setModelVisible(false);
  }, [setShowError, showError]);

  const onHandleVisitWebSite = () => {
    const [redirectionType, redirectionPath] = providerInfo.visitButton?.href.split(':') || [];

    const handleApiRedirection = () => {
      if (redirectionPath === RE_DIRECT_URL_API_TYPE.TELEHEALTH_EMOTIONAL_SUPPORT) {
        assessmentAlertConfirm();
      }
    };

    const handleHttpsRedirection = () => {
      if (providerInfo.visitButton?.href) {
        Linking.openURL(providerInfo.visitButton.href);
      }
    };

    const handlePageRedirection = () => {
      if (redirectionPath === RE_DIRECT_URL_API_TYPE.PROVIDERS_FIND_COUNSELOR) {
        navigationHandler.linkTo({ action: AppUrl.FIND_COUNSELOR });
      }
    };

    switch (redirectionType) {
      case RedirectURLType.API:
        handleApiRedirection();
        break;
      case RedirectURLType.HTTPS:
        handleHttpsRedirection();
        break;
      case RedirectURLType.PAGE:
        handlePageRedirection();
        break;
    }
  };
  return {
    onHandleVisitWebSite,
    client,
    loading,
    modelVisible,
    showError,
    handleTryAgain,
  };
};
