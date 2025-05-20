import { render } from '@testing-library/react-native';
import React from 'react';

import { GetHelpCases } from '../../../models/cardResource';
import { CardResourceGetHelpCases } from '../components/cardResourceGetHelpCases';

describe('CardResourceGetHelpCases', () => {
  const getHelpCases: GetHelpCases = {
    title: 'Get Help Cases',
    data: [
      { image: 'https://example.com/image1.png', title: 'Case 1' },
      { image: 'https://example.com/image2.png', title: 'Case 2' },
    ],
  };

  it('renders get help cases title correctly', () => {
    const { getByText } = render(<CardResourceGetHelpCases getHelpCases={getHelpCases} />);

    expect(getByText('Get Help Cases')).toBeTruthy();
  });

  it('renders list of get help cases correctly', () => {
    const { getByText } = render(<CardResourceGetHelpCases getHelpCases={getHelpCases} />);

    expect(getByText('Case 1')).toBeTruthy();
    expect(getByText('Case 2')).toBeTruthy();
  });

  it('does not render anything if getHelpCases is undefined', () => {
    const { queryByText } = render(<CardResourceGetHelpCases getHelpCases={undefined} />);

    expect(queryByText('Get Help Cases')).toBeNull();
    expect(queryByText('Case 1')).toBeNull();
    expect(queryByText('Case 2')).toBeNull();
  });
});
