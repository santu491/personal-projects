import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { useChatContext } from '../../context/chat.sdkContext';
import { ChatOfflineComponent } from '../chatOffline';
import { useChatOffline } from '../useChatOffline';

const SUPPORT_NUMBER = '888-888-8888';

jest.mock('../../context/chat.sdkContext');
jest.mock('../../../../../shared/src/utils/utils');
jest.mock('../useChatOffline');

describe('ChatOfflineComponent', () => {
  const mockUseChatContext = useChatContext as jest.Mock;
  const mockUseChatOffline = useChatOffline as jest.Mock;
  const mockPhoneNumberTapped = jest.fn();
  const mockNaviagteToHomeScreen = jest.fn();

  beforeEach(() => {
    mockUseChatContext.mockReturnValue({
      navigationHandler: {
        linkTo: jest.fn(),
      },
      genesysChat: {
        closedHeader: 'closedHeader',
        closedSupportAssistance: `closedSupportAssistance ${SUPPORT_NUMBER}`,
      },
    });
    mockUseChatOffline.mockReturnValue({
      supportNumber: SUPPORT_NUMBER,
      phoneNumberTapped: mockPhoneNumberTapped,
      naviagteToHomeScreen: mockNaviagteToHomeScreen,
      t: jest.fn((key) => key),
      genesysChat: {
        closedHeader: 'closedHeader',
        closedSupportAssistance: `closedSupportAssistance ${SUPPORT_NUMBER}`,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<ChatOfflineComponent />);
    expect(getByText('closedHeader')).toBeTruthy();
  });

  it('calls phoneNumberTapped when the phone number link is pressed', () => {
    const { getByText } = render(<ChatOfflineComponent />);
    const phoneNumberLink = getByText(SUPPORT_NUMBER);
    fireEvent.press(phoneNumberLink);
    expect(mockPhoneNumberTapped).toHaveBeenCalled();
  });

  it('calls naviagteToHomeScreen when the home button is pressed', () => {
    const { getByTestId } = render(<ChatOfflineComponent />);
    const homeButton = getByTestId('chat.offline.homeButton');
    fireEvent.press(homeButton);
    expect(mockNaviagteToHomeScreen).toHaveBeenCalled();
  });
});
