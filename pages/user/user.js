const app = getApp()
Page({
  data: {
    user: null,
    hasLogined: false,
    version: null
  },

  onLoad: function(options) {
    const that = this
    if (app.globalData.user) {
      that.setData({
        user: app.globalData.user,
        hasLogined: true,
      })
    } else {
      var user = wx.getStorageSync('user')
      if (user) {
        that.setData({
          user: user,
          hasLogined: true,
        })
        app.globalData.user = user
      }
    }
    that.setData({
      version: app.globalData.version
    })
  },

  onShow: function() {
    if (app.globalData.user) {
      this.setData({
        user: app.globalData.user,
        hasLogined: true,
      })
    }
  },

  // 跳转到钱包
  blockChainWallet: function() {
    var that = this
    if (that.data.hasLogined) {
      wx.navigateTo({
        url: '/pages/blockChainWallet/blockChainWallet',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 跳转到个人资料
  userInfo: function() {
    var that = this
    if (that.data.hasLogined) {
      wx.navigateTo({
        url: '/pages/userInfo/userInfo',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },

  // 跳转到设置
  setting: function() {
    var that = this
    if (that.data.hasLogined) {
      wx.navigateTo({
        url: '/pages/setting/setting',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
})