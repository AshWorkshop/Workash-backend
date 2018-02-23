//index.js
var wxRequest = require('../../utils/wxRequest.js');
var wxApi = require('../../utils/wxApi.js');
var util = require('../../utils/util.js');
var config = require('../../utils/config.js').config;
var Promise = require('../../plugins/es6-promise.js');
var Worker = require('../../utils/worker/Worker.js').Worker;
var loaders = require('../../utils/worker/loaders.js');

//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '0',
    userInfo: {},
    hasUserInfo: false,
    hasWorkerInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  hoursTap: function() {
    console.log('Going to works-view')
    wx.navigateTo({
      url: '../works/works',
    })
  },
  addWorkTap: function () {
    console.log('Going to add-work-view')
w
    console.log('Going to works-view')
    wx.navigateTo({
      url: '../works/works',
    })
  },
  addWorkTap: function () {
    console.log('Going to add-work-view')
    if (app.globalData.workerInfo) {
      wx.navigateTo({
        url: '../works/add/add',
      })
    } else {
      app.worksInfoReadyCallback = () => {
        wx.navigateTo({
          url: '../works/add/add',
        })
      }
    }
  },
  onShow: function () {
    // wx.showToast({
    //   title: '正在加载数据...',
    //   icon: 'loading',
    //   duration: 10000
    // })
    wx.showLoading({
      title: '正在加载数据...',
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
      app.globalData.workerInfo = workerInfo;
      app.globalData.worker = new Worker({
        url: workerInfo.url,
        loadData: {
          sessionid: app.globalData.sessionid
        },
        loader: loaders.workerLoader
      });
      app.globalData.worker.load().then(res => {
        console.log(app.globalData.worker);
        app.globalData.worker.loadProps().then(res => {
          console.log(app.globalData.worker);
          this.setData({
            motto: app.globalData.worker.participations[0].totalHours
          });
          // ---------- Has worker info callback ----------
          if (app.workerReadyCallback) {
            app.workerReadyCallback();
          }
          // ----------------------------------------------
          wx.hideLoading();
          
        }).catch(res => {
          console.log(res);
        });
      }).catch(res => {
        console.log(res);
      });
      
    })
  }
})
