// pages/spotDetail/spotDetail.js
const app = getApp();

Page({
  data: {
    spotId: null,
    spot: null,
    isLogin: false,
    userInfo: null,
    userCheckedIn: false,
    checkInRanking: []
  },

  onLoad: function (options) {
    const spotId = parseInt(options.id);
    this.setData({ spotId });
    
    this.checkLoginStatus();
    this.loadSpotDetail(spotId);
    this.loadCheckInRanking(spotId);
    this.checkUserCheckInStatus(spotId);
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

  // 加载Spot详情
  loadSpotDetail: function (spotId) {
    // 从全局数据中查找
    const spot = app.globalData.spots.find(s => s.id === spotId);
    
    if (spot) {
      this.setData({ spot });
    } else {
      // 从API获取
      wx.request({
        url: `https://your-api-url/spots/${spotId}`,
        method: 'GET',
        success: (res) => {
          this.setData({ spot: res.data });
        }
      });
      
      // 模拟数据
      const mockSpot = {
        id: spotId,
        name: '三里屯滑板公园',
        address: '北京市朝阳区三里屯',
        latitude: 39.938227,
        longitude: 116.454789,
        checkInCount: 156,
        description: '这是一个位于三里屯的滑板公园，设施完善，地面平整，适合各种技巧练习。',
        bossUser: {
          id: 'user123',
          nickName: '滑板达人',
          avatarUrl: '/images/default-avatar.png',
          checkInCount: 42
        }
      };
      
      this.setData({ spot: mockSpot });
    }
  },

  // 加载签到排行
  loadCheckInRanking: function (spotId) {
    // 从API获取
    wx.request({
      url: `https://your-api-url/ranking/spot/${spotId}`,
      method: 'GET',
      success: (res) => {
        this.setData({ checkInRanking: res.data });
      }
    });
    
    // 模拟数据
    const mockRanking = [];
    for (let i = 1; i <= 10; i++) {
      mockRanking.push({
        rank: i,
        userId: `user${i}`,
        nickName: `滑板玩家${i}`,
        avatarUrl: '/images/default-avatar.png',
        checkInCount: Math.floor(Math.random() * 50) + 1,
        isBoss: i === 1
      });
    }
    
    // 按签到次数排序
    mockRanking.sort((a, b) => b.checkInCount - a.checkInCount);
    
    // 更新排名
    mockRanking.forEach((item, index) => {
      item.rank = index + 1;
      item.isBoss = index === 0;
    });
    
    this.setData({ checkInRanking: mockRanking });
  },

  // 检查用户今日是否已签到
  checkUserCheckInStatus: function (spotId) {
    if (!this.data.isLogin) return;
    
    // 从API获取
    wx.request({
      url: `https://your-api-url/checkin/status`,
      method: 'GET',
      data: {
        userId: this.data.userInfo.openId,
        spotId: spotId,
        date: new Date().toISOString().split('T')[0]
      },
      success: (res) => {
        this.setData({ userCheckedIn: res.data.checked });
      }
    });
    
    // 模拟数据 - 随机设置签到状态
    this.setData({ userCheckedIn: Math.random() > 0.5 });
  },

  // 签到按钮点击事件
  handleCheckIn: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    if (this.data.userCheckedIn) {
      wx.showToast({
        title: '今日已签到',
        icon: 'none'
      });
      return;
    }
    
    const spot = this.data.spot;
    
    // 计算用户与Spot的距离
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const distance = this.calculateDistance(
          res.latitude, res.longitude,
          spot.latitude, spot.longitude
        );
        
        // 如果距离超过200米，提示用户靠近Spot
        if (distance > 0.2) {
          wx.showToast({
            title: '请靠近滑板场地再签到',
            icon: 'none'
          });
          return;
        }
        
        // 发送签到请求
        wx.request({
          url: 'https://your-api-url/checkin',
          method: 'POST',
          data: {
            userId: this.data.userInfo.openId,
            spotId: spot.id,
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: (res) => {
            if (res.data.success) {
              wx.showToast({
                title: '签到成功',
                icon: 'success'
              });
              
              // 更新签到状态和排行榜
              this.setData({ userCheckedIn: true });
              this.loadSpotDetail(this.data.spotId);
              this.loadCheckInRanking(this.data.spotId);
            } else {
              wx.showToast({
                title: res.data.message || '签到失败',
                icon: 'none'
              });
            }
          }
        });
        
        // 模拟签到成功
        wx.showToast({
          title: '签到成功',
          icon: 'success'
        });
        
        this.setData({ userCheckedIn: true });
        
        // 刷新数据
        setTimeout(() => {
          this.loadSpotDetail(this.data.spotId);
          this.loadCheckInRanking(this.data.spotId);
        }, 1500);
      }
    });
  },

  // 计算两点之间的距离（单位：公里）
  calculateDistance: function (lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c;
    return distance;
  },

  // 角度转弧度
  deg2rad: function (deg) {
    return deg * (Math.PI/180);
  },

  // 导航按钮点击事件
  handleNavigation: function () {
    const spot = this.data.spot;
    
    wx.openLocation({
      latitude: spot.latitude,
      longitude: spot.longitude,
      name: spot.name,
      address: spot.address,
      scale: 18
    });
  }
});