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
  },
  formSubmit: function (e) {
    var data = e.detail.value
    data.date = this.data.date
    data.project = config.host + 'worker/projects/1/'
    console.log('form发生了submit事件，携带数据为：', data)
    wxRequest.postRequest(config.host + 'worker/works/', data, app.globalData.sessionid).then(res => {
      console.log(res)
      wx.navigateTo({
        url: '../../index/index'
      })
    })
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
  onLoad: function() {
    console.log('Add-View load')
  }
})