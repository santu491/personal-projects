import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { useChatInit } from '../../../hooks/useChatInit';
import { ChatInit } from '../chatInit';

jest.mock('../../../hooks/useChatInit');

describe('ChatInit', () => {
  it('should render the ProgressLoader and chat icon', () => {
    (useChatInit as jest.Mock).mockReturnValue({ checkChatAvailability: jest.fn(), loading: true });

    const { getByTestId } = render(<ChatInit />);

    expect(getByTestId('progress-modal')).toBeTruthy();
    expect(getByTestId('chat-icon')).toBeTruthy();
  });

  it('should call checkChatAvailability when chat icon is pressed', () => {
    const mockCheckChatAvailability = jest.fn();
    (useChatInit as jest.Mock).mockReturnValue({ checkChatAvailability: mockCheckChatAvailability, loading: false });

    const { getByTestId } = render(<ChatInit />);
    fireEvent.press(getByTestId('chat-icon'));

    expect(mockCheckChatAvailability).toHaveBeenCalled();
  });

  it('should show ProgressLoader when loading is true', () => {
    (useChatInit as jest.Mock).mockReturnValue({ checkChatAvailability: jest.fn(), loading: true });

    const { getByTestId } = render(<ChatInit />);

    expect(getByTestId('progress-modal')).toBeTruthy();
  });
});
