import { useNetInfo } from '@react-native-community/netinfo';
import { Button } from '@sydney/motif-components';
import deepmerge from 'deepmerge';
import React, { PropsWithChildren, Suspense, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { ErrorCloudIcon } from '../../../shared/src/assets/icons/icons';
import { ErrorBoundary, FallbackProps } from '../../../shared/src/components/errorBoundary/errorBoundary';
import { H3 } from '../../../shared/src/components/text/text';
import { getStyles, overrideButtonStyles } from './screenErrorBoundary.styles';

export interface ScreenErrorBoundaryProps extends PropsWithChildren<unknown> {
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  onReset?: () => void;
}

export const ScreenErrorBoundary: React.FC<ScreenErrorBoundaryProps> = ({
  children,
  fallback,
  onError: onErrorProp,
  onReset,
}) => {
  const onError = useCallback(
    (error: Error, errorInfo: React.ErrorInfo) => {
      onErrorProp?.(error, errorInfo);
    },
    [onErrorProp]
  );

  const { isConnected, isInternetReachable } = useNetInfo();
  const { t } = useTranslation();
  const styles = useMemo(() => deepmerge(getStyles(), overrideButtonStyles), []);

  return (
    <ErrorBoundary
      renderFallback={({ resetErrorBoundary: handleReset }: FallbackProps) => {
        const showOffline = isConnected === false || isInternetReachable === false;
        const errorTitle = showOffline ? t('offlineError.header') : t('errorScreen.title');
        const errorBody = showOffline ? t('offlineError.body') : t('errorScreen.message');
        return (
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <ErrorCloudIcon />
              <H3 style={styles.titleText}>{errorTitle}</H3>
              <H3 style={styles.messageText}>{errorBody}</H3>
            </View>
            <Button
              testID="screenError.retry"
              styles={styles.button}
              onPress={handleReset}
              title={t('errorScreen.retry')}
            />
          </View>
        );
      }}
      onError={onError}
      onReset={onReset}
    >
      <Suspense fallback={fallback ?? null}>{children}</Suspense>
    </ErrorBoundary>
  );
};
