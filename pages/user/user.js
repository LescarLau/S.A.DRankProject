const app = getApp();

Page({
  data: {
    isLogin: false,
    userInfo: null
  },

  onLoad: function () {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
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

  // 处理登录
  handleLogin: function () {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        
        // 模拟登录成功
        app.globalData.isLogin = true;
        app.globalData.userInfo = {
          ...userInfo,
          openId: 'user_' + Math.random().toString(36).substr(2, 9),
          totalDays: Math.floor(Math.random() * 100),
          bossCount: Math.floor(Math.random() * 5)
        };
        
        this.checkLoginStatus();
      },
      fail: (err) => {
        console.error('登录失败', err);
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 导航到我的场地
  navigateToMySpots: function () {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 导航到签到记录
  navigateToCheckInHistory: function () {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 显示关于信息
  showAbout: function () {
    wx.showModal({
      title: '关于我们',
      content: 'S.A.D Rank - 滑板场地签到排名小程序\n\n为滑板爱好者提供场地签到和排名服务',
      showCancel: false
    });
  }
});
