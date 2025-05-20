import * as deepmerge from 'deepmerge';
import React from 'react';
import { ColorValue, DimensionValue, ImageRequireSource } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { ParamListBase } from '@react-navigation/native';

declare global {
  var __TEST__: boolean;
  declare module '*.svg' {
    const Svg: (
      props: Omit<SvgProps, 'fill' | 'color', 'height' | 'width'> & {
        fill?: string;
        color?: ColorValue;
        height: DimensionValue;
        width: DimensionValue;
      }
    ) => JSX.Element;
    export default Svg;
  }
  declare module '*.png' {
    const imageSource: ImageRequireSource;
    export default imageSource;
  }
  declare module '*.jpg' {
    const imageSource: ImageRequireSource;
    export default imageSource;
  }

  type TypedArray =
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | BigInt64Array
    | BigUint64Array;

  declare var crypto: {
    getRandomValues: <T extends TypedArray>(array: T) => T;
  };
}
