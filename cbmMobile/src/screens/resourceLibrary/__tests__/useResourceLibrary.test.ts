import { renderHook } from '@testing-library/react-hooks';
import { Linking } from 'react-native';

import { getMockAppContext } from '../../../__mocks__/appContext';
import { useAppContext } from '../../../context/appContext';
import { useResourceLibrary } from '../useResourceLibrary';

jest.mock('../../../context/appContext');
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

const data = {
  data: [
    {
      type: 'ResourceModel',
      path: '/content/dam/careloneap/content-fragments/self-help-resources/bcbsnc/work-life-resource-library/pet-care/pet-care',
      title: 'Pet services',
      description: 'Pet services',
      data: [
        {
          type: 'GuidesModel',
          path: '/content/dam/careloneap/content-fragments/articles/bcbsnc/articles/pet-care-cards/pet-site-locator',
          title: 'Find a pet',
          description:
            "When you're ready for a friend with fur, feathers, or fins, this resource will help you locate shelters and rescue groups, browse lost and found pet boards, and more.",
          isDynamicWPORedirectUrl: true,
          redirectUrl: 'L2NvbnRlbnRfb25seS8zNjY5NA==',
          openURLInNewTab: true,
          tags: ['Website'],
          data: [],
        },
        {
          type: 'GuidesModel',
          path: '/content/dam/careloneap/content-fragments/articles/bcbsnc/articles/pet-care-cards/pet-locator',
          title: 'Pet sitters',
          description:
            'Not just for cats and dogs, this search covers sitters who can care for everyone from birds and reptiles to amphibians and farm animals.',
          isDynamicWPORedirectUrl: false,
          redirectUrl:
            'https://helpwhereyouare.com/direct/index.php?company_username=BCB&company_password=employee&id_eap=1614&id_language=003001&company_loginpage=no&redirect=L2NvbnRlbnRfb25seS8yOTE4OQ==',
          openURLInNewTab: true,
          tags: ['Website'],
          data: [],
        },
        {
          type: 'GuidesModel',
          path: '/content/dam/careloneap/content-fragments/articles/bcbsnc/articles/pet-care-cards/pet-site-locator',
          title: 'Find a pet',
          description:
            "When you're ready for a friend with fur, feathers, or fins, this resource will help you locate shelters and rescue groups, browse lost and found pet boards, and more.",
          isDynamicWPORedirectUrl: false,
          redirectUrl: 'crediblemind:topics/financial-wellness?query=',
          openURLInNewTab: true,
          tags: ['Website'],
          data: [],
        },
      ],
    },
  ],

  title: 'Work-life resources finder',
  wpoRedirectUrl:
    'https://helpwhereyouare.com/direct/index.php?company_username={wpoClientName}&company_password=employee&id_eap=1614&id_language=003001&company_loginpage=no&redirect={redirectUrl}',
  description: "Get the support you're looking for to make life a little easier.",
};

describe('useResourceLibrary', () => {
  const navigationHandler = {
    linkTo: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppContext.mockReturnValue({
      ...getMockAppContext(),
      navigationHandler: {
        ...getMockAppContext().navigationHandler,
        linkTo: navigationHandler.linkTo,
      },

      wpoClientName: 'testClient',
    });
  });

  it('should return empty data when resourceLibraryData is undefined', () => {
    const { result } = renderHook(() => useResourceLibrary({ resourceLibraryData: undefined }));

    expect(result.current.data).toEqual([]);
  });

  it('should return parsed data when resourceLibraryData is provided', () => {
    const { result } = renderHook(() => useResourceLibrary({ resourceLibraryData: data }));

    expect(result.current.data).toEqual(data.data);
  });

  it('should handle dynamic WPO redirect URL', () => {
    const { result } = renderHook(() => useResourceLibrary({ resourceLibraryData: data }));

    result.current.onPressCard(data.data[0].data[0], data.wpoRedirectUrl);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://helpwhereyouare.com/direct/index.php?company_username=testClient&company_password=employee&id_eap=1614&id_language=003001&company_loginpage=no&redirect=L2NvbnRlbnRfb25seS8zNjY5NA=='
    );
  });

  it('should handle with isDynamicWPORedirectUrl as false', () => {
    const { result } = renderHook(() => useResourceLibrary({ resourceLibraryData: data }));

    result.current.onPressCard(data.data[0].data[1], data.wpoRedirectUrl);

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://helpwhereyouare.com/direct/index.php?company_username=BCB&company_password=employee&id_eap=1614&id_language=003001&company_loginpage=no&redirect=L2NvbnRlbnRfb25seS8yOTE4OQ=='
    );
  });

  it('should handle with crediblemind', () => {
    const { result } = renderHook(() => useResourceLibrary({ resourceLibraryData: data }));

    result.current.onPressCard(data.data[0].data[2], data.wpoRedirectUrl);

    expect(navigationHandler.linkTo).toHaveBeenCalled();
  });
});
