import { act, renderHook } from '@testing-library/react-hooks';

import { AppUrl } from '../../../shared/src/models';
import { useAppContext } from '../../context/appContext';
import { RequestMethod } from '../../models/adapters';
import { storage } from '../../util/storage';
import { useChatInit } from '../useChatInit';

jest.mock('../../context/appContext');
jest.mock('../../util/storage');

describe('useChatInit', () => {
  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };

  const mockContext = {
    serviceProvider: {
      callService: jest.fn(),
    },
    navigationHandler: mockNavigationHandler,
    loggedIn: true,
    setChatConfig: jest.fn(),
    chatConfig: {
      environment: 'environment',
      deploymentId: 'deploymentId',
      urL: '',
    },
    client: {
      userName: 'testUser',
    },
  };

  const mockChatStorage = {
    getObject: jest.fn(),
  };

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue(mockContext);
    (storage as jest.Mock).mockReturnValue(mockChatStorage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set loading to true and call service to check chat availability', async () => {
    const { result } = renderHook(() => useChatInit());

    await act(async () => {
      await result.current.checkChatAvailability();
    });

    expect(result.current.loading).toBe(false);
    expect(mockContext.serviceProvider.callService).toHaveBeenCalledWith(
      `/secure/undefined/en/undefined/chat/availability`,
      RequestMethod.GET,
      null,
      { isSecureToken: true }
    );
  });

  it('should navigate to start chat if chat is available', async () => {
    mockContext.serviceProvider.callService.mockResolvedValue({
      data: { isChatFlowEnabled: true, config: '' },
    });

    const { result } = renderHook(() => useChatInit());

    await act(async () => {
      await result.current.checkChatAvailability();
    });

    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({
      action: AppUrl.START_CHAT,
    });
  });

  it('should set loading to false if an error occurs', async () => {
    mockContext.serviceProvider.callService.mockRejectedValue(new Error('Test error'));

    const { result } = renderHook(() => useChatInit());

    await act(async () => {
      await result.current.checkChatAvailability();
    });

    expect(result.current.loading).toBe(false);
  });

  it('should set loading to true and call service to start chat session', async () => {
    const sessionData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      lob: 'TestLOB',
    };
    const response = {
      data: { key: 'testKey' },
    };

    mockContext.serviceProvider.callService.mockResolvedValue(response);

    const { result } = renderHook(() => useChatInit());

    await act(async () => {
      await result.current.startChatSession(sessionData);
    });

    expect(result.current.loading).toBe(false);
    expect(mockContext.serviceProvider.callService).toHaveBeenCalledWith(
      `/secure/undefined/en/undefined/chat/session`,
      RequestMethod.POST,
      sessionData,
      { isSecureToken: true }
    );
    expect(mockContext.setChatConfig).toHaveBeenCalledWith({
      ...mockContext.chatConfig,
      key: 'testKey',
    });
    expect(mockNavigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.CHAT });
  });

  it('should set loading to false if an error occurs during startChatSession', async () => {
    const sessionData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      lob: 'TestLOB',
    };

    mockContext.serviceProvider.callService.mockRejectedValue(new Error('Test error'));

    const { result } = renderHook(() => useChatInit());

    await act(async () => {
      await result.current.startChatSession(sessionData);
    });

    expect(result.current.loading).toBe(false);
  });
});
