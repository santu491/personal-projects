import React, { useMemo } from 'react';

import { useAppContext } from '../../../src/context/appContext';
import { ChatContext, ChatContextType } from './context/chat.sdkContext';

export const ChatSDK = ({ children }: { children: React.ReactNode }) => {
  const appContext = useAppContext();

  const context: ChatContextType = useMemo(() => {
    return {
      ...appContext,
    };
  }, [appContext]);

  return (
    <>
      <ChatContext.Provider value={context}>{children}</ChatContext.Provider>
    </>
  );
};
