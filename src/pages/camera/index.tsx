import Taro, { useState } from '@tarojs/taro';
import { View, Text, Camera } from '@tarojs/components'

const cameraContext = Taro.createCameraContext()

export default function CameraIndex() {

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
