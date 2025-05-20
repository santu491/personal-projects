export const API_PATHS = {
  auth: '/v1/auth',
  public: '/v1/public',
  provider: '/v1/provider',
  secure: '/v1/secure',
  wellnessTopics: '/v1/wellness',
  content: '/v1/content',
  clientConfiguration: '/v1/clients',
};

export const AUTH_ROUTES = {
  clients: '/clients',
  login: '/login',
  logout: '/logout',
  memberAuthentication: '/members/authentication',
  memberSession: '/members/session',
  memberLookup: '/members/lookup',
  memberProfile: '/members/profile',
  memberContacts: '/members/contacts',
  sendOrValidateOTP: '/mfa/otp',
  forgotPdsw: '/members/forgot-secret',
  forgotUserName: '/members/forgot-username',
  memberAccount: '/members/account',
  rememberDevice: '/members/device',
  memberPreferences: '/members/preferences',
  refreshMemberAuth: '/refresh',
};

export const PROVIDER_ROUTES = {
  addresses: '/addresses',
  email: '/email',
  geoCodeAddress: '/geoCode/address',
  providerDetails: '/providerDetails',
  providers: '/providers',
};

export const PUBLIC_ROUTES = {
  auth: '/auth',
  health: '/health',
  fau: '/app/update',
  version: '/version',
  notify: '/manual/notify',
  encrypt: '/encrypt',
  decrypt: '/decrypt',
  swagger: '/v1/public/api-docs/',
};

export const SECURE_ROUTES = {
  installations: '/installations',
  installationsDelete: '/installations/delete',
  notifications: '/notifications',
  userDelete: '/user/delete',
  userInfo: '/user/info',
  userNotifications: '/user/notifications',
  userNotificationsRead: '/user/notifications/read',
  userLogout: '/user/logout',
  userResetBadge: '/user/resetBadge',
};

export const APPOINTMENT_ROUTES = {
  appointment: '/appointment',
  assessmentRequired: '/assessment-status',
  appointmentDetails: '/appointment-details',
  questions: '/questions',
  memberStatus: '/members/status',
  memberDashboard: '/members/dashboard',
  status: '/status',
  survey: '/survey',
};

export const ASSESSMENT_ROUTES = {
  assessments: '/assessments',
};

export const CHAT_ROUTES = {
  chat: '/v1/chat',
  availability: '/availability',
  initSession: '/session',
};

export const WELLNESS_TOPICS_ROUTES = {
  monthlyResources: '/monthly-resources',
  topics: '/topics',
};

export const TELEHEALTH_ROUTES = {
  telehealth: '/telehealth',
  mdLiveAppointment: '/md-live-appointment',
};

export const CONTENT_ROUTES = {
  GET_CONTENT: '/:contentKey/:language',
};

export const CLIENT_RESOURCES_ROUTES = {
  clientResources: '/:clientUri/resources',
  clientArticles: '/articles',
  clientCards: '/cards',
};
