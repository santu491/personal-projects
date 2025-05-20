export const API_RESPONSE = {
  statusCodes: {
    200: 200,
    400: 400,
    401: 401,
    402: 402,
    403: 403,
    433: 433, //Inappropriate Images
    404: 404,
    417: 417,
    422: 422,
    451: 451,
    470: 470,
    471: 471,
    472: 472,
    473: 473,
    474: 474,
    475: 475,
    476: 476,
    500: 500
  },
  success: {
    true: true,
    false: false
  },
  messages: {
    auntBerthaNoResponseDetailedError:
      'There has been an error obtaining a response from AuntBertha service.',
    auntBerthaNoResponseTitle: 'AuntBertha API error',
    healthWiseNoResponseDetailedError:
      'There has been an error obtaining a response from HealthWise service.',
    healthWiseNoResponseTitle: 'HealthWise API error',
    healthWiseDataDeleted: 'HealthWise content is not present',
    healthWiseDataDeletedDetail: 'HealthWise content is removed from the collection',
    serverError: 'Internal Server Error',
    notFound: 'Not Found',
    auntBerthaNoProgramsFound: 'No programs found',
    noDocumentFound: 'No document found',
    providerNullResultErrorDetail: 'Error getting provider information',
    noDataResponseTitle: 'No Data',
    noDataResponseDetail: 'No Data found for given request',
    noZipcodeTitle: 'No zipcode',
    noZipcodeDetail: 'Zipcode is not provided',
    invalidZipCode: 'Invalid ZipCode',
    zipCodeMinDigitsError: 'ZipCode has to be 5 digits long',
    zipCodeNumberError: 'ZipCode has to be only numbers',
    stateCodeError: 'State Code has to be 2 letters only',
    noLatLongTitle: 'No Latitude or Longitude',
    noLatLongeDetail: 'Latitude or Longitude is not provided',
    noProviderIdTitle: 'No Provider Id',
    noProviderIdDetail: 'Provider Id is not provided',
    noWebsiteTitle: 'No Website',
    noWebsiteDetail: 'Website is not provided',
    noPhoneNumberTitle: 'No Phone Number',
    noPhoneNumberDetail: 'No Phone Number provided',
    noProgramIdTitle: 'No Program Id',
    noProgramIdDetail: 'Program Id is not provided',
    noServiceTagTitle: 'No Service Tag',
    noServiceTagDetail: 'ServiceTag is not provided',
    noAttributeTagTitle: 'No Attribute Tag',
    noAttributeTagDetail: 'AttributeTag is not provided',
    noTermsOrTagsTitle: 'No Terms, AttributeTags, or ServiceTags',
    noTermsOrTagsDetail:
      'At least one Term(s), AttributeTag or ServiceTag must be provided.',
    noReferralIdTitle: 'No Referral Id',
    noReferralIdDetail: 'Referral Id is not provided',
    noReferralStatusTitle: 'No Referral Status',
    noReferralStatusDetail: 'Referral Status is not provided',
    referralApiErrorTitle: 'Referral API Error',
    noPhoneOrEmailTitle: 'No Phone or Email',
    noPhoneOrEmailDetail: 'No Phone or Email is provided',
    noIdDetail: 'ID is required',
    noUserNameTitle: 'No Username',
    noUserNameDetail: 'Username field is empty',
    noSecurityAnswer: 'secretAnswerText1 is required field!',
    noPasswordTitle: 'No Password',
    noPasswordDetail: 'Password field is empty',
    noSufficientDataTwoFATitle: 'Insufficient mandatory data',
    noSufficientDataTwoFAStatusDetail: 'FirstNm, LastNm, dob and hcid are the required fields!',
    noSufficientFupDetail: 'fname, lname, dob and hcid/email/employeeId are the required fields!',
    noSufficientDataLoginTreatDetail: 'usernm, model, Ip address are the required fields!',
    noOtpDetail: 'OTP is not provided in request!',
    noBrandCodeDetail: 'brandcode details are not present in request.',
    noContactDetails: 'ContactUid/recoveryContact is required field!',
    noEmailTextChannel: 'Channel is required fields!',
    noSaveDeviceFlag: 'saveDeviceOrCookieFlag is not present in request!',
    noCookieInRequest: 'cookieValue is not available or mismatch!',
    customErrorTitle: 'something went wrong!',
    arnUpdateErrorTitle: 'Recovery contact update failed!',
    arnUpdateErrorDetails: 'Invalid phoneNumber/phoneType provided or Internal APIs are failing!',
    profileSecretUpdateError: 'Internal API failing, Please check current and new credentials once!',
    commercialCurrentPasswordError: 'Current credtials are incorrect!',
    commercialNewPasswordError: 'New credentials should not same as current credentials!',
    commercialCredentialsMatchError: 'New password and confirm password does not match!',
    contactNumberDetails: 'Recovery number is not available for now, Please check with other options.',
    otpValidation: 'OTP must match a six digits value and can not use old one!',
    fupUpdateIssue: 'Failed to update now, try again',
    otpSend: 'Incorrect communication channel or details provided!',
    validateQA: 'User not found or security answers mismatch!',
    badModelTitle: 'Incorrect model',
    invalidIdTitle: 'Incorrect id',
    invalidIdDetail: 'This is not a valid id',
    authorDoesNotExist: 'The author does not exist in the database',
    communityDoesNotExist: 'The community does not exist in the database',
    userDoesNotExist: 'User does not exist',
    updateSecretQAErroeTitle: 'Update secret questions not completed',
    updateSecretQAErroeDetails: 'Improper payload passed or Internal APIs failing while update',
    userDoesNotExistInMarket: 'User does not exist in respective market or marketing brand mismatch',
    internalServerError: 'Internal server error as internal APIs are failing',
    internalServerOtpError: 'Internal server error while sending OTP',
    contactAPIFailure: 'Failed to get contact details',
    accountDisabled: 'User account is disabled',
    accountLocked: 'User account is Locked',
    profilePictureNotBase64: 'Profile Picture is not Base-64 type',
    invalidCommunityId: 'Community Id is not a 24 hex string',
    invalidIds: 'Invalid Category Id(s)',
    badData: 'Bad data',
    storyDoesNotExist: 'Story does not exist',
    installationDoesNotExist: 'Installation does not exist',
    promptDoesNotExist: 'Prompt does not exist',
    promptQuestionEmpty: 'Prompt Question is empty',
    userQuestionEmpty: 'User Question is empty',
    incorrectPasswordTitle: 'Incorrect username or password',
    incorrectPasswordDetail: 'The username or password provided is incorrect',
    userIsInCommunity: 'User is already in this community',
    userIsNotInCommunity: 'User is not in this community',
    userCanPostOneStoryPerCommunity:
      'User can post only one story per community',
    userNameAlreadyExistsDetail:
      'UserName already exists. Kindly choose a new UserName',
    phoneNumberAlreadyExistsDetail:
      'PhoneNumber already exists. Kindly choose a new PhoneNumber',
    phoneNumberDoesNotMatchDetail:
      'PhoneNumber provided does not match with phoneNumber in DB ',
    authorEditStoryQuestionsEnforcementDetail:
      'Only the Author of the story can answer questions to the story',
    authorRemovePromptEnforcementDetail:
      'Only the Author of the story can remove prompts from the story',
    authorUpdateStoryEnforcementDetail:
      'Only the Author of the story can update their story',
    invalidAnswer: 'Answer cannot be empty',
    questionNotPresent: 'Question does not exist',
    authorCannotAskQuestionInOwnStory:
      'Author Cannot Ask Question in Own Story',
    questionNotAnswered:
      'Cannot mark answer to a question as read if the question has not been answered.',
    displayNameMisMatch:
      'DisplayName does not match with stored firstName or displayName',
    onlyAuthorCanMarkQuestionAsRead:
      'Only Author of the story can mark question as read',
    storyDoesNotExistInProvidedCommunity:
      'Story does not exist in the provided Community',
    authorCannotAnswerOwnQuestion: 'Author Cannot Answer Own Question',
    questionNotPartOfStory: 'Question does not exist in provided Story',
    promptAndStoryAreDifferentCommunities:
      'Prompts CommunityId and Storys CommunityId must be same',
    postAlreadyExistsInBinder: 'Post already exists in Binder',
    postDoesNotExistInBinder: 'Post does not exist in Binder',
    storyAlreadyExistsInBinder: 'Story already exists in Binder',
    storyDoesNotExistInBinder: 'Story does not exist in Binder',
    articleAlreadyExistsInBinder: 'Article already exists in Binder',
    resourceAlreadyExistsInBinder: 'Resource already exists in Binder',
    resourceDoesNotExistInBinder: 'Resource does not exist in Binder',
    articleDoesNotExistInBinder: 'Article does not exist in Binder',
    userCannotAddOwnStoryToBinder: 'User cannot add their own story to Binder',
    dateOfBirthRangeErrorDetail:
      'Date of Birth has to be such that calculated age is in the range 18-130',
    emptyFilter: 'Filters cannot be empty',
    userHasNoAssociatedBinder: 'User has no associated binder',
    userHasNoAssociatedCommunity: 'User has no associated community',
    unauthorized: 'User Unauthorized',
    onlyQuestionAuthorCanMarkAnswerAsRead:
      'Only Question author can mark answer to Question as Read',
    libraryDoesNotExist: 'Library Does Not Exist',
    bucketDoesNotExist: 'Bucket does not exist',
    failedContentModTitle: 'Content moderation issue',
    failedContentModReasonImage: 'Image failed content moderation',
    failedContentModReasonText: 'Text failed content moderation',
    accessTokenFailure: 'Issue in getting Access Token',
    gbdSummaryFailure: 'Failed to get GBD member summary',
    eligibilityFailure: 'Failed to get member Eligibility',
    memberDataFailure: 'Failed to get member Data',
    userNotActiveTitle: 'User not active',
    userNotActiveMessage: 'This user is not active and has read only access',
    userNotFound: 'No user is found as per the search!',
    promptNotInStory: 'Prompt is not present in story',
    atleastOnePromptRequiredPerStory:
      'Atleast one prompt required for story. Cannot delete prompt',
    invalidTokenTitle: 'Token not valid',
    invalidTokenDetail: 'The token is no longer valid',
    storyCreated: 'Story created successfully',
    questionCreated: 'Question created successfully',
    answerCreated: 'Answer created successfully',
    dbError: 'Error in Database',
    emptyTokenTitle: 'Token is empty',
    emptyTokenDetail: 'An Auth token is needed',
    storyNotPublished: 'Story is not published',
    contentModerationError: 'ContentModerationError',
    storyOrPromptMissing: 'Story or Prompt Missing',
    invalidUserIdDetail: 'This is not a valid User ID',
    invalidStoryId: 'StoryId is not a 24 hex string',
    invalidAuthorId: 'AuthorId is not a 24 hex string',
    invalidPostId: 'PostId is not a 24 hex string',
    invalidPromptId: 'PromptId is not a 24 hex string',
    storyIdRequired: 'StoryID incorrect, this value is required',
    communityIdRequired: 'CommunityID incorrect, this value is required',
    authorIdRequired: 'AuthorID incorrect, this value is required',
    featuredQuoteRequired: 'Featured quote is required',
    storyTextRequired: 'StoryText is required',
    atleastPromptIsRequired: 'Atleast one prompt is required to create a story',
    relationRequired: 'Relation is required',
    authorAgeRequired: 'Age of author when the story began is required',
    authorRelativeAgeRequired:
      'Age of author\'s relative when the story began is required',
    ageRestrictionTitle: 'Age Restriction',
    ageRestrictionDetail:
      'Sorry, you must be at least 14 years old to join Sydney Community.',
    notInAgeRange: 'Age has to be in the range 1 - 150',
    questionRequired: 'Question cannot be empty when creating/updating a story',
    answerRequired: 'Answer cannot be empty when creating/updating a story',
    invalidAnswerId: 'AnswerId is not a 24 hex string',
    invalidAnswerType: 'Invalid Type provided for Answer',
    displayNameRequired: 'Display name is required',
    noAccessTokenTitle: 'Access token is empty',
    noAccessTokenDetail: 'No Access token to revoke',
    noDeviceTokenTitle: 'No Device Token',
    noDeviceTokenDetail: 'Device Token is not provided',
    personIdDoesntExist: 'Person Id does not exist',
    invalidAdminTokenDetail: 'Proper Admin token not provided',
    invalidCommunityType: 'Invalid community type found. Cannot be empty',
    invalidLibraryId: 'Library Id is not a 24 hex string',
    pageNumberMissing: 'Page number can be greater than 0 only',
    pageSizeMissing: 'Page size can not be negative',
    invalidSortValue: 'Sort can be 1 or -1',
    contentModUrlMissing: 'The contentMod url in appsettings is empty',
    activityDoesNotExist: 'Activity does not exist',
    userActivityDoesNotExist: 'Activity does not exist for current user',
    storyIdIsRequired: 'StoryId is required',
    postIdIsRequired: 'PostId is required',
    unableToPostInstallation: 'Issue in posting device token',
    installationFailure: 'Installation - post failed',
    installationGetFailure: 'Installation - get failed',
    installationDeleteFailure: 'Installation - delete failed',
    FCMTokenIssue: 'Issue in posting FCM token',
    storyNotReported: 'This story is not reported',
    storyIsRemoved: 'This story is removed',
    userAnsweredQuestion: 'Has answered your question',
    userStoryPosted: 'Published a New Story in ',
    errorCreatingAnswer: 'Error creating Answer',
    invalidEntityId: 'Not a valid Entity Id',
    invalidReactionTitle: 'Invalid Reaction',
    invalidReaction:
      'Reaction value does not matches with the permissible set of reactions',
    noAvailableReaction:
      'No available Reaction for the set of given user and entity',
    duplicateTokenTitle: 'Duplicate device token',
    duplicateTokenDetail: 'This device is already registered',
    commentDoesNotExist: 'Comment does not exists.',
    emptyComment: 'Comment cannot be empty',
    postDoesNotExist: 'Post does not exists.',
    postWithImageDoesNotExist: 'Post with image does not exists.',
    flagEmailSubject: 'Attention Required: Story flagged in',
    commentSubject: 'Member commented in',
    commentBody: 'Member commented on',
    replySubject: 'Member replied to your comment in',
    replyBody: 'Member replied to you on',
    postReaction: 'Has reacted to your post',
    commentReaction: 'Has reacted to your comment',
    replyReaction: 'Has reacted to your reply',
    reactionTitle: 'Has reacted to your',
    postComment: 'Has commented on your Post',
    replyComment: 'Has replied to your comment',
    replyDoesNotExists: 'Reply does not exists',
    reportedComment: 'Has reported a story comment',
    reportedStory: 'Has reported a story',
    notTheAuthor: 'User is not the author of the comment',
    userAskedQuestion: 'Has asked you a question',
    flaggedComment: 'Attention Required: Comment flagged in',
    flaggedContent: 'Attention Required: Flagged Content',
    flaggedReply: 'Attention Required: Reply flagged in',
    flaggedCommentBody: 'Member comment flagged',
    flaggedAdminCommentBody: 'Member flagged your comment',
    keyWordPublished: 'Attention Required: Key Word or Phrase used in',
    sensitiveWords: 'Sensitive Keyword or Phrase used in',
    missingRequiredParameters: 'Insufficient inputs or mandatory parameters are missing',
    noDnDetails: 'dn is required field here.',
    noMemberTypeDetail: 'memberType is required field!',
    webGuidMissing: 'webguid missing in the request.',
    memberTypeMissing: 'invalid memberType or memberType is missing',
    invalidLanguage: 'Invalid Language Parameter',
    noSecretQuestions: 'Medicaid Secret Question list not found!',
    mbrUidMissing: 'memberId is required query parameter!',
    noNewPasswordDetail: 'newPassword field is required!',
    noCurrentPasswordDetail: 'currentPassword field is required!',
    noConfirmPasswordDetail: 'confirmPassword field is required!',
    invalidMimeType: 'is not a supported file type!',
    tryAgain: 'Please try again later',
    missingImage: 'Image is missing',
    deletedUser: 'This user is marked for delete.',
    invalidOperationTitle: 'Member profile is expired',
    invalidOperationDetail: 'The member profile is expired with coverage.',
    userNotAllowed: 'User not allowed to login.',
    loginFailed: 'Login Failed.',
    commentFailure: 'Failed to add Comment.',
    commentEditFailure: 'Failed to edit Comment.',
    reactionFailure: 'Failed to add reaction.',
    userVisitCountExceedTitle: 'User visit alrealdy tracked more than 5.',
    userVisitCountExceedDetail: 'User visit count tracking is exceeded.',
    failedToUpdate: 'Failed to update the data',
    invalidReques: 'Requst does not match with the given id',
    sqsFailure: 'Failed ro push the message to SQS',
    failedToCreatePNTitle: 'Failed to create Push Notifications',
    failedToCreateDetail: 'Failed to create the push notifications for the User.',
    auditMessage: ' scheduled push notification jobs are getting deleted from the DB for the user ',
    badPNDate: 'Could not find the template for PN / PN template is Inactive'
  }
};

