import { yupResolver } from '@hookform/resolvers/yup';
import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppState } from 'react-native';

import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS } from '../../../../../src/config/apiEndpoints';
import { useGetMdLiveData } from '../../../../../src/hooks/useGetMdLiveData';
import { RequestMethod } from '../../../../../src/models/adapters';
import { ClinicalQuestionnaireFields, EMPLOYER_TYPE } from '../../config/constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';
import { ClinicalQuestionnaireResponseDTO, ProblemInfo } from '../../model/clinicalQuestionnaireResponse';
import { ClinicalQuestionnaireScreenProps, Screen } from '../../navigation/providers.navigationTypes';
import { getClinicalQuestionnaireValidationSchema } from '../../utils/clinicalQuestionnaireValidationSchema';

export const useClinicalQuestionnaire = () => {
  const appState = useRef(AppState.currentState);
  const [problemInfo, setProblemInfo] = useState<ProblemInfo[]>();
  const [isLoading, setIsLoading] = useState(false);
  const { serviceProvider } = useProviderContext();
  const { clinicalQuestionnaireValidationSchema } = getClinicalQuestionnaireValidationSchema();
  const { scheduleAppointmentInfo, setScheduleAppointmentInfo, navigation, navigationHandler } = useProviderContext();
  const { appointmentFlowStatus } = useRoute<ClinicalQuestionnaireScreenProps['route']>().params;
  const { getMdLiveData, setShowError, showError } = useGetMdLiveData();

  const daysOption = useMemo(
    () =>
      Array.from({ length: 31 }, (_, i) => ({
        label: `${i}`,
        value: `${i}`,
      })),
    []
  );

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const questionInfo = scheduleAppointmentInfo?.clinicalQuestions?.questionnaire[0];
  const { control, formState, getValues, watch, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      [ClinicalQuestionnaireFields.PROBLEM]: questionInfo?.presentingProblem ?? '',
      [ClinicalQuestionnaireFields.PROBLEM_DESCRIPTION]: questionInfo?.answer ?? '',
      [ClinicalQuestionnaireFields.LESS_PRODUCTIVE_DAYS]: questionInfo?.lessProductivedays ?? '',
      [ClinicalQuestionnaireFields.JOB_MISSED_DAYS]: questionInfo?.jobMissedDays ?? '',
    },
    resolver: yupResolver(clinicalQuestionnaireValidationSchema),
  });

  const onPressCloseIcon = () => {
    navigationHandler.linkTo({ action: AppUrl.HOME });
  };

  const onChangeValue = () => {
    const watchValues = watch();
    if (!watchValues[ClinicalQuestionnaireFields.PROBLEM]) {
      setValue(ClinicalQuestionnaireFields.LESS_PRODUCTIVE_DAYS, '');
      setValue(ClinicalQuestionnaireFields.JOB_MISSED_DAYS, '');
    }
    if (!watchValues[ClinicalQuestionnaireFields.LESS_PRODUCTIVE_DAYS]) {
      setValue(ClinicalQuestionnaireFields.JOB_MISSED_DAYS, '');
    }
  };

  useEffect(() => {
    const getClinicalQuestionnaireData = async () => {
      try {
        const endpoint = `${API_ENDPOINTS.CLINICAL_QUESTIONNAIRE}?employerType=${EMPLOYER_TYPE}`;
        setIsLoading(true);
        const response: ClinicalQuestionnaireResponseDTO = await serviceProvider.callService(
          endpoint,
          RequestMethod.GET,
          null,
          {}
        );
        if (response.data.length > 0) {
          const problem: ProblemInfo[] = response.data.map((item) => {
            return { label: item.presentingProblems, value: item.presentingProblems, id: item.id };
          });
          setProblemInfo(problem);
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setIsLoading(false);
      }
    };

    getClinicalQuestionnaireData();
  }, [serviceProvider]);

  const onPressContinue = () => {
    const formValue = getValues();
    const questionnaire = [
      {
        presentingProblem: formValue[ClinicalQuestionnaireFields.PROBLEM],
        answer: formValue[ClinicalQuestionnaireFields.PROBLEM_DESCRIPTION],
        lessProductivedays: formValue[ClinicalQuestionnaireFields.LESS_PRODUCTIVE_DAYS],
        jobMissedDays: formValue[ClinicalQuestionnaireFields.JOB_MISSED_DAYS],
      },
    ];

    if (appointmentFlowStatus) {
      getMdLiveData(questionnaire);
      return;
    }

    const appointmentInfo = {
      ...scheduleAppointmentInfo,
      clinicalQuestions: {
        questionnaire,
      },
    };

    setScheduleAppointmentInfo(appointmentInfo);
    navigation.navigate(Screen.COUNSELOR_SETTINGS);
  };

  const handleAppForegroundClinicalQuestionnaireFieldsUpdate = useCallback(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        navigation.canGoBack() &&
        appointmentFlowStatus
      ) {
        navigation.goBack();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [appointmentFlowStatus, navigation]);

  useEffect(() => {
    const unsubscribe = handleAppForegroundClinicalQuestionnaireFieldsUpdate();
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTryAgain: () => void = useCallback(() => {
    setShowError(false);
  }, [setShowError]);

  return {
    isLoading,
    control,
    formState,
    problemInfo,
    daysOption,
    onPressContinue,
    getValues,
    watch,
    onChangeValue,
    onPressCloseIcon,
    appointmentFlowStatus,
    showError,
    handleTryAgain,
  };
};
