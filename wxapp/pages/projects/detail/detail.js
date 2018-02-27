// pages/projects/detail/detail.js
var Project = require('../../../utils/worker/Project.js').Project;
var loaders = require('../../../utils/worker/loaders.js');
var config = require('../../../utils/config.js').config;
var wxRequest = require('../../../utils/wxRequest.js');
var wxApi = require('../../../utils/wxApi.js');
var util = require('../../../utils/util.js');
var Promise = require('../../../plugins/es6-promise.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShare: false,
    isActive: true,
    isCreate: false,
    isShareHidden: false,
    isManager: false,
    isReadOnly: true,
    begin: "2018-02-22",
    end: "2018-02-28",
    status: "进行中",
    submitText: "更新",
    submitType: "default",
    submitDisable: false,
    shareText: "分享",
    addPartText: "参与项目",
    returnText: "返回主页",
    project: null
  },
  formSubmit: function(e) {
    var data = e.detail.value;
    var app = getApp();
    var sessionid = app.globalData.sessionid;
    data.begin = this.data.begin;
    data.end = this.data.end;
    data.is_active = this.data.isActive;
    console.log(data);
    this.setData({
      submitDisable: true,
      submitText: "提交中..."
    });
    wxRequest.postRequest(config.host + 'worker/projects/', data, sessionid).then(res => {
      console.log(res);
      wx.showToast({
        title: '创建成功！'
      });
      wx.redirectTo({
        url: '/pages/projects/detail/detail?url=' + res.data.url,
      })
    }).catch(res => {
      console.log(res);
      wx.showToast({
        title: '创建失败！'
      });
    }).finally(res => {
      this.setData({
        submitDisable: false,
        submitText: "创建"
      });
    })
  },
  bindReturnTap: function () {
    wx.switchTab({
      url: '../../index/index',
    })
  },
  bindBeginDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      begin: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end: e.detail.value
    })
  },
  switchChange: function (e) {
    console.log(e);
    this.setData({
      isActive: e.detail.value
    });
    if (this.data.isActive) {
      this.setData({
        status: "进行中"
      });
    } else {
      this.setData({
        status: "已结束"
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    console.log(options);
    if (options.share) {
      this.setData({
        isShare: true,
        isShareHidden: true
      });
    }
    if (app.globalData.isLogin) {
      if (options.url) {
        this.getProject(options.url);
      } else {
        this.showProjectForm();
      }
      
    } else {
      if (options.url){
        app.loginCallback = () => {
          this.getProject(options.url);
        }
      } else {
        app.loginCallback = () => {
          this.showProjectForm();
        }
      }
      
    }
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: '分享工作项目',
      path: '/pages/projects/detail/detail?url=' + config.host  + 'worker/projects/1/&share=true',
      success: function (res) {

      },
      fail: function (res) {

      }
    }
  },
  getProject: function (url) {
      let app = getApp();
      let project = new Project({
        url: url,
        loadData: { sessionid: app.globalData.sessionid },
        loader: loaders.projectLoader
      });
      this.setData({
        project: project
      });
      wx.showLoading({
        title: '正在加载数据...',
      })
      this.data.project.load().then(res => {
        console.log(project);
        this.data.project.loadProps().then(res => {
          console.log(project);
          this.setData({
            isActive: project.isActive,
            begin: project.begin,
            end: project.end,
            name: project.name,
            detail: project.detail
          });
          if (project.isActive) {
            this.setData({
              status: "进行中"
            });
          } else {
            this.setData({
              status: "已结束"
            });
          }
          if (project.manager.url == app.globalData.worker.url) {
            this.setData({
              isManager: true
            });
          } else {
            console.log('readonly')
            this.setData({
              isManager: false
            });
          }
          this.setData({
            isReadOnly: this.data.isShare || !this.data.isManager
          })
        }).catch(res => {
          console.log(res);
        })
      }).catch(res => {
        console.log(res);
      }).finally(res => {
        wx.hideLoading();
      })
    },
    showProjectForm: function () {
      this.setData({
        isShare: false,
        isCreate: true,
        isActive: true,
        isManager: true,
        isShareHidden: true,
        isReadOnly: false,
        begin: util.formatDate(new Date()),
        end: util.formatDate(new Date()),
        status: "进行中",
        submitText: "创建",
        submitType: "primary",
        shareText: "分享",
        addPartText: "参与项目",
        returnText: "返回主页",
        project: null
      })
    }
})