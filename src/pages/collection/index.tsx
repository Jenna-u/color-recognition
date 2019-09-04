import Taro, { useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'


export default function Collection() {
  const colors = ['#90b7dd', '#60bad1', '#507fba', '#96d6e0', '#ffb07f']
  // const [colors, getColorList] = useState([])
  const [openId, setUserInfo] = useState('')

  const setClipboard = (data) => {
    Taro.setClipboardData({
      data: data.toString()
    }).then(res => {
      console.log('res', res)
    })
  }

  const getUserInfo = () => {
    Taro.cloud.callFunction({
      name: 'colors',
      complete: res => {
        setUserInfo(res.result.openid)
      }
    })
  }

  const fetchColors = () => {
    const db = Taro.cloud.database();
    db.collection('colors').where({
      _openid: openId
    }).get().then(res => console.log('res', res.data))
  }
 
  useEffect(() => {
    // getUserInfo()
    // fetchColors()
  })

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