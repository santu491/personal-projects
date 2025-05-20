import { useRoute } from '@react-navigation/native';
import React from 'react';

import { CredibleMindComponent } from '../../../../../shared/src/components/credibleMindComponent';
import { MenuCredibleMindScreenProps } from '../../navigation/menu.navigationTypes';
// import { MenuCredibleMindScreenProps } from '../../navigation/menu.navigationTypes';

// import { CredibleMindComponent } from '../../../../shared/src/components/credibleMindComponent';

/**
 * CredibleMind Component
 *
 * This component renders the CredibleMind embeddable widget along with a main header.
 * It uses the `useRoute` hook to get the navigation parameters and passes them to the
 * CMEmbeddable component.
 *
 * @returns {JSX.Element} The rendered component.
 */
export const CredibleMind = (): JSX.Element => {
  const { url } = useRoute<MenuCredibleMindScreenProps['route']>().params;

  return <CredibleMindComponent url={url} />;
};
