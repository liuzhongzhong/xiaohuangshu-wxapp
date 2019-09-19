// pages/home/index/index.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectList: [],
    albumList: [],
    loadAllData: false, // 是否加载全部
    page: 1,
    pageSize: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.showLoading({
      title: '正在加载',
    })
    $.get(
      'album/albums', {
        page: this.data.page,
        pageSize: this.data.pageSize,
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        if (res.data.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '图册列表为空',
            icon: 'none',
          })
        } else {
          wx.hideLoading();
          that.setData({
            albumList: res.data,
          });
        }
      }
    )

    $.get(
      'subject/subjects', {},
      function (res) {
        if (res.data.length == 0) {
          wx.showToast({
            title: '专题加载失败',
            icon: 'none',
          })
        } else {
          that.setData({
            subjectList: res.data,
          });
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    wx.showLoading({
      title: '正在加载',
    })
    $.get(
      'album/albums', {
        page: 1,
        pageSize: this.data.pageSize,
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        if (res.data.length == 0) {
          wx.hideLoading();
          wx.showToast({
            title: '图册列表为空',
            icon: 'none',
          })
        } else {
          wx.hideLoading();
          that.setData({
            albumList: res.data,
          });
        }
      }
    )

    $.get(
      'subject/subjects', {},
      function (res) {
        if (res.data.length == 0) {
          wx.showToast({
            title: '专题加载失败',
            icon: 'none',
          })
        } else {
          that.setData({
            subjectList: res.data,
          });
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
        'album/albums', {
          page: page,
          pageSize: this.data.pageSize,
          user_id: wx.getStorageSync('user_id'),
        },
        function (res) {
          if (res.data.length != 0) {
            var albumList = that.data.albumList;
            for (var i = 0; i < res.data.length; i++) {
              albumList.push(res.data[i]);
            }
            that.setData({
              albumList: albumList,
              page: page,
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
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

  /**
   * 查看专题信息
   */
  bindSubject: function (event) {
    var subject_id = event.currentTarget.dataset.subject_id;
    var subject_name = event.currentTarget.dataset.subject_name;
    wx.navigateTo({
      url: '../subject/subject?subject_id=' + subject_id + '&subject_name=' + subject_name,
    })
  },

  /**
   * 查看图册信息
   */
  bindAlbum: function (event) {
    var album_id = event.currentTarget.dataset.album_id;
    wx.navigateTo({
      url: '../album/album?album_id=' + album_id,
    })
  },

  /**
   * 查看用户信息
   */
  bindUser: function (event) {
    var user_id = event.currentTarget.dataset.user_id;
  },

  /**
   * 点击关注或取消关注
   */
  bindLike: function (event) {
    var that = this;
    var album_id = event.currentTarget.dataset.album_id;
    $.put(
      'album/like', {
        user_id: wx.getStorageSync('user_id'),
        album_id: album_id,
      },
      function (res) {
        if (res.data.code == 201) {
          var albumList = that.data.albumList;
          for (var i = 0; i < albumList.length; i++) {
            if (albumList[i]['album_id'] == album_id) {
              if (albumList[i]['is_collect'] == 0) {
                albumList[i]['like_num'] = albumList[i]['like_num'] + 1;
              } else if (albumList[i]['is_collect'] == 1) {
                albumList[i]['like_num'] = albumList[i]['like_num'] - 1;
              }
              albumList[i]['is_collect'] = !albumList[i]['is_collect'];
            }
          }
          that.setData({
            albumList: albumList,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
    )
  }

})