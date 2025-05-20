import { MongoDatabaseClient } from '@anthem/communityadminapi/database';
import { ILogger } from '@anthem/communityadminapi/logger';
import { Mockify } from '@anthem/communityadminapi/utils/mocks/mockify';
import { AssociateGateway } from 'api/adminresources/gateways/associateGateway';
import { HealthwiseGateway } from 'api/adminresources/gateways/healthwiseGateway';
import { MeredithGateway } from 'api/adminresources/gateways/meredithGateway';
import { PostHelperService } from 'api/adminresources/helpers/postHelper';
import { PushNotificationHelper } from 'api/adminresources/helpers/pushNotificationHelper';
import { UserHelperService } from 'api/adminresources/helpers/userHelper';
import { AdminUserService } from 'api/adminresources/services/adminUserService';
import { AppMemberService } from 'api/adminresources/services/appMemberService';
import { ArticleService } from 'api/adminresources/services/articleService';
import { S3Service } from 'api/adminresources/services/aws/s3Service';
import { Schedule } from 'api/adminresources/services/aws/schedule';
import { SqsService } from 'api/adminresources/services/aws/sqsService';
import { CommunityService } from 'api/adminresources/services/communityServies';
import { ContentService } from 'api/adminresources/services/contentService';
import { EmailNotificationService } from 'api/adminresources/services/emailNotificationService';
import { EmailService } from 'api/adminresources/services/emailServices';
import { HealthwiseTokenService } from 'api/adminresources/services/healthwiseTokenService';
import { HelpfulInfoService } from 'api/adminresources/services/helpfulInfoService';
import { ImageService } from 'api/adminresources/services/images/imageService';
import { LibSectionService } from 'api/adminresources/services/libSectionService';
import { LibraryService } from 'api/adminresources/services/libraryService';
import { PartnersService } from 'api/adminresources/services/partnersService';
import { PostsService } from 'api/adminresources/services/postsService';
import { PromptsService } from 'api/adminresources/services/promptsService';
import { PublicService } from 'api/adminresources/services/publicService';
import { PushNotificationService } from 'api/adminresources/services/pushNotificationService';
import { SearchTermService } from 'api/adminresources/services/searchTermService';
import { StoryCommentService } from 'api/adminresources/services/storyCommentService';
import { StoryService } from 'api/adminresources/services/storyService';
import { UserActivityService } from 'api/adminresources/services/userActivityService';
import { UserService } from 'api/adminresources/services/userService';
import { VersionService } from 'api/adminresources/services/versionService';
import { ViewStoryService } from 'api/adminresources/services/viewStoryService';
import { Result, Validation } from '.';
import { SecureJwtToken } from '../filters';
import { CacheUtil } from '../utils';
import { RequestValidation } from './requestValidation';

export const mockifiedUserContext = jest
  .fn()
  .mockReturnValue(
    '{"id":"61b21e9c26dbb012b69cf67e","name":"az00001","active":"true","role":"scadmin","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
  );
export const mockifiedAdvocateContext = jest
  .fn()
  .mockReturnValue(
    '{"id":"61b21e9c26dbb012b69cf67e","name":"az00001","active":"true","role":"scadvocate","iat":1643012245,"exp":1643041045,"sub":"az00001","jti":"e379c0844de25f3724c181740f3161c0287fb4c3a238913e550d5307a899d433"}'
  );

export const mockMongo: Mockify<MongoDatabaseClient> = {
  add: jest.fn(),
  read: jest.fn(),
  readByValue: jest.fn(),
  readAll: jest.fn(),
  readByID: jest.fn(),
  insertValue: jest.fn(),
  updateByQuery: jest.fn(),
  updateManyByQuery: jest.fn(),
  replaceByQuery: jest.fn(),
  delete: jest.fn(),
  readAllByValue: jest.fn(),
  deleteOneByValue: jest.fn(),
  readByIDArray: jest.fn(),
  getDistinct: jest.fn(),
  getUsersPerCommunity: jest.fn(),
  getDocumentCount: jest.fn(),
  getStoriesPerCommunity: jest.fn(),
  readByAggregate: jest.fn(),
  getMaxOrMinValues: jest.fn(),
  getUsersCountByMemberType: jest.fn(),
  findAndUpdateOne: jest.fn(),
  getRowCount: jest.fn(),
  getDbClient: jest.fn()
};

