import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { useViewCounselorSettings } from '../useViewCounselorSettings';
import { ViewCounselorSettings } from '../viewCounselorSettings';

jest.mock('../useViewCounselorSettings');

describe('ViewCounselorSettings', () => {
  const mockUseViewCounselorSettings = useViewCounselorSettings as jest.Mock;

  beforeEach(() => {
    mockUseViewCounselorSettings.mockReturnValue({
      onPressContinue: jest.fn(),
      days: ['Monday', 'Wednesday'],
      time: '10:00 AM',
      onPressCloseIcon: jest.fn(),
      onPressEditCounselor: jest.fn(),
      memberAppointmentStatus: { data: [] },
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(<ViewCounselorSettings />);
    expect(getByText('appointment.reviewDetails.title')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.description')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.counselorSettings')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.preferredSlot')).toBeTruthy();
    expect(getByText('appointment.reviewDetails.appliesToText')).toBeTruthy();
    expect(getByText('Monday')).toBeTruthy();
    expect(getByText('Wednesday')).toBeTruthy();
    expect(getByText('10:00 AM')).toBeTruthy();
    expect(getByText('appointment.counselorSetting.addOrRemoveCounselor')).toBeTruthy();
    expect(getByText('appointment.continue')).toBeTruthy();
  });

  it('calls onPressContinue when continue button is pressed', () => {
    const { getByText } = render(<ViewCounselorSettings />);
    const continueButton = getByText('appointment.continue');
    fireEvent.press(continueButton);
    expect(mockUseViewCounselorSettings().onPressContinue).toHaveBeenCalled();
  });

  it('calls onPressEditCounselor when edit counselor button is pressed', () => {
    const { getByText } = render(<ViewCounselorSettings />);
    const editCounselorButton = getByText('appointment.counselorSetting.addOrRemoveCounselor');
    fireEvent.press(editCounselorButton);
    expect(mockUseViewCounselorSettings().onPressEditCounselor).toHaveBeenCalled();
  });
});
