export const API_RESPONSE = {
  statusCodes: {
    200: 200,
    400: 400,
    401: 401,
    402: 402,
    403: 403,
    404: 404,
    475: 475,
    476: 476,
    477: 477,
    500: 500
  },
  success: {
    true: true,
    false: false
  },
  messages: {
    invalidIdTitle: 'Incorrect id',
    invalidIdDetail: 'This is not a valid id',
    invalidTokenTitle: 'Token not valid',
    invalidTokenDetail: 'The token is no longer valid',
    invalidUserIdDetail: 'User ID is invalid',
    invalidPostId: 'Invalid post Id',
    invalidPostIdDetail: 'Invalid post Id / Id missing',
    invalidCommentId: 'Invalid/Missing comment Id',
    invalidReplyId: 'Invalid/Missing reply Id',
    invalidUrl: 'Invalid URL',
    invalidArticleType: 'Invalid Article Provider',
    badData: 'Bad data',
    dataNotFound: 'Data not found',
    userDoesNotExist: 'User with the ID does not exists',
    adminUserNotFound:
      'User is removed/inactive. User details are no longer available.',
    invalidRoleName: 'User with the role does not exists',
    storyDoesNotExist: 'Story does not exists.',
    communityDoesNotExist: 'Community Not found with the ID',
    badModelTitle: 'Title is required',
    badModelData: 'Title and Body are required for the Push Notification',
    invalidAdminTokenDetail: 'Proper Admin token not provided',
    pageNumberMissing: 'Page number can be greater than 0 only',
    pageSizeMissing: 'Page size can not be negative',
    promptsNotFound: 'Unable to fetch prompts',
    sortInvalid: 'Sort should be 1/-1',
    invalidAuthorId: 'Author Id is not a 24 hex string',
    invalidRole: 'Author Role is missing',
    incorrectModel: 'Incorrect Model',
    postDoesNotExist: 'Post does not exists.',
    libraryDoesNotExist: 'Library does not exist.',
    invalidCommunities: 'Invalid communities',
    invalidCommunityId: 'Community Id is not valid',
    emptyCommunities: 'Communities array cannot be empty',
    postDelateFailed: 'Post delete failed',
    noPostAvailableTitle: 'Posts are not available',
    noPostAvailableDetail: 'There are no admin posts available',
    noPublishedTitle: 'Publish info is missing',
    noPublishedDetail: 'Mention the post publish status preferences',
    enterAdminLoginDetails: 'Enter Username and Password',
    invalidUserNameTitle: 'Invalid Username',
    invalidUserId: 'Invalid userId / Id missing.',
    invalidUserNameDetail:
      'User not found. Please contact the Admin for access',
    commentDoesNotExist: 'Comment does not exists.',
    storyCommentDoesNotExist: 'Story with the comment does not exists.',
    storyReplyDoesNotExist: 'Story with the reply does not exists.',
    replyDoesNotExists: 'Reply with the id does not exists',
    emptyComment: 'Comment cannot be empty',
    missingContent: 'Content is missing',
    noAvailableReaction: 'No reaction Available',
    invalidReactionTitle: 'Invalid Reaction',
    invalidReaction:
      'Reaction value does not matches with the permissible set of reactions',
    activityDoesNotExist: 'Activity does not exists',
    noAdminContent: 'Admin content Not Found',
    noAdminContentDetails: 'There is no admin type content',
    notAllowedTitle: 'Not allowed',
    notAllowedDetails: 'Not allowed to view the details.',
    notAllowedEditDetails: 'Not allowed to edit the details.',
    notAllowedDeleteDetails: 'Not allowed to delete the comment.',
    notAllowedAddDetails: 'Not allowed to add/remove admin details.',
    missignDeepLink: 'Deep link is missing',
    expiredDate: 'Push Notification cannot be scheduled to the past timestamp',
    onPremTokenError: 'Fail to get the access token',
    associateAccountDisabled: 'Associate Account Disbaled',
    associateAccountLocked: 'Associate Account is locked',
    associateDetailError: 'No associate found with the given username',
    adminUserExists: 'User with username already exists.',
    incorrectPasswordTitle: 'Invalid password',
    incorrectPasswordDetail: 'Please provide the valid password',
    invalidMimeType: 'is not a supported file type!',
    tryAgain: 'Please try again later',
    sqsFailure: 'Fail to push the message to sqs',
    internalError: 'Something went wrong',
    missingImage: 'Image is missing',
    imageNotFound: 'Image not found.',
    invalidDate: 'Invalid Date or Time',
    notAllowedCommunity: 'Communities are restricted',
    fileNotFound: 'File not found',
    uploadJsonFile: 'Please upload JSON files only',
    contentNotFound: 'Content not found',
    invalidContentKey: 'Invalid content key',
    invalidAdminCommunity: 'Admin cannot access this community',
    invalidAdminWithRole: 'Admin with role not found',
    invalidPn: 'Push Notification not found',
    invalidEdit: 'Failed to edit the push notification.',
    invalidDelete: 'Failed to delete the push notification.',
    invalidEditOperation:
      'Can not edit the cancelled / sent push notification.',
    invalidDeleteOperation:
      'Can not delete the cancelled / sent push notification.',
    invalidPersonaDetails: 'No persona found at the moment',
    invalidPNBodyTitle: 'Push notifications details are missing',
    invalidContent:
      'Please check your content for inappropriate words. Update the content and republish',
    invalidContentWithKeyWords:
      'This contains a sensitive word or phrase.\n Are you sure you want to publish this?',
    invalidlanguage: 'Please provide the valid language (en/es)',
    invalidlanguageCompatibility: 'Check the provided EN and ES Data!',
    duplicateId: 'Duplicate ID',
    updateFailedTitle: 'Failed to update',
    updateFaileDetail: 'Failed to update the content data',
    userSearchFail: 'Failed to fetch user',
    badPNDate: 'PN Data is not able to create.',
    agendaError: 'Agenda instance is not present.',
    jobNotFound: 'The Job with the given Id is not found',
    serverError: 'Something went wrong'
  }
};

