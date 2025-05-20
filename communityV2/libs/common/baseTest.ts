import { MongoDatabaseClient } from '@anthem/communityapi/database';
import { Mockify } from '@anthem/communityapi/utils/mocks/mockify';
import { AuntBerthaGateway } from 'api/communityresources/gateways/auntBerthaGateway';
import { InternalGateway } from 'api/communityresources/gateways/internalGateway';
import { MemberContactsGateway } from 'api/communityresources/gateways/memberContactsGateway';
import { MemberDetailsGateway } from 'api/communityresources/gateways/memberDetailsGateway';
import { MemberGateway } from 'api/communityresources/gateways/memberGateway';
import { TokenGateway } from 'api/communityresources/gateways/onPremTokenGateway';
import { ActivityService } from 'api/communityresources/services/activityService';
import { S3Service } from 'api/communityresources/services/aws/s3Service';
import { SnsService } from 'api/communityresources/services/aws/snsService';
import { SqsService } from 'api/communityresources/services/aws/sqsService';
import { BinderService } from 'api/communityresources/services/binderService';
import { BlockUserService } from 'api/communityresources/services/blockUserService';
import { CommentService } from 'api/communityresources/services/commentService';
import { CommunityService } from 'api/communityresources/services/communityServies';
import { EmailService } from 'api/communityresources/services/emailService';
import { ForgotUserCommercialService } from 'api/communityresources/services/forgotUser/commercialService';
import { ForgotUserService } from 'api/communityresources/services/forgotUser/forgotUserService';
import { ForgotUserMedicaidService } from 'api/communityresources/services/forgotUser/medicaidService';
import { AccessTokenHelper } from 'api/communityresources/services/helpers/accessTokenHelper';
import { ActivityHelper } from 'api/communityresources/services/helpers/activityHelper';
import { CommentHelper } from 'api/communityresources/services/helpers/commentHelper';
import { CommunitiesHelper } from 'api/communityresources/services/helpers/communitiesHelper';
import { LoginServiceHelper } from 'api/communityresources/services/helpers/loginServiceHelper';
import { MemberServiceHelper } from 'api/communityresources/services/helpers/memberServiceHelper';
import { NotificationHelper } from 'api/communityresources/services/helpers/notificationHelper';
import { NSFWLoader } from 'api/communityresources/services/helpers/nsfwLoader';
import { PostsHelper } from 'api/communityresources/services/helpers/postsHelper';
import { ReactionHelper } from 'api/communityresources/services/helpers/reactionHelper';
import { StoryHelper } from 'api/communityresources/services/helpers/storyHelper';
import { UserHelper } from 'api/communityresources/services/helpers/userHelper';
import { InstallationService } from 'api/communityresources/services/installationService';
import { InternalService } from 'api/communityresources/services/internalService';
import { LibraryService } from 'api/communityresources/services/libraryService';
import { LocationService } from 'api/communityresources/services/locationService';
import { LoginCommercialService } from 'api/communityresources/services/login/commercialService';
import { LoginMedicaidService } from 'api/communityresources/services/login/medicaidService';
import { ManageProfileService } from 'api/communityresources/services/manageProfileService';
import { MemberService } from 'api/communityresources/services/memberService';
import { SendOneTimePasswordService } from 'api/communityresources/services/oneTimePassword/sendOneTimePasswordService';
import { ValidateOneTimePasswordService } from 'api/communityresources/services/oneTimePassword/validateOneTimePasswordService';
import { PartnerService } from 'api/communityresources/services/partnerService';
import { PollService } from 'api/communityresources/services/pollService';
import { PostImageService } from 'api/communityresources/services/postImageService';
import { PostsService } from 'api/communityresources/services/postsService';
import { ProfileCommercialARNService } from 'api/communityresources/services/profileCommercialARNService';
import { ProfileMedicaidARNService } from 'api/communityresources/services/profileMedicaidARNService';
import { ProgramService } from 'api/communityresources/services/programService';
import { PromptService } from 'api/communityresources/services/promptService';
import { PublicService } from 'api/communityresources/services/publicService';
import { SearchTermService } from 'api/communityresources/services/searchTermService';
import { StoryService } from 'api/communityresources/services/storyService';
import { UserService } from 'api/communityresources/services/userService';
import { Result, Validation } from '.';
import { SecureJwtToken } from '../filters';
import { CacheUtil } from '../utils';

