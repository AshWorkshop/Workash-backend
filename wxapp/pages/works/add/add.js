// pages/works/add/add.js
var wxRequest = require('../../../utils/wxRequest.js')
var wxApi = require('../../../utils/wxApi.js')
var util = require('../../../utils/util.js')
var config = require('../../../utils/config.js').config
var Promise = require('../../../plugins/es6-promise.js')

//获取应用实例
const app = getApp()

Page({
  data: {
    date: "2018-02-22",
    submitDisabled: false,
    submitText: "提交",
  },
  formSubmit: function (e) {
    var data = e.detail.value;
    data.date = this.data.date;
    data.project = this.data.projectRange[this.data.projectSelected].url;
    console.log('form发生了submit事件，携带数据为：', data);
    if (data.project) {
      // wx.showLoading({
      //   title: '正在提交...',
      // });
      this.setData({
        submitDisabled: true,
        submitText: "提交中"
      })
      wxRequest.postRequest(config.host + 'worker/works/', data, app.globalData.sessionid).then(res => {
        console.log(res);
        wx.showToast({
          title: '提交成功！'
        });
        wx.switchTab({
          url: '../../index/index'
        });
      }).catch(res => {
        wx.showToast({
          title: '提交失败！',
          icon: 'fail'
        })
      }).finally(res => {
        // wx.hideLoading();
        this.setData({
          submitDisabled: false,
          submitText: "提交"
        });
      })
    } else {
      console.log('没有Project');
    }
    
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindProjectChange: function (e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    wx.setStorageSync('defaultProjectUrl', this.data.projectRange[e.detail.value].url);
    this.setData({
      projectSelected: e.detail.value,
      projectName: this.data.projectRange[e.detail.value].name
    })
  },
  onLoad: function() {
    console.log('Add-View load')

    let defaultProjectUrl = wx.getStorageSync('defaultProjectUrl') || "None";
    let defaultIndex = 0;
    let parts = app.globalData.worker.participations.concat();

    if (defaultProjectUrl in app.globalData.worker.participationUrls) {
      defaultIndex = app.globalData.worker.participationUrls[defaultProjectUrl];
    } else if (parts.length == 0) {
      parts = [{
        name: "暂未参与任何项目",
        url: null
      }];
    }

    this.setData({
      date: util.formatDate(new Date()),
      projectSelected: defaultIndex,
      projectRange: parts,
      projectName: parts[defaultIndex].name
    })
  }
})