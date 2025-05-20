import { render } from '@testing-library/react-native';
import React from 'react';

import { AppStatus } from '../../../../../../src/screens/appInit/appInitContext';
import { useAppInitInner } from '../../../../../../src/screens/appInit/useAppInitInner';
import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { RequestAppointment } from '../requestAppointment';
import { useRequestAppointment } from '../useRequestAppointment';

jest.mock('../../../../../../src/util/commonUtils');

jest.mock('../../../../../../src/screens/appInit/useAppInitInner', () => ({
  useAppInitInner: jest.fn(),
}));

jest.mock('../useRequestAppointment', () => ({
  useRequestAppointment: jest.fn(),
}));

const mockUseReviewDetails = useRequestAppointment as jest.Mock;

describe('RequestAppointment', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  const mockOnPressContinue = jest.fn();
  const mockOnPressPreviousButton = jest.fn();

  const defaultProps = {
    onPressContinue: mockOnPressContinue,
    onPressPreviousButton: mockOnPressPreviousButton,
    reviewDetails: [],
    // Add other props as needed
  };

  it('should display the alert model when isShownAlert is true', () => {
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    mockUseReviewDetails.mockReturnValue({
      ...defaultProps,
      isShownAlert: true,
      isSuccess: true,
    });
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <RequestAppointment />
      </ProvidersMockContextWrapper>
    );
    expect(getByText('appointment.reviewDetails.appointmentRequested')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.appointmentRequestedDescription')).toBeTruthy();
  });

  it('should display the error alert model when isSuccess is false', () => {
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    mockUseReviewDetails.mockReturnValue({
      ...defaultProps,
      isShownAlert: true,
      isSuccess: false,
    });
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <RequestAppointment />
      </ProvidersMockContextWrapper>
    );
    expect(getByText('appointment.reviewDetails.appointmentErrorTitle')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.appointmentErrorDescription')).toBeTruthy();
  });
});
