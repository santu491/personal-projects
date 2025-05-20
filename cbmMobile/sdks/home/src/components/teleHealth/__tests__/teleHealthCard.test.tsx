import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import { TeleHealthCard } from '../teleHealthCard';

jest.mock('i18next', () => ({
  t: (key: string) => key,
}));

describe('TeleHealthCard', () => {
  const mockOnPress = jest.fn();

  it('should render correctly with all props', () => {
    const { getByText, getByTestId } = render(
      <TeleHealthCard
        title="Test Title"
        description="Test Description"
        buttonTitle="Test Button"
        onPress={mockOnPress}
        testID="test-button"
        image="https://example.com/image.png"
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Test Button')).toBeTruthy();
    expect(getByTestId('test-button')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByTestId } = render(
      <TeleHealthCard
        title="Test Title"
        description="Test Description"
        buttonTitle="Test Button"
        onPress={mockOnPress}
        testID="test-button"
      />
    );

    fireEvent.press(getByTestId('test-button'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should render icon if image is not provided', () => {
    const { getByTestId } = render(
      <TeleHealthCard
        title="Test Title"
        description="Test Description"
        buttonTitle="Test Button"
        onPress={mockOnPress}
        testID="test-button"
        icon={<View testID="test-icon" />}
      />
    );

    expect(getByTestId('test-icon')).toBeTruthy();
  });

  it('should not render description if not provided', () => {
    const { queryByText } = render(
      <TeleHealthCard title="Test Title" buttonTitle="Test Button" onPress={mockOnPress} testID="test-button" />
    );

    expect(queryByText('Test Description')).toBeNull();
  });

  it('should not render button if buttonTitle is not provided', () => {
    const { queryByTestId } = render(
      <TeleHealthCard title="Test Title" description="Test Description" onPress={mockOnPress} />
    );

    expect(queryByTestId('test-button')).toBeNull();
  });
});
