import Taro, { useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { rgbToHex } from '../../utils/index'

import './index.scss'


export default function Collection() {
  // const colors = ['#90b7dd', '#60bad1', '#507fba', '#96d6e0', '#ffb07f']
  const [colors, getColorList] = useState([])
  const [openid, setUserInfo] = useState('')

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
      _openid: openid,
    }).get().then(res => {
      console.log('res====', res.data);
      const { data } = res
      const getColor = data.map(x => x.colors.map(c => rgbToHex(c)))
      console.log('colors', getColor);
      getColorList(getColor);
    })
  }
 
  useEffect(() => {
    getUserInfo()
    fetchColors()
  }, [])

  return (
    <View className="colors-container">
      <View>我的收藏</View>
      <View>
        {colors.map(x => <View className="colors-list" style={{ height: '80px' }}>
          {x.map(c => <View className="item" style={{ backgroundColor: `#${c}` }} />)}
          <View className="copy-icon" onClick={() => setClipboard(colors)}>复制</View>
        </View>)}
      </View>
    </View>
  )
}