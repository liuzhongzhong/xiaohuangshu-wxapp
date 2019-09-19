// pages/mine/index/index.js
import $ from '../../../common/common.js';
var sliderWidth = 84; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["我的相册", "我的收藏", "我的打赏"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    menuTop: 124,
    menuFixed: false,
    userInfo: [],
    userInfoServer: [],
    myPage: 1,
    likePage: 1,
    payPage: 1,
    pageSize: 10,
    userAlbumList: [],
    likeAlbumList: [],
    payAlbumList: [],
    loadAllUserData: false,
    loadAllLikeData: false,
    loadAllPayData: false,
    menuButtonInfoData: [],
    systemInfo: [],
    refresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          'systemInfo': res,
          'menuButtonInfoData': wx.getMenuButtonBoundingClientRect()
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 获取用户信息
    $.get(
      'user/user', {
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        if (res.data.code == 200) {
          that.setData({
            userInfoServer: res.data.data.userInfo,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    )

    if (wx.getStorageSync('userInfo')) {
      var hasUserInfo = true;
      that.setData({
        userInfo: wx.getStorageSync('userInfo'),
      });
    } else {
      var hasUserInfo = false;
      that.setData({
        userInfo: null,
      });
    }

    if (hasUserInfo) {
      // 获取我的相册列表
      $.get(
        'album/user', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              userAlbumList: res.data.data.userAlbumList,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )

      // 获取我的收藏列表
      $.get(
        'album/like', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              likeAlbumList: res.data.data.likeAlbumList,
            });
          } else {
            that.setData({
              likeAlbumList: null,
            });
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )

      // 获取我的打赏列表
      $.get(
        'album/pay', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              payAlbumList: res.data.data.payAlbumList,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )
    }
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
    // 获取用户信息
    wx.showLoading({
      title: '正在加载',
    })
    $.get(
      'user/user', {
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            userInfoServer: res.data.data.userInfo,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    )

    if (wx.getStorageSync('userInfo')) {
      var hasUserInfo = true;
      that.setData({
        userInfo: wx.getStorageSync('userInfo'),
      });
    } else {
      var hasUserInfo = false;
      that.setData({
        userInfo: null,
      });
    }

    if (hasUserInfo) {
      // 获取我的相册列表
      $.get(
        'album/user', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              userAlbumList: res.data.data.userAlbumList,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )

      // 获取我的收藏列表
      $.get(
        'album/like', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              likeAlbumList: res.data.data.likeAlbumList,
            });
          } else {
            that.setData({
              likeAlbumList: null,
            });
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )

      // 获取我的打赏列表
      $.get(
        'album/pay', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              payAlbumList: res.data.data.payAlbumList,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (this.data.userInfo != null) {
      if (this.data.activeIndex == 0 && this.data.loadAllUserData == false && this.data.userAlbumList) {
        wx.showLoading({
          title: '正在加载',
        })
        var page = this.data.myPage + 1;
        $.get(
          'album/user', {
            user_id: wx.getStorageSync('user_id'),
            page: page,
            pageSize: this.data.pageSize,
          },
          function (res) {
            if (res.data.data.userAlbumList.length != 0) {
              var userAlbumList = that.data.userAlbumList;
              for (var i = 0; i < res.data.data.userAlbumList.length; i++) {
                userAlbumList.push(res.data.data.userAlbumList[i]);
              }
              that.setData({
                userAlbumList: userAlbumList,
                myPage: page,
              });
              wx.hideLoading();
            } else {
              wx.hideLoading();
              that.setData({
                loadAllUserData: true,
              });
            }
          }
        )
      } else if (this.data.activeIndex == 1 && this.data.loadAllLikeData == false && this.data.likeAlbumList) {
        wx.showLoading({
          title: '正在加载',
        })
        var page = this.data.likePage + 1;
        $.get(
          'album/like', {
            user_id: wx.getStorageSync('user_id'),
            page: page,
            pageSize: this.data.pageSize,
          },
          function (res) {
            if (res.data.data.likeAlbumList.length != 0) {
              var likeAlbumList = that.data.likeAlbumList;
              var newLikeAlbumList = res.data.data.likeAlbumList;

              for (var i = 0; i < newLikeAlbumList.length; i++) {
                likeAlbumList.push(newLikeAlbumList[i]);
              }
    
              that.setData({
                likeAlbumList: likeAlbumList,
                likePage: page,
              });
              wx.hideLoading();
            } else {
              wx.hideLoading();
              that.setData({
                loadAllLikeData: true,
              });
            }
          }
        )
      } else if (this.data.activeIndex == 2 && this.data.loadAllPayData == false && this.data.payAlbumList) {
        wx.showLoading({
          title: '正在加载',
        })
        var page = this.data.payPage + 1;
        $.get(
          'album/pay', {
            user_id: wx.getStorageSync('user_id'),
            page: page,
            pageSize: this.data.pageSize,
          },
          function (res) {
            if (res.data.data.payAlbumList.length != 0) {
              var payAlbumList = that.data.payAlbumList;
              for (var i = 0; i < Object.keys(res.data.data.payAlbumList).length; i++) {
                payAlbumList.push(res.data.data.payAlbumList[i]);
              }
              that.setData({
                payAlbumList: payAlbumList,
                payPage: page,
              });
              wx.hideLoading();
            } else {
              wx.hideLoading();
              that.setData({
                loadAllPayData: true,
              });
            }
          }
        )
      }
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 切换菜单
   */
  tabClick: function (e) {
    var that = this;
    if (this.data.menuFixed) {
      wx.pageScrollTo({
        scrollTop: 128,
        duration: 300
      })
    }
    if (e.currentTarget.id == 0) {
      that.refreshMyAlbum();
    } else if (e.currentTarget.id == 1) {
      that.refreshLikeAlbum();
    } else if (e.currentTarget.id == 2) {
      that.refreshPayAlbum();
    }
    that.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

  },

  /**
   * 监听页面滚动
   */
  onPageScroll: function (e) {
    if (e.scrollTop > this.data.menuTop) {
      this.setData({
        menuFixed: true,
      });
    } else if (e.scrollTop < this.data.menuTop) {
      this.setData({
        menuFixed: false,
      });
    }

  },

  /**
   * 打开相册
   */
  bindAlbum: function (event) {
    var album_id = event.currentTarget.dataset.album_id;
    var layout = event.currentTarget.dataset.layout;
    wx.navigateTo({
      url: '../../home/album/album?album_id=' + album_id + '&layout_model=' + layout,
    })
  },

  /**
   * 新建相册
   */
  bindNewAlbum: function (event) {
    if (this.data.userInfoServer['vip_type'] != 0) {
      wx.navigateTo({
        url: '../create/create',
      })
    } else {
      wx.showToast({
        title: '仅对VIP用户开放',
        icon: 'none',
      })
    }
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function (e) {
    var userInfo = e.detail.userInfo;
    var that = this;
    var isUpdate = 0;

    if (e.detail.errMsg != 'getUserInfo:fail auth deny') {
      // 用户拒绝
      if (wx.getStorageSync('userInfo')) {
        // 有数据
        var oldUserInfo = wx.getStorageSync('userInfo');
        var newUserInfo = e.detail.userInfo;

        if (newUserInfo['nickName'] == oldUserInfo['nickName'] &&
          newUserInfo['gender'] == oldUserInfo['gender'] &&
          newUserInfo['language'] == oldUserInfo['language'] &&
          newUserInfo['city'] == oldUserInfo['city'] &&
          newUserInfo['province'] == oldUserInfo['province'] &&
          newUserInfo['country'] == oldUserInfo['country'] &&
          newUserInfo['avatarUrl'] == oldUserInfo['avatarUrl']) {
          // 无需更新
          isUpdate = 0
        } else {
          // 需要更新
          isUpdate = 1
        }
      } else {
        // 需要更新
        isUpdate = 1
      }

      if (isUpdate == 1) {
        $.post(
          'user/user',
          {
            user_id: wx.getStorageSync('user_id'),
            userInfo: JSON.stringify(e.detail.userInfo)
          },
          function (res) {
            if (res.data.code == 200) {
              wx.showToast({
                title: '微信登录成功',
                icon: 'none',
                success: function () {
                  // 页面跳转
                  that.onReady()
                }
              })
              wx.setStorageSync('userInfo', e.detail.userInfo);
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
              wx.setStorageSync('userInfo', null);
            }
          }
        )
      }
    }
  },

  refreshMyAlbum: function() {
    var that = this;
    if (wx.getStorageSync('userInfo') != null && wx.getStorageSync('userInfo')) {
      // 获取我的相册列表
      $.get(
        'album/user', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              userAlbumList: res.data.data.userAlbumList,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )
    }
  },

  refreshLikeAlbum: function () {
    var that = this;
    if (wx.getStorageSync('userInfo') != null && wx.getStorageSync('userInfo')) {
      // 获取我的收藏列表
      $.get(
        'album/like', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              likeAlbumList: res.data.data.likeAlbumList,
            });
          } else {
            that.setData({
              likeAlbumList: null,
            });
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )
    }
  },

  refreshPayAlbum: function () {
    var that = this;
    if (wx.getStorageSync('userInfo') != null && wx.getStorageSync('userInfo')) {
      // 获取我的打赏列表
      $.get(
        'album/pay', {
          user_id: wx.getStorageSync('user_id'),
          page: 1,
          pageSize: this.data.pageSize,
        },
        function (res) {
          if (res.data.code == 200) {
            that.setData({
              payAlbumList: res.data.data.payAlbumList,
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      )
    }
  },
})