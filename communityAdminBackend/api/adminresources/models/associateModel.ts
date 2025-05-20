import { IHttpHeader } from '@anthem/communityadminapi/http';

export class WebUserRequestData {
  token: string;
  apiKey: string;
  header: IHttpHeader;
}
export interface ISearchUserFilter {
  username?: string;
  iamGuid?: string;
  repositoryEnum: string[];
  userRoleEnum: string[];
}

export interface IRequestContext {
  application: string;
  requestId: string;
  username: string;
}

export interface IAssociateAuthenticateRequest {
  requestContext?: IRequestContext;
  repositoryEnum?: string;
  userRoleEnum?: string;
  username?: string;
  userNm?: string;
  password?: string;
}

export interface IResponseContext {
  confirmationNumber: string;
}

export interface IAssociateAuthenticateResponse {
  responseContext: IResponseContext;
  user: IUser;
  cookie: string;
  authenticated: boolean;
}

export interface IAssociateSearchRequest {
  searchUserFilter: ISearchUserFilter ;
  requestContext: IRequestContext;
}
export interface IUserAccountStatus {
  disabled: boolean;
  locked: boolean;
  forceChangePassword: boolean;
  badSecretAnsCount: number;
  badPasswordCount: number;
  isUserNameValid: boolean;
  isSecretQuestionValid: boolean;
}

export interface IUser {
  emailAddress: string;
  username: string;
  iamGuid: string;
  repositoryEnum: string;
  userRoleEnum: string;
  firstName: string;
  lastName: string;
  dn: string;
  userAccountStatus: IUserAccountStatus;
  memberOf: string[];
}

export interface IAssociateSearchResponse {
  responseContext: IResponseContext;
  user: IUser[];
  status?: number;
}
