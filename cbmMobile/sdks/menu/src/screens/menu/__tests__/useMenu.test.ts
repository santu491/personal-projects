import { act, renderHook } from '@testing-library/react-hooks';
import { Linking } from 'react-native';

import { AppUrl } from '../../../../../../shared/src/models';
import { getMockAppContext } from '../../../../../../src/__mocks__/appContext';
import { useAppContext } from '../../../../../../src/context/appContext';
import { useLogout } from '../../../../../../src/hooks/useLogout';
import { storage } from '../../../../../../src/util/storage';
import { useMenuContext } from '../../../context/menu.sdkContext';
import { useGetProfileInfo } from '../../../hooks/useGetProfileInfo';
import { Screen } from '../../../navigation/menu.navigationTypes';
import { useMenu } from '../useMenu';

jest.mock('../../../context/menu.sdkContext');
jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../hooks/useGetProfileInfo');
jest.mock('../../../../../../src/util/storage');
jest.mock('../../../../../../src/hooks/useLogout', () => ({
  useLogout: jest.fn(),
}));

const menuInfo = [
  {
    label: 'Support and Assessments',
    openURLInNewTab: true,
    redirectUrl: 'api:assessments?surveyId=63c97a6c-716e-4006-a34c-b7dd202afa51',
    title: 'Support starts here',
    type: 'CardModel',
  },
  {
    label: 'Find a Provider',
    openURLInNewTab: false,
    redirectUrl: 'page:findACounselor.telehealth',
    title: 'Find a counselor',
    type: 'CardModel',
  },
  {
    label: 'Legal Advice',
    openURLInNewTab: false,
    redirectUrl: 'company-demo/find-legal-support',
    title: 'Legal resources',
    type: 'CardModel',
  },
];

const navigation = {
  navigate: jest.fn(),
};

describe('useMenu', () => {
  const mockMenuContext = {
    menuData: menuInfo,
    userProfileData: {},
    navigationHandler: getMockAppContext().navigationHandler,
    navigation,
    loggedIn: true,
    serviceProvider: {
      callService: jest.fn(),
    },
    assessmentsSurveyId: '123232',
  };

  const mockAppContext = {
    serviceProvider: {
      callService: jest.fn(),
    },
    setLoggedIn: jest.fn(),
    setServiceProvider: jest.fn(),
    client: {
      groupId: '',
      logoUrl: '',
      subGroupName: '',
      supportNumber: '888-888-8888',
      userName: 'Company-demo',
    },
  };

  const mockProfileInfo = {
    loggedInMenuData: [],
    finalMenuData: [],
  };

  const mockHandleLogout = jest.fn();

  beforeEach(() => {
    (useMenuContext as jest.Mock).mockReturnValue(mockMenuContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (useGetProfileInfo as jest.Mock).mockReturnValue(mockProfileInfo);
    (useLogout as jest.Mock).mockReturnValue({ handleLogout: mockHandleLogout });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle screen navigation when logged in', async () => {
    const { result } = renderHook(() => useMenu());
    await act(async () => {
      await result.current.handleScreenNavigation();
    });
    expect(result.current.loading).toBe(false);
    expect(mockHandleLogout).toHaveBeenCalled();
  });

  it('should handle screen navigation when not logged in', async () => {
    const updateMockMenuContext = {
      ...mockMenuContext,
      loggedIn: false,
    };
    (useMenuContext as jest.Mock).mockReturnValue(updateMockMenuContext);
    const { result } = renderHook(() => useMenu());
    await act(async () => {
      await result.current.handleScreenNavigation();
    });
    expect(mockMenuContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.PERSONAL_DETAILS });
  });

  it('should confirm assessment alert and open URL', async () => {
    const clientStorage = {
      getObject: jest.fn().mockResolvedValue({ clientName: 'Test Client' }),
    };
    (storage as jest.Mock).mockReturnValue(clientStorage);
    mockMenuContext.serviceProvider.callService.mockResolvedValue({
      data: { assessmentUrl: 'http://example.com' },
    });
    const { result } = renderHook(() => useMenu());
    await act(async () => {
      await result.current.assessmentAlertConfirm();
    });
    expect(Linking.openURL).toHaveBeenCalledWith('http://example.com');
  });

  it('should navigate to login screen', () => {
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.navigateToLogin();
    });
    expect(mockMenuContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: expect.any(String) });
  });

  it('should navigate to home screen', () => {
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.navigateToHomeScreen();
    });
    expect(mockMenuContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: expect.any(String) });
  });

  it('should test handleProfileNavigation with findACounselor page', () => {
    const data = { label: 'Find a Provider', redirectUrl: 'page:findACounselor.telehealth' };
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.handleProfileNavigation(data);
    });
    expect(mockMenuContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.FIND_COUNSELOR });
  });

  it('should test handleProfileNavigation with wellness page', () => {
    const data = { label: 'Find a Provider', redirectUrl: 'page:wellness' };
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.handleProfileNavigation(data);
    });
    expect(mockMenuContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.WELLBEING });
  });

  it('should test  handleProfileNavigation with credibleMind', () => {
    const data = { label: 'Plan Your Finances', redirectUrl: 'crediblemind:topics/financial-wellness?query=' };
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.handleProfileNavigation(data);
    });
    expect(mockMenuContext.navigation.navigate).toHaveBeenCalledWith(Screen.CREDIBLE_MIND, {
      url: 'topics/financial-wellness?query=',
    });
  });

  it('should test  handleProfileNavigation with default', () => {
    const data = { label: 'Plan Your Finances', redirectUrl: 'http://example.com' };
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.handleProfileNavigation(data);
    });
    expect(Linking.openURL).toHaveBeenCalledWith('http://example.com');
  });

  it('should test  handleProfileNavigation with api', () => {
    const data = {
      label: 'Support and Assessments',
      redirectUrl: 'api:assessments?surveyId=63c97a6c-716e-4006-a34c-b7dd202afa51',
    };
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.handleProfileNavigation(data);
    });
    expect(result.current.isSuccess).toBe(true);
  });

  it('should test  handleProfileNavigation with onPress', () => {
    const data = {
      label: 'Support and Assessments',
      onPress: jest.fn(),
    };
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.handleProfileNavigation(data);
    });
    expect(data.onPress).toHaveBeenCalled();
  });

  it('should test  handle assessmentAlertDismiss', () => {
    const { result } = renderHook(() => useMenu());
    act(() => {
      result.current.assessmentAlertDismiss();
    });
    expect(result.current.isSuccess).toBe(false);
  });
});
