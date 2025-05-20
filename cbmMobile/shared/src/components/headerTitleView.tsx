import React, { useMemo } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { useAppContext } from '../../../src/context/appContext';
import { isIOS } from '../../../src/util/commonUtils';
import { CarelonBHLogo } from '../assets/icons/icons';
import { appColors } from '../context/appColors';

interface HeaderTitleProps {
  clientLogoStyle?: StyleProp<ImageStyle>;
  testID?: string;
  titleView?: StyleProp<ViewStyle>;
}

export const HeaderTitleView: React.FC<HeaderTitleProps> = ({ testID, titleView, clientLogoStyle }) => {
  const appContext = useAppContext();

  const isSVGImage = useMemo(() => {
    const url = appContext.headerInfo?.clientLogo?.url;
    return url?.endsWith('.svg') && url.length > 0;
  }, [appContext.headerInfo?.clientLogo?.url]);

  return (
    <View style={[styles.headerLogoView, titleView]} testID={testID ?? 'header-logo'}>
      <CarelonBHLogo />
      {appContext.headerInfo?.clientLogo?.url ? (
        <View style={styles.imageStyle}>
          {isSVGImage ? (
            <View style={[styles.svgImage, clientLogoStyle]}>
              <SvgUri
                width={'100%'}
                uri={encodeURI(appContext.headerInfo.clientLogo.url)}
                onError={(error) => console.error('Error loading SVG:', error)}
              />
            </View>
          ) : (
            <Image
              source={{
                uri: appContext.headerInfo.clientLogo.url,
              }}
              style={clientLogoStyle}
              onError={(error) => {
                console.error('Error loading image:', error.nativeEvent.error);
              }}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerLogoView: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: appColors.white,
    marginTop: isIOS() ? 0 : 20,
  },
  imageStyle: {
    paddingHorizontal: 5,
  },
  svgImage: {
    justifyContent: 'center',
  },
});
