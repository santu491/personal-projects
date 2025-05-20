import {AppointmentGateway} from '../gateway/appointmentGateway';
import {AssessmentsGateway} from '../gateway/assessmentsGateway';
import {ChatGateway} from '../gateway/chatGateway';
import {EAPClientConfigurationGateway} from '../gateway/eapClientConfigurationGateway';
import {DynamoDBGateway} from '../gateway/dynamoDBGateway';
import {EAPMemberProfileGateway} from '../gateway/eapMemberProfileGateway';
import {ProviderSearchGateway} from '../gateway/providerSearchGateway';
import {TelehealthGateway} from '../gateway/telehealthGateway';
import {WellnessContentGateway} from '../gateway/wellnessContentGateway';
import {AppointmentService} from '../services/eap/appointmentService';
import {AssessmentsService} from '../services/eap/assessmentsService';
import {ChatService} from '../services/eap/chatService';
import {ClientConfigurationService} from '../services/eap/clientConfigurationService';
import {ContentService} from '../services/eap/contentService';
import {EAPMemberProfileService} from '../services/eap/eapMemberProfileService';
import {InstallationService} from '../services/eap/installationService';
import {NotificationService} from '../services/eap/notificationService';
import {ProviderService} from '../services/eap/providerService';
import {PublicService} from '../services/eap/publicService';
import {TelehealthService} from '../services/eap/telehealthService';
import {UserService} from '../services/eap/userService';
import {WellnessContentService} from '../services/eap/wellnessContentService';
import {ResponseUtil} from './responseUtil';
import {AuditService} from '../services/commons/auditService';
import {AuditHelper} from '../services/helpers/auditHelper';

export type Mockify<T> = {
  [P in keyof T]: jest.Mock;
};

export const mockResult: Mockify<ResponseUtil> = {
  createSuccess: jest.fn(),
  createException: jest.fn(),
  createErrorObject: jest.fn(),
  handleError: jest.fn(),
};

export const consoleSpy = jest.spyOn(console, 'log');

export const mockEapMemberProfileService: Mockify<EAPMemberProfileService> = {
  getMemberLookupStatus: jest.fn(),
  createUserService: jest.fn(),
  authenticateUserService: jest.fn(),
  getUserContactDetailsService: jest.fn(),
  sendOtpService: jest.fn(),
  validateOtpService: jest.fn(),
  getUserDetailsService: jest.fn(),
  getEAPMemberAuthAccessToken: jest.fn(),
  result: jest.fn(),
  memberProfileGateway: jest.fn(),
  forgotMemberPassword: jest.fn(),
  changePassword: jest.fn(),
  forgotMemberUserName: jest.fn(),
  rememberDeviceService: jest.fn(),
  updateUserService: jest.fn(),
  fetchMemberPreferencesService: jest.fn(),
  saveMemberPreferencesService: jest.fn(),
  refreshMemberAuthService: jest.fn(),
  invalidateMemberSessionService: jest.fn(),
  removeMemberAccountService: jest.fn(),
  setMemberAccountStatusService: jest.fn(),
  dynamoDBGateway: jest.fn(),
  auditHelper: jest.fn(),
};

export const mockEapMemberProfileGateway: Mockify<EAPMemberProfileGateway> = {
  getEAPAccessToken: jest.fn(),
  userLookup: jest.fn(),
  postMemberRegistration: jest.fn(),
  authenticateMember: jest.fn(),
  forgotUserName: jest.fn(),
  validateMemberDetails: jest.fn(),
  postEAPMemberChangePassword: jest.fn(),
  sendOtp: jest.fn(),
  validateOtp: jest.fn(),
  getUserContactDetailsData: jest.fn(),
  getUserProfileDetails: jest.fn(),
  rememberDevice: jest.fn(),
  putEAPUserProfileDetails: jest.fn(),
  putMemberPreferences: jest.fn(),
  setMemberAccountStatus: jest.fn(),
  getMemberDbData: jest.fn(),
  updateAuditTimeStamp: jest.fn(),
  dynamoDBGateway: jest.fn(),
  disableUserAccount: jest.fn(),
};

export const mockAppointmentService: Mockify<AppointmentService> = {
  createAppointment: jest.fn(),
  getAssessmentRequired: jest.fn(),
  result: jest.fn(),
  appointmentGateway: jest.fn(),
  memberService: jest.fn(),
  getAppointmentStatus: jest.fn(),
  fetchAppointment: jest.fn(),
  updateAppointment: jest.fn(),
  getQuestions: jest.fn(),
  getMemberStatus: jest.fn(),
  getMemberDashboardData: jest.fn(),
  getAppointmentDetails: jest.fn(),
  auditHelper: jest.fn(),
};

export const mockAssessmentsService: Mockify<AssessmentsService> = {
  generateAssessment: jest.fn(),
  result: jest.fn(),
  assessmentsGateway: jest.fn(),
  getSurveyLink: jest.fn(),
};

