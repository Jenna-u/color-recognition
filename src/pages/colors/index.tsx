import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { showToast, hideToast } from '../../utils/index'
import './index.scss'

export default function Colors() {

  Colors.config = {
    navigationBarTitleText: '中国色',
  }

  const [currentColor, setBg] = useState(colors[4])
  const [chinaColors, getChinaColor] = useState([])

  const getChinaColorData = async () => {
    showToast({
      title: '数据加载中...',
      mask: true,
      icon: 'loading',
      duration: 0
    })

    Taro.cloud.callFunction({
      name: 'getChinaColors',
      complete: res => {
        const { result: { data } } = res
        hideToast()
        getChinaColor(data);
      }
    })
  }

  useEffect(() => {
    getChinaColorData()
  }, [])

  return (
    <View
      className="colors-container"
    >
      <View className="title">中国传统颜色</View>
      <ScrollView
        scrollY
        className="color-picker"
        upperThreshold={10}
        scrollWithAnimation
      >
        <View className="colors-list">
          {chinaColors.map(c =>
            <View
              className={ currentColor.hex === c.hex ? 'colors-item active' : 'colors-item' }
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