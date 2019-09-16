import Taro, { useState, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtTabBar, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import title from './title.png'
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

  // const [isOpened, setOpened] = useState(false)
  const [current, changeTab] = useState(0)

  
  // const handleOpenActionSheet = () => {
  //   setOpened(true)
  // }

  // const handleClose = () => {
  //   setOpened(false)
  // }

  // const handleClick = () => {
  //   Taro.navigateTo({ url: "/pages/camera/index" }).then(() => {
  //     setOpened(false)
  //   })
  // }

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    }).then(res => {
      const imageUrl = res.tempFilePaths[0]
      Taro.navigateTo({url: `/pages/recognition/index?imageUrl=${imageUrl}`})
      // setOpened(false)
    })
  }

  const handleChangeTab = (value) => {
    changeTab(value)
    if (value === 1) Taro.navigateTo({ url: '/pages/colors/index' })
    if (value === 2) Taro.navigateTo({ url: '/pages/collection/index' })
  }

  return (
    <View>
      <View className='index'>
        <View className='title'>
          <Image src={title} style="width: 222px; height: 44px;" />
          {/* 拍照识色 */}
        </View>
        <View className='camera-area' onClick={handleChooseImage}>
          <View className="second-circle">
            <View className="third-circle">
              <AtIcon className="camera-icon" value='camera' size='50' style={{ paddingTop: '30px', display: 'inline-block' }} />
            </View>
          </View>
        </View>
        <Text className="tips">点击拍照</Text>
        {/* <AtActionSheet isOpened={isOpened} cancelText='cancel' onCancel={handleClose}>
          <AtActionSheetItem onClick={handleClick}>
            拍照
          </AtActionSheetItem>
          <AtActionSheetItem onClick={handleChooseImage}>
            从系统相册选择
          </AtActionSheetItem>
        </AtActionSheet> */}
      </View>
      <AtTabBar
          fixed
          tabList={[
            { title: '首页', iconType: 'home', },
            { title: '中国色', iconType: 'heart' },
            { title: '我的收藏', iconType: 'tag' }
          ]}
          onClick={handleChangeTab}
          current={current}
        />
      </View>
  )
}
