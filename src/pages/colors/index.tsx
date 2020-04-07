import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { showToast, hideToast } from '../../utils/index'

import './index.scss'

export default function Colors() {

  Colors.config = {
    navigationBarTitleText: '中国色',
  }

  const navigate = [{
    name: '全部',
    hex: '#333'
    // hex: '#6B400D'
  }, {
    CMYK: [0, 28, 25, 0],
    RGB: [247, 205, 188],
    hex: "#f04b22",
    // name: "润红",
    name: '红',
    pinyin: "runhong"
  }, {
    CMYK: [0, 45, 92, 0],
    RGB: [251, 164, 20],
    hex: "#fba414",
    // name: "淡橘橙",
    name: "橙",
    pinyin: "danjucheng"
  }, {
    CMYK: [3, 8, 30, 0],
    RGB: [249, 236, 195],
    hex: "#fcd337",
    // name: "杏仁黄",
    name: '黄',
    pinyin: "xingrenhuang"
  }, {
    CMYK: [17, 29, 100, 4],
    RGB: [210, 177, 22],
    hex: "#229453",
    // name: "新禾绿",
    name: "绿",
    pinyin: "xinhelv"
  }, {
    CMYK: [35, 44, 80, 30],
    RGB: [135, 114, 62],
    hex: "#22a2c3",
    // name: "鲛青",
    name: '青',
    pinyin: "jiaoqing"
  }, {
    CMYK: [39, 31, 17, 2],
    RGB: [167, 168, 189],
    hex: "#2775b6",
    // name: "淡蓝紫",
    name: '蓝',
    pinyin: 'danlanzi'
  }, {
    CMYK: [36, 81, 64, 54],
    RGB: [93, 49, 49],
    hex: "#813c85",
    // name: "貂紫",
    name: "紫",
    pinyin: "diaozi"
  }, {
    CMYK: [4, 5, 18, 0],
    RGB: [249, 244, 220],
    hex: "#f9f4dc",
    // name: "乳白",
    name: "白",
    pinyin: "rubai"
  }]

  const color = [{CMYK: [0, 28, 25, 0], RGB: [247, 205, 188], hex: "#f7cdbc", name: "润红", pinyin: "runhong"}]
  const [chinaColors, getChinaColor] = useState([])
  const [currentColor, setBg] = useState(color[0])
  const [currentNav, setNav] = useState('红')

  const getChinaColorData = async () => {
    showToast({
      title: '数据加载中...',
      mask: true,
      icon: 'loading',
      duration: 0
    })

    await Taro.cloud.callFunction({
      name: 'getChinaColors',
      complete: res => {
        const { result: { data } } = res
        hideToast()
        getChinaColor(data);
      }
    })
  }

  const handleChange = (name) => {
    setNav(name)
    const currentColor = name === '全部' ? chinaColors : chinaColors.filter(x => x.name.includes(name))
    setBg(currentColor[0])
  }

  useEffect(() => {
    getChinaColorData()
    Taro.showShareMenu({
      withShareTicket: true
    })
  }, [])

  const data = currentNav === '全部' ? chinaColors : chinaColors.filter(x => x.name.includes(currentNav))

  return (
    <View
    className="colors-container"
  >
    <View className="navigate">
      {navigate.map(x =>
        <View
          className={x.name === currentNav ? 'navigate-item act' : "navigate-item"}
          style={{ backgroundColor: `${x.hex}` }}
          onClick={() => handleChange(x.name)}
        >
          {x.name}
        </View>)
      }
    </View> 
    <ScrollView
      scrollY
      className="color-picker"
      upperThreshold={10}
      scrollWithAnimation
    >
      <View className="colors-list">
        {data.map(c =>
          <View
            className={ currentColor.hex === c.hex ? 'colors-item active' : 'colors-item' }
            style={{ backgroundColor: `${c.hex}` }}
            onClick={() => setBg(c)}
          />
        )}
      </View>
    </ScrollView>
    <View className="colors-info" style={{ backgroundColor: `${currentColor.hex}` }}>
      <View style="font-size: 24px;">{currentColor.name}</View>
      <View style="margin-bottom: 12px;">{currentColor.pinyin}</View>
      <View>HEX: {currentColor.hex}</View>
      <View>CMYK: {currentColor.CMYK.toString()}</View>
      <View>RGB: {currentColor.RGB.toString()}</View>
    </View>
  </View>
  );
}