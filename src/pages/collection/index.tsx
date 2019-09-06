import Taro, { useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtPagination } from 'taro-ui'

import './index.scss'

export default function Collection() {
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
      _openid: openid
    }).get().then(res => {
      const { data } = res
      const getColor = data.map(x => x.colors)
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
        {colors.map(x => <View className="colors-list">
          {x.map(c => <View className="item" style={{ backgroundColor: `#${c}` }} />)}
          <View className="copy-icon" onClick={() => setClipboard(x)}>复制</View>
        </View>)}
      </View>
      {colors.length > 10 && 
        <AtPagination
          icon  
          total={50} 
          pageSize={10}
          current={1}
        />
      }
    </View>
  )
}