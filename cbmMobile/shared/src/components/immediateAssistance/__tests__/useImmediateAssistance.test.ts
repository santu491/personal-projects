import { act, renderHook } from '@testing-library/react-hooks';

import { getClientDetails } from '../../../../../src/util/commonUtils';
import { AssistanceType, ContactInfo } from '../../../models/src/features/immediateAssistance';
import { ContactType } from '../../../utils/utils';
import { useImmediateAssistance } from '../useImmediateAssistance';

jest.mock('../../../../../src/util/commonUtils');

jest.mock('../../../../../src/context/appContext', () => ({
  useAppContext: () => ({
    navigationHandler: {
      linkTo: jest.fn(),
    },
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../../utils/utils', () => ({
  callNumber: jest.fn(),
  sendSMS: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ContactType: {
    CALL: 'CALL',
    CHAT: 'CHAT',
    TEXT: 'TEXT',
  },
}));

describe('useImmediateAssistance', () => {
  beforeEach(() => {
    (getClientDetails as jest.Mock).mockResolvedValue({ userName: 'testUser', supportNumber: '888-888-8888' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useImmediateAssistance());

    expect(result.current.showBottomSheet).toBe(false);

    expect(result.current.assistanceType).toBeUndefined();
    expect(result.current.immediateAssistanceContact).toHaveLength(2);
  });

  it('should handle onPressCrisisSupport', () => {
    const { result } = renderHook(() => useImmediateAssistance());

    act(() => {
      result.current.onPressCrisisSupport();
    });

    expect(result.current.assistanceType).toBe(AssistanceType.CRISIS_SUPPORT);
    expect(result.current.showBottomSheet).toBe(true);
  });

  it('should handle onPressMemberSupport', () => {
    const { result } = renderHook(() => useImmediateAssistance());

    act(() => {
      result.current.onPressMemberSupport();
    });

    expect(result.current.assistanceType).toBe(AssistanceType.MEMBER_SUPPORT);
    expect(result.current.showBottomSheet).toBe(true);
  });

  it('should handle onPressContact for TEXT', () => {
    const { result } = renderHook(() => useImmediateAssistance());
    const contact: ContactInfo = { value: '1234567890', type: ContactType.TEXT, key: 'text' };

    act(() => {
      result.current.onPressContact(contact);
    });

    expect(result.current.showBottomSheet).toBe(false);
  });

  it('should handle onPressContact for CHAT', () => {
    const { result } = renderHook(() => useImmediateAssistance());
    const contact: ContactInfo = { value: '1234567890', type: ContactType.CHAT, key: 'chat' };

    act(() => {
      result.current.onPressContact(contact);
    });

    expect(result.current.showBottomSheet).toBe(false);
  });

  it('should handle onPressContact for CALL', () => {
    const { result } = renderHook(() => useImmediateAssistance());
    const contact: ContactInfo = { value: '1234567890', type: ContactType.CALL, key: 'call' };

    act(() => {
      result.current.onPressContact(contact);
    });
    expect(result.current.showBottomSheet).toBe(false);
  });
});
