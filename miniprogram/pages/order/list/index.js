const app = getApp();

Page({
  data: {
    orders: [],
  },
  onShow() {
    this.fetchOrders();
  },
  fetchOrders() {
    if (!app.globalData.token) {
      this.setData({ orders: [] });
      return;
    }
    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders`,
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: (res) => {
        this.setData({ orders: res.data || [] });
      },
    });
  },
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/order/detail/index?id=${id}` });
  },
});
