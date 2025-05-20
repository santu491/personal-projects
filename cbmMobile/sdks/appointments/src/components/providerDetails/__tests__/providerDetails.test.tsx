import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ProviderDetailProps, ProviderDetails } from '../providerDetails';

describe('ProviderDetails', () => {
  const mockProviderDetail: ProviderDetailProps = {
    listData: [
      { label: 'Label 1', value: 'Value 1' },
      { label: 'Label 2', value: 'Value 2' },
    ],
    title: 'Provider Details',
    onHandleCancel: jest.fn(),
    onHandleConfirm: jest.fn(),
    onHandleViewOtherRequests: jest.fn(),
    providerId: '123',
    status: 'ACCEPTED',
    hasCancel: true,
    hasConfirm: true,
    viewOtherRequests: true,
  };

  it('renders the component correctly', () => {
    const { getByText } = render(<ProviderDetails {...mockProviderDetail} />);
    expect(getByText('Provider Details')).toBeTruthy();
    expect(getByText('Label 1')).toBeTruthy();
    expect(getByText('Value 1')).toBeTruthy();
    expect(getByText('Label 2')).toBeTruthy();
    expect(getByText('Value 2')).toBeTruthy();
  });

  it('calls onHandleCancel when cancel button is pressed', () => {
    const { getByTestId } = render(<ProviderDetails {...mockProviderDetail} />);
    const cancelButton = getByTestId('appointments.history.cancel');
    fireEvent.press(cancelButton);
    expect(mockProviderDetail.onHandleCancel).toHaveBeenCalledWith('123');
  });

  it('calls onHandleConfirm when confirm button is pressed', () => {
    const { getByTestId } = render(<ProviderDetails {...mockProviderDetail} />);
    const confirmButton = getByTestId('appointments.history.confirm');
    fireEvent.press(confirmButton);
    expect(mockProviderDetail.onHandleConfirm).toHaveBeenCalledWith('123');
  });

  it('calls onHandleViewOtherRequests when viewOther requests button is pressed', () => {
    const { getByTestId } = render(<ProviderDetails {...mockProviderDetail} />);
    const viewOtherRequestsButton = getByTestId('appointments.link.viewOtherRequests');
    fireEvent.press(viewOtherRequestsButton);
    expect(mockProviderDetail.onHandleViewOtherRequests).toHaveBeenCalled();
  });
});
