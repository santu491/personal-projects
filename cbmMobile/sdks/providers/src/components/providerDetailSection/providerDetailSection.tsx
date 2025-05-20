import React, { useMemo } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, ScrollView, TouchableOpacity, View } from 'react-native';
import Html from 'react-native-render-html';

import { CloseXIcon, ToolTipInfoIcon } from '../../../../../shared/src/assets/icons/icons';
import { H1, RNText } from '../../../../../shared/src/components/text/text';
import { appColors } from '../../../../../src/config';
import { DetailedSectionData, TooltipCheck } from '../../model/providerSearchResponse';
import { providerDetailsStyles } from '../../screens/providerDetail/providerDetail.styles';

interface ProviderDetailSectionProps {
  data: DetailedSectionData;
  index: number;
  onPressToolTip: (tooltip: TooltipCheck) => void;
  toolTipVisible: TooltipCheck | undefined;
}

const tagsStyles = {
  body: {
    color: appColors.white,
  },
  p: {
    fontSize: 14,
    lineHeight: 20,
  },
};

export const ProviderDetailSection = ({ data, onPressToolTip, toolTipVisible, index }: ProviderDetailSectionProps) => {
  const [viewHeight, setViewHeight] = React.useState(120);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height > 120 ? 120 : height + 5);
  };

  const onToolTipPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onPressToolTip({ title: data.title, index });
  };
  const styles = useMemo(() => providerDetailsStyles(), []);

  return (
    <>
      {(typeof data.description === 'string' && data.description) ||
      (Array.isArray(data.description) && data.description.length > 0) ? (
        <View key={data.title}>
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
          {Array.isArray(data.description) && data.description.length > 0 ? (
            <>
              {data.description.map((desc) => (
                <View key={desc} style={styles.descriptionView}>
                  <View style={styles.circle} />
                  <RNText style={styles.description}>{desc}</RNText>
                </View>
              ))}
            </>
          ) : (
            <RNText style={styles.description}>{data.description}</RNText>
          )}
        </View>
      ) : null}
    </>
  );
};
