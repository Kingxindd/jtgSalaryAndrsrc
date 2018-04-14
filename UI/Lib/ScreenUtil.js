//import React, { Component } from 'react';
import {
Dimensions,
  PixelRatio,
} from 'react-native';
//  mdpi for android
const PIXEL_RATIO_160_1 =1;
// hdp from android
const PIXEL_RATIO_240_1d5 =1.5;
// iphone4, 4s, 5, 5c, 5s, 6, 7; xhdpi from android
const PIXEL_RATIO_320_2 =2;
// iphone6p, 7p; xxhdpi for android,1080p
const PIXEL_RATIO_480_3 =3;
// larger from android
const PIXEL_RATIO_560_3x5 =3.5;

// 设置基准分辨率
const BASE_PT_RATIO = 2.625;
const BASE_PIXEL_WIDTH = 1080;
const w_w = Dimensions.get('window').width;
// 根据密度适配不同的分辨率,参数为dp
export function DP(length) {
    // 获取密度
    let ratio = PixelRatio.get();
    if (length == null) {
        length = 0;
    }
    let result = parseInt(length / (BASE_PIXEL_WIDTH / BASE_PT_RATIO) * w_w);

    //let result= parseInt(length /(BASE_PT_RATIO / ratio));
    if (result === 0)
        result = 1;
    return result;
}

// 根据密度适配不同的分辨率，参数为px
export function PX(length) {
    // 获取密度
    let ratio=PixelRatio.get();
    let dp= length/ ratio;
    return DP(dp);
}