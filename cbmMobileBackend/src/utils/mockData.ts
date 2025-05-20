import {AppointmentRequest} from '../models/Appointment';
import {MemberOAuthPayload} from '../types/customRequest';
import {
  CreateUserRequest,
  UserProfileResponse,
} from '../types/eapMemberProfileModel';
import {ClinicalQuestionsRequest} from '../types/telehealthModel';
import {ConfigData, MemberAuthConfig} from './app';

export const mockedUserEmailNotVerified = {
  save: jest.fn().mockResolvedValue({}),
  comaparePassword: jest.fn().mockResolvedValue(true),
  email: 'test@example.com',
  status: 'email-not-verified',
  createdAt: new Date(),
  roles: ['USER', 'BH_USER'],
  otp: {
    code: '831300',
    issuedAt: new Date(),
    count: 1,
    attempts: 0,
  },
  readNotifications: [],
};

export const mockedUserWithoutEmail = {
  email: 'testonce@ex.com',
  status: 'email-verified',
  createdAt: new Date(),
  roles: ['USER', 'BH_USER'],
  readNotifications: [],
};

export const blockedUser = {
  email: 'testonce@ex.com',
  status: 'blocked',
  createdAt: new Date(),
  roles: ['USER', 'BH_USER'],
  readNotifications: [],
  otp: {
    code: '831300',
    issuedAt: new Date(),
    count: 1,
    attempts: 0,
  },
};

export const errorOTPUser = {
  save: jest.fn().mockResolvedValue({}),
  email: 'testonce@ex.com',
  status: 'blocked',
  createdAt: new Date(),
  roles: ['USER', 'BH_USER'],
  readNotifications: [],
  otp: {
    code: '831300',
    issuedAt: new Date(),
    count: 1,
    attempts: 6,
  },
};

export const mockedActivitiesData = {
  notificationId: '786120asiu',
  isNotificationSent: true,
  createdAt: new Date(),
  title: 'Title1',
  _id: new Date(),
};

export const eapMemberAuthConfigData: MemberAuthConfig = {
  eap: {
    host: 'https://sit.api.sydneymember.ps.awsdns.internal.das',
    basePath: {
      public: '/v1/eap/dfd/auth/public',
      secure: '/v1/eap/dfd/auth/secure',
      provider: '/provider',
    },
    apiKey: '50w713nadx9tmo4bh2lsz8rgfejv',
    dfdOrigin: 'dev2.anthemeap.com',
    accessToken: {
      url: '/v1/oauth/accesstoken',
      scope: 'public',
      grantType: 'client_credentials',
      authorization:
        'Basic c2VjdXJlYXV0aEFwcDI3NTpDQjQzQzRGNkIzQjFFRDY4QjkyNkU2RUY5RTdDMjk=',
      contentType: 'application/x-www-form-urlencoded',
    },
    clientSearch: '/v1/eap/dfd/clients?client={client}&searchData={searchData}',
    registerMember: '/{client}/mfaRegister',
    loginMember: '/mfaLogin',
    forgotUserName: '/user/mfaForgotUsername',
    disableAccount: '/member/disableProfile',
    checkDetails: '/user/mfaDetailsCheck',
    memberAccount: '/user/mfapwdchange',
    sendOtp: '/mfa/otp/send',
    validateOtp: '/mfa/otp/validate',
    contactDetails: '/mfa/getUserContact',
    rememberDevice: '/mfaRememberDevice?userName={userName}&bu={bu}',
    userLookup: '/userLookup',
    profileDetails: '/profileDetails',
    updateProfile: '/user/{client}/updateProfile',
    appointment: {
      assessmentRequired: 'assess',
      create: 'create',
      tabStatus: 'tabStatus',
      fetchById: 'fetchAppointment',
      update: 'updateAppointment',
      questionnaire: 'questions',
      memberStatus: 'memberStatus',
      memberDashboard: 'members/dashboard',
    },
    assessments: {
      calibrate: 'assessment',
    },
    provider: {
      addresses: '/addresses',
      geocode: '/geocode',
      providerList: '/providerslist',
      providerDetails: '/provider-details',
    },
    changeSecret: '/user/mfaPasswordChange',
    telehealth: {
      mdLiveAppointment: '/mdlive/appointment',
    },
    genesysChat: {
      init: '/chat/init',
      getData: '/chat/getData',
    },
  },
};

