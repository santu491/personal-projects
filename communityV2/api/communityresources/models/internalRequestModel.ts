import { Type } from 'class-transformer/cjs/decorators';
import { ArrayNotEmpty, IsArray, IsDate, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({ description: 'Request body' })
export class TermsOfUseRequest {
  @JSONSchema({ description: 'User Name', example: 'test123' }) @IsString() userNm: string;
}

export class InstallationRequest {
  @JSONSchema({ description: 'User name', example: 'john' }) @IsString() userName: string;
  @JSONSchema({ description: 'App Version', example: '1.2.2' }) @IsString() appVersion: string;
  @JSONSchema({ description: 'Locale', example: 'en-US' }) @IsString() locale: string;
  @JSONSchema({ description: 'OS Version', example: '1.0' }) @IsString() osVersion: string;
  @JSONSchema({ description: 'Platform', example: 'android' }) @IsString() platform: string;
  @JSONSchema({ description: 'Time Zone Offset', example: '-120' }) @IsNumber() timeZoneOffset: number;
  @JSONSchema({ description: 'FCM token', example: 'QWERTY...' }) @IsString() deviceToken: string;
}

export class GetTermsOfUseResponse {
  @JSONSchema({ description: 'Status', example: 'False or True' } ) @IsString() status: string;
}

@JSONSchema({ description: 'Response body when getting one installation' })
export class InstallationResponse {
  @IsString()
  @JSONSchema({ description: 'This installations ID' })
  public id!: string;

  @IsString()
  @JSONSchema({ description: 'The device\'s push notification token' })
  public token!: string;

  @IsString()
  @JSONSchema({ description: 'The device\'s last known locale, in rfc5646 format', example: 'en-US', nullable: true })
  public locale!: string;

  @IsInt()
  @JSONSchema({ description: 'The device\'s last known time-zone offset from UTC, in minutes', example: 240 })
  public timeZoneOffset!: number;

  @IsString()
  @JSONSchema({ description: 'Platform', example: 'android', enum: ['ios', 'android'] })
  public platform!: string;

  @IsString()
  @JSONSchema({ description: 'OS Version' })
  public osVersion!: string;

  @IsString()
  @JSONSchema({ description: 'App Version' })
  public appVersion!: string;

  @IsDate()
  @JSONSchema({ description: 'Last updated timestamp', format: 'date-time' })
  public updatedTimestamp!: Date;
}

export class NodeChild {
  code: string;
  name: string;
  description?: string;
}

export class CoverageProgram {
  @IsString() vendorNm: string;
}

export class CoverageType {
  @Type(() => NodeChild) coverageTypeCd: NodeChild;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CoverageProgram) @ArrayNotEmpty() coverageProgram?: CoverageProgram[];
}

export class Product {
  @IsString() productId: string;
  @IsString() subgroupId: string;
  @IsString() planNm: string;
  @Type(() => NodeChild) healthcareArgmtCd: NodeChild;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CoverageType) @ArrayNotEmpty() coverageType?: CoverageType[];
}

export class Coverage {
  @IsString() coverageKey: string;
  @IsString() effectiveDt: string;
  @IsString() terminationDt: string;
  @Type(() => NodeChild) statusCd: NodeChild;
  @IsArray() @ValidateNested({ each: true }) @Type(() => Product) @ArrayNotEmpty() product?: Product[];
}

export class Eligibility {
  @IsString() contractUid: string;
  @IsString() effectiveDt: string;
  @IsOptional() @IsString() terminationDt?: string;
  @IsString() mbrSequenceNbr: string;
  @IsString() sourceSystemId: string;
  @IsOptional() @IsString() employerCd?: string;
  @IsString() groupId: string;
  @IsString() hcId: string;
  @Type(() => NodeChild) mbuCd: NodeChild;
  @Type(() => NodeChild) relationshipCd: NodeChild;
  @Type(() => NodeChild) statusCd: NodeChild;
  @Type(() => NodeChild) brandCd: NodeChild;
  @Type(() => NodeChild) residentialStateCd: NodeChild;
  @Type(() => NodeChild) underwritingStateCd: NodeChild;
  @IsArray() @ValidateNested({ each: true }) @Type(() => Coverage) @ArrayNotEmpty() coverage?: Coverage[];
}

export class Member {
  serverTime?: string;
  hcid?: string;
  mbrUid!: string;
  userNm!: string;
  webGuid!: string;
  firstNm!: string;
  middleNm!: string;
  lastNm!: string;
  namePrefix?: string;
  nameSuffix?: string;
  dob!: string;
  userRole?: string;
  emulationInd?: boolean;
  token?: string;
  houseAccount?: string;
  featureFlags?: string[] = [];
  brandCd?: string;
  reportingIndicators?: string[] = [];
  @IsArray() @ValidateNested({ each: true }) @Type(() => Eligibility) @ArrayNotEmpty() eligibility?: Eligibility[];
}

export class MemberSummarySoaResponse {
  @Type(() => Member)
  member!: Member;

  cached!: boolean;
}

export class InternalAuthResponse {
  token_type!: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  application_name: string;
  scope: string;
  expires_in: string;
  status: string;
}

export class IntrospectResponse {
  active: boolean;
  client_id: string;
  exp: string;
  iat: string;
  iss: string;
  scope: string;
  sub: string;
  token_type: string;
}

export class RevokeResponse {
  revoke: boolean;
}

export class Device {
  @IsString() id: string;
  @IsString() deviceToken: string;
  @IsString() endpointArn: string;
  @IsString() locale: string;
  @IsInt() timeZoneOffset: number;
  @IsString() platform: string;
  @IsString() osVersion: string;
  @IsDate() createdTimestamp: Date;
  @IsDate() updatedTimestamp: Date;
  @IsInt() badge: number;
}

export class Installations {
  @IsString() id: string;
  @IsString() userId: string;
  @IsArray() devices: Array<Device>;
}