export const mockResult: Mockify<Result> = {
  createSuccess: jest.fn(),
  createException: jest.fn(),
  createError: jest.fn(),
  createErrorMessage: jest.fn(),
  createExceptionWithValue: jest.fn(),
  createGuid: jest.fn(),
  errorInfo: jest.fn()
};

export const mockValidation: Mockify<Validation> = {
  isHex: jest.fn(),
  isNullOrWhiteSpace: jest.fn(),
  isValid: jest.fn(),
  moderatedWords: jest.fn(),
  sort: jest.fn(),
  checkUserIdentity: jest.fn(),
  incrementVersion: jest.fn(),
  identifySpecialKeyWords: jest.fn(),
  isValidUrl: jest.fn(),
  convertHtmlToPlainText: jest.fn(),
  isValidDate: jest.fn()
};

export const mockRequestValidator: Mockify<RequestValidation> = {
  isValidReactionRequest: jest.fn(),
  isValidPostModel: jest.fn(),
  getImageValidation: jest.fn(),
  pushNotificationValidation: jest.fn(),
  validateCreateAdminUser: jest.fn(),
  isHex: jest.fn(),
  isNullOrWhiteSpace: jest.fn(),
  sort: jest.fn(),
  isValid: jest.fn(),
  moderatedWords: jest.fn(),
  checkUserIdentity: jest.fn(),
  incrementVersion: jest.fn(),
  validCommunityArray: jest.fn(),
  identifySpecialKeyWords: jest.fn(),
  isValidUrl: jest.fn(),
  convertHtmlToPlainText: jest.fn(),
  isValidDate: jest.fn()
};

export const mockStoryService: Mockify<StoryService> = {
  getStoryByUserId: jest.fn(),
  buildStoryResponse: jest.fn(),
  getQuestionAuthorData: jest.fn(),
  getRemovedStory: jest.fn(),
  removeStory: jest.fn(),
  storyFlag: jest.fn()
};

export const mockStoryCommentService: Mockify<StoryCommentService> = {
  upsertReply: jest.fn(),
  upsertComment: jest.fn(),
  removeComment: jest.fn(),
  addReaction: jest.fn(),
  flagComment: jest.fn(),
  postService: jest.fn()
};

export const mockUserService: Mockify<UserService> = {
  deleteUser: jest.fn(),
  removeStory: jest.fn(),
  getProfile: jest.fn(),
  getAllProfile: jest.fn(),
  updateAdminProfile: jest.fn(),
  createAdminProfile: jest.fn(),
  adminAuth: jest.fn(),
  updateActiveFlag: jest.fn(),
  getUserProfile: jest.fn(),
  updateOptInMinor: jest.fn(),
  deleteProfile: jest.fn(),
  roleService: jest.fn(),
  getExportData: jest.fn(),
  adminService: jest.fn()
};

export const mockLogger: Mockify<ILogger> = {
  DEFAULT_SCOPE: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  audit: jest.fn(),
  uiLog: jest.fn(),
  uiAudit: jest.fn()
};

export const mockPublicService: Mockify<PublicService> = {
  login: jest.fn(),
  getData: jest.fn(),
  getMemberData: jest.fn()
};

export const mockPostService: Mockify<PostsService> = {
  upsertComment: jest.fn(),
  getAllPosts: jest.fn(),
  upsertReply: jest.fn(),
  upsertPost: jest.fn(),
  deletePost: jest.fn(),
  getPost: jest.fn(),
  getCommunityPosts: jest.fn(),
  deleteComment: jest.fn(),
  flagComment: jest.fn(),
  addReaction: jest.fn(),
  flagPost: jest.fn(),
  flagOrDeleteReply: jest.fn(),
  emailService: jest.fn(),
  adminUserService: jest.fn(),
  moderationOnFieldLevel: jest.fn(),
  formateComments: jest.fn(),
  scheduler: jest.fn(),
  pollSvc: jest.fn()
};

