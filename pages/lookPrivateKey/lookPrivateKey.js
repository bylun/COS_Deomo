const app = getApp()
Page({
  data: {
    privateKey: null
  },

  onLoad: function(options) {
    var that = this
    that.setData({
      privateKey: options.privateKey
    })
  },

  // 复制私钥
  copy: function() {
    var that = this
    wx.setClipboardData({
      data: that.data.privateKey,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
  },
})