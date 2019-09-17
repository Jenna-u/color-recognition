import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Image, MovableArea, MovableView } from '@tarojs/components'
import { AtToast } from 'taro-ui'

import './index.scss'

export default function Collection() {

  Collection.config = {
    navigationBarTitleText: '我的收藏'
  }

  const [collectionList, getColorList] = useState([])
  const [openid, setUserInfo] = useState('')
  const [toast, setToast] = useState({isOpened: false, msg: '', status: ''})

  const setClipboard = (data) => {
    Taro.setClipboardData({
      data: data.toString()
    }).then(res => {
      console.log('res', res)
    })
  }

  const getUserInfo = () => {
    Taro.cloud.callFunction({
      name: 'colors',
      complete: res => {
        setUserInfo(res.result.openid)
      }
    })
  }

  const fetchColors = () => {
    const db = Taro.cloud.database();
    db.collection('colors').where({
      _openid: openid
    }).get().then(res => {
      const { data } = res
      const getColor = data.map(x => ({ id: x._id, colors: x.colors, imgUrl: x.imgUrl }))
      getColorList(getColor);
    })
  }

  const handleRemove = (id) => {
    const db = Taro.cloud.database()
    db.collection('colors').doc(id).remove({
      success: (res) => {
        setToast({
          isOpened: true,
          msg: '数据删除成功！',
          status: 'success'
        })
        fetchColors()
      }
    })
  }

  const handleMove = (e) => {
    const { x, y } = e.detail
    Taro.canvasGetImageData({
      canvasId: 'canvas',
      x,
      y,
      width: 10,
      height: 10,
    }).then(res => {
      const { data } = res
      this.setState({
        currentColor: [data[0], data[1], data[2]]
      })
    })
  }
 
  useEffect(() => {
    getUserInfo()
    fetchColors()
  }, [])

  console.log('ccc', collectionList);

  return (
    <View className="collection-container">
      {/* <View className="my-collection">我的收藏</View> */}
      <View className="list-container">
        {collectionList.map(x =>
          <View className="collection-card">
            {/* <MovableArea style={{ width: '100%', height: '200px', pointerEvents: 'none' }}> */}
            <Image mode="aspectFill" style="display: block; width: 100%; height: 200px" src={x.imgUrl} />
            {/* <MovableView
              className="magnifier"
              direction="all"
              style={{
                width: '30px',
                height: '30px',
                pointerEvents: 'auto',
                backgroundColor: 'rgba(0,0,0,.2)',
                border: '3px solid #fff',
                borderRadius: '50%',
              }}
              onChange={(event) => handleMove(event)}
            >+</MovableView>
          </MovableArea> */}
            <View className="colors-list">
              {x.colors.map(c => <View className="item" style={{ backgroundColor: `#${c}` }} />)}
            </View>
            <View className="operator">
              <View onClick={() => setClipboard(x)}>复制</View> |
              <View>导出</View> |
              <View onClick={() => handleRemove(x.id)}>删除</View>
              </View>
          </View>
        )}
      </View>
      <AtToast isOpened={toast.isOpened} text={toast.msg} status={toast.status} duration={1000} />
    </View>
  )
}