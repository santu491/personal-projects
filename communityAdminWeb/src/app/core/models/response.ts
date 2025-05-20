import { PNMetrics } from './metrics';

export interface ErrorModel {
  id?: string;
  errorCode: number;
  title: string;
  detail: string;
}

export type ValueType = string | boolean | PNMetrics;

export interface BaseResponse {
  data: {
    isSuccess: boolean;
    isException: boolean;
    value?: ValueType;
    errors?: ErrorModel[];
  };
}
