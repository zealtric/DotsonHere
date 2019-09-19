const db = wx.cloud.database()
const userRelationship = db.collection('userRelationship')
const userinfo = db.collection('userinfo')
// pages/myCover/myCover.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    USERFollows: [
      {
        name: "亚🖖",
        openid: "oN8F75ddWWl4rGQKz17vEzBTC9j4"
      },
      {
        name: "君🖖",
        openid: "oN8F75QC4dSRMJT7dh5L6kB-7y6E"
      },
    ]
    // userFollows: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    
    var openid = options.openid;//用户的openid
    var follows = new Array();
    var loopfollows = "";
    var userFollows = new Array();
    var userFollowsUnit = new Object();
    userRelationship.where({
      user: openid
    }).get().then(res => {
      console.log(res.data)
      follows = res.data[0].follows;
      console.log(follows);
      console.log(follows.length);
      for (var i = 0; i < follows.length; i++) {
        
        console.log(i + "=====================")
        loopfollows = follows[i]
        console.log(loopfollows);
        userinfo.where({
          _openid: loopfollows
        }).get().then(res => {
          console.log(res.data)
          console.log(loopfollows)
          userFollowsUnit.openid = loopfollows;
          userFollowsUnit.name = res.data[0].nickName;
          console.log(userFollowsUnit)
          // userFollows.push(userFollowsUnit)
          userFollows = [
            {
              name: "a亚🖖",
              openid: "oN8F75ddWWl4rGQKz17vEzBTC9j4"
            },
            {
              name: "a君🖖",
              openid: "oN8F75QC4dSRMJT7dh5L6kB-7y6E"
            },
          ]
          console.log(userFollows)
          // var userFollowsUnit = this.Obj(res.data[0].nickName, loopfollows)
          // userFollows.push(userFollowsUnit)
          // console.log(userFollows)
          console.log("============================")
        })
        console.log(i + "============================")
        
      }
      this.setData({
        USERFollows: userFollows
      })
    });
  },

  // /**
  //  * 生成对象
  //  */
  // Obj: function(name, openid){
  //   this.name = name;
  //   this.openid = openid;
  //   this.uni3 = function () {
  //     console.log(this.name + this.openid)
  //   }
  // },

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

  }
})