import { IsString } from 'class-validator';

export class ConnectedService {
  @IsString() serviceName: string;
  @IsString() status: string;
  @IsString() error: string;
}
