import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { ClientContextType } from '../context/client.sdkContext';

export function getMockClientContext(): Readonly<ClientContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
  };
}
