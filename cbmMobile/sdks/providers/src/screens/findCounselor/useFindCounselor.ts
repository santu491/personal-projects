import { useEffect, useState } from 'react';

import { API_ENDPOINTS, API_ENDPOINTS_JSON, ExperienceType, Language } from '../../../../../src/config';
import { SourceType } from '../../../../../src/constants/constants';
import { RequestMethod } from '../../../../../src/models/adapters';
import { DISCLAIMER_PARAMETERS } from '../../config/constants/constants';
import { useProviderContext } from '../../context/provider.sdkContext';
import { DisclaimerScreenNames, ProviderPlanPreferenceSuccessDTO } from '../../model/providerFilter';
import { MhsudDisclaimerResponseDTO } from '../../model/providerSearchResponse';

export const useFindCounselor = () => {
  const [isDisclaimerVisisble, setIsDisclaimerVisisble] = useState(false);
  const [disclaimerContent, setDisclaimerContent] = useState<{ html: string }>();
  const { resetProviderContextInfo, serviceProvider, client, loggedIn } = useProviderContext();

  useEffect(() => {
    resetProviderContextInfo();
    if (client?.source === SourceType.EAP) {
      getPlanPreference();
    } else if (client?.source === SourceType.MHSUD) {
      getMhsudDisClaimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPlanPreference = async () => {
    const result: ProviderPlanPreferenceSuccessDTO = await serviceProvider.callService(
      `${API_ENDPOINTS.PROVIDER_PLANS}/${client?.planId}/preferences`,
      RequestMethod.GET,
      null
    );
    const disclaimers = result.data?.disclaimers;
    const contentData = disclaimers?.find((content) => content.screenName === DisclaimerScreenNames.HOME);
    if (contentData) {
      setDisclaimerContent({ html: contentData.content });
    }
  };

  const getMhsudDisClaimer = async () => {
    const disclaimerResponse: MhsudDisclaimerResponseDTO = await serviceProvider.callService(
      `/${loggedIn ? ExperienceType.SECURE : ExperienceType.PUBLIC}/${client?.source}/${Language.EN}${API_ENDPOINTS_JSON.TELEHEALTH.endpoint}`,
      RequestMethod.POST,
      {
        path: `/${client?.clientUri}/${Language.EN}/home/find-providers`,
        parameters: DISCLAIMER_PARAMETERS,
      }
    );
    if (disclaimerResponse.data?.disclaimer) {
      setDisclaimerContent({ html: disclaimerResponse.data.disclaimer });
    }
  };

  const handleDisclaimerClick = () => {
    setIsDisclaimerVisisble(true);
  };

  const closeDisclaimerModal = () => {
    setIsDisclaimerVisisble(false);
  };

  return {
    setIsDisclaimerVisisble,
    isDisclaimerVisisble,
    handleDisclaimerClick,
    closeDisclaimerModal,
    disclaimerContent,
  };
};
