import { BodyOptions } from 'routing-controllers';

export interface ICustomBodyOption extends BodyOptions {
  isFormData?: boolean;
}
