import { Select } from '@sydney/motif-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import {
  BusinessContactIcon,
  Filter,
  GlobeIcon,
  MapIcon,
  SearchIcon,
  UpDownArrow,
} from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { AutoCompleteDropDown } from '../../../../../shared/src/components/autoCompleteDropdown/autoCompleteDropdown';
import { RNTextInput } from '../../../../../shared/src/components/textInput/textInput';
import { appColors } from '../../../../../shared/src/context/appColors';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';
import { isAndroidTablet } from '../../../../../shared/src/utils/utils';
import { APP_CONTENT } from '../../../../../src/config';
import { SourceType } from '../../../../../src/constants/constants';
import { ProviderLocationDetails } from '../../context/provider.sdkContext';
import { Pill } from '../pill/pill';
import { styles } from './providerSearch.styles';
import { useProviderSearch } from './useProviderSearch';

interface ProviderSearchProps {
  containerStyle?: StyleProp<ViewStyle>;
  hasSearchButton?: boolean;
  onPressFilterButton?: () => void;
  onPressMapButton?: () => void;
  onPressSortButton?: () => void;
  onSubmitCounselor?: (data: string) => Promise<void>;
  onSubmitLocation?: (data: ProviderLocationDetails) => Promise<void>;
  onSubmitPlan?: () => Promise<void>;
  onSubmitProductType?: () => Promise<void>;
}

export interface Location {
  city: string;
  state: string;
  text: string;
}

