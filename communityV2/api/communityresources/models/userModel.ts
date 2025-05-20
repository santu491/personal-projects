import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator';
import { BinderArticle, BinderResource, BinderStory } from './binderModel';
import { Community, CommunityCategory } from './communitiesModel';
import { Library } from './libraryModel';
import { IContactList, IMemberLoginThreatResponse, ISecretQuestionAnswer } from './memberModel';
import { StoryResponse } from './storyModel';

export class MemberData {
  @IsString() brand: string;
  @IsString() userId: string;
  @IsString() underState: string;
  @IsString() groupId: string;
  @IsString() subscriber: string;
  @IsString() sourceSys: string;
  @IsString() lob: string;
  @IsString() planType: string;
  @IsString() snappreferred: string;
  @IsString() employerGroupId: string;
  @IsString() subGroupId: string;
  @IsString() userRole: string;
  @IsString() ete: string;
  @IsOptional() @IsString() userType: string;
  @IsOptional() @IsString() dn: string;
}

export class Tou {
  @IsString() version: string;
  @IsDate() acceptedAt: Date;
}

export class StoryPromotion {
  @IsBoolean() remindUser: boolean;
  @IsDate() nextPromotionDate?: Date;
  @IsNumber() loginsAfterOnboarding?: number;
}

export class CommunityInfo {
  @IsString() communityId: string;
  @IsOptional() @IsNumber() visitCount: number;
  @IsOptional() @IsBoolean() doNotAskAgain: boolean;
  @IsOptional() dueDate: Date | string;
  @IsBoolean() @IsOptional() isPregnant: boolean;
  @IsBoolean() @IsOptional() dueDateEnteredOnce: boolean;
  @IsBoolean() @IsOptional() tryingToConceive: boolean;
}

export class CommunityInfoRequest {
  @IsString() communityId: string;
  @IsOptional() @IsBoolean() doNotAskAgain: boolean;
  @IsString() @IsOptional() dueDate: string;
  @IsBoolean() @IsOptional() isPregnant: boolean;
  @IsBoolean() @IsOptional() tryingToConceive: boolean;
}

export class Attributes {
  @IsOptional() @IsBoolean() communityNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() questionNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() answerNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() reactionNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() dueDateBasedNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() commentReactionNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() replyNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() commentNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() meTabHelpCardBanner?: boolean;
  @IsOptional() @IsBoolean() localServiceHelpCardBanner?: boolean;
  @IsOptional() @IsBoolean() communityHelpCardBanner?: boolean;
  @IsOptional() @IsBoolean() localCategoryHelpCardBanner?: boolean;
  @IsOptional() @IsBoolean() cancerCommunityCard?: boolean;
  @IsOptional() @IsObject() storyPromotion?: StoryPromotion;
  @IsObject() @IsOptional() communityDetails?: CommunityInfo[];
}
export class User {
  @IsString() id: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() username: string;
  @IsString() token: string;
  @IsString() displayName: string;
  @IsInt() age: number;
  @IsString() profilePicture: string;
  @IsArray() myCommunities: string[];
  @IsArray() contacts: IContactList[];
  @IsBoolean() active: boolean;
  @IsBoolean() hasAgreedToTerms: boolean;
  @IsString() personId: string;
  @IsString() onBoardingState: string;
  @IsArray() localCategories: string[];
  @IsArray() tou: Tou[];
  @IsObject() memberData: MemberData;
  @IsObject() loginTreatDetails: IMemberLoginThreatResponse;
  @IsObject() secretQuestionAnswers: ISecretQuestionAnswer[];
  @IsOptional() cancerCommunityCard: boolean;
  @IsDate() lastLoginAt?: Date;
  @IsString() memberType?: string;
  @IsBoolean() deleteRequested: boolean;
  @IsDate() createdAt?: Date;
  @IsDate() updatedAt?: Date;
  @IsOptional() @IsObject() attributes?: Attributes;
  @IsOptional() @IsString() dummy2FACheck: boolean;
  @IsOptional() @IsObject() recoveryTreatDetails: IMemberLoginThreatResponse;
}

export class AppVersion {
  @IsString() id: string;
  @IsString() ios: string;
  @IsString() tou: string;
  @IsString() demoUserAccess: string;
}

