import React from 'react';
import { View } from 'react-native';

import { ImmediateAssistanceComponent } from '../immediateAssistance/immediateAssistanceComponent';
import { NavBar, NavProps } from '../navBar';
import { styles } from './mainHeader.styles';

interface MainHeaderComponentProps {
  hideLogin?: boolean;
  isImmediateAssistanceVisible?: boolean;
}
type Props = NavProps & MainHeaderComponentProps;

export const MainHeaderComponent = ({
  isImmediateAssistanceVisible = true,
  leftArrow = true,
  hideLogin = false,
  clientLogoStyle,
  titleView,
  onPressLeftArrow,
}: Props) => {
  return (
    <View style={styles.headerMainView}>
      <NavBar
        leftArrow={leftArrow}
        hideLogin={hideLogin}
        onPressLeftArrow={onPressLeftArrow}
        clientLogoStyle={clientLogoStyle}
        titleView={titleView}
      />
      {isImmediateAssistanceVisible ? <ImmediateAssistanceComponent /> : null}
    </View>
  );
};