export const ProviderSearch = ({
  hasSearchButton,
  containerStyle,
  onSubmitLocation,
  onSubmitCounselor,
  onSubmitPlan,
  onPressMapButton,
  onPressFilterButton,
  onPressSortButton,
  onSubmitProductType,
}: ProviderSearchProps) => {
  const {
    getCounselorName,
    setCounselorName,
    searchedLocation,
    getLocations,
    onChangeLocation,
    onPressDropDownItem,
    onFocusCounselor,
    onFocusLocation,
    onBlurCounselor,
    onBlurLocation,
    enableSearch,
    handleSearch,
    onPressCounselorKeyBoardReturnType,
    locationErrorMessage,
    isCounselorHighlighted,
    isLocationHighlighted,
    loading,
    plans,
    selectedPlan,
    onPlanChange,
    onDropdownClose,
    productTypes,
    onProductTypeChange,
    selectedProductType,
    onCloseProductType,
    isProductTypeInValid,
    isPlanInValid,
    client,
    isLocationIconHighlighted,
    isCounselorIconHighlighted,
  } = useProviderSearch({ hasSearchButton });

  const { t } = useTranslation();
  return (
    <View style={[styles.container, containerStyle]}>
      {plans.length > 1 ? (
        <View style={styles.dropdownView}>
          <Text style={styles.label}>
            {t('providers.choosePlan')} <Text style={styles.mandatory}>*</Text>
          </Text>
          <View
            style={[
              styles.productTypeContainer,
              selectedPlan && hasSearchButton && { borderColor: appColors.lightPurple },
            ]}
          >
            <BusinessContactIcon color={selectedPlan ? appColors.lightPurple : appColors.gray} />
            <View style={styles.selectContainer}>
              <Select
                doneText={t('common.done')}
                items={plans}
                onClose={() => onDropdownClose(onSubmitPlan)}
                onValueChange={(value) => onPlanChange(value as string)}
                pickerTitle={selectedPlan as string}
                placeholder={t('providers.planPlaceHolder')}
                testID="providers.planSelect.planDropdown"
                value={selectedPlan}
                styles={{
                  input: {
                    ...textInputStyles.textInput,
                    input: {
                      ...textInputStyles.textInput?.input,
                      ...styles.input,
                    },
                    accessoryIcon: {
                      ...textInputStyles.textInput?.accessoryIcon,
                      ...styles.accessoryIcon,
                      ...(!selectedPlan ? styles.accessoryIconWithGray : {}),
                    },
                  },
                }}
              />
            </View>
          </View>

          {isPlanInValid ? <Text style={styles.errorMessage}>{t('providers.selectPlanError')}</Text> : null}
        </View>
      ) : null}

      {client?.source === SourceType.COMBINED || client?.originalSource === SourceType.COMBINED ? (
        <View style={styles.dropdownView}>
          <Text style={styles.label}>
            {t('providers.chooseProductType')} <Text style={styles.mandatory}>*</Text>
          </Text>
          <View
            style={[
              styles.productTypeContainer,
              selectedProductType && hasSearchButton && { borderColor: appColors.lightPurple },
            ]}
          >
            <BusinessContactIcon color={selectedProductType ? appColors.lightPurple : appColors.gray} />

            <View style={styles.selectContainer}>
              <Select
                doneText={t('common.done')}
                items={productTypes}
                onClose={() => onCloseProductType(onSubmitProductType)}
                onValueChange={(value) => onProductTypeChange(value as string)}
                pickerTitle={selectedProductType as string}
                placeholder={t('providers.productTypePlaceHolder')}
                testID="providers.productTypeSelect.productTypeDropdown"
                value={selectedProductType}
                styles={{
                  input: {
                    ...textInputStyles.textInput,
                    input: {
                      ...textInputStyles.textInput?.input,
                      ...styles.input,
                    },
                    accessoryIcon: {
                      ...textInputStyles.textInput?.accessoryIcon,
                      ...styles.accessoryIcon,
                      ...(!selectedProductType ? styles.accessoryIconWithGray : {}),
                    },
                  },
                }}
              />
            </View>
          </View>

          {isProductTypeInValid ? (
            <Text style={styles.errorMessage}>{t('providers.selectProductTypeError')}</Text>
          ) : null}
        </View>
      ) : null}

      <RNTextInput
        value={getCounselorName}
        label={t('providers.nameOrSpeciality')}
        placeholder={t('providers.search')}
        leftIcon={<SearchIcon color={isCounselorIconHighlighted ? appColors.lightPurple : appColors.gray} />}
        onChangeText={setCounselorName}
        onFocusInput={onFocusCounselor}
        onBlur={onBlurCounselor}
        inputViewStyles={[
          styles.inputView,
          {
            borderColor: isCounselorHighlighted ? appColors.lightPurple : appColors.lightGray,
          },
        ]}
        onSubmitEditing={() => (!hasSearchButton ? onPressCounselorKeyBoardReturnType(onSubmitCounselor) : {})}
      />

      <View style={styles.autoComplete}>
        <AutoCompleteDropDown
          value={searchedLocation}
          inputTestId="location"
          label={t('providers.location')}
          placeholder={t('providers.locationPlaceholder')}
          isRequired={true}
          leftIcon={<MapIcon color={isLocationIconHighlighted ? appColors.lightPurple : appColors.gray} />}
          loading={loading}
          onChangeText={onChangeLocation}
          data={getLocations}
          onPressDropDownItem={(item) => onPressDropDownItem(item, onSubmitLocation)}
          errorMessage={locationErrorMessage}
          inputViewStyles={[
            styles.inputView,
            {
              borderColor: isLocationHighlighted ? appColors.lightPurple : appColors.lightGray,
            },
          ]}
          onFocusInput={onFocusLocation}
          onBlur={onBlurLocation}
          suggestionsListContainerStyle={Object.assign({}, isAndroidTablet() && styles.tabSuggestionsListContainer)}
        />
      </View>

      {!hasSearchButton && (
        <View style={styles.pillContainer}>
          <Pill icon={<Filter />} label={t('providers.filterBy')} onPress={onPressFilterButton} />

          <View style={styles.sortView}>
            <Pill icon={<UpDownArrow />} label={t('providers.sortBy')} onPress={onPressSortButton} />
            <Pill
              icon={<GlobeIcon />}
              label={t('providers.map')}
              onPress={onPressMapButton}
              buttonStyle={styles.mapButton}
              labelStyle={styles.mapIcon}
            />
          </View>
        </View>
      )}

      {hasSearchButton ? (
        <ActionButton
          onPress={handleSearch}
          title={APP_CONTENT.PROVIDERS.SEARCH}
          style={[styles.actionButton, !enableSearch && styles.buttonDisable]}
          textStyle={[styles.actionButtonText, !enableSearch && styles.buttonTextDisable]}
          testID={'find.search.button'}
          disabled={!enableSearch}
        />
      ) : null}
    </View>
  );
};