export const mockCommunityService: Mockify<CommunityService> = {
  createCommunity: jest.fn(),
  getCommunityById: jest.fn(),
  getAllCommunities: jest.fn(),
  getSubCommunities: jest.fn(),
  getCommunityAdmins: jest.fn()
};

export const mockContentService: Mockify<ContentService> = {
  getAdminContent: jest.fn(),
  updateContent: jest.fn(),
  getContent: jest.fn(),
  getContentOptions: jest.fn(),
  getDeeplinkContent: jest.fn(),
  getLibContent: jest.fn(),
  getPreviewImages: jest.fn(),
  refineContentReponse: jest.fn(),
  createDeepLinkContent: jest.fn(),
  updateDeepLinkContent: jest.fn(),
  getLatestContent: jest.fn(),
  getTouContent: jest.fn(),
  updateLinkSection: jest.fn(),
  createLinkSection: jest.fn(),
  getContentVersions: jest.fn()
};

export const mockHelpfulInfoService: Mockify<HelpfulInfoService> = {
  getCommunityHelpfulInfo: jest.fn(),
  getHelpfulInfoById: jest.fn(),
  updateHelpfulInfo: jest.fn(),
  updateLibrarySection: jest.fn(),
  getCommonHelpfulInfo: jest.fn(),
  getHelpfulInfoContent: jest.fn(),
  updateLibraryDetail: jest.fn()
};

export const mockImageService: Mockify<ImageService> = {
  uploadImage: jest.fn(),
  updateImage: jest.fn(),
  getImage: jest.fn()
};

export const mockLibraryService: Mockify<LibraryService> = {
  getLibraryByCommunityId: jest.fn(),
  createCommunitySection: jest.fn(),
  getHealthwiseArticle: jest.fn(),
  getMeredithArticle: jest.fn(),
  createLibrary: jest.fn()
};

export const mockSearchTermService: Mockify<SearchTermService> = {
  addSearchTerm: jest.fn()
};

export const mockS3Service: Mockify<S3Service> = {
  upload: jest.fn(),
  delete: jest.fn(),
  getImage: jest.fn()
};

export const mockSqsService: Mockify<SqsService> = {
  addToNotificationQueue: jest.fn()
};

export const mockSecureJwtToken: Mockify<SecureJwtToken> = {
  generateToken: jest.fn(),
  generategbdToken: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
  verifyRSA: jest.fn()
};

export const mockAssociateGateway: Mockify<AssociateGateway> = {
  onPremToken: jest.fn(),
  webUserSearch: jest.fn(),
  webUserAuthenticate: jest.fn()
};

export const mockUserHelperService: Mockify<UserHelperService> = {
  generateUserRequestObject: jest.fn(),
  generateUserAuthRequest: jest.fn(),
  handleErrorResponse: jest.fn(),
  createAdminObject: jest.fn(),
  getNewAdminProfile: jest.fn(),
  generateWebUserRequest: jest.fn(),
  generateToken: jest.fn(),
  activityHandler: jest.fn(),
  fetchStoryCountDetails: jest.fn(),
  getDemoUsers: jest.fn()
};

export const mockPushNotificationService: Mockify<PushNotificationService> = {
  createPushNotification: jest.fn(),
  getPushNotification: jest.fn(),
  updatePushNotification: jest.fn(),
  removePushNotification: jest.fn(),
  getTargetAudienceCount: jest.fn(),
  getPNMetrix: jest.fn(),
  _userHelper: jest.fn(),
  getPNTemplates: jest.fn(),
  updatePNTemplates: jest.fn(),
  agendaHelper: jest.fn()
};

export const mockSchedule: Mockify<Schedule> = {
  schedulePNJob: jest.fn(),
  executeScheduledPNJob: jest.fn(),
  cancelScheduledPNJob: jest.fn(),
  schedulePostJob: jest.fn(),
  executePostScheduleJob: jest.fn(),
  cancelPostJob: jest.fn(),
  schedulePollClosingSoon: jest.fn(),
  executePollClosingSoon: jest.fn(),
  cancelPollClosingSoonJob: jest.fn(),
  schedulePollClosed: jest.fn(),
  executePollClosed: jest.fn(),
  cancelPollClosedJob: jest.fn()
};

