export class CustomError extends Error {
  status: number;
  error: unknown;
  constructor({ status, error }: { error: unknown; status: number }) {
    super();
    this.status = status;
    this.error = error;
  }
}
