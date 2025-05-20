import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { appColors } from '../../../../src/config';

export const MemberPlan = () => {
  return (
    <View style={styles.container}>
      <Text>Member plan will be coming soon!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.white,
  },
});
