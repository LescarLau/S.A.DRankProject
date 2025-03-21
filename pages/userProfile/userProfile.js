// pages/userProfile/userProfile.js
const app = getApp();

Page({
  data: {
    userInfo: null,
    isLogin: false,
    checkInStats: {
      totalDays: 0,
      totalSpots: 0,
      bossSpots: 0
    }
  },

  onLoad: function (options) {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
    if (this.data.isLogin) {
      this.getUserCheckInStats();
    }
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const isLogin = app.globalData.isLogin;
    const userInfo = app.globalData.userInfo;
    
    this.setData({
      isLogin: isLogin,
      userInfo: userInfo
    });
  },

  // 登录按钮点击事件
  handleLogin: function () {
    app.userLogin((userInfo) => {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
      this.getUserCheckInStats();
    });
  },

  // 获取用户签到统计
  getUserCheckInStats: function () {
    // 这里应该调用后端API获取用户签到统计数据
    // 示例代码，实际开发需要替换为真实接口调用
    wx.request({
      url: 'https://your-api-url/user/stats',
      method: 'GET',
      data: {
        userId: app.globalData.userInfo.openId
      },
      success: (res) => {
        this.setData({
          checkInStats: res.data
        });
      }
    });
    
    // 模拟数据
    this.setData({
      checkInStats: {
        totalDays: 42,
        totalSpots: 15,
        bossSpots: 3
      }
    });
  }
});