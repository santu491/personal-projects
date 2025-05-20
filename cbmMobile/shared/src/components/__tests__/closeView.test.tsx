import { useNavigation } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CloseView } from '../closeView';

// this should be removed
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

describe('CloseView', () => {
  it('calls onPressCloseIcon when provided', () => {
    const onPressCloseIcon = jest.fn();
    const { getByTestId } = render(<CloseView onPressCloseIcon={onPressCloseIcon} />);
    const button = getByTestId('auth.header.close.button');
    fireEvent.press(button);
    expect(onPressCloseIcon).toHaveBeenCalled();
  });

  it('navigates back when onPressCloseIcon is not provided and navigation can go back', () => {
    const goBack = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ canGoBack: () => true, goBack });
    const { getByTestId } = render(<CloseView />);
    const button = getByTestId('auth.header.close.button');
    fireEvent.press(button);
    expect(goBack).toHaveBeenCalled();
  });

  it('does nothing when onPressCloseIcon is not provided and navigation cannot go back', () => {
    const goBack = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({ canGoBack: () => false, goBack });
    const { getByTestId } = render(<CloseView />);
    const button = getByTestId('auth.header.close.button');
    fireEvent.press(button);
    expect(goBack).not.toHaveBeenCalled();
  });
});
