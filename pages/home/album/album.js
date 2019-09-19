// pages/home/album/album.js
import $ from '../../../common/common.js';
import config from '../../../common/config.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumInfo: [],
    menuButtonInfoData: [],
    systemInfo: [],
    imageList: [],
    imageUrlList: [],
    isPay: 0,
    payAlbum: 0,
    album_id: 1,
    showAlbum: 1, // 0空白，1图片，2上传
    batchOperation: false, //1表示批量操作
    layoutModel: 2, // 1正常布局，2流式布局
    page: 1,
    pageSize: 20,
    totalImage: 0,
    loadAllData: false,
    checkNum: 0,
    authorUser: 0, // 是否是作者
    from_type: 0,  // 页面来源，1为从创建图册来
    select_all: false, // 全选/全不选
    isFullSucreen: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var album_id = options.album_id;
    // 布局方式
    if (options.layout_model) {
      var default_layout = options.layout_model;
    } else {
      var default_layout = wx.getStorageSync('default_layout');
    }

    if (options.showAlbum) {
      var showAlbum = options.showAlbum;
    } else {
      var showAlbum = 1;
    }

    /**
     * 获取手机系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          'systemInfo': res,
          'menuButtonInfoData': wx.getMenuButtonBoundingClientRect()
        });
      }
    });

    that.setData({
      'album_id': album_id,
      'layoutModel': default_layout,
      'showAlbum': showAlbum,
      'isFullSucreen': app.globalData.isFullSucreen,
    });

    // 增加查看次数
    $.put(
      'album/viewtimes', {
        album_id: this.data.album_id,
      }
    )
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
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })

    var that = this;
    var thats = this;
    var authorUser = 0;
    
    $.get(
      'album/images', {
        page: this.data.page,
        pageSize: this.data.pageSize,
        album_id: this.data.album_id,
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        if (res.data.code == 200) {
          var imageList = res.data.data.imageList;
          if (wx.getStorageSync('user_id') == res.data.data.albumInfo['user_id']) {
            authorUser = 1;
          }
          that.setData({
            imageList: imageList,
            isPay: res.data.data.isPay,
            payAlbum: res.data.data.payAlbum,
            albumInfo: res.data.data.albumInfo,
            authorUser: authorUser
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
    )

    $.get(
      'album/urls', {
        album_id: this.data.album_id,
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        if (res.data.code == 200) {
          that.setData({
            imageUrlList: res.data.data.imageUrlList,
            totalImage: res.data.data.imageUrlList.length,
          });
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
        'album/images', {
          page: page,
          pageSize: this.data.pageSize,
          user_id: wx.getStorageSync('user_id'),
          album_id: this.data.album_id,
        },
        function (res) {
          if (res.data.data.imageList.length != 0) {
            var imageList = that.data.imageList;
            var newImageList = res.data.data.imageList;
            for (var i = 0; i < newImageList.length; i++) {
              imageList.push(newImageList[i]);
            }
            that.setData({
              imageList: imageList,
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
  onShareAppMessage: function (res) {
    var albumInfo = this.data.albumInfo;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: albumInfo['name'],
      path: '/pages/home/album/album?album_id=' + this.data.album_id,
      imageUrl: this.data.albumInfo['cover_url'],
    }
  },

  /**
   * 查看图片详情
   */
  bindPreviewImage: function (event) {
    var image_index = event.currentTarget.dataset.image_index;
    wx.previewImage({
      current: this.data.imageUrlList[image_index],    // 当前显示图片的http链接
      urls: this.data.imageUrlList                     // 需要预览的图片http链接列表
    })
  },

  /**
   * 收藏图册
   */
  bindLike: function (event) {
    var that = this;
    var album_id = this.data.album_id;
    $.put(
      'album/like', {
        user_id: wx.getStorageSync('user_id'),
        album_id: album_id,
      },
      function (res) {
        if (res.data.code == 201) {
          var albumInfo = that.data.albumInfo;
          if (albumInfo['is_collect'] == 0) {
            albumInfo['like_num'] = albumInfo['like_num'] + 1;
          } else if (albumInfo['is_collect'] == 1) {
            albumInfo['like_num'] = albumInfo['like_num'] - 1;
          }
          albumInfo['is_collect'] = !albumInfo['is_collect'];
          that.setData({
            albumInfo: albumInfo,
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
        }
      }
    )
  },

  /**
   * 返回上级页面
   */
  bindReturn: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 打开/关闭批量操作
   */
  bindBatch: function () {
    var imageList = this.data.imageList;
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i]['checked'] == true) {
        imageList[i]['checked'] = false;
      }
    }
    this.setData({
      batchOperation: !this.data.batchOperation,
      checkNum: 0,
      imageList: imageList,
    });
  },

  /**
   * 切换视图
   */
  bindChangeLayout: function () {
    var newLayoutModel = 2;
    if (this.data.layoutModel == 1) {
      newLayoutModel = 2;
      wx.setStorageSync('default_layout', 2);
    } else if (this.data.layoutModel == 2) {
      newLayoutModel = 1;
      wx.setStorageSync('default_layout', 1);
    }
    this.setData({
      layoutModel: newLayoutModel
    });
  },

  /**
   * 批量选择图片
   */
  bindRadio: function (e) {
    var imageList = this.data.imageList;
    var checkNum = 0;
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i]['image_id'] == e.currentTarget.dataset.image_id) {
        if (imageList[i]['checked'] == true) {
          imageList[i]['checked'] = false;
        } else if (imageList[i]['checked'] == false) {
          imageList[i]['checked'] = true;
        }
      }
    }
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i]['checked'] == true) {
        checkNum++;
      }
    }
    this.setData({
      imageList: imageList,
      checkNum: checkNum,
    });
  },

  /**
   * 打赏图册
   */
  bindPayMoney: function (e) {
    var that = this;
    $.get(
      'wxpay/pay', {
        album_id: this.data.album_id,
        user_id: wx.getStorageSync('user_id'),
      },
      function (res) {
        if (res.data.code == 200) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.packages,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              if (res.errMsg == 'requestPayment:ok') {
                $.post(
                  'album/pay', {
                    user_id: wx.getStorageSync('user_id'),
                    album_id: that.data.album_id,
                  },
                  function (res) {
                    if (res.data.code == 200) {
                      that.setData({
                        isPay: 1,
                      });
                      wx.showToast({
                        title: '打赏成功',
                        success: function () {
                          setTimeout(function () {
                            that.onShow();
                          }, 3000)
                        }
                      })
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
            fail(res) {
              wx.showToast({
                title: '微信支付调用失败',
                icon: 'none',
              })
            }
          })
        } else {
          wx.showToast({
            title: '微信支付调用失败',
            icon: 'none'
          })
        }
      }
    )
  },

  /**
   * 选择图片，准备上传
   */
  bindChooseImage: function (event) {
    var album_id = this.data.album_id;
    var from_type = event.currentTarget.dataset.from_type;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.navigateTo({
          url: '../../mine/upload/upload?album_id=' + album_id + '&imageList=' + JSON.stringify(tempFilePaths) + '&from_type=' + from_type,
        })
      }
    })
  },

  /**
   * 编辑图册信息
   */
  bindEditAlbum: function () {
    var album_id = this.data.album_id;
    wx.navigateTo({
      url: '../../mine/create/create?album_id=' + album_id,
    })
  },

  /**
   * 批量删除
   */
  bindBatchDelete: function () {
    var imageList = this.data.imageList;
    var imageIdList = [];
    var that = this;
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i]['checked'] == true) {
        imageIdList.push(imageList[i]['image_id']);
      }
    }
    if(imageIdList.length == 0){
      wx.showToast({
        title: '请先选择图片',
        icon: 'none',
      })
    }else {
      $.delete(
        'album/images',
        {
          user_id: wx.getStorageSync('user_id'),
          album_id: this.data.album_id,
          imageIdList: JSON.stringify(imageIdList)
        },
        function (res) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '批量删除成功',
              icon: 'none',
              success: function () {
                // 关闭批量管理模式
                that.setData({
                  batchOperation: false,
                });
                // 刷新页面数据
                setTimeout(function () {
                  that.onShow();
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
  },

  /**
   * 批量下载
   */
  bindBatchDown: function() {
    var imageList = this.data.imageList;
    var imageIndexList = [];
    var that = this;
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i]['checked'] == true) {
        imageIndexList.push(i);
      }
    }
    if (imageIndexList.length == 0) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none',
      })
    } else {
      wx.showLoading({
        title: '开始后台保存中',
        duration: 5000
      })
      var imageUrlList = this.data.imageUrlList;
      for(var i=0; i<imageIndexList.length;i++) {
        wx.downloadFile({
          url: imageUrlList[imageIndexList[i]], 
          success(res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) { 
                  
                },
                fail: function (res) {
                  wx.showToast({
                    title: '保存失败',
                  })
                }
              })
            }
          }
        })
      }
      that.setData({
        batchOperation: false,
      });
    }
  },

  bindSelectAll: function() {
    var select_all = this.data.select_all;
    var imageList = this.data.imageList;
    var checkNum = 0;
    if(select_all == false) {
      // 全选
      for (var i = 0; i < imageList.length; i++) {
        imageList[i]['checked'] = true;
      }
      this.setData({
        imageList: imageList,
        checkNum: imageList.length,
        select_all: true,
      })
    }else {
      // 全不选
      for (var i = 0; i < imageList.length; i++) {
        imageList[i]['checked'] = false;
      }
      this.setData({
        imageList: imageList,
        checkNum: 0,
        select_all: false,
      })
    }
  },

  // 设置新的封面图片
  bindSetCover: function() {
    var that = this;
    var imageId = 0;
    var imageUrl = '';
    var selectNum = 0;
    var album_id = this.data.album_id;
    var imageList = this.data.imageList;
    var cover_url = this.data.albumInfo.cover_url + '?imageMogr/v2/auto-orient/thumbnail/!80p/quality/80/interlace/1';
    for (var i = 0; i < imageList.length; i++) {
      if (imageList[i]['checked'] == true) {
        imageId = imageList[i]['image_id'];
        imageUrl = imageList[i]['image_url'];
        selectNum++;
      }
      if(selectNum > 1) {
        break;
      }
    }
    if(selectNum == 0) {
      wx.showToast({
        title: '请选择一张图片',
        icon: 'none'
      })
    }else if(selectNum > 1) {
      // 超过一张
      wx.showToast({
        title: '封面图最多选一张',
        icon: 'none'
      })
    } else if (cover_url == imageUrl) {
      wx.showToast({
        title: '与现有封面重复',
        icon: 'none'
      })
    }else {
      // 设为封面
      wx.showLoading({
        title: '正在设置',
      })
      $.put(
        'album/cover', {
          user_id: wx.getStorageSync('user_id'),
          album_id: album_id,
          image_id: imageId,
        },
        function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.showToast({
              title: '设置成功',
              icon: 'none',
              success: function () {
                // 关闭批量管理模式
                that.setData({
                  batchOperation: false,
                });
                // 刷新页面数据
                setTimeout(function () {
                  that.onShow();
                }, 1500)
              }
            })
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

  dow_temp: function (str, i, all_n, callback) {
    var that = this;
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
      success() {
        // 用户已经同意小程序使
        const downloadTask = wx.downloadFile({
          url: str,
          success: function (res) {
            var temp = res.tempFilePath
            wx.saveImageToPhotosAlbum({
              filePath: temp,
              success: function () {
              },
              fail: function () {
                wx.showToast({
                  title: '第' + i + '下载失败',
                })
              }
            })
          },
          fail: function (res) {
            wx.showToast({
              title: '下载失败',
            })
          }
        })

        downloadTask.onProgressUpdate((res) => {
          if (res.progress == 100) {
            callback(res.progress);
            var count = that.data.percent_n;//统计下载多少次了
            that.setData({
              percent_n: count + 1
            })
            if (that.data.percent_n == all_n) {//判断是否下载完成
              that.setData({//完成后，清空percent-N,防止多次下载后，出错
                percent_n: 0
              })
              that.dowNum();
            }
          }
        })

      },
      fail: function () {
        wx.showToast({
          title: '获取授权失败',
        })
      }
    })
  },

})