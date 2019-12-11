import Taro, { useState, useEffect, getClipboardData } from '@tarojs/taro';
import { View, Camera, Button, Image, CoverView } from '@tarojs/components'
import { showToast, hideToast } from '../../utils/index'
import '../collection/index.scss'

export default function Explore() {

  Explore.config = {
    navigationBarTitleText: '探索'
  }

  const [userColorListArray, getUserColorListData] = useState([])
  
  const fetchColors = async() => {
    showToast({
      title: '数据加载中...',
      mask: true,
      icon: 'loading',
      duration: 0
    })

    await Taro.cloud.callFunction({
      name: 'getColorList',
      complete: res => {
        const { result: { data } } = res
        getUserColorListData(data)
      }
    })
  }

  useEffect(() => {

    fetchColors()
  },[])

  return (
    <View>
      探索
    {userColorListArray.map(x =>
        <View className="colors-list">
          {x.colors.map(c => <View className="item" style={{ backgroundColor: `#${c}` }} />)}
        </View>) }
    </View>
  )
}