const util = require('../../../utils/util.js');
const app = getApp()
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
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var d = {
      pwd: util.md5(val),
    }
    app.postWithToken('spUser/getPrivateKeyByPwd', d)
      .then(res => {
        if (res.code == "0000") {
          wx.hideLoading()
          wx.redirectTo({
            url: '/pages/lookPrivateKey/lookPrivateKey?privateKey=' + res.data,
          })
        } else if (res.code == "1134") {
          that.setData({
            input_value: ""
          })
          wx.hideLoading()
          wx.showToast({
            title: '密码错误,请重试',
            icon: "none"
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '验证失败,请重试',
            icon: "none"
          })
        }
      })
      .catch(errMsg => {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      })
  },
})