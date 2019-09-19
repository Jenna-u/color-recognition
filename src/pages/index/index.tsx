import Taro, { useState, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtTabBar, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import title from './title.png'
import cameraIcon from './icon.png'
import './index.scss'

export default function Index() {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  Index.config = {
    navigationBarTitleText: '首页'
  }

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
          <Image mode="aspectFill" src={title} style="width: 222px; height: 44px;" />
        </View>
        <View className='camera-area' onClick={handleChooseImage}>
          <View className="second-circle">
            <View className="third-circle">
              <AtIcon className="camera-icon" value='icon icon-xiangji' size='60' color="#6B400D" style={{ paddingTop: '30px', display: 'inline-block' }} />
              {/* <Image src={cameraIcon} style="width: 50px; height: 50px" /> */}
            </View>
          </View>
        </View>
        <Text className="tips">点击拍照</Text>
      </View>
      <AtTabBar
        fixed
        tabList={[
          { title: '首页', iconType: 'icon icon-shouye', },
          { title: '中国色', iconType: 'icon icon-zhongguojie' },
          { title: '我的收藏', iconType: 'icon icon-shoucang_' }
        ]}
        onClick={handleChangeTab}
        current={current}
        />
      </View>
  )
}
