import Taro, { Component } from '@tarojs/taro';
import { View, Button, Canvas } from '@tarojs/components'
import { IncomingMessage } from 'http';



export default class Recognition extends Component {
  
  componentDidMount() {
    const ctx = Taro.createCanvasContext('canvas', this);
    const imageUrl = this.$router.params.imageUrl
    Taro.getImageInfo({ src: imageUrl }).then(res => {
      ctx.drawImage(imageUrl, 0, 0, res.width, res.height);
      ctx.draw();
      this.getImagePixel();
    })
  }

  getImagePixel = () => {
    Taro.canvasGetImageData({
      canvasId: 'canvas',
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
    }).then(res => {
      const count = res.width * res.height;
      const arr = this.setPixel(res.data, count, 10)
      console.log('rgb',res, arr)
    })
  }

  setPixel = (imgData: any, pixelCount: number, quality: number) => {
    const pixels = imgData;
    const pixelArray = [];

    for (let i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
        offset = i * 4;
        r = pixels[offset + 0];
        g = pixels[offset + 1];
        b = pixels[offset + 2];
        a = pixels[offset + 3];

        // If pixel is mostly opaque and not white
        if (typeof a === 'undefined' || a >= 125) {
            if (!(r > 250 && g > 250 && b > 250)) {
                pixelArray.push([r, g, b]);
            }
        }
    }
    return pixelArray;
  }


  render() {
    return (
      <View>
        识别页面
        <Canvas
          ref="cvs"
          canvasId="canvas"
          style='width: 100%; height: 80vh;'
        />
        <View>
          主色:
        </View>
      </View>
    )
  }
}