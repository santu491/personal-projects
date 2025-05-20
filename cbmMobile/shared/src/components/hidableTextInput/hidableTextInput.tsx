import { Input, InputProps, InputRef } from '@sydney/motif-components';
import React, { useMemo, useState } from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';

import { APP_IMAGES } from '../../context/appImages';
import { hidableTextInputStyles } from './hidableTextInput.style';

export interface HidableTextInputProps extends InputProps {
  accessibilityLabel?: string;
  accessibilityLabelHide: string;
  accessibilityLabelShow: string;
  hideKeyboardSuggestions?: boolean;
  initialShowValue?: boolean;
}

export const HidableTextInput = React.forwardRef(
  (
    {
      accessibilityLabelHide,
      accessibilityLabelShow,
      hideKeyboardSuggestions = false,
      initialShowValue = false,
      inverted = false,
      ...props
    }: HidableTextInputProps,
    ref: React.ForwardedRef<InputRef>
  ) => {
    const [show, setShow] = useState(initialShowValue);
    const styles = useMemo(() => hidableTextInputStyles(), []);

    return (
      <Input
        styles={styles.textInput}
        accessoryEnd={
          <TouchableOpacity
            accessibilityLabel={show ? accessibilityLabelShow : accessibilityLabelHide}
            accessibilityRole="button"
            accessibilityState={{ checked: show }}
            onPress={() => setShow((prevState) => !prevState)}
          >
            <Image
              source={show ? APP_IMAGES.SHOW_HIDE : APP_IMAGES.HIDE}
              testID={show ? 'hidableTextInput.show' : 'hidableTextInput.hide'}
              style={styles.icon}
            />
          </TouchableOpacity>
        }
        inverted={inverted}
        keyboardType={Platform.OS === 'android' && hideKeyboardSuggestions && show ? 'visible-password' : 'default'}
        ref={ref}
        secureTextEntry={!show}
        {...props}
      />
    );
  }
);