export const awsSecretDetails = {
  dev: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/dev'
  },
  dev1: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/dev'
  },
  dev2: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/dev'
  },
  sit: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/sit'
  },
  sit1: {
    roleArn: 'arn:aws:iam::498126410249:role/slvr-sydcom-devrole',
    secretName: 'db/sit'
  },
  sit2: {
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
  uat1: {
    roleArn: 'arn:aws:iam::995597582036:role/gld-sydcom-devrole',
    secretName: 'db/uat'
  },
  uat2: {
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

export const collections = {
  BINDER: 'Binder',
  COMMUNITY: 'Community',
  LIBRARY: 'Library',
  PROFILEIMAGES: 'ProfileImages',
  PROMPT: 'Prompt',
  QUESTIONS: 'Questions',
  STORY: 'Story',
  USERS: 'Users',
  BLOCKED: 'Blocked',
  ACTIVITY: 'Activity',
  APPVERSION: 'AppVersion',
  SEARCHTERM: 'SearchTerms',
  CONTENT: 'Content',
  REACTIONS: 'Reactions',
  INSTALLATIONS: 'Installations',
  PARTNERS: 'Partners',
  POSTIMAGES: 'PostImages',
  POSTS: 'Posts',
  ADMINUSERS: 'AdminUsers',
  ADMINACTIVITY: 'AdminActivity',
  DEMOUSERS: 'DemoUsers',
  ADMINUSERIMAGES: 'AdminUserImages',
  COMMUNITYIMAGES: 'CommunityImages',
  SCHEDULED_JOB: 'ScheduledJobs',
  APP_CONFIG: 'AppConfig',
  POLLRESPONSE: 'PollResponse'
};

export enum QuestionType {
  userQuestion = 'UserQuestion',
  promptQuestion = 'PromptQuestion'
}

export const mongoDbTables = {
  content: {
    id: '_id',
    language: 'language',
    version: 'version',
    contentType: 'contentType',
    data: 'data',
    updateAt: 'updateAt',
    createdAt: 'createdAt'
  },
  users: {
    id: '_id',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    phoneNumber: 'phoneNumber',
    profilePicture: 'profilePicture',
    personId: 'personId',
    active: 'active',
    myCommunities: 'myCommunities',
    onBoardingState: 'onBoardingState',
    displayName: 'displayName',
    tou: 'tou',
    communityDetails: 'attributes.communityDetails',
    communityId: 'communityId',
    visitCount: 'visitCount',
    dueDateEnteredOnce: 'dueDateEnteredOnce',
    communityIdInList: 'attributes.communityDetails.$.communityId',
    visitCountInList: 'attributes.communityDetails.$.visitCount',
    meTabHelpCardBanner: 'attributes.meTabHelpCardBanner',
    localServiceHelpCardBanner: 'attributes.localServiceHelpCardBanner',
    communityHelpCardBanner: 'attributes.communityHelpCardBanner',
    localCategoryHelpCardBanner: 'attributes.localCategoryHelpCardBanner',
    localCategories: 'localCategories',
    cancerCommunityCard: 'attributes.cancerCommunityCard',
    lastLoginAt: 'lastLoginAt',
    memberType: 'memberType',
    deleteRequested: 'deleteRequested',
    storyPromotion: 'attributes.storyPromotion',
    remindStoryPromotion: 'attributes.storyPromotion.remindUser',
    nextStoryPromotionDate: 'attributes.storyPromotion.nextPromotionDate'
  },
  binder: {
    id: '_id',
    userId: 'userId',
    createdDate: 'createdDate',
    storyPath: 'binderStories.storyId',
    binderResources: 'binderResources',
    binderStories: 'binderStories',
    binderArticles: 'binderArticles',
    binderPosts: 'binderPosts',
    binderPostId: 'binderPosts.postId',
    binderStoryIdFilter: 'id.storyId',
    binderStoryAuthorAge: 'binderStories.$[id].authorAgeWhenStoryBegan',
    binderStoryDisplayName: 'binderStories.$[id].displayName',
    binderStoryFeaturedQuote: 'binderStories.$[id].featuredQuote',
    binderStoryRelation: 'binderStories.$[id].relation',
    binderStoryRelationAge: 'binderStories.$[id].relationAgeWhenDiagnosed'
  },
  community: {
    id: '_id',
    createdAt: 'createdAt',
    category: 'category',
    createdBy: 'createdBy',
    categoryId: 'categoryId',
    categoryName: 'categoryName',
    title: 'title',
    displayName: 'displayName',
    image: 'image',
    active: 'active'
  },
  prompt: {
    id: '_id',
    createdDate: 'createdDate',
    communityId: 'communityId',
    communitiesList: 'communitiesList'
  },
  story: {
    id: '_id',
    createdAt: 'createdAt',
    removed: 'removed',
    published: 'published',
    flagged: 'flagged',
    authorId: 'authorId',
    communityId: 'communityId',
    answer: 'answer',
    updateDate: 'updatedAt',
    hasStoryBeenPublishedOnce: 'hasStoryBeenPublishedOnce',
    reactionTotal: 'reaction.count.total',
    commentId: 'comments._id',
    commentMsg: 'comments.$.comment',
    isCommentProfane: 'comments.$.isCommentTextProfane',
    commentUpdatedAt: 'comments.$.updatedAt',
    postCommentFilter: 'comments.$[outer].replies.$[inner].comment',
    isReplyProfane: 'comments.$[outer].replies.$[inner].isCommentTextProfane',
    storyDateFilter: 'comments.$[outer].replies.$[inner].updatedAt',
    storyOuterFilter: 'outer._id',
    storyInnerFilter: 'inner._id',
    storyReplies: 'comments.$.replies',
    comments: 'comments',
    replies: 'replies',
    commentAuthorId: 'comments.author.id',
    replyAuthorId: 'comments.replies.author.id',
    commentAuthors: 'commentAuthors',
    replyAuthors: 'replyAuthors',
    reactions: 'reactions',
    commentReaction: 'comments.$.reactions',
    replyUpdatedAt: 'comments.$[outer].replies.$[inner].updatedAt',
    replyReactions: 'comments.$[outer].replies.$[inner].reactions',
    postOuterFilter: 'outer._id',
    postInnerFilter: 'inner._id',
    replyRemoved: 'comments.$[outer].replies.$[inner].removed',
    commentRemoved: 'comments.$.removed',
    commentObjAuthorId: 'author.id',
    commentsProjection: 'comments.$',
    replyFlagged: 'comments.$[outer].replies.$[inner].flagged',
    replyFlaggedLog: 'comments.$[outer].replies.$[inner].flaggedUserLog',
    commentFlagged: 'comments.$.flagged',
    commentFlaggedLog: 'comments.$.flaggedUserLog',
    userFlagged: 'userFlagged',
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
    createdDate: 'activityCreatedDate',
    activityId: 'activityList._id',
    activityNotificationRead: 'activityList.$.isActivityNotificationRead',
    activityInitiatorId: 'activityInitiator._id',
    activityInitiatorIdFilter: 'user.activityInitiator._id',
    activityInitiatorDisplayName: 'activityList.$[user].activityInitiator.displayName',
    storyId: 'activityList.storyLink.storyId'
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
  searchTerm: {
    id: 'id',
    term: 'term',
    createdDate: 'createdDate',
    category: 'category'
  },
  installations: {
    id: '_id',
    deviceId: 'id',
    userId: 'userId',
    devices: 'devices',
    deviceToken: 'devices.deviceToken',
    endpointArn: 'devices.endpointArn',
    badge: 'devices.$.badge',
    deviceItem: 'devices.$',
    token: 'deviceToken'
  },
  partners: {
    id: 'id',
    title: 'title',
    logoImage: 'logoImage',
    articleImage: 'articleImage',
    active: 'active'
  },
  posts: {
    id: '_id',
    authorId: 'author.id',
    communities: 'communities',
    authorRole: 'authorRole',
    content: 'content',
    image: 'content.image',
    published: 'published',
    publishedAt: 'publishedAt',
    flagged: 'flagged',
    removed: 'removed',
    createdDate: 'createdDate',
    updateDate: 'updatedDate',
    hasContentBeenPublishedOnce: 'hasContentBeenPublishedOnce',
    commentId: 'comments._id',
    commentMsg: 'comments.$.comment',
    postReplies: 'comments.$.replies',
    isCommentProfane: 'comments.$.isCommentTextProfane',
    commentUpdatedAt: 'comments.$.updatedAt',
    comments: 'comments',
    reactions: 'reactions',
    replies: 'replies',
    commentFlagged: 'comments.$.flagged',
    commentReaction: 'comments.$.reactions',
    postCommentFilter: 'comments.$[outer].replies.$[inner].comment',
    isReplyProfane: 'comments.$[outer].replies.$[inner].isCommentTextProfane',
    poll: 'poll',
    postDateFilter: 'comments.$[outer].replies.$[inner].updatedAt',
    postOuterFilter: 'outer._id',
    postInnerFilter: 'inner._id',
    replyRemoved: 'comments.$[outer].replies.$[inner].removed',
    replyUpdatedAt: 'comments.$[outer].replies.$[inner].updatedAt',
    replyReactions: 'comments.$[outer].replies.$[inner].reactions',
    commentRemoved: 'comments.$.removed',
    replyFlagged: 'comments.$[outer].replies.$[inner].flagged',
    commentAuthorId: 'comments.author.id',
    replyAuthorId: 'comments.replies.author.id',
    commentAuthors: 'commentAuthors',
    replyAuthors: 'replyAuthors',
    replyFlaggedLog: 'comments.$[outer].replies.$[inner].flaggedUserLog',
    commentFlaggedLog: 'comments.$.flaggedUserLog',
    userFlagged: 'userFlagged'
  },
  adminUser: {
    id: '_id',
    username: 'username',
    role: 'role',
    communities: 'communities',
    active: 'active',
    firstName: 'firstName',
    lastName: 'lastName',
    displayTitle: 'displayTitle',
    displayName: 'displayName',
    profileImage: 'profileImage'
  },
  adminActivity: {
    id: '_id',
    userId: 'userId',
    list: 'list',
    listReaction: 'list.$',
    listTitle: 'title',
    listReplyId: 'replyId',
    listCommentId: 'commentId',
    listPostId: 'postId',
    listEntityType: 'entityType',
    listAuthorId: 'author.id',
    listRemove: 'list.$.isRemoved',
    listReactionValue: 'list.$.reactionType',
    listRead: 'list.$.isRead',
    listUpdated: 'list.$.updatedAt'
  },
  demousers: {
    id: '_id',
    username: 'username'
  },
  postImages: {
    id: '_id',
    postId: 'postId',
    postImageBase64: 'postImageBase64'
  },
  adminImages: {
    id: '_id',
    adminId: 'adminId',
    imageBase64: 'imageBase64'
  },
  communityImage: {
    id: '_id',
    communityId: 'communityId',
    imageBase64: 'imageBase64'
  },
  scheduledJobs: {
    id: '_id',
    isSent: 'data.isSent',
    updatedAt: 'data.updatedAt',
    data: 'data',
    receiverId: 'data.receiverId',
    author: 'data.author',
    authorId: 'data.author.id',
    communities: 'data.communities',
    body: 'data.body',
    removed: 'data.removed',
    name: 'name',
    disabled: 'disabled'
  },
  appConfig: {
    type: 'type',
    env: 'env',
    project: 'project',
    version: 'version',
    configDetails: 'configDetails'
  },
  pollResponse: {
    id: '_id',
    postId: 'postId',
    userResponse: 'userResponse'
  }
};

export const pageParam = {
  maxPageSize: 50
};

export const helpCardBanner = [
  'meTabHelpCardBanner',
  'localServiceHelpCardBanner',
  'communityHelpCardBanner',
  'localCategoryHelpCardBanner',
  'cancerCommunityCard'
];

export const BASE_URL_EXTENSION = {
  ADMIN: '/admin',
  BINDER: '/binder',
  MEMBER: '/member',
  SEARCHTERM: '/searchterm',
  LIBRARY: '/library',
  LOCALCATEGORY: '/localCategory',
  LOCATION: '/location',
  IMAGE: '/image',
  PARTNER: '/partner',
  POST: '/post',
  PROFILE: '/profile',
  STORY: '/story',
  USER: '/user',
  POLL: '/poll'
};

export const ADMIN_END_POINTS = {
  REMOVE_STORY: 'admin/story/remove/',
  REMOVE_STORY_FLAG: 'admin/story/removeFlag/',
  BAN_USER: 'admin/users/ban/'
};

export enum KEYS {
  AES_ALGO = 'aes-256-cbc',
  AES_256_ECB = 'aes-256-ecb',
  AES_256_CBC = 'aes-256-cbc',
  AES_256_GCM = 'aes-256-gcm',
  B64 = 'base64',
  UTF16 = 'utf16le',
  UTF8 = 'utf8',
  SHA1 = 'sha1',
  HEX = 'hex',
  MD5 = 'md5',
  SECRET = 'I AM SHERLOCKED',
  DELAY = '15 minutes',
  PN_TEMPLATE_NUMBER = 44,
  PREGNANCY_DURATION = 40,
  WEEK_DAYS = 7,
  ABCBS = 'ABCBS'
}

export enum variableNames {
  BAMBOO_SECRET = 'bamboo_password',
  ENV_FILE_PATH = './variables/.env',
  ASSIGNMENT = '=',
  HTTPS = 'https'
}

export const SWAGGER_API_DOCS = {
  GLOBAL_FILEPATH: '/usr/src/app/api/communityresources/swagger/swagger.json',
  FILEPATH: 'api/communityresources/swagger/swagger.json'
};

export const memberInfo = {
  STATUS: 'approved',
  REPOSITORY_ENUM: 'IAM',
  USER_ROLE_ENUM: 'MEMBER',
  APPLICATION: 'SYDCOM',
  GBD_MEMBER: 'CN=gbdMSS',
  MEDICAID_MEMBER_TYPE: 'gbdMSS',
  COMMERCIAL_MEMBER_TYPE: 'eMember',
  PREFERRED: 'Preferred',
  SNAP_PREFERRED_INDICATOR: 'PREFERRED_SNAP',
  SNAP: 'Snap/Preferred',
  SNAPUSER: 'SNAP',
  ACTIVE: 'Active',
  TEXAS: 'TX',
  RESTRICTED_AGE: 14,
  loginTwoFAModel: 'Member',
  marketingBrand: 'AGP-TX',
  ENCRYPT: 'encrypt',
  TWOFACTOR: '2ndfactor',
  CONTINUE: 'Continue',
  SUGGESTED_ACTION: '2ndfactor/Continue',
  TRUE: 'true',
  FALSE: 'false',
  GBD_USER: '~Keegan90001',
  EMAIL: 'email',
  TEXT: 'TEXT',
  VOICE: 'VOICE',
  EMAIL_DEFAULT_TEMPLATE: 'ABCBS',
  RECOVERY: 'recovery~',
  PROD: 'prod',
  ARN: 'ARN',
  PHONE: 'PHONE',
  SECRET_QUESTION: 'SECRET_QUESTION',
  SECRET_ANSWER: 'SECRET_ANSWER',
  REPLACE: 'REPLACE',
  DATE_FORMAT: 'YYYY-MM-DD',
  PLAN_TYPE: 'MEDICAID'
};

export enum unitOfTime {
  years = 'years',
  days = 'days',
  visitCountLimit = 6
}

export enum requestName {
  ON_PREM_TOKEN = 'onPremAccessToken',
  SYDNEY_MEMBER_TENANT_TOKEN = 'sydneyMemberTenantToken',
  PSGBD_MEMBER_TENANT_TOKEN = 'psgbdMemberTenantToken',
  FIND_HELP_TENANT_TOKEN = 'findHelpTenantToken',
  ON_PREM_SYNTHETIC_TOKEN = 'onPremSyntheticAccessToken',
  WEB_USER_SEARCH = 'webUserSearch',
  MEMBER_AUTHENTICATE = 'memberAuthenticate',
  GBD_SUMMARY = 'GbdSummary',
  MEMBER_GET_CONTACT_DETAILS = 'memberContactDetails',
  GBD_CONTACT_DETAILS = 'GBDContactDetails',
  GBD_CONTACT_DETAILS_SYNTHETIC = 'GBDContactDetailsSynthetic',
  MEMBER_INFO_VALIDATE = 'memberCommercialValidatedInfo',
  COMMERCIAL_LOGIN_THREAT = 'commercialLoginThreatStatus',
  MEDICAID_LOGIN_THREAT = 'medicaidLoginThreatStatus',
  COMMERCIAL_RECOVERY_THREAT = 'commercialFupRecoveryThreat',
  MEDICAID_RECOVERY_THREAT = 'medicaidFupRecoveryThreat',
  MEMBER_LOGIN_VALIDATE_OTP = 'memberLoginValidateOTP',
  COMMERCIAL_SEND_OTP = 'commercialSendOtp',
  GBD_SEND_OTP = 'GBDSendOtp',
  MEMBER_GBD_VALIDATE_OTP = 'memberGBDLoginValidateOTP',
  COMMERCIAL_SAVE_DEVICE = 'CommercialLoginSaveCookie',
  MEDICAID_SAVE_DEVICE = 'medicaidLoginSaveCookie',
  COMMERCIAL_SUMMARY = 'commercialSummary',
  GBD_ELIGIBILITY = 'GbdEligibility',
  GBD_ELIGIBILITY_SYNTHETIC = 'GbdEligibilitySynthetic',
  ENCRYPT_COOKIE = 'encryptCookie',
  VALIDATE_SECURITY_ANSWERS = 'securityQnAValidation',
  GENERATE_PASSWORD = 'generateTemporaryPassword',
  UPDATE_PASSWORD = 'updateNewPassword',
  MEMBER_FULL_EMAIL = 'memberFullEmail',
  MEMBER_FULL_NUMBER = 'memberFullMobileNumber',
  MEMBER_RECOVERY_CONTACT = 'memberRecoveryContact',
  GET_SECURITY_QUESTIONS = 'getSecurityQuestionAnswers',
  GET_COMMERCIAL_TELEPHONE = 'getCommercialTelephoneNumber',
  GET_COMMERCIAL_TXTNBR = 'getCommercialTextNumber',
  GET_COMMERCIAL_RECOVERYNBR = 'getCommercialRecoveryNumber',
  GET_SECRET_QUESTIONS = 'getMedicaidSecretQuestionsList',
  GET_USER_SECRET_QUESTIONS = 'getMedicaidUserSecretQuestions',
  UPDATE_SECRET_QUESTIONS = 'updateMedicaidSecretQuestionAnswers',
  UPDATE_COMMERCIAL_RECOVERYNBR = 'updateCommercialRecoveryNumber',
  UPDATE_MEDICAID_RECOVERYNBR = 'updateMedicaidRecoveryNumber',
  ADD_COMMERCIAL_RECOVERYNBR = 'addCommercialNewRecoveryNumber',
  UPDATE_SECURITY_QUESTIONS = 'updateSecurityQuestionAnswers',
  UPDATE_PROFILE_PASSWORD = 'updateNewProfilePassword',
}

export enum cacheKey {
  memberToken = 'member:token',
  onPremToken = 'onPrem:token',
  onPremSyntheticToken = 'onPremSyntheticToken:token',
  eksOnPremToken = 'eksOnPrem:token',
  sydneyMemberToken = 'sydneyMember:token',
  psgbdToken = 'psgbdTenant:token',
  findhelpToken = 'findhelpTenant:token',
}

export enum recommenededResources {
  COMMUNITY_RESOURCES = 'Community Resources',
  WAYS_WE_CAN_HELP = 'Ways We Can Help',
  NAME = 'name'
}

export enum headers {
  API_KEY = 'apikey',
  PERSON_TYPE = 'meta-personType',
  AUTHORIZATION = 'Authorization',
  BASIC = 'Basic',
  BEARER = 'Bearer',
  CONTENT_TYPE = 'Content-Type',
  CONTENT_VALUE = 'application/x-www-form-urlencoded',
  BODY_VALUE = 'grant_type=client_credentials&scope=public',
  WEBGUID = 'webguid',
  HCID = 'healthCardId',
  MEMBERID = 'memberId',
  MBRUID = 'mbruid',
  MCID_FLAG = 'isMcidRequired',
  MODEL = 'model',
  USER_NAME = 'usernm',
  META_IP_ADDRESS = 'meta-ipaddress',
  META_PING_RISK_ID = 'meta-pingRiskId',
  META_PING_DEVICE_ID = 'meta-pingDeviceId',
  META_PING_USER_ID = 'meta-pingUserId',
  META_BRAND_CODE = 'meta-brandcd',
  META_TRANS_ID = 'meta-transid',
  META_SENDER_APP = 'meta-senderapp',
  COOKIE = 'Cookie',
  START_DATE = 'startDt',
  END_DATE = 'endDt',
  ERR_CODE_TOKEN_DELETED_USER = 'USER_DELETED',
  ERR_CODE_TOKEN_EXPR = 'TOKEN_EXPIRED',
  ERR_CODE = 'ErrorCode',
  TLS_VERSION = 'TLSv1.2'
}

export const USER_IDENTITY = 'userIdentity';
export const UNITED_STATES = 'United States';

export enum TranslationLanguage {
  ENGLISH = 'en',
  SPANISH = 'es'
}

export const reactionRemove = 'remove';

export enum ReactionEnum {
  REACTION_LIKE = 'like',
  REACTION_CARE = 'care',
  REACTION_CELIBRATE = 'celebrate',
  REACTION_GOOD_IDEA = 'good_idea'
}

export enum SNSEnum {
  IOS = 'ios',
  APNS = 'APNS',
  ANDROID = 'android',
  GCM = 'GCM',
  PROTOCOL = 'application',
  GENERIC_TOPIC = 'allusers'
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
  REPLY = 'reply',
  COMMENT = 'comment',
  ADHOC_TEMPLATE = 'adhocTemplate'
}

export enum SQSParams {
  ACTIVITY_MESSAGE_GROUP_ID = 'ACTIVITY',
  STORY_MESSAGE_GROUP_ID = 'STORY',
  GENERIC_MESSAGE_GROUP_ID = 'GENERIC',
  DELETE_PROFILE_MESSAGE_GROUP_ID = 'DELETE-PROFILE'
}

export enum SQSMessageAtributeType {
  STRING = 'String',
  NUMBER = 'Number',
  BINARY = 'Binary'
}

export enum NotificationPriority {
  HIGH = 'high',
  LOW = 'low'
}

export enum NotificationDeepLink {
  ACTIVITY = 'activity',
  STORY = 'story'
}

export enum NotificationMessages {
  QuestionCreatedTitle = 'New question received',
  QuestionCreatedContent = 'A member asked a question about your story.',
  AnswerCreatedTitle = 'Your question has been answered',
  AnswerCreatedContent = 'A member answered a question you asked about their story.',
  StoryCreatedTitle = 'New story available',
  StoryCreatedContent = 'A new story has been shared to your community.',
  PostCreatedTitle = 'Has shared a post to your community',
  AdminActivityLineForKeyWord = 'Flagged keyword or phrase used in',
  UserReplyTitle = 'New reply received',
  UserReplyBody = 'A member replied to your comment.',
  UserReplyContent = 'Has replied to your comment',
  ReactionTitle = 'New reaction received',
  ReactionActivityTitle = 'Has reacted to your story',
  ReactionContent = 'A member has reacted to your story',
  UserReactionBody = 'A member has reacted to your comment',
  UserReactionContent = 'Has reacted to your comment',
  StoryCommentTitle = 'New comment received',
  StoryCommentBody = 'A member has commented on your story',
  StoryCommentActivity = 'Has commented on your story',
  StoryPublish = 'has published a new story in'
}

export const REACTIONS = {
  REACTION_COUNT: 'reactionCount',
  USER_REACTION: 'userReaction'
};

export enum ContentKey {
  PUBLIC = 'public',
  GENERIC = 'generic',
  LIBRARY = 'helpfulInfo',
  PROMPTS = 'prompts',
  TOU = 'tou'
}

export const contentDataKey = {
  CREATE_STORY: 'createStoryModule',
  HELPFUL_INFO: 'helpfulInfoModule'
};

export const translationLiterals = {
  cancer: {
    en: 'Cancer',
    es: 'Cáncer'
  },
  deletedCommentMessage: {
    en: 'This comment has been removed.',
    es: 'Este comentario ha sido eliminado.'
  },
  ourPartners: {
    en: 'Our Partners',
    es: 'Nuestros compañeros'
  },
  selfDeletedCommentMessage: {
    en: 'This comment has been removed by author.',
    es: 'Este comentario ha sido eliminado por el autor.'
  },
  selfDeletedReplyMessage: {
    en: 'This reply has been removed by author.',
    es: 'Esta respuesta ha sido eliminada por el autor.'
  }
};

export const reactions = ['like', 'celebrate', 'care', 'good_idea', 'remove'];

export const reactionsType = ['post', 'comment', 'reply'];

export const storyReactionsType = ['story', 'comment', 'reply'];

export const scheduledPushNotification = 'CommunityPushNotification';

export const maternityNotificationTemplateNaPrefix = 'maternityNotification-';

export const activityMessageSpanish = {
  sharedPostTitle: 'Compartió una publicación con su comunidad',
  answeredQuestionTitle: 'Respondió su pregunta',
  reactedToStoryTitle: 'Reaccionó a su historia',
  askedQuestionTitle: 'Le hizo una pregunta',
  sharedStoryTitle: 'Publicó una nueva historia en ' //To be updated with TransPerfect Translation
};

export enum PostResponse {
  COMMENT = 'comment',
  REPLY = 'reply',
  REACTION = 'reaction',
  POST = 'post'
}

export const localCategorySpanish = {
  communityTitle: 'Comunidad Recursos',
  resourcesTitle: 'Cómo Podemos Ayudar Recursos' //To be updated with Transperfect Translation
};

export const allowedMimeTypes = [
  'jpeg',
  'jpg',
  'png',
  'image/png',
  'image/jpg',
  'image/jpeg'
];

export const queryStrings = {
  communityRecentActivity: {
    filterAsStory: 'story',
    filterCondition: '$$story.published',
    lookupName: 'stories',
    lookupValue: '$stories',
    mapAsPublishedStory: 'publishedStory',
    publishedV: 'publishedStory',
    projectAsPostPublishedAt: 'postPublishedAt',
    projectAsPostPublishedAtValue: '$postPublishedAt',
    projectAsPublishedStories: 'publishedStories',
    projectAsPublishedStoriesValue: '$publishedStories',
    publishedAtOfStories: '$publishedStories.publishedAt',
    publishedAtValue: '$publishedAt',
    publishedAtValueOfStory: '$$publishedStory.publishedAt',
    publishedValueOfStory: '$$publishedStory.published'
  },
  keep: '$$KEEP',
  prune: '$$PRUNE',
  arrayFilters: 'arrayFilters',
  elemMatch: '$elemMatch',
  projection: 'projection'
};

export enum ConstCommunityNames {
  MATERNITY = 'Maternity'
}

export enum AdminRoles {
  ADMIN = 'scadmin',
  ADVOCATE = 'scadvocate'
}

export enum OnboardingState {
  COMPLETED = 'completed'
}

export enum AdminRole {
  scadmin = 'scadmin',
  scadvocate = 'scadvocate',
  sysadmin = 'sysadmin'
}

export const contentKeys = {
  wordList: 'wordList',
  helpfulInfo: 'helpfulInfo',
  pushNotification: 'pushNotification'
};

export const contentType = {
  partner: 'HWPartner'
};

export const dbDetails = {
  sit1: {
    'certPath': '/database.pem',
    'options': { 'sslValidate': true,

      'useUnifiedTopology': true,
      'retryWrites': false
    },
    'usrnm': 'srcsydcomsrw',
    'dbAuth': '0uhzf/BreMk1mruJycf2+g==',
    'endpoint': '@adocdb-sydcom-devcl02.cluster-c40sykg6oowu.us-east-2.docdb.amazonaws.com:27017/sydcomappdb?tls=true&tlsCAFile=libs/database/database.pem&replicaSet=rs0&readpreference=secondaryPreferred',
    'name': 'sydcomappdb'
  }
};

export const bouncyEncryption = {
  'secret': 'decaffeinated',
  'salt': 'Sn43R28*893bnheDJf79L43_',
  'iv': '72&r_SwC'
};

export const encryption = {
  'storePath': 'dev/keystore2.jceks',
  'keyStoreKey': '1800b6331df185ccea3c7c6677894843208c9bff7fd63593f90d9f1cd4b29b0b',
  'encryptionKey': '4f0dad1492523d9d5ea5fe5e726f0e59f716eb0cc2e3f8e3b99bd436bde3700b',
  'storeSecret': '02MqhVXVOjXfeAnUPeaHUQ==',
  'aesSymmetric': {
    'secret': '02MqhVXVOjXfeAnUPeaHUQ=='
  },
  'aes': {
    'secret': '02MqhVXVOjXfeAnUPeaHUQ==',
    'salt': '36623938313631306263663265396330',
    'iv': '72&r_SwC'
  }
};

export const functionNames = {
  GET_AUTH_REQUEST: 'getAuthRequest'
};
