export interface Client {
  clientName?: string; // it is mapped to clientName
  clientUri?: string;
  groupId: string;
  // is mapped to clientGroupId
  logoUrl?: string;
  originalSource?: string;
  planId?: string;
  // it is mapped to clientName
  plans?: ClientPlan[];
  shouldUpdateHomeInfo?: boolean;
  source?: string;
  subGroupName: string;
  // is mapped to departmentName of registration api
  supportNumber: string;
  userName?: string;
}

export interface ClientListResponseDTO {
  data: ClientListDTO;
}

export interface ClientListDTO {
  data?: ClientInfo[];
}

export interface ClientInfo {
  clientName: string;
  clientUri: string;
  source: string;
  title: string;
}

export interface ClientPlan {
  beaconPlanName: string;
  client: string;
  label: string;
  memberFacingPlanName: string;
  parentCode: string;
  planId: string;
  value: string;
}
