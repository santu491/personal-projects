import React, { useMemo } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, ScrollView, TouchableOpacity, View } from 'react-native';
import Html from 'react-native-render-html';

import {
  CloseXIcon,
  FaxIcon,
  GlobeIcon,
  LocationIcon,
  MailIcon,
  ProviderPhoneIcon,
  ToolTipInfoIcon,
} from '../../../../../shared/src/assets/icons/icons';
import { H1, RNText } from '../../../../../shared/src/components/text/text';
import { ContactType, formatPhoneNumber } from '../../../../../shared/src/utils/utils';
import { appColors } from '../../../../../src/config';
import { DetailedSectionData, TooltipCheck } from '../../model/providerSearchResponse';
import { providerDetailsStyles } from '../../screens/providerDetail/providerDetail.styles';

const NOT_AVAILABLE = 'Not Available';

const contactIcon = (iconType: string, color: string) => {
  const contactImage = {
    [ContactType.PHONE]: <ProviderPhoneIcon color={color} />,
    [ContactType.EMAIL]: <MailIcon color={color} />,
    [ContactType.ADDRESS]: <LocationIcon color={color} />,
    [ContactType.FAX]: <FaxIcon color={color} />,
    [ContactType.WEBSITE]: <GlobeIcon color={color} />,
  };

  return contactImage[iconType as keyof typeof contactImage];
};

const tagsStyles = {
  body: {
    color: appColors.white,
  },
  p: {
    fontSize: 14,
    lineHeight: 20,
  },
};

interface ProviderDetailContactProps {
  data: DetailedSectionData;
  index: number;
  onPress: (data: DetailedSectionData) => void;
  onPressToolTip: (tooltip: TooltipCheck) => void;
  toolTipVisible: TooltipCheck | undefined;
}

export const ProviderDetailContact = ({
  data,
  onPress,
  index,
  onPressToolTip,
  toolTipVisible,
}: ProviderDetailContactProps) => {
  const [viewHeight, setViewHeight] = React.useState(120);
  const description = () => {
    switch (data.type) {
      case ContactType.PHONE:
      case ContactType.FAX:
        return data.description !== NOT_AVAILABLE
          ? formatPhoneNumber(typeof data.description === 'string' ? data.description : '')
          : data.description;
      default:
        return data.description;
    }
  };

  const onToolTipPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onPressToolTip({ title: data.title, index });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height > 120 ? 120 : height + 5);
  };
  const styles = useMemo(() => providerDetailsStyles(), []);

  return (
    <>
      <View style={styles.titleView}>
        <H1 style={styles.title}>{data.title.toUpperCase()}</H1>
        {data.tooltip ? (
          <>
            <TouchableOpacity style={styles.toolTipIcon} onPress={(e) => onToolTipPress(e)}>
              {toolTipVisible && toolTipVisible.index === index && toolTipVisible.title === data.title ? (
                <CloseXIcon />
              ) : (
                <ToolTipInfoIcon />
              )}
            </TouchableOpacity>
            {toolTipVisible && toolTipVisible.index === index && toolTipVisible.title === data.title ? (
              <View>
                <View style={styles.toolTipView}>
                  <View
                    style={[
                      styles.toolTipContainer,
                      {
                        bottom: viewHeight,
                      },
                    ]}
                  >
                    <ScrollView style={styles.tooltipContent} nestedScrollEnabled={true}>
                      <TouchableOpacity onLayout={onLayout} activeOpacity={1}>
                        <Html source={{ html: data.tooltip }} tagsStyles={tagsStyles} />
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                </View>
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      <TouchableOpacity disabled={!data.type} style={styles.contactLabelView} onPress={() => onPress(data)}>
        {data.type ? (
          <View style={styles.contactIcon}>
            {contactIcon(data.type, data.description === NOT_AVAILABLE ? appColors.darkGray : appColors.purple)}
          </View>
        ) : null}
        <RNText style={[styles.contactDescription, data.type && data.description !== NOT_AVAILABLE && styles.link]}>
          {description()}
        </RNText>
      </TouchableOpacity>
    </>
  );
};
