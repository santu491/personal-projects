import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ProviderSorter } from '../providerSorter';

describe('ProviderSorter', () => {
  const mockDataArray = [
    { label: 'Item 1', id: 1 },
    { label: 'Item 2', id: 2 },
  ];
  const mockSelectedInfo = { label: 'Item 1', id: 1 };
  const mockOnPress = jest.fn();

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <ProviderSorter
        title="Test Title"
        dataArray={mockDataArray}
        selectedInfo={mockSelectedInfo}
        onPress={mockOnPress}
      />
    );

    // Check if the correct elements are displayed
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByTestId('test-sortby-providers')).toBeTruthy();
  });

  it('calls the onPress callback with the correct item when an item is pressed', () => {
    const { getByTestId } = render(
      <ProviderSorter
        title="Test Title"
        dataArray={mockDataArray}
        selectedInfo={mockSelectedInfo}
        onPress={mockOnPress}
      />
    );

    fireEvent.press(getByTestId('provider.Item 1'));
    expect(mockOnPress).toHaveBeenCalledWith(mockDataArray[0]);

    fireEvent.press(getByTestId('provider.Item 2'));
    expect(mockOnPress).toHaveBeenCalledWith(mockDataArray[1]);
  });
});
