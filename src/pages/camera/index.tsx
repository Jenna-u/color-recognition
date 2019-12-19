import Taro, { useState } from '@tarojs/taro';
import { View, Camera, Button, Image, CoverView } from '@tarojs/components'

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

  return (
    <View className='camera-index'>
      {
        imageUrl ?
        <Image
          style='width: 100%; height: 80vh;'
          src={imageUrl}
        /> :
        <Camera
          devicePosition="back"
          flash="off"
          style="width: 100%; height: 80vh;"
        />
      }
      <View className="camera-control">
        <View className="button-group">
          {imageUrl && <View className="cancel" onClick={handleCancel}>返回</View>}
          <View
            className="take-photo"
            onClick={handleCamera}
          />
          {imageUrl && <View onClick={handleConfirm}>ok</View>}
        </View>
      </View>
    </View>
  )
}
