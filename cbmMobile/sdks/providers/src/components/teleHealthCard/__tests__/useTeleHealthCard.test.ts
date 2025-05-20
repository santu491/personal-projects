import { act, renderHook } from '@testing-library/react-hooks';
import { Linking } from 'react-native';

import { AppUrl } from '../../../../../../shared/src/models';
import { useGetMdLiveData } from '../../../../../../src/hooks/useGetMdLiveData';
import { mockProviderInfo } from '../../../__mocks__/mockProviderInfo';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useTeleHelathCard } from '../useTeleHealthCard';

jest.mock('../../../context/provider.sdkContext');
jest.mock('../../../../../../src/hooks/useGetMdLiveData');

const teleHealth = {
  type: 'CardModel',
  path: '/content/dam/careloneap/content-fragments/tele-health-cards/company-demo/md-live',
  title: 'Emotional support',
  description:
    'Members, dependents, and household family members 10 and older can get matched with a counselor for support via virtual sessions by phone or video.',
  image: 'https://qa.aem.carelonwellbeing.com/content/dam/careloneap/icons/mdlive.png',
  buttonText: 'Get started',
  redirectUrl: 'api:telehealth.emotionalSupport',
  openURLInNewTab: true,
};

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({
    params: {
      teleHealthData: teleHealth,
    },
  }),
}));

describe('useTeleHealthCard', () => {
  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };
  const mockCallService = jest.fn();

  const mockContext = {
    client: {},
    navigationHandler: mockNavigationHandler,
    loggedIn: true,
    serviceProvider: {
      callService: mockCallService,
    },
  };

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue(mockContext);
    (useGetMdLiveData as jest.Mock).mockReturnValue({
      useGetMdLiveData,
      setShowError: jest.fn(),
      showError: false,
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useTeleHelathCard(mockProviderInfo));
    expect(result.current.loading).toBe(false);
    expect(result.current.modelVisible).toBe(false);
    expect(result.current.showError).toBe(false);
  });

  it('should handle try again', () => {
    const { result } = renderHook(() => useTeleHelathCard(mockProviderInfo));
    act(() => {
      result.current.handleTryAgain();
    });
    expect(result.current.modelVisible).toBe(false);
  });

  it('should test onHandleVisitWebSite with native navigation', () => {
    mockCallService.mockResolvedValue({ data: true });
    const { result } = renderHook(() =>
      useTeleHelathCard({
        ...mockProviderInfo,
        visitButton: {
          ariaLabel: '',
          href: 'page:providers.findCounselor',
          isExternal: false,
          label: '',
          openAsSSP: false,
        },
      })
    );
    act(() => {
      result.current.onHandleVisitWebSite();
    });
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({
      action: AppUrl.FIND_COUNSELOR,
    });
  });

  it('should call Linking.openURL when visitButton href is HTTPS', () => {
    const { result } = renderHook(() => useTeleHelathCard(mockProviderInfo));
    Linking.openURL = jest.fn();
    act(() => {
      result.current.onHandleVisitWebSite();
    });
    if (mockProviderInfo.visitButton?.href) {
      expect(Linking.openURL).toHaveBeenCalledWith(mockProviderInfo.visitButton.href);
    }
  });

  it('should toggle showError or modelVisible when handleTryAgain is invoked', () => {
    const { result } = renderHook(() => useTeleHelathCard(mockProviderInfo));
    act(() => {
      result.current.handleTryAgain();
    });
    expect(result.current.modelVisible).toBe(false);
  });
});
