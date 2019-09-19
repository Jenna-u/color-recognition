import Taro, { useState } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import title from './title.png'
import cameraIcon from './icon.png'
import './index.scss'

export default function Index() {
  Index.config = {
    navigationBarTitleText: '首页'
  }

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      const imageUrl = res.tempFilePaths[0]
      Taro.navigateTo({url: `/pages/recognition/index?imageUrl=${imageUrl}`})
    })
  }

  return (
    <View>
      <View className='index'>
        <View className='title'>
          <Image mode="aspectFit" src={title} style="width: 222px; height: 44px;" />
        </View>
        <View className='camera-area' onClick={handleChooseImage}>
          <View className="second-circle">
            <View className="third-circle">
              <Image mode="aspectFit" src={cameraIcon} style="width: 50px; height: 50px; margin-top: 30px;" />
            </View>
          </View>
        </View>
        <Text className="tips">点击拍照</Text>
      </View>
      </View>
  )
}
