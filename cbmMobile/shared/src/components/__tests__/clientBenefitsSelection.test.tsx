import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ClientBenefitsSelection } from '../clientBenefitsSelection/clientBenefitsSelection';

describe('ClientBenefitsSelection', () => {
  const mockOnPressPrimaryButton = jest.fn();
  const mockOnPressSecondaryButton = jest.fn();
  const mockOnPressLink = jest.fn();

  const renderComponent = () =>
    render(
      <ClientBenefitsSelection
        onPressPrimaryButton={mockOnPressPrimaryButton}
        onPressSecondaryButton={mockOnPressSecondaryButton}
        onPressLink={mockOnPressLink}
      />
    );

  it('renders the component correctly', () => {
    const { getByTestId, getByText } = renderComponent();

    expect(getByTestId('client.bottomSheet.model')).toBeTruthy();
    expect(getByText('client.benefitMhsudTitle')).toBeTruthy();
    expect(getByText('client.benefitEapTitle')).toBeTruthy();
    expect(getByText('client.benefitQuestion')).toBeTruthy();
    expect(getByText('client.contactAdministrator')).toBeTruthy();
  });

  it('calls onPressPrimaryButton when the primary button is pressed', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('client.benefitMhsudTitle'));
    expect(mockOnPressPrimaryButton).toHaveBeenCalled();
  });

  it('calls onPressSecondaryButton when the secondary button is pressed', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('client.benefitEapTitle'));
    expect(mockOnPressSecondaryButton).toHaveBeenCalled();
  });

  it('calls onPressLink when the link is pressed', () => {
    const { getByText } = renderComponent();

    fireEvent.press(getByText('client.contactAdministrator'));
    expect(mockOnPressLink).toHaveBeenCalled();
  });
});
