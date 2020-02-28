const app=getApp()
Page({
  data: {
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: false, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
      height: "98rpx", //输入框高度
      width: "604rpx", //输入框宽度
      see: false, //是否明文展示
      interval: true, //是否显示间隔格子
    }
  },

  onLoad: function(options) {
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix: function(data) {
    var that = this
    var val = data.detail
    let reg = /^(\d)\1{5}$/; // 不重复6位 
    let str = '0123456789_9876543210'; // str.indexOf(value) > -1 不连续判断 
    if (reg.test(val)) {
      wx.showToast({
        title: '密码不能为重复数字，请重试',
        icon: 'none'
      })
    } else if (str.indexOf(val) > -1) {
      wx.showToast({
        title: '密码不能为连续数字，请重试',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/setPrivateKeyPassword/repeatPrivateKeyPassword/repeatPrivateKeyPassword?privateKeyPassword=' + val,
      })
    }
  },
})