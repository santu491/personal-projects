import React, { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import type { TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import { ErrorInfoIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { RNText } from '../text/text';
import { styles } from './autoCompleteDropdown.styles';

interface AutocompleteDropdownProps {
  closeOnBlur?: boolean;
  data?: TAutocompleteDropdownItem[];
  direction?: 'down' | 'up';
  errorMessage?: string;
  inputTestId: string;
  inputViewStyles?: StyleProp<ViewStyle>;
  isRequired?: boolean;
  label: string;
  labelStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  leftIconStyle?: StyleProp<ViewStyle>;
  loading?: boolean;
  onBlur?: () => void;
  onChangeText: (value: string) => void;
  onFocusInput?: () => void;
  onPressDropDownItem?: (item: TAutocompleteDropdownItem) => void;
  placeholder: string;
  showChevron?: boolean;
  showClear?: boolean;
  suggestionsListContainerStyle?: StyleProp<ViewStyle>;
  value: string;
}

const renderEmptyResult = () => {
  return <></>;
};

export const AutoCompleteDropDown = memo((props: AutocompleteDropdownProps) => {
  const {
    loading,
    data,
    onPressDropDownItem,
    onChangeText,
    leftIcon,
    inputViewStyles,
    onFocusInput,
    onBlur,
    value,
    placeholder,
    errorMessage,
    showClear = false,
    closeOnBlur = false,
    showChevron = false,
    leftIconStyle,
    direction = 'down',
    inputTestId,
    suggestionsListContainerStyle = {},
  } = props;

  return (
    <>
      <Text style={[styles.label, props.labelStyle]}>
        {props.label}
        {props.isRequired ? <Text style={styles.mandatory}>*</Text> : null}
      </Text>
      <View style={[styles.inputContainer, inputViewStyles]}>
        {leftIcon ? <View style={[styles.leftIcon, leftIconStyle]}>{leftIcon}</View> : null}

        <View style={styles.input}>
          <AutocompleteDropdown
            trimSearchText={true}
            direction={direction}
            dataSet={value.length === 0 ? [] : data}
            onSelectItem={onPressDropDownItem}
            onBlur={onBlur}
            onFocus={onFocusInput}
            showClear={showClear}
            debounce={600}
            closeOnBlur={closeOnBlur}
            useFilter={false}
            loading={loading}
            showChevron={showChevron}
            inputContainerStyle={styles.inputContainerStyle}
            textInputProps={{
              testID: `${inputTestId}.search.input`,
              value,
              onChangeText,
              placeholder,
              autoCorrect: false,
              autoCapitalize: 'none',
              placeholderTextColor: appColors.gray,
              style: { color: appColors.black },
            }}
            suggestionsListContainerStyle={Object.assign(
              {},
              styles.suggestionsListContainer,
              suggestionsListContainerStyle
            )}
            suggestionsListMaxHeight={400}
            suggestionsListTextStyle={styles.suggestionListText}
            EmptyResultComponent={renderEmptyResult()}
            renderItem={(item) => (
              <Text style={styles.suggestionListText} testID={item.title ?? ''}>
                {item.title}
              </Text>
            )}
          />
        </View>
      </View>
      {errorMessage ? (
        <View style={styles.errorView}>
          <ErrorInfoIcon />
          <RNText style={styles.errorMessage}>{props.errorMessage}</RNText>
        </View>
      ) : null}
    </>
  );
});
