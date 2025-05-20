import { SearchProvider } from '../model/providerSearchResponse';

export const getSelectedProviderDetails = (providerInfo: SearchProvider) => {
  const providerDetails = {
    provDetailsId: providerInfo.id,
    providerId: providerInfo.providerId,
    beaconLocationId: providerInfo.beaconLocationId ?? '',
    email: providerInfo.contact?.officeEmail,
    phone: providerInfo.contact?.phone,
    name: providerInfo.name?.displayName,
    firstName: providerInfo.name?.firstName,
    lastName: providerInfo.name?.lastName,
    title: providerInfo.title,
    addressOne: providerInfo.contact?.address.addr1,
    addressTwo: providerInfo.contact?.address.addr2,
    city: providerInfo.contact?.address.city,
    state: providerInfo.contact?.address.state,
    zip: providerInfo.contact?.address.zip,
    distance: providerInfo.fields?.distance[0],
    providerType: providerInfo.providerType,
    isMemberOpted: false, // will be changed future
    isInsuranceCarrierAccepted: false, // will be changed future
    providerPrefferedDateAndTime: null, // will be changed future
  };
  return providerDetails;
};
