import Taro, { useState } from '@tarojs/taro';
import { View, Camera } from '@tarojs/components'

const cameraContext = Taro.createCameraContext()

export default function CameraIndex() {
  const handleCamera = () => {
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('src', res.tempImagePath);
      }
    })
  }

  return (
    <View>
      <Camera
        devicePosition="back"
        flash="off"
        style="width: 100%; height: 500px;"
      />
    </View>
  )
}
