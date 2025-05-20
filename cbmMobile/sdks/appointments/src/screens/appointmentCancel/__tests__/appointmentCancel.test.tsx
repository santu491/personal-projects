import { fireEvent, render, waitFor, within } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { AppointmentMockContextWrapper } from '../../../__mocks__/appoinmentsMockContextWrapper';
import { CancelScreenType } from '../../../constants/constants';
import { RequestCurrentStatus } from '../../../models/appointments';
import { AppointmentCancelRequests } from '../appointmentCancel';
import { useAppointmentCancel } from '../useAppointmentCancel';
jest.mock('../../../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
    useRoute: () => ({
      params: {
        screenType: 'APPOINTMENT_DETAIL_REQUEST',
        appointmentCurrentStatus: 'Initiated',
      },
    }),
  };
});

jest.mock('../useAppointmentCancel', () => ({
  useAppointmentCancel: jest.fn(),
}));

const mockUseAppointmentCancel = useAppointmentCancel as jest.Mock;
const appointmentCancelData = {
  headersData: {
    title: 'title',
    description: 'description',
  },
  cancelAlertTitle: jest.fn(),
  onHandleCancelRequest: jest.fn(),
  onHandleConfirmRequest: jest.fn(),
  onHandleCancelAll: jest.fn(),
  onAlertPrimaryButtonPress: jest.fn(),
  onAlertSecondaryButtonPress: jest.fn(),
  cancelAlertDescription: jest.fn(),
  primaryButtonTitle: jest.fn(),
  secondaryButtonTitle: jest.fn().mockReturnValue('button'),
  loading: true,
  screenType: CancelScreenType.CANCEL_REQUEST,
};

const buttonsData = {
  isCancel: true,
  isCancelAll: true,
  isConfirm: true,
};

const providerDetails = [
  {
    listData: [
      {
        label: 'appointments.appointmentDetailsContent.qualification',
        value: 'title',
      },
      {
        label: 'appointments.appointmentDetailsContent.specialty',
        value: 'providerType',
      },
    ],
    title: `title`,
    providerId: 'providerId',
    status: RequestCurrentStatus.ACCEPTED,
  },
];

describe('AppointmentCancelRequests', () => {
  beforeEach(() => {
    mockUseAppointmentCancel.mockReturnValue({ ...appointmentCancelData });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
    jest.clearAllMocks();
  });
  it('displays the appointment title', async () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => expect(getByTestId('appointments.confirmed.requests-title')).toBeTruthy());
  });

  it('renders the MemberProfileHeader with correct title and description', async () => {
    const { getByTestId, getByText } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      expect(getByTestId('appointments.confirmed.requests-title')).toHaveTextContent('title');
      expect(getByText('description')).toBeTruthy();
    });
  });

  it('renders the ProgressLoader when loading is true', async () => {
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      expect(getByTestId('progress-modal')).toBeTruthy();
    });
  });

  it('renders the provider list when providerDetails is available', async () => {
    mockUseAppointmentCancel.mockReturnValue({ ...appointmentCancelData, providerDetails, buttonsData });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      expect(getByTestId('appointments.appointmentDetails.providerList')).toBeTruthy();
    });
  });

  it('renders the CancelAllComponent when conditions are met', async () => {
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      providerDetails,
      buttonsData,
      isCancelAll: false,
      screenType: CancelScreenType.CANCEL_REQUEST,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    expect(getByTestId('appointments.appointmentDetails.cancel')).toBeTruthy();
  });

  it('renders the AlertModel when isCancelAlert or isRequestCanceled is true', async () => {
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      providerDetails,
      buttonsData,
      isCancelAll: false,
      screenType: CancelScreenType.CANCEL_REQUEST,
      isCancelAlert: true,
      loading: false,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      expect(getByTestId('alert.error.icon')).toBeTruthy();
    });
  });

  it('calls onHandleCancelRequest when cancel button is pressed', async () => {
    const onHandleCancelRequest = jest.fn();
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      onHandleCancelRequest,
      providerDetails,
      buttonsData,
      loading: false,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(async () => {
      const cancelButton = await within(getByTestId('appointments.appointmentDetails.providerList')).findByTestId(
        'appointments.history.cancel'
      );
      fireEvent.press(cancelButton);
      expect(onHandleCancelRequest).toHaveBeenCalled();
    });
  });

  it('calls onHandleConfirmRequest when confirm button is pressed', async () => {
    const onHandleConfirmRequest = jest.fn();
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      onHandleConfirmRequest,
      providerDetails,
      buttonsData,
      loading: false,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      const confirmButton = within(getByTestId('appointments.appointmentDetails.providerList')).getByTestId(
        'appointments.history.confirm'
      );
      fireEvent.press(confirmButton);
      expect(onHandleConfirmRequest).toHaveBeenCalled();
    });
  });

  it('calls onHandleCancelAll when cancel all button is pressed', async () => {
    const onHandleCancelAll = jest.fn();
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      onHandleCancelAll,
      providerDetails,
      buttonsData,
      isCancelAll: false,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      const cancelAllButton = getByTestId('appointments.appointmentDetails.cancel');
      fireEvent.press(cancelAllButton);
      expect(onHandleCancelAll).toHaveBeenCalled();
    });
  });

  it('calls onAlertPrimaryButtonPress when alert primary button is pressed', async () => {
    const onAlertPrimaryButtonPress = jest.fn();
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      onAlertPrimaryButtonPress,
      isCancelAlert: true,
      loading: false,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      const alertPrimaryButton = getByTestId('alert.primary.button');
      fireEvent.press(alertPrimaryButton);
      expect(onAlertPrimaryButtonPress).toHaveBeenCalled();
    });
  });

  it('calls onAlertSecondaryButtonPress when alert secondary button is pressed', async () => {
    const onAlertSecondaryButtonPress = jest.fn();
    mockUseAppointmentCancel.mockReturnValue({
      ...appointmentCancelData,
      onAlertSecondaryButtonPress,
      isCancelAlert: true,
      loading: false,
    });
    const { getByTestId } = render(
      <AppointmentMockContextWrapper>
        <AppointmentCancelRequests />
      </AppointmentMockContextWrapper>
    );

    await waitFor(() => {
      const alertSecondaryButton = getByTestId('alert.secondary.button');
      fireEvent.press(alertSecondaryButton);
      expect(onAlertSecondaryButtonPress).toHaveBeenCalled();
    });
  });
});
