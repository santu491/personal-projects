import { useRoute } from '@react-navigation/native';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAppContext } from '../../../../../../src/context/appContext';
import { mockProviderInfo } from '../../../__mocks__/mockProviderInfo';
import { getProvidersMockContext } from '../../../__mocks__/providersContext';
import { useProviderContext } from '../../../context/provider.sdkContext';
import { useProviderDetail } from '../useProviderDetail';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('../../../context/provider.sdkContext', () => ({
  useProviderContext: jest.fn(),
}));

jest.mock('../../../../../../src/context/appContext', () => ({
  useAppContext: jest.fn(),
}));

describe('useProviderDetail', () => {
  const mockProviderContext = {
    ...getProvidersMockContext(),
    loggedIn: true,
    memberAppointmentStatus: {
      isAppointmentConfirmed: false,
      isContinue: false,
      isPending: true,
    },
    navigation: {
      navigate: jest.fn(),
    },
  };

  const mockAppContext = {
    setMemberAppointStatus: jest.fn(),
  };

  const mockRouteParams = {
    provider: mockProviderInfo,
  };

  beforeEach(() => {
    (useProviderContext as jest.Mock).mockReturnValue(mockProviderContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    (useRoute as jest.Mock).mockReturnValue({ params: mockRouteParams });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should test handleShowMore', () => {
    const { result } = renderHook(() => useProviderDetail());
    act(() => {
      result.current.handleShowMore();
    });
    expect(result.current.viewAll).toBeTruthy();
  });
});