export const deletedCommentMessage = 'This comment has been removed.';
export const selfDeletedCommentMessage =
  'This comment has been removed by author.';
export const deletedReplyMessage = 'This reply has been removed.';
export const selfDeletedReplyMessage = 'This reply has been removed by author.';

export const collections = {
  ALERT: 'Alert',
  BINDER: 'Binder',
  COMMUNITY: 'Community',
  LIBRARY: 'Library',
  QUESTIONS: 'Questions',
  STORY: 'Story',
  USERS: 'Users',
  BLOCKED: 'Blocked',
  ACTIVITY: 'Activity',
  APPVERSION: 'AppVersion',
  SEARCHTERM: 'SearchTerms',
  POSTS: 'Posts',
  ADMINUSERS: 'AdminUsers',
  INSTALLATIONS: 'Installations',
  ADMINACTIVITY: 'AdminActivity',
  CONTENT: 'Content',
  SCHEDULED_JOB: 'ScheduledJobs',
  DEMOUSERS: 'DemoUsers',
  ADMINROLES: 'AdminRoles',
  PARTNERS: 'Partners',
  POLLRESPONSE: 'PollResponse',
  POSTIMAGES: 'PostImages',
  PROFILEIMAGES: 'ProfileImages',
  PROMPT: 'Prompt',
  ADMINUSERIMAGES: 'AdminUserImages',
  COMMUNITYIMAGES: 'CommunityImages',
  APP_CONFIG: 'AppConfig'
};

export enum GenderPronoun {
  he = 'he',
  she = 'she',
  they = 'they'
}

export enum GenderPronounPossessive {
  his = 'his',
  her = 'her',
  their = 'their'
}

