export interface RouterNode {
  btnName: string;
  routerLink?: string;
  matIcon?: string;
  routerLinkActive?: string;
  children?: RouterNode[];
  expandable: boolean;
}

export interface FlatRouterNode {
  name: string;
  expandable: boolean;
  level: number;
  routerLink?: string;
  matIcon?: string;
  routerLinkActive?: string;
}
