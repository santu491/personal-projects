import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockResult, mockValidation, promptSvc } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { PromptController } from '../promptController';

describe('PromptController', () => {
  let controller: PromptController;

  beforeEach(() => {
    controller = new PromptController(<any>promptSvc, <any>mockValidation, <any>mockResult, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return all Prompt List in English', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: -1 };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            _id: '5f9c5238fdfbb52b2c86c9b9',
            CommunityId: '5f245386aa271e24b0c6fd89',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:44.009Z'
          },
          {
            _id: '5f9c5232fdfbb52b2c86c9b8',
            CommunityId: '5f245386aa271e24b0c6fd88',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:38.680Z'
          },
          {
            _id: '5f9c522cfdfbb52b2c86c9b7',
            CommunityId: '5f3d2eef5617cc2e401b8adf',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:32.549Z'
          },
          {
            _id: '5f9c5226fdfbb52b2c86c9b6',
            CommunityId: '5f369ba97b79ea14f85fb0ec',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:26.987Z'
          },
          {
            _id: '5f9c5221fdfbb52b2c86c9b5',
            CommunityId: '5f22db56a374bc4e80d80a9b',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:21.552Z'
          },
          {
            _id: '5f9c521bfdfbb52b2c86c9b4',
            CommunityId: '5f189ba00d5f552cf445b8c2',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:15.977Z'
          },
          {
            _id: '5f9c5216fdfbb52b2c86c9b3',
            CommunityId: '5f0e744536b382377497ecef',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:10.453Z'
          },
          {
            _id: '5f9c5210fdfbb52b2c86c9b2',
            CommunityId: '5f0753f6c12e0c22d00f5d23',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:04.681Z'
          },
          {
            _id: '5f9c520afdfbb52b2c86c9b1',
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:48:58.206Z'
          },
          {
            _id: '5f9c5200fdfbb52b2c86c9b0',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:48:48.616Z'
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({
      validationResult: true,
      reason: 'Sort can be 1 or -1'
    });
    promptSvc.getAllPrompt.mockReturnValue(expRes);
    const data = await controller.getAllPrompt(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, 'en');

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving Prompt List', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: 2 };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badModelTitle,
            detail: 'Sort can be 1 or -1'
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({
      validationResult: false,
      reason: 'Sort can be 1 or -1'
    });
    mockResult.createError.mockReturnValue(expRes);
    const res = await controller.getAllPrompt(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, 'en');
    expect(res).toEqual(expRes);
  });

  it('Should Return a specific Prompt', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '5f9c4d0bfdfbb52b2c86c98b',
          CommunityId: '5f0e744536b382377497ecef',
          Question:
            'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
          SectionTitle: 'One Piece of Advice',
          HelpText: '',
          SensitiveContentText: '',
          CreatedDate: '2020-10-30T17:27:39.538Z'
        }
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    promptSvc.getPromptById.mockReturnValue(expRes);
    const data = await controller.getPromptById('5f9c4d0bfdfbb52b2c86c98b', 'en');

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving a specific Prompt', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidIdDetail
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.getPromptById(' ','');
    expect(data).toEqual(expRes);
  });

  it('Should Return all prompts for a community', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            _id: '5f9c4ceafdfbb52b2c86c988',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question:
              'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
            SectionTitle: 'One Piece of Advice',
            HelpText: '',
            SensitiveContentText: '',
            CreatedDate: '2020-10-30T17:27:06.151Z'
          },
          {
            _id: '5f9c4e57fdfbb52b2c86c992',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question: 'What was it like to learn the diagnosis?',
            SectionTitle: 'Initial Diagnosis',
            HelpText:
              'ex: Why did you see a doctor? What was that day like? Did you get a second opinion?',
            SensitiveContentText: '',
            CreatedDate: '2020-10-30T17:33:11.104Z'
          },
          {
            _id: '5f9c4f04fdfbb52b2c86c99c',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question: 'How did you decide what to do?',
            SectionTitle: 'Deciding What to Do',
            HelpText:
              'ex: How did you come to terms with the diagnosis? Were you given next steps? Where did you look for help when figuring out what to do?',
            SensitiveContentText: '',
            CreatedDate: '2020-10-30T17:36:04.424Z'
          },
          {
            _id: '5f9c4f92fdfbb52b2c86c9a6',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question: 'How did you adjust to your new routine?',
            SectionTitle: 'Figuring it Out',
            HelpText:
              'ex: What was different about life after these changes? What specific adjustments did you have to make with work or kids or finances?',
            SensitiveContentText: '',
            CreatedDate: '2020-10-30T17:38:26.825Z'
          },
          {
            _id: '5f9c5200fdfbb52b2c86c9b0',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:48:48.616Z'
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    promptSvc.getByCommunityId.mockReturnValue(expRes);
    const data = await controller.getByCommunityId('5f07537bc12e0c22d00f5d21', 'en');
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving all prompts for a community', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '54e23572-14e9-413d-a123-3c06a5243ac8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.invalidIdTitle,
            detail: API_RESPONSE.messages.invalidIdDetail
          }
        ]
      }
    };
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.getByCommunityId(' ', 'en');
    expect(data).toEqual(expRes);
  });

  it('Should Return prompt after creating', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          CommunityId: '5f07537bc12e0c22d00f5d21',
          Question: 'test',
          HelpText: 'help text',
          SectionTitle: 'sectionTitle',
          SensitiveContentText: 'test',
          CreatedDate: '2021-02-24T08:11:48.466Z',
          _id: '60360a44e86f3850e5b26467'
        }
      }
    };
    const model = {
      id: '',
      communityId: '5f07537bc12e0c22d00f5d21',
      question: 'test',
      sectionTitle: 'sectionTitle',
      helpText: 'help text',
      sensitiveContentText: 'test'
    };
    mockValidation.isValidPrompt.mockReturnValue({
      validationResult: true,
      reason: 'Pass'
    });
    promptSvc.create.mockReturnValue(expRes);
    const data = await controller.createPrompt(model);
    expect(data).toEqual(expRes);
  });

  it('Should Return error while creating prompt', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: {
          id: 'b95294fb-3e02-a661-c486-424c5e48082b',
          errorCode: 400,
          title: 'Incorrect model',
          detail: 'CommunityId incorrect,  is not a 24 hex string'
        }
      }
    };
    const model = {
      id: '',
      communityId: '',
      question: 'test',
      sectionTitle: 'sectionTitle',
      helpText: 'help text',
      sensitiveContentText: 'test'
    };
    mockValidation.isValidPrompt.mockReturnValue({
      validationResult: false,
      reason: 'CommunityId incorrect,  is not a 24 hex string'
    });
    mockResult.createError.mockReturnValue(expRes);
    const data = await controller.createPrompt(model);
    expect(data).toEqual(expRes);
  });

  it('Should Return all Prompt List in Spanish', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: 1 };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            helpText: '',
            question: 'Si pudiera volver atrás en el tiempo y darse un consejo sobre cómo manejar lo que estaba a punto de vivir, ¿cuál sería ese consejo?',
            sectionTitle: 'Un consejo',
            sensitiveContentText: '',
            communityId: '5f07537bc12e0c22d00f5d21',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '5f9c4ceafdfbb52b2c86c988'
          },
          {
            helpText: 'P. ej.: ¿Por qué consultó a un médico? ¿Cómo fue ese día? ¿Pidió una segunda opinión?',
            question: '¿Cómo fue la experiencia de conocer el diagnóstico?',
            sectionTitle: 'Diagnóstico inicial',
            sensitiveContentText: '',
            communityId: '5f07537bc12e0c22d00f5d21',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '5f9c4e57fdfbb52b2c86c992'
          },
          {
            helpText: 'P. ej.: ¿Cómo aceptó el diagnóstico? ¿Le indicaron los siguientes pasos? ¿Dónde buscó ayuda a la hora de decidir qué hacer?',
            question: '¿Cómo decidió qué hacer?',
            sectionTitle: 'Decidir qué hacer',
            sensitiveContentText: '',
            communityId: '5f07537bc12e0c22d00f5d21',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '5f9c4f04fdfbb52b2c86c99c'
          },
          {
            helpText: 'P. ej.: ¿Qué ha sido diferente en la vida después de estos cambios? ¿Qué ajustes específicos tuvo que hacer con el trabajo, los niños o las finanzas?',
            question: '¿Cómo se adaptó a su nueva rutina?',
            sectionTitle: 'Decidir qué hacer',
            sensitiveContentText: '',
            communityId: '5f07537bc12e0c22d00f5d21',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '5f9c4f92fdfbb52b2c86c9a6'
          },
          {
            helpText: '',
            question: '¿Qué sucedió después?',
            sectionTitle: 'Más allá',
            sensitiveContentText: 'Esto puede ser difícil de leer para algunas personas, así que, una vez publicada, tendrán que pulsar un botón para leer su respuesta.',
            communityId: '5f07537bc12e0c22d00f5d21',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '5f9c5200fdfbb52b2c86c9b0'
          },
          {
            helpText: '',
            question: 'Si pudiera volver atrás en el tiempo y darse un consejo sobre cómo manejar lo que estaba a punto de vivir, ¿cuál sería ese consejo?',
            sectionTitle: 'Un consejo',
            sensitiveContentText: '',
            communityId: '5f07537bc12e0c22d00f5d21',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '5fca31dce3f3460007cb34fe'
          },
          {
            helpText: '',
            question: '¿Cuáles eran las mayores preocupaciones?',
            sectionTitle: '',
            sensitiveContentText: '',
            communityId: '60a358bc9c336e882b19bbf0',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '60a4d9d97f3ea0d2537e42ae'
          },
          {
            helpText: '',
            question: '¿Qué lo ayudó a decidir que era hora de un cambio?',
            sectionTitle: '',
            sensitiveContentText: '',
            communityId: '60a358bc9c336e882b19bbf0',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '60a4d9e57f3ea0d2537e42af'
          },
          {
            helpText: '',
            question: '¿Cuál era el plan de cambio?',
            sectionTitle: '',
            sensitiveContentText: '',
            communityId: '60a358bc9c336e882b19bbf0',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '60a4d9ee7f3ea0d2537e42b0'
          },
          {
            helpText: '',
            question: '¿Qué hábitos o cambios se hicieron?',
            sectionTitle: '',
            sensitiveContentText: '',
            communityId: '60a358bc9c336e882b19bbf0',
            createdDate: '2021-11-17T08:18:23.337Z',
            id: '60a4d9f67f3ea0d2537e42b1'
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({
      validationResult: true,
      reason: 'Valid'
    });
    mockValidation.isHex.mockReturnValue(true);
    promptSvc.getAllPrompt.mockReturnValue(expRes);
    const data = await controller.getAllPrompt(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, 'es');
    expect(data).toEqual(expRes);
  });

  it('Should Return a specific Prompt in Spanish', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          _id: '5f9c4d0bfdfbb52b2c86c98b',
          CommunityId: '5f0e744536b382377497ecef',
          Question:
            'Si pudiera volver atrás en el tiempo y darse un consejo sobre cómo manejar lo que estaba a punto de vivir, ¿cuál sería ese consejo?',
          SectionTitle: 'Un consejo',
          HelpText: '',
          SensitiveContentText: '',
          CreatedDate: '2020-10-30T17:27:39.538Z'
        }
      }
    };
    mockValidation.isHex.mockReturnValue(true);
    promptSvc.getPromptById.mockReturnValue(expRes);
    const data = await controller.getPromptById('5f9c4d0bfdfbb52b2c86c98b', 'es');
    expect(data).toEqual(expRes);
  });

  it('Should Return all prompts for a community in spanish', async () => {
    const expRes = {
        data: {
            isSuccess: true,
            isException: false,
            value: [
                {
                    question: 'If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?',
                    sectionTitle: 'One Piece of Advice',
                    helpText: '',
                    sensitiveContentText: '',
                    id: '5f9c4d51fdfbb52b2c86c990'
                },
                {
                    question: 'What was it like to learn the diagnosis?',
                    sectionTitle: 'Initial Diagnosis',
                    helpText: 'ex: Why did you see a doctor? What was that day like? Did you get a second opinion?',
                    sensitiveContentText: '',
                    id: '5f9c4e8bfdfbb52b2c86c99a'
                },
                {
                    question: 'How did you decide what to do?',
                    sectionTitle: 'Deciding What to Do',
                    helpText: 'ex: How did you come to terms with the diagnosis? Were you given next steps? Where did you look for help when figuring out what to do?',
                    sensitiveContentText: '',
                    id: '5f9c4f37fdfbb52b2c86c9a4'
                },
                {
                    question: 'How did you adjust to your new routine?',
                    sectionTitle: 'Figuring it Out',
                    helpText: 'ex: What was different about life after these changes? What specific adjustments did you have to make with work or kids or finances?',
                    sensitiveContentText: '',
                    id: '5f9c4fc7fdfbb52b2c86c9ae'
                },
                {
                    question: 'What happened after that?',
                    sectionTitle: 'Beyond',
                    helpText: '',
                    sensitiveContentText: 'This might be difficult for some people to read, so once it has been published, they\'ll have to push a button to read your reply.',
                    id: '5f9c5232fdfbb52b2c86c9b8'
                }
            ]
        }
    };
    mockValidation.isHex.mockReturnValue(true);
    promptSvc.getByCommunityId.mockReturnValue(expRes);
    const data = await controller.getByCommunityId('5f07537bc12e0c22d00f5d21', 'es');
    expect(data).toEqual(expRes);
  });

  it('getCommunitiesList - success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          'Anal Cancer',
          'Breast Cancer',
          'Male Breast Cancer',
          'Metastatic or Recurrent Breast Cancer',
          'Colorectal Cancer',
          'Metastatic or Recurrent Colorectal Cancer',
          'Lung Cancer',
          'Oral Cancer',
          'Prostate Cancer',
          'Advanced or Metastatic Prostate Cancer',
          'Other'
        ]
      }
    };
    promptSvc.getCommunitiesList.mockReturnValue(expRes);
    const res = await controller.getCommunitiesList('Cancer', 'en');
    expect(res).toEqual(expRes);
  });

  it('Should Return all Prompt List - check for language', async () => {
    const pageParams = { pageNumber: 1, pageSize: 10, sort: -1 };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: [
          {
            _id: '5f9c5238fdfbb52b2c86c9b9',
            CommunityId: '5f245386aa271e24b0c6fd89',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:44.009Z'
          },
          {
            _id: '5f9c5232fdfbb52b2c86c9b8',
            CommunityId: '5f245386aa271e24b0c6fd88',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:38.680Z'
          },
          {
            _id: '5f9c522cfdfbb52b2c86c9b7',
            CommunityId: '5f3d2eef5617cc2e401b8adf',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:32.549Z'
          },
          {
            _id: '5f9c5226fdfbb52b2c86c9b6',
            CommunityId: '5f369ba97b79ea14f85fb0ec',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:26.987Z'
          },
          {
            _id: '5f9c5221fdfbb52b2c86c9b5',
            CommunityId: '5f22db56a374bc4e80d80a9b',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:21.552Z'
          },
          {
            _id: '5f9c521bfdfbb52b2c86c9b4',
            CommunityId: '5f189ba00d5f552cf445b8c2',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:15.977Z'
          },
          {
            _id: '5f9c5216fdfbb52b2c86c9b3',
            CommunityId: '5f0e744536b382377497ecef',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:10.453Z'
          },
          {
            _id: '5f9c5210fdfbb52b2c86c9b2',
            CommunityId: '5f0753f6c12e0c22d00f5d23',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:49:04.681Z'
          },
          {
            _id: '5f9c520afdfbb52b2c86c9b1',
            CommunityId: '5f0753b7c12e0c22d00f5d22',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:48:58.206Z'
          },
          {
            _id: '5f9c5200fdfbb52b2c86c9b0',
            CommunityId: '5f07537bc12e0c22d00f5d21',
            Question: 'What happened after that?',
            SectionTitle: 'Beyond',
            HelpText: '',
            SensitiveContentText:
              "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
            CreatedDate: '2020-10-30T17:48:48.616Z'
          }
        ]
      }
    };
    mockValidation.isValid.mockReturnValue({
      validationResult: true,
      reason: 'Sort can be 1 or -1'
    });
    promptSvc.getAllPrompt.mockReturnValue(expRes);
    const data = await controller.getAllPrompt(pageParams.pageNumber, pageParams.pageSize, pageParams.sort, '');

    expect(data).toEqual(expRes);
  });
});
