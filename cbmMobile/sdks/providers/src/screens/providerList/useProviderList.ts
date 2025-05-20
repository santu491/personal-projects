/* eslint-disable @typescript-eslint/naming-convention */
import { useIsFocused, useRoute } from '@react-navigation/native';
import lodash, { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, ScrollView } from 'react-native';

import { AlertModelProps } from '../../../../../shared/src/components/alertModel/alertModel';
import { AppUrl } from '../../../../../shared/src/models';
import { API_ENDPOINTS, APP_CONTENT, appColors, ScreenNames } from '../../../../../src/config';
import { SourceType } from '../../../../../src/constants/constants';
import { useAppContext } from '../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../src/models/adapters';
import { AppointmentTabStatusResponseDTO } from '../../../../appointments/src/models/appointments';
import { ALERT_TYPE } from '../../config/constants/constants';
import { ProviderLocationDetails, useProviderContext } from '../../context/provider.sdkContext';
import {
  FilterOption,
  ProviderAppointmentStatusDTO,
  ProviderFilter,
  ProviderFilterQuery,
  ProviderListDTO,
  ProviderPlanPreferenceDTO,
  ProviderPlanPreferenceSuccessDTO,
  SortInfo,
} from '../../model/providerFilter';
import { SearchProvider } from '../../model/providerSearchResponse';
import { ProviderListScreenProps, Screen } from '../../navigation/providers.navigationTypes';
import { getProviderListPayload, ProvidersPayload, SortQuery } from '../../utils/providerList';
import { getSelectedProviderDetails } from '../../utils/selectedProviderDetails';

