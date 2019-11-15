import Taro, { useState } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtActionSheetItem, AtActionSheet } from 'taro-ui'
import title from './title.png'
import cameraIcon from './icon.png'
import './index.scss'

export default function Index() {
  Index.config = {
    navigationBarTitleText: '首页'
  }

  const[isOpened, setOpened] = useState(false)

  const handleChooseImage = async() => {
    await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
    }).then(res => {
      const imageUrl = res.tempFilePaths[0]
      Taro.navigateTo({ url: `/pages/recognition/index?imageUrl=${imageUrl}` })
      setOpened(false)
    })
  }

  const handleOpenActionSheet = () => {
    setOpened(true)
  }

  const handleClose = () => {
    setOpened(false)
  }

  const handleClick = () => {
    Taro.navigateTo({ url: "/pages/camera/index" }).then(() => {
      setOpened(false)
    })
  }

  return (
    <View>
      <View className='index'>
        <View className='title'>
          <Image mode="aspectFit" src={title} alt="拍照识色1" style="width: 222px; height: 44px;" />
        </View>
        <View className='camera-area' onClick={handleOpenActionSheet}>
          <View className="second-circle">
            <View className="third-circle">
              <Image mode="aspectFit" src={cameraIcon} style="width: 50px; height: 50px; margin-top: 30px;" />
            </View>
          </View>
        </View>
        <Text className="tips">点击拍照</Text>
      </View>
      <AtActionSheet isOpened={isOpened} cancelText='cancel' onCancel={handleClose}>
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
