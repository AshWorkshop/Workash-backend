// pages/projects/detail/detail.js
var Project = require('../../../utils/worker/Project.js').Project;
var loaders = require('../../../utils/worker/loaders.js');
var config = require('../../../utils/config.js').config

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShare: false,
    isActive: true,
    isManager: false,
    isReadOnly: true,
    begin: "2018-02-22",
    end: "2018-02-28",
    status: "进行中",
    submitText: "更新",
    shareText: "分享",
    addPartText: "参与项目",
    returnText: "返回主页",
    project: null
  },
  bindReturnTap: function () {
    wx.switchTab({
      url: '../../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    console.log(options);
    if (options.share) {
      this.setData({
        isShare: true
      })
    }
    if (app.globalData.isLogin) {
      this.getProject(options.url);
    } else {
      app.loginCallback = () => {
        this.getProject(options.url);
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
            this.setData({
              isManager: false
            });
          }
          this.setData({
            isReadOnly: this.data.isShare && !this.data.isManager
          })
        }).catch(res => {
          console.log(res);
        })
      }).catch(res => {
        console.log(res);
      }).finally(res => {
        wx.hideLoading();
      })
    }
})