import { IsString } from 'class-validator';

export class SchedulerPayload {
  @IsString() jobId: string;
}
