import Taro, { Component } from '@tarojs/taro';
import { View, Button, Canvas } from '@tarojs/components'



export default class Recognition extends Component {


  render() {
    return (
      <View>
        识别呀
      <Canvas
          canvasId="canvas"
          style='width: 100%; height: 90vh;'
        />
        <View>
          主色:
        </View>
      </View>
    )
  }
}