import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { ChatContextType } from '../context/chat.sdkContext';

export function getMockChatContext(): Readonly<ChatContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
  };
}
