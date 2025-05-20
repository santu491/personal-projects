// import '@testing-library/jest-native/extend-expect';

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { storage } from '../../../../../../src/util/storage';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { ScheduleAppointment } from '../scheduleAppointment';
import { useScheduleAppointment } from '../useScheduleAppointment';

jest.mock('../useScheduleAppointment', () => ({
  useScheduleAppointment: jest.fn(),
}));

// Mock the storage module
jest.mock('../../../../../../src/util/storage');

const mockStorage = {
  getObject: jest.fn().mockResolvedValue({}),
  setObject: jest.fn().mockResolvedValue(undefined),
  setString: jest.fn().mockResolvedValue(undefined),
  getString: jest.fn().mockResolvedValue(''),
  setBool: jest.fn().mockResolvedValue(undefined),
  getBool: jest.fn().mockResolvedValue(false),
  setNumber: jest.fn().mockResolvedValue(undefined),
  getNumber: jest.fn().mockResolvedValue(0),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
  getAllKeys: jest.fn().mockResolvedValue([]),
  setInt: jest.fn().mockResolvedValue(undefined),
  getInt: jest.fn().mockResolvedValue(0),
};

jest.mocked(storage).mockImplementation(() => mockStorage);
const mockUseScheduleAppointment = useScheduleAppointment as jest.Mock;

describe('ScheduleAppointment', () => {
  beforeEach(() => {
    mockUseScheduleAppointment.mockReturnValue({
      appointmentInfo: [
        { title: 'Appointment 1', description: 'Description 1' },
        { title: 'Appointment 2', description: 'Description 2' },
      ],
      onPressContinue: jest.fn(),
      onPressLeftArrow: jest.fn(),
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointment />
      </ProvidersMockContextWrapper>
    );
    expect(getByText('Appointment 1')).toBeTruthy();
    expect(getByText('Description 1')).toBeTruthy();
    expect(getByText('Appointment 2')).toBeTruthy();
    expect(getByText('Description 2')).toBeTruthy();
  });

  it('calls onPressContinue when the continue button is pressed', () => {
    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointment />
      </ProvidersMockContextWrapper>
    );
    const continueButton = getByText('appointment.continue');
    fireEvent.press(continueButton);
    expect(mockUseScheduleAppointment().onPressContinue).toHaveBeenCalled();
  });
});
it('renders AlertModel correctly when isAlertEnabled is true', () => {
  mockUseScheduleAppointment.mockReturnValue({
    ...mockUseScheduleAppointment(),
    isAlertEnabled: true,
    alertInfo: {
      title: 'Alert Title',
      subTitle: 'Alert Subtitle',
      primaryButtonTitle: 'Primary',
      secondaryButtonTitle: 'Secondary',
      onHandlePrimaryButton: jest.fn(),
      onHandleSecondaryButton: jest.fn(),
      isError: false,
      errorIndicatorIconColor: 'red',
    },
    providerName: 'Provider Name',
    clientSupportNumber: '123-456-7890',
    onPressContact: jest.fn(),
  });

  const { getByText } = render(
    <ProvidersMockContextWrapper>
      <ScheduleAppointment />
    </ProvidersMockContextWrapper>
  );

  expect(getByText('Alert Title')).toBeTruthy();
  expect(getByText('Primary')).toBeTruthy();
  expect(getByText('Secondary')).toBeTruthy();
});

it('calls AlertModel primary and secondary button handlers correctly', () => {
  const mockPrimaryButtonHandler = jest.fn();
  const mockSecondaryButtonHandler = jest.fn();
  const mockContactHandler = jest.fn();

  mockUseScheduleAppointment.mockReturnValue({
    ...mockUseScheduleAppointment(),
    isAlertEnabled: true,
    alertInfo: {
      title: 'Alert Title',
      subTitle: 'Alert Subtitle',
      primaryButtonTitle: 'Primary',
      secondaryButtonTitle: 'Secondary',
      onHandlePrimaryButton: mockPrimaryButtonHandler,
      onHandleSecondaryButton: mockSecondaryButtonHandler,
      isError: false,
      errorIndicatorIconColor: 'red',
    },
    providerName: 'Provider Name',
    clientSupportNumber: '123-456-7890',
    onPressContact: mockContactHandler,
  });

  const { getByText } = render(
    <ProvidersMockContextWrapper>
      <ScheduleAppointment />
    </ProvidersMockContextWrapper>
  );

  fireEvent.press(getByText('Primary'));
  expect(mockPrimaryButtonHandler).toHaveBeenCalled();

  fireEvent.press(getByText('Secondary'));
  expect(mockSecondaryButtonHandler).toHaveBeenCalled();

  fireEvent.press(getByText('123-456-7890'));
  expect(mockContactHandler).toHaveBeenCalled();
});

it('renders appointment information correctly', () => {
  const { getByText } = render(
    <ProvidersMockContextWrapper>
      <ScheduleAppointment />
    </ProvidersMockContextWrapper>
  );

  expect(getByText('Appointment 1')).toBeTruthy();
  expect(getByText('Description 1')).toBeTruthy();
  expect(getByText('Appointment 2')).toBeTruthy();
  expect(getByText('Description 2')).toBeTruthy();
});

it('calls onPressContinue when the continue button is pressed', () => {
  const { getByText } = render(
    <ProvidersMockContextWrapper>
      <ScheduleAppointment />
    </ProvidersMockContextWrapper>
  );

  const continueButton = getByText('appointment.continue');
  fireEvent.press(continueButton);
  expect(mockUseScheduleAppointment().onPressContinue).toHaveBeenCalled();
});
