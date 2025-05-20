export interface Community {
  createdBy: string;
  title: string;
  category: string;
  categoryId: string;
  color: string;
  type: string;
  parent: string;
  createdDate: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  displayName: {
    en: string;
    es: string;
  };
  isNew?: boolean;
  active?: boolean;
  image?: string;
}
