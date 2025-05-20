export interface ServiceConfig {
  baseUrl: string;
  headers: Record<string, string>;
  sslPinningDisabled?: boolean;
}
