import Taro, { useState } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import colors from './colors.js'
import './index.scss'

export default function Colors() {
  const [currentColor, setBg] = useState(colors[0])

  return (
    <View
      className="colors-container"
    >
      <View className="title">中国色</View>
      <ScrollView
        scrollY
        className="color-picker"
        upperThreshold={10}
        scrollWithAnimation
      >
        <View className="colors-list">
          {colors.map(c =>
            <View
              className="colors-item"
              style={{ backgroundColor: `${c.hex}` }}
              onClick={() => setBg(c)}
            />
          )}
        </View>
      </ScrollView>
      <View className="colors-info" style={{ backgroundColor: `${currentColor.hex}` }}>
        <View style="font-size: 24px;">{currentColor.name}</View>
        <View style="margin-bottom: 12px;">{currentColor.pinyin}</View>
        <View>HEX: {currentColor.hex}</View>
        <View>CMYK: {currentColor.CMYK.toString()}</View>
        <View>RGB: {currentColor.RGB.toString()}</View>
      </View>
    </View>
  );
}