export const mockAppointmentGateway: Mockify<AppointmentGateway> = {
  createAppointment: jest.fn(),
  getAssessmentRequired: jest.fn(),
  fetchAppointmentStatus: jest.fn(),
  fetchAppointment: jest.fn(),
  updateAppointment: jest.fn(),
  fetchQuestions: jest.fn(),
  fetchMemberStatus: jest.fn(),
  fetchMemberDashboardData: jest.fn(),
};

export const mockAssessmentsGateway: Mockify<AssessmentsGateway> = {
  generateCalibrateParticipantId: jest.fn(),
  fetchClientAssessmentConfig: jest.fn(),
};

export const mockProviderSearchGateway: Mockify<ProviderSearchGateway> = {
  getProviderAddressesData: jest.fn(),
  getGeoCodeAddressInfo: jest.fn(),
  getProvidersListData: jest.fn(),
  getProviderDetailsData: jest.fn(),
  getAccessToken: jest.fn(),
  sendEmail: jest.fn(),
};

export const mockProviderSearchService: Mockify<ProviderService> = {
  getProviderAddresses: jest.fn(),
  getGeoCodeAddress: jest.fn(),
  fetchProvidersList: jest.fn(),
  getProviderDetails: jest.fn(),
  getProviderPublicAccessToken: jest.fn(),
  sendEmailService: jest.fn(),
  auditHelper: jest.fn(),
};

export const mockWellnessContentGateway: Mockify<WellnessContentGateway> = {
  getMonthlyResources: jest.fn(),
  getTopics: jest.fn(),
};

export const mockWellnessContentService: Mockify<WellnessContentService> = {
  result: jest.fn(),
  wellnessTopicsGateway: jest.fn(),
  getMonthlyResourcesService: jest.fn(),
  getTopicsService: jest.fn(),
};

export const mockDynamoDBGateway: Mockify<DynamoDBGateway> = {
  getRecords: jest.fn(),
  getAllRecords: jest.fn(),
  queryTable: jest.fn(),
  upsertRecord: jest.fn(),
  updateRecord: jest.fn(),
  deleteRecord: jest.fn(),
  getMultipleRecords: jest.fn(),
};

export const mockInstallationService: Mockify<InstallationService> = {
  result: jest.fn(),
  dbGateway: jest.fn(),
  memberProfileGateway: jest.fn(),
  saveInstallation: jest.fn(),
  deleteInstallation: jest.fn(),
};

export const mockNotificationService: Mockify<NotificationService> = {
  result: jest.fn(),
  memberGateway: jest.fn(),
  dynamoDBGateway: jest.fn(),
  notificationActions: jest.fn(),
  getAllNotifications: jest.fn(),
  auditHelper: jest.fn(),
};

export const mockPublicService: Mockify<PublicService> = {
  publicAuth: jest.fn(),
  notify: jest.fn(),
  forceAppUpdate: jest.fn(),
};

export const mockContentService: Mockify<ContentService> = {
  getContentService: jest.fn(),
};

export const mockUserService: Mockify<UserService> = {
  result: jest.fn(),
  dynamoDb: jest.fn(),
  badgeReset: jest.fn(),
};

export const mockTelehealthGateway: Mockify<TelehealthGateway> = {
  createMdLiveAppointment: jest.fn(),
};

export const mockTelehealthService: Mockify<TelehealthService> = {
  createMdliveAppointmentService: jest.fn(),
};

export const mockclientConfigurationService: Mockify<ClientConfigurationService> =
  {
    result: jest.fn(),
    clientConfigurationHelper: jest.fn(),
    clientConfigurationGateway: jest.fn(),
    contentService: jest.fn(),
    getClientResources: jest.fn(),
    getClientArticles: jest.fn(),
    getClientCards: jest.fn(),
    auditHelper: jest.fn(),
  };

export const mockclientConfigurationGateway: Mockify<EAPClientConfigurationGateway> =
  {
    getClients: jest.fn(),
    getResources: jest.fn(),
    getArticles: jest.fn(),
    getCards: jest.fn(),
    getCardAssets: jest.fn(),
  };

export const mockChatService: Mockify<ChatService> = {
  response: jest.fn(),
  chatGateway: jest.fn(),
  initChat: jest.fn(),
  getChatResources: jest.fn(),
  auditHelper: jest.fn(),
};

export const mockChatGateway: Mockify<ChatGateway> = {
  initChat: jest.fn(),
  getChatResources: jest.fn(),
};

export const mockAuditService: Mockify<AuditService> = {
  createInstallation: jest.fn(),
  logger: jest.fn(),
  updateRecentAccess: jest.fn(),
  endSession: jest.fn(),
};

export const mockAuditHelper: Mockify<AuditHelper> = {
  getInstallation: jest.fn(),
  addEvent: jest.fn(),
  addInstallation: jest.fn(),
  updateRecentAccess: jest.fn(),
};
