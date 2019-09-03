import Taro, { useState } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'


export default function Collection() {
  const colors = ['#90b7dd', '#60bad1', '#507fba', '#96d6e0', '#ffb07f']

  const setClipboard = (data) => {
    Taro.setClipboardData({
      data: data.toString()
    }).then(res => {
      console.log('res', res)
    })
  }

  return (
    <View className="colors-container">
      <View>我的收藏</View>
      <View className="colors-list">
        {colors.map(x => <View key={x} className="item" style={{ backgroundColor: `${x}` }} />)}
        <View className="copy-icon" onClick={() => setClipboard(colors)}>复制</View>
      </View>
    </View>
  )
}