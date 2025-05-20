/* eslint-disable @typescript-eslint/naming-convention */
import { renderHook } from '@testing-library/react-hooks';

import { getMockAppContext } from '../../../../../../src/__mocks__/appContext';
import { useAppContext } from '../../../../../../src/context/appContext';
import { mockProviderInfo } from '../../../__mocks__/mockProviderInfo';
import { getProvidersMockContext } from '../../../__mocks__/providersContext';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useProviderList } from '../useProviderList';

jest.mock('../../../context/provider.sdkContext');
jest.mock('../../../../../../src/context/appContext');

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),

  useIsFocused: () => true,

  useRoute: () => ({
    params: {
      wellnessSelectedTopics: [],
      wellnessTopicsList: [],
    },
  }),
}));
const mockCallService = jest.fn();

const providerData = [
  {
    ...mockProviderInfo,
  },
];

const providersFiltersInfo = [
  {
    name: '',
    attribute: 'onlineAppointmentScheduleFlag',
    data: [
      {
        title: 'Accepts online appointment requests',
        count: 77,
        isSelected: true,
        attribute: 'onlineAppointmentScheduleFlag',
      },
    ],
    isCheckbox: true as const,
    isOpened: false,
  },
  {
    name: 'Product Types',
    attribute: 'productType.name.keyword',
    data: [
      { title: 'EMPLOYEE ASSISTANCE PROGRAM', count: 77, isSelected: true, attribute: 'productType.name.keyword' },
    ],
    isOpened: true,
    isCheckbox: true as const,
  },
];

const providersFilterQueryInfo = [
  { bool: { should: [{ match_phrase: { onlineAppointmentScheduleFlag: 1 } }] } },
  { bool: { should: [{ match_phrase: { 'productType.name.keyword': 'EMPLOYEE ASSISTANCE PROGRAM' } }] } },
];

const mockProviderContext = {
  ...getProvidersMockContext(),
  navigation: {
    setOptions: jest.fn(),
    navigate: jest.fn(),
  },
};

const mockSetScheduleAppointmentInfo = jest.fn();
const mockSetIsBottomTabBarDisabled = jest.fn();
// const mockUseIsFocused = useIsFocused as jest.Mock;

