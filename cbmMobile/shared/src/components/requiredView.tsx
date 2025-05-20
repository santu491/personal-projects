import React from 'react';

import { appColors } from '../context/appColors';
import { H3 } from './text/text';

export const RequiredView = () => {
  return <H3 style={{ color: appColors.red }}>{' *'}</H3>;
};
