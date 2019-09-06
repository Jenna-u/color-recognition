import Taro, { Component } from '@tarojs/taro';
import { View, Canvas, Text, MovableArea, MovableView } from '@tarojs/components'
import { AtTag, AtToast } from 'taro-ui'
import { createPixelArray, rgbToHex } from '../../utils/index'
import quantize from 'quantize';
import './index.scss'

export default class Recognition extends Component {

  state = {
    palette: [[246, 74, 135],
    [87, 96, 74],
    [171, 196, 168],
    [39, 32, 30],
    [157, 153, 132],
    // [127, 154, 114],
    // [215, 209, 194],
    // [135, 160, 136],
    // [174, 175, 178],
    // [35, 53, 32]
    ],
    // palette: [],
    currentColor: [],
    isOpened: false,
    msg: '',
    status: '',
    duration: 1000
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
    this.setState({
      status: 'loading',
      msg: '正在加载',
      isOpened: true,
      duration: 0
    })
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
          isOpened: false,
          palette: colorMap.palette(),
          currentColor: colorMap.map(pixelArray[0])
        })
      }
    }, this.$scope)
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

  handleCollection = () => {
    const db = Taro.cloud.database()
    const colors = db.collection('colors')
    db.collection('colors').add({
      data: {
        colors: this.state.palette.map(x => rgbToHex(x))
      }
    }).then(res => {
      this.setState({
        isOpened: true,
        msg: '收藏成功！',
        status: 'success',
        duration: 3000,
      })
      console.log('coo', res);
    })
  }

  render() {
    const { palette, currentColor, isOpened, msg, status } = this.state
    return (
      <View className="recognition-container">
        <View className="color-card">
          <MovableArea style={{ width: '100%', height: '300px', pointerEvents: 'none' }}>
            <Canvas
              canvasId="canvas"
              style='width: 100%; height: 300px; position: absolute, zIndex: 999'
            />
            <MovableView
              className="magnifier"
              direction="all"
              style={{
                width: '30px',
                height: '30px',
                pointerEvents: 'auto',
                backgroundColor: 'rgba(0,0,0,.2)',
                border: '3px solid #fff',
                borderRadius: '50%',
                zIndex: 1000
              }}
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
          {currentColor.length !== 0 && <View className="color-params">
            <View className="color-block" style={{ backgroundColor: `#${rgbToHex(currentColor)}` }} />
            <View className="color-numerical">
              <View className="hex" onClick={() => this.setClipboard(`#${rgbToHex(currentColor)}`)}>HEX: {`#${rgbToHex(currentColor)}`}</View>
              <View className="rgb" onClick={() => this.setClipboard(currentColor.toString())}>RGB: {currentColor.toString()}</View>
            </View>
          </View>}
          <AtTag active size="small" type='primary' circle onClick={this.handleCollection}>收藏</AtTag>
          <AtToast isOpened={isOpened} text={msg} status={status} duration={0} />
        </View>
      </View>
    )
  }
}