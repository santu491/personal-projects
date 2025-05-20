import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { modelStyles } from './benefitCard.style';

export const BenefitCard: React.FC<{
  description: string;
  onPress: () => void;
  testID: string;
  title: string;
}> = ({ title, description, onPress, testID }) => (
  <TouchableOpacity onPress={onPress} style={modelStyles.cardPadding} accessibilityRole="button">
    <View style={modelStyles.borderedContainer}>
      <Text style={modelStyles.subBenefitTitle} testID={testID}>
        {title}
      </Text>
      <Text style={modelStyles.bottomContent}>{description}</Text>
    </View>
  </TouchableOpacity>
);
