import React from 'react';

import { useWithNavigation, WithNavigation } from '../../../../shared/src/commonui/src/navigation/useWithNavigation';
import { ClientPlan } from '../../../../shared/src/models/src/features/client';
import { AppContextType } from '../../../../src/context/appContext';
import { ProductType } from '../components/providerSearch/useProductType';
import { ScheduleAppointmentInfo, SelectedProvider } from '../model/providerContextInfo';
import { ProviderFilter, ProviderFilterQuery } from '../model/providerFilter';
import { SearchProvider } from '../model/providerSearchResponse';
import { ProvidersNavigationProp } from '../navigation/providers.navigationTypes';

export interface ProviderLocationDetails {
  geoCoordinates: GeoCoordinates;
  location: string;
  state: string;
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface ProviderContextType extends AppContextType {
  appointmentAssessmentStatus: boolean;
  counselorName: string;
  eapPlanName: string | undefined;
  isAddOrRemoveCounselorEnabled: boolean;
  page: number;
  providerLocation: ProviderLocationDetails;
  providersFilterQueryInfo: ProviderFilterQuery[] | [];
  providersFiltersInfo: ProviderFilter[] | [];
  providersListArray: SearchProvider[] | [];
  providersResultCount: number;
  resetProviderContextInfo: () => void;
  scheduleAppointmentInfo: ScheduleAppointmentInfo | undefined;
  selectedPlanInfo: ClientPlan | undefined;
  selectedProductTypeInfo: ProductType | undefined;
  selectedProviders: SelectedProvider[] | undefined;
  setAppointmentAssessmentStatus: React.Dispatch<React.SetStateAction<boolean>>;
  setCounselorName: React.Dispatch<React.SetStateAction<string>>;
  setEapPlanName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIsAddOrRemoveCounselorEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setProviderLocation: React.Dispatch<React.SetStateAction<ProviderLocationDetails>>;
  setProvidersFilterQueryInfo: React.Dispatch<React.SetStateAction<ProviderFilterQuery[] | []>>;
  setProvidersFiltersInfo: React.Dispatch<React.SetStateAction<ProviderFilter[] | []>>;
  setProvidersListArray: React.Dispatch<React.SetStateAction<SearchProvider[] | []>>;
  setProvidersResultCount: React.Dispatch<React.SetStateAction<number>>;
  setScheduleAppointmentInfo: React.Dispatch<React.SetStateAction<ScheduleAppointmentInfo | undefined>>;
  setSelectedPlanInfo: React.Dispatch<React.SetStateAction<ClientPlan | undefined>>;
  setSelectedProductTypeInfo: React.Dispatch<React.SetStateAction<ProductType | undefined>>;
  setSelectedProviders: React.Dispatch<React.SetStateAction<SelectedProvider[] | undefined>>;
}

const ProviderContext = React.createContext<ProviderContextType | null>(null);

const useProviderContextOnly = (): ProviderContextType => {
  const context = React.useContext(ProviderContext);
  if (!context) {
    throw new Error('useProviderContext must be used within a UserProvider');
  }
  return context;
};

export function useProviderContext(): WithNavigation<ProvidersNavigationProp, ProviderContextType> {
  return useWithNavigation<ProvidersNavigationProp, ProviderContextType>(useProviderContextOnly());
}

export { ProviderContext };
