import { useRoute } from '@react-navigation/native';
import React from 'react';

import { ResourceLibrary } from '../../../../../src/screens/resourceLibrary/resourceLibrary';
import { HomeResourceLibraryScreenProps } from '../../navigation/home.navigationTypes';

export const HomeResourceLibrary = () => {
  const params = useRoute<HomeResourceLibraryScreenProps['route']>().params;
  return <ResourceLibrary resourceLibraryData={params.resourceLibraryData} />;
};
