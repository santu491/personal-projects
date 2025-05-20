import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CardResourceExclusiveBenefits } from '../components/cardResourceExclusiveBenefits';

describe('CardResourceExclusiveBenefits', () => {
  const exclusiveBenefits = {
    title: 'Exclusive Benefits',
    data: [
      { id: '1', title: 'Benefit 1', description: 'Description 1' },
      { id: '2', title: 'Benefit 2', description: 'Description 2' },
    ],
  };

  it('renders exclusive benefits title correctly', () => {
    const { getByText } = render(<CardResourceExclusiveBenefits exclusiveBenefits={exclusiveBenefits} />);

    expect(getByText('Exclusive Benefits')).toBeTruthy();
  });

  it('renders list of exclusive benefits correctly', () => {
    const { getByText } = render(<CardResourceExclusiveBenefits exclusiveBenefits={exclusiveBenefits} />);

    expect(getByText('Benefit 1')).toBeTruthy();
    expect(getByText('Benefit 2')).toBeTruthy();
  });

  it('calls onPressBenefit when a benefit is pressed', () => {
    const { getByText } = render(<CardResourceExclusiveBenefits exclusiveBenefits={exclusiveBenefits} />);

    fireEvent.press(getByText('Benefit 1'));
  });

  it('does not render anything if exclusiveBenefits is undefined', () => {
    const { queryByText } = render(<CardResourceExclusiveBenefits exclusiveBenefits={undefined} />);

    expect(queryByText('Exclusive Benefits')).toBeNull();
    expect(queryByText('Benefit 1')).toBeNull();
    expect(queryByText('Benefit 2')).toBeNull();
  });
});
