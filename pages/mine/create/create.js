// pages/mine/create/create.js
import $ from '../../../common/common.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPrivate: false,
    isPay: true,
    payMoney: 1,
    albumName: '',
    payArray: ['1元', '1.99元', '2元', '5元', '6.66元', '8.88元', '9.99元', '10元'],
    payArrayBK: ['100', '199', '200', '500', '666', '888', '999', '1000'],
    payIndex: 0,
    album_id: 0,
    albumInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.album_id) {
      wx.setNavigationBarTitle({
        title: '编辑图册'
      })
      this.setData({
        album_id: options.album_id,
      });
      wx.showLoading({
        title: '正在加载',
      })
      $.get(
        'album/album', {
          album_id: options.album_id,
          user_id: wx.getStorageSync('user_id'),
        },
        function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            if (res.data.data.albumInfo.length != 0) {
              var payIndex = 0;
              var payArrayBK = that.data.payArrayBK;
              for (var i = 0; i < payArrayBK.length; i++) {
                if (res.data.data.albumInfo['pay_money'] == payArrayBK[i]) {
                  payIndex = i;
                  break;
                }
              }
              that.setData({
                albumName: res.data.data.albumInfo.name,
                isPrivate: res.data.data.albumInfo.is_private,
                isPay: res.data.data.albumInfo.is_pay,
                payIndex: payIndex,
                albumInfo: res.data.data.albumInfo,
              });
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
            })
          }
        }
      )
    }

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  switchPrivate: function (e) {
    this.setData({
      isPrivate: e.detail.value,
    });
  },

  switchPay: function (e) {
    this.setData({
      isPay: e.detail.value,
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      payIndex: e.detail.value
    })
  },

  formSubmit: function (e) {
    var name = '';
    var is_private = 0;
    var is_pay = 0;
    var pay_money = 0;
    var that = this;
    var album_id = this.data.album_id;
    var albumInfo = this.data.albumInfo;

    if (e.detail.value.name != '') {
      name = e.detail.value.name;
      if (e.detail.value.is_private) {
        is_private = (e.detail.value.is_private == true) ? 1 : 0;
      }
      if (e.detail.value.is_pay) {
        is_pay = (e.detail.value.is_pay == true) ? 1 : 0;
      }
      if (e.detail.value.pay_money != undefined) {
        pay_money = this.data.payArrayBK[e.detail.value.pay_money];
      }

      if (album_id != 0) {
        // 编辑图册
        // 判断是否有改动
        if (name == albumInfo['name'] && is_private == albumInfo['is_private'] && is_pay == albumInfo['is_pay'] && pay_money == albumInfo['pay_money']) {
          wx.showToast({
            title: '未有任何修改',
            icon: 'none',
          })
        } else {
          // 修改图册
          $.put(
            'album/album',
            {
              user_id: wx.getStorageSync('user_id'),
              album_id: album_id,
              is_private: is_private,
              is_pay: is_pay,
              pay_money: pay_money,
              name: name,
            },
            function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'none',
                  success: function () {
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1,
                      })
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }
          )
        }
      } else {
        // 创建图册
        $.post(
          'album/album',
          {
            user_id: wx.getStorageSync('user_id'),
            is_private: is_private,
            is_pay: is_pay,
            pay_money: pay_money,
            name: name,
          },
          function (res) {
            if (res.data.code == 200) {
              wx.showToast({
                title: '图册创建成功',
                icon: 'none',
                success: function () {
                  // 页面跳转
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../../home/album/album?album_id=' + res.data.data.album_id + '&showAlbum=2',
                    })
                  }, 1500)
                }
              })
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none'
              })
            }
          }
        )
      }
    } else {
      wx.showToast({
        title: '图册名不能为空',
        icon: 'none'
      })
    }
  },

  bindDelete: function () {
    var that = this;
    var album_id = this.data.album_id;
    wx.showModal({
      title: '确认删除图册',
      content: '图册中所有图片将同时被删除',
      confirmColor: '#3878FF',
      success(res) {
        if (res.confirm) {
          $.delete(
            'album/album',
            {
              user_id: wx.getStorageSync('user_id'),
              album_id: album_id,
            },
            function (res) {
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  success: function () {
                    setTimeout(function () {
                      var pages = getCurrentPages();
                      var currPage = pages[pages.length - 1]; // 当前页面
                      var prevPage = pages[pages.length - 3]; // 上一级页面
                      // 直接调用上一级页面Page对象，存储数据到上一级页面中
                      prevPage.onReady();
                      wx.navigateBack({
                        delta: 2,
                      })
                    }, 1500)
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none'
                })
              }
            }
          )
        }
      }
    })
  }
})