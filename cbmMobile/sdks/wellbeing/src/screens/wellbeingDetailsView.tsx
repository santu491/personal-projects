import { useRoute } from '@react-navigation/native';
import React from 'react';

import { ContentWindow } from '../../../../shared/src/components/contentWindow';
import { MainHeaderComponent } from '../../../../shared/src/components/mainHeader/mainHeaderComponent';

export const WellbeingDetailsView = () => {
  const route = useRoute();
  return (
    <>
      <MainHeaderComponent />
      <ContentWindow sourceUrl={(route.params as { url: string }).url} />
    </>
  );
};
