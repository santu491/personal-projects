import { render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { useViewOtherRequests } from '../useViewOtherRequests';
import { ViewOtherRequests } from '../viewOtherRequests';

jest.mock('../useViewOtherRequests');
jest.mock('../../../../../../src/util/commonUtils');
const mockUseViewOtherRequests = useViewOtherRequests as jest.Mock;

describe('ViewOtherRequests', () => {
  beforeEach(() => {
    mockUseViewOtherRequests.mockReturnValue({
      otherRequestList: [{ listData: [], title: 'Test Title', status: 'Pending' }],
      dateOfInitiation: '2023-10-01',
    });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <AppointmentMockContextWrapper>
        <ViewOtherRequests />
      </AppointmentMockContextWrapper>
    );
  });

  it('renders the correct title', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ViewOtherRequests />
      </AppointmentMockContextWrapper>
    );
    const titleElement = getByTestId('appointments.other.requests.title');
    expect(titleElement.props.children).toBe('appointments.otherRequests (01)');
  });

  it('renders the correct description when there are requests', () => {
    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ViewOtherRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('appointments.sentOn 2023-10-01')).toBeTruthy();
  });

  it('renders the NoRequests component when there are no requests', () => {
    mockUseViewOtherRequests.mockReturnValue({
      otherRequestList: undefined,
      dateOfInitiation: '',
    });

    const { getByText } = render(
      <AppointmentMockContextWrapper>
        <ViewOtherRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByText('appointments.noRequests.description')).toBeTruthy();
  });

  it('renders the FlatList component when there are requests', () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <ViewOtherRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByTestId('appointments.other.requests.history.list')).toBeTruthy();
  });
});
