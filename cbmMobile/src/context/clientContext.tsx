import React from 'react';

import { ClientSDK } from '../../sdks/client/src/client.sdk';

export const ClientContext = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  return <ClientSDK children={children} />;
};
