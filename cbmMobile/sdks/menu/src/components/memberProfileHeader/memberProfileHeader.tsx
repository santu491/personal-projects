import React from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';

import { H1, H3 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';

interface MemberProfileHeaderProps {
  description?: string;
  testID?: string;
  title?: string;
  titleStyle?: TextStyle;
}

export const MemberProfileHeader: React.FC<MemberProfileHeaderProps> = ({ title, testID, titleStyle, description }) => {
  return (
    <>
      <H1 testID={testID} style={[styles.title, titleStyle]}>
        {title}
      </H1>
      {description ? <H3 style={styles.description}>{description}</H3> : null}
      <View style={styles.itemSeparatorStyle} />
    </>
  );
};
export const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  itemSeparatorStyle: {
    height: 1,
    backgroundColor: appColors.paleGray,
    shadowColor: appColors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 2,
  },
});
