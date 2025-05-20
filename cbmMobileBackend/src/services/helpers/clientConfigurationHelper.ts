/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Messages,
  REGEX_CONSTANTS,
  ReplaceStringKeyWords,
  ServiceConstants,
  TemplateConstants,
  PATH_CONSTANTS,
} from '../../constants';
import {EAPClientConfigurationGateway as ClientConfigurationGateway} from '../../gateway/eapClientConfigurationGateway';
import {APP, JsonObject} from '../../utils/app';
import {
  toCamelCase,
  titleCaseToCamelCase,
  mergeObjects,
  replaceSingleAttributeObjects,
  replaceAll,
} from '../../utils/common';
import logger from '../../utils/logger';
import {ResponseUtil} from '../../utils/responseUtil';
import {ContentService} from '../eap/contentService';

/**
 * ClientConfigurationHelper class provides methods to fetch and process client configuration data.
 * It uses the ClientConfigurationGateway and ContentService to retrieve and manipulate the data.
 */
export class ClientConfigurationHelper {
  result = new ResponseUtil();
  clientConfigurationGateway = new ClientConfigurationGateway();
  contentService = new ContentService();
  Logger = logger();
  className = this.constructor.name;
  assessmentsSurveyId: string | undefined;

  /**
   * Fetches client data based on the type, path, and item.
   * @param {string} type - The type of data to fetch.
   * @param {string} path - The path of the client data.
   * @param {string} item - The item to fetch.
   * @param {Function} fetchData - The function to fetch data from the gateway.
   * @returns {Promise<any>} The result of the fetch operation.
   */
  async fetchClientData(
    type: string,
    path: string,
    item: string,
    fetchData: (appConfig: any) => Promise<any>,
  ) {
    try {
      const appConfig: any = await this.contentService.getContentService(
        TemplateConstants.CONTENTID_EAP_CLIENT_CONFIGURATION,
        ServiceConstants.LANGUAGE_EN_US,
      );
      if (!appConfig || !appConfig.data) {
        return this.result.createException(Messages.clientConfigurationError);
      }

      let response = await fetchData(appConfig);
      response = item
        ? this.getClientItems(response, toCamelCase(item))
        : response;
      response = await this.preAssignMissingAttributeValues(
        type,
        response,
        path,
        appConfig,
      );
      response = this.assignCustomAttributes(
        response,
        appConfig?.data[type]?.objects || [],
        appConfig?.data[type]?.fields || {},
        appConfig?.data[type]?.arrays || {},
      );
      this.organiseAttributesPerSections(
        response,
        appConfig?.data[type]?.sections || [],
      );
      response = mergeObjects(response);
      response = replaceSingleAttributeObjects(response);
      response = this.modifyHosts(
        response,
        appConfig.data.host,
        path,
        appConfig.data.domainReplacements,
      );
      this.processNestedCardData(response);
      response = await this.postAssignMissingAttributeValues(type, response);
      response = this.applyCustomClientConfiguration(
        response,
        appConfig?.data[type]?.clients || [],
      );
      response = this.unassignAttributes(
        response,
        appConfig?.data[type]?.clients || [],
      );
      return this.result.createSuccess(response);
    } catch (error: any) {
      this.Logger.error(`${this.className} - fetchClientData :: ${error}`);
      return this.result.createException(
        error,
        error?.response?.status,
        'Error fetching client data',
      );
    }
  }

  /**
   * Extracts client items based on the item prefix.
   * @param {any} items - The items to extract from.
   * @param {string} itemPrefix - The prefix of the item to extract.
   * @returns {any[]} The extracted client items.
   */
  getClientItems(items: any, itemPrefix: string) {
    const result: Record<string, any> = {};
    for (const item of items) {
      for (const key of Object.keys(item)) {
        if (key.startsWith(itemPrefix)) {
          result[key] = item[key];
        }
      }
    }
    return [result];
  }

