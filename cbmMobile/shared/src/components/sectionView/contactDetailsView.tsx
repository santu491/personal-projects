import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';

import { H3, RNText } from '../text/text';
import { styles } from './sectionView.styles';

interface Description {
  id: string;
  name: string;
  title?: string;
}

interface ContactDetailsViewProps {
  description?: string | Description[];
  headerTitle: string;
  viewStyle: ViewStyle;
}

export const ContactDetailsView: React.FC<ContactDetailsViewProps> = ({ headerTitle, description, viewStyle }) => {
  // Pass children as a parameter
  return (
    <View style={viewStyle}>
      <H3 style={styles.contactSectionTitle} testID={'contact-details-header'}>
        {headerTitle}
      </H3>
      {Array.isArray(description) ? (
        <View style={styles.additionalDetailsViewStyle}>
          {description.map((item) => (
            <View key={`${item.id}-${item.title}`} style={styles.detailsSubViewStyle}>
              {description.length >= 2 ? (
                <RNText testID={`contact-details-dot-${item.id}-${item.title}`} style={styles.subTitle}>
                  {'•'}
                </RNText>
              ) : null}
              <RNText
                testID={`contact-details-description-${item.id}-${item.title}`}
                key={`${item.id}-${item.title}`}
                style={description.length >= 2 ? styles.subTitle : styles.descTitle}
              >
                {item.name}
              </RNText>
            </View>
          ))}
        </View>
      ) : (
        <Text testID="sub-details-description" style={styles.descTitle}>
          {description}
        </Text>
      )}
    </View>
  );
};
