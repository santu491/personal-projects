import { CheckBox } from '@sydney/motif-components';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { CloseIcon, DownArrowIcon } from '../../../../../shared/src/assets/icons/icons';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { AuthFooterButtons } from '../../../../auth/src/components/authProfile/authFooterButtons';
import { WellnesssTopicsList } from '../../../../notifications/src/model/wellnessTopics';
import { useViewTopics } from './useViewTopics';
import { topicStyles } from './viewTopics.styles';

export const ViewTopics = () => {
  const {
    handleContinueButton,
    handleCancelButton,
    loading,
    topicsList,
    onChangeCheckBox,
    modelVisible,
    showTopicsPage,
    onCloseModal,
    saveTopic,
    successAlertData,
  } = useViewTopics();

  const styles = useMemo(() => topicStyles(), []);

  const renderItem = ({ item }: { item: WellnesssTopicsList }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onChangeCheckBox(item.title)}
      testID={`wellness.viewTopics.${item.title}`}
    >
      <View style={styles.rowContainer}>
        <CheckBox
          checked={item.isSelected}
          onPress={() => onChangeCheckBox(item.title)}
          styles={styles.roundCheckbox}
        />
        <H3 style={styles.title}>{item.title}</H3>
      </View>
    </TouchableOpacity>
  );

  return showTopicsPage ? (
    <View style={styles.modal}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
          <ProgressLoader isVisible={loading} />
          <View style={styles.headerView}>
            <View style={styles.headerTitleView}>
              <H1 style={styles.headerTitle}>{t('profile.wellnessTopics')}</H1>
            </View>
            <TouchableOpacity
              onPress={onCloseModal}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              testID={'close-button'}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.screenContainer}>
            <FlatList data={topicsList} renderItem={(item) => renderItem(item)} keyExtractor={(item) => item.title} />
            <View style={styles.downArrowView}>
              <DownArrowIcon color={appColors.lightPurple} />
            </View>
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
            footerViewStyle={styles.footerButtons}
            showPreviousButton={true}
            disabled={!saveTopic}
          />
        </SafeAreaView>
      </View>
    </View>
  ) : null;
};
