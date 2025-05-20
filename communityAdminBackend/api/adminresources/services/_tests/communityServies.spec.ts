import { API_RESPONSE } from '@anthem/communityadminapi/common';
import { mockContentService, mockMongo, mockResult } from '@anthem/communityadminapi/common/baseTest';
import { mockILogger } from '@anthem/communityadminapi/logger/mocks/mockILogger';
import { Community, CommunityModel } from 'api/adminresources/models/communitiesModel';
import { ObjectID } from 'mongodb';
import { CommunityService } from '../communityServies';

describe('CommunityService', () => {
  let service: CommunityService;

  beforeEach(() => {
    service = new CommunityService(<any>mockMongo, <any>mockResult, <any>mockContentService, <any>mockILogger)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('Should Return Community after creation: Success', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          data: {
            isSuccess: true,
            isException: false,
            value: {
              'createdBy': '61b21e9c26dbb012b69cf67e',
              'createdDate': new Date(),
              'title': 'Test',
              'color': '#D30CA7',
              'category': 'Cancer',
              'categoryId': '5f8759cf54fdb7a2c9ae9d0e',
              'type': 'clinical',
            }
          }
        }
      }
    };

    const payload: CommunityModel = {
      'title': 'Test',
      'category': 'Cancer',
      'color': '#D30CA7',
      'type': 'clinical',
      displayName: {
        'en': 'Cancer',
        'es': 'Cncer'
      },
      isNew: false,
      active: false,
      image: '',
      id: '',
      updatedDate: undefined,
      updatedBy: ''
    }

    const community: Community = {
      'createdBy': '61b21e9c26dbb012b69cf67e',
      'createdDate': new Date(),
      'title': 'Test',
      'color': '#D30CA7',
      'category': 'Cancer',
      'categoryId': '5f8759cf54fdb7a2c9ae9d0e',
      'type': 'clinical',
      'id': new ObjectID().toString(),
      displayName: {
        'en': 'Test',
        'es': 'Test'
      },
      isNew: false,
      active: false,
      image: '',
      parent: '',
      updatedDate: undefined,
      updatedBy: ''
    };

    const adminUser = {
      "username": "az00001",
      "role": "scadmin",
      "firstName": "Admin",
      "lastName": "SydCom",
      "displayName": "Sydney Community",
      "displayTitle": "",
      "profileImage": "",
      "createdAt": "2021-12-09T15:19:56.426Z",
      "updatedAt": "2022-01-24T09:09:09.741Z",
      "aboutMe": "Very boaring person.",
      "interests": "Publish posts.",
      "location": "Africa",
      "password": "password",
      "id": "61b21e9c26dbb012b69cf67e"
    }

    mockMongo.insertValue.mockReturnValue(community);
    mockResult.createSuccess.mockReturnValue(expRes);

    const data = await service.createCommunity(payload, adminUser);
    expect(data).toEqual(expRes);
  });

  it('Should Return Community after creation: Exception', async () => {
    const payload: CommunityModel = {
      'title': 'Test',
      'category': 'Cancer',
      'color': '#D30CA7',
      'type': 'clinical',
      'displayName': {
        'en': 'Cancer',
        'es': 'Cncer'
      },
      isNew: false,
      active: false,
      image: '',
      id: '',
      updatedDate: undefined,
      updatedBy: ''
    }

    const adminUser = {
      "username": "az00001",
      "role": "scadmin",
      "firstName": "Admin",
      "lastName": "SydCom",
      "displayName": "Sydney Community",
      "displayTitle": "",
      "profileImage": "",
      "createdAt": "2021-12-09T15:19:56.426Z",
      "updatedAt": "2022-01-24T09:09:09.741Z",
      "aboutMe": "Very boaring person.",
      "interests": "Publish posts.",
      "location": "Africa",
      "password": "password",
      "id": "61b21e9c26dbb012b69cf67e"
    }

    mockMongo.insertValue.mockImplementation(() => {
      throw new Error();
    });
    await service.createCommunity(payload, adminUser);
  });

  it('Should get community based on the ID: Success', async () => {
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Diabetes",
            "category": "Diabetes",
            "categoryId": "607e7c92d0a2b533bb2ae3d1",
            "color": "#286CE2",
            "type": "clinical",
            "parent": "Diabetes",
            "createdDate": "2021-04-20T07:02:42.587Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.413Z",
            "updatedAt": "2021-08-10T11:23:36.413Z",
            "displayName": {
              "en": "Diabetes",
              "es": "Diabetes"
            },
            "id": "607e7c99d0a2b533bb2ae3d2"
          }
        ]
      }
    };

    const community = {
      "createdBy": "5f99844130b711000703cd74",
      "title": "Diabetes",
      "category": "Diabetes",
      "categoryId": "607e7c92d0a2b533bb2ae3d1",
      "color": "#286CE2",
      "type": "clinical",
      "parent": "Diabetes",
      "createdDate": "2021-04-20T07:02:42.587Z",
      "__v": 0,
      "createdAt": "2021-08-10T11:23:36.413Z",
      "updatedAt": "2021-08-10T11:23:36.413Z",
      "displayName": {
        "en": "Diabetes",
        "es": "Diabetes"
      },
      "id": "607e7c99d0a2b533bb2ae3d2"
    };

    mockMongo.readByID.mockReturnValue(community);
    mockResult.createSuccess.mockReturnValue(expRes);
    const resData = await service.getCommunityById("607e7c99d0a2b533bb2ae3d2");
    expect(resData).toEqual(expRes);
  });

  it('Should get community based on the ID: Failure', async () => {
    const expRes = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "value": [
          {
            id: 'd1904a20-47d3-e0d0-ed17-5a3cc4f1b59e',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.badData,
            detail: API_RESPONSE.messages.communityDoesNotExist
          }
        ]
      }
    };

    mockMongo.readByID.mockReturnValue(null);
    mockResult.createError.mockReturnValue(expRes);
    const resData = await service.getCommunityById("607e7c99d0a2b533bb2ae3d2");
    expect(resData).toEqual(expRes);
  });

  it('Should get community based on the ID: Exception', async () => {
    const community = {
      "createdBy": "5f99844130b711000703cd74",
      "title": "Diabetes",
      "category": "Diabetes",
      "categoryId": "607e7c92d0a2b533bb2ae3d1",
      "color": "#286CE2",
      "type": "clinical",
      "parent": "Diabetes",
      "createdDate": "2021-04-20T07:02:42.587Z",
      "__v": 0,
      "createdAt": "2021-08-10T11:23:36.413Z",
      "updatedAt": "2021-08-10T11:23:36.413Z",
      "displayName": {
        "en": "Diabetes",
        "es": "Diabetes"
      },
      "id": "607e7c99d0a2b533bb2ae3d2"
    };
    mockMongo.readByID.mockReturnValue(community);
    mockResult.createSuccess.mockImplementation(() => {
      throw new Error();
    })
    await service.getCommunityById("607e7c99d0a2b533bb2ae3d2");
  });

  it('Should return group of communities: Success', async () => {
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Diabetes",
            "category": "Diabetes",
            "categoryId": "607e7c92d0a2b533bb2ae3d1",
            "color": "#286CE2",
            "type": "clinical",
            "parent": "Diabetes",
            "createdDate": "2021-04-20T07:02:42.587Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.413Z",
            "updatedAt": "2021-08-10T11:23:36.413Z",
            "displayName": {
              "en": "Diabetes",
              "es": "Diabetes"
            },
            "id": "607e7c99d0a2b533bb2ae3d2"
          },
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Weight Management",
            "category": "Weight Management",
            "categoryId": "60a3589d9c336e882b19bbef",
            "color": "#286CE2",
            "type": "non-clinical",
            "parent": "Weight Management",
            "createdDate": "2021-05-18T06:03:32.976Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.414Z",
            "updatedAt": "2021-08-10T11:23:36.414Z",
            "displayName": {
              "en": "Weight Management",
              "es": "Control de peso"
            },
            "id": "60a358bc9c336e882b19bbf0"
          },
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Parenting",
            "category": "Parenting",
            "categoryId": "60ed47c4fd042c828fca117e",
            "color": "#286CE2",
            "type": "non-clinical",
            "parent": "Parenting",
            "createdDate": "2021-07-05T11:03:22.835Z",
            "__v": 0,
            "createdAt": "2021-08-10T11:23:36.414Z",
            "updatedAt": "2021-08-10T11:23:36.414Z",
            "displayName": {
              "en": "Parenting",
              "es": "Crianza"
            },
            "id": "60e2e7277c37b43a668a32f2"
          },
          {
            "createdBy": "5f99844130b711000703cd74",
            "title": "Cancer",
            "category": "Cancer",
            "categoryId": "5f8759dc54fdb7a2c9ae9d0f",
            "color": "#286CE2",
            "type": "non-clinical",
            "parent": "Cancer",
            "createdDate": "2022-01-24T09:01:01.395Z",
            "__v": 0,
            "createdAt": "2022-01-24T09:01:01.395Z",
            "updatedAt": "2022-01-24T09:01:01.395Z",
            "displayName": {
              "en": "Cancer",
              "es": "Cáncer"
            },
            "id": "61ee6acdc7422a3a7f484e3c"
          }
        ]
      }
    };

    const communities = [
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Diabetes",
        "category": "Diabetes",
        "categoryId": "607e7c92d0a2b533bb2ae3d1",
        "color": "#286CE2",
        "type": "clinical",
        "parent": "Diabetes",
        "createdDate": "2021-04-20T07:02:42.587Z",
        "__v": 0,
        "createdAt": "2021-08-10T11:23:36.413Z",
        "updatedAt": "2021-08-10T11:23:36.413Z",
        "displayName": {
          "en": "Diabetes",
          "es": "Diabetes"
        },
        "id": "607e7c99d0a2b533bb2ae3d2"
      },
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Weight Management",
        "category": "Weight Management",
        "categoryId": "60a3589d9c336e882b19bbef",
        "color": "#286CE2",
        "type": "non-clinical",
        "parent": "Weight Management",
        "createdDate": "2021-05-18T06:03:32.976Z",
        "__v": 0,
        "createdAt": "2021-08-10T11:23:36.414Z",
        "updatedAt": "2021-08-10T11:23:36.414Z",
        "displayName": {
          "en": "Weight Management",
          "es": "Control de peso"
        },
        "id": "60a358bc9c336e882b19bbf0"
      },
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Parenting",
        "category": "Parenting",
        "categoryId": "60ed47c4fd042c828fca117e",
        "color": "#286CE2",
        "type": "non-clinical",
        "parent": "Parenting",
        "createdDate": "2021-07-05T11:03:22.835Z",
        "__v": 0,
        "createdAt": "2021-08-10T11:23:36.414Z",
        "updatedAt": "2021-08-10T11:23:36.414Z",
        "displayName": {
          "en": "Parenting",
          "es": "Crianza"
        },
        "id": "60e2e7277c37b43a668a32f2"
      },
      {
        "createdBy": "5f99844130b711000703cd74",
        "title": "Cancer",
        "category": "Cancer",
        "categoryId": "5f8759dc54fdb7a2c9ae9d0f",
        "color": "#286CE2",
        "type": "non-clinical",
        "parent": "Cancer",
        "createdDate": "2022-01-24T09:01:01.395Z",
        "__v": 0,
        "createdAt": "2022-01-24T09:01:01.395Z",
        "updatedAt": "2022-01-24T09:01:01.395Z",
        "displayName": {
          "en": "Cancer",
          "es": "Cáncer"
        },
        "id": "61ee6acdc7422a3a7f484e3c"
      }
    ];

    const pageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    }

    mockMongo.readAllByValue.mockReturnValue(communities);
    mockResult.createSuccess.mockReturnValue(expRes);
    await service.getAllCommunities(pageParam, true, true);
  });

  it('Should return group of communities: Exception', async () => {
    const pageParam = {
      pageNumber: 1,
      pageSize: 10,
      sort: 1
    }
    mockMongo.readAllByValue.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getAllCommunities(pageParam, true, true);
  });

  it('Should return group of sub communities: Exception', async () => {
    mockMongo.readAll.mockImplementationOnce(() => {
      throw new Error();
    });
    await service.getSubCommunities('6214e8959aa982c0d09b40f5');
  });


  it('Should return group of sub communities: Error', async () => {
    const expRes = {
      "data": {
        "isSuccess": false,
        "isException": false,
        "errors": [
          {
            "id": "0ffe1ed5-c3e4-bec1-ad2a-bb90e6a2a9e5",
            "errorCode": 400,
            "title": "Bad data",
            "detail": "Community Not found with the ID"
          }
        ]
      }
    };
    const version = [
      {
        ios: "1.6.6",
        android: "1.6.6",
        content: {
          public: "2.2.10",
          generic: "2.2.6",
          helpfulInfo: "2.1.2",
          prompts: "2.0.0",
        },
        tou: "2.0",
        __v: 0,
        createdAt: {
        },
        updatedAt: {
        },
        updatedBy: "6273db0afb9987001ddaa4f6",
        demoUserAccess: true,
        id: "601c1c415c474da1053b976b",
      },
    ];
    const content = [
      {
        language: "en",
        version: "2.0.0",
        contentType: "prompts",
        data: {
          createStoryModule: [
            {
              communityId: "60a358bc9c336e882b19bbf0",
              prompts: [
                {
                  promptId: "60a4d9d97f3ea0d2537e42ae",
                  question: "What were the biggest concerns?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "60a4d9e57f3ea0d2537e42af",
                  question: "What helped to decide it was time for a change?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            },
            {
              communityId: "60e2e7277c37b43a668a32f2",
              prompts: [
                {
                  promptId: "60e2e72a7c37b43a668a32fa",
                  question: "How many children do you have? How old are they?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "60e2e72a7c37b43a668a32fb",
                  question: "What's your top parenting concern today?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "60e2e72a7c37b43a668a32fc",
                  question: "What challenges have you faced as a parent? How did you overcome them?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            },
            {
              communityId: "607e7c99d0a2b533bb2ae3d2",
              prompts: [
                {
                  promptId: "607ed34c4b9db58c6e7ffa90",
                  question: "What was it like to learn the diagnosis?",
                  sectionTitle: "Initial Diagnosis",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "607ed72f4b9db58c6e7ffa91",
                  question: "What kind of information/education were you provided?",
                  sectionTitle: "Information Provided",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "607ed7434b9db58c6e7ffa92",
                  question: "How did you think it would change your life?",
                  sectionTitle: "Figuring it Out",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            },
            {
              communityId: "6214e8959aa982c0d09b40f5",
              prompts: [
                {
                  promptId: "6215088617e4506761d18e61",
                  question: "What type of cancer was diagnosed?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                  options: [
                    {
                      id: "",
                      title: "Select One",
                      type: "select",
                    },
                    {
                      id: "5f0e744536b382377497ecef",
                      title: "Anal Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f0753f6c12e0c22d00f5d23",
                      title: "Breast Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f22db56a374bc4e80d80a9b",
                      title: "Male Breast Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f369ba97b79ea14f85fb0ec",
                      title: "Metastatic or Recurrent Breast Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f189ba00d5f552cf445b8c2",
                      title: "Colorectal Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f3d2eef5617cc2e401b8adf",
                      title: "Metastatic or Recurrent Colorectal Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f07537bc12e0c22d00f5d21",
                      title: "Lung Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f0753b7c12e0c22d00f5d22",
                      title: "Oral Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f245386aa271e24b0c6fd88",
                      title: "Prostate Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f245386aa271e24b0c6fd89",
                      title: "Advanced or Metastatic Prostate Cancer",
                      type: "cancer",
                    },
                    {
                      id: "6206698f6aa0f2002f172ee2",
                      title: "Other",
                      type: "otherCancer",
                    },
                  ],
                },
                {
                  promptId: "6215088617e4506761d18e62",
                  question: "Other diagnosis:",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                  otherCancer: true,
                },
                {
                  promptId: "5f9c4d39fdfbb52b2c86c98d",
                  question: "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
                  sectionTitle: "One Piece of Advice",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            }
          ]
        },
        updatedAt: "",
        createdAt: "",
        id: "6215088817e4506761d18e63",
      },
    ]
    mockMongo.readAll.mockReturnValue(version);
    mockMongo.readAllByValue.mockReturnValue(content);
    mockResult.createError.mockReturnValue(expRes);
    const res = await service.getSubCommunities('6214e8959ba982c0d09b40f5');
    expect(res).toEqual(expRes);
  });

  it('Should return group of sub communities: Success', async () => {
    const expRes = {
      "data": {
        "isSuccess": true,
        "isException": false,
        "value": [
          {
            "id": "",
            "title": "Select One",
            "type": "select"
          },
          {
            "id": "5f0e744536b382377497ecef",
            "title": "Anal Cancer",
            "type": "cancer"
          },
          {
            "id": "5f0753f6c12e0c22d00f5d23",
            "title": "Breast Cancer",
            "type": "cancer"
          },
          {
            "id": "5f22db56a374bc4e80d80a9b",
            "title": "Male Breast Cancer",
            "type": "cancer"
          },
          {
            "id": "5f369ba97b79ea14f85fb0ec",
            "title": "Metastatic or Recurrent Breast Cancer",
            "type": "cancer"
          },
          {
            "id": "5f189ba00d5f552cf445b8c2",
            "title": "Colorectal Cancer",
            "type": "cancer"
          },
          {
            "id": "5f3d2eef5617cc2e401b8adf",
            "title": "Metastatic or Recurrent Colorectal Cancer",
            "type": "cancer"
          },
          {
            "id": "5f07537bc12e0c22d00f5d21",
            "title": "Lung Cancer",
            "type": "cancer"
          },
          {
            "id": "5f0753b7c12e0c22d00f5d22",
            "title": "Oral Cancer",
            "type": "cancer"
          },
          {
            "id": "5f245386aa271e24b0c6fd88",
            "title": "Prostate Cancer",
            "type": "cancer"
          },
          {
            "id": "5f245386aa271e24b0c6fd89",
            "title": "Advanced or Metastatic Prostate Cancer",
            "type": "cancer"
          },
          {
            "id": "6206698f6aa0f2002f172ee2",
            "title": "Other",
            "type": "otherCancer"
          }
        ]
      }
    };
    const version = [
      {
        ios: "1.6.6",
        android: "1.6.6",
        content: {
          public: "2.2.10",
          generic: "2.2.6",
          helpfulInfo: "2.1.2",
          prompts: "2.0.0",
        },
        tou: "2.0",
        __v: 0,
        createdAt: {
        },
        updatedAt: {
        },
        updatedBy: "6273db0afb9987001ddaa4f6",
        demoUserAccess: true,
        id: "601c1c415c474da1053b976b",
      },
    ];
    const content = [
      {
        language: "en",
        version: "2.0.0",
        contentType: "prompts",
        data: {
          createStoryModule: [
            {
              communityId: "60a358bc9c336e882b19bbf0",
              prompts: [
                {
                  promptId: "60a4d9d97f3ea0d2537e42ae",
                  question: "What were the biggest concerns?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "60a4d9e57f3ea0d2537e42af",
                  question: "What helped to decide it was time for a change?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            },
            {
              communityId: "60e2e7277c37b43a668a32f2",
              prompts: [
                {
                  promptId: "60e2e72a7c37b43a668a32fa",
                  question: "How many children do you have? How old are they?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "60e2e72a7c37b43a668a32fb",
                  question: "What's your top parenting concern today?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "60e2e72a7c37b43a668a32fc",
                  question: "What challenges have you faced as a parent? How did you overcome them?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            },
            {
              communityId: "607e7c99d0a2b533bb2ae3d2",
              prompts: [
                {
                  promptId: "607ed34c4b9db58c6e7ffa90",
                  question: "What was it like to learn the diagnosis?",
                  sectionTitle: "Initial Diagnosis",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "607ed72f4b9db58c6e7ffa91",
                  question: "What kind of information/education were you provided?",
                  sectionTitle: "Information Provided",
                  helpText: "",
                  sensitiveContentText: "",
                },
                {
                  promptId: "607ed7434b9db58c6e7ffa92",
                  question: "How did you think it would change your life?",
                  sectionTitle: "Figuring it Out",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            },
            {
              communityId: "6214e8959aa982c0d09b40f5",
              prompts: [
                {
                  promptId: "6215088617e4506761d18e61",
                  question: "What type of cancer was diagnosed?",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                  options: [
                    {
                      id: "",
                      title: "Select One",
                      type: "select",
                    },
                    {
                      id: "5f0e744536b382377497ecef",
                      title: "Anal Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f0753f6c12e0c22d00f5d23",
                      title: "Breast Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f22db56a374bc4e80d80a9b",
                      title: "Male Breast Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f369ba97b79ea14f85fb0ec",
                      title: "Metastatic or Recurrent Breast Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f189ba00d5f552cf445b8c2",
                      title: "Colorectal Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f3d2eef5617cc2e401b8adf",
                      title: "Metastatic or Recurrent Colorectal Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f07537bc12e0c22d00f5d21",
                      title: "Lung Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f0753b7c12e0c22d00f5d22",
                      title: "Oral Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f245386aa271e24b0c6fd88",
                      title: "Prostate Cancer",
                      type: "cancer",
                    },
                    {
                      id: "5f245386aa271e24b0c6fd89",
                      title: "Advanced or Metastatic Prostate Cancer",
                      type: "cancer",
                    },
                    {
                      id: "6206698f6aa0f2002f172ee2",
                      title: "Other",
                      type: "otherCancer",
                    },
                  ],
                },
                {
                  promptId: "6215088617e4506761d18e62",
                  question: "Other diagnosis:",
                  sectionTitle: "",
                  helpText: "",
                  sensitiveContentText: "",
                  otherCancer: true,
                },
                {
                  promptId: "5f9c4d39fdfbb52b2c86c98d",
                  question: "If you could go back in time and give yourself one piece of advice about how to handle what you were about to experience, what would that advice be?",
                  sectionTitle: "One Piece of Advice",
                  helpText: "",
                  sensitiveContentText: "",
                }
              ]
            }
          ]
        },
        updatedAt: "",
        createdAt: "",
        id: "6215088817e4506761d18e63",
      },
    ]
    mockMongo.readAll.mockReturnValue(version);
    mockMongo.readAllByValue.mockReturnValue(content);
    mockResult.createSuccess.mockReturnValue(expRes);
    const res = await service.getSubCommunities('6214e8959aa982c0d09b40f5');
    expect(res).toEqual(expRes);
  });

  describe("getCommunityAdmins", async () => {
    it("success", async () => {
      mockMongo.readAllByValue.mockReturnValue([1]);
      mockResult.createSuccess.mockReturnValue(1);

      await service.getCommunityAdmins('communityId');
    });

    it("exception", async () => {
      mockMongo.readAllByValue.mockImplementation(() => {
        throw new Error()
      });
      mockResult.createException.mockReturnValue(1);

      await service.getCommunityAdmins('communityId');
    })
  })
});
