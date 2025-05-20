import { useRoute } from '@react-navigation/native';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AlertModelProps } from '../../../../../shared/src/components/alertModel/alertModel';
import { API_ENDPOINTS, appColors } from '../../../../../src/config';
import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { RequestMethod } from '../../../../../src/models/adapters';
import { openDeviceSettings } from '../../../../notifications/src/config/util/commonUtils';
import {
  GetMemberPreferenceResponseDTO,
  GetMemberPreferenceSuccessDTO,
  WellnesssTopicsList,
} from '../../../../notifications/src/model/wellnessTopics';
import { ErrorType } from '../../config/constants/constants';
import { useMenuContext } from '../../context/menu.sdkContext';
import { Screen } from '../../navigation/menu.navigationTypes';

export const useViewTopics = () => {
  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [topicsList, setTopicsList] = useState<WellnesssTopicsList[]>([]);
  const [showTopicsPage, setShowTopicsPage] = useState(true);
  const [successAlertData, setSuccessAlertData] = useState<AlertModelProps | undefined>();
  const route = useRoute();
  const { navigationHandler, navigation } = useMenuContext();
  const menuContext = useMenuContext();

  const saveTopic = useMemo(() => topicsList.some((item) => item.isSelected), [topicsList]);

  const { getRNPermissions }: { getRNPermissions: () => Promise<boolean> } = usePushNotification({});

  const wellnessSelectedTopics = useMemo(() => {
    return ((route.params as { selectedTopicsList?: WellnesssTopicsList }).selectedTopicsList ||
      []) as WellnesssTopicsList[];
  }, [route.params]);

  const wellnessTopicsList = useMemo(() => {
    return ((route.params as { topicsList?: WellnesssTopicsList }).topicsList || []) as WellnesssTopicsList[];
  }, [route.params]);

  const onCloseModal = () => {
    setShowTopicsPage(false);
    navigation.goBack();
  };

  const transformTopicsResponse = useCallback(
    (wellnessTopics: WellnesssTopicsList[] = [], selectedTopics?: string[]) => {
      const selectedTopicsData = wellnessTopics.map((topic: { title: string }, index: number) => {
        const selectedValue = selectedTopics?.find((selectedTopic) => selectedTopic === topic.title);
        return {
          id: `${index}${topic.title}`,
          title: topic.title,
          isSelected: !!selectedValue,
        };
      });
      setTopicsList(selectedTopicsData);
    },
    []
  );

  const onChangeCheckBox = useCallback(
    (title: string) => {
      const topics = topicsList.map((topic) => {
        if (topic.title === title) {
          return {
            ...topic,
            isSelected: !topic.isSelected,
          };
        }
        return topic;
      });
      setTopicsList(topics);
    },
    [topicsList]
  );

  const handleNoThanks = useCallback(() => {
    navigation.navigate(Screen.PROFILE);
  }, [navigation]);

  const handleAllow = useCallback(() => {
    setModelVisible(false);
    setSuccessAlertData(undefined);
    openDeviceSettings();
  }, []);

  const successAlertText = useCallback(
    async (type: string, getCallbackMethod?: () => void) => {
      let handleSuccessAlert: () => void;
      const pushNotificationsEnabled: boolean = await getRNPermissions();
      switch (type) {
        case ErrorType.SAVE_TOPICS:
          handleSuccessAlert = () => {
            if (pushNotificationsEnabled) {
              handleNoThanks();
            } else {
              successAlertText(ErrorType.OPT_NOTIFICATIONS);
              setModelVisible(true);
            }
          };
          setSuccessAlertData({
            modalVisible: modelVisible,
            title: t('notifications.preferences.SuccessTopicsAlertTitle'),
            subTitle: t('notifications.preferences.SuccessTopicsAlertMessage'),
            primaryButtonTitle: t('providers.continue'),
            onHandlePrimaryButton: handleSuccessAlert,
            isSuccess: false,
          });
          break;
        case ErrorType.OPT_NOTIFICATIONS:
          setSuccessAlertData({
            modalVisible: modelVisible,
            title: t('profile.wellnessTopicsPage.pushNotification'),
            subTitle: t('profile.wellnessTopicsPage.pushNotificationMessage'),
            primaryButtonTitle: t('profile.wellnessTopicsPage.allow'),
            secondaryButtonTitle: t('profile.wellnessTopicsPage.noThanks'),
            onHandlePrimaryButton: handleAllow,
            onHandleSecondaryButton: handleNoThanks,
            isSuccess: true,
            errorIndicatorIconColor: appColors.lightDarkGray,
          });
          break;
        case ErrorType.ERROR:
          setSuccessAlertData({
            modalVisible: modelVisible,
            title: t('appointments.errors.title'),
            subTitle: t('appointments.errors.genericDescription'),
            primaryButtonTitle: t('appointments.errors.tryAgainButton'),
            onHandlePrimaryButton: () => {
              getCallbackMethod?.();
              setModelVisible(false);
            },
            isError: true,
          });
          break;
        default:
          break;
      }
    },
    [getRNPermissions, handleAllow, handleNoThanks, modelVisible]
  );

  const saveTopicsPreferenceApi = useCallback(async () => {
    setLoading(true);
    const topics = topicsList.filter((topic) => topic.isSelected).map((topic) => topic.title);
    const pushNotificationsEnabled: boolean = await getRNPermissions();
    const request = {
      pushNotifications: {
        enabled: pushNotificationsEnabled,
        topics,
      },
    };
    try {
      const saveMemberPreference = `${API_ENDPOINTS.SAVE_MEMBER_PREFERENCES}`;
      await menuContext.serviceProvider.callService(saveMemberPreference, RequestMethod.PUT, request);
      setModelVisible(true);
      successAlertText(ErrorType.SAVE_TOPICS);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setModelVisible(true);
      successAlertText(ErrorType.ERROR, saveTopicsPreferenceApi);
    }
  }, [topicsList, getRNPermissions, menuContext.serviceProvider, successAlertText]);

  const handleContinueButton = () => {
    saveTopicsPreferenceApi();
  };

  const getSelectedTopics = useCallback(
    async (wellnessTopics: WellnesssTopicsList[]) => {
      setLoading(true);
      try {
        const getMemberPreferenceUrl = `${API_ENDPOINTS.GET_MEMBER_PREFERENCES}`;
        const response: GetMemberPreferenceResponseDTO = await menuContext.serviceProvider.callService(
          getMemberPreferenceUrl,
          RequestMethod.GET,
          null
        );
        const memberPreferenceResponse = response.data as GetMemberPreferenceSuccessDTO;
        const selectedTopics = memberPreferenceResponse.pushNotifications.topics ?? [];
        selectedTopics.push(...wellnessSelectedTopics.map((topic: WellnesssTopicsList) => topic.title));
        transformTopicsResponse(wellnessTopics, selectedTopics);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setModelVisible(true);
        successAlertText(ErrorType.ERROR, () => getSelectedTopics(wellnessTopicsList));
      }
    },
    [menuContext.serviceProvider, wellnessSelectedTopics, transformTopicsResponse, successAlertText, wellnessTopicsList]
  );

  const getWellnessTopics = useCallback(async () => {
    transformTopicsResponse(wellnessTopicsList);
    await getSelectedTopics(wellnessTopicsList);
  }, [getSelectedTopics, transformTopicsResponse, wellnessTopicsList]);

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
    getWellnessTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigationHandler, navigation]);

  const handleCancelButton = () => {
    navigation.goBack();
  };

  return {
    handleContinueButton,
    handleCancelButton,
    loading,
    setLoading,
    modelVisible,
    setModelVisible,
    topicsList,
    onChangeCheckBox,
    saveTopic,
    showTopicsPage,
    onCloseModal,
    successAlertData,
  };
};
