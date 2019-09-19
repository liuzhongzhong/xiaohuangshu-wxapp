// pages/home/subject/subject.js
import $ from '../../../common/common.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subject_id: 0,
    subjectlList: [],
    totalAlbum: 0,
    loadAllData: false,
    page: 1,
    pageSize: 20,
    systemInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.subject_name) {
      wx.setNavigationBarTitle({
        title: options.subject_name
      })
    } else {
      wx.setNavigationBarTitle({
        title: '图册列表'
      })
    }

    this.setData({
      subject_id: options.subject_id,
      subject_name: options.subject_name,
      systemInfo: app.globalData.systemInfo,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    $.get(
      'album/subject', {
        subject_id: this.data.subject_id,
        user_id: wx.getStorageSync('user_id'),
        page: this.data.page,
        pageSize: this.data.pageSize,
      },
      function (res) {
        if (res.data.code == 200) {
          if (res.data.data.subjectlList.length) {
            that.setData({
              subjectlList: res.data.data.subjectlList,
              totalAlbum: res.data.data.subjectlList.length,
            });
          }
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    $.get(
      'album/subject', {
        subject_id: this.data.subject_id,
        user_id: wx.getStorageSync('user_id'),
        page: 1,
        pageSize: this.data.pageSize,
      },
      function (res) {
        if (res.data.code == 200) {
          if (res.data.data.subjectlList.length) {
            that.setData({
              subjectlList: res.data.data.subjectlList,
              totalAlbum: res.data.data.subjectlList.length,
            });
          }
        }
      }
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.loadAllData == false) {
      wx.showLoading({
        title: '正在加载',
      })
      var page = this.data.page + 1;
      $.get(
        'album/subject', {
          user_id: wx.getStorageSync('user_id'),
          subject_id: this.data.subject_id,
          page: page,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.data.subjectlList.length != 0) {
            var subjectlList = that.data.subjectlList;
            for (var i = 0; i < res.data.data.subjectlList.length; i++) {
              subjectlList.push(res.data.data.subjectlList[i]);
            }
            that.setData({
              subjectlList: subjectlList,
              page: page,
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '已加载全部',
              icon: 'none',
            })
            that.setData({
              loadAllData: true,
            });
          }
        }
      )
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindAlbum: function (event) {
    var album_id = event.currentTarget.dataset.album_id;
    wx.navigateTo({
      url: '../album/album?album_id=' + album_id,
    })
  },
})