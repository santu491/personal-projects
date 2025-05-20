import { useRoute } from '@react-navigation/native';
import React from 'react';

import { CredibleMindComponent } from '../../../../../shared/src/components/credibleMindComponent';
import { HomeCredibleMindScreenProps } from '../../navigation/home.navigationTypes';

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
  const { url } = useRoute<HomeCredibleMindScreenProps['route']>().params;
  return <CredibleMindComponent url={url} />;
};
