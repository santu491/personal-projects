import React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

export const ChatOfflineIcon = () => {
  return (
    <Svg width={110} height={85} viewBox="0 0 110 85" fill="none">
      <Path
        d="M109.712 16.336H38.308v53.643h41.45L94.62 84.84V69.98h15.093V16.335z"
        fill="url(#paint0_linear_19186_727)"
      />
      <Path d="M.25.75h71.404v53.644h-41.45l-14.861 14.86v-14.86H.25V.75z" fill="url(#paint1_linear_19186_727)" />
      <Path
        d="M58.062 17.06h-44.22a.544.544 0 010-1.086h44.22a.544.544 0 010 1.087z"
        fill="url(#paint2_linear_19186_727)"
      />
      <Path
        d="M56.25 24.31H13.841a.544.544 0 010-1.088h42.407a.544.544 0 010 1.088z"
        fill="url(#paint3_linear_19186_727)"
      />
      <Path
        d="M52.625 31.559H13.842a.544.544 0 010-1.087h38.783a.544.544 0 010 1.087z"
        fill="url(#paint4_linear_19186_727)"
      />
      <Path
        d="M41.751 38.808H13.842a.544.544 0 010-1.087h27.91a.544.544 0 010 1.087z"
        fill="url(#paint5_linear_19186_727)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_19186_727"
          x1={128.168}
          y1={57.2711}
          x2={88.9402}
          y2={2.72131}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#44B8F3" />
          <Stop stopColor="#794CFF" />
          <Stop offset={0.62} stopColor="#794CFF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_19186_727"
          x1={-78.5886}
          y1={28.4144}
          x2={28.0133}
          y2={115.689}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.38} stopColor="#794CFF" />
          <Stop offset={0.999804} stopColor="#44B8F3" />
          <Stop offset={1} stopColor="#794CFF" />
        </LinearGradient>
        <LinearGradient
          id="paint2_linear_19186_727"
          x1={13.2983}
          y1={17.0608}
          x2={58.6055}
          y2={17.0608}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#5009B5" />
          <Stop offset={0.948341} stopColor="#5009B5" stopOpacity={0.0516592} />
          <Stop offset={1} stopColor="#5009B5" stopOpacity={0.01} />
        </LinearGradient>
        <LinearGradient
          id="paint3_linear_19186_727"
          x1={13.2983}
          y1={24.3097}
          x2={56.7932}
          y2={24.3097}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#5009B5" />
          <Stop offset={0.948341} stopColor="#5009B5" stopOpacity={0.0516592} />
          <Stop offset={1} stopColor="#5009B5" stopOpacity={0.01} />
        </LinearGradient>
        <LinearGradient
          id="paint4_linear_19186_727"
          x1={13.2983}
          y1={31.559}
          x2={53.1687}
          y2={31.559}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#5009B5" />
          <Stop offset={0.948341} stopColor="#5009B5" stopOpacity={0.0516592} />
          <Stop offset={1} stopColor="#5009B5" stopOpacity={0.01} />
        </LinearGradient>
        <LinearGradient
          id="paint5_linear_19186_727"
          x1={13.2983}
          y1={38.8082}
          x2={42.2949}
          y2={38.8082}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#5009B5" />
          <Stop offset={0.948341} stopColor="#5009B5" stopOpacity={0.0516592} />
          <Stop offset={1} stopColor="#5009B5" stopOpacity={0.01} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
};
