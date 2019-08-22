import Taro, { Component, Config } from '@tarojs/taro'
import { View, Navigator } from '@tarojs/components'
import { AtIcon, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import './index.scss'
import "taro-ui/dist/style/components/icon.scss"
export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  state = {
    isOpened: false
  }

  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillMount () { }

  componentDidMount() {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide() { }
  
  handleOpenActionSheet = () => {
    this.setState({
      isOpened: true
    })
  }

  handleClose = () => {
    this.setState({
      isOpened: false
    })
  }

  handleCamera = () => {
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('src', res.tempImagePath);
      }
    })
  }

  render () {
    return (
      <View className='index'>
        <View className='title'>拍照识色</View>
          <View className='camera-area' onClick={this.handleOpenActionSheet}>
            <AtIcon value='camera' size='30' />
        </View>
        <AtActionSheet isOpened={this.state.isOpened} cancelText='cancel' onCancel={this.handleClose}>
          <AtActionSheetItem>
            <Navigator url="/pages/camera/index" hover-class="navigator-hover">拍照</Navigator>
          </AtActionSheetItem>
          <AtActionSheetItem>
            从系统相册选择
          </AtActionSheetItem>
        </AtActionSheet>
        {/*  */}
      </View>
    )
  }
}
