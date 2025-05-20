import React from 'react';
import { View } from 'react-native';

import { H1, H2, RNText } from '../../../../../shared/src/components/text/text';
import { DetailDataList, MenuList } from '../../models/menu';
import { detailsListStyles } from './detailsList.styles';

export const DetailsList: React.FC<DetailDataList> = ({ listData, title }) => {
  return (
    <View style={detailsListStyles.container}>
      <H2 style={detailsListStyles.title}>{title}</H2>
      <View style={detailsListStyles.itemSeparatorStyle} />
      {listData?.map((info: MenuList) => (
        <View key={info.label} style={detailsListStyles.cardStyle}>
          <H1 style={detailsListStyles.label}>{info.label}</H1>
          {info.value ? <RNText style={detailsListStyles.value}>{info.value}</RNText> : null}
        </View>
      ))}
    </View>
  );
};
