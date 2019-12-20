import Taro, { useState } from '@tarojs/taro';
import { View, Camera, Image, CoverView } from '@tarojs/components'

export default function CameraIndex() {
  const cameraContext = Taro.createCameraContext()

  const [imageUrl, setImage] = useState('https://code.smartstudy.com/uploads/-/system/user/avatar/17/avatar.jpg?width=90')

  // const [imageUrl, setImage] = useState('')
  const handleCamera = () => {
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
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
          style='width: 100%; height: 100vh;'
          src={imageUrl}
        >
          <CoverView className="camera-control">
            <CoverView className="has-image">
              {imageUrl && <CoverView className="cancel" aria-role="button" onClick={handleCancel}>重拍</CoverView>}
              {imageUrl && <CoverView className="use-photo" aria-role="button" onClick={handleConfirm}>使用照片</CoverView>}
            </CoverView>
          </CoverView>
        </Image> :
        <Camera
          devicePosition="back"
          flash="off"
          style="width: 100%; height: 100vh;"
        >
          <CoverView className="camera-control">
            <CoverView className="button-group">
              <CoverView
                className="take-photo"
                aria-role="button"
                onClick={handleCamera}
              />
            </CoverView>
          </CoverView>
        </Camera>
      }
    </View>
  )
}
