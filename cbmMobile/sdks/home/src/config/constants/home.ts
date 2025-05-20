import { ImageSourcePropType } from 'react-native';

export const CRITICAL_RESOURCES_URL = 'https://www.carelonwellbeing.com/company-demo/critical-event-resources';
export const LEGAL_URL = 'https://www.carelonwellbeing.com/company-demo/find-legal-support';
export const WORK_LIFE_URL = 'https://www.carelonwellbeing.com/company-demo/work-life-resources';

export const ASSESSMENT_URL =
  'https://assessment.carelonwellbeing.com/survey/anonymous/92537d8f-3b3b-4c4e-a90d-0ebf160ba46f?';
export const WELLBEING_URL = 'https://widget.crediblemind.com/carelon-mobile.html';
export const LEARN_LIVE_URL = 'https://www.learntolive.com/partners';
export const MIND_FULL_URL = 'https://vibe.emindful.com/signup/beaconhealthplans';
export const WEBINAR_URL = 'https://www.carelonwellbeing.com/company-demo/webinar';
export const FEATURED_RESOURCES = 'lists/featured-resources';
export const CRITICAL_EVENTS = 'lists/current-events';

export const ALERT_TYPE = {
  SUPPORT: 'SUPPORT',
  PENDING_REQUEST: 'PENDING_REQUEST',
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
  TRY_AGAIN: 'TRY_AGAIN',
};

export enum RedirectURLType {
  API = 'api',
  CREDIBLE_MIND = 'crediblemind',
  HTTPS = 'https',
  PAGE = 'page',
}

export const RE_DIRECT_URL_API_TYPE = {
  TELEHEALTH_EMOTIONAL_SUPPORT: 'telehealth.emotionalSupport',
  PROVIDERS_FIND_COUNSELOR: 'providers.findCounselor',
  PROVIDERS_TELE_HEALTH: 'findACounselor.telehealth',
  WELLNESS: 'wellness',
  WORK_LIFE_RESOURCE: 'workLifeResources',
  LEGAL_SUPPORT: 'findLegalSupport',
  PLAN_FINANCE: 'planFinances',
  CARD_DETAILS: 'cardDetails',
};

export enum CardType {
  BANNER_WITH_PRIMARY_BUTTON = 'bannerWithPrimaryButton',
  CARD_WITH_OUT_IMAGE = 'cardWithoutImage',
  CARD_WITH_SECONDARY_BUTTON = 'cardWithSecondaryButton',
  CAROUSEL_TABS_WITH_CARDS_IMAGE_TOP = 'carouselTabsWithCardsImageTop',
  CAROUSEL_WITH_CARDS_IMAGE_TOP = 'carouselWithCardsImageTop',
  CAROUSEL_WITH_ICON_BOTTOM_RIGHT = 'carouselWithIconBottomRight',
  FEATURED_ITEMS = 'featuredItems',
}

export enum ResourceType {
  CONFIG = 'config',
  GENESYS_CHAT = 'genesysChat',
}

export interface Menu {
  action?: {
    hideTabBar?: boolean;
    imagePath?: ImageSourcePropType;
    screenName?: string;
    showAlert?: boolean;
  };
  data?: MenuList[];
  description?: string;
  icon?: string;
  label?: string;
  onPress?: () => void;
  title?: string;
}

export interface MenuList {
  label: string;
  value: string | undefined;
}

