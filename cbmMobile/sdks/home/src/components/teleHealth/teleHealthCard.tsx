import { t } from 'i18next';
import React from 'react';
import { Image, View } from 'react-native';

import { ActionButton } from '../../../../../shared/src/components';
import { H2, RNText } from '../../../../../shared/src/components/text/text';
import { styles } from './teleHealth.styles';

interface TeleHealthCardProps {
  buttonTitle?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  onPress: () => void;
  testID?: string;
  title?: string;
}

export const TeleHealthCard: React.FC<TeleHealthCardProps> = ({
  title,
  description,
  icon,
  onPress,
  testID,
  buttonTitle,
  image,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardStyle}>
        {image ? <Image source={{ uri: image }} style={styles.image} resizeMode="contain" /> : (icon ?? null)}
        {title ? <H2 style={styles.label}>{t(title)}</H2> : null}
      </View>
      {description ? <RNText style={styles.description}>{t(description)}</RNText> : null}

      {buttonTitle ? (
        <ActionButton
          onPress={() => onPress()}
          title={buttonTitle}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          testID={testID}
        />
      ) : null}
    </View>
  );
};
