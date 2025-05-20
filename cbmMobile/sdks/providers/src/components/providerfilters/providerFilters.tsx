/* eslint-disable react/no-multi-comp */
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutAnimation,
  SafeAreaView,
  SectionList,
  StyleProp,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';

import {
  CloseIcon,
  DarkDownArrow,
  DarkerCheckBox,
  DarkUpArrowIcon,
  LighterUnCheckBox,
} from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { H1, H3, RNText } from '../../../../../shared/src/components/text/text';
import { capitalizeFirstLetter } from '../../../../../shared/src/utils/utils';
import { isAndroid } from '../../../../../src/util/commonUtils';
import { FilterOption, ProviderFilter } from '../../model/providerFilter';
import { styles } from './providerFilters.styles';

export interface Distance {
  id: number;
  label: string;
  query: string;
}

export interface ProviderFilterProps {
  distanceList: Distance[];
  filtersList: ProviderFilter[];
  isResultEnabled?: boolean;
  onCloseModal: () => void;
  onPressDistanceInfo: (data: Distance) => void;
  onPressFilterOption: (item: FilterOption, section: ProviderFilter) => void;
  onPressFilterSection: (attribute: string) => void;
  onPressResults: () => void;
  resultButtonStyle?: StyleProp<ViewStyle>;
  selectedDistanceLabel: string;
  submitButtonTitle: string;
}

export interface FilterSectionHeaderProps {
  onPress: (attribute: string) => void;
  section: ProviderFilter;
}

export interface FilterOptionButtonProps {
  onPressFilterItem: (item: FilterOption, section: ProviderFilter) => void;
  option: FilterOption;
  section: ProviderFilter;
}

export interface ProviderFilterHeaderProps {
  onCloseModal?: () => void;
  title: string;
}

if (isAndroid() && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FilterHeader = memo(({ title, onCloseModal }: ProviderFilterHeaderProps) => {
  return (
    <View style={styles.headerView}>
      <TouchableOpacity
        onPress={onCloseModal}
        accessibilityRole="button"
        accessibilityLabel={'close'}
        testID={'close-button'}
      >
        <CloseIcon />
      </TouchableOpacity>
      <View style={styles.headerTitleView}>
        <H1 style={styles.headerTitle}>{title}</H1>
      </View>
      <View style={styles.emptySpace} />
    </View>
  );
});

const DistanceSort = memo(
  ({
    distanceList,
    onPress,
    selectedLabel,
  }: {
    distanceList: Distance[];
    onPress: (data: Distance) => void;
    selectedLabel: string;
  }) => {
    const { t } = useTranslation();
    return (
      <View style={styles.distanceContainer}>
        <H3>{t('providers.distanceTitle')}</H3>
        <View style={styles.distanceBoxContainer}>
          {distanceList.map((distance, index) => (
            <TouchableOpacity
              key={distance.id}
              onPress={() => onPress(distance)}
              testID={`provider.filters.${distance.label}`}
              style={[styles.distanceView, selectedLabel === distance.label && styles.selectedDistanceLabelBox]}
            >
              <View style={[styles.distanceLabelBox, index === 0 && styles.distanceLabelFirstBox]}>
                <RNText style={styles.distanceLabel}>{distance.label}</RNText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
);

const FilterSectionHeader = memo(({ section, onPress }: FilterSectionHeaderProps) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onPress(section.attribute);
        }}
        activeOpacity={1}
        testID={`provider.filters.${section.name}`}
      >
        <View style={styles.hr} />
        <View style={styles.filterTitle}>
          <H3>{section.name}</H3>
          {section.isOpened ? (
            <View style={styles.upArrowIcon}>
              <DarkUpArrowIcon />
            </View>
          ) : (
            <DarkDownArrow />
          )}
        </View>
      </TouchableOpacity>
    </>
  );
});

const FilterOptionButton = memo(({ option, section, onPressFilterItem }: FilterOptionButtonProps) => {
  return (
    <>
      <>
        {!section.name && <View style={[styles.hr, styles.hrMargin]} />}
        <TouchableOpacity
          onPress={() => onPressFilterItem(option, section)}
          testID={`provider.filters.${option.title}`}
          style={styles.filterOptionButton}
        >
          <View style={styles.filterOptionView}>
            {option.isSelected ? <DarkerCheckBox /> : <LighterUnCheckBox />}
            <RNText style={styles.filterOptionLabel}>{capitalizeFirstLetter(option.title)}</RNText>
          </View>
          <RNText style={[styles.filterOptionLabel, styles.countLabel]}>{option.count}</RNText>
        </TouchableOpacity>
      </>
    </>
  );
});

export const ProviderFilters = ({
  filtersList,
  isResultEnabled,
  onCloseModal,
  onPressFilterOption,
  onPressFilterSection,
  onPressResults,
  submitButtonTitle,
  resultButtonStyle,
  distanceList,
  onPressDistanceInfo,
  selectedDistanceLabel,
}: ProviderFilterProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.modal}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeAreaView}>
          <FilterHeader onCloseModal={onCloseModal} title={t('providers.filtersTitle')} />
          <DistanceSort
            distanceList={distanceList}
            onPress={onPressDistanceInfo}
            selectedLabel={selectedDistanceLabel}
          />
          {filtersList.length > 0 && (
            <SectionList
              sections={filtersList}
              renderSectionHeader={({ section }) => (
                <>{section.name ? <FilterSectionHeader section={section} onPress={onPressFilterSection} /> : null}</>
              )}
              renderItem={({ item, section, index }) => {
                return (
                  <>
                    {section.isOpened || !section.name ? (
                      <>
                        <FilterOptionButton option={item} section={section} onPressFilterItem={onPressFilterOption} />
                        {section.data.length - 1 === index && <View style={styles.space} />}
                      </>
                    ) : null}
                  </>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          )}

          <View style={[styles.resultsView, isAndroid() ? styles.resultViewPadding : styles.iosResultPadding]}>
            <ActionButton
              title={submitButtonTitle}
              onPress={onPressResults}
              style={[styles.resultsButton, !isResultEnabled && styles.resultButtonView, resultButtonStyle]}
              textStyle={styles.resultsTitle}
              testID="provider.filters.showResults"
              disabled={!isResultEnabled}
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};
