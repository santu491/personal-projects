import { StyleSheet } from 'react-native';

import { checkboxStyles } from '../../../../../shared/src/overrideStyles/checkbox.styles';
import { appColors } from '../../../../../src/config';

export const topicStyles = () => {
  return {
    ...checkboxStyles,
    ...StyleSheet.create({
      mainContainer: {
        backgroundColor: appColors.white,
        flex: 1,
      },
      screenContainer: {
        paddingBottom: 90,
        height: '88%',
        marginTop: 10,
      },
      footerButtons: {
        paddingHorizontal: 20,
      },
      list: {
        flex: 1,
      },
      item: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        justifyContent: 'center',
      },
      rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 5,
      },
      title: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        color: appColors.darkGray,
        textAlign: 'left',
        marginLeft: 10,
      },
      headerText: {
        fontSize: 20,
        fontWeight: '500',
        color: appColors.purple,
        lineHeight: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      downArrowView: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: appColors.paleGray,
      },
      headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingRight: 21,
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: appColors.paleGray,
      },
      headerTitleView: {
        paddingLeft: 20,
        width: '90%',
      },
      headerTitle: {
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'center',
      },
      modal: {
        justifyContent: 'flex-end',
        flex: 1,
        backgroundColor: appColors.blackOpacity90,
      },
      container: {
        backgroundColor: appColors.white,
        flex: 1,
        marginLeft: 20,
      },
      safeAreaView: {
        flex: 1,
      },
    }),
  };
};
