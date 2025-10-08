const app = getApp();

Page({
  data: {
    product: null,
    qty: 1,
  },
  onLoad(options) {
    this.productId = options.id;
    this.fetchProduct();
  },
  fetchProduct() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products/${this.productId}`,
      success: (res) => {
        this.setData({ product: res.data });
        wx.setNavigationBarTitle({ title: res.data.name || '商品详情' });
      },
    });
  },
  changeQty(e) {
    this.setData({ qty: Number(e.detail.value) });
  },
  addToCart() {
    const token = app.globalData.token;
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    wx.request({
      url: `${app.globalData.apiBaseUrl}/cart`,
      method: 'POST',
      header: { Authorization: `Bearer ${token}` },
      data: { product_id: Number(this.productId), qty: this.data.qty },
      success: () => {
        wx.showToast({ title: '已加入购物车' });
      },
    });
  },
  buyNow() {
    const product = this.data.product;
    if (!product) return;
    wx.navigateTo({
      url: `/pages/order/confirm/index?items=${encodeURIComponent(JSON.stringify([{ product_id: product.id, qty: this.data.qty }]))}`,
    });
  },
});
