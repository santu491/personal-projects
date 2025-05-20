import { act, renderHook } from '@testing-library/react-hooks';
import { Alert, Linking } from 'react-native';

import { AppUrl } from '../../../../../../shared/src/models';
import { callNumber } from '../../../../../../shared/src/utils/utils';
import { useAppContext } from '../../../../../../src/context/appContext';
import { NotificationPayloadType } from '../../../../../../src/models/common';
import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { storage } from '../../../../../../src/util/storage';
import { mockExploreMoreTopics, mockHomeContent, mockTrendingTopics } from '../../../__mocks__/homeContent';
import { ALERT_TYPE, CRITICAL_EVENTS, RedirectURLType } from '../../../config/constants/home';
import { useHomeContext } from '../../../context/home.sdkContext';
import { Screen } from '../../../navigation/home.navigationTypes';
import { useHomeView } from '../useHome';

jest.mock('../../../../../../src/context/appContext');
jest.mock('../../../context/home.sdkContext');
jest.mock('../../../../../../src/util/storage');
jest.mock('../../../../../../shared/src/utils/utils');
jest.mock('../../../../../../src/util/commonUtils');

describe('useHomeView', () => {
  const mockServiceProvider = {
    callService: jest.fn(),
  };
  const mockNavigation = {
    navigate: jest.fn(),
    navigationHandler: {
      linkTo: jest.fn(),
    },
  };
  const mockNavigationHandler = {
    linkTo: jest.fn(),
  };
  const mockContext = {
    loggedIn: true,
    navigationHandler: mockNavigationHandler,
    navigation: mockNavigation,
    memberAppointmentStatus: null,
    serviceProvider: mockServiceProvider,
    homeContent: mockHomeContent,
    trendingTopics: mockTrendingTopics,
    exploreMoreTopics: mockExploreMoreTopics,
    setHost: jest.fn(),
    setHomeContent: jest.fn(),
    setExploreMoreCoursesAndResourcesContent: jest.fn(),
    assessmentsSurveyId: '122323',
    pushNotificationPayload: {
      data: {
        deepLinkType: NotificationPayloadType.CREDIBLEMIND,
      },
    },
    setMenuData: jest.fn(),
    setTrendingTopics: jest.fn(),
    setExploreMoreTopics: jest.fn(),
    setImmediateAssistanceContact: jest.fn(),
    setAssessmentsSurveyId: jest.fn(),
    client: {
      userName: 'testUser',
    },
    metrics: {
      trackState: jest.fn(),
    },
  };
  const mockAppContext = {
    setMemberAppointStatus: jest.fn(),
    client: {
      groupId: '',
      logoUrl: '',
      subGroupName: '',
      supportNumber: '888-888-8888',
      userName: 'Company-demo',
    },
    setGenesysChat: jest.fn(),
    setClient: jest.fn(),
  };

  beforeEach(() => {
    (useHomeContext as jest.Mock).mockReturnValue(mockContext);
    (useAppContext as jest.Mock).mockReturnValue(mockAppContext);
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    (getClientDetails as jest.Mock).mockResolvedValue({ userName: 'testUser', supportNumber: '888-888-8888' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useHomeView());
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isAlertEnabled).toBe(false);
    expect(result.current.alertInfo).toBeUndefined();
  });

  it('should handle assessmentAlertDismiss correctly', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.assessmentAlertDismiss();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isAlertEnabled).toBe(false);
  });

  it('should handle navigateToDetails correctly', () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      internalNavigation: true,
      onPress: jest.fn(),
    };
    act(() => {
      result.current.navigateToDetails(data);
    });
    expect(data.onPress).toHaveBeenCalled();
  });

  it('should handle assessmentAlertConfirm correctly', async () => {
    const { result } = renderHook(() => useHomeView());
    const mockClientDetails = { clientName: 'Test Client' };
    const mockAssessmentSurveyResponse = { data: { assessmentUrl: 'https://example.com' } };

    (storage as jest.Mock).mockReturnValue({
      getObject: jest.fn().mockResolvedValue(mockClientDetails),
    });
    mockServiceProvider.callService.mockResolvedValue(mockAssessmentSurveyResponse);

    await act(async () => {
      await result.current.assessmentAlertConfirm();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isAlertEnabled).toBe(false);
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });

  it('should handle assessmentAlertConfirm with error', async () => {
    const { result } = renderHook(() => useHomeView());
    const mockClientDetails = { clientName: 'Test Client' };

    (storage as jest.Mock).mockReturnValue({
      getObject: jest.fn().mockResolvedValue(mockClientDetails),
    });

    mockServiceProvider.callService.mockRejectedValue(new Error('Error'));

    await act(async () => {
      await result.current.assessmentAlertConfirm();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isAlertEnabled).toBe(true);
  });

  it('should handle navigateToLearnMore correctly', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.navigateToLearnMore();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.CREDIBLEMIND, { url: CRITICAL_EVENTS });
  });

  it('should handle navigateToExplore correctly', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.navigateToExplore();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.EXPLORE_MORE_RESOURCES);
  });

  it('should handle showAlert correctly for SUPPORT type', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.showAlert(ALERT_TYPE.SUPPORT);
    });

    expect(result.current.isAlertEnabled).toBe(true);
  });

  it('should handle showAlert correctly for PENDING_REQUEST type', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.showAlert(ALERT_TYPE.PENDING_REQUEST);
    });

    expect(result.current.isAlertEnabled).toBe(true);
  });

  it('should handle showAlert correctly for APPOINTMENT_CONFIRMED type', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.showAlert(ALERT_TYPE.APPOINTMENT_CONFIRMED);
    });

    expect(result.current.isAlertEnabled).toBe(true);
  });

  it('should fetch home cards info correctly', async () => {
    const menuData = {
      label: 'findProvider',
      openURLInNewTab: 'true',
      redirectUrl: 'page:findCounselor',
      title: 'Find a Provider',
      type: 'cardModel',
    };
    const exploreMoreData = [
      {
        buttonText: 'Explore now',
        description:
          'Your emotional health is an important part of your overall health. With Learn to Live, you can receive support to help you and your household members live your happiest, healthiest lives.',
        image:
          'https://anthem-qa1.adobecqms.net/content/dam/careloneap/images/desktop/courses-and-resources/learn%20to%20live.png',
        openURLInNewTab: true,
        path: '/content/dam/careloneap/content-fragments/courses-and-resources/company-demo/learn-to-live-article1',
        redirectUrl: 'https://www.learntolive.com/partners',
        tags: ['Provider', 'Emotional health', 'Healthiest', 'Cognitive Behavioral Therapy'],
        title: 'Learn to Live',
        type: 'ArticleModel',
        uri: null,
      },
    ];

    const trendingTopics = {
      data: [
        {
          buttonText: null,
          description:
            'Tum dicere exorsus est eligendi optio, cumque nihil ut summo bono, dolorem ipsum autem nusquam hoc.',
          image: null,
          openURLInNewTab: true,
          path: '/content/dam/careloneap/content-fragments/trending-topics/company-demo/find-your-local-eap',
          redirectUrl: 'https://www.beaconhealthoptions.com',
          title: 'Find Your Local EAP',
          type: 'CardModel',
        },

        {
          buttonText: null,
          description:
            'Tum dicere exorsus est eligendi optio, cumque nihil ut summo bono, dolorem ipsum autem nusquam hoc.',
          image: null,
          openURLInNewTab: true,
          path: '/content/dam/careloneap/content-fragments/trending-topics/company-demo/company-demo-eap-resources-near-your-worksite',
          redirectUrl: 'https://www.beaconhealthoptions.com',
          title: 'Company Demo EAP Resources Near Your Worksite',
          type: 'CardModel',
        },
      ],
      emotionalWellness: {
        exploreMore: {
          enabled: true,
          redirectUrl: 'crediblemind:topics',
          subtitle:
            'Life comes with a lot of challenges. Explore topics that can help you improve your emotional well-being.',
          title: 'Emotional wellness topics',
        },
        title: 'Trending topics',
      },
      enabled: true,
      exploreMoreButtonDynamicWPORedirectUrl: false,
      exploreMoreEnabled: true,
      image:
        'https://anthem-qa1.adobecqms.net/content/dam/careloneap/images/desktop/latest/Trending%20Topics%20Img.png',
      openExploreMoreButtonURLInNewTab: false,
      title: 'Trending topics ',
    };

    const carouselData = {
      title: 'Explore more topics',
      data: [
        {
          title: 'Resilience',
          data: [
            {
              type: 'GuidesModel',
              path: '/content/dam/careloneap/content-fragments/CredibleMind Monthly Resource/November - 2024/More Topics Skeleton/resilience/resilience-carousel-items/resilience-tab-fragment',
              data: [
                {
                  type: 'CardModel',
                  path: '/content/dam/careloneap/content-fragments/CredibleMind Monthly Resource/November - 2024/Podcast/how-to-deal-with-anxiety-from-the-news',
                  title: 'How to deal with anxiety from the news',
                  description:
                    "The news is overwhelming right now. Neuroscientist Judson Brewer shares tips on calming your nerves when the headlines won't stop. Take a break and learn about how to better process worry.",
                  image: null,
                  buttonText: 'Listen now',
                  redirectUrl: 'crediblemind:podcasts/how-to-deal-with-anxiety-from-the-news',
                  openURLInNewTab: false,
                  cardTag: 'Podcast',
                  otherCardTags: null,
                  tags: ['Podcast'],
                },
              ],
            },
          ],
        },
      ],
    };

    const immediateAssistance = {
      emergency: { title: 'Emergency', number: '911' },
      suicideOrCrisis: { title: 'Suicide or crisis', number: '988' },
      support: { title: 'EAP support :', number: '888-888-8888' },
    };

    const mockResponse = {
      data: {
        genesysChat: '',
        clientLogo: 'https://example.com',
        supportNumber: '7345789345983',
        host: 'https://example.com',
        coursesAndResources: {
          data: [{ title: 'Course 1' }],
          exploreMore: { data: exploreMoreData, subtitle: 'Subtitle', title: 'Title' },
        },
        home: [{ title: 'Home 1' }],
        menu: [menuData],
        featuredItems: { data: [{ title: 'Course 1' }], title: 'Title' },
        trendingTopics,
        carousel: carouselData,
        immediateAssistance,
        assessmentsSurveyId: '63c97a6c-716e-4006-a34c-b7dd202afa51',
      },
    };
    const mockClientDetails = { clientName: 'Test Client' };

    (storage as jest.Mock).mockReturnValue({
      getObject: jest.fn().mockResolvedValue(mockClientDetails),
      setObject: jest.fn(),
    });
    const { result } = renderHook(() => useHomeView());

    mockServiceProvider.callService.mockResolvedValue(mockResponse);

    await act(async () => {
      await result.current.fetchHomeCardsInfo();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.host).toBe(undefined);
    expect(result.current.homeContent).toEqual(mockHomeContent);
    expect(result.current.exploreMoreCoursesAndResourcesContent).toEqual(undefined);
  });

  it('should handle fetchHomeCardsInfo with error', async () => {
    const { result } = renderHook(() => useHomeView());

    mockServiceProvider.callService.mockRejectedValue(new Error('Error'));

    await act(async () => {
      await result.current.fetchHomeCardsInfo();
    });
    act(() => {
      result.current.onPressContact();
    });
    expect(callNumber).toHaveBeenCalled();

    expect(result.current.loading).toBe(false);
  });

  it('should handle navigateToDetails with wellness', () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),
      redirectUrl: 'page:wellness',
      openURLInNewTab: true,
    };
    act(() => {
      result.current.navigateToDetails(data);
    });
    expect(mockContext.navigationHandler.linkTo).toHaveBeenCalled();
  });

  it('should handle onPressConfirmedRequest', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.onPressConfirmedRequest();
    });
    expect(mockContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.PENDING_REQUESTS });
  });

  it('should handle onPressPendingRequest', () => {
    const { result } = renderHook(() => useHomeView());

    act(() => {
      result.current.onPressPendingRequest();
    });
    expect(mockContext.navigationHandler.linkTo).toHaveBeenCalledWith({ action: AppUrl.PENDING_REQUESTS });
  });

  it('should handle navigateToDetails with http url', () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),
      redirectUrl: 'https://example.com',
      openURLInNewTab: true,
    };
    act(() => {
      result.current.navigateToDetails(data);
    });
    expect(Linking.openURL).toHaveBeenCalled();
  });

  it('should handle navigateToDetails with telehealth success', async () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),

      openURLInNewTab: true,
      path: 'teleHealth',
      redirectUrl: 'api:telehealth',
    };
    mockServiceProvider.callService.mockResolvedValue({ data: { telehealth: 'https://example.com' } });
    await act(async () => {
      result.current.navigateToDetails(data);
    });
    expect(result.current.loading).toBeFalsy();
  });

  it('should handle navigateToDetails with telehealth failure', async () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),

      openURLInNewTab: true,
      path: 'teleHealth',
      redirectUrl: 'api:telehealth',
    };
    mockServiceProvider.callService.mockRejectedValue({ data: { telehealth: 'https://example.com' } });
    await act(async () => {
      result.current.navigateToDetails(data);
    });
    expect(result.current.loading).toBeFalsy();
  });

  it('should handle navigateToDetails with assessments', async () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),

      openURLInNewTab: true,
      path: 'teleHealth',
      redirectUrl: 'api:assessments',
    };
    await act(async () => {
      result.current.navigateToDetails(data);
    });
    expect(result.current.isAlertEnabled).toBeTruthy();
  });

  it('should handle navigateToDetails with redirectionType with CREDIBLE_MIND', async () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),

      openURLInNewTab: true,
      path: 'teleHealth',
      redirectUrl: `${RedirectURLType.CREDIBLE_MIND}:home`,
    };
    await act(async () => {
      result.current.navigateToDetails(data);
    });
    expect(mockNavigation.navigate).toHaveBeenCalled();
  });

  it('should handle navigateToDetails with default', async () => {
    const { result } = renderHook(() => useHomeView());
    const data = {
      onPress: jest.fn(),

      openURLInNewTab: true,
      path: 'teleHealth',
    };
    await act(async () => {
      result.current.navigateToDetails(data);
    });
    expect(Linking.openURL).toHaveBeenCalled();
  });
});
