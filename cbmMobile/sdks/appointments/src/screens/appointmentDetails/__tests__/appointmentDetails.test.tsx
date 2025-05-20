import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { AppointmentDetails } from '../appointmentDetails';
import { useAppointmentDetails } from '../useAppointmentDetails';

const mockAppointmentContext = {
  navigation: { navigate: jest.fn() },
  serviceProvider: { callService: jest.fn() },
  setSelectedProviders: jest.fn(),
};

jest.mock('../useAppointmentDetails');
jest.mock('../../../../../../src/util/commonUtils');

describe('AppointmentDetails', () => {
  const mockUseAppointmentDetails = useAppointmentDetails as jest.Mock;
  const mockAppointmentDetails = {
    handleNavigation: jest.fn(),
    loading: false,
    onPressTryAgain: jest.fn(),
    isServerError: false,
    appointmentContext: mockAppointmentContext,
    appointmentDetailsList: [],
  };

  beforeEach(() => {
    mockUseAppointmentDetails.mockReturnValue(mockAppointmentDetails);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });
  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <AppointmentDetails />
      </AppointmentMockContextWrapper>
    );
  });

  it('displays the appointment title', async () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentDetails />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('appointments.appointmentDetails.title')).toBeTruthy());
  });

  it('displays the loading indicator when loading', async () => {
    mockUseAppointmentDetails.mockReturnValue({ ...mockAppointmentDetails, loading: true });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentDetails />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('progress-modal')).toBeTruthy());
  });

  it('displays the server error screen when there is a server error', async () => {
    mockUseAppointmentDetails.mockReturnValue({ ...mockAppointmentDetails, isServerError: true, loading: false });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <AppointmentDetails />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByText('errors.fullScreenError.title')).toBeTruthy());
  });

  it('displays the list of appointment details when data is available', async () => {
    mockUseAppointmentDetails.mockReturnValue({
      ...mockAppointmentDetails,
      loading: false,
      isServerError: false,
      appointmentDetailsList: [
        {
          action: 'ClinicalQuestionnaire',
          label: 'appointments.appointmentDetailsContent.clinicalQuestionnaire',
        },
      ],
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentDetails />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('appointments.details.list')).toBeTruthy());
  });

  it('displays the no requests component when there are no appointment details', async () => {
    mockUseAppointmentDetails.mockReturnValue({
      ...mockAppointmentDetails,
      loading: false,
      isServerError: false,
      appointmentDetailsList: undefined,
    });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <AppointmentDetails />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByText('appointments.noRequests.description')).toBeTruthy());
  });
});
