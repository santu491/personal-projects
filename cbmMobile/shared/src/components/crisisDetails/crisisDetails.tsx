import React, { useRef, useState } from 'react';
import { Dimensions, GestureResponderEvent, Linking, Text, TouchableOpacity, View } from 'react-native';

import { CrisisDataList } from '../../../../src/models/crisisSupport';
import { ErrorIndicatorIcon } from '../../assets/icons/icons';
import { appColors } from '../../context/appColors';
import { CustomTooltip } from '../customTooltip/customTooltip';
import { H1 } from '../text/text';
import { crisisStyles } from './crisisDetails.styles';

export interface CrisisDetailProps {
  coverageTitle: string;
  hotlineTitle: string;
  listData?: CrisisDataList[];
  title: string;
}

export const CrisisDetails: React.FC<CrisisDetailProps> = ({ title, listData, hotlineTitle, coverageTitle }) => {
  const infoIconRef = useRef(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, right: 0 });
  const [visible, setVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState<string>();

  const openURL = (link: string | undefined) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  const onPressInfo = (event: GestureResponderEvent, hours?: string[]) => {
    const hoursLength = hours?.length || 0;
    const text = hours?.join('\n') || '';
    const tooltipContainerPadding = 30;
    const { pageX, pageY } = event.nativeEvent;
    setPopoverPosition({
      top: pageY - (hoursLength * 16 + tooltipContainerPadding),
      right: Dimensions.get('window').width - pageX + 18,
    });
    setTooltipText(text);
    setVisible(true);
  };

  const toolTipView = () => {
    return (
      <>
        <View style={crisisStyles.tooltipDotView} />
        <Text testID={'tooltip.title'} style={crisisStyles.tooltipText}>
          {tooltipText}
        </Text>
        <View style={crisisStyles.notchContainer}>
          <View style={crisisStyles.notch} />
        </View>
      </>
    );
  };

  return (
    <View key={title} style={crisisStyles.container}>
      <H1 testID={'crisisDetails.title'} style={crisisStyles.title}>
        {title}
      </H1>
      <View style={crisisStyles.cardContainer}>
        <View style={crisisStyles.headerTitlesView}>
          <H1 testID={'crisisDetails.header.hotText'} style={crisisStyles.label}>
            {hotlineTitle}
          </H1>
          <H1 testID={'crisisDetails.header.coverageText'} style={[crisisStyles.label, crisisStyles.headerTitle]}>
            {coverageTitle}
          </H1>
        </View>
        {listData?.map((info) => (
          <View key={info.item.text} style={crisisStyles.innerContainer}>
            <View style={crisisStyles.hotlineContainer}>
              {info.item.link ? (
                <TouchableOpacity onPress={() => openURL(info.item.link)}>
                  <Text style={crisisStyles.titleCell}>{info.item.text}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={crisisStyles.titleCell}>{info.item.text}</Text>
              )}
            </View>
            <View style={crisisStyles.coverageContainer}>
              {info.details.map((detail, index) => {
                return (
                  <View key={detail.id} style={crisisStyles.innerContainer}>
                    <View style={crisisStyles.dotView} />
                    <View style={crisisStyles.coverageView}>
                      {detail.prefixText ? <Text style={crisisStyles.prefixText}> {detail.prefixText}</Text> : null}
                      {detail.link ? (
                        <TouchableOpacity onPress={() => openURL(detail.link)}>
                          <Text style={detail.prefixText ? crisisStyles.spaceToLinkCell : crisisStyles.cell}>
                            {detail.text}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {detail.suffixText ? <Text style={crisisStyles.coverageCell}> {detail.suffixText}</Text> : null}
                    </View>
                    <View style={crisisStyles.toolTipView}>
                      {detail.hours && detail.hours.length > 0 ? (
                        <TouchableOpacity
                          testID={`info-icon-${index}`}
                          ref={infoIconRef}
                          onPress={(event) => onPressInfo(event, detail.hours)}
                          style={crisisStyles.infoView}
                        >
                          <ErrorIndicatorIcon color={appColors.lightPurple} />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
      <CustomTooltip
        tooltipView={toolTipView()}
        popoverPosition={popoverPosition}
        visible={visible}
        setVisible={setVisible}
        popoverContainerStyle={crisisStyles.popoverContainer}
      />
    </View>
  );
};
