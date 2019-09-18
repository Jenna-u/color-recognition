import Taro, { Component, Config } from '@tarojs/taro';
import { View, Canvas, Text, CoverImage } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import { createPixelArray, rgbToHex } from '../../utils/index'
import quantize from 'quantize';
import './index.scss'

export default class Recognition extends Component {

  config: Config = {
    navigationBarTitleText: '识色'
  }

  state = {
    palette: [],
    currentColor: [],
    isOpened: false,
    msg: '',
    status: '',
    duration: 3000
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
        console.log('width', width, 'height', height)
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
    // this.setState({
    //   status: 'loading',
    //   msg: '正在识别',
    //   isOpened: true,
    //   duration: 0
    // })

    Taro.showToast({
      title: '正在识别中...',
      icon: 'loading',
      mask: true,
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
        console.log('ssss', data, colorMap.map(pixelArray[0]));
        this.setState({
          isOpened: false,
          palette: colorMap.palette(),
          currentColor: colorMap.map(pixelArray[0])
        })

        Taro.hideToast()
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

  handleCollection = () => {
    const db = Taro.cloud.database()
    db.collection('colors').add({
      data: {
        imgUrl: this.$router.params.imageUrl,
        colors: this.state.palette.map(x => rgbToHex(x))
      }
    }).then(res => {
      Taro.showToast({
        title: '收藏成功！',
        icon: 'success',
        mask: true,
        duration: 1000,
      })
      console.log('coo', res);
    })
  }

  render() {
    const { palette, currentColor } = this.state
    return (
      <View className="recognition-container">
        <View className="color-card">
          <Canvas
            canvasId="canvas"
            style='width: 100%; height: 300px;'
          >
            <CoverImage src={this.$router.params.imageUrl} />
          </Canvas>
          {palette.length > 0 &&
            <View  style="height: 200px;">
              <View className="collection">
                <AtTag active size="small" type='primary' circle onClick={this.handleCollection}>收藏</AtTag>
              </View>
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
            </View>
            }
        </View>
      </View>
    )
  }
}