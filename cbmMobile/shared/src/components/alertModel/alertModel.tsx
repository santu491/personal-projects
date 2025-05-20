import { useFocusEffect } from '@react-navigation/native';
import { useAccessibility } from '@sydney/motif-components';
import React, { useCallback, useRef } from 'react';
import { Image, View } from 'react-native';
import RNModal from 'react-native-modal';

import { ErrorIndicatorIcon, SuccessIndicatorIcon } from '../../assets/icons/icons';
import { APP_IMAGES } from '../../context/appImages';
import { ActionButton } from '../actionButton';
import { H1, RNText } from '../text/text';
import { styles } from './alertModel.styles';

export type AlertModelProps = {
  errorIndicatorIconColor?: string;
  isError?: boolean;
  isSuccess?: boolean;
  modalVisible: boolean;
  onHandlePrimaryButton: () => void;
  onHandleSecondaryButton?: () => void;
  onRequestClose?: () => void;
  primaryButtonTitle: string;
  secondaryButtonTitle?: string;
  showIndicatorIcon?: boolean;
  subTitle: string | React.ReactNode;
  title: string;
};

export const AlertModel = ({
  isError = false,
  isSuccess = false,
  modalVisible,
  title,
  subTitle,
  primaryButtonTitle,
  showIndicatorIcon = true, // alert tick icon will set as default visible, in some model don't want to show that can be turned off
  secondaryButtonTitle,
  onHandlePrimaryButton,
  onHandleSecondaryButton,
  errorIndicatorIconColor,
  onRequestClose,
}: AlertModelProps) => {
  const viewRef = useRef<View>(null);
  const { setAccessibilityFocus } = useAccessibility();

  useFocusEffect(
    useCallback(() => {
      if (viewRef.current) {
        setAccessibilityFocus(viewRef);
      }
    }, [setAccessibilityFocus])
  );
  return (
    <RNModal onBackdropPress={onRequestClose} isVisible={modalVisible} testID="alert-back-drop">
      <View ref={viewRef} style={styles.alertViewStyle} accessible={true}>
        <View style={styles.innerViewStyle} accessible={true}>
          <H1 style={styles.titleStyle}>{title}</H1>
          <View style={styles.subViewStyle} accessible={true}>
            {showIndicatorIcon ? (
              <>
                {isError ? (
                  <View style={styles.errorImage} testID="alert.error.icon">
                    <ErrorIndicatorIcon width={24} height={24} color={errorIndicatorIconColor} />
                  </View>
                ) : isSuccess ? (
                  <View style={styles.errorImage} testID="alert.success.icon">
                    <SuccessIndicatorIcon width={24} height={24} />
                  </View>
                ) : (
                  <Image style={styles.imageStyle} source={APP_IMAGES.CHECKED_IMAGE} />
                )}
              </>
            ) : null}
            <RNText style={styles.descriptionStyle}>{subTitle}</RNText>
          </View>
          {secondaryButtonTitle ? (
            <ActionButton
              onPress={() => onHandleSecondaryButton?.()}
              title={secondaryButtonTitle}
              style={styles.secondaryActionButton}
              textStyle={styles.secondaryButtonText}
              testID={'alert.secondary.button'}
            />
          ) : null}
          <ActionButton
            onPress={onHandlePrimaryButton}
            title={primaryButtonTitle}
            style={styles.actionButton}
            textStyle={styles.actionButtonText}
            testID={'alert.primary.button'}
          />
        </View>
      </View>
    </RNModal>
  );
};
