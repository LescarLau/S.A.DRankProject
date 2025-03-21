// app.js
var QQMapWX = require('/libs/qqmap-wx-jssdk.min.js')

App({
  onLaunch: function () {
    // 检查用户登录状态
    this.checkLoginStatus();
    
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
    }
  },

  // 用户登录方法
  userLogin: function(callback) {
    const that = this;
    wx.login({
      success: (res) => {
        if (res.code) {
          // 获取用户信息
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: (profileRes) => {
              const userInfo = profileRes.userInfo;
              
              // 这里应该发送code到后端换取openid和session_key
              // 示例代码，实际开发需要替换为真实接口调用
              wx.request({
                url: 'https://your-api-url/login',
                method: 'POST',
                data: {
                  code: res.code,
                  userInfo: userInfo
                },
                success: (loginRes) => {
                  // 保存用户信息
                  that.globalData.userInfo = userInfo;
                  that.globalData.isLogin = true;
                  wx.setStorageSync('userInfo', userInfo);
                  
                  if (callback) {
                    callback(userInfo);
                  }
                }
              });
            },
            fail: (err) => {
              console.error('获取用户信息失败', err);
            }
          });
        } else {
          console.error('登录失败', res.errMsg);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    isLogin: false,
    systemInfo: null,
    spots: [] // 存储滑板Spot数据
  }
});
