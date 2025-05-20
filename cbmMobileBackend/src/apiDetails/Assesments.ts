import {RESPONSE} from '../utils/responseUtil';
import {OpenAPIParam} from 'routing-controllers-openapi';

export const CreateAssessmentSpec: OpenAPIParam = {
  summary: 'Create an assessment',
  description: 'Generates an assessment URL for the member.',
  responses: {...RESPONSE},
  parameters: [
    {
      name: 'source',
      in: 'header',
      schema: {type: 'string'},
      required: true,
      description: 'The source of the assessment.',
    },
    {
      name: 'secureToken',
      in: 'cookie',
      schema: {type: 'string'},
      required: true,
      description: 'The secure token for authentication.',
    },
    {
      name: 'clientName',
      in: 'header',
      schema: {type: 'string'},
      required: true,
      description: 'The name of the client.',
    },
  ],
};

export const GetMemberSurveySpec: OpenAPIParam = {
  description: 'Get the assessment required status for the user',
  responses: {...RESPONSE},
  requestBody: {
    description: 'Assessment request object',
    required: true,
    content: {
      'application/json': {
        example: {
          iamguid: '1234',
          surveyId: '1234',
          calibrateHostName: 'calibrateHostName',
          domainName: 'domainName',
          assistantPhoneNumber: '1234',
          bannerText: [
            {
              text: 'text',
              value: 'value',
            },
          ],
        },
      },
    },
  },
  parameters: [
    {
      name: 'secureToken',
      in: 'cookie',
      schema: {type: 'string'},
      required: true,
      description: 'The secure token for authentication.',
    },
  ],
};
