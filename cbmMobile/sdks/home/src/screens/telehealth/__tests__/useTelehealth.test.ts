import { act, renderHook } from '@testing-library/react-hooks';
import { Linking } from 'react-native';

import { AppUrl } from '../../../../../../shared/src/models';
import { useGetMdLiveData } from '../../../../../../src/hooks/useGetMdLiveData';
import { mockTeleHealthResponse } from '../../../__mocks__/teleHealthInfo';
import { RE_DIRECT_URL_API_TYPE } from '../../../config/constants/home';
import { useHomeContext } from '../../../context/home.sdkContext';
import { useTeleHealthHook } from '../../../hooks/useTeleHealthHook';
import { useTeleHealth } from '../useTelehealth';

jest.mock('../../../context/home.sdkContext');
jest.mock('../../../../../../src/hooks/useGetMdLiveData');
jest.mock('../../../hooks/useTeleHealthHook');

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      teleHealthData: mockTeleHealthResponse.data.telehealth,
    },
  }),
}));

describe('useTeleHealth', () => {
  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };

  const mockCallService = jest.fn();

  const mockContext = {
    loggedIn: true,
    navigationHandler: mockNavigationHandler,
    serviceProvider: {
      callService: mockCallService,
    },
  };

  const mockTeleHealthInPersonData = [
    {
      buttonText: 'getStarted',
      title: 'searchCounselors',
      description: 'searchCounselorsDescription',
      icon: 'SearchCounselorsIcon',
      redirectUrl: `page:${RE_DIRECT_URL_API_TYPE.PROVIDERS_FIND_COUNSELOR}`,
      openURLInNewTab: false,
    },
  ];

  const getMdLiveData = jest.fn();

  beforeEach(() => {
    (useHomeContext as jest.Mock).mockReturnValue(mockContext);
    (useGetMdLiveData as jest.Mock).mockReturnValue({
      getMdLiveData,
      setShowError: jest.fn(),
      showError: false,
    });
    (useTeleHealthHook as jest.Mock).mockReturnValue({
      teleHealthInPersonData: mockTeleHealthInPersonData,
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useTeleHealth());
    expect(result.current.radioAltCurrentIndex).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(false);
    expect(result.current.showError).toBe(false);
  });

  it('should handle radio button change', () => {
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.handleChange(true, 1);
    });
    expect(result.current.radioAltCurrentIndex).toBe(1);
    expect(result.current.data).toEqual(mockTeleHealthInPersonData);
  });

  it('should handle try again', () => {
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.handleTryAgain();
    });
    expect(result.current.modelVisible).toBe(false);
  });

  it('should test onPressCardButton without login', () => {
    const updateMockContext = {
      ...mockContext,
      loggedIn: false,
      navigationHandler: mockNavigationHandler,
      serviceProvider: {
        callService: jest.fn(),
      },
    };
    (useHomeContext as jest.Mock).mockReturnValue(updateMockContext);
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.onPressCardButton(mockTeleHealthResponse.data.telehealth[0]);
    });
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.LOGIN });
  });

  it('should test onPressCardButton with login', () => {
    mockCallService.mockResolvedValue({ data: true });
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.onPressCardButton(mockTeleHealthResponse.data.telehealth[0]);
    });
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({
      action: AppUrl.LOGIN,
    });
  });

  it('should test onPressCardButton with no response', () => {
    mockCallService.mockResolvedValue({});
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.onPressCardButton(mockTeleHealthResponse.data.telehealth[0]);
    });
  });

  it('should handle onPressCardButton with http url', () => {
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.onPressCardButton(mockTeleHealthResponse.data.telehealth[2]);
    });
    expect(Linking.openURL).toHaveBeenCalledWith(mockTeleHealthResponse.data.telehealth[2].redirectUrl);
  });

  it('should handle onPressCardButton with native navigation', () => {
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.onPressCardButton(mockTeleHealthInPersonData[0]);
    });
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.FIND_COUNSELOR });
  });

  it('should test reject the api', () => {
    mockCallService.mockRejectedValue({});
    const { result } = renderHook(() => useTeleHealth());
    act(() => {
      result.current.onPressCardButton(mockTeleHealthResponse.data.telehealth[0]);
    });
    expect(result.current.loading).toBe(true);
  });
});
