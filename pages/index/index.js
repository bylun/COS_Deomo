const app = getApp()
Page({
  data: {
    blockNumber: 0,
    transactionNumber: 0,
    tongBei: 0,
    hasLogined: false,
    interval: null
  },

  onLoad: function() {
    var that = this
    if (app.globalData.user) {
      that.setData({
        hasLogined: true,
      })
    }
  },

  onShow: function() {
    var that = this
    if (app.globalData.user) {
      that.setData({
        hasLogined: true,
      })
    }
    clearInterval(that.data.interval)
    that.get("https://www.fidesum.com/fisco-bcos-browser/home/blockChainInfo?groupId=1", {}).then(res1 => {
      if (res1.message == "success") {
        that.post("https://www.fidesum.com/park/home/getBlanceAndCarSum.json", {}).then(res => {
          if (res.msg == "success") {
            that.setData({
              blockNumber: res1.data.latestNumber,
              transactionNumber: res1.data.txn,
              tongBei: res.data.tbSum
            })
          } else {
            wx.showToast({
              title: '获取数据失败,请重试',
              icon: "none"
            })
          }
        }).catch(errMsg => {
          wx.showToast({
            title: '获取数据失败,请重试',
            icon: "none"
          })
        })
      } else {
        wx.showToast({
          title: '获取数据失败,请重试',
          icon: "none"
        })
      }
    }).catch(errMsg => {
      wx.showToast({
        title: '获取数据失败,请重试',
        icon: "none"
      })
    })
    var interval = setInterval(function () {
      that.refreshData()
    }, 15000)
    that.setData({
      interval: interval
    })
  },

  // 页面隐藏取消刷新
  onHide:function(){
    var that = this
    clearInterval(that.data.interval)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    clearInterval(that.data.interval)
    that.get("https://www.fidesum.com/fisco-bcos-browser/home/blockChainInfo?groupId=1", {}).then(res1 => {
      if (res1.message == "success") {
        that.post("https://www.fidesum.com/park/home/getBlanceAndCarSum.json", {}).then(res => {
          if (res.msg == "success") {
            wx.stopPullDownRefresh()
            that.setData({
              blockNumber: res1.data.latestNumber,
              transactionNumber: res1.data.txn,
              tongBei: res.data.tbSum
            })
          } else {
            wx.stopPullDownRefresh()
            wx.showToast({
              title: '获取数据失败,请重试',
              icon: "none"
            })
          }
        }).catch(errMsg => {
          wx.stopPullDownRefresh()
          wx.showToast({
            title: '获取数据失败,请重试',
            icon: "none"
          })
        })
      } else {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '获取数据失败,请重试',
          icon: "none"
        })
      }
    }).catch(errMsg => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '获取数据失败,请重试',
        icon: "none"
      })
    })
    var interval = setInterval(function() {
      that.refreshData()
    }, 15000)
    that.setData({
      interval: interval
    })
  },

  // 刷新数据
  refreshData: function() {
    var that = this
    that.get("https://www.fidesum.com/fisco-bcos-browser/home/blockChainInfo?groupId=1", {}).then(res1 => {
      if (res1.message == "success") {
        that.post("https://www.fidesum.com/park/home/getBlanceAndCarSum.json", {}).then(res => {
          if (res.msg == "success") {
            that.setData({
              blockNumber: res1.data.latestNumber,
              transactionNumber: res1.data.txn,
              tongBei: res.data.tbSum
            })
          }
        }).catch(errMsg => {
          console.log(errMsg)
        })
      }
    }).catch(errMsg => {
      console.log(errMsg)
    })
  },

  get: function(api, data) {
    var promise = new Promise((resolve, reject) => {
      var that = this
      var postData = data
      wx.request({
        url: api,
        data: postData,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res)
          resolve(res.data)
        },
        fail: function(e) {
          console.log(e)
          reject('网络出错')
        }
      })
    })
    return promise
  },

  post: function(api, data) {
    var promise = new Promise((resolve, reject) => {
      var that = this
      var postData = data
      wx.request({
        url: api,
        data: postData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res)
          resolve(res.data)
        },
        fail: function(e) {
          console.log(e)
          reject('网络出错')
        }
      })
    })
    return promise
  },

})