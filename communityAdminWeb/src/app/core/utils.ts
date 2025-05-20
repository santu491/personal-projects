import * as moment from 'moment';
import { DEEPLINK_ICONS, sortType } from './constants';
import { searchModule } from './defines';
import { ReactionLog, reactionType } from './models';

// Return Relative Time
export const dateDifference = (value: string): string => {
  return moment(value).fromNow();
};

// Sorting Function based on createdAt
export const sortBasedOnCreatedTime = (type: sortType) => {
  if (type === sortType.ASC) {
    return ascendingSorting;
  } else {
    return descendingSorting;
  }
};

// ASC: Sorting Function based on createdAt
export function ascendingSorting(value1: any, value2: any) {
  return value1.createdAt > value2.createdAt
    ? -1
    : value1.createdAt < value2.createdAt
    ? 1
    : 0;
}

// DESC: Sorting Function based on createdAt
export function descendingSorting(value1: any, value2: any) {
  return value1.createdAt < value2.createdAt
    ? -1
    : value1.createdAt > value2.createdAt
    ? 1
    : 0;
}

// Check If Post Edited based on createdTime, updatedTime and editedAfterPublish
export const checkIfEdited = (
  value1: string,
  value2: string,
  editedAfterPublish: boolean
): boolean => {
  let createdTime = new Date(value1).getTime();
  let updatedTime = new Date(value2).getTime();
  if (createdTime !== updatedTime && editedAfterPublish) {
    return true;
  } else return false;
};

// Generate Community-wise DeepLinks
export const generateCommunityDeepLinkData = (
  communityName_en: string,
  communityName_es: string,
  communityId: string
) => {
  let communityDeepLinkObj: any;
  communityDeepLinkObj = {
    communityId: communityId,
    label: communityName_en,
    label_es: communityName_es,
    items: [
      {
        url: `community/${communityId}/landing`,
        label: `${communityName_en} Landing Page`,
        label_es: `${communityName_es} Página de destino`,
      },
      {
        url: `community/${communityId}/tell-your-story`,
        label: `${communityName_en} Tell your story`,
        label_es: `${communityName_es} Cuenta tu historia`,
      },
      {
        url: `community/${communityId}/stories`,
        label: `${communityName_en} Stories`,
        label_es: `${communityName_es} Cuentos`,
      },
      {
        url: `community/${communityId}/posts`,
        label: `${communityName_en} Posts`,
        label_es: `${communityName_es} Publicaciones`,
      },
      {
        label: `${communityName_en} Helpful Info`,
        label_es: `${communityName_es} Información útil`,
        items: [
          {
            url: `community/${communityId}/helpful-info`,
            label: `${communityName_en} Helpful Info Landing Page`,
            label_es: `${communityName_es} Página de inicio de información útil`,
          },
        ],
      },
    ],
  };
  return communityDeepLinkObj;
};

// Generate Final DeepLinks Data for Community/Local/Me Tab
export const getDeepLinkData = (communityDeepLinkData: Array<any>) => {
  let finalData: Array<any> = [];
  let communityDeepLinkObj = {
    label: "Community",
    label_es: "Comunidad",
    items: communityDeepLinkData,
  };
  let localServicesDeepLinkObj = {
    label: "Local services",
    label_es: "Servicios locales",
    url: "localServices",
  };
  let meDeepLinkObj = {
    label: "Me",
    items: [
      {
        url: "me/community-activity",
        label: "Community activity",
        label_es: "Actividad comunitaria",
      },
      {
        url: "me/ways-we-can-help",
        label: "Ways we can help",
        label_es: "Formas en que podemos ayudar",
      },
      {
        url: "me/notification-settings",
        label: "Notification settings",
        label_es: "Configuración de las notificaciones",
      },
      {
        url: "me/app-language",
        label: "App language",
        label_es: "Idioma de la aplicación",
      },
      {
        url: "me/join-community",
        label: "Join community",
        label_es: "Únete a la comunidad",
      },
      {
        url: "me/suggest",
        label: "Suggestion form",
        label_es: "Formulario de sugerencias",
      },
      {
        url: "me/feedback",
        label: "Feedback form",
        label_es: "Formulario de comentarios",
      },
    ],
  };
  finalData.push(communityDeepLinkObj);
  finalData.push(localServicesDeepLinkObj);
  finalData.push(meDeepLinkObj);
  return finalData;
};

const getHelpfulDeepLinks = (contentItem: any, communityId: string) => {
  if (contentItem?.type === "HWVideo" && contentItem?.video) {
    return `community/${communityId}/helpful-info/video/${contentItem.video}`;
  } else if (contentItem?.type === "HWExternalReference" && contentItem?.link) {
    return `community/${communityId}/helpful-info/external-reference/${contentItem.link}`;
  } else if (contentItem?.link) {
    return `community/${communityId}/helpful-info${contentItem.link}`;
  } else return `community/${communityId}/helpful-info${contentItem.link}`;
};

