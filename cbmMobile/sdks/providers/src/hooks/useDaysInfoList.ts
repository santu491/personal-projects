import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DaysInfoKeys } from '../config/constants/constants';

export const useDaysInfoList = () => {
  const { t } = useTranslation();
  const daysInfoList = useMemo(
    () => [
      {
        day: t('common.daysInfo.mon'),
        value: DaysInfoKeys.MONDAY,
        isSelected: false,
      },
      {
        day: t('common.daysInfo.tue'),
        value: DaysInfoKeys.TUESDAY,
        isSelected: false,
      },
      {
        day: t('common.daysInfo.wed'),
        value: DaysInfoKeys.WEDNESDAY,
        isSelected: false,
      },
      {
        day: t('common.daysInfo.thurs'),
        value: DaysInfoKeys.THURSDAY,
        isSelected: false,
      },
      {
        day: t('common.daysInfo.fri'),
        value: DaysInfoKeys.FRIDAY,
        isSelected: false,
      },
      {
        day: t('common.daysInfo.sat'),
        value: DaysInfoKeys.SATURDAY,
        isSelected: false,
      },
      {
        day: t('common.daysInfo.sun'),
        value: DaysInfoKeys.SUNDAY,
        isSelected: false,
      },
    ],
    [t]
  );
  return {
    daysInfoList,
  };
};
