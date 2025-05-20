import { useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';

import { callNumber } from '../../../shared/src/utils/utils';
import { API_ENDPOINTS_JSON, ExperienceType, Language } from '../../config/apiEndpoints';
import { RedirectURLApiType, RedirectURLType } from '../../constants/constants';
import { useAppContext } from '../../context/appContext';
import { RequestMethod } from '../../models/adapters';
import { BannerButtonPage, BannerButtonsData, CardResource, CardResourceDTO } from '../../models/cardResource';

export const useCardResource = ({
  path,
  navigateToCredibleMind,
  navigateToResourceLibrary,
}: {
  navigateToCredibleMind: (url: string) => void;
  navigateToResourceLibrary: (data: BannerButtonPage) => void;
  path: string;
}) => {
  const [contentInfo, setContentInfo] = useState<CardResource | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const appContext = useAppContext();

  const bannerButtons = useMemo(() => {
    if (contentInfo?.page?.cards?.banner?.buttons) {
      const keys: string[] = Object.keys(contentInfo.page.cards.banner.buttons ?? {});
      if (keys.length > 0) {
        return keys.map((key) => contentInfo.page?.cards?.banner?.buttons?.[key]);
      }
      return [];
    }
    return [];
  }, [contentInfo?.page?.cards?.banner?.buttons]) as BannerButtonsData[];

  useEffect(() => {
    const getTelHealthDetails = async () => {
      try {
        setLoading(true);
        const response: CardResourceDTO = (await appContext.serviceProvider.callService(
          `/${appContext.loggedIn ? ExperienceType.SECURE : ExperienceType.PUBLIC}/${appContext.client?.source}/${Language.EN}${API_ENDPOINTS_JSON.TELEHEALTH.endpoint}`,
          RequestMethod.POST,
          {
            path,
          }
        )) as CardResourceDTO;

        setContentInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.info(error);
        setLoading(false);
      }
    };

    getTelHealthDetails();
  }, [appContext.client?.source, appContext.loggedIn, appContext.serviceProvider, path]);

  const onPressBannerButton = (item: BannerButtonsData) => {
    const [redirectionType, redirectionPath] = item.redirectUrl?.split(':') || [];
    const handleHttpsRedirection = () => {
      if (item.redirectUrl) {
        Linking.openURL(item.redirectUrl);
      }
    };

    const handlePageRedirection = () => {
      if (redirectionPath === RedirectURLApiType.WORK_LIFE_RESOURCE_LIBRARY && item.page) {
        navigateToResourceLibrary(item.page);
      }
    };

    switch (redirectionType) {
      case RedirectURLType.HTTPS:
        handleHttpsRedirection();
        break;
      case RedirectURLType.CREDIBLE_MIND:
        // navigationHandler.linkTo({ action: AppUrl.CREDIBLEMIND, params: { url: redirectionPath } });
        navigateToCredibleMind(redirectionPath);
        break;
      case RedirectURLType.PAGE:
        handlePageRedirection();
        break;
    }
  };

  const onPressContactNo = (contactNo?: string) => {
    if (contactNo) {
      callNumber(contactNo);
    }
  };

  return {
    contentInfo,
    loading,
    bannerButtons,
    onPressBannerButton,
    onPressContactNo,
  };
};
