import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { NotificationIcon } from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { LinkButton } from '../../../../../shared/src/components/linkButton/linkButton';
import { MainHeaderComponent } from '../../../../../shared/src/components/mainHeader/mainHeaderComponent';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H1, H2, H3, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { ChatInit } from '../../../../../src/screens/chatInit/chatInit';
import { fetchDate } from '../../../../../src/util/commonUtils';
import { notificationViewStyles } from './notification.style';
import { useNotification } from './useNotification';

export const Notification = () => {
  const {
    notifications,
    handleClearAllAction,
    onNotificationClick,
    loading,
    context,
    getNotificationTypeButtonName,
    onPressBackButton,
    page,
    onMomentumScrollEnd,
    t,
  } = useNotification();

  const renderFooter = () => {
    return page !== 0 && page === notifications?.length ? (
      <View style={notificationViewStyles.loaderViewStyle}>
        <ActivityIndicator style={notificationViewStyles.loader} size="large" color={appColors.purple} />
      </View>
    ) : null;
  };

  return (
    <>
      <MainHeaderComponent leftArrow={true} hideLogin={false} onPressLeftArrow={onPressBackButton} />
      <ProgressLoader isVisible={loading} />
      {context.genesysChat?.enabled ? <ChatInit /> : null}
      <View style={notificationViewStyles.mainContainer}>
        <H1 style={notificationViewStyles.headerStyle}>{t('notifications.title')}</H1>
        <View style={notificationViewStyles.subHeaderView}>
          <View style={notificationViewStyles.recentView}>
            <H2>{t('notifications.recent')}</H2>
            {context.notificationCount ? (
              <View style={notificationViewStyles.badgeView}>
                <H3 style={notificationViewStyles.notificationCount}>{context.notificationCount}</H3>
              </View>
            ) : null}
          </View>
          <LinkButton
            onPress={handleClearAllAction}
            title={t('notifications.clearAll')}
            testID={'notifications.clearAll'}
            disabled={!(notifications && notifications.length > 0)}
            textStyle={[
              notificationViewStyles.linkButtonStyle,
              !(notifications && notifications.length > 0) ? notificationViewStyles.linkButtonDisable : {},
            ]}
          />
        </View>
        {notifications && notifications.length > 0 ? (
          <FlatList
            testID={'notification.notificationList'}
            data={notifications}
            style={notificationViewStyles.notificationList}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            onMomentumScrollEnd={onMomentumScrollEnd}
            contentContainerStyle={notificationViewStyles.flatListContentContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={notificationViewStyles.notificationView}
                testID={'notification.notificationslist.notificationItem'}
                onPress={() => onNotificationClick(item)}
              >
                <View style={notificationViewStyles.subViewContainer}>
                  {!item.viewDate ? <View style={notificationViewStyles.dotView} /> : null}
                  <View style={notificationViewStyles.titleContainer}>
                    <H3 style={notificationViewStyles.title}>{item.title}</H3>
                    <RNText style={notificationViewStyles.description}>{item.description}</RNText>
                    <ActionButton
                      onPress={() => {}} //empty function for feature purpose
                      title={getNotificationTypeButtonName(item.type)}
                      testID={'notification.notificationslist.read'}
                      style={notificationViewStyles.actionButton}
                      textStyle={notificationViewStyles.actionButtonText}
                    />
                  </View>
                  <Text style={notificationViewStyles.timeStamp} numberOfLines={1} ellipsizeMode="tail">
                    {fetchDate(item.createdDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={notificationViewStyles.emptyView}>
            <NotificationIcon width={62} height={62} />
            <H3 style={notificationViewStyles.emptyMessage}>{t('notifications.noNotification')}</H3>
          </View>
        )}
      </View>
    </>
  );
};
