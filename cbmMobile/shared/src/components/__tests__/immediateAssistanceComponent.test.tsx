import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { ImmediateAssistanceComponent } from '../immediateAssistance/immediateAssistanceComponent';
import { useImmediateAssistance } from '../immediateAssistance/useImmediateAssistance';
jest.mock('../../../../src/util/commonUtils', () => ({
  getClientDetails: jest.fn().mockResolvedValue({ supportNumber: '1234567890' }),
  isIOS: jest.fn().mockReturnValue(false),
}));

jest.mock('../immediateAssistance/useImmediateAssistance');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ImmediateAssistanceComponent', () => {
  const mockUseImmediateAssistance = {
    showBottomSheet: false,
    supportNumber: '123-456-7890',
    assistanceType: null,
    memberSupportData: [],
    memberSupport: {
      label: 'MemberSuppot',
    },
    immediateAssistanceContact: [],
    onPressCrisisSupport: jest.fn(),
    onPressMemberSupport: jest.fn(),
    onPressContact: jest.fn(),
    setShowBottomSheet: jest.fn(),
  };

  beforeEach(() => {
    (useImmediateAssistance as jest.Mock).mockReturnValue(mockUseImmediateAssistance);
  });

  it('should render support number and crisis support buttons', () => {
    const { getByText } = render(<ImmediateAssistanceComponent />);

    expect(getByText('credibleMind.immediateAssistance.crisisSupport')).toBeTruthy();
  });

  it('should call onPressMemberSupport when member support button is pressed', () => {
    const { getByTestId } = render(<ImmediateAssistanceComponent />);

    fireEvent.press(getByTestId('immediate-assistance-screen-member-support'));
    expect(mockUseImmediateAssistance.onPressMemberSupport).toHaveBeenCalled();
  });

  it('should call onPressCrisisSupport when crisis support button is pressed', () => {
    const { getByText } = render(<ImmediateAssistanceComponent />);

    fireEvent.press(getByText('credibleMind.immediateAssistance.crisisSupport'));
    expect(mockUseImmediateAssistance.onPressCrisisSupport).toHaveBeenCalled();
  });

  it('should render Drawer when showBottomSheet is true', () => {
    mockUseImmediateAssistance.showBottomSheet = true;
    const { getByTestId } = render(<ImmediateAssistanceComponent />);

    expect(getByTestId('view')).toBeTruthy();
  });
});