export const useProviderList = () => {
  const { t } = useTranslation();
  const sortArray = useMemo(
    () => [
      { id: 1, label: `${t('providers.sort.default')}` },
      {
        id: 2,
        label: `${t('providers.sort.distance')}`,
      },
      {
        id: 3,
        label: `${t('providers.sort.counselor')}`,
      },
      {
        id: 4,
        label: `${t('providers.sort.name')}`,
        query: 'name.keyword',
      },
      {
        id: 5,
        label: `${t('providers.sort.city')}`,
        query: 'city.keyword',
      },
    ],
    [t]
  );

  const distanceArray = useMemo(
    () => [
      { label: `2 ${t('providers.miles')}`, id: 1, query: '2' },
      { label: `5 `, id: 2, query: '5' },
      { label: `10 `, id: 3, query: '10' },
      { label: `25 `, id: 4, query: '25' },
      { label: `50 `, id: 5, query: '50' },
      { label: `100+ `, id: 6, query: '100' },
    ],
    [t]
  );

  const providerContext = useProviderContext();

  const routeParams = useRoute<ProviderListScreenProps['route']>().params;
  const { hasEditCounselor } = routeParams;

  const {
    providerLocation,
    counselorName,
    loggedIn,
    setLoggedIn,
    setNavigateScreen,
    setSelectedProviders,
    selectedProviders,
    providersListArray,
    setProvidersListArray,
    page,
    setPage,
    providersResultCount,
    setProvidersResultCount,
    providersFiltersInfo,
    setProvidersFiltersInfo,
    providersFilterQueryInfo,
    setProvidersFilterQueryInfo,
    memberAppointmentStatus,
    navigationHandler,
    navigation,
    setHideChat,
    selectedPlanInfo,
    selectedProductTypeInfo,
    client,
    setEapPlanName,
  } = providerContext;
  const { setMemberAppointStatus } = useAppContext();
  const { geoCoordinates, state } = providerLocation;
  const { latitude, longitude } = geoCoordinates;
  const defaultDistance = distanceArray[2];

  const [loading, setLoading] = useState(false);
  const [showMoveToTopIndicator, setShowMoveToTopIndicator] = useState(false);
  const [isFilterModalEnabled, setEnableFilterModal] = useState(false);
  const [isFilterSelected, setFilterEnable] = useState(false);
  const [isSortEnabled, setSortEnable] = useState(false);

  const [getSelectedSortInfo, setSelectedSortInfo] = useState<SortInfo>(sortArray[0]);
  const [getSelectedDistanceInfo, setSelectedDistanceInfo] = useState<SortInfo>(defaultDistance);
  const [getSortQuery, setSortQuery] = useState<SortQuery>({});
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertModelProps | undefined>(undefined);
  const [planPreferenceInfo, setPlanPreferenceInfo] = useState<ProviderPlanPreferenceDTO | undefined>(undefined);
  const [isMapViewEnabled, setIsMapViewEnabled] = useState(false);
  const [isLoginDrawerEnabled, setIsLoginDrawerEnabled] = React.useState(false);
  const [isCreateAccountDrawerEnabled, setIsCreateAccountDrawerEnabled] = React.useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const isFocused = useIsFocused();

  const isAppointmentCardDisabled = useMemo(
    () => selectedProviders && selectedProviders.length === 0 && hasEditCounselor,
    [hasEditCounselor, selectedProviders]
  );

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        if (isFilterModalEnabled) {
          setEnableFilterModal(false);
          return true;
        }
        return false;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation, isFilterModalEnabled]);

  useEffect(() => {
    setHideChat(isFilterModalEnabled || isMapViewEnabled);
  }, [isFilterModalEnabled, isMapViewEnabled, setHideChat]);

  useEffect(() => {
    navigation.setOptions({ headerShown: !isFilterModalEnabled });
  }, [isFilterModalEnabled, navigation]);

  useEffect(() => {
    const getProvider = async () => {
      if (providersListArray.length === 0) {
        const result = await getPlanPreference();
        if (selectedPlanInfo?.planId) {
          setLoading(true);
          await providerFilterListAPI(
            0,
            getProvidersPayload({
              productTypes: result?.productTypes,
              specialties: result?.specialties,
            }),
            providersFiltersInfo
          );
          setLoading(false);
        } else {
          providerFilterListAPI(0, getProvidersPayload(), providersFiltersInfo);
        }
      }
    };
    getProvider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFocused && providersListArray.length > 0 && selectedProviders && selectedProviders.length > 0) {
      const selectedIds = selectedProviders.map((provider) => provider.providerId);
      const selectedProvidersList = providersListArray.filter((provider) =>
        provider.providerId ? selectedIds.includes(provider.providerId) : false
      );
      const nonSelectedProvidersList = providersListArray.filter((provider) =>
        provider.providerId ? !selectedIds.includes(provider.providerId) : true
      );
      setProvidersListArray([...selectedProvidersList, ...nonSelectedProvidersList]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const getAppointmentTabStatus = useCallback(async () => {
    try {
      const response: AppointmentTabStatusResponseDTO = await providerContext.serviceProvider.callService(
        API_ENDPOINTS.APPOINTMENT_TAB_STATUS,
        RequestMethod.GET,
        null,
        { isSecureToken: true }
      );

      setMemberAppointStatus({
        isAppointmentConfirmed: response.data.isApproved,
        isContinue: false,
        isPending: response.data.isInitiated,
      });
    } catch (error) {
      console.warn(error);
    }
  }, [providerContext.serviceProvider, setMemberAppointStatus]);

  const providerMemberStatusAPI = useCallback(async () => {
    try {
      const headers = { isSecureToken: true };

      const result: ProviderAppointmentStatusDTO = await providerContext.serviceProvider.callService(
        API_ENDPOINTS.PROVIDER_MEMBER_STATUS,
        RequestMethod.GET,
        null,
        headers
      );
      const response = result.data;
      if (response.success) {
        setMemberAppointStatus({
          isAppointmentConfirmed: false,
          isContinue: true,
          isPending: false,
          data: (response.data && response.data[0] && response.data[0].selectedProviders) ?? [],
        });
      } else {
        await getAppointmentTabStatus();
      }
    } catch (error) {
      console.warn(APP_CONTENT.GENERAL.GENERIC_ERROR_TEXT);
    }
  }, [getAppointmentTabStatus, providerContext.serviceProvider, setMemberAppointStatus]);

  useEffect(() => {
    if (loggedIn) {
      providerMemberStatusAPI();
    }
  }, [loggedIn, providerMemberStatusAPI]);

  const onPressScheduleAppointment = useCallback(() => {
    setIsAlertEnabled(false);
    navigation.navigate(Screen.SCHEDULE_APPOINTMENT);
  }, [navigation]);

  const removeCounselor: (selectedProviderIndex?: number) => void = (selectedProviderIndex?: number) => {
    if (
      selectedProviderIndex !== undefined &&
      selectedProviderIndex > -1 &&
      selectedProviders &&
      selectedProviders.length > 0
    ) {
      const newSelectedProviders = selectedProviders.filter((_, index) => index !== selectedProviderIndex);
      setSelectedProviders(newSelectedProviders);
      showAlert(newSelectedProviders.length === 0 ? ALERT_TYPE.ALL_COUNSELOR_REMOVED : ALERT_TYPE.COUNSELOR_REMOVED);
    }
  };

  const navigateToHome = useCallback(() => {
    setIsAlertEnabled(false);
    navigationHandler.linkTo({ action: AppUrl.HOME });
  }, [navigationHandler]);

  const navigateToPendingRequest = useCallback(() => {
    setIsAlertEnabled(false);
    setMemberAppointStatus(undefined);
    navigationHandler.linkTo({ action: AppUrl.PENDING_REQUESTS });
  }, [navigationHandler, setMemberAppointStatus]);

  const navigateToConfirmedRequest = useCallback(() => {
    setIsAlertEnabled(false);
    setMemberAppointStatus(undefined);
    navigationHandler.linkTo({ action: AppUrl.CONFIRMED_REQUESTS });
  }, [navigationHandler, setMemberAppointStatus]);

  const showAlert = (type: string, selectedProviderIndex?: number) => {
    let alertContent: AlertModelProps = {
      onHandlePrimaryButton: onPressScheduleAppointment,
      title: t('providers.alert.addCounselor.title'),
      subTitle: t('providers.alert.addCounselor.addMessage'),
      primaryButtonTitle: t('providers.alert.scheduleAppointmentButton'),
      modalVisible: true,
    };
    let remainingCounselor = (selectedProviders && 10 - (selectedProviders.length + 1)) ?? 0;
    switch (type) {
      case ALERT_TYPE.ADD_COUNSELOR:
        alertContent = {
          ...alertContent,
          onHandleSecondaryButton: closeAlert,
          subTitle: t('providers.alert.addCounselor.addMessage').replace('${count}', remainingCounselor.toString()),
          secondaryButtonTitle: t('providers.alert.addCounselorButton'),
        };
        break;
      case ALERT_TYPE.LIMIT_ADD_COUNSELOR:
        alertContent = {
          ...alertContent,
          onHandleSecondaryButton: closeAlert,
          subTitle: t('providers.alert.addCounselor.limitMessage'),
        };
        break;
      case ALERT_TYPE.REMOVE_COUNSELOR:
        alertContent = {
          ...alertContent,
          onHandlePrimaryButton: () => {
            removeCounselor(selectedProviderIndex);
          },
          onHandleSecondaryButton: closeAlert,
          title: t('providers.alert.removeCounselor.title'),
          subTitle: t('providers.alert.removeCounselor.message'),
          primaryButtonTitle: t('providers.alert.removeCounselor.primaryButton'),
          secondaryButtonTitle: t('providers.alert.removeCounselor.secondaryButton'),
          isError: true,
          errorIndicatorIconColor: appColors.lightDarkGray,
        };
        break;
      case ALERT_TYPE.COUNSELOR_REMOVED:
        remainingCounselor = (selectedProviders && 10 - (selectedProviders.length - 1)) ?? 0;
        alertContent = {
          ...alertContent,
          onHandleSecondaryButton: closeAlert,
          title: t('providers.alert.counselorRemoved.title'),
          subTitle: t('providers.alert.counselorRemoved.message').replace('${count}', remainingCounselor.toString()),
          secondaryButtonTitle: t('providers.alert.addCounselorButton'),
        };
        break;
      case ALERT_TYPE.ALL_COUNSELOR_REMOVED:
        alertContent = {
          ...alertContent,
          onHandleSecondaryButton: navigateToHome,
          onHandlePrimaryButton: closeAlert,
          title: t('providers.alert.allCounselorsRemoved.title'),
          subTitle: t('providers.alert.allCounselorsRemoved.message'),
          primaryButtonTitle: t('providers.alert.allCounselorsRemoved.primaryButton'),
          secondaryButtonTitle: t('providers.alert.allCounselorsRemoved.secondaryButton'),
          isError: true,
          errorIndicatorIconColor: appColors.lightDarkGray,
        };
        break;
      case ALERT_TYPE.PENDING_REQUEST:
        alertContent = {
          ...alertContent,
          onHandleSecondaryButton: closeAlert,
          onHandlePrimaryButton: navigateToPendingRequest,
          title: t('providers.alert.pendingRequest.title'),
          subTitle: t('providers.alert.pendingRequest.message'),
          primaryButtonTitle: t('providers.alert.pendingRequest.primaryButton'),
          secondaryButtonTitle: t('providers.alert.pendingRequest.secondaryButton'),
          isError: true,
          errorIndicatorIconColor: appColors.lightDarkGray,
        };
        break;
      case ALERT_TYPE.APPOINTMENT_CONFIRMED:
        alertContent = {
          ...alertContent,
          onHandlePrimaryButton: navigateToConfirmedRequest,
          title: t('providers.alert.appointmentConfirmed.title'),
          subTitle: t('providers.alert.appointmentConfirmed.message'),
          primaryButtonTitle: t('providers.alert.continue'),
        };
        break;
      default:
        break;
    }
    setAlertInfo(alertContent);
    setIsAlertEnabled(true);
  };

  const closeAlert = () => {
    setIsAlertEnabled(false);
  };

  useEffect(() => {
    // Check if any filter is selected
    if (providersFiltersInfo.length > 0) {
      const isEnabled = providersFiltersInfo.some((filter) => filter.data.some((option) => option.isSelected));
      setFilterEnable(isEnabled || getSelectedDistanceInfo.query !== defaultDistance.query);
    }
  }, [providersFiltersInfo, getSelectedDistanceInfo.query, defaultDistance.query]);

  const getProvidersPayload = useCallback(
    (data?: {
      counselorName?: string;
      distance?: string;
      filter?: ProviderFilterQuery[];
      latitude?: number;
      longitude?: number;
      page?: number;
      productInfo?: string;
      productTypes?: string[];
      sort?: SortQuery;
      specialties?: string[];
      state?: string;
    }) => {
      let payload: ProvidersPayload = {
        latitude: data?.latitude ?? latitude,
        longitude: data?.longitude ?? longitude,
        state: data?.state ?? state,
        counselorName: data?.counselorName ?? counselorName,
        page: data?.page ?? page,
        filter: data?.filter ? data.filter : providersFilterQueryInfo.length > 0 ? providersFilterQueryInfo : [],
        distance: data?.distance ?? getSelectedDistanceInfo.query,
        sort: data?.sort ?? getSortQuery,
      };

      if (selectedPlanInfo?.planId) {
        payload = {
          ...payload,
          planId: selectedPlanInfo.planId,
        };
      }
      if (data?.productTypes || planPreferenceInfo?.productTypes) {
        payload = {
          ...payload,
          productTypes: data?.productTypes ?? planPreferenceInfo?.productTypes ?? [],
        };
      }
      if (data?.specialties || planPreferenceInfo?.specialties) {
        payload = {
          ...payload,
          specialties: data?.specialties ?? planPreferenceInfo?.specialties ?? [],
        };
      }
      if (data?.productInfo || selectedProductTypeInfo?.value) {
        payload = {
          ...payload,
          productInfo: data?.productInfo ?? selectedProductTypeInfo?.value,
        };
      }
      if (client?.planId) {
        payload = {
          ...payload,
          eapPlanId: client.planId,
        };
      }
      return getProviderListPayload(payload).providersPayload;
    },
    [
      latitude,
      longitude,
      state,
      counselorName,
      page,
      providersFilterQueryInfo,
      getSelectedDistanceInfo.query,
      getSortQuery,
      selectedPlanInfo?.planId,
      planPreferenceInfo?.productTypes,
      planPreferenceInfo?.specialties,
      selectedProductTypeInfo?.value,
      client?.planId,
    ]
  );

  const clearFilters = async () => {
    let payload: ProvidersPayload = {
      latitude,
      longitude,
      state,
      counselorName,
      page: 0,
      filter: [],
      distance: defaultDistance.query,
      sort: getSortQuery,
    };

    if (selectedPlanInfo?.planId) {
      payload = {
        ...payload,
        planId: selectedPlanInfo.planId,
      };
    }
    if (planPreferenceInfo?.productTypes) {
      payload = {
        ...payload,
        productTypes: planPreferenceInfo.productTypes,
      };
    }
    if (planPreferenceInfo?.specialties) {
      payload = {
        ...payload,
        specialties: planPreferenceInfo.specialties,
      };
    }

    if (client?.planId) {
      payload = {
        ...payload,
        eapPlanId: client.planId,
      };
    }

    const { providersPayload } = getProviderListPayload(payload);

    if (selectedProviders && selectedProviders.length > 0) {
      setSelectedProviders([]);
    }
    setPage(0);
    setProvidersListArray([]);
    setProvidersFilterQueryInfo([]);
    await providerFilterListAPI(0, providersPayload, []);
    setSelectedDistanceInfo(defaultDistance);
  };

  const updateFilterList = useCallback(
    (filterList: ProviderFilter[], storedFilterData?: ProviderFilter[]) => {
      const cloneStoredFilterData = lodash.cloneDeep(storedFilterData ?? []);
      if (cloneStoredFilterData.length === 0) {
        setProvidersFiltersInfo(filterList);
      } else {
        // if any filter option is selected earlier, then update the seclected option in filter list
        const clonedFilterList = cloneDeep(filterList);
        const updatedFilterList = clonedFilterList.filter((section) => section.data.length > 0);
        updatedFilterList.map((section) => {
          const findSection = cloneStoredFilterData.find((filter) => filter.attribute === section.attribute);
          if (findSection) {
            section.isOpened = findSection.isOpened ?? false;
            section.data.forEach((option) => {
              const findOption = findSection.data.find((filter) => filter.title === option.title);
              if (findOption) {
                option.isSelected = findOption.isSelected ?? false;
              }
            });
          }
        });
        setProvidersFiltersInfo(updatedFilterList);
      }
    },
    [setProvidersFiltersInfo]
  );

  const getPlanPreference = async () => {
    try {
      const planId = client?.source === SourceType.EAP ? client.planId : selectedPlanInfo?.planId;
      if (!planId) {
        console.warn('Plan ID is undefined');
        return null;
      }
      const result: ProviderPlanPreferenceSuccessDTO = await providerContext.serviceProvider.callService(
        `${API_ENDPOINTS.PROVIDER_PLANS}/${planId}/preferences`,
        RequestMethod.GET,
        null
      );
      if (result.data) {
        if (client?.source === SourceType.EAP) {
          setEapPlanName(result.data.benefitPlanName);
        } else {
          setPlanPreferenceInfo(result.data);
        }
        return result.data;
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const providerFilterListAPI = useCallback(
    async (pageNum: number, dataPayload: {}, storedFilterData?: ProviderFilter[]) => {
      const data = dataPayload;
      setLoading(true);
      try {
        const result: ProviderListDTO = await providerContext.serviceProvider.callService(
          `/provider/${client?.source}/${client?.clientUri}/providers`,
          RequestMethod.POST,
          data
        );
        const response = result.data;
        updateFilterList(response.filters, storedFilterData ?? []);
        if (response.providers.length > 0) {
          setProvidersListArray((prevData: SearchProvider[]) => [...prevData, ...response.providers]);
          setPage(pageNum + 1);
        }
        setProvidersResultCount(response.total);
      } catch (error) {
        setProvidersResultCount(0);
        setProvidersListArray([]);
      } finally {
        setLoading(false);
      }
    },
    [
      client?.clientUri,
      client?.source,
      providerContext.serviceProvider,
      setPage,
      setProvidersListArray,
      setProvidersResultCount,
      updateFilterList,
    ]
  );

  const navigateToProviderDetailScreen = (provider: SearchProvider) => {
    navigation.navigate(Screen.PROVIDER_DETAIL, {
      provider,
    });
  };

  const onPressAppointmentRequest = () => {
    if (loggedIn) {
      navigateToScheduleAppointment();
    } else {
      setNavigateScreen(ScreenNames.SCHEDULE_APPOINTMENT);
      navigateToLoginScreen();
    }
  };

  const navigateToLoginScreen = () => {
    if (client?.source === SourceType.MHSUD) {
      setIsLoginDrawerEnabled(true);
    } else {
      navigationHandler.linkTo({ action: AppUrl.LOGIN });
    }
  };

  const navigateToScheduleAppointment = () => {
    navigation.navigate(Screen.SCHEDULE_APPOINTMENT);
  };

  const onPressFilterButton = () => {
    setEnableFilterModal(true);
  };

  // Toggle the filter section
  const onPressFilterSection = useCallback(
    (attribute: string) => {
      const findSectionIndex = providersFiltersInfo.findIndex((filter) => filter.attribute === attribute);
      if (findSectionIndex > -1) {
        const clone = lodash.cloneDeep(providersFiltersInfo);
        clone[findSectionIndex].isOpened = !clone[findSectionIndex].isOpened;
        setProvidersFiltersInfo(clone);
      }
    },
    [providersFiltersInfo, setProvidersFiltersInfo]
  );

  const constructFilterQuery = useCallback(
    (attribute: string, option: FilterOption, isCheckbox?: boolean, isMoreOptionFlag?: boolean) => {
      let getQuery = [];
      if (option.isSelected) {
        getQuery = providersFilterQueryInfo.filter((query) =>
          isMoreOptionFlag
            ? query.bool.should[0].match_phrase[option.attribute] !== 1
            : isCheckbox
              ? query.bool.should[0].match_phrase[attribute] !== 1
              : query.bool.should[0].match_phrase[attribute] !== option.title
        );
      } else {
        const query = {
          bool: {
            should: [
              {
                match_phrase: isMoreOptionFlag
                  ? { [option.attribute]: 1 }
                  : { [attribute]: isCheckbox ? 1 : option.title },
              },
            ],
          },
        };
        getQuery = [...providersFilterQueryInfo, query];
      }
      setProvidersFilterQueryInfo(getQuery);
      return getQuery;
    },
    [providersFilterQueryInfo, setProvidersFilterQueryInfo]
  );

  const onPressFilterResults = useCallback(
    async (getFiltersData: ProviderFilter[], filterQuery: ProviderFilterQuery[]) => {
      let payload: ProvidersPayload = {
        latitude,
        longitude,
        state,
        counselorName,
        page: 0,
        filter: filterQuery,
        distance: getSelectedDistanceInfo.query,
        sort: getSortQuery,
      };

      if (selectedPlanInfo?.planId) {
        payload = {
          ...payload,
          planId: selectedPlanInfo.planId,
        };
      }
      if (planPreferenceInfo?.productTypes) {
        payload = {
          ...payload,
          productTypes: planPreferenceInfo.productTypes,
        };
      }
      if (planPreferenceInfo?.specialties) {
        payload = {
          ...payload,
          specialties: planPreferenceInfo.specialties,
        };
      }
      if (client?.planId) {
        payload = {
          ...payload,
          eapPlanId: client.planId,
        };
      }

      const { providersPayload } = getProviderListPayload(payload);
      setPage(0);
      if (selectedProviders && selectedProviders.length > 0) {
        setSelectedProviders([]);
      }
      setProvidersListArray([]);
      await providerFilterListAPI(0, providersPayload, getFiltersData);
    },
    [
      client?.planId,
      counselorName,
      getSelectedDistanceInfo.query,
      getSortQuery,
      latitude,
      longitude,
      planPreferenceInfo?.productTypes,
      planPreferenceInfo?.specialties,
      providerFilterListAPI,
      selectedPlanInfo?.planId,
      selectedProviders,
      setPage,
      setProvidersListArray,
      setSelectedProviders,
      state,
    ]
  );

  const onPressFilterOption = useCallback(
    (item: FilterOption, section: ProviderFilter) => {
      const findSectionIndex = providersFiltersInfo.findIndex((filter) => filter.attribute === section.attribute);
      if (findSectionIndex > -1) {
        const clone = lodash.cloneDeep(providersFiltersInfo);
        const findOptionIndex = clone[findSectionIndex].data.findIndex((filter) => filter.title === item.title);
        if (findOptionIndex > -1) {
          const filterQuery = constructFilterQuery(
            clone[findSectionIndex].attribute,
            clone[findSectionIndex].data[findOptionIndex],
            clone[findSectionIndex].isCheckbox,
            clone[findSectionIndex].isMoreOptionFlag
          );
          clone[findSectionIndex].data[findOptionIndex].isSelected =
            !clone[findSectionIndex].data[findOptionIndex].isSelected;
          setProvidersFiltersInfo(clone);
          onPressFilterResults(clone, filterQuery);
        }
      }
    },
    [constructFilterQuery, providersFiltersInfo, onPressFilterResults, setProvidersFiltersInfo]
  );

  const onMomentumScrollEnd = () => {
    if (!isFilterModalEnabled && !loading) {
      providerFilterListAPI(page, getProvidersPayload(), providersFiltersInfo);
    }
  };

  const onCloseFilters = useCallback(() => {
    setEnableFilterModal(false);
    if (providersFiltersInfo.length > 0) {
      providersFiltersInfo.map((section) => {
        if (section.data.length > 0 && section.isOpened) {
          section.isOpened = section.data.some((option) => option.isSelected);
        }
      });
      setProvidersFiltersInfo(providersFiltersInfo);
    }
  }, [providersFiltersInfo, setProvidersFiltersInfo]);

  const closeModelPopup = useCallback(() => {
    setSortEnable(false);
  }, []);

  const onPressSortButton = useCallback(() => {
    setSortEnable(true);
  }, []);

  const onPressSortInfo = useCallback(
    async (selectedInfo: SortInfo) => {
      closeModelPopup();
      if (selectedInfo.label !== getSelectedSortInfo.label) {
        setSelectedSortInfo(selectedInfo);
        let query = {};
        if (selectedInfo.query) {
          query = {
            [selectedInfo.query]: { order: 'asc' },
          };
        }
        setPage(0);
        setProvidersListArray([]);
        await providerFilterListAPI(0, getProvidersPayload({ sort: query, page: 0 }), providersFiltersInfo);
        setSortQuery(query);
      }
    },
    [
      closeModelPopup,
      providersFiltersInfo,
      getProvidersPayload,
      getSelectedSortInfo.label,
      providerFilterListAPI,
      setPage,
      setProvidersListArray,
    ]
  );

  const onPressMapButton = useCallback(() => {
    setIsMapViewEnabled(true);
  }, []);

  const onPressListView = useCallback(() => {
    setIsMapViewEnabled(false);
  }, []);

  const onPressDistanceInfo = useCallback(
    async (selectedInfo: SortInfo) => {
      if (selectedInfo.query !== getSelectedDistanceInfo.query) {
        setSelectedDistanceInfo(selectedInfo);
        setPage(0);
        setProvidersListArray([]);
        await providerFilterListAPI(
          0,
          getProvidersPayload({ distance: selectedInfo.query, page: 0 }),
          providersFiltersInfo
        );
      }
    },
    [
      providersFiltersInfo,
      getProvidersPayload,
      getSelectedDistanceInfo.query,
      providerFilterListAPI,
      setPage,
      setProvidersListArray,
    ]
  );

  const handleScrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, []);

  const onScroll = useCallback((y: number) => {
    setShowMoveToTopIndicator(y > 0);
  }, []);

  const resetQuery = useCallback(() => {
    setProvidersFilterQueryInfo([]);
    setPage(0);
    setProvidersListArray([]);
    setSelectedSortInfo(sortArray[0]);
    setSortQuery({});
    setSelectedDistanceInfo(distanceArray[1]);
    setSelectedProviders([]);
  }, [setProvidersFilterQueryInfo, setPage, setProvidersListArray, sortArray, distanceArray, setSelectedProviders]);

  const onSubmitLocation = useCallback(
    async (data: ProviderLocationDetails) => {
      resetQuery();
      await providerFilterListAPI(
        0,
        getProvidersPayload({
          latitude: data.geoCoordinates.latitude,
          longitude: data.geoCoordinates.longitude,
          state: data.state,
          page: 0,
          filter: [],
          distance: distanceArray[1].query,
          sort: {},
        })
      );
    },
    [distanceArray, getProvidersPayload, providerFilterListAPI, resetQuery]
  );

  const onSubmitProductType = async () => {
    resetQuery();
    if (selectedProductTypeInfo?.value) {
      setLoading(true);
      await providerFilterListAPI(
        0,
        getProvidersPayload({
          productInfo: selectedProductTypeInfo.value,
        }),
        providersFiltersInfo
      );
      setLoading(false);
    }
  };

  const onSubmitPlan = async () => {
    resetQuery();
    setLoading(true);
    const result = await getPlanPreference();
    if (selectedPlanInfo?.planId) {
      await providerFilterListAPI(
        0,
        getProvidersPayload({
          productTypes: result?.productTypes,
          specialties: result?.specialties,
        }),
        providersFiltersInfo
      );
    }
    setLoading(false);
  };

  const onSubmitCounselor = useCallback(
    async (counselor: string) => {
      resetQuery();
      await providerFilterListAPI(
        0,
        getProvidersPayload({
          counselorName: counselor,
          page: 0,
          filter: [],
          distance: distanceArray[1].query,
          sort: {},
        })
      );
    },
    [distanceArray, getProvidersPayload, providerFilterListAPI, resetQuery]
  );

  const onPressSelectProvider = useCallback(
    (providerInfo: SearchProvider, findIndex: number) => {
      setSelectedProviders((prevSelectedProviders) => {
        const newSelectedProviders =
          prevSelectedProviders && prevSelectedProviders.length > 0 ? [...prevSelectedProviders] : [];
        if (findIndex > -1) {
          newSelectedProviders.splice(findIndex, 1);
        } else if (newSelectedProviders.length < 10) {
          const selectedProviderData = getSelectedProviderDetails(providerInfo);
          newSelectedProviders.push(selectedProviderData);
        }
        return newSelectedProviders;
      });
    },
    [setSelectedProviders]
  );

  const onPressSelectProviderWithEditFlow = (providerInfo: SearchProvider, findIndex: number) => {
    setSelectedProviders((prevSelectedProviders) => {
      const newSelectedProviders =
        prevSelectedProviders && prevSelectedProviders.length > 0 ? [...prevSelectedProviders] : [];
      if (findIndex > -1) {
        showAlert(ALERT_TYPE.REMOVE_COUNSELOR, findIndex);
      } else if (newSelectedProviders.length < 10) {
        const selectedProviderData = getSelectedProviderDetails(providerInfo);
        newSelectedProviders.push(selectedProviderData);
        showAlert(newSelectedProviders.length === 10 ? ALERT_TYPE.LIMIT_ADD_COUNSELOR : ALERT_TYPE.ADD_COUNSELOR);
      }
      return newSelectedProviders;
    });
  };
  const onHandleSelectProvider = (providerInfo: SearchProvider, findIndex: number) => {
    if (memberAppointmentStatus?.isPending) {
      showAlert(ALERT_TYPE.PENDING_REQUEST);
    } else if (memberAppointmentStatus?.isAppointmentConfirmed) {
      showAlert(ALERT_TYPE.APPOINTMENT_CONFIRMED);
    } else if (
      memberAppointmentStatus?.isContinue &&
      memberAppointmentStatus.data &&
      memberAppointmentStatus.data.length > 0
    ) {
      onPressScheduleAppointment();
    } else {
      if (hasEditCounselor) {
        onPressSelectProviderWithEditFlow(providerInfo, findIndex);
      } else {
        onPressSelectProvider(providerInfo, findIndex);
      }
    }
  };

  const navigateToMhsudLoginScreen = useCallback(() => {
    onCloseLoginDrawer();
    navigationHandler.linkTo({ action: AppUrl.LOGIN_MHSUD });
  }, [navigationHandler]);

  const onCloseLoginDrawer = () => {
    setIsLoginDrawerEnabled(false);
  };

  const onCloseCreateAccountDrawer = () => {
    setIsCreateAccountDrawerEnabled(false);
  };

  const navigateToCreateAccount = () => {
    onCloseCreateAccountDrawer();
    navigationHandler.linkTo({ action: AppUrl.CREATE_ACCOUNT_MHSUD });
  };

  const onPressCreateAccountButton = () => {
    onCloseLoginDrawer();
    setIsCreateAccountDrawerEnabled(true);
  };

  return {
    setLoggedIn,
    providersListArray,
    navigateToProviderDetailScreen,
    page,
    loading,
    geoCoordinates,
    setPage,
    closeModelPopup,
    clearFilters,
    distanceArray,
    selectedProviders,
    providersFiltersInfo,
    providerLocation,
    navigateToLoginScreen,
    loggedIn,
    providersResultCount,
    isFilterModalEnabled,
    setEnableFilterModal,
    onPressFilterOption,
    onPressFilterSection,
    onPressFilterResults,
    onCloseFilters,
    isFilterSelected,
    handleScrollToTop,
    onPressMapButton,
    onPressSortButton,
    onScroll,
    providerFilterListAPI,
    scrollRef,
    showMoveToTopIndicator,
    sortArray,
    onMomentumScrollEnd,
    onPressFilterButton,
    getSelectedSortInfo,
    getSelectedDistanceInfo,
    onPressSortInfo,
    onPressDistanceInfo,
    isSortEnabled,
    onSubmitLocation,
    onSubmitCounselor,
    onSubmitPlan,
    onPressAppointmentRequest,
    alertInfo,
    onHandleSelectProvider,
    isAlertEnabled,
    hasEditCounselor,
    isAppointmentCardDisabled,
    onSubmitProductType,
    isMapViewEnabled,
    onPressListView,
    isLoginDrawerEnabled,
    isCreateAccountDrawerEnabled,
    navigateToMhsudLoginScreen,
    navigateToCreateAccount,
    onPressCreateAccountButton,
    onCloseLoginDrawer,
    onCloseCreateAccountDrawer,
  };
};
