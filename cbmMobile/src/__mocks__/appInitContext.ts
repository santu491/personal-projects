import { AppInitContextType, AppStatus } from '../screens/appInit/appInitContext';

export function getMockAppInitContext(): Readonly<AppInitContextType> {
  return {
    appStatus: AppStatus.LOADING,
    reloadApp: jest.fn(),
  };
}
