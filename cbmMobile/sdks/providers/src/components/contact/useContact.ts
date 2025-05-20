import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';

import { callNumber, openMap } from '../../../../../shared/src/utils/utils';
import { APP_CONTENT, appColors } from '../../../../../src/config';
import { formatNumber } from '../../../../../src/util/commonUtils';
import { ContactViewIcons, ContactViewTitle, SearchProvider } from '../../model/providerSearchResponse';
import { NOT_AVAILABLE } from '../../utils/commonUtils';

interface ContactsInfo {
  color?: string;
  disable?: boolean;
  icon: string;
  label: string;
  title: string;
}

export const useContact = (providerInfo: SearchProvider, isMapView: boolean) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { t } = useTranslation();

  const onPressItems = (info: ContactsInfo) => {
    if (info.title === ContactViewTitle.PHONE) {
      callNumber(phoneNumber);
    } else if (info.title === ContactViewTitle.EMAIL) {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl).catch((err) => {
        console.error('Failed to open email app:', err);
      });
    } else if (info.title === ContactViewTitle.LOCATION || info.title === ContactViewTitle.DIRETION) {
      const location = providerInfo.contact?.address.location;

      if (location?.lat && location.lon) {
        openMap(location.lat, location.lon);
      }
    }
  };

  const phoneNumber = useMemo(
    () =>
      providerInfo.contact?.phone !== NOT_AVAILABLE
        ? formatNumber(providerInfo.contact?.phone || '')
        : providerInfo.contact.phone,
    [providerInfo.contact?.phone]
  );

  const addressInfo = useMemo(() => {
    const { addr1, city, state, zip } = providerInfo.contact?.address || {};
    return addr1 && city && state && zip ? `${addr1}, ${city}, ${state}, ${zip}` : undefined;
  }, [providerInfo.contact?.address]);

  const miles = useMemo(() => {
    const distance = providerInfo.fields?.distance[0];
    return distance ? `${parseFloat(String(distance)).toFixed(1)} ${APP_CONTENT.PROVIDERS.MILES}` : undefined;
  }, [providerInfo.fields?.distance]);

  const email = useMemo(() => providerInfo.contact?.officeEmail, [providerInfo.contact?.officeEmail]);

  const states = useMemo(() => {
    const telehealthStates = providerInfo.telehealthTypes?.states;
    return telehealthStates && telehealthStates.length > 0
      ? `${t('providers.telehealthIn')} ${telehealthStates.join(', ')}`
      : undefined;
  }, [providerInfo.telehealthTypes?.states, t]);

  const contactsInfo: ContactsInfo[] = useMemo(() => {
    const items: ContactsInfo[] = [];
    if (phoneNumber) {
      items.push({
        icon: ContactViewIcons.PHONE_ICON,
        label: phoneNumber,
        title: ContactViewTitle.PHONE,
        color:
          phoneNumber === NOT_AVAILABLE ? appColors.darkGray : isMapView ? appColors.purple : appColors.lightPurple,
      });
    }
    if (email) {
      items.push({
        icon: ContactViewIcons.EMAIL_ICON,
        label: email,
        title: ContactViewTitle.EMAIL,
        color: email === NOT_AVAILABLE ? appColors.darkGray : isMapView ? appColors.purple : appColors.lightPurple,
        disable: email === NOT_AVAILABLE,
      });
    }
    if (addressInfo) {
      items.push({ icon: ContactViewIcons.LOCATION_ICON, label: addressInfo, title: ContactViewTitle.LOCATION });
    }
    if (miles) {
      items.push({ icon: ContactViewIcons.DIRETION_ICON, label: miles, title: ContactViewTitle.DIRETION });
    }
    if (states && !isMapView) {
      items.push({
        icon: ContactViewIcons.TELEHEALTH_ICON,
        label: states,
        color: appColors.darkGray,
        disable: true,
        title: ContactViewTitle.TELEHEALTH,
      });
    }
    return items;
  }, [phoneNumber, email, addressInfo, miles, states, isMapView]);

  return {
    isExpanded,
    setIsExpanded,
    contactsInfo,
    onPressItems,
  };
};
