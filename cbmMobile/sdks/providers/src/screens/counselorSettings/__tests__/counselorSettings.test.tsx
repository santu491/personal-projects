import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { CounselorSettings } from '../counselorSettings';
import { useCounselorSettings } from '../useCounselorSettings';

jest.mock('../useCounselorSettings', () => ({
  useCounselorSettings: jest.fn(),
}));

const mockUseCounselorSettings = useCounselorSettings as jest.Mock;

describe('CounselorSettings', () => {
  const mockOnChangeSettings = jest.fn();
  const mockOnPressEditCounselor = jest.fn();
  const mockOnPressContinue = jest.fn();

  const defaultProps = {
    radioButtons: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ],
    selectedValue: '1',
    onChangeSettings: mockOnChangeSettings,
    onPressEditCounselor: mockOnPressEditCounselor,
    onPressContinue: mockOnPressContinue,
    memberAppointmentStatus: { data: [] },
  };

  beforeEach(() => {
    (mockUseCounselorSettings as jest.Mock).mockReturnValue(defaultProps);
  });

  it('should render correctly', () => {
    const { getByText } = render(<CounselorSettings />);
    expect(getByText('appointment.counselorSetting.title')).toBeTruthy();
    expect(getByText('appointment.counselorSetting.description')).toBeTruthy();
    expect(getByText('appointment.counselorSetting.settingsInfo')).toBeTruthy();
  });

  it('should call onPressEditCounselor when edit counselor button is pressed', () => {
    const { getByText } = render(<CounselorSettings />);
    fireEvent.press(getByText('appointment.counselorSetting.addOrRemoveCounselor'));
    expect(mockOnPressEditCounselor).toHaveBeenCalled();
  });

  it('should call onPressContinue when continue button is pressed', () => {
    const { getByText } = render(<CounselorSettings />);
    fireEvent.press(getByText('appointment.continue'));
    expect(mockOnPressContinue).toHaveBeenCalled();
  });
});
