import { MobileCore } from '@adobe/react-native-aepcore';

import { mergeAnalyticsDefaults } from '../util/commonUtils';

export const useMetrics = () => {
  const trackAction = (tag: string, data?: Record<string, unknown>): void => {
    track('action', tag, data);
  };

  const trackState = (tag: string, data?: Record<string, unknown>): void => {
    track('state', tag, data);
  };

  const track = (as: 'action' | 'state', tag: string, data?: Record<string, unknown>) => {
    const merged = mergeAnalyticsDefaults(data);
    const isState = as === 'state';
    MobileCore[isState ? 'trackState' : 'trackAction'](tag, merged);
  };

  return {
    metrics: {
      trackState,
      trackAction,
    },
  };
};
