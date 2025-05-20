import { renderHook } from '@testing-library/react-hooks';

import { APP_IMAGES } from '../../../../../shared/src/context/appImages';
import { ASSESSMENTS, INSIGHTS, MONTHLY_RESOURCES, NEWS, TOPICS } from '../../config/constants/constants';
import { useWellbeingInfo } from '../useWellbeingInfo';

describe('useWellbeingInfo', () => {
  it('should return the correct wellbeing data', () => {
    const { result } = renderHook(() => useWellbeingInfo());

    expect(result.current.welllbeingData).toEqual([
      {
        label: 'wellbeing.topics',
        action: {
          screenName: TOPICS,
          imagePath: APP_IMAGES.WELLNESS_TOPICS,
        },
      },
      {
        label: 'wellbeing.assessments',
        action: {
          screenName: ASSESSMENTS,
          imagePath: APP_IMAGES.WELLNESS_ASSESSMENTS,
        },
      },
      {
        label: 'wellbeing.resources',
        action: {
          screenName: MONTHLY_RESOURCES,
          imagePath: APP_IMAGES.WELLNESS_MONTHLY_RESOURCES,
        },
      },
      {
        label: 'wellbeing.news',
        action: {
          screenName: NEWS,
          imagePath: APP_IMAGES.WELLNESS_NEWS,
        },
      },
      {
        label: 'wellbeing.insights',
        action: {
          screenName: INSIGHTS,
          imagePath: APP_IMAGES.WELLNESS_INSIGHTS,
        },
      },
    ]);
  });

  it('should translate labels correctly', () => {
    const { result } = renderHook(() => useWellbeingInfo());

    expect(result.current.welllbeingData[0].label).toBe('wellbeing.topics');
    expect(result.current.welllbeingData[1].label).toBe('wellbeing.assessments');
    expect(result.current.welllbeingData[2].label).toBe('wellbeing.resources');
    expect(result.current.welllbeingData[3].label).toBe('wellbeing.news');
    expect(result.current.welllbeingData[4].label).toBe('wellbeing.insights');
  });
});
