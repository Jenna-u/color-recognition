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
          style="width: 100%; height: 70vh;"
        />
      }
      <CoverView className="camera-control">
        <CoverView className="button-group">
          {imageUrl && <CoverView className="cancel" onClick={handleCancel}>返回</CoverView>}
          <CoverView
            className="take-photo"
            onClick={handleCamera}
          />
          {imageUrl && <CoverView onClick={handleConfirm}>ok</CoverView>}
        </CoverView>
      </CoverView>
    </View>
  )
}
