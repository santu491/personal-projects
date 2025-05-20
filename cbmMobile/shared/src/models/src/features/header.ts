export interface Header {
  [key: string]: HeaderInfo;
}

export interface HeaderInfo {
  data?: HeaderData[];
  id?: string;
  label?: string;
  title?: string;
  type?: string;
  url?: string;
}

export interface HeaderData {
  key?: string;
  value?: string;
}
