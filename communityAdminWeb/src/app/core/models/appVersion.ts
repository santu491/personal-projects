export interface AppVersionResponse {
  apiVersion: string;
  ios: string;
  android: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  content: {
    pushNotification: string;
    deepLink: string;
    public: string;
    generic: string;
    helpfulInfo: string;
    prompts: string;
    wordList: string;
  };
  emailTmplCd: string;
  tou: string;
  updatedBy: string;
  id: string;
  demoUserAccess: boolean;
  imageFilter: boolean;
}

export interface AppVersionPayload {
  ios: string;
  android: string;
  content: {
    public: string;
    generic: string;
    helpfulInfo: string;
    prompts: string;
    deepLink: string;
    wordList: string;
    pushNotification: string;
  };
  tou: string;
  demoUserAccess: boolean;
  imageFilter: boolean;
  apiVersion: string;
}
