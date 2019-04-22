const db = wx.cloud.database()
const son = db.collection('son')
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNav: 1,
    activeBar: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    son.get().then(res => {
      console.log(res.data)
      this.setData({
        sonText: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * tab切换
   */
  tabOnChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },

  /**
   * tabbar切换
   */
  barOnChange: function(e){
    let barIndex = e.detail
    console.log(barIndex)
    switch (barIndex){
      case 0:
        wx.redirectTo({
          url: '../home/home',
        });
        break;
      case 1:
        wx.navigateTo({
          url: '../qson/qson',
        });
        break;
      case 2:
        wx.redirectTo({
          url: '../self/self',
        });
        break;
    }
    // if (barIndex == 1){
    //   wx.navigateTo({
    //     url: '../qson/qson',
    //   })
    // }else if (barIndex == 2){
    //   wx.navigateTo({
    //     url: '../self/self',
    //   })
    // }
  },

  /**
   * 进入详情页
   */
  home_sonDetail: function(e){
    console.log(e.currentTarget.dataset.desc)
    wx.navigateTo({
      url: '../sonDetail/sonDetail?_id=' + e.currentTarget.dataset.desc,
      success: (res =>{
        console.log(res)
      }),
      fail: console.error
    })
  }
})