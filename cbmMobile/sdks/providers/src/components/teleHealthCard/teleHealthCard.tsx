import { t } from 'i18next';
import React from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { TickIcon, WebSiteIcon } from '../../../../../shared/src/assets/icons/icons';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { RNText } from '../../../../../shared/src/components/text/text';
import { SourceType } from '../../../../../src/constants/constants';
import { SearchProvider } from '../../model/providerSearchResponse';
import { styles } from './teleHealthCard.styles';
import { useTeleHelathCard } from './useTeleHealthCard';

export interface TeleHealthCardProps {
  providerInfo: SearchProvider;
}

export const TeleHealthCard = ({ providerInfo }: TeleHealthCardProps) => {
  const svgUri = providerInfo.logo?.src.endsWith('.svg') ? encodeURI(providerInfo.logo.src) : null;
  const descriptions = providerInfo.description ? providerInfo.description.split('\n\n') : [];
  const { onHandleVisitWebSite, client, modelVisible, showError, handleTryAgain } = useTeleHelathCard(providerInfo);

  return (
    <View style={styles.mainCardView}>
      {svgUri ? (
        <SvgUri uri={svgUri} width="100%" onError={(error) => console.error('Failed to load SVG:', error)} />
      ) : (
        <ImageBackground
          resizeMode="contain"
          style={styles.logo}
          source={providerInfo.logo?.src ? { uri: encodeURI(providerInfo.logo.src) } : undefined}
          testID="home.provider.teleHealthCard"
        />
      )}
      {providerInfo.title && client?.source === SourceType.EAP ? (
        <RNText style={styles.title}>{providerInfo.title}</RNText>
      ) : null}
      {descriptions.length === 1 ? (
        <RNText style={styles.description}>{providerInfo.description}</RNText>
      ) : (
        <View style={styles.descriptionContainer}>
          {descriptions.map((des, index) =>
            des ? (
              <View key={`${des}${index}`} style={styles.descriptionSubContainer}>
                <TickIcon />
                <RNText style={styles.multiDes}>{des}</RNText>
              </View>
            ) : null
          )}
        </View>
      )}
      <TouchableOpacity style={styles.visitButton} onPress={onHandleVisitWebSite} testID={'provider.visit.button'}>
        <WebSiteIcon />
        <RNText style={styles.visitWebSite}>{providerInfo.visitButton?.label}</RNText>
      </TouchableOpacity>
      {modelVisible || showError ? (
        <AlertModel
          modalVisible={modelVisible || showError}
          title={t('appointments.errors.title')}
          subTitle={t('appointments.errors.genericDescription')}
          primaryButtonTitle={t('appointments.errors.tryAgainButton')}
          onHandlePrimaryButton={handleTryAgain}
          isError={true}
        />
      ) : null}
    </View>
  );
};
