
class Address {
  adminDistrict: string;
  adminDistrict2: string;
  countryRegion: string;
  formattedAddress: string;
  locality: string;
  postalCode: string;
}

class Point {
  type: string;
  coordinates: number[];
}

class IResource {
  bbox: number[];
  name: string;
  point: Point;
  address: Address;
  confidence: string;
  entityType: string;
  geocodePoints: Point;
  matchCodes: string[];
}

class ResourceSet {
  estimatedTotal: number;
  resources: IResource[];
}

export class BingResponse {
  authenticationResultCode: string;
  brandLogoUri: string;
  copyright: string;
  resourceSets: ResourceSet[];
  statusCode: number;
  statusDescription: string;
  traceId: string;
}
