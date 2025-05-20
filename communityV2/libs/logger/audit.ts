import { v4 as uuid } from 'uuid';
import { IAuditParam } from './interfaces/iAuditParam';

export class Audit {
  id: string;
  code: string | number;
  elapsed: number;
  parameters: IAuditParam[];
  location?: string;
  appName?: string;
  operation?: string;
  message?: string;

  constructor() {
    this.id = uuid();
    this.parameters = [];
  }
}
