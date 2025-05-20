import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';

import { AppConfig } from '../../../src/config/appConfig';
import { useAppContext } from '../../../src/context/appContext';
import { useLogout } from '../../../src/hooks/useLogout';
import { appStyles } from '../context/appStyles';
import { AppUrl } from '../models/src/navigation/appUrls';

type Props = {
  children?: ReactNode;
};

export const SessionProvider = ({ children }: Props) => {
  const [isScreenTouched, setIsScreenTouched] = useState(false);
  const timerIdDisplay = useRef(0);
  const { handleLogout } = useLogout();
  const { loggedIn, navigationHandler } = useAppContext();

  const onLogOut = useCallback(() => {
    navigationHandler.linkTo({ action: AppUrl.LOGIN });
  }, [navigationHandler]);

  const resetActivity = useCallback(() => {
    clearTimeout(timerIdDisplay.current);
    timerIdDisplay.current = Number(
      setTimeout(async () => {
        await handleLogout(onLogOut);
      }, AppConfig.SESSION_TIME_OUT * 1000)
    );
  }, [handleLogout, onLogOut]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponderCapture: () => {
          if (loggedIn) {
            setIsScreenTouched(true);
            resetActivity();
          }
          return false;
        },
      }),
    [resetActivity, loggedIn, setIsScreenTouched]
  );

  useEffect(() => {
    if (!isScreenTouched && loggedIn) {
      resetActivity();
    }
  }, [isScreenTouched, loggedIn, resetActivity]);

  return (
    <>
      <View style={appStyles.viewContainer} {...panResponder.panHandlers}>
        {children}
      </View>
    </>
  );
};
