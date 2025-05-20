import { useCallback, useEffect, useState } from 'react';

import { API_ENDPOINTS } from '../../config';
import { useAppContext } from '../../context/appContext';
import { RequestMethod } from '../../models/adapters';
import { CrisisSectionData, CrisisSupportDataDTO, CrisisSupportResponseDTO } from '../../models/crisisSupport';

export const useCrisisSupport = () => {
  const appContext = useAppContext();

  const [loading, setLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [crisisSupportData, setCrisisSupportData] = useState<CrisisSectionData[]>();

  const transformCrisisSupportResponse = (item: string) => {
    const regex = /\{\{(.*?)\|\|(.*?)\}\}/;
    const match = item.match(regex);
    if (item.includes(' or ') && match) {
      const parts = item.split(' or ');
      return { text: match[1], link: match[2], suffixText: `or ${parts[1]}` };
    } else if (match) {
      const parts = item.split(match[0]);
      const prefix = parts[0] ? parts[0].trim() : undefined;
      const suffix = parts[1] ? parts[1].trim() : undefined;
      return {
        prefixText: prefix ? `${prefix}` : undefined,
        text: `${match[1]}`,
        link: match[2],
        suffixText: suffix ? `${suffix}` : undefined,
      };
    }

    return { prefixText: item, text: undefined, link: undefined, suffixText: undefined };
  };

  const getCrisisSupportApi = useCallback(async () => {
    setLoading(true);
    try {
      const response: CrisisSupportResponseDTO = await appContext.serviceProvider.callService(
        `${API_ENDPOINTS.CRISIS_SUPPORT}`,
        RequestMethod.GET,
        null
      );
      setLoading(false);

      const responseData: CrisisSupportDataDTO[] = response.data;
      const crisisData: CrisisSectionData[] = responseData.map((section) => ({
        sectionTitle: section.title,
        crisisSupportDetails: section.list.map((data) => ({
          item: transformCrisisSupportResponse(data.item),
          details: data.details.map((detail) => ({
            ...transformCrisisSupportResponse(detail.text),
            hours: detail.hours,
            id: detail.text,
          })),
        })),
      }));

      setCrisisSupportData(crisisData);
    } catch (error) {
      setLoading(false);
      setIsServerError(true);
    }
  }, [appContext.serviceProvider]);

  useEffect(() => {
    getCrisisSupportApi();
  }, [getCrisisSupportApi]);

  const onPressTryAgain = () => {
    setIsServerError(false);
    getCrisisSupportApi();
  };

  return {
    getCrisisSupportApi,
    crisisSupportData,
    loading,
    onPressTryAgain,
    isServerError,
  };
};