export const mongoDbTables = {
  users: {
    id: '_id',
    createdAt: 'createdAt',
    username: 'username',
    phoneNumber: 'phoneNumber',
    profilePicture: 'profilePicture',
    active: 'active',
    myCommunities: 'myCommunities',
    myCommunitiesValue: '$myCommunities',
    onBoardingState: 'onBoardingState',
    displayName: 'displayName',
    meTabHelpCardBanner: 'meTabHelpCardBanner',
    localServiceHelpCardBanner: 'localServiceHelpCardBanner',
    communityHelpCardBanner: 'communityHelpCardBanner',
    memberType: 'memberType',
    optInMinor: 'optInMinor',
    deleteRequested: 'deleteRequested',
    lastLoginAt: 'lastLoginAt',
    communityNotificationFlag: 'attributes.communityNotificationFlag',
    reactionNotificationFlag: 'attributes.reactionNotificationFlag',
    commentReactionNotificationFlag:
      'attributes.commentReactionNotificationFlag',
    replyNotificationFlag: 'attributes.replyNotificationFlag',
    commentNotificationFlag: 'attributes.commentNotificationFlag',
    maternityNotificationFlag: 'attributes.dueDateBasedNotificationFlag',
    tou: 'tou',
    touVersion: 'version',
    touNotifiedAt: 'notifiedAt'
  },
  community: {
    id: '_id',
    createdDate: 'createdDate',
    category: 'category',
    createdBy: 'createdBy',
    categoryId: 'categoryId',
    title: 'title',
    displayName: 'displayName',
    image: 'image',
    active: 'active'
  },
  prompt: {
    id: '_id',
    createdDate: 'createdDate',
    communityId: 'communityId'
  },
  story: {
    id: '_id',
    createdAt: 'createdAt',
    createdDate: 'createdDate',
    removed: 'removed',
    published: 'published',
    flagged: 'flagged',
    authorId: 'authorId',
    author: 'author.id',
    communityId: 'communityId',
    answer: 'answer',
    comments: 'comments',
    replies: 'replies',
    reactions: 'reaction',
    updateDate: 'updatedDate',
    commentId: 'comments._id',
    storyOuterFilter: 'outer._id',
    storyInnerFilter: 'inner._id',
    commentMsg: 'comments.$.comment',
    commentDeeplink: 'comments.$.deeplink',
    postReplies: 'comments.$.replies',
    commentUpdatedAt: 'comments.$.updatedAt',
    commentRemoved: 'comments.$.removed',
    commentFlagged: 'comments.$.flagged',
    commentRemovedBy: 'comments.$.removedBy',
    storyCommentFilter: 'comments.$[outer].replies.$[inner].comment',
    storyCommentAuthorFilter: 'comments.$[outer].replies.$[inner].author',
    storyDateFilter: 'comments.$[outer].replies.$[inner].updatedAt',
    replyDeeplink: 'comments.$[outer].replies.$[inner].deeplink',
    replyRemoved: 'comments.$[outer].replies.$[inner].removed',
    replyFlag: 'comments.$[outer].replies.$[inner].flagged',
    replyRemovedBy: 'comments.$[outer].replies.$[inner].removedBy',
    replyUpdatedAt: 'comments.$[outer].replies.$[inner].updatedAt',
    hasStoryBeenPublishedOnce: 'hasStoryBeenPublishedOnce',
    commentAuthor: 'comments.$.author',
    commentAuthorId: 'comments.author.id',
    replyAuthorId: 'comments.replies.author.id',
    commentAuthors: 'commentAuthors',
    replyAuthors: 'replyAuthors',
    publishedAt: 'publishedAt'
  },
  question: {
    id: '_id',
    createdDate: 'createdDate',
    userId: 'userId',
    storyId: 'storyId',
    answered: 'answered',
    read: 'read',
    answeredDateTime: 'answeredDateTime',
    answerText: 'answerText',
    profilePicture: 'profilePicture',
    authorAge: 'authorAge',
    recipient: 'recipient'
  },
  library: {
    id: '_id',
    communityId: 'communityId'
  },
  activity: {
    id: '_id',
    userId: 'userId',
    activityList: 'activityList',
    activityInitiator: 'activityInitiator',
    createdDate: 'activityCreatedDate'
  },
  blocked: {
    id: '_id',
    blockingUser: 'blockingUser',
    blockedUser: 'blockedUser'
  },
  profileImages: {
    userId: 'userId',
    profileImageBase64: 'profileImageBase64'
  },
  alert: {
    id: '_id',
    userId: 'userId',
    unreadSentQuestions: 'unreadSentQuestions'
  },
  pollResponse: {
    id: '_id',
    postId: 'postId',
    userResponse: 'userResponse'
  },
  posts: {
    id: '_id',
    author: 'author',
    communities: 'communities',
    communitiesValue: '$communities',
    authorRole: 'author.role',
    authorId: 'author.id',
    content: 'content',
    contentEn: 'content.en',
    contentEs: 'content.es',
    pnDetails: 'content.pnDetails',
    published: 'published',
    flagged: 'flagged',
    removed: 'removed',
    editedAfterPublish: 'editedAfterPublish',
    createdDate: 'createdDate',
    createdBy: 'createdBy',
    createdByValue: '$createdBy',
    updatedBy: 'updatedBy',
    updateDate: 'updatedDate',
    hasContentBeenPublishedOnce: 'hasContentBeenPublishedOnce',
    isNotify: 'isNotify',
    comments: 'comments',
    replies: 'replies',
    reactions: 'reactions',
    postReplies: 'comments.$.replies',
    commentCount: 'commentCount',
    commentId: 'comments._id',
    commentFlag: 'comments.flagged',
    commentMsg: 'comments.$.comment',
    commentUpdatedAt: 'comments.$.updatedAt',
    commentFlagged: 'comments.$.flagged',
    commentRemoved: 'comments.$.removed',
    commentOuterRemoved: 'comments.$[outer].removed',
    commentOuterRemovedBy: 'comments.$[outer].removedBy',
    commentOuterUpdated: 'comments.$[outer].updatedAt',
    commentOuterFlag: 'comments.$[outer].flagged',
    commentDeeplink: 'comments.$.deeplink',
    replyFlagged: 'comments.$[outer].replies.$[inner].flagged',
    replyRemoved: 'comments.$[outer].replies.$[inner].removed',
    replyRemovedBy: 'comments.$[outer].replies.$[inner].removedBy',
    replyInnerRemoved: 'inner.removed',
    poll: 'poll',
    postCommentReaction: 'comments.$.reactions',
    postReplyReaction: 'comments.$.replies.reactions',
    postCommentFilter: 'comments.$[outer].replies.$[inner].comment',
    postDateFilter: 'comments.$[outer].replies.$[inner].updatedAt',
    postReplyReactionFilter: 'comments.$[outer].replies.$[inner].reactions',
    postOuterFilter: 'outer._id',
    postInnerFilter: 'inner._id',
    postImage: 'content.image',
    publishedAt: 'publishedAt',
    replyDeeplink: 'comments.$[outer].replies.$[inner].deeplink',
    commentAuthorId: 'comments.author.id',
    replyAuthorId: 'comments.replies.author.id',
    commentAuthors: 'commentAuthors',
    replyAuthors: 'replyAuthors',
    body: 'body',
    title: 'title',
    pnBody: 'pnBody',
    pnTitle: 'pnTitle',
    link: 'content.link',
    publishOn: 'publishOn',
    status: 'status',
    postIdValue: 'post.id'
  },
  adminUser: {
    id: '_id',
    username: 'username',
    role: 'role',
    firstName: 'firstName',
    lastName: 'lastName',
    displayName: 'displayName',
    displayTitle: 'displayTitle',
    profileImage: 'profileImage',
    aboutMe: 'aboutMe',
    interests: 'interests',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLogInAt: 'lastLogInAt',
    active: 'active',
    isPersona: 'isPersona',
    removed: 'removed',
    communities: 'communities'
  },
  installations: {
    id: '_id',
    userId: 'userId',
    devices: 'devices',
    deviceToken: 'devices.deviceToken',
    endpointArn: 'devices.endpointArn',
    badge: 'devices.$.badge'
  },
  adminActivity: {
    id: '_id',
    userId: 'userId',
    list: 'list',
    activityId: 'list._id',
    activityIsRead: 'list.$.isRead',
    activityUpdatedAt: 'list.$.updatedAt'
  },
  content: {
    id: '_id',
    communityId: 'communityId',
    communityIdFilter: 'filter.communityId',
    communityContentDescription:
      'data.helpfulInfoModule.$[filter].sections.sectionIndex.content.subSectionIndex.description', //Index to be replaced
    communityContentTitle:
      'data.helpfulInfoModule.$[filter].sections.sectionIndex.content.subSectionIndex.title', //Index to be replaced
    communitySectionDescription:
      'data.helpfulInfoModule.$[filter].sections.index.description', //Index to be replaced
    communitySectionTitle:
      'data.helpfulInfoModule.$[filter].sections.index.title', //Index to be replaced
    contentType: 'contentType',
    createdAt: 'createdAt',
    createStoryModule: 'data.createStoryModule',
    createStoryModuleValue: 'data.createStoryModule.$',
    helpfulInfoIdFilter: 'filter.helpfulInfoId',
    helpfulInfoModule: 'data.helpfulInfoModule',
    helpfulInfoModuleValue: 'data.helpfulInfoModule.$',
    helpfulInfoModuleTitle: 'data.helpfulInfoModule.$.title',
    helpfulInfoModuleDescription: 'data.helpfulInfoModule.$.description',
    language: 'language',
    linkSection: 'data.sections',
    linkSectionId: 'data.sections.sectionId',
    linkSectionObject: 'data.sections.$',
    sections: 'data.helpfulInfoModule.$[filter].sections',
    subSectionDescription: 'data.helpfulInfoModule.$[filter].description',
    subSectionTitle: 'data.helpfulInfoModule.$[filter].title',
    subSectionHeaderDescription:
      'data.helpfulInfoModule.$[filter].headerDescription',
    subSectionHeaderTitle: 'data.helpfulInfoModule.$[filter].headerTitle',
    prompts: 'prompts',
    promptsFilter: 'data.createStoryModule.$[filter].prompts',
    version: 'version',
    deepLink: 'deepLink',
    updatedAt: 'updatedAt',
    helpfulInfoId: 'helpfulInfoId',
    libraryId: 'data.helpfulInfoModule.$.helpfulInfoId',
    helpfulInfoIdData: 'data.helpfulInfoModule.helpfulInfoId',
    helpfulInfoModuleData: 'data.helpfulInfoModule.$',
    isCommon: 'isCommon',
    data: 'data.deepLinkModule',
    contentKey: 'contentKey',
    deepLinkModuleSection: 'data.deepLinkModule.$.sections',
    pushNotificationTemplate: 'pushNotificationTemplate'
  },
  scheduledJobs: {
    id: '_id',
    isSent: 'data.isSent',
    updatedAt: 'data.updatedAt',
    data: 'data',
    author: 'data.author',
    authorId: 'data.author.id',
    communities: 'data.communities',
    body: 'data.body',
    removed: 'data.removed',
    name: 'name',
    disabled: 'disabled',
    postId: 'data.postId',
    title: 'data.title'
  },
  binder: {
    binderPostsAuthorDisplayName: 'binderPosts.$[id].author.displayName',
    binderPostsAuthorProfileImage: 'binderPosts.$[id].author.profileImage',
    binderPostsId: 'binderPosts.postId',
    binderPostsIdFilter: 'id.postId',
    binderPostsTitle: 'binderPosts.$[id].title'
  },
  adminRoles: {
    id: '_id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    updatedBy: 'updatedBy',
    role: 'role',
    permissions: 'permissions'
  },
  postImages: {
    id: '_id',
    postId: 'postId',
    postImageBase64: 'postImageBase64',
    isLinkImage: 'isLinkImage'
  },
  adminUserImages: {
    id: '_id',
    adminId: 'adminId',
    imageBase64: 'imageBase64'
  },
  communityImage: {
    id: '_id',
    communityId: 'communityId',
    imageBase64: 'imageBase64'
  },
  partners: {
    id: '_id',
    title: 'title',
    logoImage: 'logoImage',
    active: 'active',
    articleImage: 'articleImage',
    type: 'type'
  },
  appVersion: {
    touNotifiedAt: 'touNotifiedAt'
  },
  appConfig: {
    type: 'type',
    env: 'env',
    project: 'project',
    version: 'version',
    configDetails: 'configDetails'
  }
};

