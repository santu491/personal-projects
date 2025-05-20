import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-elements';

import { SearchProvider } from '../../../../sdks/providers/src/model/providerSearchResponse';
import { generateAbbreviation, toPascalCase } from '../../utils/utils';
import { H1, H3 } from '../text/text';
import { styles } from './profileTitle.styles';

interface ProfileTitleComponentProps {
  imagePath?: boolean;
  onPress?: (title: string) => void;
  profileTitleData: SearchProvider;
  viewStyle?: StyleProp<ViewStyle>;
}

export const ProfileTitleComponent: React.FC<ProfileTitleComponentProps> = ({
  imagePath,
  viewStyle,
  profileTitleData,
  onPress,
}) => {
  const fullName = React.useMemo(() => {
    const { firstName, lastName } = profileTitleData.name ? profileTitleData.name : { firstName: '', lastName: '' };
    return `${toPascalCase(firstName)} ${toPascalCase(lastName)}`;
  }, [profileTitleData.name]);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.circle}>
          <H1 style={styles.text}>{generateAbbreviation(fullName)}</H1>
        </View>
        <View style={viewStyle}>
          <TouchableOpacity onPress={() => onPress && onPress(profileTitleData.id ?? '')} testID="profile-title">
            <Text style={styles.nameTitle}>{fullName}</Text>
          </TouchableOpacity>
          <H3 style={[styles.title, imagePath ? styles.detailProfessionTitle : styles.professionTitle]}>
            {profileTitleData.title}
          </H3>
        </View>
      </View>
    </>
  );
};
