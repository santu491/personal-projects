import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { TelePhoneIcon } from '../../../../shared/src/assets/icons/icons';
import { H4 } from '../../../../shared/src/components/text/text';
import { Contact } from '../../../models/cardResource';
import { styles } from '../cardResource.styles';

export const CardResourceContact = ({
  contact,
  onPressContactNo,
}: {
  contact?: Contact;
  onPressContactNo?: (number?: string) => void;
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.contactView}>
      {contact?.title ? <H4 style={[styles.h4, styles.contactTitle]}>{contact.title}</H4> : null}
      <View style={styles.contact}>
        <View style={styles.telephoneIcon}>
          <TelePhoneIcon />
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.description}>
            {contact?.description}
            {t('common.space')}
            <Text style={styles.number} onPress={() => onPressContactNo?.(contact?.number)}>
              {contact?.number}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};
