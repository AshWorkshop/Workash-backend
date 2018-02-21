//index.js
var wxRequest = require('../../utils/wxRequest.js')
var wxApi = require('../../utils/wxApi.js')
var util = require('../../utils/util.js')
var config = require('../../utils/config.js').config
var Promise = require('../../plugins/es6-promise.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '正在加载数据...',
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
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
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

    //-------------------- Get WorkerInfo --------------------
    var sessionid = app.globalData.sessionid
    if (sessionid) {
      this.getWorkerInfo(sessionid)
    } else {
      app.loginCallback = sessionid => {
        this.getWorkerInfo(sessionid)
      }
    }
    //--------------------------------------------------------

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getWorkerInfo: function(sessionid) {
    var host = config.host
    var that = this
    var workerInfo = null
    console.log('Start handling worker info...')
    wxRequest.getRequest(host + 'worker/getworker/', {}, sessionid).then(res => {
      workerInfo = res.data
      console.log('workerInfo: ' + workerInfo.url)
    }).catch(res => {
      if (res.statusCode == 404){
        console.log('Worker not exists, creating a new one...')
        return wxRequest.postRequest(host + 'worker/workers/', {}, sessionid).then(res => {
          workerInfo = res.data
          console.log('Successfully created a new worker!')
          console.log('workerInfo: ' + workerInfo.url)
        })
      }
    }).finally(res => {
      console.log('Successfully got worker info!')
      app.globalData.workerInfo = workerInfo
      var workUrls = workerInfo.works
      var sum = 0.0
      const promises = workUrls.map(function (workUrl) {
        return () => {
          return wxRequest.getRequest(workUrl, {}, sessionid).then(res => {
            sum += res.data.hours;
          })
        }
      });
      util.queue(promises, 5).then(() => {
        that.setData({
          motto: '本月工时:' + sum
        })
        wx.hideToast()
        console.log('Successfuly load hours')
      }).catch((res) => {
        console.log(res)
      })
      
      // Promise.all(promises).then(function (ress) {
      //   for (let res of ress) {
      //     sum += res.data.hours;
      //   }
        // that.setData({
        //   motto: sum
        // });
        // wx.hideToast();
      // });
    })
  }
})
