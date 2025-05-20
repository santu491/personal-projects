import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ExploreMoreButton, ExploreMoreButtonProps } from '../exploreMoreButton';

describe('ExploreMoreButton', () => {
  const props: ExploreMoreButtonProps = {
    onPressButton: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText } = render(<ExploreMoreButton {...props} />);
    expect(getByText('home.exploreMore')).toBeTruthy();
  });

  it('calls onPressButton when pressed', () => {
    const { getByText } = render(<ExploreMoreButton {...props} />);
    fireEvent.press(getByText('home.exploreMore'));
    expect(props.onPressButton).toHaveBeenCalled();
  });
});
