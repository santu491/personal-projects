export interface AppImageData {
  id?: string;
  title: string;
  image: string;
  type?: string;
}

export enum ImageType {
  ICON = 'icon',
  REGULAR = 'regular'
}
