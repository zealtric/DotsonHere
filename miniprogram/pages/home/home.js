const db = wx.cloud.database()
const sonSea = db.collection('sonSea')
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNav: 1,
    imgWidth: [],
    imgHeight: [],
    textMarginB: [],
    awImg: [],
    jsImg: [],
    scImg: [],
    // 下拉加载更多，用到skip函数，所以先给初始页面设置一个值
    page: 0,
    sonSquare: [],
    openid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          wx.cloud.callFunction({
            // 获取openid
            name: 'login',
          }).then(res => {
            var openid = res.result.openid;

          
            sonSea.get().then(res => {
              console.log(res.data)

              var imgWidth = new Array();
              var imgHeight = new Array();
              var textMarginB = new Array();
              var awImg = new Array();
              var jsImg = new Array();
              var scImg = new Array();
              for (var i = 0; i < res.data.length; i++) {
                var a = res.data[i].awUsers.includes(openid);
                var b = res.data[i].jsUsers.includes(openid);
                var c = res.data[i].scUsers.includes(openid);
                // 安慰
                if(a){
                  awImg.push("../../images/anweiED.png");
                }else{
                  awImg.push("../../images/anwei.png");
                }
                // 救丧
                if (b) {
                  jsImg.push("../../images/jiusangED.png");
                } else {
                  jsImg.push("../../images/jiusang.png");
                }
                // 收藏
                if (c) {
                  scImg.push("../../images/shoucangED.png");
                } else {
                  scImg.push("../../images/shoucang.png");
                }

                if (res.data[i].textCon) {
                  textMarginB.push("15px");
                } else {
                  textMarginB.push("0px");
                }

                if (res.data[i].imgCT == 0) {
                  imgWidth.push("0px");
                  imgHeight.push("0px");
                } else if (res.data[i].imgCT == 1) {
                  imgWidth.push("198px");
                  imgHeight.push("198px");
                } else {
                  imgWidth.push("98px");
                  imgHeight.push("98px");
                }
                this.setData({
                  imgWidth: imgWidth,
                  imgHeight: imgHeight,
                  textMarginB: textMarginB,
                  awImg: awImg,
                  jsImg: jsImg,
                  scImg: scImg,
                })
              }

              this.setData({
                sonSquare: res.data,
                openid: openid,
              })
            })
          })
        }
      }
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
    // 查看是否授权
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.switchTab({
            url: '/pages/self/self',
          })
        }
      }
    })
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
    console.log('--------下拉刷新-------')
    this.onLoad({
      success(res){
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page + 20
    let openid = this.data.openid
    console.log(page)

    sonSea.skip(page).get().then(res => {
      console.log(res)

      let new_data = res.data
      let old_data = this.data.sonSquare
      console.log(this.data.sonSquare)
      //为什么这里要加一个.sonSquare，因为concat是用来拼接数组的，res里的data就是从数据库里面抽出来的数组，而this，当前页面的data指的是当前页面的所有数据，其中的sonSquare是数组

      //算清楚拿了多少数据
      // console.log(res.data.length)
      let more = page - 20 + res.data.length

      var imgWidth = this.data.imgWidth;
      var imgHeight = this.data.imgHeight;
      var textMarginB = this.data.textMarginB;
      var awImg = this.data.awImg;
      var jsImg = this.data.jsImg;
      var scImg = this.data.scImg;
      for (var i = 0; i < res.data.length; i++) {
        var a = res.data[i].awUsers.includes(openid);
        var b = res.data[i].jsUsers.includes(openid);
        var c = res.data[i].scUsers.includes(openid);
        // 安慰
        if (a) {
          awImg.push("../../images/anweiED.png");
        } else {
          awImg.push("../../images/anwei.png");
        }
        // 救丧
        if (b) {
          jsImg.push("../../images/jiusangED.png");
        } else {
          jsImg.push("../../images/jiusang.png");
        }
        // 收藏
        if (c) {
          scImg.push("../../images/shoucangED.png");
        } else {
          scImg.push("../../images/shoucang.png");
        }

        if (res.data[i].textCon) {
          textMarginB.push("15px");
        } else {
          textMarginB.push("0px");
        }

        if (res.data[i].imgCT == 0) {
          imgWidth.push("0px");
          imgHeight.push("0px");
        } else if (res.data[i].imgCT == 1) {
          imgWidth.push("198px");
          imgHeight.push("198px");
        } else {
          imgWidth.push("98px");
          imgHeight.push("98px");
        }
        this.setData({
          imgWidth: imgWidth,
          imgHeight: imgHeight,
          textMarginB: textMarginB,
          awImg: awImg,
          jsImg: jsImg,
          scImg: scImg,
        })
      }

      this.setData({
        sonSquare: old_data.concat(new_data),
        //setData后，页面的data就能拿到page的值，这样的话就把新的page赋值给当前页面了
        page: more
      }, res => {
        console.log('好了')
        console.log(res)
      })
    })
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
  // barOnChange: function(e){
  //   let barIndex = e.detail
  //   console.log(barIndex)
  //   switch (barIndex){
  //     case 0:
  //       wx.redirectTo({
  //         url: '../home/home',
  //       });
  //       break;
  //     case 1:
  //       wx.navigateTo({
  //         url: '../qson/qson',
  //       });
  //       break;
  //     case 2:
  //       wx.redirectTo({
  //         url: '../self/self',
  //       });
  //       break;
  //   }
    // if (barIndex == 1){
    //   wx.navigateTo({
    //     url: '../qson/qson',
    //   })
    // }else if (barIndex == 2){
    //   wx.navigateTo({
    //     url: '../self/self',
    //   })
    // }
  // },

  /**
   * 进入详情页
   */
  home_sonDetail: function(e){
    console.log(e)
    wx.navigateTo({
      url: '../sonDetail/sonDetail?_id=' + e.currentTarget.dataset.id + '&openid=' + this.data.openid,
      success: (res =>{
        console.log(res)
      }),
      fail: console.error
    })
  },

  /**
   * 点赞
   */
  aw: function(e){
    console.log(e)
    var sonIndex = e.currentTarget.dataset.index;
    console.log(sonIndex);
    var id = e.currentTarget.dataset.id;
    var thisSon = sonSea.doc(id);
    var openid = this.data.openid;
    var awCT = 0;
    var awUsers = new Array();
    thisSon.get().then(res => {
      awCT = res.data.awCT;
      awUsers = res.data.awUsers;
      var a = awUsers.includes(openid);
      var key = "awImg[" + sonIndex + "]";
      console.log(a);
      console.log(awUsers);
      if (a) {
        this.remove(awUsers,openid);
        console.log(awUsers);
        awCT = awCT-1;
        thisSon.update({
          data: {
            awUsers: awUsers,
            awCT: awCT
          },
          success: console.log,
          fail: console.error
        })
        this.setData({
          [key]: "../../images/anwei.png"
        })
        console.log(this.data.awImg)
      }else{
        awUsers.push(openid);
        awCT = awCT + 1;
        thisSon.update({
          data: {
            awUsers: awUsers,
            awCT: awCT
          },
          success: console.log,
          fail: console.error
        })
        this.setData({
          [key]: "../../images/anweiED.png"
        })
        console.log(this.data.awImg)
      }
    })
  },

  /**
   * 收藏
   */
  sc: function (e) {
    var sonIndex = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var thisSon = sonSea.doc(id);
    var openid = this.data.openid;
    var scCT = 0;
    var scUsers = new Array();
    thisSon.get().then(res => {
      scCT = res.data.scCT;
      scUsers = res.data.scUsers;
      var a = scUsers.includes(openid);
      var key = "scImg[" + sonIndex + "]";
      if (a) {
        this.remove(scUsers, openid);
        scCT = scCT - 1;
        thisSon.update({
          data: {
            scUsers: scUsers,
            scCT: scCT
          },
          success: console.log,
          fail: console.error
        })
        this.setData({
          [key]: "../../images/shoucang.png"
        })
      } else {
        scUsers.push(openid);
        scCT = scCT + 1;
        thisSon.update({
          data: {
            scUsers: scUsers,
            scCT: scCT
          },
          success: console.log,
          fail: console.error
        })
        this.setData({
          [key]: "../../images/shoucangED.png"
        })
      }
    })
  },

  /**
   * 救丧
   */
  js: function (e) {
    var that = this;
    var sonIndex = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var thisSon = sonSea.doc(id);
    var openid = this.data.openid;
    var jsCT = 0;
    var jsUsers = new Array();
    thisSon.get().then(res => {
      jsCT = res.data.jsCT;
      jsUsers = res.data.jsUsers;
      // 判断是否是自己的帖子
      if(openid == res.data.createOpenid){
        wx.showToast({
          icon: 'none',
          title: '不可以给自己救丧哦',
        })
      }else{
        
        var a = jsUsers.includes(openid);
        var key = "jsImg[" + sonIndex + "]";
        if(a){
          wx.showToast({
            icon: 'none',
            title: '给出去的东西可要不回来的哦',
          })
        }else{
          wx.showModal({
            title: '救丧',
            content: '投币1枚吗兄dei',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')

                jsUsers.push(openid);
                jsCT = jsCT + 1;
                thisSon.update({
                  data: {
                    jsUsers: jsUsers,
                    jsCT: jsCT
                  },
                  success: console.log,
                  fail: console.error
                })
                // 就很奇怪，这里得用that，不能用this，可能是没用箭头函数，this改变了，之后再看看
                that.setData({
                  [key]: "../../images/jiusangED.png"
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },

  /**
   * 评论
   */
  pl: function(e){
    wx.navigateTo({
      url: '../sonDetail/sonDetail?_id=' + e.currentTarget.dataset.id + '&openid=' + this.data.openid + '&flag=1',
      success: (res => {
        console.log(res)
      }),
      fail: console.error
    })
  },

  remove: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }
    return -1;
  }
})