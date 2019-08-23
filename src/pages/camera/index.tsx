import Taro, { useState } from '@tarojs/taro';
import { View, Camera, Button, Image } from '@tarojs/components'

export default function CameraIndex() {
  const cameraContext = Taro.createCameraContext()

  const [imageUrl, setImage] = useState('')

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
    Taro.reLaunch({url: `/pages/recognition/index?imageUrl=${imageUrl}`})
  }

  console.log('url', imageUrl);

  return (
    <View className='camera-index'>
      {
        imageUrl ?
        <Image
          style='width: 100%; height: 100vh;'
          src={imageUrl}
        /> :
        <Camera
          devicePosition="back"
          flash="off"
          style="width: 100%; height: 100vh;"
        />
      }
      <View className="camera-control">
        <View className="button-group">
          {imageUrl && <View className="cancel" onClick={handleCancel}>Cancel</View>}
        <Button
          className="take-photo"
          onClick={handleCamera}
        />
          {imageUrl && <View onClick={handleConfirm}>Use Photo</View>}
        </View>
      </View>
    </View>
  )
}
