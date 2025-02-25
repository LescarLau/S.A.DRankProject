// app.js
var QQMapWX = require('/libs/qqmap-wx-jssdk.min.js')

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    qqmapsdk: new QQMapWX({
      key: '43IBZ-FMZCZ-QLFXU-7LAQ7-SMLGQ-4DFWZ' // 地图开发key
    }),
    patrolForm: {}
  }
})
