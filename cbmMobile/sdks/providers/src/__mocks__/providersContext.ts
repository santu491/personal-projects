import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { ProviderContextType } from '../context/provider.sdkContext';

export function getProvidersMockContext(): Readonly<ProviderContextType> {
  const context = getMockAppContext();
  return {
    ...context,
    appointmentAssessmentStatus: false,
    counselorName: '',
    isAddOrRemoveCounselorEnabled: false,
    memberAppointmentStatus: undefined,
    page: 0,
    providerLocation: { geoCoordinates: { latitude: 0, longitude: 0 }, location: '', state: '' },
    providersFilterQueryInfo: [],
    providersFiltersInfo: [],
    providersListArray: [],
    providersResultCount: 0,
    resetProviderContextInfo: jest.fn(),
    scheduleAppointmentInfo: undefined,
    selectedProviders: undefined,
    setAppointmentAssessmentStatus: jest.fn(),
    setCounselorName: jest.fn(),
    setIsAddOrRemoveCounselorEnabled: jest.fn(),
    setMemberAppointStatus: jest.fn(),
    setPage: jest.fn(),
    setProviderLocation: jest.fn(),
    setProvidersFilterQueryInfo: jest.fn(),
    setProvidersFiltersInfo: jest.fn(),
    setProvidersListArray: jest.fn(),
    setProvidersResultCount: jest.fn(),
    setScheduleAppointmentInfo: jest.fn(),
    setSelectedProviders: jest.fn(),
    selectedPlanInfo: undefined,
    setSelectedPlanInfo: jest.fn(),
    selectedProductTypeInfo: undefined,
    setSelectedProductTypeInfo: jest.fn(),
    setEapPlanName: jest.fn(),
    eapPlanName: undefined,
  };
}
