import { useMemo } from 'react';
import { Linking } from 'react-native';

import { AppUrl } from '../../../shared/src/models';
import { RedirectURLType } from '../../constants/constants';
import { useAppContext } from '../../context/appContext';
import { BannerButtonPage, BannerButtonPageDataData } from '../../models/cardResource';
interface ResourceLibraryData {
  resourceLibraryData?: BannerButtonPage;
}
export const useResourceLibrary = ({ resourceLibraryData }: ResourceLibraryData) => {
  const { navigationHandler, wpoClientName } = useAppContext();

  const paramsData = useMemo(() => {
    if (resourceLibraryData) {
      const parsedData = resourceLibraryData;
      const sections = parsedData.data.map((section) => ({
        ...section,
        data: section.data,
      }));
      return {
        ...parsedData,
        data: sections,
      };
    }
    return { data: [] } as BannerButtonPage;
  }, [resourceLibraryData]);

  const { data, wpoRedirectUrl } = paramsData;

  const onPressCard = (cardData: BannerButtonPageDataData, redirectUrl?: string) => {
    if (cardData.isDynamicWPORedirectUrl) {
      const url = redirectUrl?.replace('{wpoClientName}', wpoClientName ?? '');
      const updatedUrl = url?.replace('{redirectUrl}', cardData.redirectUrl ?? '');
      if (updatedUrl) {
        Linking.openURL(updatedUrl);
      }
    } else {
      handleNavigation(cardData);
    }
  };

  const handleNavigation = (cardData: BannerButtonPageDataData) => {
    const [redirectionType, redirectionPath] = cardData.redirectUrl?.split(':') || [];
    const handleHttpsRedirection = () => {
      if (cardData.redirectUrl) {
        Linking.openURL(cardData.redirectUrl);
      }
    };

    switch (redirectionType) {
      case RedirectURLType.HTTPS:
        handleHttpsRedirection();
        break;
      case RedirectURLType.CREDIBLE_MIND:
        navigationHandler.linkTo({ action: AppUrl.CREDIBLEMIND, params: { url: redirectionPath } });
        break;
    }
  };
  return { onPressCard, data, wpoRedirectUrl };
};
