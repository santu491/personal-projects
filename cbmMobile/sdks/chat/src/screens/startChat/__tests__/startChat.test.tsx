/* eslint-disable @typescript-eslint/naming-convention */
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { ChatMockContextWrapper } from '../../../__mocks__/chatMockContextWrapper';
import { useChatContext } from '../../../context/chat.sdkContext';
import { StartChat } from '../startChat';
import { useStartChat } from '../useStartChat';

jest.mock('../useStartChat');
jest.mock('../../../context/chat.sdkContext');
jest.mock('../../../../../../src/util/commonUtils');

const SUPPORT_NUMBER = '8888888888';

const mockOnChange = jest.fn();
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
  Controller: jest.fn(({ render: renderFn }) =>
    renderFn({
      field: { onChange: mockOnChange, onBlur: jest.fn(), value: '' },
      fieldState: { isTouched: true, error: { message: 'First name is required' } },
    })
  ),
}));

describe('StartChat', () => {
  const mockUseStartChat = useStartChat as jest.Mock;
  const mockUseChatContext = useChatContext as jest.Mock;

  mockUseChatContext.mockReturnValue({
    navigationHandler: {
      linkTo: jest.fn(),
    },
    genesysChat: {
      closedHeader: 'closedHeader',
      closedSupportAssistance: `closedSupportAssistance ${SUPPORT_NUMBER}`,
      header: `header ${SUPPORT_NUMBER}`,
      anonymousUserHeader: 'anonymousUserHeader',
    },
  });

  beforeEach(() => {
    mockUseStartChat.mockReturnValue({
      loading: false,
      t: jest.fn((key) => key),
      control: {},
      onStartChatButtonClick: jest.fn(),
      formState: { isValid: true },
      phoneNumberTapped: jest.fn(),
      isChatFlowEnabled: true,
      supportNumber: SUPPORT_NUMBER,
      genesysChat: {
        closedHeader: 'closedHeader',
        closedSupportAssistance: `closedSupportAssistance ${SUPPORT_NUMBER}`,
        header: `header ${SUPPORT_NUMBER}`,
        anonymousUserHeader: 'anonymousUserHeader',
      },
    });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when chat is available', () => {
    const { getByText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByText('header')).toBeTruthy();
  });

  it('renders correctly when chat is not available', () => {
    mockUseStartChat.mockReturnValueOnce({
      ...mockUseStartChat(),
      isChatFlowEnabled: false,
    });
    const { getByText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByText('closedHeader')).toBeTruthy();
  });

  it('calls onStartChatButtonClick when the start chat button is pressed', () => {
    const { getByTestId } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const startChatButton = getByTestId('chat.button.startChat');
    fireEvent.press(startChatButton);
    expect(mockUseStartChat().onStartChatButtonClick).toHaveBeenCalled();
  });

  it('disables the start chat button when the form is invalid', () => {
    mockUseStartChat.mockReturnValueOnce({
      ...mockUseStartChat(),
      formState: { isValid: false },
    });
    const { getByTestId } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const startChatButton = getByTestId('chat.button.startChat');
    expect(startChatButton.props.accessibilityState.disabled).toBe(true);
  });

  it('calls phoneNumberTapped when the phone number link is pressed', () => {
    const { getByText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const phoneNumberLink = getByText(SUPPORT_NUMBER);
    fireEvent.press(phoneNumberLink);
    expect(mockUseStartChat().phoneNumberTapped).toHaveBeenCalled();
  });

  it('renders the first name input field correctly', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByPlaceholderText('chat.firstNamePlaceholder')).toBeTruthy();
  });

  it('renders the last name input field correctly', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByPlaceholderText('chat.lastNamePlaceholder')).toBeTruthy();
  });

  it('renders the email input field correctly', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByPlaceholderText('chat.emailPlaceholder')).toBeTruthy();
  });

  it('renders the phone number input field correctly', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByPlaceholderText('chat.phoneNumberPlaceholder')).toBeTruthy();
  });
  it('renders the chat offline component when chat is not available', () => {
    mockUseStartChat.mockReturnValueOnce({
      ...mockUseStartChat(),
      isChatFlowEnabled: false,
    });
    const { getByText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByText('closedSupportAssistance 8888888888')).toBeTruthy();
  });

  it('renders the loading indicator when loading is true', () => {
    mockUseStartChat.mockReturnValueOnce({
      ...mockUseStartChat(),
      loading: true,
    });
    const { getByTestId } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    expect(getByTestId('progress-modal')).toBeTruthy();
  });

  it('should call updateApiError when first name input loses focus', async () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const firstNameInput = getByPlaceholderText('chat.firstNamePlaceholder');
    fireEvent(firstNameInput, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call updateApiError when last name input loses focus', async () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const lastNameInput = getByPlaceholderText('chat.lastNamePlaceholder');
    fireEvent(lastNameInput, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call updateApiError when email input loses focus', async () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const lastNameInput = getByPlaceholderText('chat.emailPlaceholder');
    fireEvent(lastNameInput, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call updateApiError when phone number input loses focus', async () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const lastNameInput = getByPlaceholderText('chat.phoneNumberPlaceholder');
    fireEvent(lastNameInput, 'blur');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onChangeText when first name input changes', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const firstNameInput = getByPlaceholderText('chat.firstNamePlaceholder');
    fireEvent.changeText(firstNameInput, 'John');
    expect(mockOnChange).toHaveBeenCalledWith('John');
  });

  it('should call onChangeText when last name input changes', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const lastNameInput = getByPlaceholderText('chat.lastNamePlaceholder');
    fireEvent.changeText(lastNameInput, 'Doe');
    expect(mockOnChange).toHaveBeenCalledWith('Doe');
  });

  it('should call onChangeText when email input changes', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const emailInput = getByPlaceholderText('chat.emailPlaceholder');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    expect(mockOnChange).toHaveBeenCalledWith('john.doe@example.com');
  });

  it('should call onChangeText when phone number input changes', () => {
    const { getByPlaceholderText } = render(
      <ChatMockContextWrapper>
        <StartChat />
      </ChatMockContextWrapper>
    );
    const phoneNumberInput = getByPlaceholderText('chat.phoneNumberPlaceholder');
    fireEvent.changeText(phoneNumberInput, '1234567890');
    expect(mockOnChange).toHaveBeenCalledWith('1234567890');
  });
});
