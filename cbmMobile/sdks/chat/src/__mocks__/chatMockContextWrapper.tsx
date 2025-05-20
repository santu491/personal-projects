import React from 'react';

import { AppMockContextWapper } from '../../../../src/__mocks__/appMockContextWrapper';
import { AppContextType } from '../../../../src/context/appContext';
import { ChatContext, ChatContextType } from '../context/chat.sdkContext';
import { getMockChatContext } from './chatContext';

export const ChatMockContextWrapper = ({
  children,
  authContextProps,
  appContextProps,
}: {
  appContextProps?: AppContextType;
  authContextProps?: ChatContextType;
  children: React.ReactNode;
}) => {
  let chatProps = getMockChatContext();
  if (authContextProps) {
    chatProps = {
      ...chatProps,
      ...authContextProps,
    };
  }

  return (
    <AppMockContextWapper {...appContextProps}>
      <ChatContext.Provider value={chatProps}>{children}</ChatContext.Provider>;
    </AppMockContextWapper>
  );
};
