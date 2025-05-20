// API Type
export const publicApi = '/api/v1/public';
export const secureApi = '/api/v1/secure';
export const communityPublicApi = '/public/v2';
export const communitySecureApi = '/v2';

// APIs
export const api = {
  version: '/version',
  schedulerVersion: '/api/scheduler/v1/public/version',
  login: '/login',
  appMetrics: '/appMetrics',
  getArticle: '/article/get',
  healthCheck: '/healthCheck',
  communities: '/communities',
  createCommunity: '/createCommunity',
  commonLibrary: '/commonLibrary',
  // Post
  post: '/post',
  posts: '/posts',
  getAllPosts: '/posts/all',
  getPost: '/post',
  getPostsByCommunity: '/posts/community',
  deletePost: '/post/delete',
  flagAPost: '/post/flag',
  // Comment
  comment: '/comment',
  flagAComment: '/comment/flag',
  // Reply
  reply: '/reply',
  deleteReply: '/post/reply',
  flagAReply: '/reply/flag',
  // Reaction
  reaction: '/reaction',
  // User
  banUser: '/banUser',
  activity: '/activity',
  updateActivity: '/activity/read',
  deleteProfile: '/delete/user',
  updateOptInMinor: '/user/minor',
  // Content
  content: '/content',
  contentOptions: '/content/options',
  contentVersions: '/content/versions',
  deepLink: '/content/deepLink',
  communityLibrary: '/communityLibrary',
  library: '/library',
  linksData: '/content/links',
  contentLink: '/content/contentLink',
  linkPreview: '/getLinkPreview',
  section: '/section',
  helpfulInfo: '/helpfulInfo',
  trainingLink: '/training-link',
  // Profile
  exportData: '/user/export',
  persona: '/user/persona',
  profile: '/profile',
  updateActiveFlag: '/profile/active',
  userProfile: '/user/profile',
  admins: '/admins',
  // Image
  image: '/image',
  // SchedulePN
  pushNotification: '/notify',
  metrics: '/metrics',
  // AppVersion
  appVersion: '/appVersion',
  // Stories
  getAllStories: '/story/all',
  getStory: '/story',
  removeStory: '/story/removeStory',
  flag: '/flag',
  subCommunities: '/communities/subCommunity',
  all: '/all',
  edit: '/edit',
  details: '/details',
  remove: '/remove',
  count: '/count',
  prompts: '/prompts',
  article: '/article',
  externalLink: '/externalLink',
  partners: '/partners',
  // Notification
  template: '/notificationTemplates',
  // email
  emailNotification: '/emailNotification',
  touMassEmailInfo: '/touMassEmailInfo',
  tou: '/tou',
  expiredUsers: '/user/delete',
  //dashboard,
  activeUserCount: '/dashboard/activeUsers',
  newUserCount: '/dashboard/newUsers',
  latestPost: '/dashboard/latestPosts',
  postActivity: '/dashboard/postActivity',
  userCount: '/dashboard/userCount'
};

export const communityApis = {
  version: '/users/version',
  content: '/users/translations'
};

export const gatewayEndpoint = {
  deleteProfile: '/delete-profile'
};

export const proxy = {
  proxy1: 'https://10.197.48.129/health',
  proxy2: 'https://10.197.49.14/health',
  proxy3: 'https://10.197.50.103/health',
  perf: 'https://10.127.48.188/health',
  uat: 'https://10.127.48.213/health'
};
