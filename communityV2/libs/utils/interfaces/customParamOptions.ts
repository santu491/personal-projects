import { ParamOptions } from 'routing-controllers';

export interface ICustomParamOption extends ParamOptions {
  encrypted?: boolean;
  decryptor?: string;
  stripMbrUid?: boolean;
}
