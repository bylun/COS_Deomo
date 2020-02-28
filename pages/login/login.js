const util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {},

  onLoad: function(options) {

  },

  login: function(detail) {
    if (detail.detail.rawData) {
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      wx.login({
        success: function (r) {
          var code = r.code;
          if (code) {
            var d = {
              code: code
            }
            app.post('spUser/judgeUserAuthorize', d)
              .then(res => {
                console.log(res)
                if (res.code == "1131") {
                  wx.login({
                    success: function (e) {
                      var d = {
                        code: e.code,
                        encryptedData: detail.detail.encryptedData,
                        iv: detail.detail.iv,
                      }
                      app.post('spUser/mpAuthorizeToLogin', d)
                        .then(res => {
                          if (res.code == "0000") {
                            wx.hideLoading()
                            wx.setStorageSync('user', res.data)
                            app.globalData.user = res.data
                            app.globalData.hasLogined = true
                            wx.navigateBack({
                              delta: 1
                            })
                          } else {
                            wx.hideLoading()
                            wx.showToast({
                              title: '登陆失败,请重试',
                              icon: "none"
                            })
                            console.log('解密失败')
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
                    fail: function (e) {
                      wx.hideLoading()
                      wx.showToast({
                        title: '登陆失败,请重试',
                        icon: "none"
                      })
                      console.log('解密失败')
                    }
                  })
                } else if (res.code == "1132") {
                  wx.hideLoading()
                  wx.setStorageSync('user', res.data)
                  app.globalData.user = res.data
                  app.globalData.hasLogined = true
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '登陆失败,请重试',
                    icon: "none"
                  })
                }
              })
              .catch(errMsg => {
                console.log(errMsg)
                wx.hideLoading()
                wx.showToast({
                  title: '网络异常',
                  icon: "none"
                })
              })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '登陆失败,请重试',
              icon: "none"
            })
          }
        },
        fail: function () {
          wx.hideLoading()
          wx.showToast({
            title: '登陆失败,请重试',
            icon: "none"
          })
        }
      })
    } else {
      wx.showToast({
        title: '登陆失败,请先授权',
        icon: "none"
      })
    }
    
  },

})