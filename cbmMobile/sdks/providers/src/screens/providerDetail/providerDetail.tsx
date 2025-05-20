/* eslint-disable react/forbid-component-props */
import { Drawer } from '@sydney/motif-components';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { CreateAccountDrawer } from '../../../../../shared/src/components/createAccountDrawer/createAccountDrawer';
import { LoginDrawer } from '../../../../../shared/src/components/loginDrawer/loginDrawer';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProfileTitleComponent } from '../../../../../shared/src/components/profileTitle/profileTitleComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1 } from '../../../../../shared/src/components/text/text';
import { TitleHeader } from '../../../../../shared/src/components/titleHeader/titleHeader';
import { LicenseTable } from '../../components/licenseTable/licenseTable';
import { ProfileCorrectionDropDown } from '../../components/profileCorrectionDropDown/profileCorrectionDropDown';
import { ProfileUpdate } from '../../components/profileUpdate/profileUpdate';
import { ProviderDetailContact } from '../../components/providerDetailContact/providerDetailContact';
import { ProviderDetailSection } from '../../components/providerDetailSection/providerDetailSection';
import { YellowCards } from '../../components/yellowCards/yellowCards';
import { providerDetailsStyles } from './providerDetail.styles';
import { useProviderDetail } from './useProviderDetail';

export const ProviderDetailScreen = () => {
  const { t } = useTranslation();
  const styles = useMemo(() => providerDetailsStyles(), []);

  const {
    providerDetailResponse,
    onPressRequestAppointment,
    isAlertEnabled,
    alertInfo,
    data,
    contacts,
    onPressContact,
    isLoginDrawerEnabled,
    isCreateAccountDrawerEnabled,
    navigateToMhsudLoginScreen,
    navigateToCreateAccount,
    onPressCreateAccountButton,
    onCloseLoginDrawer,
    onCloseCreateAccountDrawer,
    toolTipVisible,
    onPressToolTip,
    onToolTipClose,
    toggleDropdown,
    handleSelectOption,
    isDropdownVisible,
    closeProfileCorrectionModal,
    isProfileCorrectionModalShow,
    profileInfo,
    handleProfileSubmit,
    showSubmitSuccessAlert,
    onSubmitAlertButonPress,
    loading,
  } = useProviderDetail();

  const requestAppointmentSection = useCallback(
    () =>
      providerDetailResponse.onlineAppointmentScheduleFlag === 1 && (
        <View style={styles.requestAppointView}>
          <ActionButton
            title={t('providerDetail.requestAppointment')}
            style={styles.actionButton}
            textStyle={styles.actionButtonText}
            testID={'find.request.appointment.button'}
            onPress={onPressRequestAppointment}
          />
        </View>
      ),
    [onPressRequestAppointment, providerDetailResponse.onlineAppointmentScheduleFlag, styles, t]
  );

  return (
    <>
      {isAlertEnabled && alertInfo ? (
        <AlertModel
          modalVisible={isAlertEnabled}
          onHandlePrimaryButton={alertInfo.onHandlePrimaryButton}
          onHandleSecondaryButton={alertInfo.onHandleSecondaryButton}
          title={alertInfo.title}
          subTitle={alertInfo.subTitle}
          primaryButtonTitle={alertInfo.primaryButtonTitle}
          secondaryButtonTitle={alertInfo.secondaryButtonTitle}
          showIndicatorIcon={true}
          isError={alertInfo.isError}
          errorIndicatorIconColor={alertInfo.errorIndicatorIconColor}
        />
      ) : null}
      <ProgressLoader isVisible={loading} />
      <MainHeaderComponent leftArrow={false} />
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContainer}>
          <TouchableOpacity onPress={onToolTipClose} activeOpacity={1}>
            <TitleHeader title={t('providers.findAProvider')} onPressRightIcon={toggleDropdown} />
            <View style={styles.cardContainer}>
              <ProfileTitleComponent viewStyle={styles.profileStyle} profileTitleData={providerDetailResponse} />
              <YellowCards
                cardItems={providerDetailResponse.yellowLabels}
                mainViewStyle={styles.subView}
                subViewStyle={styles.patientsView}
                textStyle={styles.cardTitle}
                testID="provider.yellowcards"
              />
              {requestAppointmentSection()}
              <View style={styles.sectionView}>
                <H1 style={styles.sectionTitle}>{contacts.sectionTitle}</H1>
                {contacts.data.map((item, _index) => (
                  <ProviderDetailContact
                    data={item}
                    key={item.title}
                    onPress={onPressContact}
                    onPressToolTip={onPressToolTip}
                    index={_index}
                    toolTipVisible={toolTipVisible}
                  />
                ))}
              </View>
              {data.map((section) => {
                return (
                  <>
                    {section.sectionTitle ? (
                      <View key={section.sectionTitle} style={styles.sectionView}>
                        <H1 style={styles.sectionTitle}>{section.sectionTitle}</H1>

                        {section.data?.map((item, _index) => {
                          return (
                            <ProviderDetailSection
                              data={item}
                              key={item.title}
                              onPressToolTip={onPressToolTip}
                              toolTipVisible={toolTipVisible}
                              index={_index}
                            />
                          );
                        })}
                      </View>
                    ) : null}
                  </>
                );
              })}
              <LicenseTable data={providerDetailResponse.licenses} />
            </View>
          </TouchableOpacity>
        </ScrollView>
        {isLoginDrawerEnabled ? (
          <LoginDrawer
            onPressPrimaryButton={navigateToMhsudLoginScreen}
            isDrawerEnabled={isLoginDrawerEnabled}
            onCloseDrawer={onCloseLoginDrawer}
            onPressSecondaryButton={onPressCreateAccountButton}
          />
        ) : null}

        {!isLoginDrawerEnabled && isCreateAccountDrawerEnabled ? (
          <CreateAccountDrawer
            isDrawerEnabled={isCreateAccountDrawerEnabled}
            onCloseDrawer={onCloseCreateAccountDrawer}
            onPressPrimaryButton={navigateToCreateAccount}
          />
        ) : null}
        {isDropdownVisible ? (
          <ProfileCorrectionDropDown
            options={[t('providerDetail.profileCorrectionTitle')]}
            onSelect={handleSelectOption}
            onClose={toggleDropdown}
          />
        ) : null}
        {isProfileCorrectionModalShow ? (
          <Drawer
            styles={styles.drawer}
            hideDrawerHeader
            visible={true}
            onRequestClose={closeProfileCorrectionModal}
            children={
              <ProfileUpdate
                profileInfo={profileInfo}
                closeModal={closeProfileCorrectionModal}
                handleProfileSubmit={handleProfileSubmit}
              />
            }
          />
        ) : null}
        {showSubmitSuccessAlert ? (
          <AlertModel
            modalVisible={showSubmitSuccessAlert}
            onHandlePrimaryButton={onSubmitAlertButonPress}
            title={t('providerDetail.infoSaved')}
            subTitle={t('providerDetail.infoSavedDescription')}
            primaryButtonTitle={t('providerDetail.continue')}
          />
        ) : null}
      </View>
    </>
  );
};
