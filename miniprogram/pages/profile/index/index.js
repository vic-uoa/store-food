const app = getApp();

Page({
  data: {
    user: null,
    points: 0,
    history: [],
  },
  onShow() {
    if (app.globalData.token) {
      this.fetchUser();
      this.fetchPoints();
    }
  },
  fetchUser() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/users/me`,
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: (res) => {
        app.globalData.user = res.data;
        this.setData({ user: res.data });
      },
    });
  },
  fetchPoints() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/points/me`,
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: (res) => {
        this.setData({ points: res.data.balance, history: res.data.history });
      },
    });
  },
  handlePhoneLogin(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({ title: '需要手机号授权', icon: 'none' });
      return;
    }
    wx.login({
      success: (loginRes) => {
        wx.request({
          url: `${app.globalData.apiBaseUrl}/auth/wechat/login`,
          method: 'POST',
          data: {
            code: loginRes.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
          },
          success: (res) => {
            app.globalData.token = res.data.token;
            wx.setStorageSync('token', res.data.token);
            this.setData({ user: res.data.user });
            this.fetchPoints();
          },
        });
      },
    });
  },
});
