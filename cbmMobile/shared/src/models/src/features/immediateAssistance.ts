export interface ImmediateAssistanceProps {
  contactsInfo: ContactInfo[] | undefined;
  onPressContact: (contact: ContactInfo) => void;
  title?: string;
}

export interface ContactInfo {
  key?: string;
  type?: string;
  value?: string;
}

export enum AssistanceType {
  CRISIS_SUPPORT = 'immediateAssistance',
  MEMBER_SUPPORT = 'memberSupport',
}
