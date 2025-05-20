import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { ActionButton } from '../../../../../shared/src/components/actionButton';
import { H4 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { RightArrow } from '../../assets/icons/icons';
import { ClientDataDTO } from '../../model/client';
import { modelStyles } from './clientConfirmation.styles';

interface ClientConfirmationProps {
  client?: ClientDataDTO;
  clientName?: string;
  onPressContinueButton: () => void;
  onPressPreviousButton: () => void;
}

export const ClientConfirmation: React.FC<ClientConfirmationProps> = ({
  onPressContinueButton,
  onPressPreviousButton,
  client,
  clientName,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const isSVGImage = useMemo(() => {
    return client?.logoUrl && client.logoUrl.endsWith('.svg');
  }, [client?.logoUrl]);

  return (
    <>
      <View>
        <View style={modelStyles.headerContainer}>
          <Text style={modelStyles.bottomSheetTitleStyle} testID={'client.bottomsheet.model'}>
            {t('client.confirmationText')}
          </Text>
        </View>

        <View style={modelStyles.descriptionContainer}>
          {isSVGImage ? (
            <View style={modelStyles.svgImageStyle}>
              {client?.logoUrl ? <SvgUri width={'100%'} uri={encodeURI(client.logoUrl)} /> : null}
            </View>
          ) : (
            <>
              <Image
                source={{
                  uri: client?.logoUrl,
                }}
                style={modelStyles.imageStyle}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
              />
              {loading ? <ActivityIndicator style={modelStyles.loader} size="large" color={appColors.purple} /> : null}
            </>
          )}

          {clientName ? <H4 style={modelStyles.name}>{clientName}</H4> : null}
          <Text style={modelStyles.message}>{t('client.confirmationMessage')}</Text>

          <ActionButton
            onPress={onPressContinueButton}
            title={t('client.next')}
            style={modelStyles.actionButton}
            textStyle={modelStyles.actionButtonText}
            testID={'client.bottomsheet.continue'}
            icon={<RightArrow />}
          />
          <ActionButton
            onPress={onPressPreviousButton}
            title={t('client.goBackText')}
            style={modelStyles.previousButton}
            textStyle={modelStyles.previousButtonText}
            testID={'client.bottomsheet.previous'}
          />
        </View>
      </View>
    </>
  );
};
