import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { BenefitCard } from '../benefitCard/benefitCard';
import { modelStyles } from './clientBenefitsSelection.styles';

interface ClientBenefitsSelectionProps {
  onPressLink: () => void;
  onPressPrimaryButton: () => void;
  onPressSecondaryButton: () => void;
}

export const ClientBenefitsSelection: React.FC<ClientBenefitsSelectionProps> = ({
  onPressPrimaryButton,
  onPressSecondaryButton,
  onPressLink,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <View style={modelStyles.headerContainer}>
        <Text style={modelStyles.bottomSheetTitleStyle} testID={'client.bottomSheet.model'}>
          {t('client.benefitTitle')}
        </Text>
      </View>

      <View style={modelStyles.descriptionContainer}>
        <BenefitCard
          title={t('client.benefitMhsudTitle')}
          description={t('client.mhsudDescription')}
          onPress={onPressPrimaryButton}
          testID={t('client.benefitMhsudTitle')}
        />

        <BenefitCard
          title={t('client.benefitEapTitle')}
          description={t('client.eapDescription')}
          onPress={onPressSecondaryButton}
          testID={t('client.benefitEapTitle')}
        />

        <Text style={[modelStyles.bottomContent, modelStyles.bottomTitleContent]}>{t('client.benefitQuestion')}</Text>
        <TouchableOpacity onPress={onPressLink}>
          <Text style={[modelStyles.message, modelStyles.link]}>{t('client.contactAdministrator')}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
