import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtActionSheetItem, AtActionSheet } from 'taro-ui'
import title from './title.png'
import cameraIcon from './camera.svg'
import './index.scss'

export default function Index() {
  Index.config = {
    navigationBarTitleText: '拍照识色'
  }

  const [isOpened, setOpened] = useState(false)

  const handleChooseImage = async() => {
    await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
    }).then(res => {
      setOpened(false)
      const imageUrl = res.tempFilePaths[0]
      Taro.navigateTo({ url: `/pages/recognition/index?imageUrl=${imageUrl}` })
    })
  }

  const handleOpenActionSheet = async() => {
    await setOpened(true)
  }

  const handleClose = async() => {
    await setOpened(false)
  }

  const handleClick = async() => {
    await Taro.navigateTo({ url: "/pages/camera/index" }).then(() => {
      setOpened(false)
    })
  }

  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true
    })
  }, [])

  return (
    <View>
      <View className='index'>
        <View className='title'>
          <Text>拍照识色</Text>
        </View>
        <View className='camera-area' onClick={handleOpenActionSheet}>
          <Image mode="aspectFit" src={cameraIcon} style="width: 64px; height: 64px;" />
        </View>
      </View>
      <AtActionSheet isOpened={isOpened} cancelText='取消' onCancel={handleClose}>
        <AtActionSheetItem onClick={handleClick}>
          拍照
        </AtActionSheetItem>
        <AtActionSheetItem onClick={handleChooseImage}>
          从系统相册选择
        </AtActionSheetItem>
      </AtActionSheet>
      </View>
  )
}
