// pages/mine/upload/upload.js
import config from '../../../common/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: [

    ],
    imageProgressList: [],
    album_id: 0,
    uploadAction: 0,
    from_type: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imageProgressList = [];
    if (options.imageList) {
      var imageList = JSON.parse(options.imageList);
      for (var i = 0; i < imageList.length; i++) {
        imageProgressList[i] = 0;
      }
    } else {
      var imageList = [];
      var imageProgressList = [];
    }

    if (options.album_id) {
      var album_id = options.album_id;
    } else {
      var album_id = 0;
    }

    if (options.from_type) {
      var from_type = options.from_type;
    } else {
      var from_type = 0;
    }

    if (imageList && album_id) {
      this.setData({
        'album_id': album_id,
        'imageList': imageList,
        'imageProgressList': imageProgressList,
        'from_type': from_type,
      });
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

  bindChooseImage: function (event) {
    var album_id = this.data.album_id;
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],

      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imageList = that.data.imageList;
        var imageProgressList = that.data.imageProgressList;
        for (var i = 0; i < tempFilePaths.length; i++) {
          imageList.push(tempFilePaths[i]);
          imageProgressList.push(0);
        }
        that.setData({
          imageList: imageList,
          imageProgressList: imageProgressList,
        });
      }
    })
  },


  bindUpload: function (event) {
    var that = this;
    var album_id = this.data.album_id;
    var from_type = this.data.from_type;
    if (this.data.imageList.length == 0) {
      wx.showToast({
        title: '清先添加图片',
        icon: 'none',
      })
      return;
    }

    this.setData({
      uploadAction: 1,
    });
    wx.showNavigationBarLoading();
    var arr = [];
    for (var i = 0; i < this.data.imageList.length; i++) {
      arr.push(this.uploadImg);
    }

    var temp
    temp = arr[0](0)
    for (let i = 1; i <= arr.length; i++) {
      if (i == arr.length) {
        temp.then(result => {
          wx.hideNavigationBarLoading();
          wx.showToast({
            title: '上传成功',
            success: function () {
              setTimeout(function () {
                if (from_type == 1) {
                  wx.navigateBack({
                    delta: 1,
                  })
                } else {
                  wx.navigateBack({
                    delta: 2,
                    complete: function () {
                      wx.navigateTo({
                        url: '../../home/album/album?album_id=' + album_id + '&showAlbum=1' + '&layout_model=1' + '&from_type=1',
                      })
                    }
                  })
                }
              }, 1500)
            }
          })
        })

        break;
      }
      temp = temp.then((result) => {
        return arr[i - 1](i)
      });
    }

  },

  uploadImg: function (index) {
    var album_id = this.data.album_id;
    var imageList = this.data.imageList;
    var imageProgressList = this.data.imageProgressList;
    var that = this;

    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: config.server + 'image/image', //仅为示例，非真实的接口地址
        filePath: imageList[index],
        name: 'image',
        header: { 'Content-Type': 'multipart/form-data' },
        formData: {
          'album_id': album_id
        },
        success: function (res) {
          resolve(res.data);
        },
        fail: function (err) {
          reject(new Error('failed to upload file'));
        }
      });

      uploadTask.onProgressUpdate((res) => {
        imageProgressList[index] = res.progress;
        that.setData({
          imageProgressList: imageProgressList
        });
      })
    })
  },


  bindPreviewImage: function (event) {
    var image_index = event.currentTarget.dataset.image_index;

    wx.previewImage({
      current: this.data.imageList[image_index], // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  },

  longPressImage: function (event) {
    var that = this;
    var image_index = event.currentTarget.dataset.image_index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      itemColor: '#FF0000',
      success(res) {
        if (res.tapIndex == 0) {
          var imageList = that.data.imageList;
          imageList.splice(image_index, 1);
          that.setData({
            'imageList': imageList,
          })
        }
      }
    })
  }
})