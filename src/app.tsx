import Taro, { Component, Config } from '@tarojs/taro'
import '@tarojs/async-await'
import Index from './pages/index'

import './app.scss'
import './icon/iconfont.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/colors/index',
      'pages/camera/index',
      'pages/recognition/index',
      'pages/collection/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      selectedColor: '#398CF8',
      color: '#666',
      backgroundColor:"#fafafa",
      list: [
        {
          text: "首页",
          pagePath: 'pages/index/index',
          iconPath: 'images/home.png',
          selectedIconPath: "images/home-active.png",
        }, {
          text: "中国色",
          pagePath: 'pages/colors/index',
          iconPath: 'images/color.png',
          selectedIconPath: "images/color-active.png",
        }, {
          text: "我的收藏",
          pagePath: 'pages/collection/index',
          iconPath: 'images/collection.png',
          selectedIconPath: "images/collection-active.png",
        }
      ]
    },
    cloud: true
  }

  componentDidMount() {
    Taro.cloud.init({
      env: 'zhiqiang-cloud-x78sx',
      traceUser: true,
    })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
