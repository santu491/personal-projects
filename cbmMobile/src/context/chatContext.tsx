import React from 'react';

import { ChatSDK } from '../../sdks/chat/src';

export const ChatContext = ({ children }: { children?: React.ReactNode }) => {
  return <ChatSDK children={children} />;
};
