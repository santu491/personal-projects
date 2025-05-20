import { TextInput } from '@sydney/motif-components';
import { ComponentProps } from 'react';

import { textInputStyles } from './textInput.styles';

export const multiLineTextInputStyles: {
  multiLineTextInput: ComponentProps<typeof TextInput>['styles'];
} = {
  multiLineTextInput: {
    ...textInputStyles.textInput,
    input: {
      ...textInputStyles.textInput?.input,
      height: 115,
    },
  },
};
