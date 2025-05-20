import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { NotificationIcon } from '../assets/icons/icons';
import { appStyles } from '../context/appStyles';

export interface NotificationIconProps {
  navigateToNotifications?: () => void;
  notificationCount?: number;
}

export const NotificationsIcon = ({ navigateToNotifications, notificationCount }: NotificationIconProps) => {
  const navigateToNotificationsScreen = () => {
    navigateToNotifications?.();
  };

  return (
    <TouchableOpacity
      style={appStyles.notificationIcon}
      onPress={navigateToNotificationsScreen}
      testID="notification.button.icon"
      accessibilityRole="button"
      accessibilityLabel={`${notificationCount} notifications`}
    >
      {notificationCount ? (
        <View style={appStyles.notificationBadgeStyle}>
          <Text style={appStyles.notificationCountText}>{notificationCount}</Text>
        </View>
      ) : null}
      <NotificationIcon />
    </TouchableOpacity>
  );
};
