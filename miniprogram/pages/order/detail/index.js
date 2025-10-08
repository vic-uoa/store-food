const app = getApp();

Page({
  data: {
    order: null,
  },
  onLoad(options) {
    this.orderId = options.id;
    this.fetchOrder();
  },
  fetchOrder() {
    if (!app.globalData.token) return;
    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders/${this.orderId}`,
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: (res) => {
        this.setData({ order: res.data });
      },
    });
  },
  confirmReceive() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/pay/orders/${this.orderId}/complete`,
      method: 'POST',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: () => {
        wx.showToast({ title: '已确认收货' });
        this.fetchOrder();
      },
    });
  },
  cancelOrder() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders/${this.orderId}`,
      method: 'DELETE',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: () => {
        wx.showToast({ title: '订单已取消' });
        this.fetchOrder();
      },
    });
  },
});
