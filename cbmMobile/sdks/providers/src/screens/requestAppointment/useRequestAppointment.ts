import { useEffect, useState } from 'react';

import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS } from '../../../../../src/config';
import { RequestMethod } from '../../../../../src/models/adapters';
import { APPOINTMENT_TYPE } from '../../constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';

export const useRequestAppointment = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShownAlert, setIsShownAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const context = useProviderContext();
  const {
    scheduleAppointmentInfo,
    selectedProviders,
    setScheduleAppointmentInfo,
    setSelectedProviders,
    navigation,
    navigationHandler,
    userProfileData,
  } = context;

  useEffect(() => {
    navigationHandler.requestHideTabBar(navigation);
  }, [navigationHandler, navigation]);

  const submitAppointment = async () => {
    try {
      setLoading(true);
      const user = {
        iamguid: userProfileData?.iamguid,
        firstName: userProfileData?.firstName,
        lastName: userProfileData?.lastName,
        dob: userProfileData?.dob,
        gender: userProfileData?.gender,
        healthInsuranceCarrier: '',
        email: userProfileData?.emailAddress,
        phone: userProfileData?.communication.mobileNumber,
        communication: userProfileData?.address,
        employerType: userProfileData?.employerType,
        groupId: userProfileData?.clientGroupId,
        planName: '',
        clientName: userProfileData?.clientName,
        appointmentType: APPOINTMENT_TYPE,
        memberOptedProvider: null,
        isTimingCustomized: false,
      };
      const providers = selectedProviders?.map((provider) => {
        return {
          provDetailsId: provider.provDetailsId,
          providerId: provider.providerId?.toString(),
          email: provider.email,
          phone: provider.phone,
          name: provider.name,
          firstName: provider.firstName,
          lastName: provider.lastName,
          title: provider.title,
          addressOne: provider.addressOne,
          addressTwo: provider.addressTwo,
          city: provider.city,
          state: provider.state,
          zip: provider.zip,
          distance: provider.distance?.toString(),
          providerType: provider.providerType,
          isMemberOpted: provider.isMemberOpted,
          isInsuranceCarrierAccepted: provider.isInsuranceCarrierAccepted,
          beaconLocationId: provider.beaconLocationId,
        };
      });
      const memberSlot = scheduleAppointmentInfo?.memberSlot?.days
        ? scheduleAppointmentInfo.memberSlot
        : { days: null, time: null };
      const clinicalQuestions = scheduleAppointmentInfo?.clinicalQuestions ?? '';
      const request = {
        ...user,
        selectedProviders: providers,
        clinicalQuestions,
        memberPrefferedSlot: memberSlot,
      };
      await context.serviceProvider.callService(API_ENDPOINTS.SUBMIT_APPOINTMENT, RequestMethod.POST, request, {
        isSecureToken: true,
      });

      setIsSuccess(true);
      setScheduleAppointmentInfo(undefined);
      setSelectedProviders(undefined);
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setLoading(false);
      setIsShownAlert(true);
    }
  };

  const onPressContinue = () => {
    submitAppointment();
  };

  const onPressPreviousButton = () => {
    navigation.goBack();
  };

  const onAlertButtonPress = () => {
    setIsShownAlert(false);
    if (isSuccess) {
      navigationHandler.linkTo({ action: AppUrl.HOME });
    }
  };

  return {
    onPressContinue,
    onPressPreviousButton,
    onAlertButtonPress,
    isShownAlert,
    loading,
    isSuccess,
  };
};
