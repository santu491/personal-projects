import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { MenuContextType } from '../context/menu.sdkContext';

export function getMockMenuContext(): Readonly<MenuContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
  };
}