describe('useProviderList', () => {
  const mockShowAlert = jest.fn();
  const mockSetSelectedProviders = jest.fn();
  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      scheduleAppointmentInfo: { memberSlot: { days: ['monday'] } },
      setScheduleAppointmentInfo: mockSetScheduleAppointmentInfo,
      setIsBottomTabBarDisabled: mockSetIsBottomTabBarDisabled,
      showAlert: mockShowAlert,
      setSelectedProviders: mockSetSelectedProviders,
    });
    (useAppContext as jest.Mock).mockReturnValue({
      ...getMockAppContext(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize state variables correctly', () => {
    const { result } = renderHook(() => useProviderList());

    expect(result.current.showMoveToTopIndicator).toBe(false);
    expect(result.current.isFilterModalEnabled).toBe(false);
    expect(result.current.isFilterSelected).toBe(false);
  });

  it('should extract context values correctly', () => {
    const { result } = renderHook(() => useProviderList());
    expect(result.current.loggedIn).toBe(mockProviderContext.loggedIn);
    expect(result.current.geoCoordinates).toEqual({ latitude: 0, longitude: 0 });
  });

  it('should extract selectedProviders from context', () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
    });

    const { result } = renderHook(() => useProviderList());

    expect(result.current.selectedProviders).toEqual(providerData);
  });

  it('should navigate to navigateToLoginScreen', () => {
    const { result } = renderHook(() => useProviderList());
    result.current.navigateToLoginScreen();
  });

  it('should test onPress onPressFilterButton', () => {
    const { result } = renderHook(() => useProviderList());
    result.current.onPressFilterButton();
    expect(result.current.isFilterModalEnabled).toBe(true);
  });

  it('should test onPress closeModelPopup', () => {
    const { result } = renderHook(() => useProviderList());
    result.current.closeModelPopup();
    expect(result.current.isSortEnabled).toBe(false);
  });

  it('should test onPress clearFilters', async () => {
    const mockResponse = {
      data: {
        filters: [],
        providers: providerData,
        total: 1,
      },
    };
    const mockSetProvidersListArray = jest.fn();
    mockCallService.mockResolvedValue(mockResponse);
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      setProvidersListArray: mockSetProvidersListArray,
      serviceProvider: {
        callService: mockCallService,
      },
    });
    const { result } = renderHook(() => useProviderList());
    result.current.clearFilters();
    expect(mockSetProvidersListArray).toHaveBeenCalledWith([...providerData]);
  });

  it('should test onPress onPressFilterOption', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    const option = { count: 77, isSelected: false, title: 'EMPLOYEE ASSISTANCE PROGRAM', attribute: '' };
    const section = {
      attribute: 'productType.name.keyword',
      data: [
        { count: 77, isSelected: true, title: 'EMPLOYEE ASSISTANCE PROGRAM', attribute: 'productType.name.keyword' },
      ],
      isOpened: true,
      name: 'Product Types',
    };
    result.current.onPressFilterOption(option, section);
  });

  it('should test onPress onPressFilterSection', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressFilterSection('productType.name.keyword');
  });

  it('should test onPress onPressFilterResults', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressFilterResults(providersFiltersInfo, providersFilterQueryInfo);
  });

  it('should test onPress onCloseFilters', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onCloseFilters();
  });

  it('should test onPress handleScrollToTop', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.handleScrollToTop();
  });

  it('should test onPress onPressSortButton', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressSortButton();
    expect(result.current.isSortEnabled).toBe(true);
  });

  it('should test onPress onScroll', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onScroll(20);
    expect(result.current.isSortEnabled).toBe(false);
  });

  it('should test onMomentumScrollEnd', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onMomentumScrollEnd();
  });

  it('should test onPress onPressSortInfo', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressSortInfo({ id: 2, label: 'Distance: Nearest first' });
  });

  it('should test onPress onPressDistanceInfo', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressDistanceInfo({ id: 3, label: '10 miles', query: '10' });
  });

  it('should test onPress onSubmitLocation', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onSubmitLocation({
      geoCoordinates: { latitude: 40.7127753, longitude: -74.0059728 },
      location: 'New York, NY, USA',
      state: 'NY',
    });
  });

  it('should test onPress onSubmitCounselor', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onSubmitCounselor('Laura');
  });

  it('should test onPress onPressAppointmentRequest with out login', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressAppointmentRequest();
  });

  it('should test onPress onPressAppointmentRequest with login', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
      loggedIn: true,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onPressAppointmentRequest();
  });

  it('should test onPress onHandleSelectProvider with memberAppointmentStatus as pending', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
      loggedIn: true,
      memberAppointmentStatus: {
        isPending: true,
      },
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onHandleSelectProvider(providerData[0], 0);
  });

  it('should test onPress onHandleSelectProvider with memberAppointmentStatus as pending', async () => {
    jest.mock('@react-navigation/native', () => ({
      ...jest.requireActual('@react-navigation/native'),

      useIsFocused: () => true,

      useRoute: () => ({
        params: {
          wellnessSelectedTopics: [],
          wellnessTopicsList: [],
          hasEditCounselor: true,
        },
      }),
    }));
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
      loggedIn: true,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onHandleSelectProvider(providerData[0], 0);
  });

  it('should test onPress onHandleSelectProvider with memberAppointmentStatus as isAppointmentConfirmed', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
      loggedIn: true,
      memberAppointmentStatus: {
        isAppointmentConfirmed: true,
      },
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onHandleSelectProvider(providerData[0], 0);
  });
  it('should test onPress onHandleSelectProvider with memberAppointmentStatus as isContinue', async () => {
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
      loggedIn: true,
      memberAppointmentStatus: {
        isContinue: true,
        data: providerData,
      },
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onHandleSelectProvider(providerData[0], 0);
  });
  it('should test onPress onHandleSelectProvider', async () => {
    const setSelectedProviders = jest.fn();
    (useProviderContext as jest.Mock).mockReturnValue({
      ...mockProviderContext,
      providersListArray: providerData,
      selectedProviders: providerData,
      providersFiltersInfo,
      providersFilterQueryInfo,
      loggedIn: true,
      setSelectedProviders,
    });
    const { result } = renderHook(() => useProviderList());
    result.current.onHandleSelectProvider(providerData[0], 0);
  });
});
