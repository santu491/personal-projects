import { Drawer } from '@sydney/motif-components';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RenderHTML from 'react-native-render-html';

import { AngleDown } from '../../../../../shared/src/assets/icons/icons';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { RNText } from '../../../../../shared/src/components/text/text';
import { TitleHeader } from '../../../../../shared/src/components/titleHeader/titleHeader';
import { isAndroidTablet } from '../../../../../shared/src/utils/utils';
import { ProviderSearch } from '../../components/providerSearch/providerSearch';
import { findCounselorStyles } from './findCounselor.styles';
import { useFindCounselor } from './useFindCounselor';

export const CounselorScreen = () => {
  const { isDisclaimerVisisble, handleDisclaimerClick, closeDisclaimerModal, disclaimerContent } = useFindCounselor();
  const { t } = useTranslation();
  const styles = useMemo(() => findCounselorStyles(), []);

  return (
    <>
      <MainHeaderComponent leftArrow={false} />

      <KeyboardAwareScrollView
        style={styles.mainContainer}
        extraScrollHeight={isAndroidTablet() ? 140 : 150}
        enableOnAndroid={true}
      >
        <TitleHeader title={t('providers.findAProvider')} />

        <View style={styles.container}>
          <View style={styles.providerSearch}>
            <ProviderSearch hasSearchButton={true} />
          </View>
          <TouchableOpacity style={styles.disclaimerContainer} onPress={handleDisclaimerClick}>
            <RNText style={styles.disclaimerText}>{t('providers.disclaimer')}</RNText>
            <AngleDown height={12} width={12} />
          </TouchableOpacity>
          {isDisclaimerVisisble ? (
            <Drawer
              title={t('providers.disclaimer')}
              styles={styles.drawer}
              visible={true}
              onRequestClose={closeDisclaimerModal}
              children={<ScrollView>{disclaimerContent ? <RenderHTML source={disclaimerContent} /> : null}</ScrollView>}
            />
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};
