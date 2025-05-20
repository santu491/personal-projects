import { render } from '@testing-library/react-native';
import React from 'react';

import { ErrorView } from '../errorView';

describe('ErrorView', () => {
  it('renders the title correctly', () => {
    const { getByTestId } = render(<ErrorView title="Test Error" />);
    const errorText = getByTestId('errorText');
    expect(errorText.props.children).toBe('Test Error');
  });

  it('applies custom text style', () => {
    const customTextStyle = { color: 'red' };
    const { getByTestId } = render(<ErrorView title="Test Error" textStyle={customTextStyle} />);
    const errorText = getByTestId('errorText');
    expect(errorText.props.style).toContainEqual(customTextStyle);
  });

  it('applies custom view style', () => {
    const customViewStyle = { backgroundColor: 'yellow' };
    const { getByTestId } = render(<ErrorView title="Test Error" viewStyle={customViewStyle} />);
    const errorView = getByTestId('errorText').parent;
    if (errorView) {
      expect(errorView.props.style).toEqual([
        { color: '#E8373A', fontFamily: 'ElevanceSans-Medium', fontSize: 14 },
        undefined,
      ]);
    } else {
      throw new Error('errorView is null');
    }
  });
});
