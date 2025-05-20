import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

export class ImageSize {
  @IsString() previewType: string;
  @IsString() aspectRatio: string;
  @IsString() uri: string;
  @IsNumber() width: number;
  @IsNumber() height: number;
  @IsString() size?: string;
}

export class Previews {
  @IsObject() square: ImageSize;
  @IsObject() standard: ImageSize;
  @IsObject() wide: ImageSize;
  @IsObject() classic: ImageSize;
}

export class ImageCropsSizes {
  @IsObject() thumbnail: ImageSize;
  @IsObject() small: ImageSize;
  @IsObject() medium: ImageSize;
  @IsObject() large: ImageSize;
}

export class ImageCrops {
  @IsObject() square: ImageCropsSizes;
  @IsObject() standard: ImageCropsSizes;
  @IsObject() wide: ImageCropsSizes;
  @IsObject() classic: ImageCropsSizes;
}

export class Images {
  @IsString() id: string;
  @IsObject() previews: Previews;
  @IsObject() imageCrops: ImageCrops;
}

export class Videos {
  @IsString() id: string;
  @IsString() provider: string;
  @IsString() url: string;
}

export class MeredithResult {
  @IsString() id: string;
  @IsString() title: string;
  @IsString() canonicalUrl: string;
  @IsString() subtitle: string;
  @IsString() text: string;
  @IsString() textWithHtml: string;
  @IsString() brand: string;
  @IsString() copyright: string;
  @IsString() contentType: string;
  @IsString() brandLogo: string;
  @IsString() contentProvider: string;
  @IsArray() images: Images[];
  @IsArray() videos: Videos[];
}

export class MeredithResponse {
  @IsNumber() status: number;
  @IsObject() result: MeredithResult;
}
