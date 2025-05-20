import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { MainHeaderComponent } from '../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { H1, H4 } from '../../../../shared/src/components/text/text';
import { RightArrowIcon } from '../../../auth/src/assets/icons/authIcons';
import { Title } from '../../../home/src/components/title/title';
import { Menu } from '../../../menu/src/models/menu';
import { useWellbeing } from './useWellbeing';
import { wellbeingStyles as styles } from './wellbeing.styles';

export const Wellbeing = () => {
  const { t } = useTranslation();
  const { welllbeingData, navigateToWellbeingPages } = useWellbeing();
  return (
    <>
      <MainHeaderComponent leftArrow={false} />
      <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
          <Title
            title={t('wellbeing.titleHeader')}
            subTitle={t('wellbeing.titleSubHeader')}
            headerText={t('wellbeing.wellBeingTitle')}
          />
        </View>
        <View style={styles.itemSeparator} />
        {welllbeingData.map((info: Menu) =>
          info.action && info.action.screenName ? (
            <TouchableOpacity
              key={info.label}
              style={styles.cardsView}
              onPress={() => navigateToWellbeingPages(info.action?.screenName)}
            >
              <H1 style={styles.label} testID="wellbeing.label">
                {info.label}
              </H1>
              <Image source={info.action.imagePath} style={styles.imageStyle} />
              <View style={styles.viewAll}>
                <H4 style={styles.viewAllText} testID="wellbeing.viewAll">
                  {' '}
                  {t('wellbeing.viewAll')}
                </H4>
                <RightArrowIcon />
              </View>
              <View style={styles.itemSeparator} />
            </TouchableOpacity>
          ) : null
        )}
      </ScrollView>
    </>
  );
};
