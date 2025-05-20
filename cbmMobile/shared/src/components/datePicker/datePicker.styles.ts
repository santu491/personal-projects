import { StyleSheet } from 'react-native';

import { fieldStyles } from '../../overrideStyles/field.styles';
import { textInputStyles } from '../../overrideStyles/textInput.styles';

export const datePickerStyles = () => {
  return {
    ...textInputStyles,
    ...fieldStyles,
    ...StyleSheet.create({
      icon: { position: 'absolute', right: 10, top: 35 },
    }),
  };
};
