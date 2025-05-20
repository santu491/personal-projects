import { useRoute } from '@react-navigation/native';
import React from 'react';

import { ResourceLibrary } from '../../../../../src/screens/resourceLibrary/resourceLibrary';
import { MenuResourceLibraryScreenProps } from '../../navigation/menu.navigationTypes';

export const MenuResourceLibrary = () => {
  const params = useRoute<MenuResourceLibraryScreenProps['route']>().params;
  return <ResourceLibrary resourceLibraryData={params.resourceLibraryData} />;
};