export const appConfig: ConfigData = {
  APP_VERSION: '',
  awsDetails: {
    profile: '',
    roleArn: '',
    roleSessionName: '',
    durationSeconds: 0,
    apiVersion: '',
    region: '',
    iosArn: '',
    notificationQueue: '',
  },
  clientConfiguration: {
    eap: {
      consumerHost: '',
      host: '',
      articles: '',
      cards: '',
      resources: '',
      clients: '',
    },
    mhsud: {
      consumerHost: '',
      host: '',
      clients: '',
      resources: '',
    },
  },
  smtpSettings: {
    sendEmail: false,
    smtpPort: 0,
    service: '',
    tlsVersion: '',
    smtpServer: '',
    fromEmail: '',
    fromEmailName: '',
    subject: '',
    smtpAuthUser: '',
    smtpAuthValue: '',
  },
  env: '',
  logLevel: '',
  credibleMindDetails: {
    monthlyResources: '',
    xApiKey: '',
    host: '',
    topics: '',
  },
  providerSearchDetails: {
    getAccessToken: '',
    sendEmail: '',
  },
  logger: {
    console: false,
    level: '',
  },
  memberAuth: eapMemberAuthConfigData,
  assessmentsSurvey: {
    link: 'link',
    calibrateHost: 'calibrate',
    domainName: 'domain',
  },
  JWT: '',
  database: {
    host: 'db-host',
    basePath: {
      secure: '/v1',
      public: '/public',
    },
    apikey: 'test-key',
  },
  encryption: {
    algorithm: '',
    salt: '',
  },
  security: {
    maskedFields: ['name'],
    encryptedFields: [],
    SMTP_TLS: '',
  },
};

export const mockEapMemberRegistrationRequest: CreateUserRequest = {
  employerType: 'BEACON',
  userRole: 'DFDMEMBER',
  firstName: 'Roshan',
  lastName: 'MATHEW',
  dob: '08/10/1993',
  gender: 'Female',
  relStatus: 'Widowed',
  empStatus: 'Full Time',
  jobTitle: 'Technical',
  userType: 'Household',
  emailAddress: 'testingreg1@example.com',
  address: {
    addressOne: 'mirrorgraphics',
    addressTwo: 'LA',
    city: 'Alexandria',
    state: 'Virginia',
    stateCode: 'AL',
    zipcode: '22301',
  },
  clientName: 'Company Demo',
  communication: {
    mobileNumber: '+14709082004',
    consent: true,
  },
  isMigrated: false,
  isTempPasswordChanged: false,
  isMobVerified: false,
  isEmailVerified: true,
  isQuickTutorialSkipped: false,
  departmentName: 'newDepartment',
  isPrivacyConsent: false,
  clientGroupId: 'DEMO1',
  isFrontDesk: false,
};
export const mockEapMemberAuthenticationRequest = {
  username: 'testuser',
  pdsw: 'password123',
};

