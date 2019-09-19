import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Image, MovableArea, MovableView } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { showToast, hideToast } from '../../utils/index'
import './index.scss'

export default function Collection() {

  Collection.config = {
    navigationBarTitleText: '我的收藏'
  }

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
    showToast({
      title: '数据加载中...',
      mask: true,
      icon: 'loading',
      duration: 0
    })
  
    const db = Taro.cloud.database();
    db.collection('colors').where({
      _openid: openid
    }).get().then(res => {
      hideToast();
      const { data } = res
      const getColor = data.map(x => ({ id: x._id, colors: x.colors, imgUrl: x.imgUrl })).reverse()
      getColorList(getColor);
    })
  }

  const handleRemove = (id) => {
    const db = Taro.cloud.database()
    db.collection('colors').doc(id).remove({
      success: (res) => {
        showToast({
          title: '删除成功！',
          icon: 'success',
          mask: true,
          duration: 1000,
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

  return (
    <View className="collection-container">
      <View className="list-container">
        {collectionList.length ? collectionList.map((x, index) =>
          <View className="collection-card">
            {/* <MovableArea style={{ width: '100%', height: '200px', pointerEvents: 'none' }}> */}
            <Image mode="aspectFill" style="display: block; width: 100%; height: 260px" src={x.imgUrl} />
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
              <View onClick={() => setClipboard(x.colors)}>复制</View> |
              {/* <View>导出</View> | */}
              <View onClick={() => handleRemove(x.id)}>删除</View>
              </View>
          </View>
        ) : <View className="empty">
              <AtIcon className="empty-icon" value='icon icon-ku' size='80' />
              <View>暂时没有数据，快去收藏吧~</View>
            </View>}
      </View>
    </View>
  )
}