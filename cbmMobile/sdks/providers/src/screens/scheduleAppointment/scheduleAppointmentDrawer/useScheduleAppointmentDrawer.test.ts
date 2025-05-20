import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../../../../shared/src/models';
import { callNumber } from '../../../../../../shared/src/utils/utils';
import { AppointMentScheduleModelType } from '../../../config/constants/constants';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useScheduleAppointmentDrawer } from './useScheduleAppointmentDrawer';

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

jest.mock('../../../../../../shared/src/utils/utils', () => ({
  callNumber: jest.fn(),
}));

describe('useScheduleAppointmentDrawer', () => {
  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue({
      navigationHandler: mockNavigationHandler,
      client: { supportNumber: '1234567890' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct states', async () => {
    const { result } = renderHook(() => useScheduleAppointmentDrawer());
    expect(result.current.isShownAppointmentDrawer).toBe(true);
    expect(result.current.drawerContent.type).toBe(AppointMentScheduleModelType.IDENTIFY_REQUESTER);
    expect(result.current.clientSupportNumber).toBe('1234567890');
  });

  it('should handle onPressPrimaryButton correctly', async () => {
    const { result } = renderHook(() => useScheduleAppointmentDrawer());
    act(() => {
      result.current.onPressPrimaryButton('appointment.identifyRequesterModal.primaryButton');
    });

    expect(result.current.drawerContent.type).toBe(AppointMentScheduleModelType.CONTACT);

    act(() => {
      result.current.onPressPrimaryButton('appointment.contactModal.primaryButton');
    });

    expect(result.current.drawerContent.type).toBe(AppointMentScheduleModelType.IDENTIFY_REQUESTER);

    act(() => {
      result.current.onPressPrimaryButton('appointment.identifyRequesterModal.secondaryButton');
    });

    expect(result.current.drawerContent.type).toBe(AppointMentScheduleModelType.CONFIRM_EXPERIENCE);

    act(() => {
      result.current.onPressPrimaryButton('appointment.confirmExperienceModal.primaryButton');
    });

    expect(result.current.drawerContent.type).toBe(AppointMentScheduleModelType.HELP);

    act(() => {
      result.current.onPressPrimaryButton('appointment.helpModal.secondaryButton');
    });

    expect(result.current.isShownAppointmentDrawer).toBe(false);
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.HOME });
  });

  it('should handle onPressContact correctly', () => {
    const { result } = renderHook(() => useScheduleAppointmentDrawer());

    act(() => {
      result.current.onPressContact('1234567890');
    });

    expect(callNumber).toHaveBeenCalledWith('1234567890');
  });
});
