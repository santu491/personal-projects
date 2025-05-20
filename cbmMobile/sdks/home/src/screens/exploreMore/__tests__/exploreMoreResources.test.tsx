import { render } from '@testing-library/react-native';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { mockExploreMoreCoursesAndResourcesContent } from '../../../__mocks__/homeContent';
import { HomeMockContextWrapper } from '../../../__mocks__/homeMockContextWrapper';
import { useHomeContext } from '../../../context/home.sdkContext';
import { useHomeView } from '../../home/useHome';
import { ExploreMoreResources } from '../exploreMoreResources';

// Mock the hooks
jest.mock('../../home/useHome');
jest.mock('../../../context/home.sdkContext');
jest.mock('../../../../../../src/util/commonUtils');

describe('ExploreMoreResources', () => {
  const mockNavigateToDetails = jest.fn();
  beforeEach(() => {
    (useHomeView as jest.Mock).mockReturnValue({ navigateToDetails: mockNavigateToDetails });
    (useHomeContext as jest.Mock).mockReturnValue({
      exploreMoreCoursesAndResourcesContent: mockExploreMoreCoursesAndResourcesContent,
    });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the SectionList component', () => {
    const { getByTestId } = render(
      <HomeMockContextWrapper>
        <ExploreMoreResources />
      </HomeMockContextWrapper>
    );
    expect(getByTestId('home.explore.title')).toBeTruthy();
    expect(getByTestId('home.explore.subTitle')).toBeTruthy();
  });

  it('renders the correct number of sections and items', () => {
    const { getAllByTestId } = render(
      <HomeMockContextWrapper>
        <ExploreMoreResources />
      </HomeMockContextWrapper>
    );
    const sections = getAllByTestId('home.explore.title');
    expect(sections.length).toBe(mockExploreMoreCoursesAndResourcesContent.length);
  });
});
