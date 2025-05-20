import { act, renderHook } from '@testing-library/react-native';

import { AppUrl } from '../../../../../../shared/src/models';
import { API_ENDPOINTS } from '../../../../../../src/config';
import { RequestMethod } from '../../../../../../src/models/adapters';
import { useUpdatePhoneNumber } from '../useUpdatePhoneNumber';

let mockUserContext: {
  navigation: {
    goBack: jest.Mock;
  };
  navigationHandler: {
    linkTo: jest.Mock;
  };
  serviceProvider: {
    callService: jest.Mock;
  };
  userProfileData: {
    communication: { consent: boolean };
    employerType: string;
  };
};

jest.mock('../../../context/auth.sdkContext', () => ({
  useUserContext: () => mockUserContext,
}));

let mockAppContext: {
  setUserProfileData: jest.Mock;
};

jest.mock('../../../../../../src/context/appContext', () => ({
  useAppContext: () => mockAppContext,
}));

describe('useUpdatePhoneNumber', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;

  beforeEach(() => {
    mockUserContext = {
      userProfileData: {
        communication: { consent: true },
        employerType: 'testEmployer',
      },
      serviceProvider: {
        callService: jest.fn(),
      },
      navigation: {
        goBack: jest.fn(),
      },
      navigationHandler: {
        linkTo: jest.fn(),
      },
    };

    mockAppContext = {
      setUserProfileData: jest.fn(),
    };

    const { result: hookResult } = renderHook(() => useUpdatePhoneNumber());
    result = hookResult;
  });

  it('should initialize with default values', () => {
    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(false);
    expect(result.current.phoneNumberUpdateError).toBeUndefined();
  });

  it('should handle continue button press', async () => {
    const mockCallService = mockUserContext.serviceProvider.callService;
    mockCallService.mockResolvedValueOnce({});

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(mockCallService).toHaveBeenCalledWith(
      API_ENDPOINTS.UPDATE_PHONE_NUMBER,
      RequestMethod.PUT,
      {
        employerType: 'testEmployer',
        communication: { mobileNumber: '+1', consent: true },
      },
      { isSecureToken: true }
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(true);
    expect(mockAppContext.setUserProfileData).toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    const mockCallService = mockUserContext.serviceProvider.callService;
    mockCallService.mockRejectedValueOnce({ message: 'Error' });

    await act(async () => {
      result.current.handleContinueButton();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(false);
    expect(result.current.phoneNumberUpdateError).toBe('Invalid error format');
  });

  it('should handle success alert button press', () => {
    act(() => {
      result.current.onPressSuccessAlertButton();
    });

    expect(result.current.modelVisible).toBe(false);
    expect(mockUserContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.PROFILE });
  });

  it('should handle previous button press', () => {
    act(() => {
      result.current.handlePreviousButton();
    });

    expect(mockUserContext.navigation.goBack).toHaveBeenCalled();
  });

  it('should clear phone number update error', () => {
    act(() => {
      result.current.updatePhoneNumberError();
    });

    expect(result.current.phoneNumberUpdateError).toBeUndefined();
  });
});
