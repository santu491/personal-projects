import { v2Env } from '../constants';

export interface MonitoringElement {
  position: number;
  name: string;
  envGrp: string;
  appGrp: string;
  env: keyof typeof v2Env;
  url: string;
  version: string;
  status: boolean;
}

export interface ActiveUser {
  totalUsers: number;
  monthLogin: number;
  todayLogin: number;
}
