import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { showToast, hideToast } from '../../utils/index'

import './index.scss'

export default function ColorsDetail() {
  ColorsDetail.config = {
    navigationBarTitleText: '详情',
  }

  const [chinaColors, getChinaColor] = useState([])
  const keygen = this.$router.params.color
  const getChinaColorData = async () => {
    showToast({
      title: '数据加载中...',
      mask: true,
      icon: 'loading',
      duration: 0
    })

    await Taro.cloud.callFunction({
      name: 'getChinaColors',
      complete: res => {
        const { result: { data } } = res
        hideToast()
        const colors = data.filter(x => x.name.includes(keygen))
        console.log('colors', colors)
        getChinaColor(colors)
      }
    })
  }

  useEffect(() => {
    getChinaColorData()
  }, [])


  return (
    <ScrollView
      scrollX={true}
      className="color-picker"
    >
      <View className="colors-list">
        {chinaColors.map(c =>
          <View
            key={c.id}
            className='colors-item'
            style={{ backgroundColor: `${c.hex}` }}
          >
            <View style="font-size: 24px;">{c.name}</View>
            <View style="margin-bottom: 12px;">{c.pinyin}</View>
            <View>HEX: {c.hex}</View>
            <View>CMYK: {c.CMYK.toString()}</View>
            <View>RGB: {c.RGB.toString()}</View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}