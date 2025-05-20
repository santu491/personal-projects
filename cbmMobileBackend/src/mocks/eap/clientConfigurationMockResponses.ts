import clientConfigurationMockResources from './clientConfigurationMockResources.json';
import clientConfigurationMockArticles from './clientConfigurationMockArticles.json';
import clientConfigurationMockCards from './clientConfigurationMockCards.json';
import clientConfigurationMockCardAssets from './clientConfigurationMockCardAssets.json';
import eapClientConfigurationMockClients from './clientConfigurationMockClients.json';

export const eapClientsMockResponse: EAPClientConfiguration =
  eapClientConfigurationMockClients;

export const clientResoursesMockResponse: ClientResourcesMockResponse =
  clientConfigurationMockResources;

export const clientArticlesMockResponse = clientConfigurationMockArticles;

export const clientCardsMockResponse = clientConfigurationMockCards;

export const clientCardAssetsMockResponse = clientConfigurationMockCardAssets;

/* eslint-disable @typescript-eslint/no-explicit-any */
type ClientResourcesMockResponse = {
  [key: string]: {
    data: {
      data: {
        clientList: {
          items: any[];
        };
      };
    };
  };
};

interface EAPClientConfiguration {
  data: {
    data: {
      clientList: {
        items: ClientModel[];
      };
    };
  };
}

interface ClientModel {
  type: string;
  path: string;
  enable: boolean;
  clientName: string;
  clientUri: string;
  customClient: boolean;
  brandLogo: Record<string, any>;
  clientLogo: ClientLogo | null;
  eapId: string | null;
  eapSupportText: string | null;
  eapNumber: string;
  otherEapNumbers: string[] | null;
}

interface ClientLogo {
  url: string;
}
