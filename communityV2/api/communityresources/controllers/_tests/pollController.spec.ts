import { mockPollSvc, mockRequestContext, mockResult } from "@anthem/communityapi/common/baseTest";
import { mockILogger } from "@anthem/communityapi/logger/mocks/mockILogger";
import { RequestContext } from "@anthem/communityapi/utils";
import { PollResponseRequest } from "api/communityresources/models/pollModel";
import { PollController } from "../pollController";

describe('PollController', () => {
  let controller: PollController;
  beforeEach(() => {
    controller = new PollController(
      <any>mockPollSvc,
      <any>mockResult,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('userPollResponse', () => {
    it('should return poll data', async () => {
      const request: PollResponseRequest = {
        postId: "postId",
        optionId: "optionId",
        isEdited: false
      };
      RequestContext.getContextItem = mockRequestContext;
      await controller.userPollResponse(request);
      expect(mockPollSvc.userPollResponse.mock.calls.length).toBe(1);
    });

    it('should return error', async () => {
      const request: PollResponseRequest = {
        postId: "postId",
        optionId: "optionId",
        isEdited: false
      };
      RequestContext.getContextItem = mockRequestContext;
      mockPollSvc.userPollResponse.mockRejectedValue({
        message: 'error'
      });
      await controller.userPollResponse(request);
      expect(mockResult.createException.mock.calls.length).toBe(1);
    });
  });
});
