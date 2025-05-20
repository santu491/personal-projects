import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppUrl } from '../../../../../../shared/src/models';
import { callNumber } from '../../../../../../shared/src/utils/utils';
import { AppointMentScheduleModelType } from '../../../config/constants/constants';
import { useProviderContext } from '../../../context/provider.sdkContext';

export interface ScheduleAppointmentDrawerData {
  description?: string;
  primaryButton: string;
  secondaryButton: string;
  title: string;
  type: string;
}

export const useScheduleAppointmentDrawer = () => {
  const { t } = useTranslation();
  const { navigationHandler, client } = useProviderContext();
  const [isShownAppointmentDrawer, setShownAppointmentDrawer] = useState(true);

  const drawerContentInfo = useMemo(
    () => ({
      [AppointMentScheduleModelType.IDENTIFY_REQUESTER]: {
        title: t('appointment.identifyRequesterModal.title'),
        description: t('appointment.identifyRequesterModal.description'),
        primaryButton: t('appointment.identifyRequesterModal.primaryButton'),
        secondaryButton: t('appointment.identifyRequesterModal.secondaryButton'),
        type: AppointMentScheduleModelType.IDENTIFY_REQUESTER,
      },
      [AppointMentScheduleModelType.CONFIRM_EXPERIENCE]: {
        title: t('appointment.confirmExperienceModal.title'),
        primaryButton: t('appointment.confirmExperienceModal.primaryButton'),
        description: t('appointment.confirmExperienceModal.description'),
        secondaryButton: t('appointment.confirmExperienceModal.secondaryButton'),
        type: AppointMentScheduleModelType.CONFIRM_EXPERIENCE,
      },
      [AppointMentScheduleModelType.CONTACT]: {
        title: t('appointment.contactModal.title'),
        primaryButton: t('appointment.contactModal.primaryButton'),
        secondaryButton: t('appointment.contactModal.secondaryButton'),
        type: AppointMentScheduleModelType.CONTACT,
      },

      [AppointMentScheduleModelType.HELP]: {
        title: t('appointment.helpModal.title'),
        primaryButton: t('appointment.helpModal.primaryButton'),
        secondaryButton: t('appointment.helpModal.secondaryButton'),
        type: AppointMentScheduleModelType.HELP,
      },
    }),
    [t]
  );
  const [drawerContent, setDrawerContent] = useState<ScheduleAppointmentDrawerData>(
    drawerContentInfo[AppointMentScheduleModelType.IDENTIFY_REQUESTER]
  );

  const onPressPrimaryButton = useCallback(
    (label: string) => {
      switch (drawerContent.type) {
        case AppointMentScheduleModelType.IDENTIFY_REQUESTER:
          setDrawerContent(
            drawerContentInfo[
              drawerContent.primaryButton === label
                ? AppointMentScheduleModelType.CONTACT
                : AppointMentScheduleModelType.CONFIRM_EXPERIENCE
            ]
          );

          break;
        case AppointMentScheduleModelType.CONFIRM_EXPERIENCE:
          if (drawerContent.primaryButton === label) {
            setDrawerContent(drawerContentInfo[AppointMentScheduleModelType.HELP]);
          } else {
            setShownAppointmentDrawer(false);
          }

          break;
        case AppointMentScheduleModelType.CONTACT:
        case AppointMentScheduleModelType.HELP:
          if (drawerContent.primaryButton === label) {
            setDrawerContent(
              drawerContentInfo[
                drawerContent.type === AppointMentScheduleModelType.CONTACT
                  ? AppointMentScheduleModelType.IDENTIFY_REQUESTER
                  : AppointMentScheduleModelType.CONFIRM_EXPERIENCE
              ]
            );
          } else {
            setShownAppointmentDrawer(false);
            navigationHandler.linkTo({ action: AppUrl.HOME });
          }
          break;
        default:
          break;
      }
    },
    [navigationHandler, drawerContentInfo, drawerContent.primaryButton, drawerContent.type]
  );

  const onPressContact = useCallback((mobileNo: string) => {
    callNumber(mobileNo);
  }, []);

  return {
    isShownAppointmentDrawer,
    drawerContent,
    clientSupportNumber: client?.supportNumber,
    onPressPrimaryButton,
    onPressContact,
  };
};
