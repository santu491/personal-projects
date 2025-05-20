export interface Metrics {
  trackAction: (tag: string, data?: Record<string, unknown>) => void;
  trackState: (tag: string, data?: Record<string, unknown>) => void;
}
