import { Type } from 'class-transformer/cjs/decorators';
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class SubSubChildren {
  @IsString() label: string;
}

export class SubChildren {
  @IsString() label: string;
  @ValidateNested({ each: true }) @Type(() => SubSubChildren) @ArrayNotEmpty() children: SubSubChildren[];
}

export class NodeChild {
  @IsString() label: string;
  @ValidateNested({ each: true }) @Type(() => SubChildren) @ArrayNotEmpty() children: SubChildren[];
}

export class ServiceTagResponse {
  @ValidateNested({ each: true }) @Type(() => NodeChild) @ArrayNotEmpty() children: NodeChild[];
  @IsString() description: string;
  @IsString() label: string;
}

export class TaxonomyResponse {
  nodes: ServiceTagResponse[];
}

export class HealthwiseAuthResponse {
  @IsString() access_token: string;
  @IsString() token_type: string;
  @IsInt() expires_in: number;
}

export class HoursOfOperation {
  @IsString() close_time: string;
  @IsBoolean() open: boolean;
  @IsBoolean() open_all_day: boolean;
  @IsString() open_time: string;
}

export class CentralHoursOfOperation {
  @Type(() => HoursOfOperation) friday: HoursOfOperation;
  @Type(() => HoursOfOperation) monday: HoursOfOperation;
  @Type(() => HoursOfOperation) saturday: HoursOfOperation;
  @Type(() => HoursOfOperation) sunday: HoursOfOperation;
  @Type(() => HoursOfOperation) thursday: HoursOfOperation;
  @Type(() => HoursOfOperation) tuesday: HoursOfOperation;
  @Type(() => HoursOfOperation) wednesday: HoursOfOperation;
}

export class NextStep {
  @IsString() action: string;
  @IsString() channel: string;
  @IsString() contact: string;
}

export class Hours {
  @IsBoolean() friday: boolean;
  @IsBoolean() friday_all_day: boolean;
  @IsString() friday_finish: string;
  @IsString() friday_start: string;
  @IsBoolean() monday: boolean;
  @IsBoolean() monday_all_day: boolean;
  @IsString() monday_finish: string;
  @IsString() monday_start: string;
  @IsBoolean() saturday: boolean;
  @IsBoolean() saturday_all_day: boolean;
  @IsBoolean() saturday_finish: boolean;
  @IsBoolean() saturday_start: boolean;
  @IsBoolean() sunday: boolean;
  @IsBoolean() sunday_all_day: boolean;
  @IsBoolean() sunday_finish: boolean;
  @IsBoolean() sunday_start: boolean;
  @IsBoolean() thursday: boolean;
  @IsBoolean() thursday_all_day: boolean;
  @IsString() thursday_finish: string;
  @IsString() thursday_start: string;
  @IsString() timezone: string;
  @IsBoolean() tuesday: boolean;
  @IsBoolean() tuesday_all_day: boolean;
  @IsString() tuesday_finish: string;
  @IsString() tuesday_start: string;
  @IsBoolean() wednesday: boolean;
  @IsBoolean() wednesday_all_day: boolean;
  @IsString() wednesday_finish: string;
  @IsString() wednesday_start: string;
}

export class OpenNowInfo {
  @IsString() close_time: string;
  @IsString() day_of_the_week: string;
  @IsBoolean() open_all_day: boolean;
  @IsBoolean() open_now: boolean;
  @IsString() open_time: string;
}

export class Location {
  @IsInt() latitude: number;
  @IsInt() longitude: number;
}

export class Office {
  @IsString() address1: string;
  @IsString() city: string;
  @Type(() => Location) location: Location;
  @IsString() name: string;
  @IsString() phone_number: string;
  @IsString() postal: string;
  @IsString() program_key: string;
  @IsString() program_name: string;
  @IsString() program_url: string;
  @IsArray() @ArrayNotEmpty() service_tags: string[];
  @IsString() state: string;
  @IsString() website_url: string;
  @IsInt() distance: number;
  @IsString() fax_number: string;
  @Type(() => Hours) hours: Hours;
  @IsBoolean() is_administrative: boolean;
  @IsOptional() @IsString() notes: string;
  @IsString() office_numeric_id: string;
  @IsArray() @ArrayNotEmpty() office_type: string[];
  @Type(() => OpenNowInfo) open_now_info: OpenNowInfo;
  @IsArray() @ArrayNotEmpty() supported_languages: string[];
  @IsString() url_safe_key: string;
  @IsOptional() @IsString() address2: string;
  @IsOptional() @IsString() email: string;
  @IsOptional() @IsString() address3: string;
}

export class ProgramResponse {
  @IsArray() @ArrayNotEmpty() attribute_tags: string[];
  @IsBoolean() availability: string;
  @Type(() => CentralHoursOfOperation) central_hours_of_operation: CentralHoursOfOperation;
  @IsString() coverage_description: string;
  @IsString() description: string;
  @IsString() directions: string;
  @IsString() entry_date: string;
  @IsString() facebook_url: string;
  @IsString() free_or_reduced: string;
  @IsString() google_plus_id: string;
  @IsString() grain: string;
  @IsArray() @ArrayNotEmpty() grain_location: string[];
  @IsString() id: string;
  @IsBoolean() isOfficeAvailable: boolean;
  @IsString() name: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => NextStep) @ArrayNotEmpty() next_steps: NextStep[];
  @IsArray() @ValidateNested({ each: true }) @Type(() => Office) @ArrayNotEmpty() offices: Office[];
  @IsString() program_numeric_id: string;
  @IsString() provider_name: string;
  @IsInt() provider_numeric_id: number;
  @IsArray() @ArrayNotEmpty() rules: string[];
  @IsInt() score: number;
  @IsArray() @ArrayNotEmpty() service_tags: string[];
  @IsArray() @ArrayNotEmpty() supported_languages: string[];
  @IsString() twitter_id: string;
  @IsString() update_date: string;
  @IsString() validation_date: string;
  @IsString() video_url: string;
  @IsString() website_url: string;
  @IsInt() wl_score: number;
}

export class AttributeTagCountChildSubChild {
  @ValidateNested({ each: true }) @Type(() => AttributeTagCountChildSubChild) @ArrayNotEmpty() children: AttributeTagCountChildSubChild[];
  @IsString() count: string;
  @IsString() name: string;
}

export class AttributeTagCountChild {
  @ValidateNested({ each: true }) @Type(() => AttributeTagCountChildSubChild) @ArrayNotEmpty() children: AttributeTagCountChildSubChild[];
  @IsString() name: string;
}

export class ProgramListResponse {
  @ValidateNested({ each: true }) @Type(() => AttributeTagCountChild) @ArrayNotEmpty() attribute_tag_counts: AttributeTagCountChild[];
  @IsString() count: number;
  @ValidateNested({ each: true }) @Type(() => AttributeTagCountChildSubChild) @ArrayNotEmpty() language_counts: AttributeTagCountChildSubChild[];
  @Type(() => Location) postal_location: Location;
  @IsArray() @ValidateNested({ each: true }) @Type(() => ProgramResponse) @ArrayNotEmpty() programs: ProgramResponse[];
  @IsString() suggestion: string;
}
