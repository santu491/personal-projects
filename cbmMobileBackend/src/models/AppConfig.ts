import {IsObject, IsString} from 'class-validator';

export class AppInit {
  @IsString() cbhm_db!: string;
  @IsString() cbhm_api!: string;
  @IsObject() ios!: {
    appUrl: string;
    version: string;
  };
  @IsObject() content?: {
    public: string;
    secure: string;
  };
  @IsObject() android!: {
    appUrl: string;
    version: string;
  };
}

export class AppConfig {
  appName!: string;
  version!: string;
  env!: string;
  audit!: {
    createdTS: string;
    updatedAt: string;
  };
  appInit!: AppInit;
}

export interface ClientModel {
  clientName: string;
  clientUri: string;
  source: string;
}

export class ClientArticlesRequest {
  @IsString() path!: string;
}

export class ClientCardsRequest {
  @IsString() path!: string;
}
