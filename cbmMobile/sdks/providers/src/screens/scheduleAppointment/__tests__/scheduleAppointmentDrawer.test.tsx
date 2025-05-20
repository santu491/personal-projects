// scheduleAppointmentDrawer.test.tsx
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { EMERGENCY_SERVICE_NUMBER, MENTAL_HEALTH_CRISIS_NUMBER } from '../../../../../../src/constants/constants';
import { AppStatus } from '../../../../../../src/screens/appInit/appInitContext';
import { useAppInitInner } from '../../../../../../src/screens/appInit/useAppInitInner';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { AppointMentScheduleModelType } from '../../../config/constants/constants';
import { ScheduleAppointmentDrawer } from '../scheduleAppointmentDrawer/scheduleAppointmentDrawer';
import { useScheduleAppointmentDrawer } from '../scheduleAppointmentDrawer/useScheduleAppointmentDrawer';

jest.mock('../scheduleAppointmentDrawer/useScheduleAppointmentDrawer', () => ({
  useScheduleAppointmentDrawer: jest.fn(),
}));

jest.mock('../../../../../../src/screens/appInit/useAppInitInner', () => ({
  useAppInitInner: jest.fn(),
}));

describe('ScheduleAppointmentDrawer', () => {
  it('renders correctly when drawer is shown', () => {
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    (useScheduleAppointmentDrawer as jest.Mock).mockReturnValue({
      drawerContent: {
        title: 'Test Title',
        description: 'Test Description',
        type: 'CONFIRM_EXPERIENCE',
        primaryButton: 'Primary',
        secondaryButton: 'Secondary',
      },
      isShownAppointmentDrawer: true,
      onPressPrimaryButton: jest.fn(),
    });

    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointmentDrawer />
      </ProvidersMockContextWrapper>
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Primary')).toBeTruthy();
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('calls onPressPrimaryButton when primary button is pressed', () => {
    const onPressPrimaryButtonMock = jest.fn();
    (useScheduleAppointmentDrawer as jest.Mock).mockReturnValue({
      drawerContent: {
        title: 'Test Title',
        description: 'Test Description',
        type: 'CONFIRM_EXPERIENCE',
        primaryButton: 'Primary',
        secondaryButton: 'Secondary',
      },
      isShownAppointmentDrawer: true,
      onPressPrimaryButton: onPressPrimaryButtonMock,
    });

    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointmentDrawer />
      </ProvidersMockContextWrapper>
    );

    fireEvent.press(getByText('Primary'));
    expect(onPressPrimaryButtonMock).toHaveBeenCalledWith('Primary');
  });
});
// scheduleAppointmentDrawer.test.tsx

describe('ScheduleAppointmentDrawer', () => {
  // Existing tests...

  it('renders correct description for CONFIRM_EXPERIENCE', () => {
    (useScheduleAppointmentDrawer as jest.Mock).mockReturnValue({
      drawerContent: {
        title: 'Test Title',
        description: 'Test Description',
        type: AppointMentScheduleModelType.CONFIRM_EXPERIENCE,
        primaryButton: 'Primary',
        secondaryButton: 'Secondary',
      },
      isShownAppointmentDrawer: true,
      onPressPrimaryButton: jest.fn(),
      clientSupportNumber: '1234567890',
      onPressContact: jest.fn(),
    });

    const { getByText } = render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointmentDrawer />
      </ProvidersMockContextWrapper>
    );

    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('appointment.confirmExperienceModal.violenceContent')).toBeTruthy();
    expect(getByText('appointment.confirmExperienceModal.hurtingContent')).toBeTruthy();
  });

  it('renders correct description for CONTACT', () => {
    (useScheduleAppointmentDrawer as jest.Mock).mockReturnValue({
      drawerContent: {
        title: 'Test Title',
        description: 'Test Description',
        type: AppointMentScheduleModelType.CONTACT,
        primaryButton: 'Primary',
        secondaryButton: 'Secondary',
      },
      isShownAppointmentDrawer: true,
      onPressPrimaryButton: jest.fn(),
      clientSupportNumber: '1234567890',
      onPressContact: jest.fn(),
    });

    render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointmentDrawer />
      </ProvidersMockContextWrapper>
    );
  });

  it('renders correct description for HELP', () => {
    (useScheduleAppointmentDrawer as jest.Mock).mockReturnValue({
      drawerContent: {
        title: 'Test Title',
        description: 'Test Description',
        type: AppointMentScheduleModelType.HELP,
        primaryButton: 'Primary',
        secondaryButton: 'Secondary',
      },
      isShownAppointmentDrawer: true,
      onPressPrimaryButton: jest.fn(),
      clientSupportNumber: '1234567890',
      onPressContact: jest.fn(),
    });

    render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointmentDrawer />
      </ProvidersMockContextWrapper>
    );
  });

  it('calls onPressContact with correct numbers', () => {
    const onPressContactMock = jest.fn();
    (useScheduleAppointmentDrawer as jest.Mock).mockReturnValue({
      drawerContent: {
        title: 'Test Title',
        description: 'Test Description',
        type: AppointMentScheduleModelType.HELP,
        primaryButton: 'Primary',
        secondaryButton: 'Secondary',
      },
      isShownAppointmentDrawer: true,
      onPressPrimaryButton: jest.fn(),
      clientSupportNumber: '1234567890',
      onPressContact: onPressContactMock,
    });

    const { getByText, getByTestId } = render(
      <ProvidersMockContextWrapper>
        <ScheduleAppointmentDrawer />
      </ProvidersMockContextWrapper>
    );

    fireEvent.press(getByText('1234567890'));
    expect(onPressContactMock).toHaveBeenCalledWith('1234567890');

    fireEvent.press(getByText('appointment.helpModal.emergencyServiceNo'));
    expect(onPressContactMock).toHaveBeenCalledWith(EMERGENCY_SERVICE_NUMBER);

    fireEvent.press(getByText('appointment.helpModal.mentalHealthCrisisNo'));
    expect(onPressContactMock).toHaveBeenCalledWith(MENTAL_HEALTH_CRISIS_NUMBER);
    fireEvent.press(getByTestId('providers.scheduleAppointmentDrawer.secondaryButton'));
    // expect(onPressContactMock).toHaveBeenCalledWith(MENTAL_HEALTH_CRISIS_NUMBER);
  });
});
