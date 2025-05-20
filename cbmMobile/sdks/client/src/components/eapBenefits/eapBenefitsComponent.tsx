import React from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, ImageSourcePropType, TouchableOpacity, View } from 'react-native';

import { H1, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { RightArrow } from '../../assets/icons/icons';
import { DotPagination } from '../dotPagination/dotPagination';
import { styles } from './eapBenefitsComponent.styles';

export interface EapBenefitsComponentProps {
  description: string;
  imageSource: ImageSourcePropType;
  onPressNextButton: () => void;
  onPressSkipButton: () => void;
  progressStepsCount: number;
  title: string;
}

export const EapBenefitsComponent = ({
  imageSource,
  onPressNextButton,
  progressStepsCount,
  title,
  description,
  onPressSkipButton,
}: EapBenefitsComponentProps) => {
  const { t } = useTranslation();

  return (
    <ImageBackground source={imageSource} style={styles.backgroundImage}>
      <TouchableOpacity style={styles.skipButton} onPress={onPressSkipButton}>
        <RNText style={styles.skipTitle}>{t('eapBenefits.skip')}</RNText>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomInnerContainer}>
          <View>
            <H1 style={styles.title}>{title}</H1>
          </View>
          <RNText style={styles.description}>{description}</RNText>
          <DotPagination
            totalStepsCount={3}
            testID="dot-pagination"
            backgroundColor={(index) => {
              return index === progressStepsCount ? appColors.lightPurple : appColors.lightGray;
            }}
          />
          <TouchableOpacity style={styles.nextButton} onPress={onPressNextButton}>
            <RNText style={styles.text}>{t('eapBenefits.next')}</RNText>
            <RightArrow />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
