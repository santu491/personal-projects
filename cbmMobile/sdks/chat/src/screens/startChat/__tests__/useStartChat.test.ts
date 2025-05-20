import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from 'react-hook-form';

import { callNumber } from '../../../../../../shared/src/utils/utils';
import { useAppContext } from '../../../../../../src/context/appContext';
import { useChatInit } from '../../../../../../src/hooks/useChatInit';
import { useChatContext } from '../../../context/chat.sdkContext';
import { useStartChat } from '../useStartChat';

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

jest.mock('../../../../../../src/context/appContext');

jest.mock('../../../context/chat.sdkContext');

jest.mock('../../../../../../shared/src/utils/utils');

jest.mock('../../../../../../src/hooks/useChatInit', () => ({
  useChatInit: jest.fn(),
}));

describe('useStartChat', () => {
  const mockForm = {
    control: {},
    formState: {},
    getValues: jest.fn(),
  };

  const mockChatInit = {
    startChatSession: jest.fn(),
    loading: false,
  };

  const mockContext = {
    serviceProvider: {
      callService: jest.fn(),
    },
    navigationHandler: {
      linkTo: jest.fn(),
    },
    loggedIn: true,
    setChatConfig: jest.fn(),
    chatConfig: {
      environment: 'environment',
      deploymentId: 'deploymentId',
      url: '',
      isChatFlowEnabled: true,
    },
    client: { supportNumber: '1234567890', userName: 'testUser' },
  };

  beforeEach(() => {
    (useForm as jest.Mock).mockReturnValue(mockForm);
    (useAppContext as jest.Mock).mockReturnValue(mockContext);
    (useChatContext as jest.Mock).mockReturnValue({
      ...mockContext,
      client: { ...mockContext.client, userName: 'testUser' },
    });
    (useChatInit as jest.Mock).mockReturnValue(mockChatInit);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', async () => {
    const { result } = renderHook(() => useStartChat());

    expect(result.current.isChatFlowEnabled).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it('should call startChatSession with correct data on onStartChatButtonClick', async () => {
    const { result } = renderHook(() => useStartChat());

    mockForm.getValues.mockReturnValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      lob: mockContext.client.userName, // Dynamically set lob to match mockContext.client.userName
    });

    await act(async () => {
      await result.current.onStartChatButtonClick();
    });

    expect(mockChatInit.startChatSession).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      lob: '',
    });
  });

  it('should call callNumber with supportNumber on phoneNumberTapped', async () => {
    const { result } = renderHook(() => useStartChat());

    act(() => {
      result.current.phoneNumberTapped();
    });

    expect(callNumber).toHaveBeenCalledWith('1234567890');
  });

  it('should not call callNumber if supportNumber is undefined', async () => {
    (useChatContext as jest.Mock).mockReturnValue({ ...mockContext, client: { supportNumber: undefined } });
    const { result } = renderHook(() => useStartChat());
    act(() => {
      result.current.phoneNumberTapped();
    });

    expect(callNumber).not.toHaveBeenCalled();
  });
});
