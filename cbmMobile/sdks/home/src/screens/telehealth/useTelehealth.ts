import { useRoute } from '@react-navigation/native';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';

import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS } from '../../../../../src/config';
import { useGetMdLiveData } from '../../../../../src/hooks/useGetMdLiveData';
import { RequestMethod } from '../../../../../src/models/adapters';
import { AssessmentResponseDTO } from '../../../../providers/src/model/assessmentStatusResponse';
import { RE_DIRECT_URL_API_TYPE, RedirectURLType } from '../../config/constants/home';
import { useHomeContext } from '../../context/home.sdkContext';
import { useTeleHealthHook } from '../../hooks/useTeleHealthHook';
import { CardInfo } from '../../model/home';
import { TelehealthScreenProps } from '../../navigation/home.navigationTypes';

export const useTeleHealth = () => {
  const { teleHealthInPersonData } = useTeleHealthHook();
  const { getMdLiveData, setShowError, showError } = useGetMdLiveData();

  const [loading, setLoading] = useState(false);
  const context = useHomeContext();
  const { loggedIn, navigationHandler } = context;
  const [teleHealthData, setTeleHealthData] = useState<CardInfo[]>([]);
  const [data, setData] = useState(teleHealthData);
  const [modelVisible, setModelVisible] = useState(false);
  const [radioAltCurrentIndex, setRadioAltCurrentIndex] = useState(0);
  const teleHealthContent = useRoute<TelehealthScreenProps['route']>().params.teleHealthData;

  const radioItems = [
    {
      label: t('home.teleHealth.teleHealth'),
    },
    {
      label: t('home.teleHealth.teleHealthInPerson'),
    },
  ];

  const getClinicalQuestionnaireData = useCallback(async () => {
    navigationHandler.linkTo({ action: AppUrl.CLINICAL_QUESTIONNAIRE, params: { appointmentFlowStatus: true } });
  }, [navigationHandler]);

  const handleChange = (_value: boolean, index: number) => {
    setRadioAltCurrentIndex(index);
    setData(index === 0 ? teleHealthData : teleHealthInPersonData);
  };

  const getTeleHealthDetails = async () => {
    try {
      setTeleHealthData(teleHealthContent);
      if (radioAltCurrentIndex === 0) {
        setData(teleHealthContent);
      }
    } catch (error) {
      console.info(error);
    }
  };

  useEffect(() => {
    getTeleHealthDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const onPressCardButton = (item: CardInfo) => {
    const [redirectionType, redirectionPath] = item.redirectUrl?.split(':') || [];

    const handleApiRedirection = () => {
      if (redirectionPath === RE_DIRECT_URL_API_TYPE.TELEHEALTH_EMOTIONAL_SUPPORT) {
        assessmentAlertConfirm();
      }
    };

    const handleHttpsRedirection = () => {
      if (item.redirectUrl) {
        Linking.openURL(item.redirectUrl);
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
    onPressCardButton,
    radioItems,
    radioAltCurrentIndex,
    data,
    loading,
    handleChange,
    modelVisible,
    handleTryAgain,
    showError,
  };
};
