import { t } from 'i18next';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { CloseIcon, EyeIcon, SearchIcon } from '../../../../../shared/src/assets/icons/icons';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { AutoCompleteDropDown } from '../../../../../shared/src/components/autoCompleteDropdown/autoCompleteDropdown';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H1, H3, H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { AuthFooterButtons } from '../../../../auth/src/components/authProfile/authFooterButtons';
import { WellnesssTopicsList } from '../../../../notifications/src/model/wellnessTopics';
import { useWellnessTopics } from './useWellnessTopics';
import { wellnessTopicStyles } from './wellnessTopics.styles';

export const WellnessTopics = () => {
  const {
    navigateToViewTopics,
    handleContinueButton,
    handleCancelButton,
    modelVisible,
    removeTopicSelection,
    selectedTopicsList,
    onChangeTopic,
    onPressDropDownItem,
    loading,
    searchedTopic,
    successAlertData,
    dropDownTopics,
  } = useWellnessTopics();

  const renderSelectedTopicContent = ({ item }: { item?: WellnesssTopicsList }) => {
    return (
      <TouchableOpacity
        testID={`wellnessTopics.selection.${item?.title}`}
        style={wellnessTopicStyles.subView}
        onPress={() => removeTopicSelection(item?.title)}
      >
        <View style={wellnessTopicStyles.patientsView}>
          <Text style={wellnessTopicStyles.cardTitle}>{item?.title}</Text>
          <CloseIcon color={appColors.black} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <MainHeaderComponent />
      <View style={wellnessTopicStyles.container}>
        <View style={wellnessTopicStyles.subContainer}>
          <H1 testID={'profile-wellnessTopics'}>{t('profile.wellnessTopics')}</H1>
          <H3 testID={'profile-wellnessTopics-description'} style={wellnessTopicStyles.descText}>
            {t('profile.wellnessTopicsPage.description')}
          </H3>
          <View style={wellnessTopicStyles.autoComplete}>
            <AutoCompleteDropDown
              label=""
              value={searchedTopic}
              inputTestId="profile.wellnessTopics"
              placeholder={t('profile.wellnessTopicsPage.searchTopics')}
              leftIcon={<SearchIcon />}
              loading={loading}
              onChangeText={onChangeTopic}
              data={dropDownTopics}
              onPressDropDownItem={(item) => onPressDropDownItem(item)}
              inputViewStyles={{
                borderColor: searchedTopic.length > 0 ? appColors.lightPurple : appColors.lightGray,
              }}
            />
          </View>
          {selectedTopicsList.length > 0 ? (
            <FlatList
              keyExtractor={(item) => item.title}
              horizontal={true}
              testID={'menu.wellness.flatlist'}
              data={selectedTopicsList}
              renderItem={renderSelectedTopicContent}
              showsHorizontalScrollIndicator={false}
            />
          ) : null}

          <TouchableOpacity style={wellnessTopicStyles.viewAllTopics} onPress={navigateToViewTopics}>
            <EyeIcon />
            <H4 style={wellnessTopicStyles.topics}>{t('profile.wellnessTopicsPage.viewAllTopics')}</H4>
          </TouchableOpacity>
        </View>
        {modelVisible && successAlertData ? (
          <AlertModel
            modalVisible={modelVisible}
            onHandlePrimaryButton={successAlertData.onHandlePrimaryButton}
            onHandleSecondaryButton={successAlertData.onHandleSecondaryButton}
            title={successAlertData.title}
            subTitle={successAlertData.subTitle}
            primaryButtonTitle={successAlertData.primaryButtonTitle}
            secondaryButtonTitle={successAlertData.secondaryButtonTitle}
            showIndicatorIcon={true}
            isError={successAlertData.isError}
            isSuccess={successAlertData.isSuccess}
            errorIndicatorIconColor={successAlertData.errorIndicatorIconColor}
          />
        ) : null}
        <AuthFooterButtons
          primaryButtonTitle={t('authentication.cancel')}
          secondaryButtonTitle={t('authentication.continue')}
          onPressContinueButton={handleContinueButton}
          onPressPreviousButton={handleCancelButton}
          footerViewStyle={wellnessTopicStyles.footerButtons}
          showPreviousButton={true}
          disabled={selectedTopicsList.length === 0}
        />
      </View>
    </>
  );
};
