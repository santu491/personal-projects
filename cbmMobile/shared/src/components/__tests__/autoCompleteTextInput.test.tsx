import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AutocompleteTextInput } from '../autoCompleteTextInput/autoCompleteTextInput';

describe('AutocompleteTextInput', () => {
  const mockData = [{ text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' }];

  it('should render text input', () => {
    const { getByTestId } = render(<AutocompleteTextInput />);
    expect(getByTestId('auto-complete-text-input')).toBeTruthy();
  });

  it('should display dropdown items when input has value and data is provided', () => {
    const { getByText } = render(<AutocompleteTextInput value="Item" data={mockData} />);
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  it('should call onPressDropDownItem when an item is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <AutocompleteTextInput value="Item" data={mockData} onPressDropDownItem={mockOnPress} />
    );

    fireEvent.press(getByText('Item 1'));
    expect(mockOnPress).toHaveBeenCalledWith({ text: 'Item 1' });
  });

  it('should not display dropdown items when input value is empty', () => {
    const { queryByText } = render(<AutocompleteTextInput data={mockData} />);
    expect(queryByText('Item 1')).toBeNull();
    expect(queryByText('Item 2')).toBeNull();
    expect(queryByText('Item 3')).toBeNull();
  });

  it('should not display dropdown items when data is empty', () => {
    const { queryByText } = render(<AutocompleteTextInput value="Item" data={[]} />);
    expect(queryByText('Item 1')).toBeNull();
    expect(queryByText('Item 2')).toBeNull();
    expect(queryByText('Item 3')).toBeNull();
  });
});
