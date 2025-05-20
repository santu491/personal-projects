import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import { RNTextInput, RNTextInputProps } from '../textInput/textInput';
import { styles } from './autoCompleteTextInput.styles';

interface AutocompleteTextInputProps {
  data?: Item[];
  onPressDropDownItem?: (item: Item) => void;
}

interface Item {
  text: string;
}

type Props = RNTextInputProps & AutocompleteTextInputProps;

export const AutocompleteTextInput = (props: Props) => {
  const { data, onPressDropDownItem, ...textProps } = props;
  return (
    <>
      <View style={styles.textInput}>
        <RNTextInput testId={props.testId ?? 'auto-complete-text-input'} {...textProps} />
      </View>
      {(props.value?.length ?? 0) > 0 && (props.data?.length ?? 0) > 0 && (
        <FlatList
          data={data}
          keyboardShouldPersistTaps="handled"
          style={styles.listView}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => onPressDropDownItem && onPressDropDownItem(item)}
              accessibilityRole="button"
              accessibilityLabel={item.text}
              testID={item.text}
            >
              <Text style={styles.dropdownLabel}>{item.text}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.text}
        />
      )}
    </>
  );
};
