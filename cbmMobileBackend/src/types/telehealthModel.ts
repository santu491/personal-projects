import {IsString} from 'class-validator';

export class MdLiveAppointmentResponse {
  @IsString() redirectURl!: string;
  @IsString() cw_auth_token!: string;
}

class Questionnaire {
  problemType!: string | null;
  problemTypeCode!: string | null;
  presentingProblem!: string | null;
  presentingProblemCode!: string | null;
  answer!: string | null;
  lessProductivedays!: string | null;
  jobMissedDays!: string | null;
}

export class ClinicalQuestionsRequest {
  questionnaire!: Questionnaire[] | string;
}
