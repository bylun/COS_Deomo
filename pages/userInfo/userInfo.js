const util = require('../../utils/util.js')
var config = {}
const COS = require('../../lib/cos-wx-sdk-v5.js')
var cos = null
const app = getApp()

Page({
  data: {
    nameModal: true,
    nickNameModal: true,
    genderModal: true,
    phoneModal: true,
    mailModal: true,
    idCardModal: true,
    user: null,
    input: null,
    select: false,
    url: null
  },

  getConfig: function() {
    app.postWithToken('spUser/getCosParam', {})
      .then(res => {
        config.Bucket = util.Decrypt(res.data.bucketName, res.data.key)
        config.Region = util.Decrypt(res.data.regionName, res.data.key)
        config.SecretId = util.Decrypt(res.data.secretId, res.data.key)
        config.SecretKey = util.Decrypt(res.data.secretKey, res.data.key)
        config.putFolder = util.Decrypt(res.data.putFolder, res.data.key)
        cos = new COS({
          getAuthorization: function (params, callback) { //获取签名
            var authorization = COS.getAuthorization({
              SecretId: config.SecretId,
              SecretKey: config.SecretKey,
              Method: params.Method,
              Key: params.Key
            })
            callback(authorization)
          }
        })
        return true
      })
      .catch(errMsg => {
        console.log(errMsg)
        return false
      })
  },

  onLoad: function(options) {
    this.getConfig()
  },

  onShow: function(options) {
    var user = app.globalData.user
    this.setData({
      user: user,
      input: JSON.parse(JSON.stringify(user))
    })
  },

  updateUserInfo: function(key, value) {
    var that = this
    wx.showLoading({
      title: "更新中",
      mask: true
    })
    var d = {}
    d[key] = value
    var date1 = new Date()
    app.postWithToken('spUser/updateUserInfo', d)
      .then(res => {
        var date2 = new Date()
        console.log(date2.getTime() - date1.getTime())
        if (res.code == "0000") {
          wx.hideLoading()
          var str1 = 'user.' + key
          var str2 = 'input.' + key
          var info = {}
          info[str1] = value
          info[str2] = value
          that.setData(info)
          app.globalData.user = that.data.user
          wx.setStorageSync('user', that.data.user)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '更改失败,请重试',
            icon: "none"
          })
        }
      })
      .catch(errMsg => {
        var date2 = new Date()
        console.log(date2.getTime() - date1.getTime())
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      })
  },

  // 设置头像
  setAvatar: async function() {
    var that = this
    if (!cos) {
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      app.postWithToken('spUser/getCosParam', {})
        .then(res => {
          wx.hideLoading()
          if (res.code == "0000") {
            config.Bucket = util.Decrypt(res.data.bucketName, res.data.key)
            config.Region = util.Decrypt(res.data.regionName, res.data.key)
            config.SecretId = util.Decrypt(res.data.secretId, res.data.key)
            config.SecretKey = util.Decrypt(res.data.secretKey, res.data.key)
            config.putFolder = util.Decrypt(res.data.putFolder, res.data.key)
            cos = new COS({
              getAuthorization: function (params, callback) { //获取签名
                var authorization = COS.getAuthorization({
                  SecretId: config.SecretId,
                  SecretKey: config.SecretKey,
                  Method: params.Method,
                  Key: params.Key
                })
                callback(authorization)
              }
            })
            that.upload()
          } else {
            wx.showToast({
              title: '更改失败,请重试',
              icon: "none"
            })
          }
        })
        .catch(errMsg => {
          console.log(errMsg)
          wx.hideLoading()
          wx.showToast({
            title: '网络异常,请重试',
            icon: "none"
          })
        })
    } else {
      that.upload()
    }
  },

  upload: function() {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var filePath = res.tempFilePaths[0]
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1) // 这里指定上传的文件名
        var date = new Date()
        var formatDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
        var newKey = config.putFolder + formatDate + '/' + date.getTime() + Key // cos上定义目录
        that.setData({
          url: 'https://' + config.Bucket + '.cos.' + config.Region + '.myqcloud.com/' + newKey
        })
        cos.postObject({
          Bucket: config.Bucket, // 存储桶
          Region: config.Region, // 地域
          Key: newKey,
          FilePath: filePath, // 本地文件临时地址
        }, that.requestCallback)
      }
    })
  },

  // 上传图片回调函数
  requestCallback: function(err, data) {
    var that = this
    console.log(err)
    console.log(data)
    if (err && err.error) {
      wx.showToast({
        title: '更改失败,请重试',
        icon: "none"
      })
    } else if (err) {
      wx.showToast({
        title: '更改失败,请重试',
        icon: "none"
      })
    } else {
      that.updateUserInfo('headImg', that.data.url)
    }
  },

  // 绑定姓名输入
  nameInput: function(e) {
    var that = this
    that.setData({
      'input.realName': e.detail.value
    })
  },

  // 设置姓名
  setName: function() {
    var that = this
    that.setData({
      nameModal: false
    })
  },

  // 设置姓名确认
  nameModalConfirm: function() {
    var that = this
    that.setData({
      nameModal: true,
    })
    that.updateUserInfo('realName', that.data.input.realName)
  },

  // 设置姓名取消
  nameModalCancel: function() {
    var that = this
    that.setData({
      nameModal: true,
      'input.realName': that.data.user.realName
    })
  },

  // 设置昵称
  setNickName: function() {
    var that = this
    that.setData({
      nickNameModal: false
    })
  },

  // 绑定昵称输入
  nickNameInput: function(e) {
    var that = this
    that.setData({
      'input.userNickName': e.detail.value
    })
  },

  // 设置昵称确认
  nickNameModalConfirm: function() {
    var that = this
    that.setData({
      nickNameModal: true,
    })
    that.updateUserInfo('userNickName', that.data.input.userNickName)
  },

  // 设置昵称取消
  nickNameModalCancel: function() {
    var that = this
    that.setData({
      nickNameModal: true,
      'input.userNickName': that.data.user.userNickName
    })
  },

  // 设置性别
  setGender: function() {
    var that = this
    that.setData({
      genderModal: false
    })
  },

  // 显示下拉框
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },

  // 选择性别
  genderInput(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      'input.sex': name,
      select: false
    })
  },

  // 设置性别确认
  genderModalConfirm: function() {
    var that = this
    that.setData({
      genderModal: true,
    })
    that.updateUserInfo('sex', that.data.input.sex)
  },

  // 设置性别取消
  genderModalCancel: function() {
    var that = this
    that.setData({
      genderModal: true,
      'input.sex': that.data.user.sex
    })
  },

  // 设置手机号
  setPhone: function() {
    var that = this
    that.setData({
      phoneModal: false
    })
  },

  // 绑定手机号输入
  phoneInput: function(e) {
    var that = this
    var str = e.detail.value + ''
    str = str.trim()
    that.setData({
      'input.telNo': str
    })
  },

  // 设置手机号确认
  phoneModalConfirm: function() {
    var that = this
    var str = /^1[3456789]\d{9}$/
    if (str.test(that.data.input.telNo)) {
      that.setData({
        phoneModal: true,
      })
      that.updateUserInfo('telNo', that.data.input.telNo)
    } else {
      wx.showToast({
        title: '手机号格式错误，请重新输入',
        icon: 'none'
      })
    }
  },

  // 设置手机号取消
  phoneModalCancel: function() {
    var that = this
    that.setData({
      phoneModal: true,
      'input.telNo': that.data.user.telNo
    })
  },

  // 设置邮箱
  setMail: function() {
    var that = this
    that.setData({
      mailModal: false
    })
  },

  // 绑定邮箱输入
  mailInput: function(e) {
    var that = this
    var str = e.detail.value + ''
    str = str.trim()
    that.setData({
      'input.email': str
    })
  },

  // 设置邮箱确认
  mailModalConfirm: function() {
    var that = this
    var str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (str.test(that.data.input.email)) {
      that.setData({
        mailModal: true,
      })
      that.updateUserInfo('email', that.data.input.email)
    } else {
      wx.showToast({
        title: '邮箱格式错误，请重新输入',
        icon: 'none'
      })
    }
  },

  // 设置邮箱取消
  mailModalCancel: function() {
    var that = this
    that.setData({
      mailModal: true,
      'input.email': that.data.user.email
    })
  },

  // 设置身份证号
  setIdCard: function() {
    var that = this
    that.setData({
      idCardModal: false
    })
  },

  // 绑定身份证号输入
  idCardInput: function(e) {
    var that = this
    var str = e.detail.value + ''
    str = str.trim()
    that.setData({
      'input.idcard': str
    })
  },

  // 设置身份证号确认
  idCardModalConfirm: function() {
    var that = this
    var str = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if (str.test(that.data.input.idcard)) {
      that.setData({
        idCardModal: true,
      })
      that.updateUserInfo('idcard', that.data.input.idcard)
    } else {
      wx.showToast({
        title: '身份证号码格式错误，请重新输入',
        icon: 'none'
      })
    }

  },

  // 设置身份证号取消
  idCardModalCancel: function() {
    var that = this
    that.setData({
      idCardModal: true,
      'input.idcard': that.data.user.idcard
    })
  },
})