  /**
   * Assigns custom attributes to the response based on the provided objects, fields, and arrays.
   * @param {any} response - The response to assign attributes to.
   * @param {any[]} objects - The objects to assign.
   * @param {any} fields - The fields to assign.
   * @param {any} arrays - The arrays to assign.
   * @param {string} [clientUri] - The client URI (optional).
   * @returns {any} The response with assigned attributes.
   */
  assignCustomAttributes(
    response: any,
    objects: any[],
    fields: any,
    arrays: any,
  ): any {
    return response.map((responseItem: any) => {
      // Add 'fields' specified in DB table to the 'response' object
      const fieldKeys = Object.keys(fields);
      fieldKeys.forEach((fieldKey: any) => {
        responseItem[fieldKey] = fields[fieldKey];
      });
      // Add 'objects' specified in DB table to the 'response' object
      objects?.forEach((object: any) => {
        if (
          (object.path &&
            new RegExp(object.path?.trim()).test(responseItem.path?.trim())) ||
          object.title?.trim().toLowerCase() ===
            responseItem.title?.trim().toLowerCase()
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {path, ...rest} = object;
          responseItem = {...responseItem, ...rest};
        }
      });
      // Add 'arrays' specified in DB table to the respective arrays in the 'response' object
      const resourceKeys = Object.keys(arrays);
      resourceKeys.forEach(section => {
        const sectionItems = arrays[section];
        const responseSection = responseItem[section];
        if (responseSection && responseSection.length) {
          responseSection.forEach((item: any) => {
            const sectionConfig = sectionItems.find((s: any) => {
              if (
                s.type === item.type &&
                ((s.path &&
                  new RegExp(s.path.trim()).test(item.path?.trim())) ||
                  s.title?.trim().toUpperCase() ===
                    item.title?.trim().toUpperCase())
              ) {
                // if redirectUrlsToMatch = ["/work-life-resources", "/work-life-resources/resource-library"] and item.staticRedirectUrl = "company-name/work-life-resources/resource-library",
                // then check if any element of redirectUrlsToMatch includes in item.staticRedirectUrl and return the index of the matching position.
                if (s?.redirectUrlsToMatch?.length) {
                  s.matchedIndex = s.redirectUrlsToMatch.findIndex(
                    (condition: any) =>
                      item?.staticRedirectUrl?.includes(condition),
                  );
                  s.staticRedirectUrl =
                    s?.matchedIndex > -1
                      ? s?.staticRedirectUrl?.split('|')[s?.matchedIndex]
                      : item?.staticRedirectUrl;
                  delete s.matchedIndex;
                  delete s.redirectUrlsToMatch;
                }
                return true;
              }
              return false;
            });

            if (sectionConfig) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const {path, ...rest} = sectionConfig;
              Object.assign(item, rest);
            }
          });
        }
      });
      return responseItem;
    });
  }

  /**
   * Checks if a redirect URL is invalid based on the provided clients and client path.
   * @param {JsonObject} item - The item to check.
   * @param {any[]} clients - The clients to check against.
   * @param {string} clientPath - The client path to check.
   * @returns {boolean} True if the redirect URL is invalid, false otherwise.
   */
  isInvalidRedirect(
    item: JsonObject,
    clients: any[],
    clientPath: string,
  ): boolean {
    return clients.some(client => {
      const omitConditions = this.getOmitConditions(client, clientPath?.trim());
      return this.isRedirectUrlOmitted(item, omitConditions);
    });
  }

  /**
   * Gets the omit conditions for a client based on the client path.
   * @param {any} client - The client to get omit conditions for.
   * @param {string} clientPath - The client path to check.
   * @returns {(string | null | [])[]} The omit conditions.
   */
  getOmitConditions(client: any, clientPath: string): (string | null | [])[] {
    if (new RegExp(client.path?.trim()).test(clientPath)) {
      return [...(client.omitDataIfRedirectUrlIs ?? []), null, '', []];
    }
    return [null, '', []];
  }

  /**
   * Checks if a redirect URL is omitted based on the provided omit conditions.
   * @param {JsonObject} item - The item to check.
   * @param {(string | null | [])[]} omitConditions - The omit conditions to check against.
   * @returns {boolean} True if the redirect URL is omitted, false otherwise.
   */
  isRedirectUrlOmitted(
    item: JsonObject,
    omitConditions: (string | null | [])[],
  ): boolean {
    return omitConditions.some(condition => {
      if (condition === null || condition === '' || Array.isArray(condition)) {
        return (
          item.redirectUrl === condition && item.staticRedirectUrl === condition
        );
      } else if (typeof condition === 'string') {
        const lowerCaseCondition = condition.toLowerCase();
        return (
          item.redirectUrl?.toLowerCase().includes(lowerCaseCondition) ||
          item.staticRedirectUrl?.toLowerCase().includes(lowerCaseCondition)
        );
      }
      return false;
    });
  }

  /**
   * Apply Custom Client Configuration to the response based only if response.customClient is true and clientsConfig[].path regex matches the response.path string.
   * This includes deleting invalid redirect objects from the response as specified in the clientsConfig[].omitDataIfRedirectUrlIs array.
   * This also includes removing objects from the response object whose keys are specified in the clientsConfig[]._meta.omitComponents arrays.
   * @param {JsonObject} response - The response to process.
   * @param {any[]} clientsConfig - The clients to check against.
   */
  applyCustomClientConfiguration(
    response: JsonObject,
    clientsConfig: any[],
  ): JsonObject {
    // Return early if customClient is not true
    if (!response?.customClient) {
      return response;
    }

    const clientPath = response?.path;
    const clientConfig = clientsConfig.find(c => {
      if (!c?.path || !clientPath) return false;
      return new RegExp(c.path.trim()).test(clientPath.trim());
    });

    // Return early if no matching client config found
    if (!clientConfig) {
      return response;
    }

    const processObject = (obj: unknown): unknown => {
      // Handle arrays
      if (Array.isArray(obj)) {
        return obj
          .filter(item => {
            // Filter out items with matching redirect URLs
            if (item?.redirectUrl && clientConfig.omitDataIfRedirectUrlIs) {
              return !clientConfig.omitDataIfRedirectUrlIs.some((url: string) =>
                item.redirectUrl.includes(url),
              );
            }
            return true;
          })
          .map(item => processObject(item));
      }

      // Handle objects
      if (typeof obj === 'object' && obj !== null) {
        const result: Record<string, unknown> = {};
        const currentObj = obj as Record<string, unknown>;

        // Process each key in the object
        for (const key of Object.keys(currentObj)) {
          // Skip if key is in omitComponents array
          if (clientConfig.omitComponents?.includes(key)) {
            continue;
          }

          // Recursively process nested values
          const processedValue = processObject(currentObj[key]);
          if (processedValue !== undefined) {
            result[key] = processedValue;
          }
        }

        return Object.keys(result).length > 0 ? result : undefined;
      }

      // Return primitive values as is
      return obj;
    };

    // Process the entire response object
    const processedResponse = processObject(response) as JsonObject;
    return processedResponse || response;
  }

  /**
   * Unassigns attributes from the response based on the provided clients.
   * @param {any} response - The response to unassign attributes from.
   * @param {any[]} clients - The clients to check against.
   * @returns {any} The response with unassigned attributes.
   */
  unassignAttributes(response: any, clients: any[]): any {
    // Set client objects specified in DB table to the respective client in the 'response' object
    clients?.forEach((client: any) => {
      if (
        client.path &&
        new RegExp(client.path?.trim()).test(response.path?.trim()) &&
        client.type?.trim().toLowerCase() ===
          response.type?.trim().toLowerCase()
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {path, omitDataIfRedirectUrlIs, omitComponents, ...rest} = client;
        response = {...response, ...rest};
      }
    });
    return response;
  }

  /**
   * Organises attributes per sections in the response based on the provided client configuration sections.
   * @param {any} response - The response to organise attributes for.
   * @param {string[]} clientConfigSections - The client configuration sections to organise.
   * @returns {any} The response with organised attributes.
   */
  organiseAttributesPerSections(
    response: any,
    clientConfigSections: string[],
  ): any {
    return response.map((responseItem: any) => {
      clientConfigSections.forEach(section => {
        const trimmedSection = section.trim().toUpperCase();
        Object.keys(responseItem).forEach(key => {
          const trimmedKey = key.trim().toUpperCase();
          if (
            trimmedKey &&
            trimmedKey !== trimmedSection &&
            trimmedKey.startsWith(trimmedSection)
          ) {
            const newKey = titleCaseToCamelCase(key.replace(section, ''));
            responseItem[section] = {
              ...responseItem[section],
              [newKey]: responseItem[key],
            };
            delete responseItem[key];
          }
        });
      });
      return responseItem;
    });
  }

  /**
   * Modifies the hosts in the response based on the provided host and domain replacements.
   * @param {any} response - The response to modify hosts for.
   * @param {string} host - The host to set.
   * @param {any[]} domainReplacements - The domain replacements to apply.
   * @returns {any} The response with modified hosts.
   */
  modifyHosts(
    response: any,
    host: string,
    clientUri: string,
    domainReplacements: any[],
  ): any {
    if (
      !response ||
      (Array.isArray(response) && response.length === 0) ||
      (typeof response === 'object' && Object.keys(response).length === 0)
    ) {
      return response;
    }

    const customReplacements = [
      {
        pattern: ReplaceStringKeyWords.clientUri,
        value: clientUri,
      },
    ];

    if (domainReplacements && domainReplacements.length > 0) {
      const responseString = JSON.stringify(response);
      const updatedResponseString = replaceAll(responseString, [
        ...customReplacements,
        ...domainReplacements,
      ]);
      response = JSON.parse(updatedResponseString);
    }

    return {
      host: host || APP.config.clientConfiguration.eap.consumerHost,
      ...response,
    };
  }

  /**
   * Processes nested card data in the response.
   * @param {any} response - The response to process nested card data for.
   * @returns {any} The response with processed nested card data.
   */
  processNestedCardData(response: any): any {
    const processCardModel = (card: any) => {
      this.manageCardTags(card);
      this.manageRedirectUrls(card);
    };

    const processNestedData = (data: any) => {
      if (Array.isArray(data)) {
        data.forEach(item => processNestedData(item));
      } else if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach(key => {
          if (Array.isArray(data[key])) {
            data[key].forEach((item: any) => processNestedData(item));
          } else if (typeof data[key] === 'object' && data[key] !== null) {
            processNestedData(data[key]);
          } else if (key === 'staticRedirectUrl' || key === 'redirectUrl') {
            processCardModel(data);
          }
        });
      }
    };

    processNestedData(response);
    return response;
  }

  /**
   * Manages card tags in the card object.
   * @param {any} card - The card object to manage tags for.
   * @returns {any} The card object with managed tags.
   */
  manageCardTags(card: any) {
    if ((!card.tags || !card.tags.length) && card.cardTag) {
      card.tags = [card.cardTag, ...(card.otherCardTags || [])].filter(
        tag => tag, // Omit empty, null, or undefined values
      );
    }
    return card;
  }

  /**
   * Manages redirect URLs in the card object.
   * @param {any} card - The card object to manage redirect URLs for.
   * @returns {any} The card object with managed redirect URLs.
   */
  manageRedirectUrls(card: any) {
    if (card.staticRedirectUrl) {
      const selfPacedContentMatch = card.staticRedirectUrl.match(
        REGEX_CONSTANTS.CLIENT_CONFIG_SELF_PACED_CONTENT_MATCH,
      );
      const credibleMindMatch = card.staticRedirectUrl.match(
        REGEX_CONSTANTS.CLIENT_CONFIG_CREDIBLEMIND_MATCH,
      );
      const assessmentsMatch = card.staticRedirectUrl.match(
        REGEX_CONSTANTS.CLIENT_CONFIG_ASSESSMENTS_MATCH,
      );
      if (credibleMindMatch || selfPacedContentMatch) {
        const url = new URL(card.staticRedirectUrl, 'https://sampleurl.com');
        card.staticRedirectUrl =
          TemplateConstants.CLIENT_CONFIG_REDIRECTURL_CREDIBLEMIND.replace(
            ReplaceStringKeyWords.component,
            url.searchParams.get('page') || '',
          );
      } else if (assessmentsMatch) {
        card.staticRedirectUrl =
          TemplateConstants.CLIENT_CONFIG_REDIRECTURL_ASSESSMENTS.replace(
            ReplaceStringKeyWords.surveyId,
            assessmentsMatch[1],
          );
        this.assessmentsSurveyId = assessmentsMatch[1];
      }
      card.redirectUrl =
        card.staticRedirectUrl ?? card.redirectUri ?? card.redirectUrl;
      delete card.redirectUri;
      delete card.staticRedirectUrl;
    }
    card.redirectUrl = replaceAll(
      card.redirectUrl,
      PATH_CONSTANTS.AEM_REDIRECTURL_REPLACEMENTS,
    );
    return card;
  }

  /**
   * Pre-assigns missing attribute values to the response based on the type and path.
   * @param {string} type - The type of data.
   * @param {any} response - The response to pre-assign values to.
   * @param {string} path - The path of the data.
   * @param {any} appConfig - The application configuration.
   * @returns {Promise<any>} The response with pre-assigned values.
   */
  async preAssignMissingAttributeValues(
    type: string,
    response: any,
    path: string,
    appConfig: any,
  ) {
    if (type === ServiceConstants.STRING_CARD) {
      const elements = await this.clientConfigurationGateway.getCardAssets(
        path.replace(PATH_CONSTANTS.CONTENT_DAM, PATH_CONSTANTS.API_ASSETS),
        appConfig?.data?.enableMock?.card ?? false,
      );
      const card = this.manageRedirectUrls({
        staticRedirectUrl: elements?.onlineResourceUrl?.value,
      });
      response[0].pageCardsBannerButtonsLearnMoreRedirectUrl = card.redirectUrl;
    }
    return response;
  }

  /**
   * Post-assigns missing attribute values to the response based on the type.
   * @param {string} type - The type of data.
   * @param {any} response - The response to post-assign values to.
   * @returns {Promise<any>} The response with post-assigned values.
   */
  async postAssignMissingAttributeValues(type: string, response: any) {
    if (type === ServiceConstants.STRING_RESOURCES) {
      response.assessmentsSurveyId = this.assessmentsSurveyId;
      response.wpoClientName = response?.wpoClientName?.split(';')[0]?.trim();
    }
    return response;
  }
}
