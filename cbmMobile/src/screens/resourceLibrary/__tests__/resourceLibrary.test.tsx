import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { AppContextWapper } from '../../../context/appContextWrapper';
import { getClientDetails } from '../../../util/commonUtils';
import { ResourceLibrary } from '../resourceLibrary';
import { useResourceLibrary } from '../useResourceLibrary';

jest.mock('../useResourceLibrary');
jest.mock('../../../util/commonUtils');

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
          isDynamicWPORedirectUrl: true,
          redirectUrl:
            'https://helpwhereyouare.com/direct/index.php?company_username=BCB&company_password=employee&id_eap=1614&id_language=003001&company_loginpage=no&redirect=L2NvbnRlbnRfb25seS8yOTE4OQ==',
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

const mockUseResourceLibrary = useResourceLibrary as jest.Mock;

describe('ResourceLibrary', () => {
  beforeEach(() => {
    mockUseResourceLibrary.mockReturnValue({
      onPressCard: jest.fn(),
      data: data.data,
      title: 'Resource Library Title',
      description: 'Resource Library Description',
      wpoRedirectUrl: 'http://example.com',
    });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders section headers correctly', () => {
    const { getByText } = render(
      <AppContextWapper>
        <ResourceLibrary resourceLibraryData={data} />
      </AppContextWapper>
    );
    expect(getByText('Work-life resources finder')).toBeTruthy();
  });

  it('renders items correctly', () => {
    const { getByText } = render(
      <AppContextWapper>
        <ResourceLibrary resourceLibraryData={data} />
      </AppContextWapper>
    );

    expect(getByText(data.data[0].data[1].title)).toBeTruthy();
    expect(getByText(data.data[0].data[1].description)).toBeTruthy();
  });

  it('calls onPressCard when an item is pressed', () => {
    const { getByTestId } = render(
      <AppContextWapper>
        <ResourceLibrary resourceLibraryData={data} />
      </AppContextWapper>
    );
    const item = getByTestId('resourceLibraryCard.Pet sitters');
    fireEvent.press(item);
    expect(mockUseResourceLibrary().onPressCard).toHaveBeenCalled();
  });
});
