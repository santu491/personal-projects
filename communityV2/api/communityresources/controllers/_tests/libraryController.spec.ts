import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockLibrary, mockPartnerSvc, mockRequestContext, mockResult, mockValidation } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { RequestContext } from '@anthem/communityapi/utils';
import { LibraryController } from '../libraryController';

describe('LibraryController', () => {
  let ctrl: LibraryController;

  const mockNullRequestContext = jest.fn().mockReturnValue("{\"name\":\"~SIT3SBB000008AB\",\"id\":null,\"firstName\":\"PHOEBE\",\"lastName\":\"STINSON\",\"active\":\"true\",\"isDevLogin\":\"true\",\"iat\":1642001503,\"exp\":1642030303,\"sub\":\"~SIT3SBB000008AB\",\"jti\":\"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019\"}");
  beforeEach(() => {
    ctrl = new LibraryController(<any>mockLibrary, <any>mockPartnerSvc, <any>mockValidation, <any>mockResult, <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return a specific Library for all zeros community ID', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '5f6a45c4f110be8c7e60f025',
          title: '',
          description: '',
          communityId: '000000000000000000000000',
          sections: [
            {
              title: '',
              description: '',
              type: 'List',
              content: []
            }
          ]
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryByCommunityId.mockReturnValue(expRes);
    const data = await ctrl.getLibraryByCommunityId(
      '000000000000000000000000',
      'en'
    );

    expect(data).toEqual(expRes);
  });

  it('Should Return a specific Library for all zeros community ID - language undefined', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '5f6a45c4f110be8c7e60f025',
          title: '',
          description: '',
          communityId: '000000000000000000000000',
          sections: [
            {
              title: '',
              description: '',
              type: 'List',
              content: [
                {
                  id: '',
                  communityId: '',
                  type: 'HWVideo',
                  contentId: '',
                  title: 'Cancer: When You First Find Out',
                  description: '',
                  link: '/v1/api/HealthWise/VideoTopic/abp6265',
                  video:
                    'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/E0/abp6265.mp4',
                  thumbnail:
                    'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/abp6265.jpg'
                },
                {
                  id: '',
                  communityId: '',
                  type: 'HWTopic',
                  contentId: '',
                  title: 'Living With Cancer',
                  description:
                    'A video collection about dealing with the social and emotional effects of cancer',
                  link: '/v1/api/library/content/5f804eeb326b36caf1bd8e25',
                  video: '',
                  thumbnail: ''
                },
                {
                  id: '',
                  communityId: '',
                  type: 'HWTopic',
                  contentId: '',
                  title: 'Caregiver Resources',
                  description:
                    'Read about the range of treatments available for you when diagnosed',
                  link: '/v1/api/library/content/5ff3453577b01e2046c36a18',
                  video: '',
                  thumbnail: ''
                },
                {
                  id: '',
                  communityId: '',
                  type: 'HWTopic',
                  contentId: '',
                  title: 'Symptom Management Toolkit',
                  description:
                    'Read about symptomps, causes, diagnostics, and more',
                  link: '/v1/api/library/content/5f907b60e48e5c8c0285c71d',
                  video: '',
                  thumbnail: ''
                }
              ]
            }
          ]
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryByCommunityId.mockReturnValue(expRes);
    const data = await ctrl.getLibraryByCommunityId(
      '000000000000000000000000',
      null
    );

    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving a specific Library', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'bd01e356-937f-c40f-9b53-8f36795a940a',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.userIsNotInCommunity
          }
        ]
      }
    };
    RequestContext.getContextItem = mockNullRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes)
    const data = await ctrl.getLibraryByCommunityId(
      '5f0753f6c12e0c22d00f5d23',
      'en'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving a specific Library', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '83a7ca62-b343-8550-64f3-aee156535038',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.noIdDetail
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getLibraryByCommunityId(null, 'en');
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for invalid Library', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '83a7ca62-b343-8550-64f3-aee156535038',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.noIdDetail
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getLibraryByCommunityId('5f0753f6c12e0c22d00f5d23', 'en');
    expect(data).toEqual(expRes);
  });

  it('Should Return Success response for htmlDescription FALSE', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          title: "How do you trim someone's fingernails?",
          subTitle: "How do you trim someone's fingernails?",
          html: [
            {
              content:
                'Try to trim the person’s nails every week. Or check them each week to see if they need to be trimmed.',
              type: 'p'
            }
          ]
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getReferenceContent.mockReturnValue(expRes);
    const data = await ctrl.getReferenceContent(
      '5ff340cf77b01e2046c36a15',
      '',
      'en',
      false
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Success response for htmlDescription TRUE', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          title: "How do you trim someone's fingernails?",
          subTitle: "How do you trim someone's fingernails?",
          htmlToRender:
            'Try to trim the person’s nails every week. Or check them each week to see if they need to be trimmed.'
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getReferenceContent.mockReturnValue(expRes);
    const data = await ctrl.getReferenceContent(
      '5ff340cf77b01e2046c36a15',
      '',
      'en',
      true
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Success response for htmlDescription TRUE - language undefined', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          title: "How do you trim someone's fingernails?",
          subTitle: "How do you trim someone's fingernails?",
          htmlToRender:
            'Try to trim the person’s nails every week. Or check them each week to see if they need to be trimmed.'
        }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getReferenceContent.mockReturnValue(expRes);
    const data = await ctrl.getReferenceContent(
      '5ff340cf77b01e2046c36a15',
      '',
      '',
      true
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error response for invalid library Id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '908f5835-fa72-bc79-afdd-e28346bbf2f6',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Library Id is not a 24 hex string'
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getReferenceContent(
      '5ff340cf77b01e2046c36',
      '',
      'en',
      true
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving a specific Library', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '83a7ca62-b343-8550-64f3-aee156535038',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.noIdDetail
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getReferenceContent(
      '5ff340cf77b01e2046c36',
      '',
      'en',
      true
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error response for invalid title', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '6184e523-96b3-40aa-5fa6-97cd7ed1017c',
            errorCode: 400,
            title: 'Not Found',
            detail: 'No Data found for given request'
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getReferenceContent.mockReturnValue(expRes);
    const data = await ctrl.getReferenceContent(
      '5ff340cf77b01e2046c36a15',
      'random title',
      'en',
      true
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return library content for given id', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: "6081367b9184f81ffab02218",
          headerTitle: "Overview",
          headerDescription: "",
          title: "Overview",
          description:
            "What is diabetes and what it means for you and your life.",
          communityId: "",
          sections: [
            {
              title: "",
              description: "",
              type: "List",
              content: [
                {
                  id: "",
                  communityId: "",
                  type: "HWReference",
                  contentId: "",
                  title: "Diabetes",
                  description:
                    "Diabetes is a condition in which sugar (glucose) remains in the blood.",
                  link: "/v1/api/HealthWise/ArticleTopic/std120744",
                  video: "",
                  thumbnail: "",
                },
              ],
            },
          ],
        },
      },
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryContent.mockReturnValue(expRes);
    const data = await ctrl.getLibraryContent(
      '6081367b9184f81ffab02218',
      'en'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return a specific Library for all zeros community ID', async () => {
    const expRes = {
      data: {
          isSuccess: true,
          isException: false,
          value: {
              communityId: '000000000000000000000000',
              description: '',
              sections: [
                  {
                      content: [
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Una colección de videos con consejos para ayudarlo a ser un padre más efectivo',
                              link: '/v2/library/content/60e2e7297c37b43a668a32f8',
                              thumbnail: '',
                              title: 'Crianza',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Una colección de videos para ayudarlo a comprender mejor y controlar su peso.',
                              link: '/v2/library/content/60a36a446c8649ba2ed11c84',
                              thumbnail: '',
                              title: 'Cómo controlar su peso',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Una colección de videos para ayudarlo a comprender mejor y tratar su diabetes.',
                              link: '/v2/library/content/608147769184f81ffab0221d',
                              thumbnail: '',
                              title: 'Vivir con diabetes',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Una colección de videos sobre cómo lidiar con los efectos sociales y emocionales del cáncer',
                              link: '/v2/library/content/5f804eeb326b36caf1bd8e25',
                              thumbnail: '',
                              title: 'Vivir con cáncer',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Recursos para ayudarlo a cuidarse a usted mismo mientras cuida a su ser querido',
                              link: '/v2/library/content/5ff3453577b01e2046c36a18',
                              thumbnail: '',
                              title: 'Recursos para cuidadores',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Lea sobre síntomas, causas, diagnósticos y mucho más.',
                              link: '/v2/library/content/5f88993b326b36caf120b3c5',
                              thumbnail: '',
                              title: 'Conceptos básicos del seguro médico',
                              type: 'HWTopic',
                              video: ''
                          }
                      ],
                      description: '',
                      title: '',
                      type: 'List'
                  }
              ],
              title: '',
              id: '5f6a45c4f110be8c7e60f025'
          }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryByCommunityId.mockReturnValue(expRes);
    const data = await ctrl.getLibraryByCommunityId(
      '000000000000000000000000',
      'es'
    );

    expect(data).toEqual(expRes);
  });

  it('Should Return a specific Library for a valid community ID', async () => {
    const expRes = {
      data: {
          isSuccess: true,
          isException: false,
          value: {
              communityId: '5f245386aa271e24b0c6fd88',
              description: '',
              headerDescription: 'Contenidos seleccionados cuidadosamente para usted.',
              headerTitle: 'Biblioteca',
              sections: [
                  {
                      content: [
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Lea sobre síntomas, causas, diagnósticos y mucho más.',
                              link: '/v2/library/content/5f88637a326b36caf11397ae',
                              thumbnail: '',
                              title: 'Descripción del cáncer de próstata',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              description: 'Obtenga información sobre las opciones de tratamiento para el cáncer de próstata.',
                              link: '/v2/library/content/5f88751e326b36caf117e5fe',
                              thumbnail: '',
                              title: 'Tratamientos',
                              type: 'HWTopic',
                              video: ''
                          }
                      ],
                      description: '',
                      title: 'Temas',
                      type: 'List'
                  },
                  {
                      content: [
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/healthWise/videoTopic/abp6265',
                              thumbnail: 'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/abp6265.jpg',
                              title: 'Cáncer: cuando recibe la noticia',
                              type: 'HWVideo',
                              video: 'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/E0/abp6265.mp4'
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/library/content/5f804eeb326b36caf1bd8e25',
                              thumbnail: '',
                              title: 'Ver todos los videos',
                              type: 'HWBTNVideoList',
                              video: ''
                          }
                      ],
                      description: 'Una colección de videos sobre cómo lidiar con los efectos sociales y emocionales del cáncer.',
                      title: 'Vivir con cáncer'
                  },
                  {
                      content: [
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Consejos para ayudar a una persona a bañarse, vestirse, afeitarse y mucho más.',
                              link: '/v2/library/content/5ff340cf77b01e2046c36a15',
                              thumbnail: '',
                              title: 'Higiene y baño',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Consejos para asistir a una persona que necesita ayuda para usar el excusado.',
                              link: '/v2/library/content/5ff33bb977b01e2046c36a14',
                              thumbnail: '',
                              title: 'Uso del excusado y cuidados en el baño',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Cómo ayudar a una persona que necesita ayuda física para moverse en el hogar.',
                              link: '/v2/library/content/5ff3450977b01e2046c36a16',
                              thumbnail: '',
                              title: 'Ayuda para el desplazamiento',
                              type: 'HWTopic',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/library/content/5ff3453577b01e2046c36a18',
                              thumbnail: '',
                              title: 'Ver todos los recursos para cuidadores',
                              type: 'HWBTNCaregiverList',
                              video: ''
                          }
                      ],
                      description: 'Cuidar a un ser querido puede ser muy gratificante y también exigente. Los siguientes son recursos para ayudarlo a cuidarse a usted mismo mientras cuida a su ser querido.',
                      title: 'Recursos para cuidadores'
                  },
                  {
                      backgroundColor: '#F7F7F7',
                      content: [
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Descripciones de los diferentes tipos de médicos y otros profesionales médicos.',
                              link: '/v2/library/content/5f8ef847326b36caf106b9c6',
                              thumbnail: '',
                              title: 'Definiciones de especialidades médicas',
                              type: 'HWReference',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Sugerencias útiles para tratar síntomas y efectos secundarios de los tratamientos contra el cáncer.',
                              link: '/v2/library/content/5f907b60e48e5c8c0285c71d',
                              thumbnail: '',
                              title: 'Paquete de ayuda para el tratamiento de síntomas',
                              type: 'HWReference',
                              video: ''
                          },
                          {
                              _id: '',
                              communityId: '',
                              contentId: '',
                              description: 'Qué es, cómo puede obtenerlo, cuánto cuesta y mucho más',
                              link: '/v2/library/content/5f88993b326b36caf120b3c5',
                              thumbnail: '',
                              title: 'Conceptos básicos del seguro médico',
                              type: 'HWReference',
                              video: ''
                          }
                      ],
                      description: '',
                      title: 'Materiales de referencia'
                  }
              ],
              title: 'Prostate Cancer',
              id: '5f88602c326b36caf1130516'
          }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryByCommunityId.mockReturnValue(expRes);
    const data = await ctrl.getLibraryByCommunityId(
      '5f245386aa271e24b0c6fd88',
      'es'
    );

    expect(data).toEqual(expRes);
  });

  it('Should Return library content for given id in spanish', async () => {
    const expRes = {
      data: {
          isSuccess: true,
          isException: false,
          value: {
              communityId: '5f245386aa271e24b0c6fd88',
              description: '',
              headerDescription: 'Contenidos seleccionados cuidadosamente para usted.',
              headerTitle: 'Biblioteca',
              sections: [
                  {
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Lea sobre síntomas, causas, diagnósticos y mucho más.',
                              link: '/v2/library/content/5f88637a326b36caf11397ae',
                              thumbnail: '',
                              title: 'Descripción del cáncer de próstata',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              description: 'Obtenga información sobre las opciones de tratamiento para el cáncer de próstata.',
                              link: '/v2/library/content/5f88751e326b36caf117e5fe',
                              thumbnail: '',
                              title: 'Tratamientos',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          }
                      ],
                      description: '',
                      title: 'Temas',
                      type: 'List'
                  },
                  {
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/healthWise/videoTopic/abp6265',
                              thumbnail: 'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/abp6265.jpg',
                              title: 'Cáncer: cuando recibe la noticia',
                              type: 'HWVideo',
                              video: 'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/E0/abp6265.mp4',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/library/content/5f804eeb326b36caf1bd8e25',
                              thumbnail: '',
                              title: 'Ver todos los videos',
                              type: 'HWBTNVideoList',
                              video: '',
                              id: ''
                          }
                      ],
                      description: 'Una colección de videos sobre cómo lidiar con los efectos sociales y emocionales del cáncer.',
                      title: 'Vivir con cáncer'
                  },
                  {
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Consejos para ayudar a una persona a bañarse, vestirse, afeitarse y mucho más.',
                              link: '/v2/library/content/5ff340cf77b01e2046c36a15',
                              thumbnail: '',
                              title: 'Higiene y baño',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Consejos para asistir a una persona que necesita ayuda para usar el excusado.',
                              link: '/v2/library/content/5ff33bb977b01e2046c36a14',
                              thumbnail: '',
                              title: 'Uso del excusado y cuidados en el baño',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Cómo ayudar a una persona que necesita ayuda física para moverse en el hogar.',
                              link: '/v2/library/content/5ff3450977b01e2046c36a16',
                              thumbnail: '',
                              title: 'Ayuda para el desplazamiento',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/library/content/5ff3453577b01e2046c36a18',
                              thumbnail: '',
                              title: 'Ver todos los recursos para cuidadores',
                              type: 'HWBTNCaregiverList',
                              video: '',
                              id: ''
                          }
                      ],
                      description: 'Cuidar a un ser querido puede ser muy gratificante y también exigente. Los siguientes son recursos para ayudarlo a cuidarse a usted mismo mientras cuida a su ser querido.',
                      title: 'Recursos para cuidadores'
                  },
                  {
                      backgroundColor: '#F7F7F7',
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Descripciones de los diferentes tipos de médicos y otros profesionales médicos.',
                              link: '/v2/library/content/5f8ef847326b36caf106b9c6',
                              thumbnail: '',
                              title: 'Definiciones de especialidades médicas',
                              type: 'HWReference',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Sugerencias útiles para tratar síntomas y efectos secundarios de los tratamientos contra el cáncer.',
                              link: '/v2/library/content/5f907b60e48e5c8c0285c71d',
                              thumbnail: '',
                              title: 'Paquete de ayuda para el tratamiento de síntomas',
                              type: 'HWReference',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Qué es, cómo puede obtenerlo, cuánto cuesta y mucho más',
                              link: '/v2/library/content/5f88993b326b36caf120b3c5',
                              thumbnail: '',
                              title: 'Conceptos básicos del seguro médico',
                              type: 'HWReference',
                              video: '',
                              id: ''
                          }
                      ],
                      description: '',
                      title: 'Materiales de referencia'
                  }
              ],
              title: 'Cáncer de próstata',
              id: '5f88602c326b36caf1130516'
          }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryContent.mockReturnValue(expRes);
    const data = await ctrl.getLibraryContent(
      '5f88602c326b36caf1130516',
      'es'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return library content for given id - language undefined', async () => {
    const expRes = {
      data: {
          isSuccess: true,
          isException: false,
          value: {
              communityId: '5f245386aa271e24b0c6fd88',
              description: '',
              headerDescription: 'Contenidos seleccionados cuidadosamente para usted.',
              headerTitle: 'Biblioteca',
              sections: [
                  {
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Lea sobre síntomas, causas, diagnósticos y mucho más.',
                              link: '/v2/library/content/5f88637a326b36caf11397ae',
                              thumbnail: '',
                              title: 'Descripción del cáncer de próstata',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              description: 'Obtenga información sobre las opciones de tratamiento para el cáncer de próstata.',
                              link: '/v2/library/content/5f88751e326b36caf117e5fe',
                              thumbnail: '',
                              title: 'Tratamientos',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          }
                      ],
                      description: '',
                      title: 'Temas',
                      type: 'List'
                  },
                  {
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/healthWise/videoTopic/abp6265',
                              thumbnail: 'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/abp6265.jpg',
                              title: 'Cáncer: cuando recibe la noticia',
                              type: 'HWVideo',
                              video: 'https://d20bb9v528piij.cloudfront.net/latest/en-us/abp6265/SD/E0/abp6265.mp4',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/library/content/5f804eeb326b36caf1bd8e25',
                              thumbnail: '',
                              title: 'Ver todos los videos',
                              type: 'HWBTNVideoList',
                              video: '',
                              id: ''
                          }
                      ],
                      description: 'Una colección de videos sobre cómo lidiar con los efectos sociales y emocionales del cáncer.',
                      title: 'Vivir con cáncer'
                  },
                  {
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Consejos para ayudar a una persona a bañarse, vestirse, afeitarse y mucho más.',
                              link: '/v2/library/content/5ff340cf77b01e2046c36a15',
                              thumbnail: '',
                              title: 'Higiene y baño',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Consejos para asistir a una persona que necesita ayuda para usar el excusado.',
                              link: '/v2/library/content/5ff33bb977b01e2046c36a14',
                              thumbnail: '',
                              title: 'Uso del excusado y cuidados en el baño',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Cómo ayudar a una persona que necesita ayuda física para moverse en el hogar.',
                              link: '/v2/library/content/5ff3450977b01e2046c36a16',
                              thumbnail: '',
                              title: 'Ayuda para el desplazamiento',
                              type: 'HWTopic',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: '',
                              link: '/v2/library/content/5ff3453577b01e2046c36a18',
                              thumbnail: '',
                              title: 'Ver todos los recursos para cuidadores',
                              type: 'HWBTNCaregiverList',
                              video: '',
                              id: ''
                          }
                      ],
                      description: 'Cuidar a un ser querido puede ser muy gratificante y también exigente. Los siguientes son recursos para ayudarlo a cuidarse a usted mismo mientras cuida a su ser querido.',
                      title: 'Recursos para cuidadores'
                  },
                  {
                      backgroundColor: '#F7F7F7',
                      content: [
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Descripciones de los diferentes tipos de médicos y otros profesionales médicos.',
                              link: '/v2/library/content/5f8ef847326b36caf106b9c6',
                              thumbnail: '',
                              title: 'Definiciones de especialidades médicas',
                              type: 'HWReference',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Sugerencias útiles para tratar síntomas y efectos secundarios de los tratamientos contra el cáncer.',
                              link: '/v2/library/content/5f907b60e48e5c8c0285c71d',
                              thumbnail: '',
                              title: 'Paquete de ayuda para el tratamiento de síntomas',
                              type: 'HWReference',
                              video: '',
                              id: ''
                          },
                          {
                              communityId: '',
                              contentId: '',
                              description: 'Qué es, cómo puede obtenerlo, cuánto cuesta y mucho más',
                              link: '/v2/library/content/5f88993b326b36caf120b3c5',
                              thumbnail: '',
                              title: 'Conceptos básicos del seguro médico',
                              type: 'HWReference',
                              video: '',
                              id: ''
                          }
                      ],
                      description: '',
                      title: 'Materiales de referencia'
                  }
              ],
              title: 'Cáncer de próstata',
              id: '5f88602c326b36caf1130516'
          }
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockLibrary.getLibraryContent.mockReturnValue(expRes);
    const data = await ctrl.getLibraryContent(
      '5f88602c326b36caf1130516',
      ''
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving a specific Library', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '83a7ca62-b343-8550-64f3-aee156535038',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.noIdDetail
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockValidation.isHex.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getLibraryContent(
      '5f88602c326b36caf1130516',
      'en'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error response for invalid library Id', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '908f5835-fa72-bc79-afdd-e28346bbf2f6',
            errorCode: 400,
            title: 'Bad data',
            detail: 'Library Id is not a 24 hex string'
          }
        ]
      }
    };
    RequestContext.getContextItem = mockRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(false);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getLibraryContent(
      '5f88602c326b36caf1130516',
      'en'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving a specific Library', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'bd01e356-937f-c40f-9b53-8f36795a940a',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.userIsNotInCommunity
          }
        ]
      }
    };
    RequestContext.getContextItem = mockNullRequestContext;
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockValidation.isHex.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes)
    const data = await ctrl.getLibraryContent(
      '5f88602c326b36caf1130516',
      'en'
    );
    expect(data).toEqual(expRes);
  });
});
