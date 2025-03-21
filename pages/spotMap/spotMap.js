// pages/spotMap/spotMap.js
const app = getApp();

Page({
  data: {
    latitude: 39.908823,  // 默认纬度
    longitude: 116.397470, // 默认经度
    scale: 14,
    markers: [],
    isLogin: false,
    userInfo: null,
    currentSpot: null,
    showSpotInfo: false
  },

  onLoad: function (options) {
    this.checkLoginStatus();
    this.getUserLocation();
    this.loadSpots();
  },

  onShow: function () {
    this.checkLoginStatus();
    // 刷新Spot数据
    this.loadSpots();
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

  // 获取用户位置
  getUserLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        console.error('获取位置失败', err);
        wx.showToast({
          title: '获取位置失败，请检查权限设置',
          icon: 'none'
        });
      }
    });
  },

  // 加载滑板Spot数据
  loadSpots: function () {
    // 这里应该调用后端API获取Spot数据
    // 示例代码，实际开发需要替换为真实接口调用
    wx.request({
      url: 'https://your-api-url/spots',
      method: 'GET',
      success: (res) => {
        const spots = res.data;
        const markers = this.convertSpotsToMarkers(spots);
        
        this.setData({
          markers: markers
        });
        
        app.globalData.spots = spots;
      }
    });
    
    // 模拟数据
    const mockSpots = [
      {
        id: 1,
        name: '三里屯滑板公园',
        latitude: 39.938227,
        longitude: 116.454789,
        address: '北京市朝阳区三里屯',
        checkInCount: 156,
        bossUser: {
          id: 'user123',
          nickName: '滑板达人',
          avatarUrl: '/images/default-avatar.png',
          checkInCount: 42
        }
      },
      {
        id: 2,
        name: '奥林匹克公园滑板场',
        latitude: 39.992842,
        longitude: 116.396862,
        address: '北京市朝阳区奥林匹克公园',
        checkInCount: 89,
        bossUser: {
          id: 'user456',
          nickName: '滑板少年',
          avatarUrl: '/images/default-avatar.png',
          checkInCount: 23
        }
      }
    ];
    
    const markers = this.convertSpotsToMarkers(mockSpots);
    this.setData({
      markers: markers
    });
    
    app.globalData.spots = mockSpots;
  },

  // 将Spot数据转换为地图标记点
  convertSpotsToMarkers: function (spots) {
    return spots.map((spot, index) => {
      return {
        id: spot.id,
        latitude: spot.latitude,
        longitude: spot.longitude,
        width: 30,
        height: 30,
        callout: {
          content: spot.name,
          color: '#000000',
          fontSize: 12,
          borderRadius: 4,
          padding: 5,
          display: 'BYCLICK'
        }
      };
    });
  },

  // 标记点点击事件
  markerTap: function (e) {
    const markerId = e.markerId;
    const spot = app.globalData.spots.find(item => item.id === markerId);
    
    if (spot) {
      this.setData({
        currentSpot: spot,
        showSpotInfo: true
      });
    }
  },

  // 关闭Spot信息面板
  closeSpotInfo: function () {
    this.setData({
      showSpotInfo: false
    });
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
    
    const spot = this.data.currentSpot;
    
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
              
              // 刷新Spot数据
              this.loadSpots();
            } else {
              wx.showToast({
                title: res.data.message || '今日已签到',
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
        
        // 关闭信息面板
        setTimeout(() => {
          this.setData({
            showSpotInfo: false
          });
          
          // 刷新Spot数据
          this.loadSpots();
        }, 1500);
      }
    });
  },

  // 计算两点之间的距离（单位：公里）
  calculateDistance: function (lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径，单位km
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
    const spot = this.data.currentSpot;
    wx.openLocation({
      latitude: spot.latitude,
      longitude: spot.longitude,
      name: spot.name,
      address: spot.address,
      scale: 18
    });
  },

  // 添加新Spot按钮点击事件
  addNewSpot: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/addSpot/addSpot'
    });
  }
});