export const mockPushNotificationHelper: Mockify<PushNotificationHelper> = {
  createPushNotificationData: jest.fn(),
  getFilter: jest.fn(),
  getNoRecentLoginCount: jest.fn(),
  getUsersWithNoStoryCount: jest.fn(),
  getUsersWithDraftStoryCount: jest.fn(),
  getNonCommunityUsersCount: jest.fn(),
  getCountData: jest.fn()
};

export const mockVersionService: Mockify<VersionService> = {
  getAppVersion: jest.fn(),
  updateAppVersion: jest.fn()
};

export const mockViewStoryService: Mockify<ViewStoryService> = {
  getAllStories: jest.fn(),
  storyHelper: jest.fn(),
  postHelperService: jest.fn(),
  getStory: jest.fn()
};

export const mockAdminUserService: Mockify<AdminUserService> = {
  getPersona: jest.fn(),
  createActivityObject: jest.fn(),
  getOtherProfile: jest.fn(),
  adminImageHandler: jest.fn(),
  getAdminImage: jest.fn()
};

export const mockPostHelper: Mockify<PostHelperService> = {
  upsertPostHelper: jest.fn(),
  createPostObject: jest.fn(),
  createCommentObject: jest.fn(),
  createReactionObject: jest.fn(),
  publishPost: jest.fn(),
  updateReactionObject: jest.fn(),
  handleReactions: jest.fn(),
  handleUserActivityForPost: jest.fn(),
  createCommunityData: jest.fn(),
  notifyOnNewPost: jest.fn(),
  notifyOnAdminResponse: jest.fn(),
  addUserAuthor: jest.fn(),
  addPostAuthor: jest.fn(),
  updateBinderPost: jest.fn(),
  getAuthor: jest.fn(),
  validateCommunityAccessForPost: jest.fn(),
  getCommentAuthor: jest.fn(),
  getCommentCount: jest.fn(),
  modifyToRemovedComment: jest.fn(),
  personaAdminAuthor: jest.fn(),
  getPostStatus: jest.fn(),
  postStatus: jest.fn(),
  postPollClosingSoon: jest.fn(),
  postPollClose: jest.fn()
};

export const mockPromptService: Mockify<PromptsService> = {
  getByCommunityId: jest.fn(),
  setPromptData: jest.fn()
};

export const mockHealthwiseTokenSvc: Mockify<HealthwiseTokenService> = {
  postAuth: jest.fn()
};

export const mockHealthWiseGatewaySvc: Mockify<HealthwiseGateway> = {
  postAuth: jest.fn(),
  getTopicById: jest.fn(),
  getArticleTopic: jest.fn()
};

export const mockMeredithGatewaySvc: Mockify<MeredithGateway> = {
  getArticle: jest.fn()
};

export const mockCacheUtil: Mockify<CacheUtil> = {
  getCache: jest.fn(),
  setCache: jest.fn()
};

export const mockLibSectionSvc: Mockify<LibSectionService> = {
  editSectionDetails: jest.fn(),
  editSubSectionDetails: jest.fn()
};

export const mockArticleSvc: Mockify<ArticleService> = {
  editArticle: jest.fn(),
  editContentBasedOnIndex: jest.fn()
};

export const mockPartnersSvc: Mockify<PartnersService> = {
  createPartner: jest.fn(),
  getPartnerById: jest.fn(),
  getPartners: jest.fn(),
  updatePartner: jest.fn()
};

export const mockUserActivity: Mockify<UserActivityService> = {
  getAdminActivity: jest.fn(),
  getSCAdminActivity: jest.fn(),
  updateActivityAsRead: jest.fn(),
  getSCAdminActivityCount: jest.fn(),
  getAdminActivityCount: jest.fn()
};

export const mockEmailNotificationFunction: Mockify<EmailNotificationService> =
{
  triggerMassEmail: jest.fn(),
  touMassEmailInfo: jest.fn()
};

export const mockEmailService: Mockify<EmailService> = {
  sendEmailMessage: jest.fn()
};

export const mockAppMemberService: Mockify<AppMemberService> = {
  getDeleteRequestedUsers: jest.fn(),
  updateUserDeleteRequest: jest.fn()
};
