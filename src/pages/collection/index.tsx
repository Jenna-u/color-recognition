import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Image, MovableArea, MovableView, Button, OpenData } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { showToast, hideToast } from '../../utils/index'
import './index.scss'

export default function Collection() {

  // Collection.config = {
  //   navigationBarTitleText: '我的收藏'
  // }

  const [collectionList, getColorList] = useState([])
  const [userInfo, setUserInfo] = useState({})

  const setClipboard = (data) => {
    Taro.setClipboardData({
      data: data.toString()
    }).then(res => {
      console.log('res', res)
    })
  }

  const getUserInfoData = () => {
    console.log('enter')
    Taro.getSetting({
      success: (res) => {
        const { authSetting } = res
        console.log('authSetting', res)
        // if (!authSetting['scope.userInfo']) {
          Taro.getUserInfo({
            withCredentials: false,
            success: res => {
              console.log('res', res)
              setUserInfo(res.userInfo)
            }
          })
        // }
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
    db.collection('colors').get().then(res => {
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
    getUserInfoData()
    fetchColors()
  }, [])

  console.log('userInfo', userInfo)

  return (
    <View className="collection-container">
      <View className="user-info">
        {userInfo.nickName ?
          <View className="avatar-page">
            <View><Image src={userInfo.avatarUrl} alt="头像" /></View>
            <View className="nickName">{userInfo.nickName}</View>
            <View>已收藏<Text className="length">{collectionList.length}</Text>组色卡</View>
          </View> :
          <Button
            className="authorize"
            openType="getUserInfo"
            lang="zh_CN"
            type='primary'
            onGetUserInfo={getUserInfoData}
          >
            点击授权
          </Button>
        }
      </View>
      <View className="list-container">
        {collectionList.length ? collectionList.map((x, index) =>
          <View className="collection-card">
            <View className="colors-list">
              {x.colors.map(c => <View className="item" style={{ backgroundColor: `#${c}` }}></View>)}
            </View>
            <View className="patch-list">
              {x.colors.map(c => <View className="patch" style={{ color: `#${c}` }}>{`#${c}`}</View>)}
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