Page({

  data: {

  },

  onLoad: function(options) {

  },

  // 积分转通贝
  integral2Tongbei: function() {
    wx.showModal({
      title: '',
      content: '暂未开通，敬请期待~',
      showCancel: false,
      success: function (res) {
      }
    })
  },

  // 通贝转积分
  tongbei2Integral: function() {
    wx.showModal({
      title: '',
      content: '暂未开通，敬请期待~',
      showCancel: false,
      success: function (res) {
      }
    })
  },
})