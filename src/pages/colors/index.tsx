import Taro, { useState } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import colors from './colors.js'

export default function Colors() {
  const [currentColor, setBg] = useState(colors[0])

  return (
    <View
      className="colors-container"
    >
      <ScrollView
        scrollY
        className="colors-nav"
        upperThreshold={10}
        scrollWithAnimation
      >
        <View className="colors-list">
          {colors.map(c =>
            <View
              className="colors-item"
              style={{ backgroundColor: `${c.hex}` }}
              onClick={() => setBg(c)}
            >
              {c.name}
            </View>
          )}
        </View>
      </ScrollView>
      <View className="colors-info" style={{ backgroundColor: `${currentColor.hex}` }}>
        <View>{currentColor.name}</View>
        <View>HEX: {currentColor.hex}</View>
        <View>CMYK: {currentColor.CMYK.toString()}</View>
        <View>RGB: {currentColor.RGB.toString()}</View>
      </View>
    </View>
  );
}