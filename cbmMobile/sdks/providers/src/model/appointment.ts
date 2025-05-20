export interface ErrorResponseDTO {
  attemptsRemaining?: number;
  error: string;
  errorType: string;
  message: string;
  status: string;
  statusCode: string;
}
