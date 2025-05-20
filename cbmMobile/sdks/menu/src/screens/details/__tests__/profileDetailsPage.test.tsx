import { useRoute } from '@react-navigation/native';
import { render } from '@testing-library/react-native';

import { getClientDetails } from '../../../../../../src/util/commonUtils';
import { MenuMockContextWrapper } from '../../../__mocks__/menuMockContextWrapper';
import { ProfileDetailsPage } from '../profileDetailsPage';
jest.mock('../../../../../../src/util/commonUtils');

jest.mock('@react-navigation/native', () => {
  const navigation = jest.requireActual<typeof import('@react-navigation/native')>('@react-navigation/native');
  return {
    ...navigation,
  };
});

describe('ProfileDetailsPage', () => {
  const mockRouteParams = {
    listData: [{ id: '1', name: 'Test Item' }],
    title: 'Test Title',
  };

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({ params: mockRouteParams });
    (getClientDetails as jest.Mock).mockResolvedValue({ supportNumber: '888-888-8888' });
  });

  it('renders edit phone button when title is contact info', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { ...mockRouteParams, title: 'profile.contactInfo' },
    });

    const { getByTestId } = render(
      <MenuMockContextWrapper>
        <ProfileDetailsPage />
      </MenuMockContextWrapper>
    );
    expect(getByTestId('menu.profiledetails.button')).toBeTruthy();
  });

  it('does not render edit phone button when title is not contact info', () => {
    const { queryByTestId } = render(
      <MenuMockContextWrapper>
        <ProfileDetailsPage />
      </MenuMockContextWrapper>
    );
    expect(queryByTestId('menu.profiledetails.button')).toBeNull();
  });
});
