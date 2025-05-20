import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EMERGENCY_SERVICE_NUMBER, MENTAL_HEALTH_CRISIS_NUMBER } from '../../../../src/constants/constants';
import { useAppContext } from '../../../../src/context/appContext';
import { useChatInit } from '../../../../src/hooks/useChatInit';
import { AssistanceType, ContactInfo } from '../../models/src/features/immediateAssistance';
import { callNumber, ContactType, sendSMS } from '../../utils/utils';

export const useImmediateAssistance = () => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const [assistanceType, setAssistanceType] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const { checkChatAvailability, loading } = useChatInit();
  const { headerInfo } = useAppContext();

  const memberSupport = headerInfo?.memberSupport;
  const memberSupportData = memberSupport?.data;

  const crisisSupport = headerInfo?.crisisSupport;

  const immediateAssistanceContact = crisisSupport?.data ?? [
    {
      key: t('credibleMind.immediateAssistance.emergency'),
      value: EMERGENCY_SERVICE_NUMBER,
      type: ContactType.CALL,
    },
    {
      value: MENTAL_HEALTH_CRISIS_NUMBER,
      key: t('credibleMind.immediateAssistance.suicideOrCrisis'),
      type: ContactType.CALL,
    },
  ];

  const onPressCrisisSupport = () => {
    setAssistanceType(AssistanceType.CRISIS_SUPPORT);
    setShowBottomSheet(true);
  };

  const onPressMemberSupport = () => {
    setAssistanceType(AssistanceType.MEMBER_SUPPORT);
    setShowBottomSheet(true);
  };

  const phoneNumberTapped = useCallback((mobileNo: string) => {
    callNumber(mobileNo);
  }, []);

  const onPressContact = (contact: ContactInfo) => {
    if (!contact.value) {
      return;
    }
    switch (contact.type) {
      case ContactType.TEXT:
        sendSMS(contact.value);
        break;
      case ContactType.CHAT:
        setShowBottomSheet(false);
        checkChatAvailability();
        break;
      case ContactType.CALL:
      default:
        phoneNumberTapped(contact.value);
    }
  };

  return {
    showBottomSheet,
    assistanceType,
    memberSupportData,
    immediateAssistanceContact,
    onPressCrisisSupport,
    onPressMemberSupport,
    onPressContact,
    setShowBottomSheet,
    loading,
    headerInfo,
    memberSupport,
    crisisSupport,
  };
};
