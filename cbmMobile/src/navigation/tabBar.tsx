import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { EmitterSubscription, Keyboard, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppContext } from '../context/appContext';
import { ChatInit } from '../screens/chatInit/chatInit';
import { HIDE_CHAT_PARAM, HIDE_TAB_BAR_PARAM } from './navigationHandler';
import { getActiveRoute } from './utils/getActiveRoute';

const styles = {
  tabBar: {
    height: 49,
  },
};

export const TabBar = (props: BottomTabBarProps): JSX.Element | null => {
  const insets = useSafeAreaInsets();
  const appContext = useAppContext();

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    const keyboardEventListeners: EmitterSubscription[] = [
      Keyboard.addListener('keyboardDidShow', () => setVisible(false)),
      Keyboard.addListener('keyboardDidHide', () => setVisible(true)),
    ];
    return () => {
      keyboardEventListeners.forEach((eventListener) => eventListener.remove());
    };
  }, []);

  const params = {
    [HIDE_TAB_BAR_PARAM]: false,
    [HIDE_CHAT_PARAM]: false,
    ...getActiveRoute(props.state).params,
  };
  // to hide bottom TabBar on a screen call context.requestHideTabBar()
  if (!visible || params[HIDE_TAB_BAR_PARAM]) {
    return null;
  }

  return (
    <View testID="tab-bar">
      {params[HIDE_CHAT_PARAM] || !appContext.genesysChat?.enabled || appContext.hideChat ? null : <ChatInit />}
      <BottomTabBar
        style={{
          ...styles.tabBar,
          height: insets.bottom + styles.tabBar.height,
        }}
        {...props}
      />
    </View>
  );
};
