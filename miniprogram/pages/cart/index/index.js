const app = getApp();

Page({
  data: {
    cart: { items: [], total: 0 },
  },
  onShow() {
    this.fetchCart();
  },
  fetchCart() {
    const token = app.globalData.token;
    if (!token) {
      this.setData({ cart: { items: [], total: 0 } });
      return;
    }
    wx.request({
      url: `${app.globalData.apiBaseUrl}/cart`,
      header: { Authorization: `Bearer ${token}` },
      success: (res) => {
        this.setData({ cart: res.data });
      },
    });
  },
  changeQty(e) {
    const { id } = e.currentTarget.dataset;
    const qty = Number(e.detail.value);
    wx.request({
      url: `${app.globalData.apiBaseUrl}/cart/${id}`,
      method: 'PATCH',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      data: { qty },
      success: () => {
        this.fetchCart();
      },
    });
  },
  removeItem(e) {
    const { id } = e.currentTarget.dataset;
    wx.request({
      url: `${app.globalData.apiBaseUrl}/cart/${id}`,
      method: 'DELETE',
      header: { Authorization: `Bearer ${app.globalData.token}` },
      success: () => {
        this.fetchCart();
      },
    });
  },
  goCheckout() {
    const items = this.data.cart.items.map((item) => ({ product_id: item.productId, qty: item.qty }));
    wx.navigateTo({ url: `/pages/order/confirm/index?items=${encodeURIComponent(JSON.stringify(items))}` });
  },
});
