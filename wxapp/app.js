//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        var that = this
        if (code) {
          console.log('获取的用户登录凭证：' + code)
          // ----------- 发送凭证 -----------
          wx.request({
            url: 'http://localhost:8000/wx/login/',
            method: 'POST',
            data: { code: code },
            success: function(res) {
              console.log(res.data)
              that.globalData.sessionid = res.data
              // ---------- 真正的登录 ----------
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  console.log(that.globalData.sessionid)
                  wx.request({
                    url: 'http://localhost:8000/wx/wxusers/',
                    data: {
                      iv: res.iv,
                      encryptedData: res.encryptedData
                    },
                    method: 'GET',
                    header: {
                      'content-type': 'application/json',
                      'WXSESSION': that.globalData.sessionid
                    },
                    success: res => {
                      console.log(res)
                    }
                  })

                }
              })
              // --------------------------------

            }
          })
          // -------------------------------

        } else {
          console.log('获取用户登录态失败：' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(this.globalData.sessionid)

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    sessionid: null,
  }
})