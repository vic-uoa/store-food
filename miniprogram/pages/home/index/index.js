const app = getApp();

Page({
  data: {
    banners: [
      { image: 'https://via.placeholder.com/640x320?text=WeMall' }
    ],
    products: [],
    loading: false,
  },
  onShow() {
    this.fetchProducts();
  },
  async fetchProducts() {
    this.setData({ loading: true });
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products`,
      success: (res) => {
        this.setData({ products: res.data || [] });
      },
      complete: () => {
        this.setData({ loading: false });
      },
    });
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/product/detail/index?id=${id}` });
  },
});
