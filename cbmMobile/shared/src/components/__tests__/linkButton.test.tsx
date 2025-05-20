import { render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
import { LinkButton } from '../linkButton/linkButton';

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    fontFamily: appFonts.medium,
    lineHeight: 22,
    color: appColors.lightPurple,
    textDecorationLine: 'underline',
    textDecorationColor: appColors.lightPurple,
  },
});
const linkButtonTestId = 'linkButton';

describe('Link Button test', () => {
  it('LinkBitton with style and textstyle', async () => {
    const { getByTestId } = render(
      <LinkButton onPress={jest.fn()} title={'Sign in'} testID={linkButtonTestId} textStyle={styles.link} />
    );
    expect(getByTestId(linkButtonTestId)).toBeDefined();
  });
});
