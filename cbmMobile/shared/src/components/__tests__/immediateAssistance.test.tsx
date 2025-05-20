import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { getMockAppContext } from '../../../../src/__mocks__/appContext';
import { EMERGENCY_SERVICE_NUMBER, MENTAL_HEALTH_CRISIS_NUMBER } from '../../../../src/constants/constants';
import { useAppContext } from '../../../../src/context/appContext';
import { ImmediateAssistance } from '../immediateAssistance/immediateAssistance';

jest.mock('../../../../src/context/appContext');
jest.mock('../../utils/utils');
jest.mock('../../../../src/util/commonUtils', () => ({
  getClientDetails: jest.fn().mockResolvedValue({ supportNumber: '1234567890' }),
}));

describe('ImmediateAssistance Screen', () => {
  const mockContext = {
    ...getMockAppContext(),
    immediateAssistanceContact: [
      {
        value: EMERGENCY_SERVICE_NUMBER,
        key: 'credibleMind.immediateAssistance.emergency',
      },
      {
        value: MENTAL_HEALTH_CRISIS_NUMBER,
        key: 'credibleMind.immediateAssistance.suicideOrCrisis',
      },
      {
        value: '888-8888-888',
        key: 'EAP support',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppContext as jest.Mock).mockReturnValue(mockContext);
  });

  it('should render the correct number of contact items', () => {
    const { getAllByTestId } = render(
      <ImmediateAssistance
        contactsInfo={mockContext.immediateAssistanceContact}
        onPressContact={jest.fn()}
        title="Immediate Assistance"
      />
    );
    const contactItems = getAllByTestId(/menu.call./);
    expect(contactItems).toHaveLength(mockContext.immediateAssistanceContact.length);
  });

  it('should call onPressContact with the correct contact info', () => {
    const onPressContactMock = jest.fn();
    const { getByTestId } = render(
      <ImmediateAssistance
        contactsInfo={mockContext.immediateAssistanceContact}
        onPressContact={onPressContactMock}
        title="Immediate Assistance"
      />
    );
    const button = getByTestId('menu.call.credibleMind.immediateAssistance.emergency');
    fireEvent.press(button);
    expect(onPressContactMock).toHaveBeenCalledWith(mockContext.immediateAssistanceContact[0]);
  });

  it('should display the correct title', () => {
    const { getByTestId } = render(
      <ImmediateAssistance
        contactsInfo={mockContext.immediateAssistanceContact}
        onPressContact={jest.fn()}
        title="Immediate Assistance"
      />
    );
    const title = getByTestId('title-immediate-assistance');
    expect(title.props.children).toBe('Immediate Assistance');
  });
});
