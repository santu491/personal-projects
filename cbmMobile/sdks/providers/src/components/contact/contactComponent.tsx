import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View } from 'react-native';

import {
  DirectionIcon,
  DownArrowIcon,
  LocationIcon,
  MailIcon,
  ProviderPhoneIcon,
  TeleHealthIcon,
  UpArrowIcon,
} from '../../../../../shared/src/assets/icons/icons';
import { appColors } from '../../../../../src/config';
import { ContactViewIcons, SearchProvider } from '../../model/providerSearchResponse';
import { styles } from './contact.styles';
import { useContact } from './useContact';

const NOT_AVAILABLE = 'Not Available';
const contactIcon = (iconType: string, color: string) => {
  const contactImage = {
    [ContactViewIcons.PHONE_ICON]: <ProviderPhoneIcon color={color} />,
    [ContactViewIcons.EMAIL_ICON]: <MailIcon color={color} />,
    [ContactViewIcons.LOCATION_ICON]: <LocationIcon color={color} />,
    [ContactViewIcons.DIRETION_ICON]: <DirectionIcon color={color} />,
    [ContactViewIcons.TELEHEALTH_ICON]: <TeleHealthIcon color={color} />,
  };

  return contactImage[iconType as keyof typeof contactImage];
};

export const ContactComponent = ({
  providerInfo,
  hasAccordionView = false,
  textStyle,
  isMapView = false,
}: {
  hasAccordionView: boolean;
  isMapView?: boolean;
  providerInfo: SearchProvider;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const { isExpanded, setIsExpanded, contactsInfo, onPressItems } = useContact(providerInfo, isMapView);

  return (
    <View>
      <TouchableOpacity
        style={styles.headerView}
        onPress={() => hasAccordionView && setIsExpanded(!isExpanded)}
        disabled={!hasAccordionView}
      >
        {hasAccordionView ? (
          <View style={styles.downImageStyle} testID={'hours-arrow'}>
            {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
          </View>
        ) : null}
      </TouchableOpacity>
      {isExpanded || !hasAccordionView
        ? contactsInfo.map((info) => (
            <TouchableOpacity
              style={styles.contactView}
              onPress={() => onPressItems(info)}
              accessibilityRole="button"
              accessibilityLabel="${phoneNumber}"
              testID={`provider.${info.icon}`}
              key={info.label}
              disabled={info.disable}
            >
              {contactIcon(info.icon, info.label === NOT_AVAILABLE ? appColors.darkGray : appColors.purple)}
              <Text style={[styles.text, textStyle, info.color ? { color: info.color } : {}]}>{info.label}</Text>
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
};
