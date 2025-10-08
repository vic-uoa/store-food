const app = getApp();

Page({
  data: {
    items: [],
    address: {
      contact: '',
      mobile: '',
      detail: '',
    },
    submitting: false,
  },
  onLoad(options) {
    if (options.items) {
      const items = JSON.parse(decodeURIComponent(options.items));
      this.setData({ items });
    }
  },
  handleInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`address.${field}`]: e.detail.value });
  },
  submitOrder() {
    if (!app.globalData.token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    wx.request({
      url: `${app.globalData.apiBaseUrl}/orders`,
      method: 'POST',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      data: { address: this.data.address },
      success: (res) => {
        const order = res.data;
        this.requestPrepay(order.id);
      },
      complete: () => {
        this.setData({ submitting: false });
      },
    });
  },
  requestPrepay(orderId) {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/pay/wechat/prepay`,
      method: 'POST',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      data: { order_id: orderId },
      success: (res) => {
        wx.showModal({
          title: '支付提示',
          content: '开发环境使用模拟支付，请在管理后台更新状态。',
          showCancel: false,
          success: () => {
            wx.redirectTo({ url: `/pages/order/detail/index?id=${orderId}` });
          },
        });
      },
    });
  },
});
