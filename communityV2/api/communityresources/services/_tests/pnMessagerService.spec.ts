import {
  mockInternalService
} from '@anthem/communityapi/common/baseTest';
import { mockRestClient } from '@anthem/communityapi/utils/mocks/mockRestClient';
import { InternalAuthResponse } from 'api/communityresources/models/internalRequestModel';
import { IMessageProducer } from 'api/communityresources/models/pushNotificationModel';
import { PNMessagerService } from '../pnMessagerService';

describe('Image Upload Service', () => {
  let service: PNMessagerService;
  beforeEach(() => {
    service = new PNMessagerService(
      <any>mockRestClient,
      <any>mockInternalService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const authResponse: InternalAuthResponse = {
    token_type: '',
    issued_at: '',
    client_id: '',
    access_token: 'token',
    application_name: '',
    scope: '',
    expires_in: '',
    status: ''
  };

  const producer: IMessageProducer = {
    communicationId: '',
    personId: '',
    sourceOfMessage: '',
    firstName: '',
    lastName: '',
    message: []
  };

  describe('sendMessage', async () => {
    it('success', async () => {
      mockInternalService.getAuth.mockReturnValue(authResponse);
      mockRestClient.invoke.mockReturnValue(true);

      await service.sendMessage(producer);
    });
  });

  describe('getGuid', async () => {
    it('success', async () => {
      service.getGuid();
    });
  });

});
