import { render } from '@testing-library/react-native';
import React from 'react';

import { ErrorMessage } from '../errorMessage/errorMessage';

describe('ErrorMessage component', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<ErrorMessage title="Test Error" testId="Test Error" />);
    expect(getByText('Test Error')).toBeTruthy();
  });

  it('displays the title correctly', () => {
    const testTitle = 'Test Error Message';
    const { getByText } = render(<ErrorMessage title={testTitle} testId={testTitle} />);
    expect(getByText(testTitle)).toBeTruthy();
  });
});
