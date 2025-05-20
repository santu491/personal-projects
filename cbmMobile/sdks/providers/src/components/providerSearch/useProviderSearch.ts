import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import { ClientPlan } from '../../../../../shared/src/models/src/features/client';
import { API_ENDPOINTS } from '../../../../../src/config';
import { SourceType } from '../../../../../src/constants/constants';
import { useAppContext } from '../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../src/models/adapters';
import { getClientDetails } from '../../../../../src/util/commonUtils';
import { ProviderLocationDetails, useProviderContext } from '../../context/provider.sdkContext';
import { GeoCodeResponseDTO, ProviderSearchResponseDTO } from '../../model/providerSearchResponse';
import { Screen } from '../../navigation/providers.navigationTypes';
import { useProductType } from './useProductType';

interface Location {
  city: string;
  id: string;
  state: string;
  streetLine: string;
  text?: string;
  title: string;
}

export const useProviderSearch = ({ hasSearchButton }: { hasSearchButton?: boolean }) => {
  const { t } = useTranslation();
  const providerContext = useProviderContext();
  const locationsRef = useRef('');
  const [getCounselorName, setCounselorName] = useState('');
  const [searchedLocation, setSearchLocation] = useState('');
  const [getLocations, setLocation] = useState<Location[]>([]);
  const [isCounselorNameFocused, setCounselorNameFocused] = useState(false);
  const [isLocationFocused, setLocationFocused] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<ClientPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(undefined);
  const [selectedProductType, setSelectedProductType] = useState<string | undefined>(undefined);
  const [isProductTypeTouched, setIsProductTypeTouched] = useState(false);
  const [isPlanTouched, setIsPlanTouched] = useState(false);
  const [isLocationTouched, setIsLocationTouched] = useState(false);
  const {
    setCounselorName: updateCounselorName,
    setProviderLocation,
    counselorName,
    providerLocation,
    setSelectedProviders,
    setProvidersListArray,
    setPage,
    setProvidersResultCount,
    setProvidersFiltersInfo,
    setProvidersFilterQueryInfo,
    setIsAddOrRemoveCounselorEnabled,
    setSelectedPlanInfo,
    navigation,
    selectedPlanInfo,
    client,
    setSelectedProductTypeInfo,
    selectedProductTypeInfo,
  } = providerContext;
  const { setMemberAppointStatus } = useAppContext();
  const { productTypes } = useProductType();

  const isProductTypeInValid = useMemo(
    () => isProductTypeTouched && !selectedProductType,
    [isProductTypeTouched, selectedProductType]
  );

  const isPlanInValid = useMemo(() => isPlanTouched && !selectedPlan, [isPlanTouched, selectedPlan]);

  useEffect(() => {
    setCounselorName(counselorName);
  }, [counselorName]);

  useEffect(() => {
    getClient();
  }, []);

  useEffect(() => {
    setSelectedPlan(selectedPlanInfo?.memberFacingPlanName ?? undefined);
  }, [selectedPlanInfo?.memberFacingPlanName]);

  useEffect(() => {
    setSelectedProductType(selectedProductTypeInfo?.label ?? undefined);
  }, [selectedProductTypeInfo]);

  useEffect(() => {
    if (plans.length === 1) {
      setSelectedPlanInfo(plans[0]);
    }
  }, [plans, setSelectedPlanInfo]);

  const getClient = async () => {
    const data = await getClientDetails();

    const updatedData = data.plans?.map((item) => {
      return {
        ...item,
        label: item.memberFacingPlanName,
        id: item.memberFacingPlanName,
        value: item.memberFacingPlanName,
      };
    });
    setPlans(updatedData ?? []);
  };

  useEffect(() => {
    setSearchLocation(providerLocation.location);
  }, [providerLocation.location]);

  useEffect(() => {
    const isLocationAvailable = getLocations.find((item) => item.title === searchedLocation);

    if (client?.source === SourceType.EAP || (client?.source === SourceType.MHSUD && plans.length === 1)) {
      setEnableSearch(!!isLocationAvailable);
      return;
    }

    if (client?.source === SourceType.COMBINED) {
      setEnableSearch(!!(isLocationAvailable && selectedProductType));
      return;
    }

    setEnableSearch(!!(isLocationAvailable && selectedPlan));
  }, [client?.source, getLocations, plans.length, searchedLocation, selectedPlan, selectedProductType]);

  const onPlanChange = (item: string) => {
    setIsPlanTouched(true);
    setSelectedPlan(item);
    setPlanInfo(item);
  };

  const onProductTypeChange = (item: string) => {
    setIsProductTypeTouched(true);
    setSelectedProductType(item);
    setProductTypeInfo(item);
  };

  const setProductTypeInfo = (productType: string) => {
    const selectedProductTypeData = productTypes.find((data) => data.label === productType);
    if (selectedProductTypeData) {
      setSelectedProductTypeInfo(selectedProductTypeData);
    }
  };

  const setPlanInfo = (planName: string) => {
    const selectedPlanData = plans.find((data) => data.memberFacingPlanName === planName);
    if (selectedPlanData) {
      setSelectedPlanInfo(selectedPlanData);
    }
  };

  const autoAddressSearchResults = useCallback(
    async (addressText: string) => {
      try {
        const payload = {
          data: addressText,
        };
        setLoading(true);
        const response: ProviderSearchResponseDTO = await providerContext.serviceProvider.callService(
          API_ENDPOINTS.PROVIDER_ADDRESS,
          RequestMethod.POST,
          payload
        );
        const suggestions = response.data.map((item, index) => ({
          ...item,
          id: index.toString(),
          title: item.text ?? '',
        }));
        setLocation(suggestions);
      } catch (error) {
        setLocation([]);
      } finally {
        setLoading(false);
      }
    },
    [providerContext]
  );

  // Use useRef to store the debounced version of the search function
  const debouncedSearch = useRef(
    debounce((searchQuery) => {
      autoAddressSearchResults(searchQuery);
    }, 300)
  ).current;

  const onChangeLocation = (value: string) => {
    setSearchLocation(value);
    if (value.length === 0) {
      setLocation([]);
      return;
    }
    debouncedSearch(value);
    locationsRef.current === value ? setEnableSearch(true) : setEnableSearch(false);
  };

  const onPressDropDownItem = async (
    item?: TAutocompleteDropdownItem,
    submit?: (data: ProviderLocationDetails) => void
  ) => {
    setSearchLocation((item && item.title) ?? '');
    setEnableSearch(true);
    Keyboard.dismiss();
    if (!hasSearchButton && item && item.title) {
      await geoCodeAddressAPI(item.title, submit);
    }
  };

  const onFocusCounselor = useCallback(() => {
    setCounselorNameFocused(true);
    setLocation([]);
  }, []);

  const onBlurCounselor = useCallback(() => {
    setCounselorNameFocused(false);
  }, []);

  const onFocusLocation = useCallback(() => {
    setLocationFocused(true);
  }, []);

  const onBlurLocation = useCallback(() => {
    setLocationFocused(false);
    setIsLocationTouched(true);
  }, []);

  const geoCodeAddressAPI = useCallback(
    async (location?: string, submit?: (data: ProviderLocationDetails) => void) => {
      try {
        const response: GeoCodeResponseDTO = await providerContext.serviceProvider.callService(
          API_ENDPOINTS.GEOCODE_ADDRESS,
          RequestMethod.POST,
          {
            data: location ?? searchedLocation,
          },
          {}
        );
        const value = response.data;
        if (value.geoCoordinates.latitude && value.geoCoordinates.longitude) {
          const data: ProviderLocationDetails = {
            location: location ?? searchedLocation,
            geoCoordinates: {
              latitude: parseFloat(value.geoCoordinates.latitude),
              longitude: parseFloat(value.geoCoordinates.longitude),
            },
            state: value.state,
          };

          setProviderLocation(data);

          if (hasSearchButton) {
            navigation.navigate(Screen.PROVIDER_LIST, { hasEditCounselor: false });
          } else {
            if (submit) {
              submit(data);
            }
          }
        } else {
          console.warn('error', response);
        }
      } catch (error) {
        console.warn('error', error);
      }
    },
    [hasSearchButton, navigation, providerContext, searchedLocation, setProviderLocation]
  );

  const onPressCounselorKeyBoardReturnType = (onSubmitCounselor?: (value: string) => void) => {
    if (getCounselorName !== counselorName) {
      updateCounselorName(getCounselorName);
      if (onSubmitCounselor && !hasSearchButton) {
        onSubmitCounselor(getCounselorName);
      }
    }
  };

  const locationErrorMessage = useMemo(() => {
    return searchedLocation.length > 0 || !isLocationTouched ? '' : t('providers.locationErrorMessage');
  }, [isLocationTouched, searchedLocation.length, t]);

  const handleSearch = async () => {
    setSelectedProviders([]);
    setProvidersListArray([]);
    setPage(0);
    setProvidersResultCount(0);
    setProvidersFiltersInfo([]);
    setProvidersFilterQueryInfo([]);
    updateCounselorName(getCounselorName);
    setIsAddOrRemoveCounselorEnabled(false);
    setMemberAppointStatus(undefined);
    updateSelectedPlan();
    await geoCodeAddressAPI();
  };

  const updateSelectedPlan = () => {
    if (selectedPlan) {
      const selectedPlanData = plans.find((item) => item.memberFacingPlanName === selectedPlan);
      if (selectedPlanData) {
        setSelectedPlanInfo(selectedPlanData);
      }
    }
  };

  const isCounselorHighlighted = useMemo(
    () => (hasSearchButton ? isCounselorNameFocused || getCounselorName.length > 0 : isCounselorNameFocused),
    [getCounselorName.length, hasSearchButton, isCounselorNameFocused]
  );
  const isCounselorIconHighlighted = useMemo(
    () => isCounselorNameFocused || getCounselorName.length > 0,
    [getCounselorName.length, isCounselorNameFocused]
  );
  const isLocationHighlighted = useMemo(
    () => (hasSearchButton ? isLocationFocused || searchedLocation.length > 0 : isLocationFocused),
    [hasSearchButton, isLocationFocused, searchedLocation.length]
  );
  const isLocationIconHighlighted = useMemo(
    () => isLocationFocused || searchedLocation.length > 0,
    [isLocationFocused, searchedLocation.length]
  );

  const onDropdownClose = (onSubmitPlan?: () => void) => {
    if (selectedPlan) {
      setIsPlanTouched(true);
      setPlanInfo(selectedPlan);
      onSubmitPlan?.();
    }
  };

  const onCloseProductType = (onSubmitProductType?: () => void) => {
    if (selectedProductType) {
      setIsProductTypeTouched(true);
      setProductTypeInfo(selectedProductType);
      onSubmitProductType?.();
    }
  };

  return {
    getCounselorName,
    searchedLocation,
    setCounselorName,
    getLocations,
    setLocation,
    onChangeLocation,
    onPressDropDownItem,
    isCounselorNameFocused,
    isLocationFocused,
    onFocusCounselor,
    onFocusLocation,
    onBlurCounselor,
    onBlurLocation,
    enableSearch,
    setSearchLocation,
    onPressCounselorKeyBoardReturnType,
    locationErrorMessage,
    handleSearch,
    isCounselorHighlighted,
    isLocationHighlighted,
    loading,
    plans,
    selectedPlan,
    onPlanChange,
    onDropdownClose,
    productTypes,
    onProductTypeChange,
    onCloseProductType,
    selectedProductType,
    client,
    isProductTypeInValid,
    isPlanInValid,
    isLocationIconHighlighted,
    isCounselorIconHighlighted,
  };
};
