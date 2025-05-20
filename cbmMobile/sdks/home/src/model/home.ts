import { ImageSourcePropType, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { GenesysChat } from '../../../../shared/src/models/src/features/chat';
import { HeaderInfo } from '../../../../shared/src/models/src/features/header';

export interface CardInfoDTO {
  buttonText?: string;
  cardUri?: string;
  description?: string;
  icon?: string;
  image?: string;
  openURLInNewTab?: boolean;
  otherTags?: string[];
  path?: string;
  redirectUrl?: string;
  supportNumber?: string;
  tags?: string[];
  title?: string;
  type?: string;
  uri?: string;
}

export interface CardsData extends CardInfoDTO {
  criticalEvent?: boolean;
  displayText?: string;
  imagePath?: ImageSourcePropType;
  internalNavigation?: boolean;
  localImage?: boolean;
  onPress?: () => void;
}

export interface CardsSectionDataDTO {
  data: CardsData[];
  subTitle?: string;
  title?: string;
}

export type CardsSectionData = CardsSectionDataDTO;

export type CardInfo = CardInfoDTO;
export interface CoursesDataExploreDTO {
  data: CardInfoDTO[];
  subtitle?: string;
  title?: string;
}

export interface CoursesAndResourcesDataDTO {
  data?: CardInfoDTO[];
  exploreMore?: CoursesDataExploreDTO;
  title: string;
}

export interface TrendingTopicsDTO {
  data: CardInfoDTO[];
  emotionalWellness: EmotionalWellnessDTO;
  enabled: boolean;
  exploreMoreEnabled: boolean;
  title: string;
}

export interface TrendingTopics {
  data: CardInfoDTO[];
  exploreMore: ExploreMoreDTO;
  exploreMoreEnabled?: boolean;
  title: string;
}

export interface EmotionalWellnessDTO {
  data: CardInfoDTO[];
  exploreMore: ExploreMoreDTO;
  title: string;
}

export interface ExploreMoreDTO {
  enabled: boolean;
  redirectUrl: string;
  subtitle: string;
  title: string;
}
export interface ExploreMoreTopicsDTO {
  data?: ExploreMoreTopicsDataDTO[];
  title: string;
}
export interface ExploreMoreTopicsDataDTO {
  data?: CardsSectionDataDTO[];
  path: string;
  title: string;
  type: string;
}

export interface ResourceDataDTO {
  body?: HomeCardsData[];
  header?: HeaderInfo[];
}

export interface ResourceConfig {
  aemAssetsPath: string;
  aemHost: string;
  assessmentsSurveyId: string;
  clientName: string;
  credibleMindClientName: string;
  customClient: boolean;
  disableCallText: boolean;
  eapHost?: string;
  enable: boolean;
  enableAppointmentScheduling: boolean;
  enableCredibleMinds: boolean;
  enableCustomCardDescription: boolean;
  enableSearchCounsellor: boolean;
  enableSecureExperience: boolean;
  id: string;
  isTerminated: boolean;
  mhsudHost?: string;
  path: string;
  supportNumber: string;
  type: string;
  welcomeSubtitle: string;
  welcomeTitle: string;
  wpoClientName: string;
}

export interface HomeCardsData extends GenesysChat, ResourceConfig {
  data?: CardInfoDTO[] | ExploreMoreTopicsDTO[];
  exploreMore?: ExploreMore;
  id: string;
  image?: string;
  loadMoreLabel?: string;
  scrollLimit?: number;
  title?: string;
  uiComponent?: string;
}

export interface ExploreMore {
  enabled: boolean;
  redirectUrl: string;
  subTitle: string;
  title: string;
}

export interface ImmediateAssistanceDTO {
  [key: string]: ImmediateAssistanceInfo;
}

export interface ImmediateAssistanceInfo {
  number: string;
  title: string;
}

export interface ResourceDTO {
  data: ResourceDataDTO;
}

export interface AssessmentSurveyResponseDTO {
  data: AssessmentUrlDTO;
}

export interface AssessmentUrlDTO {
  assessmentUrl: string;
  serviceToken: string;
  uri: string;
}

export interface TeleHealthDTO extends CardInfo {
  telehealth: CardInfo[];
}

export interface TeleHealthResponseDTO {
  data: TeleHealthDTO;
}

export interface HomeCardProps {
  backgroundImageStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  item: CardsData;
  navigateToDetails: (item: CardsData) => void;
  showHorizontalLine?: boolean;
  tagTextStyle?: StyleProp<TextStyle>;
  tagViewStyle?: StyleProp<ViewStyle>;
}

export interface ClientResponseDTO {
  data: ClientDataDTO;
}

export interface ClientsDTO {
  clients: ClientDataDTO[];
  message: string;
  success: boolean;
}

export interface ClientDataDTO {
  supportNumber: string;
}
