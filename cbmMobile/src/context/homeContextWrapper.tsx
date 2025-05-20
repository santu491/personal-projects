import React from 'react';

import { HomeSDK } from '../../sdks/home/src/home.sdk';

export const HomeContext = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  return <HomeSDK children={children} />;
};
