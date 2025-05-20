import {EVENT_TYPES} from '../constants';

export class AppEvent {
  eventType: string;
  screen!: string;
  timestamp: Date;
  eventData!: any;

  constructor(type: EVENT_TYPES) {
    this.eventType = type;
    this.timestamp = new Date();
  }
}

export type AuditTable = {
  installationId: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  events: AppEvent[];
};
