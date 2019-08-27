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
    palette: [],
    width: 'auto',
    height: 'auto'
  }
  
  componentDidMount() {
    const imageUrl = this.$router.params.imageUrl

    Taro.getImageInfo({ src: imageUrl }).then(res => {
      const { width, height } = res;
      this.setState({ width: width + 'px', height: height + 'px' });

      const ctx = Taro.createCanvasContext('canvas', this.$scope);
      ctx.drawImage(imageUrl, 0, 0);
      ctx.draw();
      this.getImagePixel(width, height);
    })
    
  }

  setImagetoCanvas = (data, width, height) => {
    Taro.canvasPutImageData({
      canvasId: 'canvasOut',
      data,
      x: 0,
      y: 0,
      width,
      height,
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log('fail', res)
      }
    }, this.$scope)
  }

  getImagePixel = (w: number, h: number) => {
    Taro.canvasGetImageData({
      canvasId: 'canvas',
      x: 0,
      y: 0,
      width: w,
      height: h,
      success: (res) => {
        const { width, height, data } = res
        const count = width * height;
        const pixelArray = createPixelArray(data, count, 10)
        const colorMap = quantize(pixelArray, 5);
        console.log('quantize', data, pixelArray, colorMap);
        this.setState({
          palette: colorMap.palette()
        })
      },
      fail: (res) => {
        console.log('info', res);
      }
    }, this.$scope)
  }

  handleNavigatorBack = () => {
    Taro.reLaunch({ url: '/pages/index/index' });
  }


  render() {
    const { width, height, palette } = this.state
    return (
      <View className="color-card">
        <Canvas
          canvasId="canvas"
          style={{'width': width, height: height}}
        />
        <View className="color-output">
          { palette.map(c => <View className="item" style={{'background': `rgb(${c})` }} />) }
        </View>
      </View>
    )
  }
}