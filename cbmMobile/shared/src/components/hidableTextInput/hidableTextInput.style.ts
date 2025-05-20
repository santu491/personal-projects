import { StyleSheet } from 'react-native';

import { textInputStyles } from '../../overrideStyles/textInput.styles';

export const hidableTextInputStyles = () => {
  return {
    ...textInputStyles,
    ...StyleSheet.create({
      icon: {
        width: 20,
        height: 20,
      },
    }),
  };
};
