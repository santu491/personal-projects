import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { DownArrowIcon, UpArrowIcon } from '../../../../../shared/src/assets/icons/icons';
import { H3, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { Specialty } from '../../model/providerSearchResponse';
import { styles } from './specialties.styles';

interface SpecialtiesProps {
  specialties?: Specialty[];
}

export const Specialties = ({ specialties }: SpecialtiesProps) => {
  const [isSpecialtiesView, setIsSpecialtiesView] = useState(false);
  const displaySpecialtiesData = () => {
    setIsSpecialtiesView((previousState) => !previousState);
  };
  const { t } = useTranslation();
  return (
    <View>
      <TouchableOpacity onPress={displaySpecialtiesData} style={styles.specialtiesView} testID={'work-hour'}>
        <H3 style={styles.specialtiesTitle} testID={'specialties-title'}>
          {t('providers.specialties')}
        </H3>
        <View style={styles.downImageStyle} testID={'specialties-arrow'}>
          {isSpecialtiesView ? (
            <UpArrowIcon width={12} height={12} color={appColors.darkGray} />
          ) : (
            <DownArrowIcon width={12} height={12} color={appColors.darkGray} />
          )}
        </View>
      </TouchableOpacity>
      {specialties && specialties.length > 0 && isSpecialtiesView ? (
        <View style={styles.specialtiesExpandViewStyle} testID={'specialties-expand-view'}>
          {specialties.map((specialty) => (
            <View key={specialty.id} style={styles.specialtyView}>
              <RNText style={styles.dotView}>{t('common.dot')}</RNText>
              <RNText style={styles.nameView}>{specialty.name}</RNText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};
