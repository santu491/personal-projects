import { certs } from '../certs';

describe('certs', () => {
  it('should have correct publicKeyHashes for api.mobile.carelonbehavioralhealth.com', () => {
    expect(certs['api.mobile.carelonbehavioralhealth.com'].publicKeyHashes).toEqual([
      '0eBGuOGvy3D6fLmF5LJ+t4hAPeqH7pQ7oeY4dg6xqIU=',
    ]);
  });

  it('should have correct publicKeyHashes for dev1.api.mobile.carelon.com', () => {
    expect(certs['dev1.api.mobile.carelon.com'].publicKeyHashes).toEqual([
      'vdfq7i9uOuRQ8a4AMchU5OYnld40hxbuc5gP+tSiINs=',
    ]);
  });

  it('should have correct publicKeyHashes for sit1.api.mobile.carelon.com', () => {
    expect(certs['sit1.api.mobile.carelon.com'].publicKeyHashes).toEqual([
      'vdfq7i9uOuRQ8a4AMchU5OYnld40hxbuc5gP+tSiINs=',
    ]);
  });

  it('should have correct publicKeyHashes for uat1.api.mobile.carelon.com', () => {
    expect(certs['uat1.api.mobile.carelon.com'].publicKeyHashes).toEqual([
      'vdfq7i9uOuRQ8a4AMchU5OYnld40hxbuc5gP+tSiINs=',
    ]);
  });
});
