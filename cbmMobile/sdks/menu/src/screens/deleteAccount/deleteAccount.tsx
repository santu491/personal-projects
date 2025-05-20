import { CheckBox, Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H1, H3, H4 } from '../../../../../shared/src/components/text/text';
import { MemberProfileHeader } from '../../components/memberProfileHeader/memberProfileHeader';
import { deleteAccountStyles } from './deleteAccount.styles';
import { useDeleteAccount } from './useDeleteAccount';

export const DeleteAccount = () => {
  const {
    setShowBottomSheet,
    showBottomSheet,
    handleDeleteAccount,
    handleCheckboxConfirmation,
    handleCancel,
    enableDeleteButton,
    showAlert,
    navigateToHome,
    handleDeleteAccountBottomSheet,
  } = useDeleteAccount();
  const { t } = useTranslation();
  const styles = useMemo(() => deleteAccountStyles(), []);

  return (
    <>
      <MainHeaderComponent />
      <View style={styles.container}>
        <MemberProfileHeader title={t('profile.deleteAccount')} />
        <View style={styles.subContainer}>
          <H4 style={styles.titleText}>{t('profile.deleteAccountPage.title')} </H4>
          <H3 style={styles.headerText}>{t('profile.deleteAccountPage.header')}</H3>
          <H3 style={styles.headerText}>{t('profile.deleteAccountPage.note')}</H3>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <ActionButton
          onPress={handleDeleteAccountBottomSheet}
          title={t('profile.deleteAccountPage.button')}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          testID={'profile.deleteAccountPage.deleteaccount.button'}
        />
        {showBottomSheet ? (
          <Drawer
            styles={styles.drawer}
            visible={showBottomSheet}
            hideDrawerHeader
            onRequestClose={() => {
              setShowBottomSheet(false);
            }}
            children={
              <>
                <View style={styles.titleView}>
                  <H1 style={styles.bottomSheetTitleStyle} testID={'delete.account.sheet.title'}>
                    {t('profile.deleteAccountPage.button')}
                  </H1>
                </View>
                <View style={styles.drawerContainer}>
                  <View style={styles.bottomSheetView}>
                    <H3 style={styles.sheetText}>{t('profile.deleteAccountPage.confirmationHeader')}</H3>
                    <View style={styles.checkBoxView}>
                      <H3 style={styles.confirmText}>{t('profile.deleteAccountPage.accountConfirmation')}</H3>
                      <View style={styles.checkBoxUi}>
                        <CheckBox
                          onPress={handleCheckboxConfirmation}
                          styles={styles.checkbox}
                          checked={enableDeleteButton}
                        />
                      </View>
                    </View>
                  </View>
                  <ActionButton
                    title={t('home.cancel')}
                    onPress={handleCancel}
                    style={[styles.drawerActionButton, styles.cancelButton]}
                    textStyle={[styles.drawerButtonText, styles.cancelButtonText]}
                  />
                  <ActionButton
                    style={enableDeleteButton ? styles.drawerActionButton : styles.disableDrawerActionButton}
                    textStyle={enableDeleteButton ? styles.drawerButtonText : styles.disableDrawerButtonText}
                    title={t('profile.deleteAccountPage.button')}
                    onPress={handleDeleteAccount}
                  />
                </View>
              </>
            }
          />
        ) : null}
        {showAlert ? (
          <AlertModel
            modalVisible={showAlert}
            onHandlePrimaryButton={navigateToHome}
            title={t('profile.deleteAccountPage.deletedTitle')}
            subTitle={t('profile.deleteAccountPage.deletedMessage')}
            primaryButtonTitle={t('providers.continue')}
          />
        ) : null}
      </View>
    </>
  );
};
