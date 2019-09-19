//app.js
import $ from 'common/common.js';
App({
  onLaunch: function() {
    var that = this;
    // 设置默认布局方式
    if (!wx.getStorageSync('default_layout')) {
      wx.setStorageSync('default_layout', 2);
    }

    // 获取系统信息
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.globalData.systemInfo = res
        if (res.statusBarHeight > 20) {
          that.globalData.isFullSucreen = true
        }
      }
    });

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        $.post(
          'login/login', {
            code: res.code,
          },
          function(res) {
            console.log(res);
            if (res.data.code == 200) {
              wx.setStorageSync('user_id', res.data.data.user_id)
            } else {
              wx.showToast({
                title: res.data.data.message,
                icon: 'none',
              })
              wx.setStorageSync('user_id', 0)
            }
          }
        )
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo);
              var userInfo = res.userInfo;
              $.post(
                'user/user', {
                  user_id: wx.getStorageSync('user_id'),
                  userInfo: JSON.stringify(userInfo)
                },
                function(res) {
                  console.log(res);
                  if (res.data.code == 200) {
                    wx.setStorageSync('userInfo', userInfo);
                  } else {
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none'
                    })
                    wx.setStorageSync('userInfo', null);
                  }
                }
              )
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    systemInfo: [],
    isFullSucreen: false, // 当前设备是否为 FullSucreen
  }
})