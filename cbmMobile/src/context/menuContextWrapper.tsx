import React from 'react';

import { MenuSDK } from '../../sdks/menu/src/menu.sdk';

export const MenuContext = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  return <MenuSDK children={children} />;
};
