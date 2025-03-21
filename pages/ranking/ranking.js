// pages/ranking/ranking.js
const app = getApp();

Page({
  data: {
    activeTab: 0, // 0: 总榜, 1: 地点榜
    totalRanking: [],
    spotRanking: [],
    spots: [],
    currentSpotId: 0,
    currentSpotName: ''  // 添加这个属性
  },

  // 修改 changeSpot 方法
  changeSpot: function (e) {
    const spotId = parseInt(e.detail.value);
    const spot = this.data.spots[e.detail.value];
    this.setData({ 
      currentSpotId: spotId,
      currentSpotName: spot ? spot.name : ''
    });
    this.loadSpotRanking(spotId);
  },

  // 在加载spots后更新当前spot名称
  loadSpots: function () {
    // 使用全局存储的Spot数据
    const spots = app.globalData.spots || [];
    
    if (spots.length > 0) {
      this.setData({
        spots: spots,
        currentSpotId: spots[0].id
      });
      
      // 如果当前是地点榜，加载第一个Spot的排行
      if (this.data.activeTab === 1) {
        this.loadSpotRanking(spots[0].id);
      }
    } else {
      // 如果全局没有Spot数据，从API获取
      wx.request({
        url: 'https://your-api-url/spots',
        method: 'GET',
        success: (res) => {
          const spots = res.data;
          this.setData({
            spots: spots,
            currentSpotId: spots.length > 0 ? spots[0].id : 0
          });
          
          // 如果当前是地点榜，加载第一个Spot的排行
          if (this.data.activeTab === 1 && spots.length > 0) {
            this.loadSpotRanking(spots[0].id);
          }
        }
      });
      
      // 模拟数据
      const mockSpots = [
        {
          id: 1,
          name: '三里屯滑板公园'
        },
        {
          id: 2,
          name: '奥林匹克公园滑板场'
        }
      ];
      
      this.setData({
        spots: mockSpots,
        currentSpotId: mockSpots[0].id
      });
      
      // 如果当前是地点榜，加载第一个Spot的排行
      if (this.data.activeTab === 1) {
        this.loadSpotRanking(mockSpots[0].id);
      }
    }
  },

  onLoad: function (options) {
    this.loadTotalRanking();
    this.loadSpots();
  },

  onShow: function () {
    // 刷新数据
    this.loadTotalRanking();
    if (this.data.activeTab === 1 && this.data.currentSpotId) {
      this.loadSpotRanking(this.data.currentSpotId);
    }
  },

  // 切换标签
  switchTab: function (e) {
    const tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({ activeTab: tab });
    
    if (tab === 0) {
      this.loadTotalRanking();
    } else if (tab === 1 && this.data.spots.length > 0) {
      // 默认加载第一个Spot的排行
      const spotId = this.data.currentSpotId || this.data.spots[0].id;
      this.loadSpotRanking(spotId);
    }
  },

  // 加载总榜数据
  loadTotalRanking: function () {
    // 这里应该调用后端API获取总榜数据
    // 示例代码，实际开发需要替换为真实接口调用
    wx.request({
      url: 'https://your-api-url/ranking/total',
      method: 'GET',
      success: (res) => {
        this.setData({
          totalRanking: res.data
        });
      }
    });
    
    // 模拟数据
    const mockRanking = [];
    for (let i = 1; i <= 50; i++) {
      mockRanking.push({
        rank: i,
        userId: `user${i}`,
        nickName: `滑板玩家${i}`,
        avatarUrl: '/images/default-avatar.png',
        checkInDays: Math.floor(Math.random() * 100) + 1
      });
    }
    
    // 按签到天数排序
    mockRanking.sort((a, b) => b.checkInDays - a.checkInDays);
    
    // 更新排名
    mockRanking.forEach((item, index) => {
      item.rank = index + 1;
    });
    
    this.setData({
      totalRanking: mockRanking
    });
  },

  // 加载地点榜数据
  loadSpotRanking: function (spotId) {
    // 这里应该调用后端API获取地点榜数据
    // 示例代码，实际开发需要替换为真实接口调用
    wx.request({
      url: `https://your-api-url/ranking/spot/${spotId}`,
      method: 'GET',
      success: (res) => {
        this.setData({
          spotRanking: res.data
        });
      }
    });
    
    // 模拟数据
    const mockRanking = [];
    for (let i = 1; i <= 20; i++) {
      mockRanking.push({
        rank: i,
        userId: `user${i}`,
        nickName: `滑板玩家${i}`,
        avatarUrl: '/images/default-avatar.png',
        checkInCount: Math.floor(Math.random() * 50) + 1,
        isBoss: i === 1 // 第一名为扛把子
      });
    }
    
    // 按签到次数排序
    mockRanking.sort((a, b) => b.checkInCount - a.checkInCount);
    
    // 更新排名
    mockRanking.forEach((item, index) => {
      item.rank = index + 1;
      item.isBoss = index === 0;
    });
    
    this.setData({
      spotRanking: mockRanking
    });
  }
});