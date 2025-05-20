/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { API_ENDPOINTS, APP_CONTENT } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { toPascalCase } from '../../../../../src/util/commonUtils';
import { APP_IMAGES } from '../../config/appImages';
import { MfaOptions } from '../../config/util/commonUtils';
import { useUserContext } from '../../context/auth.sdkContext';
import { ChannelContact, ChannelSuccessResponseDTO, MfaResponseDTO } from '../../models/mfa';
import { Screen } from '../../navigation/auth.navigationTypes';

export const useMfaSecurityCode = () => {
  const { t } = useTranslation();

  const userContext = useUserContext();

  const { mfaData, navigation } = userContext;

  const [selectedMfa, setSelectedMfa] = useState<ChannelContact>();
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState(false);
  const [getContacts, setContacts] = useState<ChannelContact[]>([]);

  const appendImagesToContacts = useCallback(
    (contacts: ChannelContact[]) => {
      return contacts.map((contact) => {
        let imagePath;
        let otpDescription: string;
        switch (contact.channel) {
          case MfaOptions.EMAIL.toUpperCase():
            imagePath = APP_IMAGES.EMAIL;
            otpDescription = `${t('authentication.emailOTPDesc')} ${contact.contactValue}. ${t('authentication.selectOptionDescription')}`;
            break;
          case MfaOptions.VOICE.toUpperCase():
            imagePath = APP_IMAGES.VOICE;
            otpDescription = `${t('authentication.voiceOTPDesc')} ${contact.contactValue}. ${t('authentication.selectOptionDescription')}`;
            break;
          case MfaOptions.TEXT.toUpperCase():
            imagePath = APP_IMAGES.TEXT;
            otpDescription = `${t('authentication.textOTPDesc')} ${contact.contactValue}. ${t('authentication.selectOptionDescription')}`;
            break;
          default:
            imagePath = APP_IMAGES.EMAIL.toUpperCase();
            otpDescription = `${t('authentication.emailOTPDesc')} ${contact.contactValue}. ${t('authentication.selectOptionDescription')}`;
        }
        return {
          ...contact,
          image: imagePath,
          verifyOtpDesc: otpDescription,
          description: `${contact.channel === MfaOptions.VOICE.toUpperCase() ? 'Call' : toPascalCase(contact.channel)} me the code at ${contact.contactValue}`,
        };
      });
    },
    [t]
  );

  const getMemberContactsList = useCallback(async () => {
    try {
      const headers = {
        userName: `${mfaData?.userName}`,
        isEmailVerified: `${mfaData?.isEmailVerified}`,
      };
      const contactsUrl = `${API_ENDPOINTS.MEMBER_CONTACTS}`;
      const response: MfaResponseDTO = await userContext.serviceProvider.callService(
        contactsUrl,
        RequestMethod.GET,
        null,
        headers
      );
      const channelResponse = response.data as ChannelSuccessResponseDTO;
      const channelList = appendImagesToContacts(channelResponse.contacts);
      setContacts(channelList);
    } catch (error) {
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
      setContacts([]);
    }
  }, [appendImagesToContacts, mfaData, userContext.serviceProvider]);

  useEffect(() => {
    getMemberContactsList();
  }, [getMemberContactsList]);

  const handlePressMFAOption = (item: ChannelContact) => {
    setSelectedMfa(item);
    setIsContinueButtonEnabled(true);
  };

  const handlePreviousButton = () => {
    navigation.goBack();
  };

  const handleContinueButton = () => {
    const channelName = selectedMfa?.channel.toLowerCase();
    const otpDescription = selectedMfa?.verifyOtpDesc;
    navigation.navigate(Screen.VERTIFY_OTP, { channelName, otpDescription });
  };

  return {
    handleContinueButton,
    handlePressMFAOption,
    handlePreviousButton,
    isContinueButtonEnabled,
    selectedMfa,
    getContacts,
  };
};
