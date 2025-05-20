import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { HomeMockContextWrapper } from '../../../__mocks__/homeMockContextWrapper';
import { Landing } from '../landing';
import { useLanding } from '../useLanding';

jest.mock('../useLanding');

describe('Entry', () => {
  const mockUseLanding = useLanding as jest.Mock;

  beforeEach(() => {
    mockUseLanding.mockReturnValue({
      onPressContinueAsGuest: jest.fn(),
      navigateToLogin: jest.fn(),
      navigateToSignUp: jest.fn(),
    });
  });

  const renderEntry = () =>
    render(
      <HomeMockContextWrapper>
        <Landing />
      </HomeMockContextWrapper>
    );

  it('renders correctly', () => {
    const { getByText } = renderEntry();
    expect(getByText('client.getStart')).toBeTruthy();
  });

  it('calls navigateToSignUp when primary button is pressed', () => {
    const { getByText } = renderEntry();
    const { navigateToSignUp } = mockUseLanding();

    fireEvent.press(getByText('client.createAccount'));
    expect(navigateToSignUp).toHaveBeenCalled();
  });

  it('calls navigateToLogin when secondary button is pressed', () => {
    const { getByText } = renderEntry();
    const { navigateToLogin } = mockUseLanding();

    fireEvent.press(getByText('client.signIn'));
    expect(navigateToLogin).toHaveBeenCalled();
  });

  it('calls onPressContinueAsGuest when link is pressed', () => {
    const { getByText } = renderEntry();
    const { onPressContinueAsGuest } = mockUseLanding();

    fireEvent.press(getByText('client.continueAsGuest'));
    expect(onPressContinueAsGuest).toHaveBeenCalled();
  });
});
