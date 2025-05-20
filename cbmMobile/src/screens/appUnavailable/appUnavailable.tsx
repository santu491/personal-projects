import { Button, LoadingIndicator } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, View } from 'react-native';

import { ErrorCloudIcon, ErrorInfoIcon } from '../../../shared/src/assets/icons/icons';
import { H3 } from '../../../shared/src/components/text/text';
import { Logo } from '../../assests/icons/logo';
import { appColors } from '../../config';
import { AppStatus } from '../appInit/appInitContext';
import { appUnavailableStyles } from './appUnavailable.styles';
import { useAppUnavailable } from './useAppUnavailable';

export const AppUnavailable = (): JSX.Element => {
  const { appUnavailableErrorContext, reloadApp, appStatus } = useAppUnavailable();
  const { t } = useTranslation();
  const styles = useMemo(() => appUnavailableStyles(), []);

  const errorHeader = appUnavailableErrorContext?.header;
  const errorMessage = appUnavailableErrorContext?.body;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={appStatus === AppStatus.LOADING ? styles.contentContainer : styles.contentWithOutLoader}>
          <View style={styles.logoContainer} testID="splash-header-icon">
            <Logo />
          </View>
          {appStatus === AppStatus.LOADING ? (
            <LoadingIndicator
              size="large"
              darkBackground={true}
              style={styles.center}
              testID="screen.loadingIndicator"
            />
          ) : (
            <View style={styles.descriptionContainer}>
              {appUnavailableErrorContext?.preventReload ? (
                <ErrorInfoIcon color={appColors.white} width={24} height={24} />
              ) : (
                <ErrorCloudIcon color={appColors.white} />
              )}
              {errorHeader ? <H3 style={styles.errorText}>{errorHeader}</H3> : null}
              <H3 style={styles.errorMessage}>{errorMessage}</H3>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {appStatus === AppStatus.LOADING ? null : (
              <>
                {appUnavailableErrorContext?.preventReload ? null : (
                  <Button
                    testID="coldstate.appUnavailable.reloadButton"
                    title={t('errorScreen.retry')}
                    onPress={reloadApp}
                    styles={styles.button}
                  />
                )}
                {appUnavailableErrorContext?.buttons?.map((buttonProps) => (
                  <Button key={buttonProps.title} {...buttonProps} styles={styles.button} />
                ))}
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
