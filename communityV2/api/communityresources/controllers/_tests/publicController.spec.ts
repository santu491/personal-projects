import { API_RESPONSE } from '@anthem/communityapi/common';
import { mockPartnerSvc, mockPublicSvc, mockResult, mockValidation } from '@anthem/communityapi/common/baseTest';
import { mockILogger } from '@anthem/communityapi/logger/mocks/mockILogger';
import { APP } from '@anthem/communityapi/utils';
import { PublicController } from '../publicController';

describe('PublicController', () => {
  let ctrl: PublicController;

  beforeEach(() => {
    ctrl = new PublicController(<any>mockPublicSvc, <any>mockResult, <any>mockValidation, <any>mockPartnerSvc,  <any>mockILogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should Return API version', async () => {
    const expRes = `${APP.config.app.apiVersion} ${APP.config.env}`;
    mockPublicSvc.getAppVersion.mockReturnValue(expRes);
    const data = await ctrl.version();
    expect(data).toBe(expRes);
  });

  it('Should Return APP version', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          id: '601c1c415c474da1053b976b',
          ios: '1.1.0',
          android: '1.1.0'
        }
      }
    };
    mockPublicSvc.getAppMinVersion.mockReturnValue(expRes);
    const data = await ctrl.getAppMinVersion();
    expect(data).toEqual(expRes);
  });

  it('Should Generate a token for DEV login', async () => {
    const model = {
      username: 'SIT3GAJONES'
    };
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          unreadReceivedQuestionsCount: 14,
          unreadSentQuestionsCount: 1,
          id: '60646f69a450020007eae243',
          firstName: 'GARRET',
          lastName: 'BODOVSKY',
          username: '~SIT3SB422I10091',
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNGQ5ODRkMmEyYWI4ZDdiNjRjMzU2NjMzNTEzZjc0NjdmZWI2N2Y3YTU4NjY5ZGJlNDc1OGQ1YWE5NTdlYjlkYjFiNmZhODZkOTI4MjhkYWZhZTQ5OWYyNDY3N2JiN2VlIiwiaWQiOiI0YjdkM2NhZTcxZWVlODdjYmJlMDg5NGEwYzZjMGM3NWMwMDNjZTQ0MzM3MGFlMTY3ZTI3MTYzODgyMDYxMWVhMzE1N2QxNjYxMjg5MGMyMGIwOTI2NzMwNmEzY2JmMzYiLCJmaXJzdE5hbWUiOiIyZWRhMDE4MmFkZGE3OWViMzAyMWEzZmE0ZDI5OWJjODNmYzY2Y2RhNDZmY2I1Y2I0MmJkZjlmN2ZhMDQxMTEzIiwibGFzdE5hbWUiOiJkZTJmNzFkZTk1NWVlYmZmZjJkYzhiYzNhYzI2YWFiYjlhZWI5ODcyNWY1NmRiMWExZGJlOTA0NDZjMTk4YTU5IiwiYWN0aXZlIjp0cnVlLCJpc0RldkxvZ2luIjoidHJ1ZSIsImlhdCI6MTYyMzY4MTkwNywiZXhwIjoxNjIzNzEwNzA3LCJzdWIiOiJ-U0lUM1NCNDIySTEwMDkxIiwianRpIjoiZDlkYzM1OTI0ZTMyMmJmOWJmZWJhZjVkNThlZTVlMGIxMjI1ZmMxMGMzYzUzMzBmMmNjNGJmMmYyY2E3OTM0ZTg2YTIyNDQ1MjQxODIxNzhhNDUyZjkyNGNkYzcyNTAwIn0.VOKHR9-ddvEqp1ZQySv6b8nwgGu5ZVq84p08m2_Y934',
          email: null,
          gender: 'Female',
          genderRoles: {
            genderPronoun: 'she',
            genderPronounPossessive: 'her'
          },
          phoneNumber: null,
          deviceId: null,
          deviceType: null,
          displayName: null,
          dateOfBirth: null,
          userLocation: null,
          userGeoLocation: null,
          age: 60,
          profilePicture: '2baa8dc6-02b0-4b10-889e-eb7173f24a04.jpg',
          myCommunities: [
            '5f0753f6c12e0c22d00f5d23',
            '5f22db56a374bc4e80d80a9b',
            '5f07537bc12e0c22d00f5d21',
            '5f0e744536b382377497ecef',
            '5f245386aa271e24b0c6fd88',
            '5f0753b7c12e0c22d00f5d22',
            '60a358bc9c336e882b19bbf0',
            '607e7c99d0a2b533bb2ae3d2'
          ],
          myFilters: null,
          active: true,
          personId: '348105858',
          hasAgreedToTerms: false,
          memberData: {
            userId: 'c8a47249-8d25-4d0e-b8da-117446d436db',
            brand: 'ABC',
            underState: 'CA',
            groupId: '175075',
            subscriber: 'SCRBR',
            sourceSys: 'WGS20',
            lob: 'LG',
            planType: 'HMO',
            subGroupId: '175075H204'
          }
        }
      }
    };
    mockPublicSvc.devAuthenticate.mockReturnValue(expRes);
    const data = await ctrl.devAuthenticate(model);
    expect(data).toEqual(expRes);
  });

  it('Should return error when empty username is provide for dev login', async () => {
    const model = {
      username: ''
    };
    const expRes = {
      data: {
        isSuccess: false,
        isException: false,
        errors: [
          {
            id: '08b110fb-1e2b-6df6-0166-83ae4ad5acb8',
            errorCode: API_RESPONSE.statusCodes[400],
            title: API_RESPONSE.messages.noUserNameTitle,
            detail: API_RESPONSE.messages.noUserNameDetail
          }
        ]
      }
    };
    mockResult.createError.mockReturnValue(expRes);
    const data = await ctrl.devAuthenticate(model);
    expect(data).toEqual(expRes);
  });

  it('Should Return Error while retrieving Binder Info', async () => {
    mockPublicSvc.checkHealth.mockReturnValue({
      data: {
        isSuccess: true,
        value: [
          {
            serviceName: 'MongoDB',
            status: 'Healthy'
          },
          {
            serviceName: 'API Gateway',
            status: 'Healthy'
          },
          {
            serviceName: 'Healthwise',
            status: 'Healthy'
          }
        ]
      }
    });
    const res = await ctrl.checkHealth();
    expect(res).toContain('<li>MongoDB<br>Healthy<br></li>');
    expect(res).toContain('<li>API Gateway<br>Healthy<br></li>');
    expect(res).toContain('<li>Healthwise<br>Healthy<br></li>');
  });

  it('Should Return Translation data for app', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          language: 'en',
          data: {
            onboarding: {
              content: {
                bottomButtons: {
                  saveContinueLabel: 'Save and Continue',
                  skipStepButton: 'Skip This Step'
                },
                topButtons: {
                  exitButton: 'Yes, Exit',
                  continueSetupButton: 'No, Continue Set Up'
                },
                communityScreen: {
                  preferencesLabel: 'preferences',
                  label: 'Which communities are you interested in?',
                  selectLabel: 'SELECT ALL THAT APPLY',
                  expandedButton: 'expanded',
                  collapsedButton: 'collapsed'
                },
                settingsScreen: {
                  label: 'Settings',
                  saveContinueLabel: 'Save and Continue',
                  stayConnectedLabel:
                    'Stay connected to activity within the communities you join and improve search results by enabling these settings',
                  enablePushLabel: 'Enable push notifications',
                  programsNearLabel:
                    'Find free and reduced-cost aid and programs near you.',
                  tailorLocationLabel:
                    'We can tailor these to your location if you enable location services.',
                  recommendationsLabel: 'Get better recommendations',
                  enableLocationLabel: 'Enable location services',
                  orLabel: 'or',
                  enterZiPCode: 'Enter your ZIP Code',
                  validZipCode: 'Please enter a valid USA ZIP code'
                },
                touScreen: {
                  warning: {
                    touViolation: {
                      title: 'Terms of use violation',
                      message:
                        'We detected inappropriate language in your answer. We have replaced the language with asterisks and highlighted the field. You can continue with your asterisks in place or change the language.'
                    }
                  },
                  publicProfileLabel: 'Public Profile',
                  preferencesLabel: 'Preferences',
                  waysToHelpLabel: 'Ways We Can Help',
                  settingsLabel: 'Settings',
                  letsLabel: "let's",
                  personalizeLabel: 'personalize',
                  yourExperienceLabel: 'your experience',
                  setUpAccountLabel:
                    "In the next few screens, we'll help set up your account and start you on your way.",
                  participationLabel: 'Participation Guidelines',
                  touMessage: {
                    label1:
                      'Our goal is to create a welcoming space where members feel comfortable freely sharing knowledge and experience with others. That’s why we are asking everyone to review and adhere to our',
                    label2: 'Terms of Use',
                    label3: 'and',
                    label4: 'Privacy Policies',
                    label5: 'Privacy Policies',
                    label6: 'before continuing.',
                    label7:
                      'By accepting user agrees to abide by the Terms of Use and Privacy Policies.',
                    label8:
                      'I agree to abide by the Terms of Use and Privacy Policies.',
                    submitButton: 'Submit'
                  }
                },
                localServicesScreen: {
                  message:
                    "Everybody needs a little help now and then - that's what communities are for! Select any of these categories and the app will help connect you to free and low-cost services in your area.",
                  checkedLabel: 'Checked',
                  unCheckedLabel: 'Unchecked',
                  waysHelpLabel: 'ways we can help'
                },
                profileScreen: {
                  label: 'Profile, OnBoarding Screen',
                  nextLabel: 'Next',
                  skipLabel: 'Skip On Profile',
                  chooseLibraryLabel: 'Choose from Library',
                  removeCurrentPhotoLabel: 'Remove Current Photo',
                  photoErrorLabel: 'Photo Error',
                  pleaseRetryLabel: 'Please retry',
                  okLabel: 'OK',
                  displayNameUpdatedMessage:
                    'display name updated successfully',
                  photoUpdatedSuccessfullyMessage: 'Photo updated successfully',
                  photoDeletedSuccessfullyMessage: 'Photo removed successfully',
                  photoDeletedErrorMessage: 'photo delete failed',
                  uploadErrorMessage: 'Upload Error',
                  pleaseRetryMessage: 'Please retry.',
                  profilePhotoChangeMessage: 'Change Profile Photo',
                  enterOptionalNameMessage: 'Enter an optional nickname here',
                  otherMembersMessage: 'Other members will see you as',
                  errors: {
                    displayNameLabel:
                      'An error occurred updating the display name',
                    largePhotoLabel:
                      "Photo Error','Please select a smaller photo",
                    photoLabel: 'Photo Error,Please retry',
                    uploadPhotoLabel: 'Photo Upload Error,Please retry',
                    invalidResponseLabel: 'Invalid Response,Please retry.'
                  }
                },
                profileScreenHeader: {
                  publicLabel: 'public',
                  profileLabel: 'profile',
                  personalizePostMessage:
                    'Personalize your posts and help others engage with them by adding a profile picture and nickname here.'
                },
                uploadProfilePhoto: {
                  addPhotoLabel: 'Add profile photo',
                  editPhotoLabel: 'Edit profile photo'
                },
                communitiesSummaryScreen: {
                  label: 'Community',
                  readLabel: 'Read',
                  articleVideoLabel: 'Articles and Videos',
                  editLabel: 'Edit',
                  joinLabel: 'Join a Community'
                },
                localServicesSummaryScreen: {
                  thereAreLabel: 'There are ',
                  nearLabel: 'local services near you.',
                  programsNearLabel:
                    'Find free and reduced-cost aid and programs near you.',
                  findLabel: 'Find Local Services for',
                  needsLabel: 'needs',
                  label: 'Local Services',
                  exploreLabel: 'Explore All Local Services'
                },
                OnBoardingSummaryScreen: {
                  takeToHomePageLabel: 'Take Me to the Homepage',
                  setupSummaryLabel: 'setup summary',
                  readyToGoLabel:
                    'Your account is personalized and ready to go. What would you like to do next?',
                  adjustSettingsLabel:
                    'You can adjust these settings in the profile section of the app.',
                  partOfLabel: "You're now part of",
                  noPartCommunityLabel: "You aren't part of a community yet.",
                  selectOneToExploreLabel: 'Select one to explore first.',
                  readArticlesLabel: 'Read Articles and Videos',
                  deepDiveInterestedLabel: 'Do a deep dive into your interests'
                },
                shareStoryScreen: {
                  experienceLabel: 'Ready to talk about your experience with',
                  myStoryLabel: 'Share My Story'
                },
                termsScreen: {
                  acceptLabel:
                    "Our communities are welcoming and inclusive places where members feel comfortable freely sharing knowledge and experience with others. That'92s why we ask everyone to review and accept our",
                  label: 'Terms of Use',
                  andLabel: 'and',
                  privacyPolicyLabel: 'Privacy Policies',
                  beforeContinuingLabel: 'before continuing.',
                  agreeTermsOfUse:
                    'I agree to follow the Terms of Use and Privacy Policies.'
                }
              },
              warnings: {},
              errors: {}
            },
            local: {
              content: {
                filterLabel: {
                  moreFiltersLabel: 'See more filters',
                  removeLabel: 'Remove',
                  filterLabel: 'Filter'
                },
                header: {
                  enterZipCodeLabel: 'Enter your zipcode',
                  findLocalServicesLabel: 'Find Local Services',
                  discoverServiceZipCodeLabel:
                    'Enter your ZIP code to discover free or reduced cost services like medical care, food, job training, and more.',
                  searchLocalLabel:
                    'Search around you for local help & services',
                  searchLabel: 'Search',
                  enterValueToSearchLabel: 'Please enter the value to search',
                  quickSearchCategory: 'QUICK CATEGORY SEARCH'
                },
                searchResultItem: {
                  informationAbout: 'Information about '
                },
                filterBar: {
                  enterYourZipCodeLabel: 'Enter your zipcode',
                  showingLabel: 'Showing',
                  resultsNearLabel: 'results near',
                  filterButton: 'This is a filter button'
                },
                filterModalIndex: {
                  backLabel: 'Back',
                  programFilterLabel: 'Program Filters',
                  applyFilterLabel: 'Apply Filter(s)'
                },
                locationModal: {
                  permissionNotGrantedLabel: 'Location Permission not Granted',
                  userMyCurrentLocationLabel: 'Use My Current Location',
                  enterZipCodeLabel: 'Enter ZIP Code',
                  searchByZipCodeLabel: 'Search by zip code',
                  cancelLabel: 'Cancel',
                  enterValidZipCodeLabel: 'Please enter a valid USA ZIP code',
                  unitedStatesLabel: 'United States',
                  updateLocationLabel: 'Update Location'
                },
                locationPermissionModal: {
                  warning: {
                    locationLabel: 'Location',
                    locationAllowMessage:
                      'Allowing Sydney Community to access your location is the easiest way to enable us to connect you to services in your area.',
                    manualZipCodeEntryMessage:
                      'But if you prefer, you can enter your ZIP Code manually in the Local Services section.',
                    continueButton: 'Continue',
                    okButton: 'Okay',
                    closeButton: 'Close'
                  }
                },
                localResourceDetailRedesignScreen: {
                  warning: {
                    removeBookmarkLabel:
                      "Are you sure you'd like to remove this bookmark?",
                    yesButton: 'Yes, remove bookmark',
                    noButton: 'No, keep bookmark'
                  },
                  errors: {
                    installEmailClientLabel:
                      'Please install an email client to proceed.'
                  },
                  callLabel: 'Call resource',
                  emailLabel: 'Email resource',
                  websiteLabel: 'Website URL',
                  sundayLabel: 'Sunday',
                  mondayLabel: 'Monday',
                  tuesdayLabel: 'Tuesday',
                  wednesdayLabel: 'Wednesday',
                  thursdayLabel: 'Thursday',
                  fridayLabel: 'Friday',
                  saturdayLabel: 'Saturday',
                  closedLabel: 'Closed',
                  actionNotSupportedLabel:
                    'Action not supported by your device',
                  moreLocationsLabel: 'More Locations',
                  providedServicesLabel: 'Services this Program Provides',
                  programServesLabel: 'Populations this Program Serves',
                  eligibilityLabel: 'Eligibility',
                  followLabel:
                    'Follow the Next Steps to find out if this program has eligibility criteria.',
                  languageLabel: 'Language',
                  costLabel: 'Cost',
                  coverageAreaLabel: 'Coverage Area',
                  lastUpdatedLabel: 'Last Updated'
                },
                localSearch: {
                  clearTextLabel: 'Clear Text',
                  searchLabel: 'Search',
                  backLabel: 'back',
                  localLabel: 'local',
                  searchLocalLabel: 'Search for local resources',
                  tryAgainLabel: 'Try Again'
                },
                localScreen: {
                  errorFetchingResourceLabel: 'Error fetching resources',
                  recommendedLabel: 'Recommended',
                  costsServiceLabel:
                    '* Costs for services aren’t covered by your Anthem plan'
                },
                moreLocationsScreen: {
                  goBackLabel: 'Go Back',
                  moreLocationsLabel: 'More Locations'
                }
              },
              warnings: {},
              errors: {}
            },
            meTab: {
              content: {
                profileScreen: {
                  chooseLibraryButton: 'Choose from Library',
                  removeCurrentPhotoButton: 'Remove Current Photo',
                  enterNickNameLabel: 'Enter Nickname',
                  storiesLabel: 'stories',
                  articlesLabel: 'articles',
                  localLabel: 'local',
                  changeProfilePhotoButton: 'Change Profile Photo',
                  warnings: {},
                  errors: {
                    removingPhoto: "Error removing photo','Please retry."
                  }
                },
                editProfileScreen: {
                  title: 'Edit Profile',
                  areLabel: 'How old were you when this story began?*',
                  enterYourAgeLabel: 'Enter your age',
                  enterTheirAgeLabel: 'Enter their age',
                  enterTextHereLabel: 'Enter Text here',
                  remainingCharactersLabel: 'characters remaining',
                  warnings: {
                    enterAgeMessage: 'Please enter an age between 18 and 130.',
                    dateOfBirthMessage: 'Please enter a valid date of birth',
                    invalidZipCodeMessage: 'Invalid zip code'
                  }
                }
              },
              warnings: {},
              errors: {
                authorAge: 'Author age must be between 1 and 150',
                relationAge: 'Relation age must be between 1 and 150'
              }
            },
            staticScreens: {
              content: {
                discoverLabel:
                  'Discover and Share Stories Our communities are here to help you. Discover other people&apos;s stories, ask questions, get inspired and share your own story.',
                browseHelpfulInformationLabel:
                  'Browse Helpful Information Find information to help you keep informed on how take care of yourself and your loved ones.',
                searchLocalServicesLabel:
                  'Search and find Local Services Get recommendations for concerns such as food, housing, transportation and more.',
                nextLabel: 'Next',
                skipLabel: 'Skip'
              },
              warnings: {},
              errors: {}
            },
            communityScreens: {
              content: {
                joinCommunitiesHeader: {
                  title: 'Join a Community',
                  selectLabel: 'Please select a community to join.',
                  suggestLabel:
                    'We add communities regularly. Use the Suggest button to recommend one.',
                  ineligibleLabel:
                    'There are no more communities that you are eligible to join.'
                },
                joinCommunity: {
                  welcomeLabel: 'Welcome to the Community',
                  inspirationLabel:
                    "Fellow members hope you'92ll find inspiration in their stories and encourage you to share your story, too!",
                  goToCommunityLabel: 'Go to Community',
                  joinAnotherCommunityLabel: 'Join Another Community'
                },
                editCommunity: {
                  title: 'Edit Community',
                  storyPublishedLabel: 'Story Published!',
                  previewStoryLabel:
                    "Preview your story in your profile and publish when you'92re ready.",
                  publishedStoryLabel: 'Story Updated and Published!',
                  storyUpdatedLabel: 'Story Updated!',
                  editedStoryLabel:
                    "You've edited your story and we published your story",
                  previewStory:
                    "Preview your story in your profile and publish when you'92re ready",
                  publishedToCommunityLabel:
                    "We've published your story to the community.",
                  removedModeratorStoryLabel:
                    'Your story has been removed by the moderator. Read our Terms of Use to learn more',
                  readTOULabel: 'Read Terms of Use',
                  publishYourStory: 'Publish Your Story',
                  joinedCommunity: "You've joined the",
                  newJoinedCommunityLabel:
                    "community, but you haven't shared your story.",
                  tellYourStoryLabel: 'Tell Your Story',
                  shareJourneyLabel: 'Share your journey with the community'
                },
                bookmarks: {
                  addLabel: 'Add Bookmarks',
                  haveNotBookmarkedLabel:
                    "You haven'92t bookmarked any {story/localService/ helpful information} yet. To bookmark something of interest please use the bookmark icon.",
                  helpfulInfoLabel: 'helpful info',
                  localResourcesLabel: 'local resources',
                  storiesLabel: 'Stories',
                  articlesLabel: 'articles',
                  servicesLabel: 'Services'
                },
                editStoryScreen: {
                  relations: {
                    mySelfLabel: 'Myself',
                    husbandLabel: 'Husband',
                    wifeLabel: 'Wife',
                    motherLabel: 'Mother',
                    fatherLabel: 'Father',
                    grandMotherLabel: 'GrandMother',
                    grandFatherLabel: 'GrandFather',
                    sonLabel: 'Son',
                    daughterLabel: 'Daughter',
                    brotherLabel: 'Brother',
                    sisterLabel: 'Sister',
                    friendLabel: 'Friend'
                  },
                  createStoryScreen: {
                    storyPlaceholderText: 'Placeholder story text',
                    previewShareStoryLabel: 'Preview and Share Story',
                    enterTitleOfStory: 'Please enter title of your story',
                    storyBeganLabel:
                      'Please enter the age when this story began',
                    whoHasThisConditionLabel:
                      'Please enter who has this condition',
                    relationAgeLabel: 'relationAge',
                    diagnosedAgeLabel:
                      'Please enter the age when they were diagnosed',
                    closePreviewLabel: 'Close Preview'
                  },
                  storyScreen: {
                    meetLabel: 'Meet',
                    thisIsLabel: 'This is',
                    storyLabel: 'Story',
                    storyMenuLabel: 'STORY MENU',
                    reportStoryLabel: 'Report Story',
                    questionMenuLabel: 'QUESTION MENU',
                    editYourStory: 'Edit your Story',
                    hideYourStoryLabel: 'Hide your Story'
                  },
                  bottomButtons: {
                    primary: 'Save and Share',
                    secondary: 'Save as Draft',
                    titleOfStoryLabel: 'What is the title of your story?*',
                    sensitiveContentText:
                      "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
                    moreInformationButton: 'More Information'
                  }
                }
              },
              warnings: {
                leaveCommunity: {
                  title: 'Leave Community',
                  message:
                    'Are you sure you want to leave this community? By leaving this community, your stories will be unpublished. If you decide to rejoin later, you will need to republish them.'
                },
                storySharedAlready: {
                  title: 'Story Already Shared',
                  message:
                    'You have already shared your story in this community. Would you like to update your existing story?'
                },
                unpublishedStroy: {
                  noLongerTitle: 'This story is no longer shared',
                  unpublishedTitle: 'This story is no longer published',
                  message: 'The author has unpublished the story.'
                },
                removedStroy: {
                  title: 'Your story has been removed',
                  message:
                    'Your story has been removed by the moderator. Read our Terms of Use to learn more.'
                },
                publishStory: {
                  title: 'Before you publish',
                  message:
                    'By publishing this story, you are agreeing to make your name, photo, and content visible to the public. Are you sure you want to publish this story?'
                },
                storyUpdatedPublished: {
                  title: 'Story Updated and Published',
                  message: 'You’ve edited your story and we published it!'
                },
                storyUpdatedSaved: {
                  updatedTitle: 'Story Updated',
                  savedTitle: 'Story Saved',
                  message:
                    'Preview your story in your profile and share it when you’re ready.'
                },
                storyShared: {
                  title: 'Story Shared',
                  message:
                    'Thank you for sharing your story with the community.'
                },
                reportStory: {
                  title: 'Report Story',
                  message: 'Are you sure you want to report this story?',
                  actionText: 'Report',
                  cancelText: 'Cancel'
                },
                questionSubmitted: {
                  title: 'Question Submitted!',
                  message1: 'Check back later to see',
                  message2: 's response to your question.'
                },
                storyReported: {
                  title: 'Story Reported',
                  message:
                    'This story has been reported and will be reviewed by the moderators.'
                },
                reportFailed: {
                  title: 'Report failed',
                  message: 'Please try again later.'
                },
                storyNoLongerAvailable: 'This story is no longer available'
              },
              errors: {
                storyRemoved: 'This story has been removed',
                removeStory: 'Your story has been removed',
                publishingStory:
                  'There was an error while publishing the story',
                submittingStory: 'There was an error submitting the story'
              }
            },
            loginScreen: {
              content: {
                authIntroScreen: {
                  sydneyCommunityLabel: 'Sydney Community',
                  showMoreInfoLabel: 'Show More Info',
                  moreOptionsLabel: 'More Options',
                  connectingTextLabel:
                    "Connecting you to others who've been where you are and providing support for your health care needs.",
                  signInLabel: 'Sign In with Sydney Health',
                  forgotUserNameLabel: 'Forgot Username or Password?',
                  registrationLabel: "Don't have an account?",
                  menuScreen: {
                    menuLabel: 'Menu',
                    signingInTitle: 'Using Sydney Health Login',
                    signingInMessage:
                      'Signing in with your Sydney Health username and password helps us personalize your experience by auto-populating your name, date of birth',
                    contactUsLabel: 'Contact Us',
                    contactUsMessage:
                      'If you have a general question or an issue using Sydney Community App, please contact us at',
                    contactUsEmail: 'communitytechnicalsupport@anthem.com',
                    privacyPolicyLabel: 'Privacy Policy',
                    termsOfUseLabel: 'Terms of Use',
                    devLoginLabel: 'Dev Login',
                    version: 'Version',
                    emailUsLabel: 'Email Us'
                  }
                }
              },
              warnings: {},
              errors: {
                emptyUserNamePassword: 'Username or password not provided'
              }
            },
            welcomScreen: {
              content: {
                welcomeMessage: {
                  label1: 'Welcome',
                  label2: 'to Sydney',
                  label3: 'Communities'
                }
              },
              warnings: {},
              errors: {}
            },
            commonWarnings: {
              header: {
                savedLabel: 'saved',
                doneLabel: 'done',
                cautionLabel: 'caution',
                title: 'warning',
                welcomeLabel: 'welcome',
                infoLabel: 'info',
                editLabel: 'edit',
                connectionLabel: 'connection',
                notViewableLabel: 'notViewable',
                updateLabel: 'update'
              },
              internetConnection: {
                title: "Can't Connect",
                message:
                  'Please check your internet connection and then try again'
              },
              stayLoggedIn: {
                title: 'Do you want to stay logged in?',
                message:
                  'You’ve been inactive for a while. For your security, we’ll automatically log you out in 2 minutes.'
              },
              doNotMissLabel: {
                title: "Don't miss a thing",
                message:
                  'Receive notifications about new stories and activity on your stories and questions. To enable go to your settings.'
              },
              exitAppSetup: {
                title: 'Exit App Set Up',
                message:
                  "Are you sure you want to exit app setup? You will be redirected to the app's home page."
              },
              updateRequired: {
                title: 'Update Required',
                message:
                  'A new version is available. Please update the app to continue.'
              },
              restrictedAccount: {
                title: 'Restricted account',
                message:
                  "We have restricted your account due to violations of our Terms of Use. You will no longer be able to interact with other member's Stories, share your own Stories, or message other members. If you had a Story, it has been unpublished. Read our Terms of Use to learn more."
              },
              pushNotification: {
                title: 'Turn On Notifications',
                message:
                  "We'll let you know when new stories are posted, you've been asked a question, or question you asked has received an answer."
              },
              cantGetResults: {
                title: "Couldn't get results",
                message: "Sorry we can't retrieve any results right now."
              },
              logOut: {
                title: 'Log Out',
                message: 'Are you sure you want to log out?'
              },
              unKnownProblem: {
                title: 'Whoops!',
                message: 'An unknown problem occurred.',
                actionText: 'Back to Story Menu'
              },
              blockUser: {
                title: 'Block User',
                message:
                  'Blocking this user will prevent any of your story content from being accessible to them, and you will not see theirs. Any bookmarks you have from this user will be removed and inaccessible. Do you want to block this user?',
                actionText: 'Block'
              },
              invalidRequestFillPrompt: {
                title: 'Invalid Request',
                message: 'Please make sure to fill out at least one prompt'
              }
            },
            commonErrors: {
              error1: 'Something went wrong with the login. Please try again',
              unableToOpenURL: 'Unable to open URL',
              actionNotSupported: 'Action not supported by your device',
              invalidData: "Invalid Profile Data','Please check the data.",
              requestError: "Request Error','Please retry",
              invalidRequest: 'Invalid Request',
              authorNotFound: 'ERROR: Author id not found'
            }
          },
          id: '614d78b30b2a67ed15af34f5'
        }
      }
    };
    mockPublicSvc.getAppData.mockReturnValue(expRes);
    const data = await ctrl.getAppTranslations('en');
    expect(data).toBe(expRes);
  });

  it('Should Return Translation data for app without language', async () => {
    const expRes = {
      data: {
        isSuccess: true,
        isException: false,
        value: {
          language: 'en',
          data: {
            onboarding: {
              content: {
                bottomButtons: {
                  saveContinueLabel: 'Save and Continue',
                  skipStepButton: 'Skip This Step'
                },
                topButtons: {
                  exitButton: 'Yes, Exit',
                  continueSetupButton: 'No, Continue Set Up'
                },
                communityScreen: {
                  preferencesLabel: 'preferences',
                  label: 'Which communities are you interested in?',
                  selectLabel: 'SELECT ALL THAT APPLY',
                  expandedButton: 'expanded',
                  collapsedButton: 'collapsed'
                },
                settingsScreen: {
                  label: 'Settings',
                  saveContinueLabel: 'Save and Continue',
                  stayConnectedLabel:
                    'Stay connected to activity within the communities you join and improve search results by enabling these settings',
                  enablePushLabel: 'Enable push notifications',
                  programsNearLabel:
                    'Find free and reduced-cost aid and programs near you.',
                  tailorLocationLabel:
                    'We can tailor these to your location if you enable location services.',
                  recommendationsLabel: 'Get better recommendations',
                  enableLocationLabel: 'Enable location services',
                  orLabel: 'or',
                  enterZiPCode: 'Enter your ZIP Code',
                  validZipCode: 'Please enter a valid USA ZIP code'
                },
                touScreen: {
                  warning: {
                    touViolation: {
                      title: 'Terms of use violation',
                      message:
                        'We detected inappropriate language in your answer. We have replaced the language with asterisks and highlighted the field. You can continue with your asterisks in place or change the language.'
                    }
                  },
                  publicProfileLabel: 'Public Profile',
                  preferencesLabel: 'Preferences',
                  waysToHelpLabel: 'Ways We Can Help',
                  settingsLabel: 'Settings',
                  letsLabel: "let's",
                  personalizeLabel: 'personalize',
                  yourExperienceLabel: 'your experience',
                  setUpAccountLabel:
                    "In the next few screens, we'll help set up your account and start you on your way.",
                  participationLabel: 'Participation Guidelines',
                  touMessage: {
                    label1:
                      'Our goal is to create a welcoming space where members feel comfortable freely sharing knowledge and experience with others. That’s why we are asking everyone to review and adhere to our',
                    label2: 'Terms of Use',
                    label3: 'and',
                    label4: 'Privacy Policies',
                    label5: 'Privacy Policies',
                    label6: 'before continuing.',
                    label7:
                      'By accepting user agrees to abide by the Terms of Use and Privacy Policies.',
                    label8:
                      'I agree to abide by the Terms of Use and Privacy Policies.',
                    submitButton: 'Submit'
                  }
                },
                localServicesScreen: {
                  message:
                    "Everybody needs a little help now and then - that's what communities are for! Select any of these categories and the app will help connect you to free and low-cost services in your area.",
                  checkedLabel: 'Checked',
                  unCheckedLabel: 'Unchecked',
                  waysHelpLabel: 'ways we can help'
                },
                profileScreen: {
                  label: 'Profile, OnBoarding Screen',
                  nextLabel: 'Next',
                  skipLabel: 'Skip On Profile',
                  chooseLibraryLabel: 'Choose from Library',
                  removeCurrentPhotoLabel: 'Remove Current Photo',
                  photoErrorLabel: 'Photo Error',
                  pleaseRetryLabel: 'Please retry',
                  okLabel: 'OK',
                  displayNameUpdatedMessage:
                    'display name updated successfully',
                  photoUpdatedSuccessfullyMessage: 'Photo updated successfully',
                  photoDeletedSuccessfullyMessage: 'Photo removed successfully',
                  photoDeletedErrorMessage: 'photo delete failed',
                  uploadErrorMessage: 'Upload Error',
                  pleaseRetryMessage: 'Please retry.',
                  profilePhotoChangeMessage: 'Change Profile Photo',
                  enterOptionalNameMessage: 'Enter an optional nickname here',
                  otherMembersMessage: 'Other members will see you as',
                  errors: {
                    displayNameLabel:
                      'An error occurred updating the display name',
                    largePhotoLabel:
                      "Photo Error','Please select a smaller photo",
                    photoLabel: 'Photo Error,Please retry',
                    uploadPhotoLabel: 'Photo Upload Error,Please retry',
                    invalidResponseLabel: 'Invalid Response,Please retry.'
                  }
                },
                profileScreenHeader: {
                  publicLabel: 'public',
                  profileLabel: 'profile',
                  personalizePostMessage:
                    'Personalize your posts and help others engage with them by adding a profile picture and nickname here.'
                },
                uploadProfilePhoto: {
                  addPhotoLabel: 'Add profile photo',
                  editPhotoLabel: 'Edit profile photo'
                },
                communitiesSummaryScreen: {
                  label: 'Community',
                  readLabel: 'Read',
                  articleVideoLabel: 'Articles and Videos',
                  editLabel: 'Edit',
                  joinLabel: 'Join a Community'
                },
                localServicesSummaryScreen: {
                  thereAreLabel: 'There are ',
                  nearLabel: 'local services near you.',
                  programsNearLabel:
                    'Find free and reduced-cost aid and programs near you.',
                  findLabel: 'Find Local Services for',
                  needsLabel: 'needs',
                  label: 'Local Services',
                  exploreLabel: 'Explore All Local Services'
                },
                OnBoardingSummaryScreen: {
                  takeToHomePageLabel: 'Take Me to the Homepage',
                  setupSummaryLabel: 'setup summary',
                  readyToGoLabel:
                    'Your account is personalized and ready to go. What would you like to do next?',
                  adjustSettingsLabel:
                    'You can adjust these settings in the profile section of the app.',
                  partOfLabel: "You're now part of",
                  noPartCommunityLabel: "You aren't part of a community yet.",
                  selectOneToExploreLabel: 'Select one to explore first.',
                  readArticlesLabel: 'Read Articles and Videos',
                  deepDiveInterestedLabel: 'Do a deep dive into your interests'
                },
                shareStoryScreen: {
                  experienceLabel: 'Ready to talk about your experience with',
                  myStoryLabel: 'Share My Story'
                },
                termsScreen: {
                  acceptLabel:
                    "Our communities are welcoming and inclusive places where members feel comfortable freely sharing knowledge and experience with others. That'92s why we ask everyone to review and accept our",
                  label: 'Terms of Use',
                  andLabel: 'and',
                  privacyPolicyLabel: 'Privacy Policies',
                  beforeContinuingLabel: 'before continuing.',
                  agreeTermsOfUse:
                    'I agree to follow the Terms of Use and Privacy Policies.'
                }
              },
              warnings: {},
              errors: {}
            },
            local: {
              content: {
                filterLabel: {
                  moreFiltersLabel: 'See more filters',
                  removeLabel: 'Remove',
                  filterLabel: 'Filter'
                },
                header: {
                  enterZipCodeLabel: 'Enter your zipcode',
                  findLocalServicesLabel: 'Find Local Services',
                  discoverServiceZipCodeLabel:
                    'Enter your ZIP code to discover free or reduced cost services like medical care, food, job training, and more.',
                  searchLocalLabel:
                    'Search around you for local help & services',
                  searchLabel: 'Search',
                  enterValueToSearchLabel: 'Please enter the value to search',
                  quickSearchCategory: 'QUICK CATEGORY SEARCH'
                },
                searchResultItem: {
                  informationAbout: 'Information about '
                },
                filterBar: {
                  enterYourZipCodeLabel: 'Enter your zipcode',
                  showingLabel: 'Showing',
                  resultsNearLabel: 'results near',
                  filterButton: 'This is a filter button'
                },
                filterModalIndex: {
                  backLabel: 'Back',
                  programFilterLabel: 'Program Filters',
                  applyFilterLabel: 'Apply Filter(s)'
                },
                locationModal: {
                  permissionNotGrantedLabel: 'Location Permission not Granted',
                  userMyCurrentLocationLabel: 'Use My Current Location',
                  enterZipCodeLabel: 'Enter ZIP Code',
                  searchByZipCodeLabel: 'Search by zip code',
                  cancelLabel: 'Cancel',
                  enterValidZipCodeLabel: 'Please enter a valid USA ZIP code',
                  unitedStatesLabel: 'United States',
                  updateLocationLabel: 'Update Location'
                },
                locationPermissionModal: {
                  warning: {
                    locationLabel: 'Location',
                    locationAllowMessage:
                      'Allowing Sydney Community to access your location is the easiest way to enable us to connect you to services in your area.',
                    manualZipCodeEntryMessage:
                      'But if you prefer, you can enter your ZIP Code manually in the Local Services section.',
                    continueButton: 'Continue',
                    okButton: 'Okay',
                    closeButton: 'Close'
                  }
                },
                localResourceDetailRedesignScreen: {
                  warning: {
                    removeBookmarkLabel:
                      "Are you sure you'd like to remove this bookmark?",
                    yesButton: 'Yes, remove bookmark',
                    noButton: 'No, keep bookmark'
                  },
                  errors: {
                    installEmailClientLabel:
                      'Please install an email client to proceed.'
                  },
                  callLabel: 'Call resource',
                  emailLabel: 'Email resource',
                  websiteLabel: 'Website URL',
                  sundayLabel: 'Sunday',
                  mondayLabel: 'Monday',
                  tuesdayLabel: 'Tuesday',
                  wednesdayLabel: 'Wednesday',
                  thursdayLabel: 'Thursday',
                  fridayLabel: 'Friday',
                  saturdayLabel: 'Saturday',
                  closedLabel: 'Closed',
                  actionNotSupportedLabel:
                    'Action not supported by your device',
                  moreLocationsLabel: 'More Locations',
                  providedServicesLabel: 'Services this Program Provides',
                  programServesLabel: 'Populations this Program Serves',
                  eligibilityLabel: 'Eligibility',
                  followLabel:
                    'Follow the Next Steps to find out if this program has eligibility criteria.',
                  languageLabel: 'Language',
                  costLabel: 'Cost',
                  coverageAreaLabel: 'Coverage Area',
                  lastUpdatedLabel: 'Last Updated'
                },
                localSearch: {
                  clearTextLabel: 'Clear Text',
                  searchLabel: 'Search',
                  backLabel: 'back',
                  localLabel: 'local',
                  searchLocalLabel: 'Search for local resources',
                  tryAgainLabel: 'Try Again'
                },
                localScreen: {
                  errorFetchingResourceLabel: 'Error fetching resources',
                  recommendedLabel: 'Recommended',
                  costsServiceLabel:
                    '* Costs for services aren’t covered by your Anthem plan'
                },
                moreLocationsScreen: {
                  goBackLabel: 'Go Back',
                  moreLocationsLabel: 'More Locations'
                }
              },
              warnings: {},
              errors: {}
            },
            meTab: {
              content: {
                profileScreen: {
                  chooseLibraryButton: 'Choose from Library',
                  removeCurrentPhotoButton: 'Remove Current Photo',
                  enterNickNameLabel: 'Enter Nickname',
                  storiesLabel: 'stories',
                  articlesLabel: 'articles',
                  localLabel: 'local',
                  changeProfilePhotoButton: 'Change Profile Photo',
                  warnings: {},
                  errors: {
                    removingPhoto: "Error removing photo','Please retry."
                  }
                },
                editProfileScreen: {
                  title: 'Edit Profile',
                  areLabel: 'How old were you when this story began?*',
                  enterYourAgeLabel: 'Enter your age',
                  enterTheirAgeLabel: 'Enter their age',
                  enterTextHereLabel: 'Enter Text here',
                  remainingCharactersLabel: 'characters remaining',
                  warnings: {
                    enterAgeMessage: 'Please enter an age between 18 and 130.',
                    dateOfBirthMessage: 'Please enter a valid date of birth',
                    invalidZipCodeMessage: 'Invalid zip code'
                  }
                }
              },
              warnings: {},
              errors: {
                authorAge: 'Author age must be between 1 and 150',
                relationAge: 'Relation age must be between 1 and 150'
              }
            },
            staticScreens: {
              content: {
                discoverLabel:
                  'Discover and Share Stories Our communities are here to help you. Discover other people&apos;s stories, ask questions, get inspired and share your own story.',
                browseHelpfulInformationLabel:
                  'Browse Helpful Information Find information to help you keep informed on how take care of yourself and your loved ones.',
                searchLocalServicesLabel:
                  'Search and find Local Services Get recommendations for concerns such as food, housing, transportation and more.',
                nextLabel: 'Next',
                skipLabel: 'Skip'
              },
              warnings: {},
              errors: {}
            },
            communityScreens: {
              content: {
                joinCommunitiesHeader: {
                  title: 'Join a Community',
                  selectLabel: 'Please select a community to join.',
                  suggestLabel:
                    'We add communities regularly. Use the Suggest button to recommend one.',
                  ineligibleLabel:
                    'There are no more communities that you are eligible to join.'
                },
                joinCommunity: {
                  welcomeLabel: 'Welcome to the Community',
                  inspirationLabel:
                    "Fellow members hope you'92ll find inspiration in their stories and encourage you to share your story, too!",
                  goToCommunityLabel: 'Go to Community',
                  joinAnotherCommunityLabel: 'Join Another Community'
                },
                editCommunity: {
                  title: 'Edit Community',
                  storyPublishedLabel: 'Story Published!',
                  previewStoryLabel:
                    "Preview your story in your profile and publish when you'92re ready.",
                  publishedStoryLabel: 'Story Updated and Published!',
                  storyUpdatedLabel: 'Story Updated!',
                  editedStoryLabel:
                    "You've edited your story and we published your story",
                  previewStory:
                    "Preview your story in your profile and publish when you'92re ready",
                  publishedToCommunityLabel:
                    "We've published your story to the community.",
                  removedModeratorStoryLabel:
                    'Your story has been removed by the moderator. Read our Terms of Use to learn more',
                  readTOULabel: 'Read Terms of Use',
                  publishYourStory: 'Publish Your Story',
                  joinedCommunity: "You've joined the",
                  newJoinedCommunityLabel:
                    "community, but you haven't shared your story.",
                  tellYourStoryLabel: 'Tell Your Story',
                  shareJourneyLabel: 'Share your journey with the community'
                },
                bookmarks: {
                  addLabel: 'Add Bookmarks',
                  haveNotBookmarkedLabel:
                    "You haven'92t bookmarked any {story/localService/ helpful information} yet. To bookmark something of interest please use the bookmark icon.",
                  helpfulInfoLabel: 'helpful info',
                  localResourcesLabel: 'local resources',
                  storiesLabel: 'Stories',
                  articlesLabel: 'articles',
                  servicesLabel: 'Services'
                },
                editStoryScreen: {
                  relations: {
                    mySelfLabel: 'Myself',
                    husbandLabel: 'Husband',
                    wifeLabel: 'Wife',
                    motherLabel: 'Mother',
                    fatherLabel: 'Father',
                    grandMotherLabel: 'GrandMother',
                    grandFatherLabel: 'GrandFather',
                    sonLabel: 'Son',
                    daughterLabel: 'Daughter',
                    brotherLabel: 'Brother',
                    sisterLabel: 'Sister',
                    friendLabel: 'Friend'
                  },
                  createStoryScreen: {
                    storyPlaceholderText: 'Placeholder story text',
                    previewShareStoryLabel: 'Preview and Share Story',
                    enterTitleOfStory: 'Please enter title of your story',
                    storyBeganLabel:
                      'Please enter the age when this story began',
                    whoHasThisConditionLabel:
                      'Please enter who has this condition',
                    relationAgeLabel: 'relationAge',
                    diagnosedAgeLabel:
                      'Please enter the age when they were diagnosed',
                    closePreviewLabel: 'Close Preview'
                  },
                  storyScreen: {
                    meetLabel: 'Meet',
                    thisIsLabel: 'This is',
                    storyLabel: 'Story',
                    storyMenuLabel: 'STORY MENU',
                    reportStoryLabel: 'Report Story',
                    questionMenuLabel: 'QUESTION MENU',
                    editYourStory: 'Edit your Story',
                    hideYourStoryLabel: 'Hide your Story'
                  },
                  bottomButtons: {
                    primary: 'Save and Share',
                    secondary: 'Save as Draft',
                    titleOfStoryLabel: 'What is the title of your story?*',
                    sensitiveContentText:
                      "This might be difficult for some people to read, so once it has been published, they'll have to push a button to read your reply.",
                    moreInformationButton: 'More Information'
                  }
                }
              },
              warnings: {
                leaveCommunity: {
                  title: 'Leave Community',
                  message:
                    'Are you sure you want to leave this community? By leaving this community, your stories will be unpublished. If you decide to rejoin later, you will need to republish them.'
                },
                storySharedAlready: {
                  title: 'Story Already Shared',
                  message:
                    'You have already shared your story in this community. Would you like to update your existing story?'
                },
                unpublishedStroy: {
                  noLongerTitle: 'This story is no longer shared',
                  unpublishedTitle: 'This story is no longer published',
                  message: 'The author has unpublished the story.'
                },
                removedStroy: {
                  title: 'Your story has been removed',
                  message:
                    'Your story has been removed by the moderator. Read our Terms of Use to learn more.'
                },
                publishStory: {
                  title: 'Before you publish',
                  message:
                    'By publishing this story, you are agreeing to make your name, photo, and content visible to the public. Are you sure you want to publish this story?'
                },
                storyUpdatedPublished: {
                  title: 'Story Updated and Published',
                  message: 'You’ve edited your story and we published it!'
                },
                storyUpdatedSaved: {
                  updatedTitle: 'Story Updated',
                  savedTitle: 'Story Saved',
                  message:
                    'Preview your story in your profile and share it when you’re ready.'
                },
                storyShared: {
                  title: 'Story Shared',
                  message:
                    'Thank you for sharing your story with the community.'
                },
                reportStory: {
                  title: 'Report Story',
                  message: 'Are you sure you want to report this story?',
                  actionText: 'Report',
                  cancelText: 'Cancel'
                },
                questionSubmitted: {
                  title: 'Question Submitted!',
                  message1: 'Check back later to see',
                  message2: 's response to your question.'
                },
                storyReported: {
                  title: 'Story Reported',
                  message:
                    'This story has been reported and will be reviewed by the moderators.'
                },
                reportFailed: {
                  title: 'Report failed',
                  message: 'Please try again later.'
                },
                storyNoLongerAvailable: 'This story is no longer available'
              },
              errors: {
                storyRemoved: 'This story has been removed',
                removeStory: 'Your story has been removed',
                publishingStory:
                  'There was an error while publishing the story',
                submittingStory: 'There was an error submitting the story'
              }
            },
            loginScreen: {
              content: {
                authIntroScreen: {
                  sydneyCommunityLabel: 'Sydney Community',
                  showMoreInfoLabel: 'Show More Info',
                  moreOptionsLabel: 'More Options',
                  connectingTextLabel:
                    "Connecting you to others who've been where you are and providing support for your health care needs.",
                  signInLabel: 'Sign In with Sydney Health',
                  forgotUserNameLabel: 'Forgot Username or Password?',
                  registrationLabel: "Don't have an account?",
                  menuScreen: {
                    menuLabel: 'Menu',
                    signingInTitle: 'Using Sydney Health Login',
                    signingInMessage:
                      'Signing in with your Sydney Health username and password helps us personalize your experience by auto-populating your name, date of birth',
                    contactUsLabel: 'Contact Us',
                    contactUsMessage:
                      'If you have a general question or an issue using Sydney Community App, please contact us at',
                    contactUsEmail: 'communitytechnicalsupport@anthem.com',
                    privacyPolicyLabel: 'Privacy Policy',
                    termsOfUseLabel: 'Terms of Use',
                    devLoginLabel: 'Dev Login',
                    version: 'Version',
                    emailUsLabel: 'Email Us'
                  }
                }
              },
              warnings: {},
              errors: {
                emptyUserNamePassword: 'Username or password not provided'
              }
            },
            welcomScreen: {
              content: {
                welcomeMessage: {
                  label1: 'Welcome',
                  label2: 'to Sydney',
                  label3: 'Communities'
                }
              },
              warnings: {},
              errors: {}
            },
            commonWarnings: {
              header: {
                savedLabel: 'saved',
                doneLabel: 'done',
                cautionLabel: 'caution',
                title: 'warning',
                welcomeLabel: 'welcome',
                infoLabel: 'info',
                editLabel: 'edit',
                connectionLabel: 'connection',
                notViewableLabel: 'notViewable',
                updateLabel: 'update'
              },
              internetConnection: {
                title: "Can't Connect",
                message:
                  'Please check your internet connection and then try again'
              },
              stayLoggedIn: {
                title: 'Do you want to stay logged in?',
                message:
                  'You’ve been inactive for a while. For your security, we’ll automatically log you out in 2 minutes.'
              },
              doNotMissLabel: {
                title: "Don't miss a thing",
                message:
                  'Receive notifications about new stories and activity on your stories and questions. To enable go to your settings.'
              },
              exitAppSetup: {
                title: 'Exit App Set Up',
                message:
                  "Are you sure you want to exit app setup? You will be redirected to the app's home page."
              },
              updateRequired: {
                title: 'Update Required',
                message:
                  'A new version is available. Please update the app to continue.'
              },
              restrictedAccount: {
                title: 'Restricted account',
                message:
                  "We have restricted your account due to violations of our Terms of Use. You will no longer be able to interact with other member's Stories, share your own Stories, or message other members. If you had a Story, it has been unpublished. Read our Terms of Use to learn more."
              },
              pushNotification: {
                title: 'Turn On Notifications',
                message:
                  "We'll let you know when new stories are posted, you've been asked a question, or question you asked has received an answer."
              },
              cantGetResults: {
                title: "Couldn't get results",
                message: "Sorry we can't retrieve any results right now."
              },
              logOut: {
                title: 'Log Out',
                message: 'Are you sure you want to log out?'
              },
              unKnownProblem: {
                title: 'Whoops!',
                message: 'An unknown problem occurred.',
                actionText: 'Back to Story Menu'
              },
              blockUser: {
                title: 'Block User',
                message:
                  'Blocking this user will prevent any of your story content from being accessible to them, and you will not see theirs. Any bookmarks you have from this user will be removed and inaccessible. Do you want to block this user?',
                actionText: 'Block'
              },
              invalidRequestFillPrompt: {
                title: 'Invalid Request',
                message: 'Please make sure to fill out at least one prompt'
              }
            },
            commonErrors: {
              error1: 'Something went wrong with the login. Please try again',
              unableToOpenURL: 'Unable to open URL',
              actionNotSupported: 'Action not supported by your device',
              invalidData: "Invalid Profile Data','Please check the data.",
              requestError: "Request Error','Please retry",
              invalidRequest: 'Invalid Request',
              authorNotFound: 'ERROR: Author id not found'
            }
          },
          id: '614d78b30b2a67ed15af34f5'
        }
      }
    };
    mockPublicSvc.getAppData.mockReturnValue(expRes);
    const data = await ctrl.getAppTranslations(undefined);
    expect(data).toBe(expRes);
  });

  it('getParnerImage - error - not hex', async () => {
    mockValidation.isHex.mockReturnValue(false);
    await ctrl.getPartnerImage('partnerId', true);
    expect(mockResult.createError.mock.calls.length).toBe(1);
  });

  it('getParnerImage - success', async () => {
    const input = 'partnerId';
    mockValidation.isHex.mockReturnValue(true);
    await ctrl.getPartnerImage(input, true);
    expect(mockPartnerSvc.getParterLogo.mock.calls.length).toBe(1);
    expect(mockPartnerSvc.getParterLogo).toBeCalledWith(input, true);
  });
});
