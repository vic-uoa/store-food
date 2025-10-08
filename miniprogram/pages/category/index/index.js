const app = getApp();

Page({
  data: {
    categories: [],
    products: [],
    activeCategory: null,
  },
  onShow() {
    this.fetchCategories();
  },
  fetchCategories() {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/categories`,
      success: (res) => {
        const categories = res.data || [];
        this.setData({ categories });
        if (categories.length) {
          this.setData({ activeCategory: categories[0].id });
          this.fetchProducts(categories[0].id);
        }
      },
    });
  },
  fetchProducts(categoryId) {
    wx.request({
      url: `${app.globalData.apiBaseUrl}/products`,
      data: { category_id: categoryId },
      success: (res) => {
        this.setData({ products: res.data || [] });
      },
    });
  },
  selectCategory(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ activeCategory: id });
    this.fetchProducts(id);
  },
});
