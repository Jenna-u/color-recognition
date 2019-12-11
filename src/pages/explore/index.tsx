import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Camera, Button, Image, CoverView } from '@tarojs/components'
import { showToast, hideToast } from '../../utils/index'

export default function Explore() {

  Explore.config = {
    navigationBarTitleText: '探索'
  }

  const [colorList, getColorList] = useState([])
  
  const fetchColors = () => {
    showToast({
      title: '数据加载中...',
      mask: true,
      icon: 'loading',
      duration: 0
    })

  }

  useEffect(() => {
    // getUserInfo()
    fetchColors()
  })

  return (
    <View>
      探索
    </View>
  )
}