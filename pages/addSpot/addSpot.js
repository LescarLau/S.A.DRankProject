// pages/addSpot/addSpot.js
const app = getApp();

Page({
  data: {
    latitude: 39.908823,
    longitude: 116.397470,
    address: '',
    name: '',
    description: '',
    isSubmitting: false
  },

  onLoad: function (options) {
    this.getUserLocation();
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
        
        // 根据经纬度获取地址信息
        this.getAddressByLocation(res.latitude, res.longitude);
      }
    });
  },

  // 根据经纬度获取地址
  getAddressByLocation: function (latitude, longitude) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: '您的腾讯地图开发者密钥', // 需要替换为实际的密钥
        get_poi: 0
      },
      success: (res) => {
        if (res.data.status === 0) {
          const address = res.data.result.address;
          this.setData({ address });
        }
      }
    });
    
    // 模拟地址数据
    this.setData({
      address: '北京市朝阳区三里屯街道'
    });
  },

  // 地图点击事件，更新位置
  mapTap: function (e) {
    const { latitude, longitude } = e.detail;
    
    this.setData({
      latitude,
      longitude
    });
    
    // 更新地址信息
    this.getAddressByLocation(latitude, longitude);
  },

  // 输入框内容变化事件
  inputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  // 提交表单
  submitForm: function () {
    const { name, address, description, latitude, longitude } = this.data;
    
    // 表单验证
    if (!name.trim()) {
      wx.showToast({
        title: '请输入Spot名称',
        icon: 'none'
      });
      return;
    }
    
    if (!address.trim()) {
      wx.showToast({
        title: '请输入地址信息',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ isSubmitting: true });
    
    // 发送请求添加新Spot
    wx.request({
      url: 'https://your-api-url/spots',
      method: 'POST',
      data: {
        name,
        address,
        description,
        latitude,
        longitude,
        creatorId: app.globalData.userInfo.openId
      },
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: '添加成功',
            icon: 'success'
          });
          
          // 返回地图页面
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '添加失败',
            icon: 'none'
          });
        }
      },
      complete: () => {
        this.setData({ isSubmitting: false });
      }
    });
    
    // 模拟添加成功
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
    
    setTimeout(() => {
      this.setData({ isSubmitting: false });
      wx.navigateBack();
    }, 1500);
  }
});