export interface Link {
    title: string;
    url: string;
}

export interface TrainingLink {
    sectionId?: string;
    sectionTitle: string;
    link: Link[];
}