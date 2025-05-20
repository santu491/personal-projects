import { useClientContext } from '../../../context/client.sdkContext';
import { Screen } from '../../../navigation/client.navigationTypes';
import { useLanding } from '../useLanding';

jest.mock('../../../context/client.sdkContext');

const mockUseClientContext = useClientContext as jest.Mock;

describe('useLanding', () => {
  beforeEach(() => {
    const mockContextValue = {
      navigation: {
        navigate: jest.fn(),
      },
    };
    (useClientContext as jest.Mock).mockReturnValue(mockContextValue);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should navigate to EAP_BENEFITS screen when navigateEapBenefits is called', () => {
    const { navigateEapBenefits } = useLanding();

    navigateEapBenefits();

    expect(mockUseClientContext().navigation.navigate).toHaveBeenCalledWith(Screen.EAP_BENEFITS);
  });
});
