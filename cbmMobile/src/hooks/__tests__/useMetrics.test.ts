import { MobileCore } from '@adobe/react-native-aepcore';

// Mock the `commonUtils` module
import { mergeAnalyticsDefaults } from '../../util/commonUtils';
import { useMetrics } from '../useMetrics';

jest.mock('../../util/commonUtils', () => ({
  mergeAnalyticsDefaults: jest.fn((data) => data),
}));

describe('useMetrics', () => {
  let mockTrackAction: jest.SpyInstance;
  let mockTrackState: jest.SpyInstance;

  beforeEach(() => {
    // Mock `MobileCore` methods
    mockTrackAction = jest.spyOn(MobileCore, 'trackAction').mockImplementation(jest.fn());
    mockTrackState = jest.spyOn(MobileCore, 'trackState').mockImplementation(jest.fn());

    (mergeAnalyticsDefaults as jest.Mock).mockClear(); // Reset the mock implementation
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call trackAction with the correct parameters', () => {
    const { metrics } = useMetrics();
    const tag = 'testAction';
    const data = { key: 'value' };

    metrics.trackAction(tag, data);

    expect(mergeAnalyticsDefaults).toHaveBeenCalledWith(data);
    expect(mockTrackAction).toHaveBeenCalledWith(tag, data);
  });

  it('should call trackState with the correct parameters', () => {
    const { metrics } = useMetrics();
    const tag = 'testState';
    const data = { key: 'value' };

    metrics.trackState(tag, data);

    expect(mergeAnalyticsDefaults).toHaveBeenCalledWith(data);
    expect(mockTrackState).toHaveBeenCalledWith(tag, data);
  });

  it('should handle undefined data for trackAction', () => {
    const { metrics } = useMetrics();
    const tag = 'testAction';

    metrics.trackAction(tag);

    expect(mergeAnalyticsDefaults).toHaveBeenCalledWith(undefined);
    expect(mockTrackAction).toHaveBeenCalledWith(tag, undefined);
  });

  it('should handle undefined data for trackState', () => {
    const { metrics } = useMetrics();
    const tag = 'testState';

    metrics.trackState(tag);

    expect(mergeAnalyticsDefaults).toHaveBeenCalledWith(undefined);
    expect(mockTrackState).toHaveBeenCalledWith(tag, undefined);
  });
});
