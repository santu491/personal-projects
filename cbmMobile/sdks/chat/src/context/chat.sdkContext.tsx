import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { AppContextType } from '../../../../src/context/appContext';
import { ChatNavigationProp } from '../navigation/chat.navigationTypes';

export type ChatContextType = AppContextType;

const ChatContext = React.createContext<ChatContextType | null>(null);

const useChatContextOnly = (): ChatContextType => {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export function useChatContext(): WithNavigation<ChatNavigationProp, ChatContextType> {
  return useWithNavigation<ChatNavigationProp, ChatContextType>(useChatContextOnly());
}

export { ChatContext };
