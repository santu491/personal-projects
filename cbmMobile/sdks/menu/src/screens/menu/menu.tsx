/* eslint-disable @typescript-eslint/naming-convention */
import { Accordion } from '@sydney/motif-components';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {
  AngleDown,
  AngleUp,
  CalendarPlus,
  CustomerSupport,
  DentalIcon,
  HospitalIndemnity,
  IdVerified,
  PeopleIcon,
  SupplementalHealth,
  UserMaleCircle,
} from '../../../../../shared/src/assets/icons/icons';
import { ActionButton } from '../../../../../shared/src/components';
import { AlertModel } from '../../../../../shared/src/components/alertModel/alertModel';
import { InternalHeader } from '../../../../../shared/src/components/internalHeader';
import { ProgressLoader } from '../../../../../shared/src/components/progressLoader';
import { H3 } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { BUILD_NUMBER } from '../../../../../src/constants/build';
import { MenuCell } from '../../components/menuCell/menuCell';
import { ExperienceType, MenuImageName, MenuItem, MenuSubItem, MenuType } from '../../models/menu';
import { menuStyles } from './menu.styles';
import { useMenu } from './useMenu';

export const MenuImage = {
  [MenuImageName.ANGLEUP]: <AngleDown />,
  [MenuImageName.CALENDARPLUS]: <CalendarPlus />,
  [MenuImageName.CUSTOMERSUPPORT]: <CustomerSupport color={appColors.lightPurple} />,
  [MenuImageName.DENTAL]: <DentalIcon />,
  [MenuImageName.HOSPITALINDEMNITY]: <HospitalIndemnity />,
  [MenuImageName.IDVERIFIED]: <IdVerified />,
  [MenuImageName.PEOPLE]: <PeopleIcon color={appColors.lightPurple} />,
  [MenuImageName.SUPPLEMENTALHEALTH]: <SupplementalHealth />,
  [MenuImageName.USERMALECIRCLE]: <UserMaleCircle />,
};

export const Menu = () => {
  const {
    menuData,
    buttonsData,
    handleScreenNavigation,
    loggedIn,
    isSuccess,
    loading,
    assessmentAlertConfirm,
    assessmentAlertDismiss,
    onMenuItemPress,
    onMenuSelectedItemPress,
  } = useMenu();
  const { t } = useTranslation();

  const isMenuItemAvailable = useCallback(
    (item: MenuItem | MenuSubItem) =>
      (loggedIn && item.experienceType === ExperienceType.SECURE) ||
      ((!loggedIn || item.type !== MenuType.BUTTON) &&
        (item.experienceType === undefined || item.experienceType === ExperienceType.PUBLIC)),
    [loggedIn]
  );

  const renderMenuCell = useCallback(
    (item: MenuItem | MenuSubItem) =>
      isMenuItemAvailable(item) ? (
        <MenuCell
          key={item.label}
          menuItem={item}
          menuIcon={item.icon ? MenuImage[item.icon as keyof typeof MenuImage] : null}
          onPress={() => {
            onMenuSelectedItemPress(item);
          }}
        />
      ) : null,
    [isMenuItemAvailable, onMenuSelectedItemPress]
  );

  return (
    <>
      <ProgressLoader isVisible={loading} />
      <InternalHeader title={t('menu.title')} />
      <View style={menuStyles.container}>
        {isSuccess ? (
          <AlertModel
            modalVisible={isSuccess}
            onHandlePrimaryButton={assessmentAlertConfirm}
            onHandleSecondaryButton={assessmentAlertDismiss}
            title={t('home.disclaimer')}
            subTitle={t('home.assessmentAlertMessage')}
            primaryButtonTitle={t('home.agree')}
            secondaryButtonTitle={t('home.cancel')}
            showIndicatorIcon={false}
          />
        ) : null}
        <ScrollView>
          {menuData?.map((section, index) =>
            section.data?.length && isMenuItemAvailable(section) ? (
              <Accordion
                accessoryStart={section.icon ? MenuImage[section.icon as keyof typeof MenuImage] : null}
                key={section.label}
                expanded={section.expanded}
                hideContentWhenCollapsed
                label={section.label}
                inverted
                onVisibilityToggle={(expanded) => onMenuItemPress(expanded, index)}
                testID={`menu.section.${section.id}`}
                styles={{
                  inverted: {
                    contentContainer: menuStyles.contentContainer,
                    headerContainer: menuStyles.headerContainer,
                    headerTextContainer: menuStyles.headerTextContainer,
                    icon: menuStyles.icon,
                    label: menuStyles.label,
                    Icon: AngleDown,
                    expanded: { icon: { color: appColors.lightPurple, height: 14, width: 14 }, Icon: AngleUp },
                    description: { color: appColors.lightGray },
                    container: { borderWidth: 0, borderColor: appColors.transparent },
                  },
                }}
              >
                {section.data.map((item) => renderMenuCell(item))}
              </Accordion>
            ) : (
              section.type === MenuType.MENUITEM && renderMenuCell(section)
            )
          )}
        </ScrollView>

        <View style={menuStyles.buttonsContainer}>
          {buttonsData?.map(
            (menuItem) =>
              isMenuItemAvailable(menuItem) && (
                <ActionButton
                  testID={`menu.${menuItem.id}.button`}
                  key={menuItem.label}
                  onPress={() => handleScreenNavigation()}
                  title={menuItem.label}
                  style={menuItem.isPrimaryButton ? menuStyles.primaryButton : menuStyles.actionButton}
                  textStyle={menuItem.isPrimaryButton ? menuStyles.primaryButtonText : menuStyles.actionButtonText}
                />
              )
          )}
        </View>
        <H3 style={menuStyles.version}>{`${DeviceInfo.getVersion()}(${BUILD_NUMBER})`}</H3>
      </View>
    </>
  );
};
