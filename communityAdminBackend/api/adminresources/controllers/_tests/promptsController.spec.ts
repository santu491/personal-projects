import { API_RESPONSE } from "@anthem/communityadminapi/common";
import { mockLogger, mockPromptService, mockResult, mockValidation } from "@anthem/communityadminapi/common/baseTest";
import { PromptRequest } from "api/adminresources/models/promptModel";
import { PromptsController } from "../promptsController";

describe('PromptsController', () => {
  let controller: PromptsController

  beforeEach(() => {
    controller = new PromptsController(
      <any>mockResult,
      <any>mockValidation,
      <any>mockLogger,
      <any>mockPromptService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getPromptsByCommunity - Should Return Prompts', async () => {
    const expRes = {
      language: 'en',
      version: '1.0.0',
      data: {
        createStoryModule: [
          {
            communityId: 'communityId',
            prompts:[]
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    mockPromptService.getByCommunityId.mockReturnValue(expRes);
    mockResult.createSuccess.mockReturnValue(expRes);
    const result = await controller.getPromptsByCommunity('communityId');
    expect(result).toBe(expRes);
  });

  it('getPromptsByCommunity - Should Return Error', async () => {
    const expRes = {
      isSuccess: false,
      isException: true,
      errors: {
        title: API_RESPONSE.messages.invalidIdTitle,
        detail: API_RESPONSE.messages.invalidIdDetail
      },
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const result = await controller.getPromptsByCommunity('communityId');
    expect(result).toBe(expRes);
  });

  it('updatePrompts - Invalid Community ID', async () => {
    const input: PromptRequest = {
      "communityId": "6268ef6e1b1cb2002eba1657",
      "prompts": [
        {
          "promptId": "61778de68c1ec568209d269d",
          "en": {
            "question": "New Question",
            "helpText": "",
            "sensitiveContentText": "",
            "sectionTitle": "One Piece of Advice"
          },
          "es": {
            "question": "New Question in ES",
            "helpText": "",
            "sensitiveContentText": "",
            "sectionTitle": "One Piece of Advice"
          }
        },
        {
          "promptId": "61938931ac319f6f1c6a6286",
          "en": {
            "question": "New Question 2",
            "helpText": "Help Text",
            "sensitiveContentText": "",
            "sectionTitle": ""
          },
          "es": {
            "question": "New Question 2 es",
            "helpText": "Help Text es",
            "sensitiveContentText": "",
            "sectionTitle": ""
          }
        }
      ]
    };

    const expRes = {
      isSuccess: false,
      isException: true,
      errors: {
        title: API_RESPONSE.messages.invalidIdTitle,
        detail: API_RESPONSE.messages.invalidIdDetail
      }
    }

    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const result = await controller.updatePrompts(input);
    expect(result).toBe(expRes);
  });

  it('updatePrompts - Invalid Prompt ID', async () => {
    const input: PromptRequest = {
      "communityId": "6268ef6e1b1cb2002eba1657",
      "prompts": [
        {
          "promptId": "61778de68c1ec568209d269d",
          "en": {
            "question": "New Question",
            "helpText": "",
            "sensitiveContentText": "",
            "sectionTitle": "One Piece of Advice"
          },
          "es": {
            "question": "New Question in ES",
            "helpText": "",
            "sensitiveContentText": "",
            "sectionTitle": "One Piece of Advice"
          }
        },
        {
          "promptId": "61938931ac319f6f1c6a6286",
          "en": {
            "question": "New Question 2",
            "helpText": "Help Text",
            "sensitiveContentText": "",
            "sectionTitle": ""
          },
          "es": {
            "question": "New Question 2 es",
            "helpText": "Help Text es",
            "sensitiveContentText": "",
            "sectionTitle": ""
          }
        }
      ]
    };

    const expRes = {
      isSuccess: false,
      isException: true,
      errors: {
        title: API_RESPONSE.messages.invalidIdTitle,
        detail: API_RESPONSE.messages.invalidIdDetail
      }
    }

    mockValidation.isHex.mockReturnValueOnce(true).mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const result = await controller.updatePrompts(input);
    expect(result).toBe(expRes);
  });

  it('updatePrompts - should Return Success', async () => {
    const input: PromptRequest = {
      "communityId": "6268ef6e1b1cb2002eba1657",
      "prompts": [
        {
          "promptId": "61778de68c1ec568209d269d",
          "en": {
            "question": "New Question",
            "helpText": "",
            "sensitiveContentText": "",
            "sectionTitle": "One Piece of Advice"
          },
          "es": {
            "question": "New Question in ES",
            "helpText": "",
            "sensitiveContentText": "",
            "sectionTitle": "One Piece of Advice"
          }
        },
        {
          "promptId": "61938931ac319f6f1c6a6286",
          "en": {
            "question": "New Question 2",
            "helpText": "Help Text",
            "sensitiveContentText": "",
            "sectionTitle": ""
          },
          "es": {
            "question": "New Question 2 es",
            "helpText": "Help Text es",
            "sensitiveContentText": "",
            "sectionTitle": ""
          }
        }
      ]
    };

    const expRes = {
      isSuccess: false,
      isException: true,
      errors: {
        title: API_RESPONSE.messages.invalidIdTitle,
        detail: API_RESPONSE.messages.invalidIdDetail
      }
    }

    mockValidation.isHex.mockReturnValue(true);
    mockPromptService.setPromptData.mockReturnValue(expRes);
    const result = await controller.updatePrompts(input);
    expect(result).toBe(expRes);
  });
});
