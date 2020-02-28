const app = getApp()
Page({
  data: {
    account: 0,
    transactionRecords: [],
    pageNum: 0,
    pageSize: 10,
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMoreData: false,
  },

  onLoad: function(options) {
    this.getData()
  },

  // 显示时重新获取余额
  onShow: function() {
    this.setData({
      account: app.globalData.user.account ? app.globalData.user.account : 0
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    if (that.data.isRefreshing || that.data.isLoadingMoreData) {
      return
    }
    that.setData({
      isRefreshing: true,
    })
    var d = {
      pageNum: 1,
      pageSize: that.data.pageSize
    }
    app.postWithToken('spTrade/getTrade', d)
      .then(res => {
        if (res.code == "0000") {
          that.setData({
            pageNum: 1,
            hasMoreData: !res.data.isLastPage,
            isRefreshing: false,
            transactionRecords: res.data.list
          })
        } else {
          that.setData({
            isRefreshing: false,
          })
          wx.showToast({
            title: '获取数据失败,请重试',
            icon: "none"
          })
        }
        wx.stopPullDownRefresh()
      })
      .catch(errMsg => {
        that.setData({
          isRefreshing: false,
        })
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.isRefreshing || that.data.isLoadingMoreData || !that.data.hasMoreData) {
      return
    }
    that.setData({
      isLoadingMoreData: true
    })
    var d = {
      pageNum: that.data.pageNum + 1,
      pageSize: that.data.pageSize
    }
    app.postWithToken('spTrade/getTrade', d)
      .then(res => {
        console.log(res.data)
        if (res.code == "0000") {
          that.setData({
            pageNum: that.data.pageNum + 1,
            hasMoreData: !res.data.isLastPage,
            isLoadingMoreData: false,
            transactionRecords: that.data.transactionRecords.concat(res.data.list)
          })
        } else {
          that.setData({
            isLoadingMoreData: false,
          })
          wx.showToast({
            title: '获取数据失败,请重试',
            icon: "none"
          })
        }
      })
      .catch(errMsg => {
        console.log(errMsg)
        that.setData({
          isLoadingMoreData: false,
        })
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      })
  },

  // 获取数据
  getData: function(pageNum, pageSize) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var d = {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize
    }
    app.postWithToken('spTrade/getTrade', d)
      .then(res => {
        if (res.code == "0000") {
          that.setData({
            pageNum: that.data.pageNum + 1,
            hasMoreData: !res.data.isLastPage,
            transactionRecords: res.data.list
          })
        } else {
          wx.showToast({
            title: '获取数据失败,请重试',
            icon: "none"
          })
        }
        wx.hideLoading()
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