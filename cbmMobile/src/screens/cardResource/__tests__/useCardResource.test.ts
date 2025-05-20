import { act, renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import { Linking } from 'react-native';

import { callNumber } from '../../../../shared/src/utils/utils';
import { getMockAppContext } from '../../../__mocks__/appContext';
import { useAppContext } from '../../../context/appContext';
import { CardResourceDTO } from '../../../models/cardResource';
import { useCardResource } from '../useCardResource';

jest.mock('../../../context/appContext');
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));
jest.mock('../../../../shared/src/utils/utils');

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('useCardResource', () => {
  const navigateToCredibleMind = jest.fn();
  const navigateToResourceLibrary = jest.fn();
  const mockServiceProvider = {
    callService: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAppContext.mockReturnValue({
      ...getMockAppContext(),
      serviceProvider: mockServiceProvider,
    });
  });
  const contentInfo = {
    page: {
      title: 'Get your finances in order',
      subtitle: 'Get professional and personalized advice.',
      cards: {
        banner: {
          title: 'Financial planning',
          image:
            'https://assets.anthem.com/is/image/anthem/fp_mature_couple_meeting_with_financial_advisor?$defaultResponsive$',
          description: 'Explore additional resources to improve your financial mental wellbeing.',
          buttons: {
            learnMore: {
              openURLInNewTab: false,
              redirectUrl: 'crediblemind:topics/financial-wellness?query=',
              enabled: true,
              label: 'Learn more',
              page: undefined,
            },
            chat: { enabled: false, label: 'Chat services' },
          },
        },
        contact: {
          number: '833-210-6016',
          title: '',
          description: 'To request a consultation, call',
          image: 'https://assets.anthem.com/is/image/anthem/group-7-copy?$defaultResponsive$',
        },
        getHelpCases: {
          title: 'Get help with',
          data: [
            {
              title: 'Child support',
              image:
                'https://anthem-qa1.adobecqms.net/content/dam/careloneap/icons/gethelpcases/iconography-communication-rules.png',
            },
            {
              title: 'Bankruptcy',
              image:
                'https://anthem-qa1.adobecqms.net/content/dam/careloneap/icons/gethelpcases/iconography-money-tax.png',
            },
          ],
        },
        exclusiveBenefits: {
          title: 'Exclusive benefits',
          data: [
            {
              title:
                'We’ll connect you with the right financial consultant who can help you tackle debt, set goals, and understand opportunities.',
              image:
                'https://anthem-qa1.adobecqms.net/content/dam/careloneap/images/desktop/exclusive-benefits/icons8-chat-100-3.png',
            },
          ],
        },
      },
    },
  };

  it('should fetch and set contentInfo correctly', async () => {
    const mockResponse: CardResourceDTO = {
      data: {
        page: contentInfo.page,
      },
    };

    mockServiceProvider.callService.mockResolvedValue(mockResponse);

    const { result, waitForNextUpdate } = renderHook(() =>
      useCardResource({
        path: 'test-path',
        navigateToCredibleMind,
        navigateToResourceLibrary,
      })
    );

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.contentInfo).toEqual(mockResponse.data);
  });

  it('should handle onPressBannerButton with crediblemind', () => {
    const data = cloneDeep(contentInfo);
    data.page.cards.banner.buttons.learnMore.redirectUrl = 'crediblemind:topics/financial-wellness?query=';

    const { result } = renderHook(() =>
      useCardResource({
        path: 'test-path',
        navigateToCredibleMind,
        navigateToResourceLibrary,
      })
    );

    act(() => {
      result.current.onPressBannerButton(data.page.cards.banner.buttons.learnMore);
    });

    expect(navigateToCredibleMind).toHaveBeenCalledWith('topics/financial-wellness?query=');
  });

  it('should handle onPressBannerButton with HTTPS redirection', () => {
    const data = cloneDeep(contentInfo);
    data.page.cards.banner.buttons.learnMore.redirectUrl = 'https://example.com';

    const { result } = renderHook(() =>
      useCardResource({
        path: 'test-path',
        navigateToCredibleMind,
        navigateToResourceLibrary,
      })
    );

    //   const button = { id: '1', redirectUrl: 'https://example.com' };

    act(() => {
      result.current.onPressBannerButton(data.page.cards.banner.buttons.learnMore);
    });

    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle onPressBannerButton with page', () => {
    const data = cloneDeep(contentInfo);
    data.page.cards.banner.buttons.learnMore.redirectUrl = 'page:work-life-resource-library';

    const { result } = renderHook(() =>
      useCardResource({
        path: 'test-path',
        navigateToCredibleMind,
        navigateToResourceLibrary,
      })
    );

    act(() => {
      result.current.onPressBannerButton(data.page.cards.banner.buttons.learnMore);
    });
  });

  it('should handle onPressContactNo', () => {
    const { result } = renderHook(() =>
      useCardResource({
        path: 'test-path',
        navigateToCredibleMind,
        navigateToResourceLibrary,
      })
    );

    act(() => {
      result.current.onPressContactNo('123-456-7890');
    });

    expect(callNumber).toHaveBeenCalledWith('123-456-7890');
  });
});
