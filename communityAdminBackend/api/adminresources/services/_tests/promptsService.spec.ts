import { mockLogger, mockMongo, mockResult } from "@anthem/communityadminapi/common/baseTest";
import { PromptRequest } from "api/adminresources/models/promptModel";
import { PromptsService } from "../promptsService";

describe('Prompts Service', () => {
  let service: PromptsService;

  beforeEach(() => {
    service = new PromptsService(
      <any>mockMongo,
      <any>mockResult,
      <any>mockLogger
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getByCommunityId - should return data', async () => {
    mockMongo.readAll.mockReturnValue([
      {
        content: {
          prompts: '1.0.0'
        }
      }
    ]);
    mockMongo.readAllByValue.mockReturnValue([
      {
        language: 'en',
        data: {
          createStoryModule: [{
            communityId: 'communityId'
          }, {
            communityId: 'communityId1'
          },
          ]
        }
      },
      {
        language: 'es',
        data: {
          createStoryModule: [{
            communityId: 'communityId'
          }, {
            communityId: 'communityId1'
          },
          ]
        }
      }
    ]);
    const expectedResult = {
      data: {
        isSuccess: true,
        isException: false,
        data: {
          communityId: 'communityId'
        }
      }
    }
    mockResult.createSuccess.mockReturnValue(expectedResult);
    const result = await service.getByCommunityId('communityId');
    expect(result).toBe(expectedResult);
  });

  it('setPromptData - edit data and return success', async () => {
    const input: PromptRequest = {
      communityId: "communityId",
      prompts: [
        {
          promptId: 'promptId',
          en: {
            question: 'New Question',
          },
          es: {
            question: 'New Question',
          }
        },
        {
          promptId: 'promptId1',
          en: {
            question: 'New Question 1',
          },
          es: {
            question: 'New Question 1',
          }
        }
      ]
    };
    const expectedResult = {
      data: {
        isSuccess: true,
        isException: false,
        data: true
      }
    };
    mockMongo.readAll.mockReturnValue([
      {
        content: {
          prompts: '1.0.0'
        }
      }
    ]);
    mockMongo.readAllByValue.mockReturnValue([
      {
        language: 'en',
        data: {
          createStoryModule: [{
            communityId: 'communityId',
            prompts: [
              {
                promptId: 'promptId',
                question: 'Existing Question'
              }
            ]
          }, {
            communityId: 'communityId1',
            prompts: [
              {
                promptId: 'promptId1',
                question: 'Existing Question'
              }
            ]
          },
          ]
        }
      },
      {
        language: 'es',
        data: {
          createStoryModule: [{
            communityId: 'communityId',
            prompts: [
              {
                promptId: 'promptId',
                question: 'Existing Question'
              }
            ]
          }, {
            communityId: 'communityId1',
            prompts: [
              {
                promptId: 'promptId1',
                question: 'Existing Question'
              }
            ]
          },
          ]
        }
      }
    ]);
    mockResult.createSuccess.mockReturnValue(expectedResult);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValue(1);
    const actualResult = await service.setPromptData(input);

    expect(actualResult).toBe(expectedResult);
  });

  it('setPromptData - create data and return success', async () => {
    const input: PromptRequest = {
      communityId: "communityId",
      prompts: [
        {
          promptId: 'promptId',
          en: {
            question: 'New Question',
          },
          es: {
            question: 'New Question',
          }
        },
        {
          promptId: 'promptId1',
          en: {
            question: 'New Question 1',
          },
          es: {
            question: 'New Question 1',
          }
        }
      ]
    };
    const expectedResult = {
      data: {
        isSuccess: true,
        isException: false,
        data: true
      }
    };
    mockMongo.readAll.mockReturnValue([
      {
        content: {
          prompts: '1.0.0'
        }
      }
    ]);
    mockMongo.readAllByValue.mockReturnValue([]);
    mockResult.createSuccess.mockReturnValue(expectedResult);
    mockMongo.updateByQuery.mockReturnValueOnce(1).mockReturnValue(1);
    const actualResult = await service.setPromptData(input);

    expect(actualResult).toBe(expectedResult);
  });
});
