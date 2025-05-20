import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { ProposedDaysAndTime } from '../proposedDaysAndTime';
import { useProposedDaysAndTime } from '../useProposedDaysAndTime';

jest.mock('../useProposedDaysAndTime');
jest.mock('../../../../../../src/util/commonUtils');

const mockValue = {
  days: ['Monday', 'Tuesday', 'Friday'],
  time: '10:00 AM',
  clinicalInfo: [
    {
      answer: '',
      jobMissedDays: '',
      lessProductivedays: '',
      presentingProblem: '',
    },
  ],
};

describe('ProposedDaysAndTime', () => {
  const mockUseProposedDaysAndTime = useProposedDaysAndTime as jest.Mock;

  beforeEach(() => {
    mockUseProposedDaysAndTime.mockReturnValue(mockValue);
    (getClientDetails as jest.Mock).mockResolvedValue({ userName: 'testUser', supportNumber: '888-888-8888' });
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <ProposedDaysAndTime />
      </AppointmentMockContextWrapper>
    );
  });

  it('displays the main header component', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ProposedDaysAndTime />
      </AppointmentMockContextWrapper>
    );
    expect(getByTestId('appointments.appointmentDetails.proposedDaysAndTime')).toBeTruthy();
  });

  it('displays no requests message when clinicalInfo is not available', () => {
    mockUseProposedDaysAndTime.mockReturnValue({ ...mockValue, clinicalInfo: undefined });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ProposedDaysAndTime />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('appointments.noRequests.description')).toBeTruthy();
  });

  it('displays proposed days and time when clinicalInfo is available', () => {
    const { getAllByText } = render(
      <AppointmentMockContextWrapper>
        <ProposedDaysAndTime />
      </AppointmentMockContextWrapper>
    );
    expect(getAllByText('appointments.appointmentDetailsContent.proposedDaysAndTime')).toBeTruthy();
    expect(getAllByText('appointment.reviewDetails.preferredSlot')).toBeTruthy();
  });

  it('displays available days', () => {
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ProposedDaysAndTime />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('Tuesday')).toBeTruthy();
  });

  it('displays available time', () => {
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ProposedDaysAndTime />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('10:00 AM')).toBeTruthy();
  });
});
