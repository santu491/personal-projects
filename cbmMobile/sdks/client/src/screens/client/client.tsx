import { Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { ClientBenefitsSelection } from '../../../../../shared/src/components/clientBenefitsSelection/clientBenefitsSelection';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { isAndroidTablet } from '../../../../../shared/src/utils/utils';
import { isIOS } from '../../../../../src/util/commonUtils';
import { ClientConfirmation } from '../../components/clientConfirmation/clientConfirmation';
import { ClientSearch } from '../../components/clientSearch/clientSearch';
import { clientStyles } from './client.styles';
import { useClient } from './useClient';

export const ClientDetails = () => {
  const { t } = useTranslation();
  const styles = useMemo(() => clientStyles(), []);

  const {
    onPressGoBackButton,
    showModel,
    selectedClient,
    searchText,
    onChangeClientName,
    onPressClientName,
    isClientFocused,
    onFocusClientInput,
    onBlurClientInput,
    searchError,
    dropDownItem,
    isLoading,
    drawerStep,
    selectedClientDetails,
    onPressNextButton,
    onRequestModalClose,
    onPrimaryMSUDButtonPress,
    onSecondaryEAPButtonPress,
    isHeaderBackIcon,
    setError,
    isError,
  } = useClient();

  return (
    <>
      <MainHeaderComponent leftArrow={isHeaderBackIcon} hideLogin={true} />
      <ProgressLoader isVisible={isLoading} />
      <KeyboardAwareScrollView
        style={styles.homeViewMainContainer}
        extraScrollHeight={isIOS() ? 150 : isAndroidTablet() ? 370 : 90}
        enableOnAndroid={true}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <H1 style={styles.headerStyle}>{t('home.titleHeader')}</H1>
        <H3 testID={'client.search.message'} style={styles.messageStyle}>
          {t('client.message')}
        </H3>
        <View style={styles.backgroundView}>
          <ClientSearch
            clientsList={dropDownItem}
            isClientFocused={isClientFocused}
            onBlurClientInput={onBlurClientInput}
            onChangeClientName={onChangeClientName}
            onFocusClientInput={onFocusClientInput}
            onPressClientName={onPressClientName}
            searchError={searchError}
            searchText={searchText}
            isLoading={isLoading}
          />
        </View>

        {showModel ? (
          <Drawer
            styles={styles.drawer}
            hideDrawerHeader
            visible={showModel}
            onRequestClose={onRequestModalClose}
            children={
              <>
                {drawerStep === 0 ? (
                  <ClientConfirmation
                    onPressContinueButton={onPressNextButton}
                    onPressPreviousButton={onPressGoBackButton}
                    client={selectedClient}
                    clientName={selectedClientDetails?.clientName}
                  />
                ) : (
                  <ClientBenefitsSelection
                    onPressPrimaryButton={onPrimaryMSUDButtonPress}
                    onPressSecondaryButton={onSecondaryEAPButtonPress}
                    onPressLink={() => {}}
                  />
                )}
              </>
            }
          />
        ) : null}

        {isError ? (
          <AlertModel
            modalVisible={isError}
            title={t('authErrors.tryAgainButton')}
            subTitle={t('home.assessmentErrorMessage')}
            primaryButtonTitle={t('home.ok')}
            onHandlePrimaryButton={() => setError(false)}
            isError={true}
          />
        ) : null}
      </KeyboardAwareScrollView>
    </>
  );
};
