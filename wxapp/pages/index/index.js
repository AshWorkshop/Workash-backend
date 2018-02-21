//index.js
var wxRequest = require('../../utils/wxRequest.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    //-------------------- Get Worker --------------------
    // var sessionid = app.globalData.sessionid
    // if (sessionid) {
    //   this.getWorker(sessionid)
    // } else {
    //   app.loginCallback = res => {
    //     sessionid = app.globalData.sessionid
    //     this.getWorker(sessionid)
    //   }
    // }
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        var that = this
        if (code) {
          //console.log('获取的用户登录凭证：' + code)
          // ----------- 发送凭证 -----------
          // wx.request({
          //   url: that.globalData.myhost + 'wx/login/',
          //   method: 'POST',
          //   data: { code: code },
          //   success: function(res) {
          //     //console.log(res.data)
          //     that.globalData.sessionid = res.data
          //     if (that.loginCallback) {
          //       that.loginCallback(res)
          //     }
          //   }
          // })
          wxRequest.postRequest(app.globalData.myhost + 'wx/login/', { code: code }).then(res => {
            app.globalData.sessionid = res.data
            console.log(res.data)
            wxRequest.getRequest(app.globalData.myhost + 'worker/getworker/', {}, app.globalData.sessionid).then(res => {
              console.log(res.data)
              app.globalData.worker = res.data
            }).catch(res => {
              if (res.statusCode == 404) {
                return wxRequest.postRequest(app.globalData.myhost + 'worker/workers/', {}, app.globalData.sessionid).then(res => {
                  console.log('create a new worker')
                  console.log(res.data)
                  app.globalData.worker = res.data
                })
              }
            })
          })
          // -------------------------------

        } else {
          console.log('获取用户登录态失败：' + res.errMsg)
        }
      }
    })
    
    //----------------------------------------------------

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getWorker: function(sessionid) {
    var app = getApp()
    var myhost = app.globalData.myhost
    wx.request({
      url: myhost + 'worker/getworker/',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'WXSESSION': sessionid
      },
      success: res => {
        var result = null
        if (res.statusCode == 404) {
          result = Worker.create(myhost, sessionid)
        } else if (res.statusCode == 200) {
          result = res.data
        }
        if (result) {
          app.globalData.worker = result
          // TODO: Show Total Hours
          this.setData({
            motto: result.url
          })
        } else {
          Worker.createCallback = res => {
            result = res
            app.globalData.worker = result
            // TODO: Show Total Hours
            this.setData({
              motto: result.url
            })
          }
        }
        
      }
    })
  }
})
