import Taro, { Component, Config, arrayBuffer } from '@tarojs/taro'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { View, Canvas, Text, CoverView, CoverImage  } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import { createPixelArray, rgbToHex, showToast } from '../../utils/index'
import quantize from 'quantize';
import './index.scss'

export default interface State {
  palette: any[],
  currentColor: any[],
  canvasW: string,
  canvasH: string,
  pWidth: number,
  pHeight: number,
  pageX: number,
  pageY: number,
  isDragging: boolean,
  isInit: boolean
}

export default class Recognition extends Component<any, State> {

  config: Config = {
    navigationBarTitleText: '识色'
  }

  constructor() {
    super();
    this.state = {
      palette: [],
      currentColor: [],
      canvasW: '100%',
      canvasH: '80vh',
      pWidth: 0,
      pHeight: 0,
      pageX: 0,
      pageY: 0,
      isDragging: false,
      isInit: true
    }

    this.handleMove = this.handleMove.bind(this)
  }
  
  componentDidMount() {
    const ctx = Taro.createCanvasContext('canvas', this.$scope);
    const imageUrl = this.$router.params.imageUrl
    const query = Taro.createSelectorQuery();
    //选择id
     query.select('.color-card').boundingClientRect((rect) => {
       const { width: parentWidth, height: parentHeight } = rect as Taro.clientRectElement
      //  console.log('ssss', parentHeight, parentWidth);
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
          canvasH: h + 'px',
          pWidth: parentWidth,
          pHeight: parentHeight
        })

        ctx.drawImage(path, 0, 0, width, height, 0, 0, w, h);
        ctx.draw(false, () => this.getImagePixel(width, height));
      })
     }).exec();
  }

  getImagePixel = async (w: number, h: number) => {
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
        // console.log('ssss', data, pixelArray);
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
        // imgUrl: this.$router.params.imageUrl,
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

  handleStart = (e) => {
    // console.log('start', e)
    const { pageX, pageY } = get(e.changedTouches, '0', [])
    this.setState({
      pageX,
      pageY,
      isDragging: true
    })
  }

  handleMove = async(e) => {
    if (!this.state.currentColor.length) return
    const { pageX, pageY } = get(e.changedTouches, '0', [])
    // const { offsetLeft, offsetTop } = e.currentTarget
    console.log('move',e, pageX, pageY);

    await this.setState({
      pageX,
      pageY,
      isDragging: true,
      isInit: false
    }, async() => {
      await Taro.canvasGetImageData({
        canvasId: 'canvas',
        x: pageX,
        y: pageY,
        width: 1,
        height: 1,
      }).then(res => {
        const { data } = res
        this.setState({
          currentColor: [data[0], data[1], data[2]]
        })
      }) 
    })
  }

  handleEnd = (e) => {
    console.log('end', e)
    const { pageX, pageY } = get(e.changedTouches, '0', [])
    setTimeout(() => {
      this.setState({
        pageX,
        pageY,
        isDragging: false
      })
    }, 200)

  }

  render() {
    const { palette, currentColor, pWidth, canvasW, canvasH, pageX, pageY, isDragging, isInit } = this.state

    return (
      <View className="recognition-container">
        <View className="color-card">
          <Canvas
            canvasId="canvas"
            style={{ width: canvasW, height: canvasH }}
            disableScroll
            onTouchStart={e => this.handleStart(e)}
            // onTouchMove={this.handleMove}
            // onTouchEnd={e => this.handleEnd(e)}
          >
            {currentColor.length &&
              <CoverView
                className="move-container"
                style={{
                  height: canvasH,
                  transform: `scale(${isDragging ? 1.5 : 1})`,
                  transformOrigin: `${pageX}px ${pageY}px`,
                }}
                onTouchStart={e => this.handleStart(e)}
                onTouchMove={this.handleMove}
                onTouchEnd={e => this.handleEnd(e)}
            >
              <CoverView className="move-dot"
                // onTouchStart={e => this.handleStart(e)}
                // onTouchMove={this.handleMove}
                // onTouchEnd={e => this.handleEnd(e)}
                style={{
                  left: `${pageX}px`,
                  top: `${pageY}px`,
                  transformOrigin: `${pageX}px ${pageY}px`,
                  backgroundColor: `#${rgbToHex(currentColor)}`
                }}
              >
                <CoverImage
                  className="picture"
                  src={this.$router.params.imageUrl}
                  style={{
                    width: pWidth + 'px',
                    height: canvasH,
                    left: isInit ? '25px' : `${pageX * -1}px`,
                    top: isInit ? '25px' : `${pageY * -1}px`
                  }}
                />
              </CoverView>
            </CoverView>
            }
          </Canvas>
          {palette.length > 0 &&
            <View  style="height: 200px;">
              <View className="collection">
                <AtTag active size="small" type='primary' circle onClick={this.handleCollection}>收藏</AtTag>
              </View>
              <View className="color-output">
                <Text>色卡: </Text>
                {palette.map(c =>
                  <View
                    className={isEqual(currentColor, c) ? 'color-piece active' : 'color-piece'}
                    onClick={() => this.handleChange(c)}
                    style={{ 'background': `rgb(${c})` }}
                  />
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