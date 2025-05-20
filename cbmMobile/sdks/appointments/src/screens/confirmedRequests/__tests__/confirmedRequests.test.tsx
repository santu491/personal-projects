import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { ConfirmedRequests } from '../confirmedRequests';
import { useConfirmedRequests } from '../useConfirmedRequests';

jest.mock('../useConfirmedRequests');
jest.mock('../../../../../../src/util/commonUtils');

describe('ConfirmedRequests', () => {
  const mockUseConfirmedRequests = useConfirmedRequests as jest.Mock;
  const mockConfirmedRequests = {
    confirmedRequestsList: [],
    loading: true,
    isServerError: false,
    onPressTryAgain: jest.fn(),
    cancelAlertTitle: jest.fn(),
    cancelAlertDescription: jest.fn(),
    primaryButtonTitle: jest.fn(),
    secondaryButtonTitle: jest.fn(),
    isCancelAlert: true,
  };

  beforeEach(() => {
    mockUseConfirmedRequests.mockReturnValue(mockConfirmedRequests);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <ConfirmedRequests />
      </AppointmentMockContextWrapper>
    );
  });

  it('displays the loading indicator when loading is true', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ConfirmedRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByTestId('progress-modal')).toBeTruthy();
  });

  it('displays the server error screen when there is a server error', async () => {
    mockUseConfirmedRequests.mockReturnValue({ ...mockConfirmedRequests, loading: false, isServerError: true });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ConfirmedRequests />
      </AppointmentMockContextWrapper>
    );
    expect(getByText('errors.fullScreenError.title')).toBeTruthy();
  });

  it('displays the confirmed requests list when data is available', async () => {
    mockUseConfirmedRequests.mockReturnValue({
      ...mockConfirmedRequests,
      loading: false,
      isServerError: false,
      confirmedRequestsList: [
        {
          hasCancel: true,
          hasConfirm: true,
          listData: [
            {
              label: 'lable',
              value: 'value',
            },
          ],
          onHandleCancel: jest.fn(),
          onHandleConfirm: jest.fn(),
          onHandleViewOtherRequests: jest.fn(),
          onHandleCancelRequest: jest.fn(),
          providerId: '123',
        },
      ],
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ConfirmedRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('appointments.history.list')).toBeTruthy());
  });

  it('displays the no requests component when there are no confirmed requests', async () => {
    mockUseConfirmedRequests.mockReturnValue({
      ...mockConfirmedRequests,
      loading: false,
      isServerError: false,
      confirmedRequestsList: undefined,
    });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ConfirmedRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('appointments.noRequests.description')).toBeTruthy();
  });

  it('displays the cancel alert when a request is being canceled', async () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ConfirmedRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('alert.primary.button')).toBeTruthy());
  });
});