export const resourceContent = {
  data: {
    header: [
      {
        index: 0,
        id: 'brandLogo',
        type: 'logo',
        url: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/carelon-logo.png',
        uiComponent: 'headerLogoLeft',
      },
      {
        index: 1,
        id: 'clientLogo',
        type: 'logo',
        url: 'https://uat.aem.carelonbh.com/content/dam/mhsud/emblem/emblem-cobranding.svg',
        uiComponent: 'headerLogoRight',
      },
      {
        index: 2,
        id: 'userIcon',
        type: 'icon',
        url: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/user-male-circle.png',
        uiComponent: 'headerIcon',
      },
      {
        index: 3,
        id: 'memberSupport',
        label: 'Member Support: 888-447-2526',
        type: 'headerItem',
        data: [
          {
            redirectUrl: 'sms:888-447-2526',
            type: 'text',
            value: '888-447-2526',
            key: 'Text',
          },
          {
            redirectUrl: 'page:chat',
            type: 'chat',
            value: 'Start Chat',
            key: 'Chat',
          },
          {
            redirectUrl: 'phone:888-447-2526',
            type: 'call',
            value: '888-447-2526',
            key: 'Call',
          },
        ],
        uiComponent: 'labelUnderlineLeft',
      },
      {
        index: 4,
        id: 'crisisSupport',
        label: 'Crisis Support',
        type: 'headerItem',
        data: [
          {
            redirectUrl: 'phone:911',
            type: 'call',
            value: '911',
            key: 'Emergency',
          },
          {
            redirectUrl: 'phone:988',
            type: 'call',
            value: '988',
            key: 'Suicide or Crisis',
          },
          {
            redirectUrl: 'phone:888-447-2526',
            type: 'call',
            value: '888-447-2526',
            key: 'Member Support',
          },
        ],
        uiComponent: 'labelUnderlineRight',
      },
    ],
    body: [
      {
        index: 0,
        id: 'home',
        title: 'Find a provider',
        data: [
          {
            image: 'https://uat.aem.carelonbh.com/content/dam/mhsud/template/provider-search/Image-10.jpg',
            buttonText: 'Search',
            redirectUrl: 'page:findACounselor.telehealth',
            title: 'Find a provider',
          },
        ],
        uiComponent: 'bannerWithPrimaryButton',
      },
      {
        loadMoreLabel: 'View all',
        data: [
          {
            path: '/emblemhealth/en/home/services/clinical-referral-line',
            title: 'Clinical Referral Line',
            description:
              'Get referrals from highly trained and specialized clinicians who are there to help you find the best care.',
            redirectUrl: 'https://uat.aem.carelonbh.com/emblemhealth/en/home/services/clinical-referral-line',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/clinical-referral-line.png',
          },
          {
            path: '/emblemhealth/en/home/services/manage-benefits',
            title: 'Manage Benefits',
            description: 'Get the most out of your behavioral health benefits.',
            redirectUrl: 'https://uat.aem.carelonbh.com/emblemhealth/en/home/services/manage-benefits',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/manage-benefits.png',
          },
          {
            path: '/emblemhealth/en/home/services/about',
            title: 'Learn More',
            description:
              'Learn more about the benefits and services available to you and your immediate family members.​',
            redirectUrl: 'https://uat.aem.carelonbh.com/emblemhealth/en/home/services/about',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/about.png',
          },
          {
            path: '/emblemhealth/en/home/my-profile',
            title: 'My Profile',
            description: 'My profile',
            redirectUrl: 'https://uat.aem.carelonbh.com/emblemhealth/en/home/my-profile',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/my-profile.png',
          },
        ],
        scrollLimit: 3,
        index: 1,
        id: 'services',
        title: 'Services',
        uiComponent: 'carouselWithIconBottomRight',
      },
      {
        loadMoreLabel: 'View all',
        data: [
          {
            path: '/emblemhealth/en/home/mental-health-parity-disclosures',
            type: 'Article',
            title: 'Mental Health Parity Disclosure for Emblem Medicaid Members in New York',
            description:
              'As part of its commitment to New York state and the Office of the Attorney General, Carelon Behavioral Health makes the enclosed disclosures to it fully funded and state and local governmental health plans in New York.',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/comfort.png',
            redirectUrl: 'https://uat.aem.carelonbh.com/emblemhealth/en/home/mental-health-parity-disclosures',
            downloadable: false,
          },
          {
            path: '/emblemhealth/en/home/community-resources',
            type: 'Article',
            title: 'Community resources',
            description:
              'Click here to learn more about help and resources made available through NY State and National agencies.',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/comfort.png',
            redirectUrl: 'https://uat.aem.carelonbh.com/emblemhealth/en/home/community-resources',
            downloadable: false,
          },
          {
            type: 'Document',
            title: '2022 EmblemHealth/GHI Quality Program Member Newsletter',
            description:
              'At Carelon Behavioral Health, we want to make sure the every member gets safe and effective treatment for their mental health or substance abuse needs. Clinical here to learn more about our Quality Assurance program, and what that means for you and your family.',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/document.png',
            redirectUrl:
              'https://uat.aem.carelonbh.com/content/dam/mhsud/emblem/documents/Emblem%20newsletter.07-08-2022.pdf',
            downloadable: true,
          },
          {
            type: 'Document',
            title: 'The City of New York’s OLR & Union Employee Assistance Programs',
            description:
              'The City of New York offers its employees and their dependents a helping hand through a network of Employee Assistance Programs. Generally, an EAP provides education, information, counseling and individualized referrals to assist with a wide range of personal and social problems. The NYC EAP provides services to the City of New York non-uniform Mayoral agencies, NYC Department of Correction, New York City Housing Authority and NYC Health + Hospitals. Employees and their families can learn more by clicking here.',
            icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/document.png',
            redirectUrl:
              'https://uat.aem.carelonbh.com/content/dam/mhsud/emblem/documents/NYC%20Employee%20Assistance%20Program.pdf',
            downloadable: true,
          },
        ],
        scrollLimit: 3,
        index: 2,
        id: 'resources',
        title: 'Resources',
        uiComponent: 'carouselWithCardImageLeft',
      },
      {
        index: 3,
        id: 'genesysChat',
        uiComponent: 'widgetBottomRight',
        ':type': 'mhsud/components/chat',
        notAvailableTitle: 'Customer support chat',
        emailValidationErrorMessage: "Email isn't valid",
        src: 'https://webchat.beaconhealthoptions.com/clients/MHSUDClientEmblem/js/chat.js',
        formKeyMissingErrorMessage:
          "Our website's chat is currently experiencing technical problems. Please refresh the page and try again.",
        textIsRich: ['true', 'true'],
        phoneNumberPlaceholder: 'Phone number',
        firstNamePlaceholder: 'First name',
        generalErrorMessage: 'General error',
        formKeyMissingErrorTitle: 'Technical Issue in Customer Service Chat',
        logoSrc: '/content/dam/mhsud/emblem/Carelon Logo.svg',
        emailPlaceholder: 'Email',
        holidayDescription: "<h4>Live chat isn't available during the holidays.</h4>\r\n",
        planPlaceholder: 'Member plan',
        openChatIconSrc: '/content/dam/mhsud/icons/chat-icon.png',
        lastNamePlaceholder: 'Last name',
        notAvailableDescription:
          '<h5>Live chat is currently unavailable</h5>\r\n<p>Live chat is available:</p>\r\n<p>Monday - Friday</p>\r\n<p>8 a.m. to 8 p.m. ET</p>\r\n<p>For immediate support, call the Customer Support line.</p>\r\n<p>If you are experiencing a mental health emergency, call or text <a href="tel:988">988</a>.</p>\r\n',
        closeChatIconSrc: '/content/dam/mhsud/icons/chat-icon.png',
        subjectPlaceholder: 'Subject',
        memberPlanErrorMessage: 'Member plan error',
        holidayTitle: 'Customer support chat',
        chatType: 'genesys',
        logo: 'https://uat.aem.carelonbh.com/content/dam/mhsud/emblem/Carelon Logo.svg',
        icon: 'https://uat.aem.carelonbh.com/content/dam/mhsud/icons/chat-icon.png',
      },
      {
        aemHost: 'https://qa.aem.graphql.internal.das',
        aemAssetsPath: 'api/assets/carelon-bh-mobile/assets/images',
        id: 'config',
        mhsudHost: 'https://uat.aem.carelonbh.com',
      },
    ],
    footer: [
      {
        icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/home.png',
        id: 'home',
        label: 'Home',
        openURLInNewTab: false,
        redirectUrl: 'page:home',
        type: 'footerItem',
      },
      {
        icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/member-plan.png',
        id: 'memberPlan',
        label: 'Member Plan',
        openURLInNewTab: false,
        redirectUrl: 'page:memberPlan',
        type: 'footerItem',
      },
      {
        icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/care.png',
        id: 'care',
        label: 'Care',
        openURLInNewTab: false,
        redirectUrl: 'page:care',
        type: 'footerItem',
      },
      {
        icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/wellness.png',
        id: 'wellness',
        label: 'Wellness',
        openURLInNewTab: false,
        redirectUrl: 'page:wellness',
        type: 'footerItem',
      },
      {
        openURLInNewTab: false,
        redirectUrl: 'accordian:data',
        data: [
          {
            openURLInNewTab: false,
            redirectUrl: 'accordian:data',
            data: [
              {
                id: 'findCounselor',
                label: 'Provider Search',
                openURLInNewTab: false,
                redirectUrl: 'page:findCounselor',
                type: 'menuItem.list.child',
              },
              {
                id: 'appointments',
                label: 'Appointments',
                openURLInNewTab: false,
                redirectUrl: 'page:appointments',
                type: 'menuItem.list.child',
              },
            ],
            icon: 'calendarPlus',
            id: 'care',
            label: 'Care',
            type: 'menuItem.list',
          },
          {
            openURLInNewTab: false,
            redirectUrl: 'accordian:data',
            data: [
              {
                id: 'planSummary',
                label: 'Plan Summary',
                openURLInNewTab: false,
                redirectUrl: 'page:planSummary',
                type: 'menuItem.list.child',
              },
              {
                id: 'claims',
                label: 'Claims',
                openURLInNewTab: false,
                redirectUrl: 'page:claims',
                type: 'menuItem.list.child',
              },
              {
                id: 'authorizations',
                label: 'Authorizations',
                openURLInNewTab: false,
                redirectUrl: 'page:authorizations',
                type: 'menuItem.list.child',
              },
              {
                id: 'benefitsAndCoverage',
                label: 'Benefits and Coverage',
                openURLInNewTab: false,
                redirectUrl: 'page:benefitsAndCoverage',
                type: 'menuItem.list.child',
              },
            ],
            icon: 'people',
            id: 'memberPlan',
            label: 'Member Plan',
            type: 'menuItem.list',
          },
          {
            icon: 'hospitalIndemnity',
            id: 'servicesAndBenefits',
            label: 'Services and Benefits',
            openURLInNewTab: false,
            redirectUrl: 'page:servicesAndBenefits',
            type: 'menuItem.list',
          },
          {
            icon: 'idVerified',
            id: 'carelonAssessments',
            label: 'Carelon Assessments',
            openURLInNewTab: false,
            redirectUrl: 'page:carelonAssessments',
            type: 'menuItem.list',
          },
          {
            icon: 'dental',
            id: 'carelonWellbeing',
            label: 'Carelon Wellbeing',
            openURLInNewTab: false,
            redirectUrl: 'page:carelonWellbeing',
            type: 'menuItem.list',
          },
          {
            icon: 'supplementalHealth',
            id: 'wellnessContent',
            label: 'Wellness Content',
            openURLInNewTab: false,
            redirectUrl: 'page:wellness',
            type: 'menuItem.list',
          },
          {
            icon: 'customerSupport',
            id: 'contactUs',
            label: 'Contact Us',
            openURLInNewTab: false,
            redirectUrl: 'page:contactUs',
            type: 'menuItem.list',
          },
          {
            openURLInNewTab: false,
            redirectUrl: 'accordian:data',
            data: [
              {
                icon: 'userTick',
                id: 'personalInformation',
                label: 'Personal Information',
                openURLInNewTab: false,
                redirectUrl: 'page:personalInformation',
                type: 'menuItem.list.child',
              },
              {
                icon: 'invisible',
                id: 'password',
                label: 'Password',
                openURLInNewTab: false,
                redirectUrl: 'page:password',
                type: 'menuItem.list.child',
              },
              {
                icon: 'appointmentReminder',
                id: 'notifications',
                label: 'Notifications',
                openURLInNewTab: false,
                redirectUrl: 'page:notifications',
                type: 'menuItem.list.child',
              },
              {
                icon: 'customerSupport',
                id: 'contactUs',
                label: 'Contact Us',
                openURLInNewTab: false,
                redirectUrl: 'page:contactUs',
                type: 'menuItem.list.child',
              },
              {
                icon: 'attention',
                id: 'crisisSupport',
                label: 'Crisis Support',
                openURLInNewTab: false,
                redirectUrl: 'page:crisisSupport',
                type: 'menuItem.list.child',
              },
            ],
            icon: 'userMaleCircle',
            id: 'account',
            label: 'Account',
            experienceType: 'secure',
            type: 'menuItem.list',
          },
          {
            id: 'signup',
            label: 'Sign Up',
            openURLInNewTab: false,
            redirectUrl: 'page:signup',
            experienceType: 'public',
            type: 'menuItem.button',
          },
          {
            id: 'signin',
            label: 'Sign In',
            openURLInNewTab: false,
            redirectUrl: 'page:signin',
            experienceType: 'public',
            type: 'menuItem.button',
          },
          {
            id: 'signout',
            label: 'Sign Out',
            openURLInNewTab: false,
            redirectUrl: 'page:signout',
            experienceType: 'secure',
            type: 'menuItem.button',
          },
        ],
        icon: 'https://qa.aem.graphql.internal.das/api/assets/carelon-bh-mobile/assets/images/menu.png',
        id: 'menu',
        label: 'Menu',
        type: 'footerItem',
      },
    ],
  },
};
