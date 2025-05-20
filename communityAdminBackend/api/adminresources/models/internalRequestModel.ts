import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({ description: 'Request body' })
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
