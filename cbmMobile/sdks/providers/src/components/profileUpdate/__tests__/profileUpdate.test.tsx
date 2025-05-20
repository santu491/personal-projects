import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ProfileUpdate } from '../profileUpdate';

const profileInfo = { title: 'Profile Title', providerName: 'Provider Name', description: 'This is a description' };

describe('ProfileUpdate Component', () => {
  it('should render the title and provider name correctly', () => {
    const { getByText } = render(
      <ProfileUpdate profileInfo={profileInfo} closeModal={jest.fn()} handleProfileSubmit={jest.fn()} />
    );
    expect(getByText('Profile Title')).toBeTruthy();
    expect(getByText('Provider Name')).toBeTruthy();
  });

  it('should render the description if provided', () => {
    const { getByText } = render(
      <ProfileUpdate profileInfo={profileInfo} closeModal={jest.fn()} handleProfileSubmit={jest.fn()} />
    );

    expect(getByText('This is a description')).toBeTruthy();
  });

  it('should call handleProfileSubmit on submit button press', () => {
    const handleProfileSubmit = jest.fn();
    const { getByTestId } = render(<ProfileUpdate closeModal={jest.fn()} handleProfileSubmit={handleProfileSubmit} />);

    fireEvent.press(getByTestId('provider.profileUpdate.submit'));
    expect(handleProfileSubmit).toHaveBeenCalled();
  });
});
