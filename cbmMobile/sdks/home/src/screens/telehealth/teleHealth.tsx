import { Selector } from '@sydney/motif-components';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';

import { BehavioralCareIcon, SearchCounselorsIcon } from '../../../../../shared/src/assets/icons/icons';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1, H2, H3 } from '../../../../../shared/src/components/text/text';
import { TeleHealthCard } from '../../components/teleHealth/teleHealthCard';
import { CardInfo } from '../../model/home';
import { teleHealthStyles } from './telehealth.styles';
import { useTeleHealth } from './useTelehealth';

export const Telehealth = () => {
  const {
    loading,
    onPressCardButton,
    radioItems,
    radioAltCurrentIndex,
    data,
    handleChange,
    modelVisible,
    showError,
    handleTryAgain,
  } = useTeleHealth();
  const styles = useMemo(() => teleHealthStyles(), []);

  const getIcon = (title?: string) => {
    switch (title) {
      case t('home.teleHealth.searchCounselors'):
        return <SearchCounselorsIcon />;
      default:
        return <BehavioralCareIcon />;
    }
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} />
      <ScrollView style={styles.mainContainer}>
        <ProgressLoader isVisible={loading} />
        <View style={styles.subContainer}>
          <H1 style={styles.headerStyle} testID="home.header">
            {t('providers.findCounselor')}
          </H1>
          <H3 style={styles.headerTextStyle} testID="home.headerText">
            {t('home.teleHealth.title')}
          </H3>
          <Selector
            styles={styles.selector}
            type="radio"
            items={radioItems}
            selectedIndex={radioAltCurrentIndex}
            onValueChange={handleChange}
          />
          <H2 style={styles.headerTextStyle}>{t('home.teleHealth.availableOptions')}</H2>
          {data.map((info: CardInfo) => (
            <TeleHealthCard
              key={info.title}
              title={info.title}
              description={info.description}
              icon={getIcon(info.title)}
              image={info.image}
              testID={'home.getStarted.button'}
              onPress={() => onPressCardButton(info)}
              buttonTitle={info.buttonText}
            />
          ))}
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
      </ScrollView>
    </>
  );
};
