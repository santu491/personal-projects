import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { HeaderLeftView } from '../headerLeftView';

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn().mockReturnValue(true); // Update the mock to return true

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }),
}));

describe('HeaderLeftView', () => {
  it('should navigate back when pressed', () => {
    const { getByTestId } = render(<HeaderLeftView />);
    fireEvent.press(getByTestId('left-arrow-button'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should render the arrow button', () => {
    const { getByTestId } = render(<HeaderLeftView />);
    expect(getByTestId('left-arrow-button')).toBeTruthy();
  });
});
