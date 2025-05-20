import { render } from '@testing-library/react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

import { appColors } from '../../context/appColors';
import { appFonts } from '../../context/appFonts';
import { TitleSubtitleView } from '../titleSubtitleView';

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontFamily: appFonts.bold,
    textAlign: 'left',
    color: appColors.mediumGray,
  },
});

describe('TitleSubtitleView render', () => {
  it('renders correctly with title and subtitle', () => {
    const { getByTestId } = render(<TitleSubtitleView title="Test Title" textStyle={styles.textStyle} />);

    expect(getByTestId('title-subtitle-view-title')).toBeTruthy();
  });
});
