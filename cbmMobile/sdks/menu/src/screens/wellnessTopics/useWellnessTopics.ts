import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import { AlertModelProps } from '../../../../../shared/src/components/alertModel/alertModel';
import { API_ENDPOINTS, APP_CONTENT, appColors } from '../../../../../src/config';
import { usePushNotification } from '../../../../../src/hooks/usePushNotification';
import { RequestMethod } from '../../../../../src/models/adapters';
import { openDeviceSettings } from '../../../../notifications/src/config/util/commonUtils';
import {
  GetMemberPreferenceResponseDTO,
  GetMemberPreferenceSuccessDTO,
  WellnesssTopicsList,
  WellnesssTopicsListDTO,
  WellnessTopicsListSuccessDTO,
  WellnessTopicsResponseDTO,
} from '../../../../notifications/src/model/wellnessTopics';
import { ErrorType } from '../../config/constants/constants';
import { useMenuContext } from '../../context/menu.sdkContext';
import { Screen } from '../../navigation/menu.navigationTypes';

export const useWellnessTopics = () => {
  const menuContext = useMenuContext();
  const { navigation, navigationHandler } = menuContext;
  const [loading, setLoading] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [topicsList, setTopicsList] = useState<WellnesssTopicsList[]>([]);
  const [selectedTopicsList, setSelectedTopicsList] = useState<WellnesssTopicsList[]>([]);
  const [searchedTopic, setSearchTopic] = useState('');
  const [filteredTopics, setFilteredTopics] = useState<WellnesssTopicsList[]>([]);
  const topicsResponseRef = useRef<WellnessTopicsListSuccessDTO | undefined>();
  const [successAlertData, setSuccessAlertData] = useState<AlertModelProps | undefined>();

  const { getRNPermissions }: { getRNPermissions: () => Promise<boolean> } = usePushNotification({});

  const autoAddressSearchResults = useCallback(
    async (addressText: string) => {
      try {
        if (addressText) {
          const topics: WellnesssTopicsList[] = [];
          topicsList.forEach((topic) => {
            if (
              topic.title.toLowerCase().startsWith(addressText.toLowerCase()) &&
              !topics.some((filteredTopic) => filteredTopic.title === topic.title)
            ) {
              topics.push(topic);
            }
          });
          setFilteredTopics(topics);
        } else {
          setFilteredTopics([]); // should reset filtered topics when addressText is empty
        }
      } catch (error) {
        console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
      }
    },
    [topicsList]
  );

  const onChangeTopic = (value: string) => {
    setSearchTopic(value);
    if (value.length === 0) {
      setFilteredTopics([]);
      return;
    }
    autoAddressSearchResults(value);
  };

  const dropDownTopics = useMemo(() => {
    return filteredTopics.map(({ title, id }) => ({ title, id }));
  }, [filteredTopics]);

  const onPressDropDownItem = async (item?: TAutocompleteDropdownItem) => {
    if (item && item.title !== null) {
      const newItem: WellnesssTopicsList = {
        id: item.id,
        title: item.title,
        isSelected: true, // or set it based on your logic
      };
      setSelectedTopicsList([...selectedTopicsList, newItem]);
      setSearchTopic(item.title);
      setSearchTopic('');
    }
    Keyboard.dismiss();
  };

  const transformTopicsResponse = (wellnessTopics: WellnesssTopicsListDTO[], selectedTopics?: string[]) => {
    const selectedTopicsData = wellnessTopics.map((topic: { title: string }, index: number) => {
      const selectedValue = selectedTopics?.find((selectedTopic) => selectedTopic === topic.title);
      return {
        id: `${index}${topic.title}`,
        title: topic.title,
        isSelected: !!selectedValue,
      };
    });
    setTopicsList(selectedTopicsData);
  };

  const navigateToViewTopics = () => {
    if (topicsResponseRef.current?.results) {
      navigation.navigate(Screen.VIEW_TOPICS, { selectedTopicsList, topicsList: topicsResponseRef.current.results });
    }
  };

  const handleNoThanks = useCallback(() => {
    navigation.navigate(Screen.PROFILE);
  }, [navigation]);

  const handleAllow = useCallback(() => {
    setModelVisible(false);
    setSuccessAlertData(undefined);
    openDeviceSettings();
  }, []);

  const removeTopicSelection = useCallback(
    (topicTitle?: string) => {
      if (selectedTopicsList.length > 0) {
        const newSelectedTopicsList = selectedTopicsList.filter((topic) => topic.title !== topicTitle);
        setSelectedTopicsList(newSelectedTopicsList);
      }
      setSearchTopic('');
    },
    [selectedTopicsList]
  );

  const handleContinueButton = () => {
    saveTopicsPreferenceApi();
  };
  const handleCancelButton = () => {
    navigation.goBack();
  };

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

  const getWellnessTopics = useCallback(async () => {
    setLoading(true);
    try {
      const topicsListUrl = `${API_ENDPOINTS.WELLNESS_TOPICS_LIST}`;
      const response: WellnessTopicsResponseDTO = await menuContext.serviceProvider.callService(
        topicsListUrl,
        RequestMethod.GET,
        null
      );
      topicsResponseRef.current = response.data as WellnessTopicsListSuccessDTO;
      transformTopicsResponse(topicsResponseRef.current.results);
      setLoading(false);
    } catch (error) {
      setTopicsList([]);
      setLoading(false);
      setModelVisible(true);
      successAlertText(ErrorType.ERROR, getWellnessTopics);
    }
  }, [menuContext.serviceProvider, successAlertText]);

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
    getWellnessTopics();
    setSelectedTopicsList([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveTopicsPreferenceApi = useCallback(async () => {
    setLoading(true);
    let topics: string[] = [];
    try {
      const getMemberPreferenceUrl = `${API_ENDPOINTS.GET_MEMBER_PREFERENCES}`;
      const response: GetMemberPreferenceResponseDTO = await menuContext.serviceProvider.callService(
        getMemberPreferenceUrl,
        RequestMethod.GET,
        null
      );
      const memberPreferenceResponse = response.data as GetMemberPreferenceSuccessDTO;
      const selectedTopics = memberPreferenceResponse.pushNotifications.topics ?? [];
      topics = selectedTopicsList.filter((topic) => topic.title).map((topic) => topic.title);
      topics.push(...selectedTopics);
      const pushNotificationsEnabled: boolean = await getRNPermissions();
      const request = {
        pushNotifications: {
          enabled: pushNotificationsEnabled,
          topics,
        },
      };
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
  }, [getRNPermissions, menuContext.serviceProvider, selectedTopicsList, successAlertText]);

  return {
    loading,
    navigateToViewTopics,
    handleContinueButton,
    handleCancelButton,
    modelVisible,
    removeTopicSelection,
    selectedTopicsList,
    onChangeTopic,
    onPressDropDownItem,
    searchedTopic,
    successAlertData,
    filteredTopics,
    dropDownTopics,
  };
};
