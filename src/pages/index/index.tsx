import Taro, { useState, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import './index.scss'

export default function Index() {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */


  // config: Config = {
  //   navigationBarTitleText: '首页'
  // }

  const[isOpened, setOpened] = useState(false)

  
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

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      console.log('res', res);
      setOpened(false)
    })
  }

  return (
    <View className='index'>
      <View className='title'>拍照识色</View>
        <View className='camera-area' onClick={handleOpenActionSheet}>
          <AtIcon value='camera' size='30' />
      </View>
      <AtActionSheet isOpened={isOpened} cancelText='cancel' onCancel={handleClose}>
        <AtActionSheetItem onClick={handleClick}>
          拍照
        </AtActionSheetItem>
        <AtActionSheetItem onClick={handleChooseImage}>
          从系统相册选择
        </AtActionSheetItem>
      </AtActionSheet>
      {/*  */}
    </View>
  )
}
