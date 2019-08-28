import Taro, { Component } from '@tarojs/taro';
import { View, Canvas } from '@tarojs/components'
import { createPixelArray } from '../../utils/index'
import quantize from 'quantize';

console.log('out', quantize);

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
  }
  
  componentDidMount() {
    const ctx = Taro.createCanvasContext('canvas', this.$scope);
    const imageUrl = this.$router.params.imageUrl
    const query = Taro.createSelectorQuery();
    //选择id
    query.select('.color-card').boundingClientRect((rect) => {
      const { width: parentWidth, height: parentHeight } = rect as Taro.clientRectElement
      console.log(parentWidth, 'parentWidth')
      // console.log(rect.width)
      Taro.getImageInfo({ src: imageUrl }).then(res => {
        const { width, height } = res;
        let w = width;
        let h = height;
        console.log('width', width, height)
        if (width > height) {
          w = parentWidth
          h = height / width * parentWidth
        } else {
          h = parentHeight
          w = width / height * parentHeight
        }
        ctx.drawImage(imageUrl, 0, 0, width, height, 0, 0, w, h);
        ctx.draw();
        this.getImagePixel(width, height);
      })
    }).exec();

    
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
        console.log('ssss', data, colorMap);
        this.setState({
          palette: colorMap.palette()
        })
        // console.log(arr, result.map(arr[0]), result.palette());
      }
    }, this.$scope)
  }

  render() {
    const { palette } = this.state
    return (
      <View className="color-card">
        <Canvas
          canvasId="canvas"
          style='width: 100%; height: 500px;'
        />
        <View className="color-output">
          { palette.map(c => <View className="item" style={{'background': `rgb(${c})` }} />) }
        </View>
      </View>
    )
  }
}