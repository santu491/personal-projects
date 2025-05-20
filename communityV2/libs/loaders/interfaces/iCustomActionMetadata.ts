import { ActionMetadata } from 'routing-controllers';

export interface ICustomActionMetadata extends Partial<ActionMetadata> {
  isGraphql?: boolean;
}