export class AuthenticatedUser extends User {
  @Type(() => MemberData) memberData: MemberData;
  @IsInt() unreadReceivedQuestionsCount = 0;
  @IsInt() unreadSentQuestionsCount = 0;
  @IsString() meTabHelpCardBanner: boolean;
  @IsString() localServiceHelpCardBanner: boolean;
  @IsString() communityHelpCardBanner: boolean;
  @IsBoolean() localCategoryHelpCardBanner: boolean;
  @IsString() communityNotificationFlag: boolean;
  @IsString() questionNotificationFlag: boolean;
  @IsString() answerNotificationFlag: boolean;
  @IsBoolean() reactionNotificationFlag: boolean;
  @IsBoolean() dueDateBasedNotificationFlag?: boolean;
  @IsBoolean() commentReactionNotificationFlag: boolean;
  @IsBoolean() replyNotificationFlag: boolean;
}

export class UserModel {
  @IsString() id: string;
  @IsString() username: string;
  @IsString() displayName: string;
}

export class AuthenticationModel {
  @IsString() access_token: string;
  @IsString() id_token: string;
}
export class DevAuthModel {
  @IsString() username: string;
}

export class UserIdModel {
  @IsString() userId: string;
}

export class Author {
  @IsString() id: string;
  @IsString() profilePicture: string;
  @IsString() displayName: string;
  @IsOptional() @IsString() fullName: string;
  @IsOptional() @IsString() firstName: string;
  @IsInt() age: number;
  @IsArray() communities: string[];
}

export class BlockedUser {
  @IsString() id: string;
  @IsString() username: string;
}

export class UserProfile {
  @IsObject() user: User;
  @IsArray() communities: Community[];
  @IsInt() unreadReceivedQuestionsCount: number;
  @IsInt() UnreadSentQuestionsCount: number;
  @IsBoolean() HasAtleastOneReceivedQuestion: boolean;
  @IsBoolean() HasAtleastOneSentQuestion: boolean;
  @IsArray() blockedUsers: BlockedUser[];
}

export class HomePageBinder {
  @IsObject() binderStory: BinderStory;
  @IsObject() binderResource: BinderResource;
  @IsObject() binderArticle: BinderArticle;
}
export class UserHomePage {
  @IsString() userId: string;
  @IsArray() communityCategory: CommunityCategory[];
  @IsString() resourceListCount: string;
  @IsArray() featuredStory: StoryResponse[];
  @IsObject() library: Library;
  @IsObject() userBinder: HomePageBinder;
}
export class InstallationTokenModel {
  @IsString() userName: string;
  @IsString() deviceToken: string;
}

export class Badge extends InstallationTokenModel {
  @IsInt() count: number;
}

export class DisplayNameModel {
  @IsString() displayName: string;
}

export class ProfilePicture {
  @IsString() userId: string;
  @IsOptional() @IsString() profilePicture: string;
}

export class UserCommunitiesModel {
  @IsString() userId: string;
  @IsArray() communities: string[];
}

export class OnBoarding {
  @IsString() state: string;
}

export class HelpBannerViewedData {
  @IsOptional() @IsBoolean() meTabHelpCardBanner: boolean;
  @IsOptional() @IsBoolean() localServiceHelpCardBanner: boolean;
  @IsOptional() @IsBoolean() communityHelpCardBanner: boolean;
  @IsOptional() @IsBoolean() localCategoryHelpCardBanner: boolean;
  @IsOptional() @IsBoolean() cancerCommunityCard: boolean;
}

export class PushNotificationPreferencesStatus {
  @IsOptional() @IsBoolean() communityNotificationFlag: boolean;
  @IsOptional() @IsBoolean() questionNotificationFlag: boolean;
  @IsOptional() @IsBoolean() answerNotificationFlag: boolean;
  @IsOptional() @IsBoolean() reactionNotificationFlag: boolean;
  @IsOptional() @IsBoolean() dueDateBasedNotificationFlag?: boolean;
  @IsOptional() @IsBoolean() commentReactionNotificationFlag: boolean;
  @IsOptional() @IsBoolean() replyNotificationFlag: boolean;
  @IsOptional() @IsBoolean() commentNotificationFlag: boolean;
}
