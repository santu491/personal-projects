import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { PendingRequests } from '../pendingRequests';
import { usePendingRequests } from '../usePendingRequests';

jest.mock('../usePendingRequests');
jest.mock('../../../../../../src/util/commonUtils');

describe('PendingRequests', () => {
  const mockUsePendingRequests = usePendingRequests as jest.Mock;
  const mockPendingRequests = {
    pendingRequestsList: [],
    loading: true,
    onPressContinueButton: jest.fn(),
    onPressCancelRequest: jest.fn(),
    isServerError: false,
    onPressTryAgain: jest.fn(),
  };
  beforeEach(() => {
    mockUsePendingRequests.mockReturnValue(mockPendingRequests);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <PendingRequests />
      </AppointmentMockContextWrapper>
    );
  });

  it('displays loading indicator when loading', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <PendingRequests />
      </AppointmentMockContextWrapper>
    );
    expect(getByTestId('progress-modal')).toBeTruthy();
  });

  it('displays full screen error on server error', () => {
    mockUsePendingRequests.mockReturnValue({ ...mockPendingRequests, loading: false, isServerError: true });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <PendingRequests />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('errors.fullScreenError.title')).toBeTruthy();
  });

  it('displays pending requests list when data is available', () => {
    mockUsePendingRequests.mockReturnValue({
      ...mockPendingRequests,
      loading: false,
      pendingRequestsList: {
        hasCancel: false,
        hasConfirm: false,
        listData: [
          {
            label: 'lable',
            value: 'value',
          },
        ],
        onHandleCancel: jest.fn(),
        onHandleConfirm: jest.fn(),
        onHandleViewOtherRequests: jest.fn(),
      },
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <PendingRequests />
      </AppointmentMockContextWrapper>
    );
    expect(getByTestId('appointments.pending.continue')).toBeTruthy();
  });

  it('displays no requests message when no data is available', () => {
    mockUsePendingRequests.mockReturnValue({
      ...mockPendingRequests,
      loading: false,
      isServerError: false,
      pendingRequestsList: undefined,
    });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <PendingRequests />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('appointments.noRequests.description')).toBeTruthy();
  });
});
