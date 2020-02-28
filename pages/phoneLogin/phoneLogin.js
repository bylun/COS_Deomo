const util = require('../../utils/util.js');
var app = getApp()
var baseUrl = getApp().baseUrl
var ctx
var appCount
Page({
  data: {
    phone: '',
    validateCode: '',
    smsValidateCode: '',
    text: "",
    radioSelected: false,
    sendFlag: true,
    time: '获取验证码'
  },

  onLoad: function(options) {

  },

  onShow: function(){
    if(this.data.text==""){
      this.drawPic()
    }
  },

  onHide:function(){

  },

  // 输入手机号
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value + ''
    })
  },

  // 输入验证码
  validateCodeInput: function(e) {
    this.setData({
      validateCode: e.detail.value.toUpperCase()
    })
  },

  // 输入手机验证码
  smsValidateCodeInput: function(e) {
    this.setData({
      smsValidateCode: e.detail.value
    })
  },

  // 同意协议 
  agreeProtocol: function() {
    this.setData({
      radioSelected: !this.data.radioSelected
    })
  },


  // 发送手机验证码
  sendSmsValidateCode: function() {
    var that = this
    if (that.data.validateCode != that.data.text) {
      wx.showToast({
        title: '请输入正确验证码',
        icon: "none"
      })
      return
    }
    if (!/^1[3456789]\d{9}$/.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none"
      })
      return
    }
    if (that.data.sendFlag) {
      wx.showLoading({
        title: "发送中",
        mask: true
      })
      wx.login({
        success: function(r) {
          var code = r.code;
          if (code) {
            var d = {
              code: code,
              telNo: that.data.phone,
            }
            app.post('spUser/mpSendPhoneCode', d)
              .then(res => {
                if (res.code == "0000") {
                  wx.hideLoading()
                  wx.showToast({
                    title: '发送成功',
                    icon: "none"
                  })
                  var nsecond = 60;
                  that.setData({
                    sendFlag: false,
                    time: nsecond + "秒"
                  })
                  var appCount = setInterval(function() {
                    nsecond -= 1;
                    that.setData({
                      time: nsecond + "秒",
                      appCount: appCount
                    })
                    if (nsecond < 1) {
                      clearInterval(appCount);
                      that.setData({
                        sendFlag: true,
                        time: "重新获取"
                      })
                    }
                  }, 1000)
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '发送失败,请重试',
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
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '发送失败,请重试',
              icon: "none"
            })
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        },
        fail: function() {
          wx.hideLoading()
          wx.showToast({
            title: '发送失败,请重试',
            icon: "none"
          })
          console.log('登陆失败')
        }
      })
    }
  },

  // 登录
  login: function() {
    var that = this
    var str = /^1[3456789]\d{9}$/
    if (!str.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none"
      })
    } else if (that.data.validateCode != that.data.text) {
      wx.showToast({
        title: '请输入正确验证码',
        icon: "none"
      })
    } else if (that.data.smsValidateCode.length != 6) {
      wx.showToast({
        title: '请输入6位短信验证码',
        icon: "none"
      })
    } else if (!that.data.radioSelected) {
      wx.showToast({
        title: '请勾选用户协议',
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      wx.login({
        success: function(r) {
          var code = r.code;
          if (code) {
            wx.getUserInfo({
              success: function(res) {
                var d = {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  telNo: that.data.phone,
                  phoneCode: util.md5(util.md5(util.getSalt() + that.data.smsValidateCode))
                }
                app.post('spUser/mpTelNoAndCodeToLogin', d)
                  .then(res => {
                    if (res.code == "0000") {
                      wx.hideLoading()
                      wx.setStorageSync('user', res.data)
                      app.globalData.user = res.data
                      wx.navigateBack({
                        delta: 2
                      })
                    } else if (res.code == "1116") {
                      wx.hideLoading()
                      wx.showToast({
                        title: '短信验证码错误,请重试',
                        icon: "none"
                      })
                      console.log('解密失败')
                    } else if (res.code == "1117") {
                      wx.hideLoading()
                      wx.showToast({
                        title: '短信验证码已过期,请重试',
                        icon: "none"
                      })
                      console.log('解密失败')
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
              fail: function() {
                wx.hideLoading()
                wx.showToast({
                  title: '登陆失败,请重试',
                  icon: "none"
                })
              }
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '登陆失败,请重试',
              icon: "none"
            })
          }
        },
        fail: function() {
          wx.hideLoading()
          wx.showToast({
            title: '登陆失败,请重试',
            icon: "none"
          })
        }
      })
    }
  },

  // 更换验证码
  change: function() {
    this.drawPic()
  },

  /**生成一个随机数**/
  randomNum: function(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  },

  /**生成一个随机色**/
  randomColor: function(min, max) {
    var that = this
    var r = that.randomNum(min, max)
    var g = that.randomNum(min, max)
    var b = that.randomNum(min, max)
    return "rgb(" + r + "," + g + "," + b + ")"
  },

  /**绘制验证码图片**/
  drawPic: function() {
    var that = this
    ctx = wx.createCanvasContext('canvas')
    /**绘制背景色**/
    ctx.fillStyle = that.randomColor(180, 240) //颜色若太深可能导致看不清
    ctx.fillRect(0, 0, 90, 28)
    /**绘制文字**/
    var arr
    var text = ''
    var str = 'ABCEFGHJKLMNPQRSTWXY123456789'
    for (var i = 0; i < 4; i++) {
      var txt = str[that.randomNum(0, str.length)]
      ctx.fillStyle = that.randomColor(50, 160) //随机生成字体颜色
      ctx.font = that.randomNum(20, 26) + 'px SimHei' //随机生成字体大小
      var x = 5 + i * 20
      var y = that.randomNum(20, 25)
      var deg = that.randomNum(-20, 20)
      //修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 5, 0)
      text = text + txt
      //恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    }
    /**绘制干扰线**/
    for (var i = 0; i < 4; i++) {
      ctx.strokeStyle = that.randomColor(40, 180)
      ctx.beginPath()
      ctx.moveTo(that.randomNum(0, 90), that.randomNum(0, 28))
      ctx.lineTo(that.randomNum(0, 90), that.randomNum(0, 28))
      ctx.stroke()
    }
    /**绘制干扰点**/
    for (var i = 0; i < 20; i++) {
      ctx.fillStyle = that.randomColor(0, 255)
      ctx.beginPath()
      ctx.arc(that.randomNum(0, 90), that.randomNum(0, 28), 1, 0, 2 * Math.PI)
      ctx.fill()
    }
    ctx.draw(false, function() {
      that.setData({
        text: text
      })
    })
  }
})