export const BASE_URL_EXTENSION = {
  ACTIVITY: '/activity',
  LIBRARY: '/library',
  CONTENT: '/content',
  DASHBOARD: '/dashboard',
  IMAGE: '/image',
  METRICS: '/metrics',
  PARTNERS: '/partners',
  PROMPTS: '/prompts',
  PUSH_NOTIFICATION: '/notify',
  STORY: '/story',
  APP_VERSION: '/appVersion',
  ROLE: '/role',
  USER: '/user',
  HELPFULINFO: '/helpfulInfo'
};

export const ADMIN_END_POINTS = {
  REMOVE_STORY: 'admin/story/remove/',
  REMOVE_STORY_FLAG: 'admin/story/removeFlag/',
  BAN_USER: 'admin/users/ban/'
};

export enum KEYS {
  AES_ALGO = 'aes-256-cbc',
  AES_256_ECB = 'aes-256-ecb',
  AES_256_GCM = 'aes-256-gcm',
  B64 = 'base64',
  UTF16 = 'utf16le',
  UTF8 = 'utf8',
  SHA1 = 'sha1',
  HEX = 'hex',
  MD5 = 'md5',
  SECRET = 'I AM SHERLOCKED',
  DELAY = '15 minute'
}

export enum variableNames {
  BAMBOO_SECRET = 'bamboo_password',
  ENV_FILE_PATH = './variables/.env',
  ASSIGNMENT = '=',
  HTTPS = 'https',
  COMMUNITIES = 'communities'
}

