import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { GetStarted } from '../getStarted/getStarted';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('ClintGetStart', () => {
  const mockUseTranslation = useTranslation as jest.Mock;
  const onPressPrimaryButton = jest.fn();
  const onPressSecondaryButton = jest.fn();
  const onPressLink = jest.fn();

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    });
  });

  const renderComponent = () => {
    return (
      <GetStarted
        onPressPrimaryButton={onPressPrimaryButton}
        onPressSecondaryButton={onPressSecondaryButton}
        onPressLink={onPressLink}
      />
    );
  };

  it('renders confirmation text', () => {
    const { getByTestId } = render(renderComponent());

    expect(getByTestId('client.bottomSheet.model').props.children).toBe('client.getStart');
  });

  it('renders description text', () => {
    const { getByText } = render(renderComponent());

    expect(getByText('client.getStartDescription')).toBeTruthy();
  });

  it('calls onPressPrimaryButton when primary button is pressed', () => {
    const { getByTestId } = render(renderComponent());

    fireEvent.press(getByTestId('client.bottomSheet.createAccount'));
    expect(onPressPrimaryButton).toHaveBeenCalled();
  });

  it('calls onPressSecondaryButton when secondary button is pressed', () => {
    const { getByTestId } = render(renderComponent());

    fireEvent.press(getByTestId('client.bottomSheet.signIn'));
    expect(onPressSecondaryButton).toHaveBeenCalled();
  });

  it('calls onPressLink when link is pressed', () => {
    const { getByText } = render(renderComponent());

    fireEvent.press(getByText('client.continueAsGuest'));
    expect(onPressLink).toHaveBeenCalled();
  });
});
