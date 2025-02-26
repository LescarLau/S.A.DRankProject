const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk

// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: '周日，2月26日',
    markers: '',
    poi: {
      latitude: '',
      longitude: ''
    },
    addressName: '',
    time: '',
    timer: '',
    timer2: '',  // 用来每个一段时间自动刷新一次定位
    canClick: true
  },

  getAddress(e) {
    var that = this;
    qqmapsdk.reverseGeocoder({
      success: function(res) {
        // console.log(res);
        that.setData({
          addressName: res.result.address
        })
        var res = res.result;
        var mks = [];
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../images/zcxj/myPosition.png', // 图标路径
          width: 21,
          height: 28,
        });
        that.setData({ // 设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.updateTime();
    this.getAddress();

    this.setData({
      canClick: true, // 允许用户点击，防止多次提交
      timer2: setInterval(function () {
        this.getAddress()
      }, 20000)  // 每20秒刷新一次定位
    })
  },

  updateTime: function() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const currentTime = `${this.formatNumber(hours)}:${this.formatNumber(minutes)}:${this.formatNumber(seconds)}`;
    this.setData({
      currentTime: currentTime
    });
  },
  formatNumber: function(n) {
    return n < 10 ? '0' + n : n;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})