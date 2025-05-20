import { renderHook } from '@testing-library/react-hooks';

import { DaysInfoKeys } from '../../config/constants/constants';
import { useDaysInfoList } from '../useDaysInfoList';

describe('useDaysInfoList', () => {
  it('should return the correct days info list', () => {
    const { result } = renderHook(() => useDaysInfoList());

    expect(result.current.daysInfoList).toEqual([
      { day: 'common.daysInfo.mon', value: DaysInfoKeys.MONDAY, isSelected: false },
      { day: 'common.daysInfo.tue', value: DaysInfoKeys.TUESDAY, isSelected: false },
      { day: 'common.daysInfo.wed', value: DaysInfoKeys.WEDNESDAY, isSelected: false },
      { day: 'common.daysInfo.thurs', value: DaysInfoKeys.THURSDAY, isSelected: false },
      { day: 'common.daysInfo.fri', value: DaysInfoKeys.FRIDAY, isSelected: false },
      { day: 'common.daysInfo.sat', value: DaysInfoKeys.SATURDAY, isSelected: false },
      { day: 'common.daysInfo.sun', value: DaysInfoKeys.SUNDAY, isSelected: false },
    ]);
  });
});
