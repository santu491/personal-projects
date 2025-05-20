import { IsArray, IsDate, IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class BinderStory {
  @IsString() storyId: string;
  @IsOptional() @IsString() firstName: string;
  @IsString() displayName: string;
  @IsString() profilePicture: string;
  @IsString() communityTitle: string;
  @IsString() featuredQuote: string;
  @IsInt() authorAgeWhenStoryBegan: number;
  @IsInt() relationAgeWhenDiagnosed: number;
  @IsString() relation: string;
  @IsDate() createdDate: Date;
}

export class BinderResource {
  @IsString() resourceId: string;
  @IsString() resourceTitle: string;
  @IsString() resourceCategory: string;
  @IsString() providerName: string;
  @IsDate() createdDate: Date;
}

export class BinderArticle {
  @IsString() articleId: string;
  @IsString() articleTitle: string;
  @IsString() articleLink: string;
  @IsString() articleThumbnail: string;
  @IsDate() createdDate: Date;
  @IsString() @IsOptional() link: string;
}

export class BinderModel {
  @IsString() userId: string;
}

export class BinderResourceModel extends BinderModel {
  @IsString() resourceId: string;
  @IsString() @IsOptional() resourceTitle: string;
  @IsString() @IsOptional() resourceCategory: string;
  @IsString() @IsOptional() providerName: string;
}

export class BinderArticleModel extends BinderModel {
  @IsString() articleId: string;
  @IsString() @IsOptional() link: string;
  @IsString() @IsOptional() articleLink: string;
  @IsString() @IsOptional() articleThumbnail: string;
  @IsString() @IsOptional() articleTitle: string;
}

export class BinderStoryModel extends BinderModel {
  @IsString() storyId: string;
}

export class BinderPostModel extends BinderModel {
  @IsString() postId: string;
}

export class PostAuthor {
  @IsString() displayName: string;
  @IsString() displayTitle: string;
  @IsString() firstName: string;
  @IsString() id: string;
  @IsString() profileImage: string;
  @IsString() role: string;
}

export class Content {
  @IsString() en: string;
  @IsString() es: string;
}

export class BinderPost {
  @IsObject() author: PostAuthor;
  @IsArray() communities: string[];
  @IsString() postId: string;
  @IsDate() publishedAt: Date;
  @IsObject() title: Content;
}

export class Binder {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() binderStories: Array<BinderStory>;
  @IsArray() binderResources: Array<BinderResource>;
  @IsArray() binderArticles: Array<BinderArticle>;
  @IsArray() binderPosts: Array<BinderPost>;
}
