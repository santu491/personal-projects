import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { InActiveRequests } from '../inActiveRequests';
import { useInActiveRequests } from '../useInActiveRequests';

jest.mock('../useInActiveRequests');
jest.mock('../../../../../../src/util/commonUtils');

afterEach(() => {
  jest.resetAllMocks();
});

describe('InActiveRequests', () => {
  const mockUseActiveRequests = useInActiveRequests as jest.Mock;
  const mockActiveRequests = {
    inActiveRequestsList: [],
    loading: true,
    isServerError: false,
    onPressTryAgain: jest.fn(),
  };

  beforeEach(() => {
    mockUseActiveRequests.mockReturnValue(mockActiveRequests);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <InActiveRequests />
      </AppointmentMockContextWrapper>
    );
  });

  it('displays the loading indicator when loading is true', async () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <InActiveRequests />
      </AppointmentMockContextWrapper>
    );
    expect(getByTestId('progress-modal')).toBeTruthy();
  });

  it('displays the server error screen when there is a server error', async () => {
    mockUseActiveRequests.mockReturnValue({ ...mockActiveRequests, loading: false, isServerError: true });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <InActiveRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('errors.fullScreenError.title')).toBeTruthy();
  });

  it('displays the no requests component when there are no inactive requests', async () => {
    mockUseActiveRequests.mockReturnValue({
      ...mockActiveRequests,
      loading: false,
      isServerError: false,
      inActiveRequestsList: [],
    });
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <InActiveRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('appointments.noRequests.description')).toBeTruthy();
  });

  it('displays the list of inactive requests when there are inactive requests', async () => {
    mockUseActiveRequests.mockReturnValue({
      ...mockActiveRequests,
      loading: false,
      isServerError: false,
      inActiveRequestsList: [
        {
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
      ],
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <InActiveRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('appointments.inActive.list')).toBeTruthy());
  });
});
