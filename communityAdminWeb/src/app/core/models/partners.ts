export interface Partners {
  id: string;
  title: string;
  active: boolean;
  logoImage: string;
  articleImage?: string | null;
  type?: string;
}

export interface PartnerRequest {
  title: string;
  logoImage?: string;
  active: boolean;
  articleImage: string | null;
}

export interface PartnerSection {
  id?: string;
  title: string;
  description: {
    en: string;
    es: string;
  };
  logoImage: string;
  isEdit?: boolean;
}
