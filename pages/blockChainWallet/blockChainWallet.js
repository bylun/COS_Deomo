const app = getApp()
Page({
  data: {
    avatarUrl: null,
    address: null,
    realAddress: null,
    account: 0,
  },

  onLoad: function(options) {

  },

  // 显示时重新获取用户数据
  onShow: function(options) {
    var str = app.globalData.user.address
    this.setData({
      avatarUrl: app.globalData.user.headImg,
      realAddress: str,
      address: str.slice(0, 8) + '******' + str.slice(-11),
      account: app.globalData.user.account ? app.globalData.user.account : 0
    })
  },

  // 复制账号地址
  copy: function() {
    var that = this
    wx.setClipboardData({
      data: that.data.realAddress,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },

  // 查看私钥密码
  lookPrivateKey: function() {
    var that = this
    wx.showLoading({
      title:"加载中",
      mask: true
    })
    app.postWithToken('spUser/getPrivateKeyPayPwd', {})
      .then(res => {
        wx.hideLoading()
        if (res.data.flag) {
          wx.navigateTo({
            url: '/pages/lookPrivateKey/validatePassword/validatePassword',
          })
        } else {
          wx.navigateTo({
            url: '/pages/setPrivateKeyPassword/setPrivateKeyPassword',
          })
        }
      })
      .catch(errMsg => {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常,请重试',
          icon: "none"
        })
      })
  }
})