export const SWAGGER_API_DOCS = {
  GLOBAL_FILEPATH: '/usr/src/app/api/adminresources/swagger/swagger.json',
  FILEPATH: 'api/adminresources/swagger/swagger.json'
};

export const METRICS = {
  usersCount: 'Users count',
  usersByCommunity: 'Number of Users by Community',
  usersJoinedMoreThanOneCommunity:
    'Number of Users who joined one or more # of communities',
  storiesCount: 'Total number of Stories',
  publishedStoriesCount: 'Number of Published Stories',
  unPublishedStoriesCount: 'Number of Unpublished Stories',
  storiesPerCommunity: 'Number of Published Stories by Community',
  unPublishedStoriesPerCommunity: 'Number of Unpublished Stories by Community',
  usersOptedForPn: 'Number of Users opted into Push Notifications'
};

export enum NotificationMessages {
  PostTitle = 'New post available',
  PostBody = 'A new post has been shared to your community.',
  PostContent = 'Has shared a post to your community',
  ReplyTitle = 'New reply received',
  ReplyTitleStory = 'New comment received',
  ReplyContent = 'Has replied to your comment',
  ReplyAdvocate = 'A Community Advocate has replied to your comment',
  ReactionTitle = 'New reaction received',
  ReactionContent = 'Has reacted to your comment',
  ReactionContentStory = 'Has reacted to your story',
  ReactionAdvocate = 'A Community Advocate has reacted to your comment',
  ReactionAdvocateStory = 'A Community Advocate has reacted to your story',
  RemoveTitle = 'Flagged comment removed',
  RemoveBody = 'Has removed your flagged comment',
  RemoveAdvocate = 'A Community Advocate has removed your flagged comment',
  CommentStoryContent = 'Has commented on your story',
  CommentStoryAdvocate = 'A Community Advocate has commented on your story',
  storyComment = 'A recent comment violated our community participation guidelines and has been removed',
  storyReply = 'A recent reply violated our community participation guidelines and has been removed',
  storyContentModeration = 'A recent story violated our community participation guidelines and has been removed',
  pollClosingSoonTitle = 'Poll is closing soon',
  pollClosingSoonBody = 'A poll in your community is closing soon. Your reply is helpful to other members, so please submit your vote today!',
  pollClosingSoonActivity = 'Vote now',
  pollClosedTitle = 'Poll is now closed. View the results',
  pollClosedBody = 'The final results of a poll are now in. Select the link below to review the final results.',
  pollClosedActivity = 'View results'
}

