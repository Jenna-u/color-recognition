import Taro, { useState, Config } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import colors from './colors.js'

export default function Colors() {

  const c = {
    "CMYK": [
        4,
        5,
        18,
        0
    ],
    "RGB": [
        249,
        244,
        220
    ],
    "hex": "#f9f4dc",
    "name": "乳白",
    "pinyin": "rubai"
  }
  const [currentColor, setBg] = useState(c)

  return (
    <ScrollView
      scrollY
      className="colors-container"
      upperThreshold={10}
      scrollWithAnimation
    >
      <View className="colors-nav">
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
      </View>
      <View className="colors-info" style={{ backgroundColor: `${currentColor.hex}` }}>
        <View>{currentColor.name}</View>
        <View>CMYK:{currentColor.CMYK.toString()}</View>
        <View>RGB:{ currentColor.RGB.toString()}</View>
      </View>
    </ScrollView>
  );
}