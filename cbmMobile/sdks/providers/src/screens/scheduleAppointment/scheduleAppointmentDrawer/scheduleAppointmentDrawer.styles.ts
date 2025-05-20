import { StyleSheet } from 'react-native';

import { appColors } from '../../../../../../shared/src/context/appColors';
import { drawerStyles } from '../../../../../../shared/src/overrideStyles/drawer.styles';

export const appointmentDrawerStyles = () => {
  return {
    ...drawerStyles,
    ...StyleSheet.create({
      container: {
        paddingHorizontal: 20,
      },
      contentView: {
        paddingHorizontal: 14,
      },
      titleView: {
        borderBottomWidth: 1,
        borderBottomColor: appColors.paleGray,
      },
      title: {
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'center',
        paddingBottom: 21,
        paddingTop: 5,
      },
      descriptionView: {
        paddingVertical: 34,
        paddingHorizontal: 30,
      },
      descriptionContent: {
        lineHeight: 24,
        textAlign: 'center',
      },
      description: {
        lineHeight: 24,
        textAlign: 'center',
        paddingVertical: 34,
        paddingHorizontal: 30,
      },
      experienceView: {
        paddingTop: 13,
        paddingBottom: 20,
      },
      helpModalDescription: {
        paddingHorizontal: 4,
      },
      experienceDescription: {
        lineHeight: 30,
        paddingBottom: 12,
      },
      subDescriptionView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 8,
      },
      subDescription: {
        paddingLeft: 8,
        lineHeight: 24,
      },
      circle: {
        width: 5,
        height: 5,
        borderRadius: 10,
        backgroundColor: appColors.darkGray,
      },
      topButton: {
        backgroundColor: appColors.white,
        borderColor: appColors.lightPurple,
        borderWidth: 1,
        marginBottom: 10,
      },
      topButtonTextStyle: {
        color: appColors.lightPurple,
      },
      textLink: {
        color: appColors.lightPurple,
        textDecorationLine: 'underline',
        textDecorationColor: appColors.lightPurple,
        fontWeight: '600',
      },
    }),
  };
};
