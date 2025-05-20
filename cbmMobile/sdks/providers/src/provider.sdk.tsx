import React, { useMemo, useState } from 'react';

import { ClientPlan } from '../../../shared/src/models/src/features/client';
import { useAppContext } from '../../../src/context/appContext';
import { ProductType } from './components/providerSearch/useProductType';
import { ProviderContext, ProviderContextType, ProviderLocationDetails } from './context/provider.sdkContext';
import { ScheduleAppointmentInfo, SelectedProvider } from './model/providerContextInfo';
import { ProviderFilter, ProviderFilterQuery } from './model/providerFilter';
import { SearchProvider } from './model/providerSearchResponse';

export const ProviderSDK = ({ children }: { children: React.ReactNode }) => {
  const [counselorName, setCounselorName] = useState('');
  const [providerLocation, setProviderLocation] = useState<ProviderLocationDetails>({
    location: '',
    geoCoordinates: { latitude: 0, longitude: 0 },
    state: '',
  });
  const [appointmentAssessmentStatus, setAppointmentAssessmentStatus] = useState(false);
  const [scheduleAppointmentInfo, setScheduleAppointmentInfo] = useState<ScheduleAppointmentInfo | undefined>();
  const [selectedProviders, setSelectedProviders] = useState<SelectedProvider[] | undefined>([]);
  const [providersListArray, setProvidersListArray] = useState<SearchProvider[]>([]);
  const [page, setPage] = useState(0);
  const [providersResultCount, setProvidersResultCount] = useState(0);
  const [providersFiltersInfo, setProvidersFiltersInfo] = useState<ProviderFilter[]>([]);
  const [providersFilterQueryInfo, setProvidersFilterQueryInfo] = useState<ProviderFilterQuery[]>([]);
  const [isAddOrRemoveCounselorEnabled, setIsAddOrRemoveCounselorEnabled] = useState(false);
  const [selectedPlanInfo, setSelectedPlanInfo] = useState<ClientPlan | undefined>(undefined);
  const [selectedProductTypeInfo, setSelectedProductTypeInfo] = useState<ProductType | undefined>(undefined);
  const [eapPlanName, setEapPlanName] = useState<string | undefined>(undefined);

  const appContext = useAppContext();

  const resetProviderContextInfo = () => {
    setCounselorName('');
    setSelectedPlanInfo(undefined);
    setSelectedProductTypeInfo(undefined);
    setProviderLocation({
      geoCoordinates: {
        latitude: 0,
        longitude: 0,
      },
      state: '',
      location: '',
    });
    setAppointmentAssessmentStatus(false);
    setScheduleAppointmentInfo(undefined);
    setSelectedProviders([]);
    setProvidersListArray([]);
    setPage(0);
    setProvidersResultCount(0);
    setProvidersFiltersInfo([]);
    setProvidersFilterQueryInfo([]);
    setIsAddOrRemoveCounselorEnabled(false);
  };

  const context: ProviderContextType = useMemo(() => {
    return {
      counselorName,
      setCounselorName,
      providerLocation,
      setProviderLocation,
      appointmentAssessmentStatus,
      setAppointmentAssessmentStatus,
      scheduleAppointmentInfo,
      setScheduleAppointmentInfo,
      selectedProviders,
      setSelectedProviders,
      providersListArray,
      setProvidersListArray,
      page,
      setPage,
      eapPlanName,
      setEapPlanName,
      providersResultCount,
      setProvidersResultCount,
      providersFiltersInfo,
      setProvidersFiltersInfo,
      providersFilterQueryInfo,
      setProvidersFilterQueryInfo,
      resetProviderContextInfo,
      isAddOrRemoveCounselorEnabled,
      setIsAddOrRemoveCounselorEnabled,
      selectedPlanInfo,
      setSelectedPlanInfo,
      selectedProductTypeInfo,
      setSelectedProductTypeInfo,
      ...appContext,
    };
  }, [
    counselorName,
    providerLocation,
    appointmentAssessmentStatus,
    scheduleAppointmentInfo,
    selectedProviders,
    providersListArray,
    page,
    providersResultCount,
    providersFiltersInfo,
    providersFilterQueryInfo,
    isAddOrRemoveCounselorEnabled,
    selectedPlanInfo,
    selectedProductTypeInfo,
    eapPlanName,
    appContext,
  ]);

  return (
    <>
      <ProviderContext.Provider value={context}>{children}</ProviderContext.Provider>
    </>
  );
};