// Generate Helpful DeepLinks Data for each Community
export const generateHelpfulDeepLinks = (
  communityId: string,
  libraryData: any
) => {
  let helpfulNestedData: Array<any> = [];
  if (libraryData?.length) {
    libraryData.map((item: any) => {
      let obj: any;
      let objNestedData: Array<any> = [];

      item.content?.length &&
        item.content.forEach((contentItem: any) => {
          if (contentItem?.video || contentItem?.link) {
            objNestedData.push({
              label: contentItem?.title,
              label_es: contentItem?.title_es,
              url: getHelpfulDeepLinks(contentItem, communityId),
            });
          } else if (contentItem?.types?.length) {
            let contentItemTypeData: Array<any> = [];
            contentItem.types.forEach((contentItemType: any) => {
              if (contentItemType?.link || contentItemType?.video) {
                contentItemTypeData.push({
                  label: contentItemType.title,
                  label_es: contentItemType?.title_es,
                  url: getHelpfulDeepLinks(contentItemType, communityId),
                });
              }
            });
            objNestedData.push({
              label: contentItem?.title,
              items: contentItemTypeData,
            });
          }
        });

      obj = {
        label: item?.title,
        items: objNestedData,
      };
      helpfulNestedData.push(obj);
    });
  }
  return helpfulNestedData;
};

// Get ISO Time
export const getISOTime = (time: Date) => {
  return new Date(time).toISOString();
};

// Get Current Financial Year
export const getCurrentFY = () => {
  let fy = "";
  const today = new Date();
  if (today.getMonth() + 1 <= 3) {
    fy = today.getFullYear() - 1 + "-" + today.getFullYear();
  } else {
    fy = today.getFullYear() + "-" + (today.getFullYear() + 1);
  }
  return fy;
};

export const isHex = (answer: string): boolean => {
  if (answer === undefined || /^ *$/.test(answer) || answer.length !== 24) {
    return false;
  }
  const regexp = /^[0-9a-fA-F]+$/;

  if (regexp.test(answer)) {
    return true;
  } else {
    return false;
  }
};

// Update Current Admin Reaction Text for Comment/Reply
export const updateReactionText = (reaction: reactionType | any) => {
  switch (reaction) {
    case "like":
      return searchModule.en.likedReactionText;
    case "care":
      return searchModule.en.careReactionText;
    case "celebrate":
      return searchModule.en.celebrateReactionText;
    case "good_idea":
      return searchModule.en.goodIdeaReactionText;
    case "remove":
    default:
      return searchModule.en.likeReactionText;
  }
};

// Get Current Admin Reaction
export const getCurrentReaction = (reactionLog: Array<ReactionLog>) => {
  let currentUserId = localStorage.getItem("id");
  let flag: boolean = false;
  let reaction: reactionType | any;
  function sameUserCheck(item: ReactionLog) {
    return item.userId === currentUserId;
  }
  flag = reactionLog.some(sameUserCheck);
  if (flag) {
    reaction = reactionLog.find(sameUserCheck)?.reaction;
  }
  return reaction;
};

export const rolePermissionsValidation = (
  rolePermissions: any,
  entity: string,
  permission: string
) => {
  const roleAccess = JSON.parse(rolePermissions);
  return roleAccess[permission].includes(entity);
};

export const emojiFilter = (e: any) =>
  ![
    "1F972",
    "1F978",
    "1FAC0",
    "1FAC1",
    "1F90C",
    "1F9AC",
    "1F9A3",
    "1F9AB",
    "1F9A4",
    "1FAB6",
    "1F9AD",
    "1FAB2",
    "1FAB1",
    "1FAB0",
    "1FAB3",
    "1FAB4",
    "1FAD0",
    "1FAD2",
    "1FAD1",
    "1FAD3",
    "1FAD5",
    "1FAD4",
    "1FAD6",
    "1F9CB",
    "1FA84",
    "1FA86",
    "1FA85",
    "1FAA2",
    "1FAA1",
    "1F6D6",
    "1FAB5",
    "1FAA8",
    "1F6FC",
    "1F6FB",
    "1FA96",
    "1FA98",
    "1FA97",
    "1FA9D",
    "1FA9B",
    "1FA9A",
    "1FA83",
    "1FA9C",
    "1F6D7",
    "1FA9E",
    "1FA9F",
    "1FAA4",
    "1FAA5",
    "1FAA3",
    "1FAA0",
    "1FAA7",
    "1FAA6",
  ].includes(e);

//Generate a 24 char hex string
export const generateHexId = () => {
    let output = '';
    for (let i = 0; i < 24; ++i) {
        output += (Math.floor(Math.random() * 16)).toString(16);
    }
    return output;
}
export const getDeepLinkIcon = (type: string) => {
  switch (type) {
    case DEEPLINK_ICONS.LOCAL_SERVICE:
      return 'handshake';
    case DEEPLINK_ICONS.JOIN_COMMUNITY:
      return 'group';
    case DEEPLINK_ICONS.PROFILE:
      return 'account_circle';
    case DEEPLINK_ICONS.NOTIFICATION:
      return 'notifications_active';
    case DEEPLINK_ICONS.FEEDBACK:
      return 'feedback ';
    case DEEPLINK_ICONS.SHARE:
      return 'create';

    case DEEPLINK_ICONS.VIDEO:
      return 'play_circle_filled';

    case DEEPLINK_ICONS.READ:
    default:
      return 'library_books';
  }
};
