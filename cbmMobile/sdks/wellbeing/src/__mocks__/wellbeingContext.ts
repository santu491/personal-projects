import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { WellbeingContextType } from '../context/wellbeing.sdkContext';

export function getMockWellbeingContext(): Readonly<WellbeingContextType> {
  const appContext = getMockAppContext();
  return {
    ...appContext,
  };
}
