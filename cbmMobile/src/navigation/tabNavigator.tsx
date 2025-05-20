import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { AppointmentsNavigator } from '../../sdks/appointments/src/navigation/appointment.navigator';
import { MemberPlanNavigator } from '../../sdks/memberPlan/navigation/memberPlan.navigator';
import { MenuNavigator } from '../../sdks/menu/src/navigation/menu.navigator';
import { useProviderContext } from '../../sdks/providers/src/context/provider.sdkContext';
import { WellbeingNavigator } from '../../sdks/wellbeing/src/navigation/wellbeing.navigator';
import { ChatIcon, HomeIcon, MedicationIcon, MemberPlanIcon, MenuIcon } from '../../shared/src/assets/icons/icons';
import { appColors } from '../../shared/src/context/appColors';
import { appFonts } from '../../shared/src/context/appFonts';
import { AppUrl } from '../../shared/src/models';
import { ScreenNames } from '../config';
import { SourceType } from '../constants/constants';
import { useAppContext } from '../context/appContext';
import { isAndroid } from '../util/commonUtils';
import { HomeTabNavigator } from './homeTabNaviagtion/homeTab.navigator';
import { TabBar } from './tabBar';

const tabBarIcon = (tabName: string, focused: boolean) => {
  switch (tabName) {
    case ScreenNames.HOME_TAB:
      return <HomeIcon color={focused ? appColors.purple : appColors.mediumGray} />;
    case ScreenNames.MEMBER_PLAN_TAB:
      return <MemberPlanIcon color={focused ? appColors.purple : appColors.mediumGray} />;
    case ScreenNames.APPOINTMENTS_TAB:
      return <MedicationIcon color={focused ? appColors.purple : appColors.mediumGray} />;
    case ScreenNames.WELLBEING_TAB:
      return <ChatIcon color={focused ? appColors.purple : appColors.mediumGray} />;
    case ScreenNames.MENU_TAB:
      return <MenuIcon color={focused ? appColors.purple : appColors.mediumGray} />;

    default:
      break;
  }
};

export const TabNavigator = () => {
  const { navigationHandler, resetProviderContextInfo } = useProviderContext();
  const appContext = useAppContext();
  const Tab = createBottomTabNavigator();
  const renderTabBar = useCallback((props: BottomTabBarProps) => <TabBar {...props} />, []);
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: appColors.purple,
        tabBarInactiveTintColor: appColors.darkGray,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarItemStyle: {
          paddingBottom: isAndroid() ? 3 : 0,
        },
      }}
    >
      <Tab.Screen
        component={HomeTabNavigator}
        name={ScreenNames.HOME_TAB}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }: { focused: boolean }) => tabBarIcon(ScreenNames.HOME_TAB, focused),
        }}
        listeners={() => ({
          tabPress: () => {
            navigationHandler.linkTo({ action: AppUrl.HOME });
          },
        })}
      />

      {appContext.client?.source !== SourceType.EAP ? (
        <Tab.Screen
          component={MemberPlanNavigator}
          name={ScreenNames.MEMBER_PLAN_TAB}
          options={{
            tabBarLabel: 'Member Plan',
            tabBarIcon: ({ focused }: { focused: boolean }) => tabBarIcon(ScreenNames.MEMBER_PLAN_TAB, focused),
            tabBarItemStyle: {
              marginRight: 10,
            },
          }}
        />
      ) : null}

      <Tab.Screen
        component={AppointmentsNavigator}
        name={ScreenNames.APPOINTMENTS_TAB}
        options={{
          tabBarLabel: 'Care',
          tabBarIcon: ({ focused }: { focused: boolean }) => tabBarIcon(ScreenNames.APPOINTMENTS_TAB, focused),
        }}
        listeners={() => ({
          tabPress: () => {
            resetProviderContextInfo();
            navigationHandler.linkTo({ action: AppUrl.APPOINTMENTS_HISTORY });
          },
        })}
      />
      <Tab.Screen
        component={WellbeingNavigator}
        name={ScreenNames.WELLBEING_TAB}
        options={{
          tabBarLabel: 'Wellness',
          tabBarIcon: ({ focused }: { focused: boolean }) => tabBarIcon(ScreenNames.WELLBEING_TAB, focused),
        }}
        listeners={() => ({
          tabPress: () => {
            navigationHandler.linkTo({ action: AppUrl.WELLBEING });
          },
        })}
      />
      <Tab.Screen
        component={MenuNavigator}
        name={ScreenNames.MENU_TAB}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ focused }: { focused: boolean }) => tabBarIcon(ScreenNames.MENU_TAB, focused),
        }}
        listeners={() => ({
          tabPress: () => {
            navigationHandler.linkTo({ action: AppUrl.MENU });
          },
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontFamily: appFonts.regular,
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
  },
});
