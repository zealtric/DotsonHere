// pages/qsonf/qsonf.js
Page({

  /**
   * 页面的初始数据
   * 
   * ZEA：这个num的设置简直天才
   */
  data: {
    num: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   * 
   * ZEA：初始为0，点击去丧后进入该页面，0+1=1，这个时候定向至qson页面
   * ZEA：qson页面点击返回，返回至qsonf，也就是当前页面，1+1=2，这个时候switchTab到home页面
   * ZEA：天才啊
   */
  onShow: function () {
    this.data.num++;
    if (this.data.num % 2 == 0) {
      wx.switchTab({
        url: '../home/home'
      });
    } else {
      wx.navigateTo({
        url: '../qson/qson'
      })
    }
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

  }
})