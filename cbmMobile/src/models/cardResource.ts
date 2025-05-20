export interface CardResourceDTO {
  data: CardResource;
}

export interface CardResource {
  page?: Page;
}

export interface Page {
  cards?: CardsInfo;
  subtitle?: string;
  title?: string;
}

export interface CardsInfo {
  banner?: CardBannerInfo;
  contact?: Contact;
  exclusiveBenefits?: ExclusiveBenefits;
  getHelpCases?: GetHelpCases;
}

export interface CardBannerInfo {
  buttons?: BannerButtons;
  description?: string;
  image?: string;
  title?: string;
}

export interface BannerButtons {
  [key: string]: BannerButtonsData;
}

export interface BannerButtonsData {
  enabled?: boolean;
  label?: string;

  openURLInNewTab?: boolean;
  page?: BannerButtonPage;
  redirectUrl?: string;
}

export interface BannerButtonData {
  enabled?: boolean;
  label?: string;
  openURLInNewTab?: boolean;
  page?: BannerButtonPage;
  redirectUrl?: string;
}

export interface BannerButtonPage {
  data: BannerButtonPageSectionData[];
  description?: string;
  title?: string;
  wpoRedirectUrl?: string;
}

export interface BannerButtonPageSectionData {
  data: BannerButtonPageDataData[];
  description?: string;
  path?: string;
  title?: string;
  type?: string;
}

export interface BannerButtonPageDataData extends BannerButtonPageSectionData {
  isDynamicWPORedirectUrl?: boolean;
  openURLInNewTab?: boolean;
  redirectUrl?: string;
  tags?: string[];
}

export interface Contact {
  description?: string;
  image?: string;
  number?: string;
  title?: string;
}

export interface GetHelpCases {
  data?: GetHelpCasesData[];
  title?: string;
}

export interface GetHelpCasesData {
  image?: string;
  title?: string;
}

export interface ExclusiveBenefits {
  data?: ExclusiveBenefitsData[];
  title?: string;
}

export interface ExclusiveBenefitsData {
  image?: string;
  title?: string;
}
