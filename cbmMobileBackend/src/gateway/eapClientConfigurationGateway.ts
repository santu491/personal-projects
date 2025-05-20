import {TemplateConstants} from '../constants';
import {
  clientArticlesMockResponse,
  clientCardsMockResponse,
  clientCardAssetsMockResponse,
  clientResoursesMockResponse,
  eapClientsMockResponse,
} from '../mocks/eap/clientConfigurationMockResponses';
import {ClientModel} from '../models/AppConfig';
import {APP} from '../utils/app';
import {axiosGet} from '../utils/httpUtil';

export class EAPClientConfigurationGateway {
  async getClients(
    isTerminated: boolean = false,
    mock: boolean = false,
  ): Promise<ClientModel[]> {
    let response;
    if (mock) {
      response = JSON.parse(JSON.stringify(eapClientsMockResponse));
    } else {
      const url = `${APP.config.clientConfiguration.eap.host}${APP.config.clientConfiguration.eap.clients.replace(
        TemplateConstants.IS_TERMINATED,
        isTerminated.toString(),
      )}`;
      response = await axiosGet(url, {});
    }
    if (!response?.data?.data?.clientList?.items?.length) {
      throw response;
    }
    return response.data.data.clientList.items;
  }

  async getResources(clientUri: string, mock: boolean = false) {
    let response;
    if (mock) {
      response = JSON.parse(
        JSON.stringify(clientResoursesMockResponse[clientUri]),
      );
    } else {
      const url = `${APP.config.clientConfiguration.eap.host}${APP.config.clientConfiguration.eap.resources.replace(
        TemplateConstants.CLIENT_URI,
        clientUri,
      )}`;
      response = await axiosGet(url, {});
    }

    if (!response?.data?.data?.clientList?.items?.length) {
      throw response;
    }
    return response.data.data.clientList.items;
  }

  async getArticles(path: string, mock: boolean = false) {
    let response;
    if (mock) {
      response = JSON.parse(JSON.stringify(clientArticlesMockResponse));
      const filteredItem = response.data.data.articleList.items.filter(
        (item: any) => item.path.startsWith(path),
      );
      response.data.data.articleList.items = filteredItem;
    } else {
      const url = `${APP.config.clientConfiguration.eap.host}${APP.config.clientConfiguration.eap.articles.replace(
        TemplateConstants.ITEM_PATH,
        path,
      )}`;
      response = await axiosGet(url, {});
    }

    if (!response?.data?.data?.articleList?.items?.length) {
      throw response;
    }
    return response.data.data.articleList.items;
  }

  async getCards(path: string, mock: boolean = false) {
    let response;
    if (mock) {
      response = JSON.parse(JSON.stringify(clientCardsMockResponse));
      const filteredItem = response.data.data.cardList.items.filter(
        (item: any) => item.path === path,
      );
      response.data.data.cardList.items = filteredItem;
    } else {
      const url = `${APP.config.clientConfiguration.eap.host}${APP.config.clientConfiguration.eap.cards.replace(
        TemplateConstants.ITEM_PATH,
        path,
      )}`;
      response = await axiosGet(url, {});
    }

    if (!response?.data?.data?.cardList?.items?.length) {
      throw response;
    }
    return response.data.data.cardList.items;
  }

  async getCardAssets(path: string, mock: boolean = false) {
    let response;
    if (mock) {
      response = JSON.parse(JSON.stringify(clientCardAssetsMockResponse));
      const filteredItem = response.data.filter(
        (item: any) => item.path === path,
      );
      response.data = filteredItem?.[0] ?? {};
    } else {
      const url = `${APP.config.clientConfiguration.eap.host}${path}.json`;
      response = await axiosGet(url, {});
    }

    if (!response?.data?.properties?.elements) {
      return response.data;
    }
    return response.data.properties.elements;
  }
}
