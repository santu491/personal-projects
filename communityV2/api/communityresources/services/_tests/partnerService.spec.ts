import { mockMongo, mockPublicSvc, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { PartnerService } from "../partnerService";

describe('PartnerService', () => {
  let service;
  const helpfulInfo = require('./data/helpfulInfo.json');
  beforeEach(() => {
    service = new PartnerService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockPublicSvc,
      <any>mockILogger
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getPartnerLogo', async () => {
    mockMongo.readByID.mockReturnValue({
      title: 'MOD',
      logoImage: 'base64'
    });
    await service.getParterLogo('partnerId', undefined);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPartnerLogo - article image - success', async () => {
    mockMongo.readByID.mockReturnValue({
      title: 'MOD',
      logoImage: 'base64',
      articleImage: 'articleImageBase64'
    });
    await service.getParterLogo('partnerId', true);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    expect(mockResult.createSuccess).toBeCalledWith('articleImageBase64');
  });

  it('getPartnerLogo - shoudl return logo image instead of article image', async () => {
    mockMongo.readByID.mockReturnValue({
      title: 'MOD',
      logoImage: 'base64',
      articleImage: null
    });
    await service.getParterLogo('partnerId', true);
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
    expect(mockResult.createSuccess).toBeCalledWith('base64');
  });

  it('getPartnerLogo - error', async () => {
    mockMongo.readByID.mockReturnValue(null);
    await service.getParterLogo('partnerId');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('getPartnerLogo - exception', async () => {
    mockMongo.readByID.mockRejectedValue({
      message: 'Not a valid value'
    });
    await service.getParterLogo('partnerId');
    expect(mockResult.createException.mock.calls.length).toBe(1);
  });

  it('getPartnerList - success', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue(helpfulInfo);
    await service.getPartnerList('636a621e5cefbf00156257bb', '054e9dbabb95cb5e6e549d76', 'en');
    expect(mockResult.createSuccess.mock.calls.length).toBe(1);
  });

  it('getPartnerList - community does not exist', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue(helpfulInfo);
    await service.getPartnerList('636a621e5cefbf10156257bb', '054e9dbabb95cb5e6e549d76', 'en');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('getPartnerList - bucket does not exist', async () => {
    mockPublicSvc.getAppTranslations.mockReturnValue(helpfulInfo);
    await service.getPartnerList('636a621e5cefbf00156257bb', '054e9dbacb95cb5e6e549d76', 'en');
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });
})
