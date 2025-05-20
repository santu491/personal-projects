import { render } from '@testing-library/react-native';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import { APP_CONTENT } from '../../../../src/config/appContent';
import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
import { FloatingButton } from '../floatingButton/floatingButton';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.lightPurple,
    borderColor: appColors.lightPurple,
    borderWidth: 2,
    borderRadius: 20,
    padding: 8,
    width: width * 0.5,
    alignItems: 'center',
  },
  text: {
    color: appColors.white,
    fontSize: 18,
    fontFamily: appFonts.regular,
  },
});

describe('FloatButton test test', () => {
  it('FloatButton with style and textstyle', async () => {
    const { getByTestId } = render(
      <FloatingButton
        title={APP_CONTENT.VERIFY_CODE.BUTTON_TEXT}
        testID={'providers.backToTop'}
        onPress={jest.fn()}
        style={styles.container}
        textStyle={styles.text}
      />
    );

    const actionButtonElement = getByTestId('providers.backToTop');
    expect(actionButtonElement).toBeTruthy();
  });
});
