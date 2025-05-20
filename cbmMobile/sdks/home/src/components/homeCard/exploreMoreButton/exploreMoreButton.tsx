import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { H3 } from '../../../../../../shared/src/components/text/text';
import { RightArrowIcon } from '../../../../../auth/src/assets/icons/authIcons';
import { homeStyles } from '../../../screens/home/home.styles';

export interface ExploreMoreButtonProps {
  onPressButton: () => void;
}

export const ExploreMoreButton: React.FC<ExploreMoreButtonProps> = ({ onPressButton }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={homeStyles.exploreMoreView} onPress={onPressButton}>
      <H3 style={homeStyles.exploreMore}>{t('home.exploreMore')}</H3>
      <View style={homeStyles.rightArrowIcon}>
        <RightArrowIcon />
      </View>
    </TouchableOpacity>
  );
};
