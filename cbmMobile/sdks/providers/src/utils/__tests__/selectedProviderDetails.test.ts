import { mockProviderInfo } from '../../__mocks__/mockProviderInfo';
import { getSelectedProviderDetails } from '../selectedProviderDetails';

describe('getSelectedProviderDetails', () => {
  it('should return correct provider details', () => {
    const result = getSelectedProviderDetails(mockProviderInfo);
    expect(result).toEqual({
      addressOne: 'VIRTUAL VISITS ONLY',
      addressTwo: '',
      beaconLocationId: 'F507631',
      city: 'NEW YORK',
      distance: 2.6811461526390272,
      email: 'contact@beaconhealthoptions.com',
      firstName: 'ZULMA',
      isInsuranceCarrierAccepted: false,
      isMemberOpted: false,
      lastName: 'RODRIGUEZ',
      name: 'ZULMA RODRIGUEZ LCSW',
      phone: '8552276562',
      provDetailsId: 'R4dEMJIB-uHGCQA_7oEj',
      providerId: 3528,
      providerPrefferedDateAndTime: null,
      providerType: 'Practitioner',
      state: 'NY',
      title: 'LCSW',
      zip: '10119',
    });
  });
});