export enum AdminNotifyMessages {
  RoleUpdated = 'Has changed admin', // <adminUser>'s role to <newRole>
  SelfRoleUpdate = 'Has changed your role to', // <new role>
  CommunityChanged = 'Has changed assigned communities of admin', // <adminUser>'s.
  SelfCommunityChanged = 'Has changed your assigned communities',
  DeletedUser = 'Has removed the admin', // <adminUser>.
  UserAdded = 'Added a new admin' // <adminUser> as <role>.
}

export enum EmailContentMessages {
  sensitiveWords = 'Attention Required: Key Word or Phrase used by Advocate',
  sensitiveWordActivityLine = 'Sensitive Keyword or Phrase used by Advocate in'
}

export enum NotificationStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  RETRY = 'retry',
  NEW = 'new'
}

export enum NotificationType {
  STORY = 'story',
  QUESTION = 'question',
  ANSWER = 'answer',
  ARTICLE = 'article',
  REACTION = 'reaction',
  ADMINPOST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
  ADHOC = 'adhoc',
  ADMINUSER = 'adminUser',
  ADHOC_TEMPLATE = 'adhocTemplate'
}

export enum LinkedTexts {
  touText = 'community participation guidelines'
}

export enum SQSParams {
  ACTIVITY_MESSAGE_GROUP_ID = 'ACTIVITY',
  STORY_MESSAGE_GROUP_ID = 'STORY',
  GENERIC_MESSAGE_GROUP_ID = 'GENERIC',
  DELETE_PROFILE_MESSAGE_GROUP_ID = 'DELETE-PROFILE',
  EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION'
}

