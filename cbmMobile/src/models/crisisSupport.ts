export interface CrisisSupportResponseDTO {
  data: CrisisSupportDataDTO[];
}

export interface CrisisSupportDataDTO {
  list: CrisisSupportListDTO[];
  title: string;
}

export interface CrisisSupportListDTO {
  details: CrisisSupportDataDTO[];
  item: string;
}
export interface CrisisSupportDataDTO {
  hours: [] | string[];
  text: string;
}

export interface CrisisSectionData {
  crisisSupportDetails?: CrisisDataList[];
  sectionTitle: string;
}

export interface CrisisDataItem {
  hours?: string[];
  id?: string;
  link?: string | undefined;
  prefixText?: string | undefined;
  suffixText?: string | undefined;
  text?: string;
}

export interface CrisisDataList {
  details: CrisisDataItem[];
  item: CrisisDataItem;
}
