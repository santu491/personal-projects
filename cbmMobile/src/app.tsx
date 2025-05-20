/**
 * Carelon Mobile App
 *
 * @format
 */

import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import { LogBox } from 'react-native';

import { SessionProvider } from '../shared/src/components/sessionProvider';
import { REACHABILITY_URL } from './constants/constants';
import { AppContextWapper } from './context/appContextWrapper';
import { SharedContext } from './context/sharedContext';
import { AppNavigator } from './navigation/appNavigator';
import { AppInit } from './screens/appInit/appInit';

LogBox.ignoreAllLogs(true);

NetInfo.configure({
  reachabilityUrl: REACHABILITY_URL,
  reachabilityTest: async (response) => response.status === 200,
});

export const App = (): React.JSX.Element => {
  return (
    <AppContextWapper>
      <AppInit>
        <SharedContext>
          <SessionProvider>
            <AppNavigator />
          </SessionProvider>
        </SharedContext>
      </AppInit>
    </AppContextWapper>
  );
};
