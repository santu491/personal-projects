import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import { SearchIcon } from '../../../../../shared/src/assets/icons/icons';
import { AutoCompleteDropDown } from '../../../../../shared/src/components/autoCompleteDropdown/autoCompleteDropdown';
import { ErrorMessage } from '../../../../../shared/src/components/errorMessage/errorMessage';
import { appColors } from '../../../../../shared/src/context/appColors';
import { isAndroidTablet } from '../../../../../shared/src/utils/utils';
import { APP_IMAGES } from '../../constants/images';
import { inputStyles } from './clientSearch.styles';

interface ClientSearchProps {
  clientsList: TAutocompleteDropdownItem[] | undefined;
  isClientFocused: boolean;
  isLoading?: boolean;
  onBlurClientInput: () => void;
  onChangeClientName: (value: string) => void;
  onFocusClientInput: () => void;
  onPressClientName: (item: TAutocompleteDropdownItem) => void;
  searchError: string | undefined;
  searchText: string;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({
  searchText,
  clientsList,
  onPressClientName,
  onChangeClientName,
  isClientFocused,
  onFocusClientInput,
  onBlurClientInput,
  searchError,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <View style={inputStyles.container}>
        <View style={inputStyles.innerView} testID={'client.search.input'}>
          <Image source={APP_IMAGES.CLIENT_SELECTION} style={inputStyles.image} resizeMode="cover" />
          <View style={inputStyles.contentContainer}>
            <AutoCompleteDropDown
              loading={isLoading}
              inputTestId="client"
              label={t('client.searchTitle')}
              labelStyle={inputStyles.label}
              value={searchText}
              placeholder={t('client.searchPlaceholder')}
              leftIcon={<SearchIcon color={isClientFocused || searchText ? appColors.lightPurple : appColors.gray} />}
              onChangeText={onChangeClientName}
              data={clientsList}
              onPressDropDownItem={(item) => onPressClientName(item)}
              onFocusInput={onFocusClientInput}
              onBlur={onBlurClientInput}
              inputViewStyles={[
                inputStyles.textInputStyle,
                {
                  borderColor: searchError
                    ? appColors.darkRed
                    : isClientFocused || searchText
                      ? appColors.lightPurple
                      : appColors.lightGray,
                },
              ]}
              suggestionsListContainerStyle={Object.assign(
                {},
                inputStyles.suggestionsListContainer,
                isAndroidTablet() && inputStyles.tabSuggestionsListContainer,
                clientsList && clientsList.length > 0 && inputStyles.border
              )}
            />

            {searchError ? (
              <ErrorMessage
                containerStyles={inputStyles.errorViewContainer}
                labelStyles={inputStyles.errorViewLabel}
                title={searchError}
                testId={'client.search.error.message'}
              />
            ) : null}
          </View>
        </View>
      </View>
    </>
  );
};