export enum NotificationDeepLink {
  ACTIVITY = 'activity',
  STORY = 'story'
}

export enum ReactionEnum {
  REACTION_LIKE = 'like',
  REACTION_CARE = 'care',
  REACTION_CELIBRATE = 'celebrate',
  REACTION_GOOD_IDEA = 'good_idea'
}

export enum PostResponse {
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
  REMOVE = 'remove',
  STORY = 'story'
}

export enum AdminRole {
  scadmin = 'scadmin',
  scadvocate = 'scadvocate',
  sysadmin = 'sysadmin'
}

export enum SuperAdminRole {
  scadmin = 'scadmin',
  sysadmin = 'sysadmin'
}

export enum requestName {
  ON_PREM_TOKEN = 'onPremAccessToken',
  WEB_USER_SEARCH = 'webUserSearch',
  MEMBER_AUTHENTICATE = 'memberAuthenticate'
}

export const associateInfo = {
  STATUS: 'approved',
  REPOSITORY_ENUM: 'IAM',
  USER_ROLE_ASSOCIATE: 'ASSOCIATE',
  USER_ROLE_NON_ASSOCIATE: 'NONASSOCIATE',
  APPLICATION: 'SYDCOM',
  APPLICATION_NAME: 'GBD',
  GBD_MEMBER: 'CN=gbdMSS'
};

export enum headers {
  API_KEY = 'apikey',
  AUTHORIZATION = 'Authorization',
  BASIC = 'Basic',
  BEARER = 'Bearer',
  CONTENT_TYPE = 'Content-Type',
  CONTENT_VALUE = 'application/x-www-form-urlencoded',
  BODY_VALUE = 'grant_type=client_credentials&scope=public',
  TLS_VERSION = 'TLSv1.2'
}

export const scheduleOptions = {
  concurrency: 2,
  lockLimit: 2,
  priority: 0,
  shouldSaveResult: true
};

export const scheduledPushNotification = 'ScheduledPushNotification';

export const scheduledWeeklyNotification = 'CommunityPushNotification';

export const maternityNotificationTemplateNaPrefix = 'maternityNotification-';

export const scheduledPollClosingSoonNotification = 'PostPollClosingSoon';

export const scheduledPollClosingNotification = 'PostPollClosed';

export const scheduledPost = 'ScheduledPost';

export const contentType = 'admin';

export const roles = ['scadmin', 'scadvocate', 'sysadmin'];

export const reactions = ['like', 'celebrate', 'care', 'good_idea', 'remove'];

export const communityType = ['clinical', 'non-clinical'];

export const noCommunity = 'noCommunity';

export enum AdminDisplayTitle {
  scadmin = 'Sydney Community',
  scadvocate = 'Community Advocate',
  sysadmin = 'System Admin'
}

