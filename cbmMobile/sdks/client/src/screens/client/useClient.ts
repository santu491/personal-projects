import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';
import { TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import { AppUrl } from '../../../../../shared/src/models';
import { Client, ClientInfo, ClientListResponseDTO } from '../../../../../shared/src/models/src/features/client';
import { API_ENDPOINTS } from '../../../../../src/config';
import { ExperienceType, Language } from '../../../../../src/config/apiEndpoints';
import { SourceType } from '../../../../../src/constants/constants';
import { useAppContext } from '../../../../../src/context/appContext';
import { RequestMethod } from '../../../../../src/models/adapters';
import { storage, StorageNamespace } from '../../../../../src/util/storage';
import { CLIENT_STORAGE_KEY, OPEN_BOTTOMSHEET } from '../../constants/constants';
import { useClientContext } from '../../context/client.sdkContext';
import { ClientDataDTO, ClientResponseDTO } from '../../model/client';
import { ClientSearchScreenProps } from '../../navigation/client.navigationTypes';

export const useClient = () => {
  const [showModel, setShowModel] = useState(false);
  const [drawerStep, setDrawerStep] = useState(0);
  const [selectedClient, setSelectedClient] = useState<ClientDataDTO>();
  const [searchText, setSearchText] = useState<string>('');
  const [clientsList, setClientsList] = useState<ClientInfo[]>([]);
  const [selectedClientDetails, setSelectedClientDetails] = useState<ClientInfo | undefined>();
  const [clientsListInfo, setClientsListInfo] = useState<ClientInfo[]>([]);
  const [isClientFocused, setIsClientFocused] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const clientContext = useClientContext();
  const appContext = useAppContext();
  const { navigationHandler } = clientContext;
  const routeParams = useRoute<ClientSearchScreenProps['route']>().params;
  const [isHeaderBackIcon, showHeaderBackIcon] = useState(false);
  const [isError, setError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (routeParams) {
      showHeaderBackIcon(routeParams.showHeaderBackIcon ?? false);
    }
  }, [routeParams]);

  useEffect(() => {
    const getClientList = async () => {
      const response: ClientListResponseDTO = await clientContext.serviceProvider.callService(
        `/${ExperienceType.PUBLIC}/carelon/${Language.EN}${API_ENDPOINTS.CLIENT}`,
        RequestMethod.GET,
        null
      );
      if ((response.data.data ?? []).length > 0) {
        setClientsListInfo(
          response.data.data?.map((item, index) => ({
            ...item,
            title: item.clientName,
            index: index.toString(),
          })) ?? []
        );
      }
    };
    getClientList();
  }, [clientContext.serviceProvider, setClientsListInfo]);

  const autoClientSearchResults = useCallback(
    async (addressText: string) => {
      try {
        const clients = clientsListInfo.filter(
          (item) =>
            item.clientName.toLowerCase().includes(addressText.toLowerCase()) ||
            item.clientUri.toLowerCase().includes(addressText.toLowerCase())
        );
        if (clients.length > 0) {
          setClientsList(clients);
          setSearchError(clients.length > 0 ? undefined : `${t('client.errorMessage')}`);
        } else {
          setSearchError(`${t('client.errorMessage')}`);
          setClientsList([]);
        }
      } catch (error) {
        setSearchError(`${t('client.errorMessage')}`);
        setClientsList([]);
        console.warn('Error fetching Client', error);
      } finally {
        setIsLoading(false);
      }
    },
    [clientsListInfo, t]
  );

  const dropDownItem = useMemo(() => {
    return clientsList.map(({ title }, index) => ({ title, id: index.toString() }));
  }, [clientsList]);

  const onChangeClientName = useCallback(
    (value: string) => {
      setSearchText(value);
      if (value.length < 3) {
        setClientsList([]);
        setSearchError(undefined);
        return;
      }
      autoClientSearchResults(value);
    },
    [autoClientSearchResults]
  );

  const onPressClientName = useCallback(
    async (item: TAutocompleteDropdownItem) => {
      if (!item.title) {
        console.warn('No client name provided');
        return;
      }

      const clientDetails = clientsList.find(
        (client) => item.title && client.clientName.toLowerCase() === item.title.toLowerCase()
      );

      if (!clientDetails) {
        console.warn('Client not found in the list');
        return;
      }

      try {
        setSearchText(item.title);
        setIsLoading(true);

        const clientUrl = `/${ExperienceType.PUBLIC}/${clientDetails.source}/${Language.EN}${API_ENDPOINTS.CLIENT}/${clientDetails.clientUri}/properties`;
        const response: ClientResponseDTO = await clientContext.serviceProvider.callService(
          clientUrl,
          RequestMethod.GET,
          null,
          { source: clientDetails.source }
        );

        setSelectedClientDetails(clientDetails);
        setSelectedClient(response.data);
        setClientsList([]);
        setShowModel(true);
        Keyboard.dismiss();
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [clientContext.serviceProvider, clientsList]
  );

  const onFocusClientInput = useCallback(() => {
    setIsClientFocused(true);
  }, []);

  const onBlurClientInput = useCallback(() => {
    setIsClientFocused(false);
  }, []);

  const saveClientDetails = useCallback(
    (clientSource?: string) => {
      if (selectedClient) {
        let clientDetails: Client = {
          groupId: selectedClient.groupId,
          subGroupName: selectedClient.subGroupName,
          userName: selectedClient.userName,
          supportNumber: selectedClient.supportNumber,
          logoUrl: selectedClient.logoUrl,
          shouldUpdateHomeInfo: false,
          plans: selectedClient.plans,
          clientUri: selectedClientDetails?.clientUri,
          clientName: selectedClientDetails?.clientName,
          source: clientSource ?? selectedClientDetails?.source,
          originalSource: selectedClientDetails?.source,
        };
        if (selectedClient.planId) {
          clientDetails = {
            ...clientDetails,
            planId: selectedClient.planId,
          };
        }
        const clientStorage = storage(StorageNamespace.ClientSDK);
        clientStorage.setObject(CLIENT_STORAGE_KEY, clientDetails);
        appContext.setClient(clientDetails);
      }
    },
    [
      selectedClient,
      selectedClientDetails?.clientUri,
      selectedClientDetails?.clientName,
      selectedClientDetails?.source,
      appContext,
    ]
  );
  const onPressNextButton = useCallback(() => {
    if (!selectedClientDetails) {
      console.warn('No client details selected');
      return;
    }

    if (selectedClientDetails.source === SourceType.COMBINED) {
      setDrawerStep((prevStep) => prevStep + 1);
    } else {
      saveClientDetails(selectedClientDetails.source);
      setShowModel(false);
      navigationHandler.linkTo({ action: AppUrl.HOME });
    }
  }, [navigationHandler, saveClientDetails, selectedClientDetails]);

  const onPressGoBackButton = () => {
    setShowModel(false);
  };

  const navigateToLogin = () => {
    //created placeholder for login
  };

  const navigateToSignUp = () => {
    //created placeholder for signup
  };

  const onPrimaryMSUDButtonPress = useCallback(() => {
    setShowModel(false);
    saveClientDetails(SourceType.MHSUD);
    navigationHandler.linkTo({ action: AppUrl.HOME });
  }, [navigationHandler, saveClientDetails]);

  const onSecondaryEAPButtonPress = useCallback(() => {
    setShowModel(false);
    saveClientDetails(SourceType.EAP);
    navigationHandler.linkTo({ action: AppUrl.HOME });
  }, [navigationHandler, saveClientDetails]);

  const onRequestModalClose = () => {
    setShowModel(false);
    setDrawerStep(0);
  };

  return {
    showModel,
    setShowModel,
    onPressGoBackButton,
    selectedClient,
    OPEN_BOTTOMSHEET,
    searchText,
    clientsList,
    setClientsList,
    onChangeClientName,
    onPressClientName,
    isClientFocused,
    onFocusClientInput,
    onBlurClientInput,
    setSearchText,
    searchError,
    dropDownItem,
    isLoading,
    drawerStep,
    setDrawerStep,
    navigateToLogin,
    navigateToSignUp,
    onRequestModalClose,
    clientsListInfo,
    selectedClientDetails,
    isHeaderBackIcon,
    onPrimaryMSUDButtonPress,
    onSecondaryEAPButtonPress,
    onPressNextButton,
    setError,
    isError,
  };
};
