export const mockTeleHealthResponse = {
  data: {
    host: 'https://qa.carelonwellbeing.com',
    type: 'CardModel',
    path: '/content/dam/careloneap/content-fragments/custom-card/company-demo/counselling-therapy-emotional-assistance-with-verified-experts',
    title: 'Find a counselor',
    description: 'lorem ipsum content goes here for the domar ipsit in the lorem manner for the ipsum thing.',
    image:
      'https://qa.aem.carelonwellbeing.com/content/dam/careloneap/images/desktop/latest/Connect%20with%20a%20counselor%20Img-Opt%201.jpg',
    buttonText: 'Get started',
    redirectUrl: null,
    openURLInNewTab: false,
    tag: null,
    otherTags: null,
    cardUri: 'connect-with-a-counselor',
    telehealth: [
      {
        type: 'CardModel',
        path: '/content/dam/careloneap/content-fragments/tele-health-cards/company-demo/md-live',
        title: 'Emotional support',
        description:
          'Members, dependents, and household family members 10 and older can get matched with a counselor for support via virtual sessions by phone or video.',
        image: 'https://qa.aem.carelonwellbeing.com/content/dam/careloneap/icons/mdlive.png',
        buttonText: 'Get started',
        redirectUrl: 'api:telehealth.emotionalSupport',
        openURLInNewTab: true,
      },
      {
        type: 'CardModel',
        path: '/content/dam/careloneap/content-fragments/tele-health-cards/company-demo/talkspace',
        title: 'Talkspace',
        description:
          'Talkspace offers convenient, online therapy through text, audio and video sessions. You have access to a licensed provider anytime, anywhere via web, iOS, or Android app. When prompted use Organization Name: Company Demo.',
        image: 'https://qa.aem.carelonwellbeing.com/content/dam/careloneap/icons/talkspace.png',
        buttonText: 'Visit portal',
        redirectUrl: 'https://www.talkspace.com/carelonwellbeing',
        openURLInNewTab: true,
      },
      {
        type: 'CardModel',
        path: '/content/dam/careloneap/content-fragments/tele-health-cards/company-demo/array-behavioral-care',
        title: 'Array Behavioral Care',
        description: 'California Residents Only: Access Array AtHome for secure, convenient, online counseling.',
        image: 'https://qa.aem.carelonwellbeing.com/content/dam/careloneap/icons/array.png',
        buttonText: 'Visit portal',
        redirectUrl: 'https://arraybc.com/patients',
        openURLInNewTab: true,
      },
      {
        type: 'CardModel',
        path: '/content/dam/careloneap/content-fragments/tele-health-cards/company-demo/behavioral-care',
        title: 'Carelon Behavioral Care',
        description:
          'Need to talk to someone asap? Schedule your own telehealth therapy to help with stress, depression, anxiety, relationships, and substance use disorders. Self-schedule with Carelon Behavioral Care, a provider of Carelon Behavioral Health. To get started check to see if a counselor serves your state.',
        image: 'https://qa.aem.carelonwellbeing.com/content/dam/careloneap/icons/behavioralcare.png',
        buttonText: 'Get started',
        redirectUrl: 'https://www.carelonbehavioralcare.com/',
        openURLInNewTab: true,
      },
    ],
  },
};
