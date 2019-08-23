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

  const handleCancel = () => {
    setImage('');

  }

  const handleConfirm = () => {
    Taro.reLaunch({url: '/pages/recognition/index?url=url'})
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
      <View className="camera-control">
        <View className="button-group">
        <View className="cancel" onClick={handleCancel}>Cancel</View>
        <Button
          className="take-photo"
          onClick={handleCamera}
        />
          {url && <View onClick={handleConfirm}>Use Photo</View>}
        </View>
      </View>
    </View>
  )
}
