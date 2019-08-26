import Taro, { Component } from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components'
import { createPixelArray } from '../../utils/index'
import quantize from 'quantize';


export default class Recognition extends Component {

  state = {
    // palette: [[246, 74, 135],
    // [87, 96, 74],
    // [171, 196, 168],
    // [39, 32, 30],
    // [157, 153, 132],
    // [127, 154, 114],
    // [215, 209, 194],
    // [135, 160, 136],
    // [174, 175, 178],
    // [35, 53, 32]]
    palette: []
  }
  
  componentDidMount() {
    const ctx = Taro.createCanvasContext('canvas', this.$scope);
    const imageUrl = this.$router.params.imageUrl

    Taro.getImageInfo({ src: imageUrl }).then(res => {
      const { width, height } = res;
      ctx.drawImage(imageUrl, 0, 0, width, height);
      ctx.draw();
      this.getImagePixel(width, height);
    })
    
  }

  getImagePixel = (w: number, h: number) => {
    Taro.canvasGetImageData({
      canvasId: 'canvas',
      x: 0,
      y: 0,
      width: Math.floor(w/2),
      height: Math.floor(h/2),
      success: (res) => {
        const { width, height, data } = res
        const count = width * height;
        const arr = createPixelArray(data, count, 10)
        const colorMap = quantize(arr, 10);
        this.setState({
          palette: colorMap.palette()
        })
        console.log('ssss', colorMap.palette());
        // console.log(arr, result.map(arr[0]), result.palette());
      }
    }, this.$scope)
  }

  handleNavigatorBack = () => {
    Taro.reLaunch({ url: '/pages/index/index' });
  }


  render() {
    return (
      <View>
        识别页面
        <Canvas
          canvasId="canvas"
          style='width: 100%; height: 80vh;'
        />
        <View className="palette">
          { this.state.palette.map(c => <View className="item" style={{'background': `rgb(${c})` }} />) }
        </View>
        <View onClick={this.handleNavigatorBack}>
          返回主页:
        </View>
      </View>
    )
  }
}