export const allowedMimeTypes = [
  'jpeg',
  'jpg',
  'png',
  'image/png',
  'image/jpg',
  'image/jpeg'
];

export const allowedContentKeys = ['contentType', 'version', 'language'];

export const contentTypeKeys = ['wordList', 'public', 'generic', 'trainingLinks'];

export const MEMBER_TYPE = {
  SYDNEY_HEALTH: 'eMember',
  GBD_MEMBER: 'gbdMSS'
};

export const storyType = ['flagged', 'published', 'removed', 'all'];

export const contentKeys = {
  createStoryModule: 'createStoryModule',
  prompts: 'prompts',
  english: 'en',
  deepLink: 'deepLink',
  helpfulInfo: 'helpfulInfo',
  helpfulInfoKey: 'helpfulInfoModule',
  spanish: 'es',
  tou: 'tou',
  trainingLinks: 'trainingLinks',
  wordList: 'wordList',
  pushNotification: 'pushNotification'
};

export const schedulePNStatus = {
  SCHEDULED: 'Scheduled',
  CANCELLED: 'Cancelled',
  SENT: 'Sent'
};

export const schedulePostStatus = {
  DRAFT: 'Draft',
  SCHEDULED: 'Scheduled',
  CANCELLED: 'Cancelled',
  PUBLISHED: 'Published'
};

export const publicContent = {
  contentType: 'public',
  preLoginModule: 'preLoginModule'
};

export const brands = {
  commercial: 'Sydney Health'
};

export const genericQueryValue = {
  all: '$all',
  count: 'count',
  idValue: '$_id',
  greaterThanEqual: '$gte',
  group: '$group',
  match: '$match',
  notIn: '$nin',
  lessThan: '$lt',
  size: '$size',
  sum: '$sum'
};

export const articleProvider = ['healthwise', 'meredith', 'other'];

export const batchSize = 50;

export const articleType = ['HWReference', 'HWVideoReference', 'HWVideo'];

export const articleSubsectionType = [
  'HWTopic',
  'HWBTNVideoList',
  'HWBTNCaregiverList'
];

export const articleLiterals = {
  articleType: 'HWReference',
  healthwise: {
    articlePath: '/v2/healthWise/articleTopic/',
    media: 'hwMedia',
    mediaBody: 'hwmediabody',
    mediaImage: 'image',
    mediaImageSection: 'hwimagesection',
    video: 'hwVideo',
    videoPath: '/v2/healthWise/videoTopic/'
  },
  libraryPath: {
    topic: '/v2/library/content/'
  },
  videoType: 'HWVideoReference',
  meredithVideo: 'video'
};

export const DB_OPTIONS = {
  options: {
    'sslValidate': true,
    'useUnifiedTopology': true,
    'retryWrites': false
  },
  certPath: '/database.pem',
  dbEndpoint: '?ssl=true&replicaSet=rs0&readpreference=secondaryPreferred',
  tlsEndPoint: '?tls=true&tlsCAFile=libs/database/database.pem&replicaSet=rs0&readpreference=secondaryPreferred',
  version: 'AWSCURRENT'
};

export const awsSecretDetails = {
  dev: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/dev'
  },
  sit: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/sit'
  },
  perf: {
    roleArn: 'arn:aws:iam::995597582036:role/gld-sydcom-devrole',
    secretName: 'db/perf'
  },
  uat: {
    roleArn: 'arn:aws:iam::995597582036:role/gld-sydcom-devrole',
    secretName: 'db/uat'
  },
  prod: {
    roleArn: 'arn:aws:iam::471877298535:role/plat-sydcom-devrole',
    secretName: 'sydcom/prod'
  },
  dr: {
    roleArn: 'arn:aws:iam::471877298535:role/plat-sydcom-devrole',
    secretName: 'sydcom/dr'
  },
  profile: 'slvr-sydcom',
  roleSessionName: 'session1',
  durationSeconds: 900,
  apiVersion: 'latest',
  region1: 'us-east-1',
  region2: 'us-east-2'
};

export const maternityCommunity = 'Maternity';
