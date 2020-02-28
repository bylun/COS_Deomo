//app.js
const regeneratorRuntime = require('./lib/runtime.js')
App({
  globalData: {
    // url: 'http://123.206.50.176:8010/fidesumsp/',
    url: 'https://www.fidesum.com/fidesumsp/',
    user: null,
    token: null,
    version: "V0.1.1"
  },

  onLaunch: function() {
    var that = this
    this.checkUpdateVersion()
    var token = wx.getStorageSync('token')
    if (token) {
      this.globalData.token = token
      var user = wx.getStorageSync('user')
      if (user) {
        this.globalData.user = user
      }
    }
  },

  post: function(api, data) {
    var promise = new Promise((resolve, reject) => {
      var that = this
      var postData = data
      wx.request({
        url: this.globalData.url + api,
        data: postData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          console.log(res)
          if (res.header.token){
            that.globalData.token = res.header.token
            wx.setStorageSync('token', res.header.token)
          }
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

  postWithToken: function(api, data) {
    var promise = new Promise((resolve, reject) => {
      var that = this
      var postData = data
      wx.request({
        url: that.globalData.url + api,
        data: postData,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': that.globalData.token
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

  get: function(api, data) {
    var promise = new Promise((resolve, reject) => {
      var that = this
      var postData = data
      wx.request({
        url: this.globalData.url + api,
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

  // 检测当前的小程序是否是最新版本，是否需要下载、更新
  checkUpdateVersion: function() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function() {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          })
          updateManager.onUpdateFailed(function() {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~',
            })
          })
        }
      })
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})