export interface DeepLink {
    label: string;
    url: string;
    copyright?: string;
    iconType?: string;
    brandLogo?: string;
}

export interface Templates {
    id: string;
    name: string;
    active: boolean;
    title: string;
    body: string;
    activityText: string;
    deepLink: DeepLink;
}