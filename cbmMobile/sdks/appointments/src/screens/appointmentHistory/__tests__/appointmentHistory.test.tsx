import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { Screen } from '../../../navigation/appointment.navigationTypes';
import { AppointmentHistory } from '../appointmentHistory';
import { useAppointmentHistory } from '../useAppointmentHistory';

jest.mock('../useAppointmentHistory');
jest.mock('../../../../../../src/util/commonUtils');

describe('AppointmentHistory', () => {
  const mockUseAppointmentHistory = useAppointmentHistory as jest.Mock;
  const mockCloseAlert = jest.fn();
  const mockAppointmentHistory = {
    appointmentHistoryData: [
      {
        label: 'appointments.pendingRequests',
        action: Screen.PENDING_REQUESTS,
      },
      {
        label: 'appointments.confirmedRequests',
        action: Screen.CONFIRMED_REQUESTS,
      },
      {
        label: 'appointments.inactiveRequests',
        action: Screen.INACTIVE_REQUESTS,
      },
      {
        label: 'appointments.appointmentDetails',
        action: Screen.APPOINTMENT_DETAILS,
      },
    ],
    handleAppointmentHistoryNavigation: jest.fn(),
    isShownLoginAlert: false,
    onHandleSignIn: jest.fn(),
    onCloseAlert: mockCloseAlert,
  };

  beforeEach(() => {
    mockUseAppointmentHistory.mockReturnValue(mockAppointmentHistory);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders the correct title', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );
    const titleElement = getByTestId('appointments.history.title');
    expect(titleElement.props.children).toBe('appointments.title');
  });

  it('renders the appointment list', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );
    const listElement = getByTestId('appointments.history.list');
    expect(listElement).toBeTruthy();
  });

  it('does not show login alert when isShownLoginAlert is false', () => {
    const { queryByText } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );
    const alertTitle = queryByText('appointments.preLogin.title');
    expect(alertTitle).toBeNull();
  });

  it('renders the correct number of appointment items', () => {
    const { getAllByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );
    const items = getAllByTestId('appointments.history.item');
    expect(items.length).toBe(4);
  });

  it('navigates to the correct screen on item click', () => {
    const { getAllByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );
    const items = getAllByTestId('appointments.history.item');
    items.forEach((item, index) => {
      fireEvent.press(item);
      expect(mockAppointmentHistory.handleAppointmentHistoryNavigation).toHaveBeenCalledWith(
        mockAppointmentHistory.appointmentHistoryData[index].action
      );
    });
  });

  it('shows login alert when isShownLoginAlert is true', () => {
    mockUseAppointmentHistory.mockReturnValue({
      ...mockAppointmentHistory,
      isShownLoginAlert: true,
    });

    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );

    const alertTitle = getByText('appointments.preLogin.title');
    expect(alertTitle).toBeTruthy();
  });

  it('calls onHandleSignIn when sign in button is pressed in alert', () => {
    mockUseAppointmentHistory.mockReturnValue({
      ...mockAppointmentHistory,
      isShownLoginAlert: true,
    });

    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <AppointmentHistory />
      </AppointmentMockContextWrapper>
    );

    const signInButton = getByText('appointments.preLogin.signInButton');
    fireEvent.press(signInButton);
    expect(mockAppointmentHistory.onHandleSignIn).toHaveBeenCalled();
  });
});
