import React from 'react';

import { ProviderSDK } from '../../sdks/providers/src/provider.sdk';

export const ProviderContext = ({ children }: { children?: React.ReactNode }) => {
  return <ProviderSDK children={children} />;
};
