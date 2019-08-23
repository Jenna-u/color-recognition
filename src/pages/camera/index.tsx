import Taro, { useState } from '@tarojs/taro';
import { View, Camera, Button, Image } from '@tarojs/components'

export default function CameraIndex() {
  const cameraContext = Taro.createCameraContext()

  const [url, setImage] = useState('https://www.baidu.com/img/bd_logo1.png')

  const handleCamera = () => {
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('src', res.tempImagePath);
        setImage(res.tempImagePath);
      },
    })
  }

  const getPixel = () => {
    Taro.canvasGetImageData({
      canvasId: 'myCanvas',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      success: (res) => {
        console.log('src', res);
      },
    })
  }

  console.log('url', url);

  return (
    <View className='camera-index'>
      {
        url ?
        <Image
          style='width: 100%; height: 100vh;'
          src={url}
        /> :
        <Camera
          devicePosition="back"
          flash="off"
          style="width: 100%; height: 100vh;"
        />
      }

      <Button
        className="take-photo"
        onClick={handleCamera}
      />
    </View>
  )
}
