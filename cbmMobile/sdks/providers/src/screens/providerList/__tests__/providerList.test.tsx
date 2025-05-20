import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppStatus } from '../../../../../../src/screens/appInit/appInitContext';
import { useAppInitInner } from '../../../../../../src/screens/appInit/useAppInitInner';
import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { mockProviderInfo } from '../../../__mocks__/mockProviderInfo';
import { ProvidersMockContextWrapper } from '../../../__mocks__/providersMockContextWrapper';
import { ProviderListScreen } from '../providerList';
import { useProviderList } from '../useProviderList';

jest.mock('../../../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
    setOptions: jest.fn(),
    useIsFocused: jest.fn(),
    addListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      searchPayload: {
        geoCoordinates: '',
        counselorName: '',
        providerLocation: '',
      },
    },
  }),
}));

jest.mock('../../../../../../src/screens/appInit/useAppInitInner', () => ({
  useAppInitInner: jest.fn(),
}));

jest.mock('../useProviderList', () => ({
  useProviderList: jest.fn(),
}));

const mockUseProviderList = useProviderList as jest.Mock;

const providerData = [
  {
    ...mockProviderInfo,
  },
];

const mockUseProviderData = {
  clearFilters: jest.fn(),
  distanceArray: [],
  selectedProviders: [],
  providersFiltersInfo: {},
  isFilterModalEnabled: false,
  handleScrollToTop: jest.fn(),
  loading: false,
  navigateToProviderDetailScreen: jest.fn(),
  onPressDistanceButton: jest.fn(),
  onPressFilterOption: jest.fn(),
  onPressFilterSection: jest.fn(),
  onCloseFilters: jest.fn(),
  isFilterSelected: false,
  page: 0,
  providersListArray: [],
  providersResultCount: 0,
  onPressSortButton: jest.fn(),
  showMoveToTopIndicator: false,
  sortArray: [],
  onMomentumScrollEnd: jest.fn(),
  onPressFilterButton: jest.fn(),
  onScroll: jest.fn(),
  scrollRef: { current: null },
  onPressAppointmentRequest: jest.fn(),
  getSelectedSortInfo: { id: 1, label: 'Default' },
  getSelectedDistanceInfo: { id: 2, label: '5 miles', query: '5' },
  onPressSortInfo: jest.fn(),
  onPressDistanceInfo: jest.fn(),
  isSortEnabled: false,
  isDistanceEnabled: false,
  closeModelPopup: jest.fn(),
  onSubmitLocation: jest.fn(),
  onSubmitCounselor: jest.fn(),
  alertInfo: null,
  isAlertEnabled: false,
  hasEditCounselor: false,
  onHandleSelectProvider: jest.fn(),
  isAppointmentCardDisabled: false,
};

describe('ProviderListScreen', () => {
  beforeEach(() => {
    mockUseProviderList.mockReturnValue(mockUseProviderData);
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  const mockProviderList = () => {
    return render(
      <ProvidersMockContextWrapper>
        <ProviderListScreen />
      </ProvidersMockContextWrapper>
    );
  };

  it('should render the selected providers view when there are selected providers', async () => {
    (useProviderList as jest.Mock).mockReturnValue({
      ...mockUseProviderData,
      selectedProviders: [{ id: '1', name: 'Provider 1' }],
      hasEditCounselor: false,
      clearFilters: jest.fn(),
    });
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    const { getByTestId } = mockProviderList();
    await act(async () => {});
    expect(getByTestId('providerList.selectedResultCountView')).toBeTruthy();
  });

  it('should render providers.flatList', async () => {
    (useProviderList as jest.Mock).mockReturnValue({
      ...mockUseProviderData,
      providersListArray: providerData,
      providersResultCount: 1,
    });
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    const { getByTestId } = mockProviderList();
    await act(async () => {});
    fireEvent(getByTestId('profile-title'), 'onPress');
  });

  it('should render selectButton', async () => {
    (useProviderList as jest.Mock).mockReturnValue({
      ...mockUseProviderData,
      providersListArray: providerData,
      providersResultCount: 1,
      selectedProviders: providerData[0],
    });
    (useAppInitInner as jest.Mock).mockReturnValue({
      appStatus: AppStatus.READY,
      contextValue: {},
    });
    const { getByTestId } = mockProviderList();
    await act(async () => {});
    fireEvent(getByTestId('provider.selectButton'), 'onPress');
  });
});
