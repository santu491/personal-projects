import {
  mockResult,
  mockValidation
} from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { mockHealthwiseService } from '@anthem/communityapi/utils/mocks/mockHealthwise';
import { HealthwiseController } from '../healthWiseController';

describe('HealthWiseController', () => {
  let ctrl: HealthwiseController;

  beforeEach(() => {
    jest.clearAllMocks();
    ctrl = new HealthwiseController(
      <any>mockHealthwiseService,
      <any>mockResult,
      <any>mockValidation,
      <any>mockILogger
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //getTopic
  it('Should Return HealthWise Topic Based on ID in english', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: 'abw5499',
          version: '1',
          hash: '1',
          lang: 'enus',
          type: 'hwInfoConcept',
          title: {
            consumer: 'How do you get stronger muscles?'
          },
          legal: {
            logoUrl:
              'https://cdn.healthwise.net/common/images/hwlogo/hwlogo.png',
            copyrightText: {
              element: 'text',
              content:
                '© 1995-2021 Healthwise, Incorporated. Healthwise, Healthwise for every health decision, and the Healthwise logo are trademarks of Healthwise, Incorporated.'
            },
            disclaimerText: {
              element: 'text',
              content:
                'This information does not replace the advice of a doctor. Healthwise, Incorporated, disclaims any warranty or liability for your use of this information.'
            },
            termsOfUseUrl:
              'https://www.healthwise.org/specialpages/legal/terms.aspx',
            privacyPolicyUrl:
              'https://www.healthwise.org/specialpages/legal/privacy.aspx',
            moreInformationUrl: 'https://www.healthwise.org',
            toLearnMoreHtml: [
              {
                element: 'text',
                content: 'To learn more about Healthwise, visit'
              },
              {
                element: 'a',
                attributes: {
                  href: 'https://www.healthwise.org'
                },
                content: {
                  element: 'text',
                  content: 'Healthwise.org'
                }
              },
              {
                element: 'text',
                content: '.'
              }
            ],
            yourUseOfThisInformationHtml: [
              {
                element: 'text',
                content:
                  'Your use of this information means that you agree to the'
              },
              {
                element: 'a',
                attributes: {
                  href: 'https://www.healthwise.org/specialpages/legal/terms.aspx'
                },
                content: {
                  element: 'text',
                  content: 'Terms of Use'
                }
              },
              {
                element: 'text',
                content: ' and'
              },
              {
                element: 'a',
                attributes: {
                  href: 'https://www.healthwise.org/specialpages/legal/privacy.aspx'
                },
                content: {
                  element: 'text',
                  content: 'Privacy Policy'
                }
              },
              {
                element: 'text',
                content: '.'
              }
            ],
            html: {
              element: 'div',
              attributes: {
                hclass: 'HwLegal'
              },
              content: [
                {
                  element: 'div',
                  attributes: {
                    hclass: 'HwLogo'
                  },
                  content: {
                    element: 'img',
                    attributes: {
                      width: '112',
                      height: '46',
                      src: 'https://cdn.healthwise.net/common/images/hwlogo/hwlogo.png',
                      alt: ''
                    }
                  }
                },
                {
                  element: 'div',
                  attributes: {
                    hclass: 'HwDisclaimer'
                  },
                  content: {
                    element: 'p',
                    content: [
                      {
                        element: 'text',
                        content:
                          'This information does not replace the advice of a doctor. Healthwise, Incorporated, disclaims any warranty or liability for your use of this information. Your use of this information means that you agree to the'
                      },
                      {
                        element: 'a',
                        attributes: {
                          href: 'https://www.healthwise.org/specialpages/legal/terms.aspx'
                        },
                        content: {
                          element: 'text',
                          content: 'Terms of Use'
                        }
                      },
                      {
                        element: 'text',
                        content: ' and'
                      },
                      {
                        element: 'a',
                        attributes: {
                          href: 'https://www.healthwise.org/specialpages/legal/privacy.aspx'
                        },
                        content: {
                          element: 'text',
                          content: 'Privacy Policy'
                        }
                      },
                      {
                        element: 'text',
                        content: '.'
                      }
                    ]
                  }
                },
                {
                  element: 'div',
                  attributes: {
                    hclass: 'HwCopyright'
                  },
                  content: [
                    {
                      element: 'p',
                      attributes: {
                        hclass: 'HwCopyrightLink'
                      },
                      content: [
                        {
                          element: 'text',
                          content: 'To learn more about Healthwise, visit'
                        },
                        {
                          element: 'a',
                          attributes: {
                            href: 'https://www.healthwise.org'
                          },
                          content: {
                            element: 'text',
                            content: 'Healthwise.org'
                          }
                        },
                        {
                          element: 'text',
                          content: '.'
                        }
                      ]
                    },
                    {
                      element: 'p',
                      content: {
                        element: 'text',
                        content:
                          '© 1995-2021 Healthwise, Incorporated. Healthwise, Healthwise for every health decision, and the Healthwise logo are trademarks of Healthwise, Incorporated.'
                      }
                    }
                  ]
                }
              ]
            }
          },
          navigable: false,
          credits: {
            author: {
              name: 'Healthwise Staff'
            },
            primaryReviewers: [
              {
                name: 'Adam Husney MD - Family Medicine, E. Gregory Thompson MD - Internal Medicine, Kathleen Romito MD - Family Medicine, Heather Chambliss PhD - Exercise Science'
              }
            ]
          },
          html: [
            {
              element: '_comment'
            },
            {
              element: 'hwinfoconcept',
              attributes: {
                lang: 'en-US',
                id: 'F40F9F13-69C4-4F34-A509-CB105FE48233',
                hclass:
                  '- topic/topic concept/concept hwInfoConcept/hwInfoConcept '
              },
              content: [
                {
                  element: 'title',
                  attributes: {
                    hclass: '- topic/title '
                  },
                  content: {
                    element: 'text',
                    content: 'How do you get stronger muscles?'
                  }
                },
                {
                  element: 'prolog',
                  attributes: {
                    hclass: '- topic/prolog '
                  },
                  content: [
                    {
                      element: 'metadata',
                      attributes: {
                        hclass: '- topic/metadata '
                      },
                      content: [
                        {
                          element: 'othermeta',
                          attributes: {
                            name: 'readingLevel',
                            content: '6.9',
                            hclass: '- topic/othermeta '
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  element: 'hwinfoconceptbody',
                  attributes: {
                    hclass:
                      '- topic/body concept/conbody hwInfoConcept/hwInfoConceptBody '
                  },
                  content: [
                    {
                      element: 'section',
                      attributes: {
                        id: '7CCA7DD8-1AF3-4918-9700-40C002D26E9A',
                        hclass: '- topic/section '
                      },
                      content: [
                        {
                          element: 'p',
                          attributes: {
                            hclass: '- topic/p '
                          },
                          content: {
                            element: 'text',
                            content:
                              'Muscles get stronger when they are used regularly, but especially when they have to work against something. This is called "resistance."'
                          }
                        },
                        {
                          element: 'p',
                          attributes: {
                            hclass: '- topic/p '
                          },
                          content: {
                            element: 'text',
                            content:
                              'For example, you use your arm muscles when you bend your arm at the elbow. But when you do the same movement with something heavy in your hand, your arm muscles are working against more resistance.'
                          }
                        },
                        {
                          element: 'p',
                          attributes: {
                            hclass: '- topic/p '
                          },
                          content: {
                            element: 'text',
                            content:
                              '"Resistance training" means using things like weights, rubber tubing, or certain exercises to make your muscles stronger. It\'s a 3-step process:'
                          }
                        },
                        {
                          element: 'dl',
                          attributes: {
                            hclass: '- topic/dl '
                          },
                          content: [
                            {
                              element: 'dlentry',
                              attributes: {
                                hclass: '- topic/dlentry '
                              },
                              content: [
                                {
                                  element: 'dt',
                                  attributes: {
                                    hclass: '- topic/dt '
                                  },
                                  content: {
                                    element: 'text',
                                    content: 'Step 1: Stress.'
                                  }
                                },
                                {
                                  element: 'dd',
                                  attributes: {
                                    hclass: '- topic/dd '
                                  },
                                  content: [
                                    {
                                      element: 'p',
                                      attributes: {
                                        hclass: '- topic/p '
                                      },
                                      content: {
                                        element: 'text',
                                        content:
                                          'When you exercise against resistance, you stress your muscles slightly but not to the point of serious damage or injury.'
                                      }
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              element: 'dlentry',
                              attributes: {
                                hclass: '- topic/dlentry '
                              },
                              content: [
                                {
                                  element: 'dt',
                                  attributes: {
                                    hclass: '- topic/dt '
                                  },
                                  content: {
                                    element: 'text',
                                    content: 'Step 2: Recovery (rest).'
                                  }
                                },
                                {
                                  element: 'dd',
                                  attributes: {
                                    hclass: '- topic/dd '
                                  },
                                  content: [
                                    {
                                      element: 'p',
                                      attributes: {
                                        hclass: '- topic/p '
                                      },
                                      content: {
                                        element: 'text',
                                        content:
                                          'When you rest, your body rebuilds the muscles and the connective tissues between them (joints, tendons, and ligaments). This prepares them for the next time they will be stressed.'
                                      }
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              element: 'dlentry',
                              attributes: {
                                hclass: '- topic/dlentry '
                              },
                              content: [
                                {
                                  element: 'dt',
                                  attributes: {
                                    hclass: '- topic/dt '
                                  },
                                  content: {
                                    element: 'text',
                                    content: 'Step 3: Repeated stress.'
                                  }
                                },
                                {
                                  element: 'dd',
                                  attributes: {
                                    hclass: '- topic/dd '
                                  },
                                  content: [
                                    {
                                      element: 'p',
                                      attributes: {
                                        hclass: '- topic/p '
                                      },
                                      content: {
                                        element: 'text',
                                        content:
                                          'When you stress the same muscles again, the process is repeated. The muscles get stronger over time.'
                                      }
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        },
                        {
                          element: 'p',
                          attributes: {
                            hclass: '- topic/p '
                          },
                          content: {
                            element: 'text',
                            content:
                              'A resistance-training program to increase muscle fitness can include:'
                          }
                        },
                        {
                          element: 'ul',
                          attributes: {
                            id: 'UL_5EE57C4B0012469AAF0FB98524ED3701',
                            hclass: '- topic/ul '
                          },
                          content: [
                            {
                              element: 'li',
                              attributes: {
                                id: 'LI_37D257D908994ED5A08D5ED7F7057864',
                                hclass: '- topic/li '
                              },
                              content: [
                                {
                                  element: 'text',
                                  content:
                                    'Basic muscle-conditioning exercises such as push-ups,'
                                },
                                {
                                  element: 'xref',
                                  attributes: {
                                    href: 'GUID-E43644D9-E5D9-5E76-BA5F-201B812A0D51',
                                    hclass: '- topic/xref '
                                  },
                                  content: {
                                    element: 'text',
                                    content: 'leg lifts'
                                  }
                                },
                                {
                                  element: 'text',
                                  content: ', and other common exercises.'
                                }
                              ]
                            },
                            {
                              element: 'li',
                              attributes: {
                                id: 'LI_A097E5802D9347EFAA6599A47A0989B0',
                                hclass: '- topic/li '
                              },
                              content: {
                                element: 'text',
                                content:
                                  'Resistance training with rubber tubing or stretchable bands.'
                              }
                            },
                            {
                              element: 'li',
                              attributes: {
                                id: 'LI_BE77056F9E4F4A30BA6F5E0B7F55E7C3',
                                hclass: '- topic/li '
                              },
                              content: {
                                element: 'text',
                                content:
                                  ' Weight training with free weights ("dumbbells") or weight-training equipment.'
                              }
                            },
                            {
                              element: 'li',
                              attributes: {
                                id: 'LI_5E214E3D9002493E93A5287CEFAF3C23',
                                hclass: '- topic/li '
                              },
                              content: {
                                element: 'text',
                                content:
                                  'Doing heavy housework and yard work on a regular basis. This may include scrubbing the bathtub, washing walls, tilling the garden, or pulling weeds.'
                              }
                            },
                            {
                              element: 'li',
                              attributes: {
                                id: 'LI_C03A00860CCF4AF59476DFFD71E4EA20',
                                hclass: '- topic/li '
                              },
                              content: {
                                element: 'text',
                                content:
                                  ' Strengthening the muscles of your trunk (core). This helps you have better posture and balance. It can help protect you from injury.'
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          taxonomy: [
            {
              aspect: {
                id: 'howDone',
                label: "how it's done",
                href: null
              },
              concept: {
                id: 'HWCV_04339',
                label: 'Strength Training',
                href: null
              }
            }
          ],
          aspect: "how it's done [howDone]",
          detailLevel: 'FullDetail',
          associatedTopics: {
            alternateDetailLevels: [
              {
                href: 'https://content.healthwise.net/topics/abw5501/enus',
                id: 'abw5501',
                lang: 'enus',
                type: 'hwInfoConcept',
                title: {
                  consumer: 'How do you get stronger muscles?'
                },
                detailLevel: 'MainPoint'
              },
              {
                href: 'https://content.healthwise.net/topics/abw5500/enus',
                id: 'abw5500',
                lang: 'enus',
                type: 'hwInfoConcept',
                title: {
                  consumer: 'How do you get stronger muscles?'
                },
                detailLevel: 'Summary'
              }
            ]
          },
          hwid: 'abw5499',
          audience: 'Patient',
          behaviorChange: 'Awareness; Course'
        }
      }
    };

    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockHealthwiseService.getTopic.mockReturnValue(expRes);
    const data = await ctrl.getTopic('abw5499', null);
    expect(data).toEqual(expRes);
  });

  it('Should Return HealthWise Video Topic Based on video ID', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: true,
        exception: {
          httpCode: 404,
          message: {
            status: 404,
            versioning: { 'X-HW-Version': '2' },
            links: {
              self: 'https://content.healthwise.net/topics/abu3/en-us?contentOutput=json'
            },
            schema:
              'https://content.healthwise.net/spec/schema.healthwise.api.error.json',
            error: { message: 'Document abu3 Not Found' }
          }
        }
      }
    };

    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getTopic('abu3814', 'en');
    expect(data).toEqual(expRes);
  });

  it('Should Return return error for invalid video ID', async () => {
    mockValidation.isNullOrWhiteSpace.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getTopic('abu3', 'en');
  });

  //getVideoTopic
  it('Should Return a HealthWise Video Topic', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: 'abp7324',
          version: '1',
          hash: '1'
        }
      }
    };

    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(false);
    mockHealthwiseService.getVideoTopic.mockResolvedValue(expRes);
    const data = await ctrl.getVideoTopic('abt2669', null);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for a HealthWise Video Topic', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Incorrect id',
            detail: 'This is not a valid id'
          }
        ]
      }
    };

    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(true);
    mockResult.createError.mockReturnValue(expRes);

    mockHealthwiseService.getVideoTopic.mockResolvedValue(expRes);
    const data = await ctrl.getVideoTopic('abt2669', null);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for a HealthWise Video Topic', async () => {
    mockValidation.isNullOrWhiteSpace.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getVideoTopic('abt2669', null);
  });

  // getArticleTopicByTopicId
  it('Should Return success with response for topicId', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          topicId: 'abu3814',
          type: 'hwInfoConcept',
          navigable: false,
          title: 'self-care overview',
          subTitle: 'How can you care for your child who is overweight?',
          html: [],
          taxonomy: [],
          aspect: 'self-care overview [selfCareTxOptions]',
          detailLevel: 'FullDetail',
          hwid: 'abu3814',
          audience: 'Parent'
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockHealthwiseService.getArticleTopicByTopicId.mockReturnValue(expRes);
    const data = await ctrl.getArticleTopicByTopicId(
      'abu3814',
      null
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return error with response for invalid topicId', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'e5206e70-db01-4209-0b62-b89908cec770',
            errorCode: 400,
            title: 'HealthWise API error',
            detail:
              'There has been an error obtaining a response from HealthWise service.'
          }
        ]
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getArticleTopicByTopicId(
      'abu',
      'en'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for a HealthWise Video Topic', async () => {
    mockValidation.isNullOrWhiteSpace.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getArticleTopicByTopicId('abp7324', null);
  });

  //getArticleTopic
  it('Should Return success with response for conceptId and aspectId', async () => {
    mockValidation.isNullOrWhiteSpace.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getArticleTopic(
      'HWCV_05501',
      'selfCareTxOptions',
      'FullDetail',
      'en'
    );
  });

  it('Should Return a HealthWise Article Topic', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          detailLevel: 'Summary',
          audience: 'Patient',
          behaviorChange: 'Awareness; Course',
          id: 'acd8859',
          version: '2',
          hash: '2',
          lang: 'enus',
          type: 'hwInfoConcept',
          title: {
            consumer: 'How is medicine used to treat type 2 diabetes?'
          },
          legal: {
            logoUrl:
              'https://cdn.healthwise.net/common/images/hwlogo/hwlogo.png',
            copyrightText: {
              element: 'text',
              content:
                '© 1995-2021 Healthwise, Incorporated. Healthwise, Healthwise for every health decision, and the Healthwise logo are trademarks of Healthwise, Incorporated.'
            },
            disclaimerText: {
              element: 'text',
              content:
                'This information does not replace the advice of a doctor. Healthwise, Incorporated, disclaims any warranty or liability for your use of this information.'
            },
            termsOfUseUrl:
              'https://www.healthwise.org/specialpages/legal/terms.aspx',
            privacyPolicyUrl:
              'https://www.healthwise.org/specialpages/legal/privacy.aspx',
            moreInformationUrl: 'https://www.healthwise.org',
            html: {
              element: 'div',
              attributes: {
                hclass: 'HwLegal'
              },
              content: [
                {
                  element: 'div',
                  attributes: {
                    hclass: 'HwLogo'
                  },
                  content: {
                    element: 'img',
                    attributes: {
                      width: '112',
                      height: '46',
                      src: 'https://cdn.healthwise.net/common/images/hwlogo/hwlogo.png',
                      alt: ''
                    }
                  }
                },
                {
                  element: 'div',
                  attributes: {
                    hclass: 'HwDisclaimer'
                  },
                  content: {
                    element: 'p',
                    content: [
                      {
                        element: 'text',
                        content:
                          'This information does not replace the advice of a doctor. Healthwise, Incorporated, disclaims any warranty or liability for your use of this information. Your use of this information means that you agree to the'
                      },
                      {
                        element: 'a',
                        attributes: {
                          href: 'https://www.healthwise.org/specialpages/legal/terms.aspx'
                        },
                        content: {
                          element: 'text',
                          content: 'Terms of Use'
                        }
                      },
                      {
                        element: 'text',
                        content: ' and'
                      },
                      {
                        element: 'a',
                        attributes: {
                          href: 'https://www.healthwise.org/specialpages/legal/privacy.aspx'
                        },
                        content: {
                          element: 'text',
                          content: 'Privacy Policy'
                        }
                      },
                      {
                        element: 'text',
                        content: '.'
                      }
                    ]
                  }
                },
                {
                  element: 'div',
                  attributes: {
                    hclass: 'HwCopyright'
                  },
                  content: [
                    {
                      element: 'p',
                      attributes: {
                        hclass: 'HwCopyrightLink'
                      },
                      content: [
                        {
                          element: 'text',
                          content: 'To learn more about Healthwise, visit'
                        },
                        {
                          element: 'a',
                          attributes: {
                            href: 'https://www.healthwise.org'
                          },
                          content: {
                            element: 'text',
                            content: 'Healthwise.org'
                          }
                        },
                        {
                          element: 'text',
                          content: '.'
                        }
                      ]
                    },
                    {
                      element: 'p',
                      content: {
                        element: 'text',
                        content:
                          '© 1995-2021 Healthwise, Incorporated. Healthwise, Healthwise for every health decision, and the Healthwise logo are trademarks of Healthwise, Incorporated.'
                      }
                    }
                  ]
                }
              ]
            }
          },
          navigable: false,
          credits: {
            author: {
              name: 'Healthwise Staff'
            },
            primaryReviewers: [
              {
                name: 'Adam Husney MD - Family Medicine, E. Gregory Thompson MD - Internal Medicine, Kathleen Romito MD - Family Medicine, David C.W. Lau MD, PhD, FRCPC - Endocrinology, Martin J. Gabica MD - Family Medicine'
              }
            ]
          },
          taxonomy: [
            {
              aspect: {
                id: 'medicationTx',
                label: 'medication treatment',
                href: null
              },
              concept: {
                id: 'HWCV_20447',
                label: 'Diabetes Type 2',
                href: null
              }
            }
          ],
          aspect: 'medication treatment [medicationTx]',
          hwid: 'acd8859',
          html: [
            {
              element: 'hwinfoconcept',
              attributes: {
                lang: 'en-US',
                id: 'A9222E3B-2C6B-41A2-A934-DD5565B7F7A1',
                hclass:
                  '- topic/topic concept/concept hwInfoConcept/hwInfoConcept '
              },
              content: [
                {
                  element: 'title',
                  attributes: {
                    hclass: '- topic/title '
                  },
                  content: {
                    element: 'text',
                    content: 'How is medicine used to treat type 2 diabetes?'
                  }
                },
                {
                  element: 'prolog',
                  attributes: {
                    hclass: '- topic/prolog '
                  },
                  content: [
                    {
                      element: 'metadata',
                      attributes: {
                        hclass: '- topic/metadata '
                      },
                      content: [
                        {
                          element: 'othermeta',
                          attributes: {
                            name: 'readingLevel',
                            content: '9.5',
                            hclass: '- topic/othermeta '
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  element: 'hwinfoconceptbody',
                  attributes: {
                    hclass:
                      '- topic/body concept/conbody hwInfoConcept/hwInfoConceptBody '
                  },
                  content: [
                    {
                      element: 'section',
                      attributes: {
                        id: '52CC6D47-7C3D-43C1-AD0E-4ECF03D452F5',
                        hclass: '- topic/section '
                      },
                      content: [
                        {
                          element: 'p',
                          attributes: {
                            hclass: '- topic/p '
                          },
                          content: {
                            element: 'text',
                            content:
                              ' Some people with type 2 diabetes need medicines to help their bodies make insulin, decrease insulin resistance, or slow down how quickly their bodies absorb carbohydrates. Medicines that may be prescribed include:'
                          }
                        },
                        {
                          element: 'dl',
                          attributes: {
                            hclass: '- topic/dl '
                          },
                          content: [
                            {
                              element: 'dlentry',
                              attributes: {
                                hclass: '- topic/dlentry '
                              },
                              content: [
                                {
                                  element: 'dt',
                                  attributes: {
                                    hclass: '- topic/dt '
                                  },
                                  content: {
                                    element: 'text',
                                    content: 'Noninsulin medicines.'
                                  }
                                },
                                {
                                  element: 'dd',
                                  attributes: {
                                    hclass: '- topic/dd '
                                  },
                                  content: [
                                    {
                                      element: 'ul',
                                      attributes: {
                                        id: 'UL_BD5B3FE2E41A414CAB0C308A941006F6',
                                        hclass: '- topic/ul '
                                      },
                                      content: [
                                        {
                                          element: 'li',
                                          attributes: {
                                            id: 'LI_553E1D3B06B4421297F0B1E372CC2CBC',
                                            hclass: '- topic/li '
                                          },
                                          content: {
                                            element: 'text',
                                            content:
                                              'Ones that you take as pills include metformin, canagliflozin, glipizide, linagliptin, and pioglitazone.'
                                          }
                                        },
                                        {
                                          element: 'li',
                                          attributes: {
                                            id: 'LI_B1A0B5D20399475793F7341E9BFE1697',
                                            hclass: '- topic/li '
                                          },
                                          content: {
                                            element: 'text',
                                            content:
                                              'Ones that you take as shots include dulaglutide, exenatide, and liraglutide.'
                                          }
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            },
                            {
                              element: 'dlentry',
                              attributes: {
                                hclass: '- topic/dlentry '
                              },
                              content: [
                                {
                                  element: 'dt',
                                  attributes: {
                                    hclass: '- topic/dt '
                                  },
                                  content: {
                                    element: 'text',
                                    content: 'Insulin.'
                                  }
                                },
                                {
                                  element: 'dd',
                                  attributes: {
                                    hclass: '- topic/dd '
                                  },
                                  content: [
                                    {
                                      element: 'p',
                                      attributes: {
                                        hclass: '- topic/p '
                                      },
                                      content: [
                                        {
                                          element: 'text',
                                          content:
                                            'You can take insulin as a shot (injection), as a nasal spray, or through an'
                                        },
                                        {
                                          element: 'xref',
                                          attributes: {
                                            href: 'GUID-2EAC68F3-162B-52CE-89A4-13C2A308146F',
                                            hclass: '- topic/xref '
                                          },
                                          content: {
                                            element: 'text',
                                            content: 'insulin pump'
                                          }
                                        },
                                        {
                                          element: 'text',
                                          content:
                                            '. Most people who take it use a combination of short-acting and long-acting insulin. This helps keep blood sugar within the target range.'
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockHealthwiseService.getArticleTopic.mockReturnValue(expRes);
    const data = await ctrl.getArticleTopic(
      'HWCV_20447',
      'medicationTx',
      'Summary',
      null
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for a HealthWise Article Topic', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '360f9591-37d1-5baf-76e3-aabf28f95ef9',
            errorCode: 400,
            title: 'Incorrect id',
            detail: 'This is not a valid id'
          }
        ]
      }
    };

    mockValidation.isNullOrWhiteSpace.mockReturnValueOnce(true);
    mockResult.createError.mockReturnValue(expRes);

    mockHealthwiseService.getArticleTopic.mockResolvedValue(expRes);
    const data = await ctrl.getArticleTopic(
      'HWCV_20447',
      'medicationTx',
      'Summary',
      null
    );
    expect(data).toEqual(expRes);
  });

  // getArticleById
  it('Should Return success with response for articleId', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          topicId: 'abu3814',
          type: 'hwInfoConcept',
          navigable: false,
          title: 'self-care overview',
          subTitle: 'How can you care for your child who is overweight?',
          html: [],
          taxonomy: [],
          aspect: 'self-care overview [selfCareTxOptions]',
          detailLevel: 'FullDetail',
          hwid: 'abu3814',
          audience: 'Parent'
        }
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(false);
    mockHealthwiseService.getArticleById.mockReturnValue(expRes);
    const data = await ctrl.getArticleById(
      'abu3814',
      null
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return error with response for invalid articleId', async () => {
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: 'e5206e70-db01-4209-0b62-b89908cec770',
            errorCode: 400,
            title: 'HealthWise API error',
            detail:
              'There has been an error obtaining a response from HealthWise service.'
          }
        ]
      }
    };
    mockValidation.isNullOrWhiteSpace.mockReturnValue(true);
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.getArticleById(
      'abu',
      'en'
    );
    expect(data).toEqual(expRes);
  });

  it('Should Return Error for a HealthWise Video Topic', async () => {
    mockValidation.isNullOrWhiteSpace.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getArticleById('abp7324', null);
  });

  // getContent
  it('Should Return content', async () => {
    mockHealthwiseService.getContent.mockImplementation(() => {
      throw new Error()
    });
    mockResult.createException.mockReturnValue(true);
    await ctrl.getContent('abp7324');
  });

  it('Should Return content', async () => {
    mockHealthwiseService.getContent.mockReturnValue(true);
    await ctrl.getContent('abp7324');
  });
});