export const mockRequestContext = jest
  .fn()
  .mockReturnValue(
    '{"name":"~SIT3SBB000008AB","id":"61604cdd33b45d0023d0db61","firstName":"PHOEBE","lastName":"STINSON","active":"true","isDevLogin":"true","iat":1642001503,"exp":1642030303,"sub":"~SIT3SBB000008AB","jti":"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019"}'
  );
export const mockInactiveRequestContext = jest
  .fn()
  .mockReturnValue(
    '{"name":"~SIT3SBB000008AB","id":"61604cdd33b45d0023d0db61","firstName":"PHOEBE","lastName":"STINSON","active":false,"isDevLogin":"true","iat":1642001503,"exp":1642030303,"sub":"~SIT3SBB000008AB","jti":"bbbf66e5557c0b56cd8747e0cf9942325eef16527e6bb1f331f20131b4565afc66dc3ad5f41e4444baf3db7113eb4019"}'
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
  readByAggregate: jest.fn(),
  getDocumentCount: jest.fn(),
  findAndUpdateOne: jest.fn(),
  _client: jest.fn(),
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

export const mockEmail: Mockify<EmailService> = {
  sendEmailMessage: jest.fn(),
  htmlForComment: jest.fn(),
  htmlForReply: jest.fn(),
  htmlForFlagComment: jest.fn(),
  htmlForKeywords: jest.fn(),
  htmlForFlagStoryComment: jest.fn(),
  htmlForReplyForStory: jest.fn(),
  htmlForStoryModeration: jest.fn()
};

export const mockValidation: Mockify<Validation> = {
  isHex: jest.fn(),
  isNullOrWhiteSpace: jest.fn(),
  alphabeticalSort: jest.fn(),
  isValid: jest.fn(),
  isValidPromptAnswerModel: jest.fn(),
  isValidStoryModel: jest.fn(),
  userLocationValidation: jest.fn(),
  isValidBinderModel: jest.fn(),
  isValidForResourceBinder: jest.fn(),
  isValidForArticleBinder: jest.fn(),
  isValidForStoryBinder: jest.fn(),
  isValidPrompt: jest.fn(),
  isModerationRequired: jest.fn(),
  moderatedWords: jest.fn(),
  identifySpecialKeyWords: jest.fn(),
  moderateStoryModelContent: jest.fn(),
  moderatePostCommentModelContent: jest.fn(),
  moderatePromptAnswerModelContent: jest.fn(),
  isValidateReaction: jest.fn(),
  maskEmailAndPhone: jest.fn(),
  sort: jest.fn(),
  isValidForPostsBinder: jest.fn(),
  moderateStoryModelForSensitiveWords: jest.fn()
};
export const mockMemberGateway: Mockify<MemberGateway> = {
  webUserSearch: jest.fn(),
  webUserAuthenticate: jest.fn(),
  commercialMemberAuthenticate: jest.fn(),
  memberEligibility: jest.fn(),
  memberLoginThreatApi: jest.fn(),
  loginValidateOtpApi: jest.fn(),
  medicaidValidateOtpApi: jest.fn(),
  memberSendOtp: jest.fn(),
  loginSaveCookieApi: jest.fn(),
  loginValidateQaApi: jest.fn(),
  memberInformationApi: jest.fn(),
  memberRecoveryThreatApi: jest.fn(),
  generatePasswordApi: jest.fn(),
  updateNewPasswordApi: jest.fn(),
  getGbdMemberContacts: jest.fn(),
  memberRecoveryContactApi: jest.fn(),
  memberEligibilitySynthetic: jest.fn(),
  onPremSyntheticToken: jest.fn(),
  authToken: jest.fn(),
  memberGetContactsApi: jest.fn()
};

export const mockMemberDetailsGateway: Mockify<MemberDetailsGateway> = {
  gbdMemberSummary: jest.fn(),
  memberInformationApi: jest.fn()
};

export const mockOnPremTokenGateway: Mockify<TokenGateway> = {
  onPremSyntheticToken: jest.fn(),
  onPremToken: jest.fn(),
  onPremAwsToken: jest.fn(),
  sydneyMemberTenantToken: jest.fn(),
  psgbdTenantToken: jest.fn(),
  findHelpToken: jest.fn()
};

export const mockMemberContactsGateway: Mockify<MemberContactsGateway> = {
  memberGetContactsApi: jest.fn(),
  getGbdMemberContacts: jest.fn(),
  memberRecoveryContactApi: jest.fn(),
  getGbdMemberContactsSynthetic: jest.fn()
};

export const mockMemberSvc: Mockify<MemberService> = {
  checkMemberType: jest.fn(),
  memberAuthentication: jest.fn(),
  memberLogin: jest.fn(),
  memberLoginTreat: jest.fn(),
  loginSaveCookie: jest.fn(),
  validateMemberInfo: jest.fn(),
  loginTreatFormat: jest.fn(),
  loginAnswerValidate: jest.fn(),
  memberRecoveryTreat: jest.fn(),
  formatFupMemberRequest: jest.fn(),
  searchMemberByWebguid: jest.fn(),
  updateSecret: jest.fn(),
  saveCookieRequestPath: jest.fn(),
  getPassword: jest.fn(),
  updatePassword: jest.fn(),
  getRecoveryContact: jest.fn(),
  recoveryTreatRequestPath: jest.fn(),
  loginTreatRequestPath: jest.fn()
};

export const mockCommercialSvc: Mockify<ProfileCommercialARNService> = {
  getCommercialPhoneNumbers: jest.fn(),
  getUserContactNumbers: jest.fn(),
  recoveryContactNumber: jest.fn()
};

export const mockMedicaidSvc: Mockify<ProfileMedicaidARNService> = {
  gbdContactDetails: jest.fn(),
  updateMedicaidRecoveryNumber: jest.fn()
};

export const mockAccessTokenHelperSvc: Mockify<AccessTokenHelper> = {
  getOauthToken: jest.fn(),
  getSyntheticToken: jest.fn(),
  generateJwtToken: jest.fn(),
  getEKSOauthToken: jest.fn(),
  getSydneyMemberTenantOAuthToken: jest.fn(),
  getFindhelpMemberOAuthToken: jest.fn(),
  getPSGBDTenantOAuthToken: jest.fn(),
  getTokenReqFindHelp: jest.fn()
};

export const mockMemberHelperSvc: Mockify<MemberServiceHelper> = {
  cumulateWebUserData: jest.fn(),
  generateUpdatePasswordObject: jest.fn(),
  getGBDContactDetails: jest.fn(),
  getGbdMemberSummary: jest.fn(),
  generateRequestContext: jest.fn(),
  generateSearchRequest: jest.fn(),
  generateUserRequestObject: jest.fn(),
  formatMemberRequest: jest.fn(),
  manageStoryPromotion: jest.fn()
};

export const mockLoginHelperSvc: Mockify<LoginServiceHelper> = {
  isDemoUser: jest.fn()
};

export const mockStoryHelper: Mockify<StoryHelper> = {
  addPromptOptionValue: jest.fn(),
  updateStoryCollection: jest.fn(),
  getCommunityByIdOrUserId: jest.fn(),
  removeBlockedContentForStories: jest.fn(),
  createStoryResponseObject: jest.fn(),
  buildStoryResponse: jest.fn(),
  updateStoryInBinder: jest.fn(),
  removeStoryActivity: jest.fn()
};

export const mockSecureJwtToken: Mockify<SecureJwtToken> = {
  decode: jest.fn(),
  generateToken: jest.fn(),
  generategbdToken: jest.fn(),
  verify: jest.fn(),
  verifyRSA: jest.fn()
};

export const mockCacheUtil: Mockify<CacheUtil> = {
  getCache: jest.fn(),
  setCache: jest.fn()
};

export const mockStory: Mockify<StoryService> = {
  getAllStories: jest.fn(),
  getStoryById: jest.fn(),
  getStoryByUserId: jest.fn(),
  getByCommunity: jest.fn(),
  createAnswersForPrompt: jest.fn(),
  updateStory: jest.fn(),
  getByCommunityAndStoryAuthor: jest.fn(),
  updateDisplayNameInStory: jest.fn(),
  setPublished: jest.fn(),
  removePromptFromStory: jest.fn(),
  flagStory: jest.fn(),
  create: jest.fn(),
  upsertComment: jest.fn(),
  upsertReaction: jest.fn(),
  upsertReply: jest.fn(),
  storyHelper: jest.fn(),
  postService: jest.fn(),
  communityService: jest.fn(),
  emailService: jest.fn(),
  userHelper: jest.fn(),
  notificationHelper: jest.fn(),
  deleteStoryById: jest.fn()
};

export const mockUser: Mockify<UserService> = {
  getUserById: jest.fn(),
  joinCommunity: jest.fn(),
  userFromModel: jest.fn(),
  logOutUser: jest.fn(),
  resetBadgeCount: jest.fn(),
  getUserProfileById: jest.fn(),
  updateTermsOfUse: jest.fn(),
  updateDisplayName: jest.fn(),
  getUserProfileImage: jest.fn(),
  leaveCommunity: jest.fn(),
  addProfilePicture: jest.fn(),
  joinUserCommunities: jest.fn(),
  updateOnBoardingState: jest.fn(),
  updateHelpBannerViewedData: jest.fn(),
  updateUserCategories: jest.fn(),
  getAppTranslations: jest.fn(),
  addUserReaction: jest.fn(),
  getSNSTopics: jest.fn(),
  updatePushNotificationPreferencesFlags: jest.fn(),
  userHelper: jest.fn(),
  storyService: jest.fn(),
  reactionHelper: jest.fn(),
  publicService: jest.fn(),
  pushNotification: jest.fn(),
  schedule: jest.fn()
};

export const mockPublicSvc: Mockify<PublicService> = {
  getAppMinVersion: jest.fn(),
  getFlagged: jest.fn(),
  devAuthenticate: jest.fn(),
  checkHealth: jest.fn(),
  getAppTranslations: jest.fn(),
  getAppData: jest.fn(),
  getAppVersion: jest.fn()
};

export const promptSvc: Mockify<PromptService> = {
  getAllPrompt: jest.fn(),
  getPromptById: jest.fn(),
  getByCommunityId: jest.fn(),
  create: jest.fn(),
  getCommunitiesList: jest.fn(),
  getPromptsWithCommunity: jest.fn()
};

export const postsSvc: Mockify<PostsService> = {
  upsertComment: jest.fn(),
  getAllPosts: jest.fn(),
  getPostById: jest.fn(),
  upsertReaction: jest.fn(),
  removeComment: jest.fn(),
  upsertReply: jest.fn(),
  reportComment: jest.fn(),
  getAllPostsForCommunity: jest.fn(),
  checkForKeyWords: jest.fn(),
  postsHelper: jest.fn(),
  reactionHelper: jest.fn(),
  createActivityObject: jest.fn(),
  pollService: jest.fn()
};

export const mockBinder: Mockify<BinderService> = {
  getBinderByUser: jest.fn(),
  addResourceToBinder: jest.fn(),
  removeResourceFromBinder: jest.fn(),
  addArticleToBinder: jest.fn(),
  removeArticleFromBinder: jest.fn(),
  addStoryToBinder: jest.fn(),
  removeStoryFromBinder: jest.fn(),
  storyService: jest.fn(),
  addPostToBinder: jest.fn(),
  removePostFromBinder: jest.fn()
};

export const mockSearchTermSvc: Mockify<SearchTermService> = {
  getAllSearchTerms: jest.fn(),
  getAllLocalCategoriesByUser: jest.fn(),
  getUserRecommendedResources: jest.fn()
};
export const mockSnsSvc: Mockify<SnsService> = {
  addEndpoint: jest.fn()
};
export const mockSqsSvc: Mockify<SqsService> = {
  addToNotificationQueue: jest.fn()
};
export const mockLibrary: Mockify<LibraryService> = {
  getLibraryByCommunityId: jest.fn(),
  getReferenceContent: jest.fn(),
  getLibraryContent: jest.fn(),
  publicService: jest.fn()
};
export const mockCommunity: Mockify<CommunityService> = {
  getAllCommunities: jest.fn(),
  getCommunityById: jest.fn(),
  getAllCategories: jest.fn(),
  getMyCommunities: jest.fn(),
  getCommunities: jest.fn(),
  getAllCommunitiesNested: jest.fn(),
  getActivePageForCommunity: jest.fn(),
  getCommunityImage: jest.fn()
};
export const mockUserHelper: Mockify<UserHelper> = {
  buildProfilePicturePath: jest.fn(),
  getAuthor: jest.fn(),
  getActivityUser: jest.fn(),
  mongoService: jest.fn(),
  updateActivitiesDisplayName: jest.fn(),
  updateBinderDisplayName: jest.fn(),
  getUserWithoutAttributes: jest.fn(),
  setStoryPromotionReminder: jest.fn(),
  buildAdminImagePath: jest.fn()
};
export const mockReactionHelper: Mockify<ReactionHelper> = {
  updateReactionObject: jest.fn(),
  handleStoryReactions: jest.fn(),
  getReactionForCurrentUser: jest.fn(),
  createReactionObject: jest.fn(),
  createReactionCount: jest.fn()
};
export const mockCommentHelper: Mockify<CommentHelper> = {
  buildComment: jest.fn(),
  createCommentObject: jest.fn(),
  getCommentCount: jest.fn(),
  mongoSvc: jest.fn(),
  postsHelper: jest.fn(),
  reactionHelper: jest.fn(),
  getReplyStory: jest.fn(),
  emailService: jest.fn(),
  hasUserFlagged: jest.fn(),
  reportToAdmin: jest.fn(),
  getUpdateCommentQuery: jest.fn(),
  notificationHelper: jest.fn()
};
export const mockPostsHelper: Mockify<PostsHelper> = {
  addAuthor: jest.fn(),
  mapAuthorToPost: jest.fn(),
  formatPosts: jest.fn(),
  updateContent: jest.fn()
};
export const mockCommentService: Mockify<CommentService> = {
  removeComment: jest.fn(),
  flagComment: jest.fn()
};
export const mockInstallationService: Mockify<InstallationService> = {
  saveInstallations: jest.fn(),
  deleteInstallationById: jest.fn()
};
export const mockActivityService: Mockify<ActivityService> = {
  markActivityAsRead: jest.fn(),
  getUserActivity: jest.fn(),
  fetchAuthorDetails: jest.fn()
};
export const mockBlockUserService: Mockify<BlockUserService> = {
  blockUser: jest.fn(),
  myBlocks: jest.fn(),
  removeUserFromBlock: jest.fn(),
  getBlockUserIdList: jest.fn()
};
export const mockActivityHelper: Mockify<ActivityHelper> = {
  translateActivities: jest.fn(),
  handleUserActivity: jest.fn()
};
export const mockInternalService: Mockify<InternalService> = {
  getTermsOfUse: jest.fn(),
  updateTermsOfUse: jest.fn(),
  getAuth: jest.fn(),
  getMemberInfo: jest.fn(),
  validateAccessToken: jest.fn(),
  revokeAccessToken: jest.fn()
};
export const mockCommunitiesHelper: Mockify<CommunitiesHelper> = {
  getMultipleCommunities: jest.fn(),
  buildCommunity: jest.fn()
};
export const mockNotificationHelper: Mockify<NotificationHelper> = {
  notifyUser: jest.fn(),
  handleStoryActivity: jest.fn(),
  notifyAdminOnFlagStory: jest.fn()
};
export const mockLoginCommercialSvc: Mockify<LoginCommercialService> = {
  commercialMemberInfo: jest.fn(),
  formatMemberData: jest.fn(),
  memberGetContacts: jest.fn(),
  getCommercialMemberData: jest.fn()
};

export const mockLoginMedicaidSvc: Mockify<LoginMedicaidService> = {
  getMemberEligibility: jest.fn(),
  createMemberDataForGbd: jest.fn()
};

export const mockSendOtpSvc: Mockify<SendOneTimePasswordService> = {
  memberSendOtp: jest.fn()
};

export const mockValidateOtpSvc: Mockify<ValidateOneTimePasswordService> = {
  medicaidValidateOtp: jest.fn(),
  commercialValidateOtp: jest.fn()
};

export const mockForgotUserSvc: Mockify<ForgotUserService> = {
  forgotUser: jest.fn()
};

export const mockForgotUserCommercialSvc: Mockify<ForgotUserCommercialService> =
  {
    commercialForgotUser: jest.fn(),
    formatFupMemberRequest: jest.fn()
  };

export const mockForgotUserMedicaidSvc: Mockify<ForgotUserMedicaidService> = {
  medicaidForgotUser: jest.fn()
};

export const mockManageProfileSvc: Mockify<ManageProfileService> = {
  deleteProfile: jest.fn()
};

export const mockProgramSvc: Mockify<ProgramService> = {
  getServiceTags: jest.fn(),
  getProgramById: jest.fn(),
  getProgramsListByZipCode: jest.fn()
};

export const mockPostImage: Mockify<PostImageService> = {
  getPostImage: jest.fn(),
  buildPostImagePath: jest.fn(),
  setPostImage: jest.fn()
};

export const mockPartnerSvc: Mockify<PartnerService> = {
  buildPartnerResponse: jest.fn(),
  getParterLogo: jest.fn(),
  getPartnerList: jest.fn()
};

export const mockPromptSvc: Mockify<PromptService> = {
  getAllPrompt: jest.fn(),
  getPromptById: jest.fn(),
  getByCommunityId: jest.fn(),
  create: jest.fn(),
  getCommunitiesList: jest.fn(),
  getPromptsWithCommunity: jest.fn()
};

export const mockLocationSvc: Mockify<LocationService> = {
  fetchLocationDetails: jest.fn(),
  fetchPointLocationDetails: jest.fn()
};

export const mockPollSvc: Mockify<PollService> = {
  userPollResponse: jest.fn(),
  calculatePollResult: jest.fn(),
  userResponseResults: jest.fn()
};

export const mockS3Svc: Mockify<S3Service> = {
  upload: jest.fn(),
  delete: jest.fn(),
  getImage: jest.fn()
};

export const mockNFSLoader: Mockify<NSFWLoader> = {
  getNsfwModel: jest.fn()
};

export const mockGateway: Mockify<InternalGateway> = {
  getTermsOfUse: jest.fn(),
  updateAcceptedTOU: jest.fn(),
  getAuth: jest.fn(),
  getMemberInfo: jest.fn(),
  validateAccessToken: jest.fn(),
  revokeAccessToken: jest.fn()
};

export const mockAuntBerthaGateway: Mockify<AuntBerthaGateway> = {
  getToken: jest.fn(),
  getServiceTags: jest.fn(),
  getProgramById: jest.fn(),
  getProgramsListByZipCode: jest.fn()
};
