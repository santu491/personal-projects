import { renderHook } from '@testing-library/react-hooks';

import { useHomeContext } from '../../context/home.sdkContext';
import { useTeleHealthHook } from '../useTeleHealthHook';

jest.mock('react-native', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Linking: {
    openURL: jest.fn(),
  },
}));

jest.mock('../../context/home.sdkContext', () => ({
  useHomeContext: jest.fn(),
}));

describe('useTeleHealthHook', () => {
  const navigationHandlerMock = {
    linkTo: jest.fn(),
  };

  beforeEach(() => {
    (useHomeContext as jest.Mock).mockReturnValue({ navigationHandler: navigationHandlerMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return teleHealthInPersonData with correct structure', () => {
    const { result } = renderHook(() => useTeleHealthHook());

    expect(result.current.teleHealthInPersonData).toHaveLength(1);
    expect(result.current.teleHealthInPersonData[0]).toMatchObject({
      title: 'home.teleHealth.searchCounselors',
      description: 'home.teleHealth.searchCounselorsDescription',
      icon: 'SearchCounselorsIcon',
    });
  });
});
