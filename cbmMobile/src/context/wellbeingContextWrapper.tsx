import React from 'react';

import { WellbeingSDK } from '../../sdks/wellbeing/src/wellbeing.sdk';

export const WellbeingContext = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  return <WellbeingSDK children={children} />;
};
