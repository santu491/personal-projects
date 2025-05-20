export interface ChatConfig {
  deploymentId: string;
  environment: string;
  isChatFlowEnabled: boolean;
  key?: string;
  url: string;
}

export interface GenesysChat {
  anonymousUserHeader: string;
  clientLogo?: string;
  closedHeader: string;
  closedSupportAssistance: string;
  disableHeader?: boolean;
  disabled?: boolean;
  enabled: boolean;
  errorHeader: string;
  errorSupportAssistance: string;
  header: string;
  icon?: string;
  id?: string;
}
