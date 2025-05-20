import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { License } from '../../model/providerSearchResponse';
import { styles } from './licenseTable.styles';

interface LicenseTableProps {
  data?: License[];
}

export const LicenseTable = ({ data }: LicenseTableProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Text style={styles.title}>{t('providerDetail.license')}</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.headerCell, styles.cell1]}>{t('providerDetail.number')}</Text>
          <Text style={[styles.headerCell, styles.cell2]}>{t('providerDetail.state')}</Text>
          <Text style={[styles.headerCell, styles.cell3]}>{t('providerDetail.certification')}</Text>
        </View>
        {data?.map((item) => (
          <View key={item.licenseNumber} style={[styles.row, styles.body]}>
            <Text style={[styles.cell, styles.cell1]}>{item.licenseNumber}</Text>
            <Text style={[styles.cell, styles.cell2]}>{item.licenseState}</Text>
            <Text style={[styles.cell, styles.cell3]}>{item.certificationEntity}</Text>
          </View>
        ))}
      </View>
    </>
  );
};
