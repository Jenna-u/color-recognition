import Taro, { Component, Config } from '@tarojs/taro';
import { View, Canvas, Text, MovableArea, MovableView, Image, CoverView  } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import { createPixelArray, rgbToHex, showToast } from '../../utils/index'
import quantize from 'quantize';
import './index.scss'

export default class Recognition extends Component {

  config: Config = {
    navigationBarTitleText: '识色'
  }

  state = {
    palette: [],
    currentColor: [],
    canvasW: '100%',
    canvasH: '80vh'
  }
  
   componentDidMount() {
    const ctx = Taro.createCanvasContext('canvas', this.$scope);
    console.log('ctx', ctx)
    const imageUrl = this.$router.params.imageUrl
    const query = Taro.createSelectorQuery();
    //选择id
     query.select('.color-card').boundingClientRect((rect) => {
       const { width: parentWidth, height: parentHeight } = rect as Taro.clientRectElement
       console.log('ssss', parentHeight, parentWidth);
       Taro.getImageInfo({ src: imageUrl }).then(res => {
         const { width, height, path } = res;
        let w = width;
        let h = height;

        if (width > height) {
          w = parentWidth
          h = Math.floor(height / width * parentWidth)
        } else {
          h = parentHeight
          w = Math.floor(width / height * parentHeight)
        }

        this.setState({
          canvasH: h + 'px'
        })

        ctx.drawImage(path, 0, 0, width, height, 0, 0, w, h);
        ctx.draw(false, () => this.getImagePixel(width, height));
      })
    }).exec();    
  }

  getImagePixel = async (w: number, h: number) => {
    console.log('getImagePixel', w, h)
    showToast({
      title: '正在识别中...',
      icon: 'loading',
      mask: true,
      duration: 0
    })

    await Taro.canvasGetImageData({
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
        console.log('ssss', data, pixelArray);
        this.setState({
          isOpened: false,
          palette: colorMap.palette(),
          currentColor: colorMap.map(pixelArray[0])
        }, () => {
          showToast({
            title: '识别成功!',
            icon: 'success',
            mask: true,
            duration: 1000
          })
        })
      }
    }, this.$scope)
  }

  handleChange = (c) => {
    console.log('cccc', c)
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
      showToast({
        title: '收藏成功！',
        icon: 'success',
        mask: true,
        duration: 1000,
        success: (res) => {
          Taro.reLaunch({url: '/pages/collection/index'})
        }
      })
    })
  }

  handleMove = (e) => {
    const { x, y } = e.detail
    Taro.canvasGetImageData({
      canvasId: 'canvas',
      x,
      y,
      width: 10,
      height: 10,
    }).then(res => {
      const { data } = res
      this.setState({
        currentColor: [data[0], data[1], data[2]]
      })
    })
  }

  render() {
    const { palette, currentColor, canvasW, canvasH } = this.state
    return (
      <View className="recognition-container">
        <View className="color-card">
          <MovableArea style={{ width: canvasW, height: canvasH }}>
            <Canvas
                canvasId="canvas"
                style={{ width: canvasW, height: canvasH }}
            />
          {/* <Image src={this.$router.params.imageUrl} /> */}
            <MovableView
              className="magnifier"
              direction="all"
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: 'rgba(0,0,0,1)',
                border: '3px solid red',
                borderRadius: '50%',
                zIndex: 99999,
                zoom: 1
              }}
              onChange={(event) => this.handleMove(event)}
            >+</MovableView>
          </MovableArea>
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