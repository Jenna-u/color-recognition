import Taro, { Component } from '@tarojs/taro';
import { View, Canvas, Text, MovableArea, MovableView } from '@tarojs/components'
import { createPixelArray, rgbToHex } from '../../utils/index'
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
    // [35, 53, 32]
    // ],
    palette: [],
    currentColor: [],
  }
  
  componentDidMount() {
    const ctx = Taro.createCanvasContext('canvas', this.$scope);
    const imageUrl = this.$router.params.imageUrl
    const query = Taro.createSelectorQuery();
    //选择id
    query.select('.color-card').boundingClientRect((rect) => {
      const { width: parentWidth, height: parentHeight } = rect as Taro.clientRectElement
      console.log(parentWidth, 'parentWidth')

      Taro.getImageInfo({ src: imageUrl }).then(res => {
        const { width, height } = res;
        let w = width;
        let h = height;
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
      width: 100,
      height: 100,
    }, this.$scope).then(res => {
      const { width, height, data } = res
        const count = width * height;
        const pixelArray = createPixelArray(data, count, 10)
        const colorMap = quantize(pixelArray, 5);
        console.log('ssss', data, colorMap);
        this.setState({
          palette: colorMap.palette(),
          currentColor: colorMap.map(pixelArray[0])
        })
    })
  }

  handleChange = (c) => {
    this.setState({
      currentColor: c
    })
  }

  setClipboard = (data) => {
    Taro.setClipboardData({
      data: data
    }).then(res => {
      console.log('res', res)
    })
  }

  handleMove = (e) => {
    const { x, y } = e.detail
    Taro.canvasGetImageData({
      canvasId: 'canvas',
      x,
      y,
      width: 1,
      height: 1,
    }).then(res => {
      const { data } = res
      this.setState({
        currentColor: [data[0], data[1], data[2]]
      })
    })
  }

  render() {
    const { palette } = this.state
    return (
      <View className="recognition-container">
        <View className="color-card">
          <MovableArea style={{ width: '100%', height: '300px' }}>
            <Canvas
              canvasId="canvas"
              style='width: 100%; height: 300px;'
            />
            <MovableView
              className="magnifier"
              direction="all"
              onChange={(event) => this.handleMove(event)}
            >+</MovableView>
          </MovableArea>
          <View className="color-output">
            <Text>色卡: </Text>
            {palette.map(c =>
              <View className="item">
                <View className="color-piece" onClick={() => this.handleChange(c)} style={{ 'background': `rgb(${c})` }} />
              </View>
            )}
          </View>
          {this.state.currentColor.length !== 0 && <View className="color-params">
          <View className="color-block" style={{ backgroundColor: `#${rgbToHex(this.state.currentColor)}` }} />
          <View className="color-numerical">
            <View className="hex" onClick={() => this.setClipboard(`#${rgbToHex(this.state.currentColor)}`)}>HEX: {`#${rgbToHex(this.state.currentColor)}`}</View>
            <View className="rgb" onClick={() => this.setClipboard(this.state.currentColor.toString())}>RGB: {this.state.currentColor.toString()}</View>
          </View>
        </View>}
        </View>
      </View>
    )
  }
}