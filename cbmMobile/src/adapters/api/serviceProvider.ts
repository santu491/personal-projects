export interface ServiceProvider {
  callService: <T>(
    endpoint: string,
    method: string,
    body: object | null,
    headers?: { [key: string]: string | boolean }
  ) => Promise<T>;
}
