import React from 'react';
import { View } from 'react-native';

import { appStyles } from '../context/appStyles';
import { ContentView } from './contentView';

interface ContentWindowProps {
  sourceUrl: string;
  testID?: string;
}

export const ContentWindow: React.FC<ContentWindowProps> = ({ sourceUrl, testID }) => {
  return (
    <>
      <View style={appStyles.mainContainer}>
        <ContentView source={sourceUrl} testID={testID} />
      </View>
    </>
  );
};