export const mockAppointmentRequest: AppointmentRequest = {
  iamguid: 'bde6cd80-732e-4b7d-8434-31a5d32c4479',
  mrefNumber: 'MY2024-8507779',
  firstName: 'Swetha',
  lastName: 'M',
  dob: '01/02/2014',
  gender: 'Male',
  healthInsuranceCarrier: 'Aetna',
  email: 'swetha.manjunath@ust.com',
  phone: '+11475009431',
  communication: {
    addressOne: 'Address line 1',
    addressTwo: 'Address line 2',
    city: 'Cumming',
    state: 'Georgia',
    stateCode: 'GA',
    zipcode: '30042',
  },
  employerType: 'Beacon',
  groupId: 'DEMO1',
  planName: 'EAP',
  clientName: 'Company Demo',
  appointmentType: 'pf',
  memberOptedProvider: null,
  isTimingCustomized: true,
  memberPrefferedSlot: {
    days: ['Mon', 'Tues', 'Wed'],
    time: 'Early Evng',
  },
  selectedProviders: [
    {
      provDetailsId: 'ulHB8YgBm2eNttIRPfL8',
      providerId: '674378',
      beaconLocationId: 'E958211C',
      email: 'swetha.manjunath@elevancehealth.com',
      phone: '5715555555',
      name: 'DON HOLDER PHD',
      firstName: 'DON',
      lastName: 'HOLDER',
      title: 'PHD',
      addressOne: '1809 Triangle Rd Ste 604',
      addressTwo: 'SNG',
      city: 'Alexandria',
      state: 'VA',
      zip: '20147-6122',
      distance: '2.4',
      providerType: 'Practitioner',
      isMemberOpted: false,
      isInsuranceCarrierAccepted: false,
      providerPrefferedDateAndTime: null,
    },
  ],
  clinicalQuestions: {
    questionnaire: [
      {
        problemType: 'Family',
        problemTypeCode: 'CCC',
        presentingProblem: 'Adoption',
        presentingProblemCode: 'H07',
        answer: 'lmn',
        lessProductivedays: '10',
        jobMissedDays: '9',
      },
    ],
  },
};

export const mockUserDBData = {
  iamguid: 'bde6cd80-732e-4b7d-8434-31a5d32c4479',
  clientName: 'Company Demo',
  deviceInfo: [
    {
      deviceToken: 'token',
      platform: 'ios',
      appVersion: '0.0.1',
      osVersion: '17.3.1',
      locale: 'en-US',
      timeZoneOffset: -330,
      badge: 0,
    },
    {
      deviceToken: 'tokenabc',
      platform: 'android',
      appVersion: '0.0.1',
      osVersion: '17.3.1',
      locale: 'en-US',
      timeZoneOffset: -330,
      badge: 0,
    },
  ],
};

export const mockAllDBUserData = [
  {
    iamguid: 'bde5cd60-7321-4b7d-8434-31a5d32c5479',
    clientName: 'company-demo',
    deviceInfo: [
      {
        deviceToken: 'tokentest',
        platform: 'ios',
        appVersion: '0.0.1',
        osVersion: '17.3.1',
        locale: 'en-US',
        timeZoneOffset: -330,
        badge: 0,
      },
      {
        deviceToken: 'token',
        platform: 'android',
        appVersion: '0.0.1',
        osVersion: '17.3.1',
        locale: 'en-US',
        timeZoneOffset: -330,
        badge: 0,
      },
    ],
  },
  {
    iamguid: 'bde5cd30-7321-4b7d-8434-31a5d32c5479',
    clientName: 'company-demo',
    deviceInfo: [],
  },
  mockUserDBData,
];

export const mockUserProfileData: UserProfileResponse = {
  dob: '',
  communication: {
    mobileNumber: '',
    consent: false,
  },
  createdDate: '',
  iamguid: '',
  lastLoginDateTime: '',
  userType: '',
  clientGroupId: '',
  isTempPasswordChanged: false,
  isPrivacyConsent: false,
  relStatus: '',
  emailAddress: '',
  isQuickTourSkipped: false,
  departmentName: '',
  isFrontDesk: false,
  groupName: '',
  userRole: '',
  isMobVerified: false,
  jobTitle: '',
  employerType: '',
  createdBy: '',
  updatedBy: '',
  pingRiskId: '',
  isMigrated: false,
  isEmailVerified: false,
  emailTemplateDomain: '',
  firstName: '',
  gender: '',
  updatedDate: '',
  lastName: '',
  address: {
    addressOne: '',
    addressTwo: '',
    city: '',
    state: '',
    stateCode: '',
    zipcode: '',
  },
  _id: '',
  empStatus: '',
  clientName: '',
};

