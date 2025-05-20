import { render } from '@testing-library/react-native';
import React from 'react';

import { appColors } from '../../context/appColors';
import { RequiredView } from '../requiredView';

describe('RequiredView', () => {
  it('renders correctly with the correct color', () => {
    const { getByText } = render(<RequiredView />);
    const requiredText = getByText(' *');
    expect(requiredText).toBeTruthy();
    expect(requiredText.props.style).toMatchObject([
      {
        color: '#231E33',
        fontFamily: 'ElevanceSans-Medium',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
      },
      { color: appColors.red },
    ]);
  });
});
