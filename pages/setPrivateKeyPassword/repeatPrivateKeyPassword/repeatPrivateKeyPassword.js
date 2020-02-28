const util = require('../../../utils/util.js');
const app = getApp()
Page({
  data: {
    inputData: {
      input_value: "", //输入框的初始内容
      value_length: 0, //输入框密码位数
      isNext: true, //是否有下一步的按钮
      get_focus: true, //输入框的聚焦状态
      focus_class: true, //输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6], //输入框格子数
      height: "98rpx", //输入框高度
      width: "604rpx", //输入框宽度
      see: false, //是否明文展示
      interval: true, //是否显示间隔格子
    },
    flag: false,
    privateKeyPassword: null,
  },

  onLoad: function(options) {
    var that = this
    that.setData({
      privateKeyPassword: options.privateKeyPassword
    })
  },

  // 当组件输入数字6位数时的自定义函数
  valueSix: function(data) {
    var that = this
    var val = data.detail
    if (val == that.data.privateKeyPassword) {
      that.setData({
        flag: true
      })
    } else {
      const component = this.selectComponent('#component-id');
      component.reset();
      wx.showToast({
        title: '两次密码不一致，请重试',
        icon: 'none'
      })
    }

  },

  // 密码提交确认
  submit: function() {
    var that = this
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    var d = {
      privateKeyPayPwd: util.md5(that.data.privateKeyPassword),
    }
    app.postWithToken('spUser/setPrivateKeyPayPwd', d)
      .then(res => {
        if (res.code == "0000") {
          wx.showToast({
            title: '设置成功',
            icon: 'none'
          })
          wx.setStorageSync('setPrivateKeyPwdFlag', true)
          app.globalData.setPrivateKeyPwdFlag = true
          wx.navigateBack({
            delta: 2
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '设置失败,请重试',
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
  }
})