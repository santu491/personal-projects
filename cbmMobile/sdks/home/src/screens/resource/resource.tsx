import { useRoute } from '@react-navigation/native';
import React from 'react';

import { BannerButtonPage } from '../../../../../src/models/cardResource';
import { CardResource } from '../../../../../src/screens/cardResource/cardResource';
import { useHomeContext } from '../../context/home.sdkContext';
import { HomeCardResourceScreenProps, Screen } from '../../navigation/home.navigationTypes';

export const Resource = () => {
  const params = useRoute<HomeCardResourceScreenProps['route']>().params;
  const { navigation } = useHomeContext();
  const navigateToCredibleMind = (url: string) => {
    navigation.navigate(Screen.CREDIBLEMIND, { url });
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
