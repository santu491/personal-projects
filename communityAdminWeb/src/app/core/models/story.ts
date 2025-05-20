import { ExistingCommentResponse } from "./comment";
import { ReactionCount, ReactionLog } from "./reactions";
import { UserDetails } from "./user";

export interface Answer {
    id: string;
    promptId: string;
    question: string;
    questionAuthorId: string;
    questionAuthorFirstName: string;
    questionAuthorDisplayName: string;
    questionAuthorProfilePicture: string;
    sensitiveContentText: string;
    response: string;
    order: number;
    createdDate: Date;
    updatedDate: Date;
    type: string;
    optionType: string;
}

export interface StoryResponse {
    id: string;
    communityId: string;
    authorId: string;
    authorAgeWhenStoryBegan: number;
    relation: string;
    displayName: string;
    relationAgeWhenDiagnosed: number;
    featuredQuote: string;
    answer: Answer[];
    storyText: string;
    createdDate: Date;
    updatedDate: Date;
    publishedAt: Date;
    published: boolean;
    flagged: boolean;
    removed: boolean;
    hasStoryBeenPublishedOnce: boolean;
    reaction: {
        count: ReactionCount;
        log: ReactionLog[];
    };
    allowComments: boolean;
    comments: ExistingCommentResponse[];
    author: UserDetails;
    currentAdminReaction?: string;
    reactionText?: string;
    hasCurrentAdminReacted?: boolean;
}

export interface FlagStory {
    story: StoryResponse; 
    flagged: boolean;
}

export interface ExportStoryData {
    communityId: string;
    numberOfStories: number;
    communityTitle: string;
    published: boolean;
}