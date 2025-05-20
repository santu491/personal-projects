import { appStyles } from '../appStyles';

describe('appStyles', () => {
  it('should have a backgroundImage style', () => {
    expect(appStyles.backgroundImage).toEqual({
      flex: 1,
      resizeMode: 'cover',
      backgroundColor: expect.any(String),
      flexDirection: 'row',
    });
  });

  it('should have a viewContainer style', () => {
    expect(appStyles.viewContainer).toEqual({
      flex: 1,
    });
  });

  it('should have a screenContainer style', () => {
    expect(appStyles.screenContainer).toEqual({
      paddingLeft: 15,
      paddingTop: 15,
      paddingRight: 15,
      height: expect.any(String),
    });
  });

  it('should have a splashParentContainer style', () => {
    expect(appStyles.splashParentContainer).toEqual({
      paddingHorizontal: 24,
      width: expect.any(Number),
      height: expect.any(Number),
    });
  });

  it('should have a splashContainer style', () => {
    expect(appStyles.splashContainer).toEqual({
      height: expect.any(String),
    });
  });

  it('should have a logoContainer style', () => {
    expect(appStyles.logoContainer).toEqual({
      flexDirection: 'row',
      height: '30%',
      width: '100%',
      justifyContent: 'center',
    });
  });

  it('should have a splashTextContainer style', () => {
    expect(appStyles.splashTextContainer).toEqual({
      flexDirection: 'row',
      height: '35%',
      width: '100%',
      justifyContent: 'center',
    });
  });

  it('should have a splashActionContainer style', () => {
    expect(appStyles.splashActionContainer).toEqual({
      flexDirection: 'column',
      height: '20%',
      width: '100%',
      justifyContent: 'center',
    });
  });

  it('should have a titleView style', () => {
    expect(appStyles.titleView).toEqual({
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
    });
  });

  it('should have a subtitleView style', () => {
    expect(appStyles.subtitleView).toEqual({
      flexDirection: 'row',
      marginVertical: 6,
      width: '100%',
      justifyContent: 'flex-start',
    });
  });

  it('should have an emailTextInputRow style', () => {
    expect(appStyles.emailTextInputRow).toEqual({
      flexDirection: 'column',
      height: 86,
      width: '100%',
      justifyContent: 'flex-start',
    });
  });

  it('should have a registerSuccessVew style', () => {
    expect(appStyles.registerSuccessVew).toEqual({
      height: '50%',
    });
  });

  it('should have a loginInputContainer style', () => {
    expect(appStyles.loginInputContainer).toEqual({
      height: '60%',
      paddingTop: 16,
    });
  });

  it('should have an accountRecoveryView style', () => {
    expect(appStyles.accountRecoveryView).toEqual({
      height: '55%',
      paddingTop: 25,
    });
  });

  it('should have a resetSecretView style', () => {
    expect(appStyles.resetSecretView).toEqual({
      height: '55%',
      paddingTop: 25,
    });
  });

  it('should have an inputputContainer style', () => {
    expect(appStyles.inputputContainer).toEqual({
      height: '50%',
      marginTop: 25,
    });
  });

  it('should have a completeRegisterInputView style', () => {
    expect(appStyles.completeRegisterInputView).toEqual({
      flex: 1,
    });
  });

  it('should have a textInputContainer style', () => {
    expect(appStyles.textInputContainer).toEqual({
      flexDirection: 'row',
      width: '95%',
      justifyContent: 'flex-start',
      height: 40,
    });
  });

  it('should have a highlight style', () => {
    expect(appStyles.highlight).toEqual({
      fontWeight: '700',
    });
  });

  it('should have an imageStyle style', () => {
    expect(appStyles.imageStyle).toEqual({
      height: expect.any(Number),
      width: '100%',
    });
  });

  it('should have a webviewContainer style', () => {
    expect(appStyles.webviewContainer).toEqual({
      position: 'relative',
    });
  });

  it('should have a headerSecure style', () => {
    expect(appStyles.headerSecure).toEqual({
      backgroundColor: expect.any(String),
      paddingTop: 0,
      marginTop: 0,
    });
  });

  it('should have a headerBottom style', () => {
    expect(appStyles.headerBottom).toEqual({
      borderBottomWidth: 1,
      borderBottomColor: expect.any(String),
    });
  });

  it('should have a headerBottomImmediate style', () => {
    expect(appStyles.headerBottomImmediate).toEqual({
      borderBottomWidth: 1,
      borderBottomColor: expect.any(String),
      marginTop: 15,
    });
  });

  it('should have a headerPublic style', () => {
    expect(appStyles.headerPublic).toEqual({
      backgroundColor: expect.any(String),
      height: expect.any(Number),
    });
  });

  it('should have a privacyHeaderPublic style', () => {
    expect(appStyles.privacyHeaderPublic).toEqual({
      backgroundColor: expect.any(String),
      height: 50,
      borderBottomWidth: 1,
      borderBottomColor: expect.any(String),
    });
  });

  it('should have a headerlogo style', () => {
    expect(appStyles.headerlogo).toEqual({
      width: expect.any(Number),
      height: expect.any(Number),
      resizeMode: 'contain',
      alignSelf: 'center',
      marginTop: expect.any(Number),
    });
  });

  it('should have a headerlogoView style', () => {
    expect(appStyles.headerlogoView).toEqual({
      flexDirection: 'column',
      alignSelf: 'center',
      flex: 1,
      backgroundColor: expect.any(String),
    });
  });

  it('should have a headerlogoSecure style', () => {
    expect(appStyles.headerlogoSecure).toEqual({
      width: expect.any(Number),
      height: expect.any(Number),
      alignSelf: 'center',
      top: expect.any(Number),
      resizeMode: 'contain',
    });
  });

  it('should have a headerActionButton style', () => {
    expect(appStyles.headerActionButton).toEqual({
      backgroundColor: expect.any(String),
      borderRadius: 20,
      alignItems: 'center',
      top: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
      justifyContent: 'center',
      borderColor: expect.any(String),
      borderWidth: 2,
    });
  });

  it('should have a headerActionButtonText style', () => {
    expect(appStyles.headerActionButtonText).toEqual({
      color: expect.any(String),
      fontSize: 12,
      fontFamily: expect.any(String),
    });
  });

  it('should have a backButton style', () => {
    expect(appStyles.backButton).toEqual({
      position: 'absolute',
      width: expect.any(Number),
      height: expect.any(Number),
      alignSelf: 'flex-start',
      resizeMode: 'contain',
    });
  });

  it('should have a backButtonTop style', () => {
    expect(appStyles.backButtonTop).toEqual({
      top: expect.any(Number),
    });
  });

  it('should have a backButtonImage style', () => {
    expect(appStyles.backButtonImage).toEqual({
      width: expect.any(Number),
      height: expect.any(Number),
      resizeMode: 'contain',
      left: '8%',
    });
  });

  it('should have a notificationIcon style', () => {
    expect(appStyles.notificationIcon).toEqual({
      right: expect.any(Number),
      flex: 1,
    });
  });

  it('should have a notificationView style', () => {
    expect(appStyles.notificationView).toEqual({
      right: expect.any(Number),
      flex: 1,
      justifyContent: 'center',
    });
  });

  it('should have a notificationIconImage style', () => {
    expect(appStyles.notificationIconImage).toEqual({
      width: expect.any(Number),
      height: expect.any(Number),
      resizeMode: 'contain',
      alignSelf: 'center',
      marginTop: expect.any(Number),
    });
  });

  it('should have a splashLogo style', () => {
    expect(appStyles.splashLogo).toEqual({
      width: 240,
      height: 100,
      alignSelf: 'center',
      resizeMode: 'contain',
    });
  });

  it('should have a title style', () => {
    expect(appStyles.title).toEqual({
      fontSize: 20,
      fontFamily: expect.any(String),
      textAlign: 'left',
      color: expect.any(String),
    });
  });

  it('should have a description style', () => {
    expect(appStyles.description).toEqual({
      fontSize: 16,
      flexDirection: 'row',
      fontFamily: expect.any(String),
      color: expect.any(String),
    });
  });

  it('should have a splashText style', () => {
    expect(appStyles.splashText).toEqual({
      fontFamily: expect.any(String),
      fontSize: expect.any(Number),
      fontWeight: 'normal',
      width: expect.any(Number),
      justifyContent: 'center',
      color: expect.any(String),
      textAlign: 'center',
      alignSelf: 'center',
    });
  });

  it('should have a textInput style', () => {
    expect(appStyles.textInput).toEqual({
      height: 40,
      borderColor: expect.any(String),
      borderWidth: 1,
      padding: 10,
      width: '100%',
      borderRadius: 8,
      color: expect.any(String),
      fontFamily: expect.any(String),
    });
  });

  it('should have a textInputError style', () => {
    expect(appStyles.textInputError).toEqual({
      borderColor: expect.any(String),
    });
  });

  it('should have an errorText style', () => {
    expect(appStyles.errorText).toEqual({
      color: expect.any(String),
      fontFamily: expect.any(String),
      fontSize: 14,
    });
  });

  it('should have an actionButton style', () => {
    expect(appStyles.actionButton).toEqual({
      backgroundColor: expect.any(String),
      borderColor: expect.any(String),
      borderWidth: 2,
      borderRadius: 20,
      padding: 8,
      width: expect.any(Number),
      alignItems: 'center',
      alignSelf: 'center',
    });
  });

  it('should have a customActionButton style', () => {
    expect(appStyles.customActionButton).toEqual({
      backgroundColor: expect.any(String),
      borderColor: expect.any(String),
      borderWidth: 2,
      borderRadius: 20,
      padding: 8,
      width: expect.any(Number),
      alignItems: 'center',
      alignSelf: 'center',
    });
  });

  it('should have an actionButtonSplash style', () => {
    expect(appStyles.actionButtonSplash).toEqual({
      top: expect.any(Number),
    });
  });

  it('should have an actionButtonDisabled style', () => {
    expect(appStyles.actionButtonDisabled).toEqual({
      backgroundColor: expect.any(String),
      borderColor: expect.any(String),
    });
  });

  it('should have an actionButtonAlt style', () => {
    expect(appStyles.actionButtonAlt).toEqual({
      backgroundColor: expect.any(String),
    });
  });

  it('should have an actionButtonText style', () => {
    expect(appStyles.actionButtonText).toEqual({
      color: expect.any(String),
      fontSize: 18,
      fontFamily: expect.any(String),
    });
  });

  it('should have an actionButtonAltText style', () => {
    expect(appStyles.actionButtonAltText).toEqual({
      color: expect.any(String),
      fontSize: 18,
    });
  });

  it('should have a buttonSubText style', () => {
    expect(appStyles.buttonSubText).toEqual({
      fontSize: 14,
      textAlign: 'center',
      alignSelf: 'center',
      fontFamily: expect.any(String),
      color: expect.any(String),
    });
  });

  it('should have a buttonSubTextSplash style', () => {
    expect(appStyles.buttonSubTextSplash).toEqual({
      top: expect.any(Number),
    });
  });

  it('should have a buttonSubTextNav style', () => {
    expect(appStyles.buttonSubTextNav).toEqual({
      color: expect.any(String),
      fontFamily: expect.any(String),
      fontSize: 14,
    });
  });

  it('should have a footerPrivacyPolicyStyle style', () => {
    expect(appStyles.footerPrivacyPolicyStyle).toEqual({
      color: expect.any(String),
      fontFamily: expect.any(String),
      fontSize: 11,
    });
  });

  it('should have a footerContainer style', () => {
    expect(appStyles.footerContainer).toEqual({
      justifyContent: 'center',
      flexDirection: 'row',
    });
  });

  it('should have a footerText style', () => {
    expect(appStyles.footerText).toEqual({
      fontSize: 11,
      textAlign: 'center',
      alignSelf: 'center',
      color: expect.any(String),
      fontFamily: expect.any(String),
    });
  });

  it('should have a mainContainer style', () => {
    expect(appStyles.mainContainer).toEqual({
      backgroundColor: expect.any(String),
      width: expect.any(Number),
      height: expect.any(Number),
    });
  });

  it('should have a subContainer style', () => {
    expect(appStyles.subContainer).toEqual({
      marginTop: expect.any(Number),
      borderBottomWidth: 1,
      borderBottomColor: expect.any(String),
    });
  });

  it('should have a subLoginContainer style', () => {
    expect(appStyles.subLoginContainer).toEqual({
      marginTop: expect.any(Number),
      borderBottomWidth: 1,
      borderBottomColor: expect.any(String),
    });
  });

  it('should have a container style', () => {
    expect(appStyles.container).toEqual({
      flex: 1,
      backgroundColor: expect.any(String),
    });
  });

  it('should have a tabBar style', () => {
    expect(appStyles.tabBar).toEqual({
      height: expect.any(Number),
      paddingHorizontal: 5,
      verticalAlign: 'middle',
      backgroundColor: expect.any(String),
      justifyContent: 'center',
      alignItems: 'center',
      borderTopWidth: 0,
    });
  });

  it('should have a tabBarIcon style', () => {
    expect(appStyles.tabBarIcon).toEqual({
      width: 25,
      height: 25,
    });
  });

  it('should have a tabBarIconFocused style', () => {
    expect(appStyles.tabBarIconFocused).toEqual({
      tintColor: expect.any(String),
    });
  });

  it('should have a checkViewStyle style', () => {
    expect(appStyles.checkViewStyle).toEqual({
      paddingTop: 20,
      paddingLeft: 5,
    });
  });

  it('should have a notificationsListHeaderStyle style', () => {
    expect(appStyles.notificationsListHeaderStyle).toEqual({
      flexDirection: 'row',
      backgroundColor: expect.any(String),
      paddingHorizontal: 10,
      paddingVertical: 10,
    });
  });

  it('should have a notificationsListReadHeaderStyle style', () => {
    expect(appStyles.notificationsListReadHeaderStyle).toEqual({
      flexDirection: 'row',
      backgroundColor: expect.any(String),
      paddingHorizontal: 10,
      paddingVertical: 10,
    });
  });

  it('should have an itemSeparatorStyle style', () => {
    expect(appStyles.itemSeparatorStyle).toEqual({
      height: 0.6,
      width: '100%',
      backgroundColor: expect.any(String),
    });
  });

  it('should have a flatListParentView style', () => {
    expect(appStyles.flatListParentView).toEqual({
      flex: 1,
      backgroundColor: expect.any(String),
    });
  });

  it('should have a notificationTextStyle style', () => {
    expect(appStyles.notificationTextStyle).toEqual({
      paddingHorizontal: 10,
      borderColor: expect.any(String),
      borderRadius: 2,
    });
  });

  it('should have a notificationTitleStyle style', () => {
    expect(appStyles.notificationTitleStyle).toEqual({
      fontFamily: expect.any(String),
      fontSize: 14,
      color: expect.any(String),
    });
  });

  it('should have a notificationDescStyle style', () => {
    expect(appStyles.notificationDescStyle).toEqual({
      fontSize: 14,
      paddingTop: 4,
      color: expect.any(String),
      fontFamily: expect.any(String),
    });
  });

  it('should have a notificationContentStye style', () => {
    expect(appStyles.notificationContentStye).toEqual({
      fontSize: 10,
      paddingTop: 4,
      color: expect.any(String),
      fontFamily: expect.any(String),
    });
  });

  it('should have a dotImageStyle style', () => {
    expect(appStyles.dotImageStyle).toEqual({
      marginTop: 5,
      height: 6,
      width: 6,
    });
  });

  it('should have a menuContainer style', () => {
    expect(appStyles.menuContainer).toEqual({
      margin: expect.any(Number),
      flexDirection: 'column',
      flex: 1,
    });
  });

  it('should have a menuSectionContainer style', () => {
    expect(appStyles.menuSectionContainer).toEqual({
      borderColor: expect.any(String),
      marginTop: 10,
      marginBottom: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderWidth: 1,
      borderRadius: 6,
      marginRight: 'auto',
      width: '100%',
    });
  });

  it('should have a menuItem style', () => {
    expect(appStyles.menuItem).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('should have a menuImageItem style', () => {
    expect(appStyles.menuImageItem).toEqual({
      width: 20,
      height: 20,
      justifyContent: 'flex-start',
    });
  });

  it('should have a menuDescriptionText style', () => {
    expect(appStyles.menuDescriptionText).toEqual({
      fontSize: 14,
      fontFamily: expect.any(String),
      color: expect.any(String),
    });
  });

  it('should have a menuItemText style', () => {
    expect(appStyles.menuItemText).toEqual({
      fontSize: 20,
      textAlign: 'left',
      marginLeft: 5,
      fontFamily: expect.any(String),
      color: expect.any(String),
    });
  });

  it('should have a menuProfile style', () => {
    expect(appStyles.menuProfile).toEqual({
      height: 55,
    });
  });

  it('should have a menuNotifications style', () => {
    expect(appStyles.menuNotifications).toEqual({
      height: 58,
    });
  });

  it('should have a menuContactUs style', () => {
    expect(appStyles.menuContactUs).toEqual({
      height: 58,
    });
  });

  it('should have a menuSecurity style', () => {
    expect(appStyles.menuSecurity).toEqual({
      height: 40,
      justifyContent: 'center',
      verticalAlign: 'middle',
    });
  });

  it('should have a chatSection style', () => {
    expect(appStyles.chatSection).toEqual({
      display: 'flex',
      flexDirection: 'row',
      height: 28,
      backgroundColor: expect.any(String),
      position: 'absolute',
      width: '100%',
      bottom: 90,
      borderTopColor: expect.any(String),
      borderTopWidth: 1,
    });
  });

  it('should have a chatButton style', () => {
    expect(appStyles.chatButton).toEqual({
      flex: 1,
      marginLeft: 20,
      flexDirection: 'row',
      height: 28,
      alignItems: 'center',
    });
  });

  it('should have a chatText style', () => {
    expect(appStyles.chatText).toEqual({
      marginLeft: 10,
      textAlign: 'left',
      color: expect.any(String),
      fontFamily: expect.any(String),
      fontSize: 13,
    });
  });

  it('should have an acceptTermsConditionsView style', () => {
    expect(appStyles.acceptTermsConditionsView).toEqual({
      height: 35,
      display: 'flex',
      flexDirection: 'row',
    });
  });

  it('should have an acceptPushView style', () => {
    expect(appStyles.acceptPushView).toEqual({
      height: 35,
      display: 'flex',
      flexDirection: 'row',
    });
  });

  it('should have an acceptTermsText style', () => {
    expect(appStyles.acceptTermsText).toEqual({
      marginLeft: 10,
      textAlign: 'left',
      fontSize: 14,
      fontFamily: expect.any(String),
      color: expect.any(String),
    });
  });

  it('should have a switchView style', () => {
    expect(appStyles.switchView).toEqual({
      justifyContent: 'flex-end',
      position: 'relative',
      marginLeft: 'auto',
      marginTop: -25,
    });
  });

  it('should have a menuBackgroundView style', () => {
    expect(appStyles.menuBackgroundView).toEqual({
      flex: 1,
      backgroundColor: expect.any(String),
    });
  });

  it('should have a publicbackButtonTop style', () => {
    expect(appStyles.publicbackButtonTop).toEqual({
      top: 0,
    });
  });
});
