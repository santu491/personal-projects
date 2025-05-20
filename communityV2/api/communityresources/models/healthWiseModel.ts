import { IsArray, IsBoolean, IsInt, IsObject, IsString } from 'class-validator';

export class HealthWiseAuthResponse {
  @IsString() access_token: string;
  @IsString() token_type: string;
  @IsInt() expires_in: number;
}

export class Localizations {
  @IsString() enus: string;
}

export class MetaData {
  @IsString() enus: string;
}

export class Links {
  @IsString() self: string;
  @IsObject() localizations: Localizations;
  @IsObject() metadata: MetaData;
}
export class Data1 {
  @IsArray() topics: Topic[];
}
export class Data2 {
  @IsArray() topics: Topic2[];
}
export class Versioning {
  @IsString() Version: string;
}

export class Item {
  @IsString() id: string;
  @IsString() contentId: string;
  @IsString() hwId: string;
  @IsString() href: string;
  @IsArray() langauges: string[];
  @IsObject() localizations: Localizations;
  @IsString() type: string;
  @IsString() detailLevel: string;
  @IsArray() taxonomy: Taxonomy[];
}

export class VideoData {
  @IsArray() topics: VideoTopic[];
}

export class HealthWiseTopicResponse {
  @IsInt() status: number;
  @IsObject() versioning: Versioning;
  @IsObject() links: Links;
  @IsString() schema: string;
  @IsObject() data: Data1;
  @IsObject() videoData: VideoData;
  @IsArray() items: Item[];
}

export class HealthWiseArticleResponse {
  @IsInt() status: number;
  @IsObject() versioning: Versioning;
  @IsObject() links: Links;
  @IsString() schema: string;
  @IsObject() data: Data2;
  @IsObject() videoData: VideoData;
  @IsArray() items: Item[];
}

export class VideoRoot {
  @IsInt() status: number;
  @IsObject() versioning: Versioning;
  @IsObject() links: Links;
  @IsString() schema: string;
  @IsObject() data: Data2;
}

export class Root {
  @IsInt() status: number;
  @IsObject() versioning: Versioning;
  @IsObject() links: Links;
  @IsString() schema: string;
  @IsObject() data: Data1;
  @IsObject() videoData: VideoData;
  @IsArray() items: Item[];
}

export class Title {
  @IsString() consumer: string;
}

export class Author {
  @IsString() name: string;
}

export class PrimaryReviewers {
  @IsString() name: string;
}

export class Credits {
  @IsObject() author: Author;
  @IsArray() primaryReviewers: PrimaryReviewers[];
}

export class Aspect {
  @IsString() id: string;
  @IsString() label: string;
  @IsString() href: string;
}
export class Concept {
  @IsString() id: string;
  @IsString() label: string;
  @IsString() href: string;
}

export class Taxonomy {
  @IsObject() aspect: Aspect;
  @IsObject() concept: Concept;
}

export class CopyrightText {
  @IsString() element: string;
  @IsString() content: string;
}

export class DisclaimerText {
  @IsString() element: string;
  @IsString() content: string;
}

export class Attributes3 {
  @IsString() hClass: string;
}

export class Attributes4 {
  @IsString() hClass: string;
}

export class Content {
  @IsString() element: string;
  @IsObject() attributes: Attributes4;
}

export class Html {
  @IsString() element: string;
  @IsObject() attributes: Attributes3;
  @IsArray() content: Content;
}

export class Legal {
  @IsString() logoUrl: string;
  @IsObject() copyrightText: CopyrightText;
  @IsObject() disclaimerText: DisclaimerText;
  @IsString() termsOfUseUrl: string;
  @IsString() privacyPolicyUrl: string;
  @IsString() moreInformationUrl: string;
  @IsString() html: Html;
}

export class BaseTopics {
  @IsString() id: string;
  @IsString() version: string;
  @IsString() hash: string;
  @IsString() lang: string;
  @IsString() type: string;
  @IsString() aspect: string;
  @IsString() hwid: string;
  @IsObject() title: Title;
  @IsObject() legal: Legal;
  @IsBoolean() navigable: boolean;
  @IsObject() credits: Credits;
  @IsArray() taxonomy: Taxonomy[];
}

export class Topic extends BaseTopics {
  @IsString() certifiedDate: string;
  @IsString() detailLevel: string;
  @IsString() audience: string;
  @IsString() behaviorChange: string;
  @IsArray() html: Html2[];
}

export class Topic2 extends BaseTopics {
  @IsString() certifiedDate: string;
  @IsString() detailLevel: string;
  @IsString() audience: string;
  @IsString() behaviorChange: string;
  @IsArray() html: Html2[];
}

export class ArticleTopic {
  @IsString() topicId: string;
  @IsString() type: string;
  @IsBoolean() navigable: boolean;
  @IsString() title: string;
  @IsString() subTitle: string;
  @IsArray() html: Html2[];
  @IsArray() taxonomy: Taxonomy[];
  @IsString() aspect: string;
  @IsString() detailLevel: string;
  @IsString() hwid: string;
  @IsString() audience: string;
}

export class Attributes5 {
  @IsString() lang: string;
  @IsString() id: string;
  @IsString() hclass: string;
}

export class Attributes6 {
  @IsString() hclass: string;
}

export class Content2 {
  @IsString() element: string;
  @IsObject() attributes: Attributes6;
}

export class Html2 {
  @IsString() element: string;
  @IsObject() attributes: Attributes5;
  @IsArray() content: Content2[];
}

export class Abstract {
  @IsString() consumer: string;
  @IsString() clinical: string;
}

export class ContentTranscript {
  @IsString() element: string;
  @IsString() content: string;
}

export class HtmlTranscript {
  @IsString() element: string;
  @IsObject() content: ContentTranscript;
}

export class Transcript {
  @IsArray() html: HtmlTranscript[];
}
export class Sources {
  @IsString() mp4_1080p_url: string;
  @IsString() mp4_720p_url: string;
  @IsString() mp4_288p_url: string;
  @IsString() hls_600k_url: string;
  @IsString() hls_400k_url: string;
}

export class ClosedCaptions {
  @IsString() sbv_url: string;
  @IsString() srt_url: string;
  @IsString() vtt_url: string;
  @IsString() xml_url: string;
}

export class HtmlText {
  @IsString() html: string;
}

export class VideoTopic extends BaseTopics {
  @IsObject() abstract: Abstract;
  @IsString() html: string;
  @IsString() thumbnail: string;
  @IsString() duration: string;
  @IsObject() transcript: Transcript;
  @IsObject() closedCaptions: ClosedCaptions;
  @IsObject() sources: Sources;
  @IsObject() htmlText: HtmlText;
  @IsObject() learningObjectiveText: HtmlText;
  @IsObject() clinicalAbstract: HtmlText;
  @IsObject() teaser: HtmlText;
}