export const mockClinicalQuestions: ClinicalQuestionsRequest = {
  questionnaire: [
    {
      problemType: 'Family',
      problemTypeCode: 'CCC',
      presentingProblem: 'Adoption',
      presentingProblemCode: 'H07',
      answer: 'lmn',
      lessProductivedays: '10',
      jobMissedDays: '9',
    },
  ],
};

export const clientConfigurationData = {
  data: {
    resources: {
      telehealth: [
        {
          redirectUrl: 'api:telehealth.emotionalSupport',
          openURLInNewTab: true,
          type: 'CardModel',
          title: 'Emotional support',
        },
        {
          redirectUrl: 'https://www.talkspace.com/carelonwellbeing',
          openURLInNewTab: true,
          type: 'CardModel',
          title: 'Talkspace',
        },
        {
          redirectUrl: 'https://arraybc.com/patients',
          openURLInNewTab: true,
          type: 'CardModel',
          title: 'Array Behavioral Care',
        },
        {
          redirectUrl: 'https://www.carelonbehavioralcare.com/',
          openURLInNewTab: true,
          type: 'CardModel',
          title: 'Carelon Behavioral Care',
        },
      ],
      home: [
        {
          openURLInNewTab: false,
          redirectUrl: 'page:findACounselor.telehealth',
          type: 'CardModel',
          title: 'Find a counselor',
        },
        {
          openURLInNewTab: false,
          redirectUrl: '/{clientUri}/find-legal-support',
          type: 'CardModel',
          title: 'Legal resources',
        },
        {
          openURLInNewTab: false,
          redirectUrl: '/{clientUri}/plan-finances',
          type: 'CardModel',
          title: 'Financial planning',
        },
        {
          openURLInNewTab: false,
          redirectUrl: '/{clientUri}/work-life-resources',
          type: 'CardModel',
          title: 'Work-life resources',
        },
        {
          openURLInNewTab: true,
          redirectUrl: 'api:assessments',
          type: 'CardModel',
          title: 'Support starts here',
        },
        {
          openURLInNewTab: true,
          redirectUrl: 'page:wellness',
          type: 'CardModel',
          title: 'Explore wellness topics',
        },
      ],
    },
    sections: [
      'coursesAndResourcesExploreMore',
      'coursesAndResources',
      'criticalEvents',
      'featuredItems',
      'trendingTopicsEmotionalWellnessExploreMore',
      'trendingTopicsEmotionalWellness',
      'trendingTopics',
      'carousel',
      'genesysChat',
    ],
    clients: [
      {
        userName: 'Company Demo',
        enabled: true,
        logoUrl:
          'https://images.squarespace-cdn.com/content/v1/5daa874aef72120123a899b4/0fc9028d-673b-410a-a19f-601ac50a8e20/crl_sm_v_rgb_c.png',
        supportNumber: '888-888-8888',
      },
      {
        userName: 'bcbsmn',
        enabled: true,
        logoUrl:
          'https://images.squarespace-cdn.com/content/v1/5daa874aef72120123a899b4/0fc9028d-673b-410a-a19f-601ac50a8e20/crl_sm_v_rgb_c.png',
        supportNumber: '1234567890',
      },
      {
        userName: 'ariesmarine',
        enabled: true,
        logoUrl:
          'https://images.squarespace-cdn.com/content/v1/5daa874aef72120123a899b4/0fc9028d-673b-410a-a19f-601ac50a8e20/crl_sm_v_rgb_c.png',
        supportNumber: '866-950-7656',
      },
    ],
    enableMock: {
      resources: true,
      articles: true,
      card: true,
    },
  },
};

export const mockTokenPayload: MemberOAuthPayload = {
  clientId: 'clientid',
  userName: 'userName',
  iamguid: 'iamguidSample',
  permissions: [],
  clientName: 'testClient',
  installationId: '12345',
  sessionId: '4321',
};
