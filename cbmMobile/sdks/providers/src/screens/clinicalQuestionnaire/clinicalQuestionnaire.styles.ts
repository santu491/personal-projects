import { StyleSheet } from 'react-native';

import { fieldStyles } from '../../../../../shared/src/overrideStyles/field.styles';
import { multiLineTextInputStyles } from '../../../../../shared/src/overrideStyles/multiLineTextInput.styles';
import { textInputStyles } from '../../../../../shared/src/overrideStyles/textInput.styles';
import { appColors } from '../../../../../src/config';

export const clinicalQuestionnaireStyles = () => {
  return {
    ...fieldStyles,
    ...textInputStyles,
    ...multiLineTextInputStyles,
    ...StyleSheet.create({
      container: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      scrollView: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      inputContainer: {
        paddingTop: 25,
        paddingHorizontal: 15,
      },
      continue: {
        width: '100%',
        paddingHorizontal: 15,
        marginBottom: 20,
      },
    }),
  };
};
