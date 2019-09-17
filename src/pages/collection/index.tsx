import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Image, MovableArea, MovableView } from '@tarojs/components'
import { AtPagination } from 'taro-ui'

import './index.scss'

export default function Collection() {
  const [collectionList, getColorList] = useState([])
  const [openid, setUserInfo] = useState('')

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
      const getColor = data.map(x => ({ colors: x.colors, imgUrl: x.imgUrl }))
      getColorList(getColor);
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
      <View>我的收藏</View>
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
              <View>删除</View>
              </View>
          </View>
        )}
      </View>
      {collectionList.length > 10 && 
        <AtPagination
          icon
          total={50} 
          pageSize={10}
          current={1}
        />
      }
    </View>
  )
}