import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import {APPOINTMENT_STATUSES} from '../constants';

class PreferredSlot {
  @IsArray() days!: string[];
  @IsString() time!: string;
}

class Communication {
  @IsString() addressOne!: string;
  @IsString() addressTwo!: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsString() stateCode!: string;
  @IsString() zipcode!: string;
}

class SelectedProvider {
  @IsString() provDetailsId!: string;
  @IsString() providerId!: string;
  @IsString() beaconLocationId!: string;
  @IsString() email!: string;
  @IsString() phone!: string;
  @IsString() name!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsString() title!: string;
  @IsString() addressOne!: string;
  @IsString() addressTwo!: string;
  @IsString() city!: string;
  @IsString() state!: string;
  @IsString() zip!: string;
  @IsString() distance!: string;
  @IsString() providerType!: string;
  @IsBoolean() isMemberOpted!: boolean;
  @IsBoolean() isInsuranceCarrierAccepted!: boolean;
  providerPrefferedDateAndTime: any;
}

class Questionnaire {
  @IsString() problemType!: string;
  @IsString() problemTypeCode!: string;
  @IsString() presentingProblem!: string;
  @IsString() presentingProblemCode!: string;
  @IsString() answer!: string;
  @IsString() lessProductivedays!: string;
  @IsString() jobMissedDays!: string;
}

class ClinicalQuestions {
  @IsObject() questionnaire!: Questionnaire[];
}

export class AppointmentRequest {
  @IsOptional() @IsString() mrefNumber?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() dob?: string;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() healthInsuranceCarrier?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() employerType?: string;
  @IsOptional() @IsString() groupId?: string;
  @IsOptional() @IsString() planName?: string;
  @IsOptional() @IsString() clientName?: string;
  @IsOptional() @IsString() appointmentType?: string;
  @IsOptional() @IsNotEmptyObject() communication?: Communication;
  @IsString() iamguid!: string;
  memberOptedProvider: any;
  @IsBoolean() isTimingCustomized!: boolean;
  @IsNotEmptyObject() memberPrefferedSlot!: PreferredSlot;
  @IsArray() selectedProviders!: SelectedProvider[];
  clinicalQuestions!: ClinicalQuestions | string;
}

export class UpdateAppointmentRequest {
  @IsString() id!: string;
  @IsString() @IsOptional() _id: string | undefined;
  @IsIn(APPOINTMENT_STATUSES) status!: string;
  @IsOptional() @IsString() providerId?: string;
  @IsOptional() @IsString() appointmentScheduledDateAndTime?: string;
  @IsOptional() @IsString() memberApprovedTimeForEmail?: string;
  @IsOptional() @IsString() lastUpdatedStatus?: string;
}
