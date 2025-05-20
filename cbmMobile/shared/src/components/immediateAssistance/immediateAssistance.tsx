import { useFocusEffect } from '@react-navigation/native';
import { useAccessibility } from '@sydney/motif-components';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';

import { CustomerSupport, ErrorAlertIcon, HandCursor, SMSIcon, SupplementalHealthIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { ContactInfo, ImmediateAssistanceProps } from '../../models/src/features/immediateAssistance';
import { H3 } from '../text/text';
import { immediateAssistanceStyles } from './immediateAssistance.styles';

export const ImmediateAssistance = ({ contactsInfo, onPressContact, title }: ImmediateAssistanceProps) => {
  const { t } = useTranslation();
  const viewRef = useRef<View>(null);
  const { setAccessibilityFocus } = useAccessibility();

  useFocusEffect(
    useCallback(() => {
      if (viewRef.current) {
        setAccessibilityFocus(viewRef);
      }
    }, [setAccessibilityFocus])
  );

  const styles = useMemo(() => immediateAssistanceStyles(), []);

  const icon = (type: string) => {
    switch (type.toLowerCase()) {
      case t('credibleMind.immediateAssistance.emergency').toLowerCase():
        return <ErrorAlertIcon />;

      case t('credibleMind.immediateAssistance.suicideOrCrisis').toLowerCase():
        return <SupplementalHealthIcon />;

      case t('credibleMind.immediateAssistance.text').toLowerCase():
        return <HandCursor />;

      case t('credibleMind.immediateAssistance.chat').toLowerCase():
        return (
          <View style={styles.iconPadding}>
            <SMSIcon color={appColors.darkGray} />
          </View>
        );

      default:
        return <CustomerSupport />;
    }
  };

  const renderContactInfo = (contact: ContactInfo, index: number) => {
    return (
      <>
        <View style={styles.contactInfoView} key={index.toString()} accessible={true}>
          {contact.key ? <View style={styles.icon}>{icon(contact.key)}</View> : null}
          <Text style={styles.contactUsDescription}>
            {`${contact.key?.replace(':', '').trim()}: `}
            <Text
              style={styles.assistancePhoneTextStyle}
              testID={`menu.call.${contact.key}`}
              onPress={() => onPressContact(contact)}
            >
              {contact.value}
            </Text>
          </Text>
        </View>
      </>
    );
  };

  return (
    <View ref={viewRef} accessible={true}>
      <View
        style={styles.headerContainer}
        accessibilityLabel={t('credibleMind.immediateAssistance.accessibilityLabel')}
        accessibilityRole="text"
        accessible={false}
      >
        <H3 style={styles.bottomSheetTitleStyle} testID={'title-immediate-assistance'}>
          {title}
        </H3>
      </View>
      <View style={styles.descriptionContainer} accessible={true}>
        <FlatList
          scrollEnabled={false}
          data={contactsInfo}
          renderItem={({ item, index }) => renderContactInfo(item, index)}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};
