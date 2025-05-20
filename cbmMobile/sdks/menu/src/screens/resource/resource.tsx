import { useRoute } from '@react-navigation/native';
import React from 'react';

import { BannerButtonPage } from '../../../../../src/models/cardResource';
import { CardResource } from '../../../../../src/screens/cardResource/cardResource';
import { useMenuContext } from '../../context/menu.sdkContext';
import { MenuResourceScreenProps, Screen } from '../../navigation/menu.navigationTypes';

export const Resource = () => {
  const params = useRoute<MenuResourceScreenProps['route']>().params;
  const { navigation } = useMenuContext();
  const navigateToCredibleMind = (url: string) => {
    navigation.navigate(Screen.CREDIBLE_MIND, { url });
  };
  const navigateToResourceLibrary = (data: BannerButtonPage) => {
    navigation.navigate(Screen.RESOURCE_LIBRARY, { resourceLibraryData: data });
  };
  return (
    <CardResource
      path={params.path}
      navigateToCredibleMind={navigateToCredibleMind}
      navigateToResourceLibrary={navigateToResourceLibrary}
    />
  );
};
