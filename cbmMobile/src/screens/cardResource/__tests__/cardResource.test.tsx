import { render } from '@testing-library/react-native';
import React from 'react';

import { AppContextWapper } from '../../../context/appContextWrapper';
import { getClientDetails } from '../../../util/commonUtils';
import { CardResource } from '../cardResource';
import { useCardResource } from '../useCardResource';

jest.mock('../useCardResource');
jest.mock('../../../util/commonUtils');

const mockUseCardResource = useCardResource as jest.MockedFunction<typeof useCardResource>;

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

describe('CardResource', () => {
  const navigateToCredibleMind = jest.fn();
  const navigateToResourceLibrary = jest.fn();

  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockUseCardResource.mockReturnValue({
      contentInfo,
      loading: true,
      bannerButtons: [],
      onPressBannerButton: jest.fn(),
      onPressContactNo: jest.fn(),
    });

    const { getByTestId } = render(
      <AppContextWapper>
        <CardResource
          path="test-path"
          navigateToCredibleMind={navigateToCredibleMind}
          navigateToResourceLibrary={navigateToResourceLibrary}
        />
      </AppContextWapper>
    );

    expect(getByTestId('progress-modal')).toBeTruthy();
  });
});
