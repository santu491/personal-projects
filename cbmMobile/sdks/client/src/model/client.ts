import { ClientPlan } from '../../../../shared/src/models/src/features/client';
export interface ClientResponseDTO {
  data: ClientDataDTO;
}

export interface ClientsDTO {
  clients: ClientDataDTO[];
  message: string;
  success: boolean;
}

export interface ClientDataDTO {
  alias: [];
  benefitPackage: string;
  brandCode: string;
  brandName: string;
  clientId: string;
  clientName: string;
  createdBy: string;
  createdDate: string;
  footerDisclosureNote: string;
  groupId: string;
  groupName: string;
  id: string;
  isSameParentCode: boolean;
  livePersonChat: boolean;
  logoUrl: string;
  mdLiveOU: string;
  onboardType: string;
  organizationName: string;
  parentCode: string;
  planId: string;
  plans?: ClientPlan[];
  programName: string;
  sessionsProvide: string;
  subGroupName: string;
  supportNumber: string;
  title: string;
  updatedBy: string;
  updatedDate: string;
  userName: string;
}

export interface Client {
  groupId: string; // is mapped to clientGroupId
  logoUrl: string;
  plans?: ClientPlan[];
  subGroupName: string;
  supportNumber: string;
  userName: string;
}
