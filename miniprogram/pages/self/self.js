const db = wx.cloud.database()
const userinfo = db.collection('userinfo')
const userRelationship = db.collection('userRelationship')
const sonSea = db.collection('sonSea')

// pages/self/self.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayA: "none",
    displayB: "block",
    myDays: [],
    openid: "",
    // 下拉加载更多，用到skip函数，所以先给初始页面设置一个值
    page: 0,
    textConLeft: [],
    textConTop: [],
    textConWidth: [],
    imgWidth: [],
    imgHeight: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: res =>{
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              //用户已经授权过
              console.log("判断：已经授权过了")
              this.setData({
                displayA: "block",
                displayB: "none"
              })
              wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'login',
              }).then(res => {
                var openid = res.result.openid;

                //获取数据库中的数据并展示出来
                sonSea.where({
                  _openid: openid // 当前用户 openid
                }).get().then(res => {
                  console.log(res.data)
                  this.setData({
                    myDays: res.data,
                    openid: openid,
                  })
                  var textConLeft = new Array();
                  var textConTop = new Array();
                  var textConWidth = new Array();
                  var imgWidth = new Array();
                  var imgHeight = new Array();
                  var clientWidth = wx.getSystemInfoSync().windowWidth;
                  var leftA = clientWidth - 78 + "px";
                  var leftB = clientWidth - 153 + "px";
                  console.log(leftA)
                  for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].imgCT == 0) {
                      textConLeft.push("70px");
                      textConTop.push("-140px");
                      textConWidth.push(leftA);
                      imgWidth.push("0px");
                      imgHeight.push("0px");
                    } else if (res.data[i].imgCT == 1) {
                      textConLeft.push("145px");
                      textConTop.push("-140px");
                      textConWidth.push(leftB);
                      imgWidth.push("68px");
                      imgHeight.push("68px");
                    } else if (res.data[i].imgCT == 2) {
                      textConLeft.push("145px");
                      textConTop.push("-140px");
                      textConWidth.push(leftB);
                      imgWidth.push("33px");
                      imgHeight.push("68px");
                    } else{
                      textConLeft.push("145px");
                      textConTop.push("-140px");
                      textConWidth.push(leftB);
                      imgWidth.push("33px");
                      imgHeight.push("33px");
                    }
                    this.setData({
                      textConLeft: textConLeft,
                      textConTop: textConTop,
                      textConWidth: textConWidth,
                      imgWidth: imgWidth,
                      imgHeight: imgHeight,
                    })
                  }
                })
              }).catch(err => {
                console.log(err)
              })
              console.log(this.data)
            }
          })
        }else{
          console.log("判断：还没有授权呢")
        }
      }
    })
  },

  /**
   * 获取openid
   */
  getOpenid: function (e) {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'login',
    }).then(res => {
      console.log('云函数获取到的openid: ', res.result.openid)
      return res.result.openid
    }).catch(err => {
      console.log(err)
    })
  },

  /**
   * 获取授权
   */
  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {
      var that = this;
      wx.showLoading({
        title: "正在登录"
      });
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                wx.cloud.callFunction({
                  // 要调用的云函数名称
                  name: 'login',
                }).then(res => {
                  var openid = res.result.openid;
                  //两个vip对应用户身份信息表和关系表
                  var vipA = 0;
                  var vipB = 0;

                  // 查询用户身份信息是否已有
                  userinfo.get().then(res => {
                    for (var i = 0; i < res.data.length; i++) {
                      if (res.data[i]._openid == openid) {
                        vipA = 1;
                        break;
                      }
                    }
                    if (vipA == 0) {
                      // 新建用户信息
                      userinfo.add({
                        data: e.detail.userInfo,
                      }).then(res => {
                        vipA = 1;
                        console.log("用户信息新建成功");

                        userRelationship.get().then(res => {
                          for (var j = 0; j < res.data.length; j++) {
                            if (res.data[j]._openid == openid) {
                              vipB = 1;
                              break;
                            }
                          }
                          if (vipB == 0) {
                            // 新建用户关系表
                            userRelationship.add({
                              data: {
                                user: openid,
                                follower: [],
                                follows: []
                              }
                            }).then(res => {
                              console.log("用户关系表新建成功")
                              vipB = 1;
                              wx.hideLoading();
                              wx.reLaunch({
                                url: '/pages/self/self',
                              })
                            }).catch(err => {
                              console.err;
                            });
                          }else if(vipB == 1){
                            console.log("用户关系表已有")
                            wx.hideLoading();
                            wx.reLaunch({
                              url: '/pages/self/self',
                            })
                          }
                        });
                      }).catch(err => {
                        console.err;
                      });
                    } else if (vipA == 1){
                      console.log("用户信息表已有")
                      userRelationship.get().then(res => {
                        for (var j = 0; j < res.data.length; j++) {
                          if (res.data[j]._openid == openid) {
                            vipB = 1;
                            break;
                          }
                        }
                        if (vipB == 0) {
                          // 新建用户关系表
                          userRelationship.add({
                            data: {
                              user: openid,
                              follower: [],
                              follows: []
                            }
                          }).then(res => {
                            console.log("用户关系表新建成功")
                            vipB = 1;
                            wx.hideLoading();
                            wx.reLaunch({
                              url: '/pages/self/self',
                            })
                          }).catch(err => {
                            console.err;
                          });
                        }else if(vipB == 1){
                          console.log("用户关系表已有")
                          wx.hideLoading();
                          wx.reLaunch({
                            url: '/pages/self/self',
                          })
                        }
                      })
                    }
                  });

                  // // 查询用户身份信息是否已有
                  // userinfo.get().then(res => {
                  //   var vipA = 0;
                  //   for (var i = 0; i < res.data.length; i++) {
                  //     if (res.data[i]._openid == openid) {
                  //       vipA = 1;
                  //       break;
                  //     }
                  //   }
                  //   if (vipA == 0) {
                  //     // 新建用户信息
                  //     userinfo.add({
                  //       data: e.detail.userInfo,
                  //     }).then(res => {
                  //       // 新建用户关系表
                  //       userRelationship.add({
                  //         data: {
                  //           user: openid,
                  //           follower: [],
                  //           follows: []
                  //         }
                  //       }).then(res => {
                  //         wx.hideLoading();
                  //         wx.reLaunch({
                  //           url: '/pages/self/self',
                  //         })
                  //       })
                  //     }).catch(err => {
                  //       console.err;
                  //     });
                  //   } else {
                  //     wx.hideLoading();
                  //     wx.reLaunch({
                  //       url: '/pages/self/self',
                  //     })
                  //   }
                  // })
                });
              },
              fail: res => {
                wx.showToast({
                  icon: 'none',
                  title: '登录失败（错误代码001）',
                })
              }
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: '登录失败（错误代码002）',
            })
          }
        },
        fail: res => {
          wx.showToast({
            icon: 'none',
            title: '登录失败（错误代码003）',
          })
        }
      })


      // wx.getSetting({
      //   success: res => {
      //     if (res.authSetting['scope.userInfo']) {
      //       wx.getUserInfo({
      //         success: res => {
      //           userinfo.add({
      //             data: e.detail.userInfo,
      //           }).then(res => {
      //             wx.hideLoading();
      //             wx.reLaunch({
      //               url: '/pages/self/self',
      //             })
      //           }).catch(err => {
      //             console.err;
      //           });
      //           // 新建用户关系表
      //         },
      //         fail: res => {
      //           wx.showToast({
      //             title: '登录失败（错误代码001）',
      //           })
      //         }
      //       })
      //     } else {
      //       wx.showToast({
      //         title: '登录失败（错误代码002）',
      //       })
      //     }
      //   },
      //   fail: res => {
      //     wx.showToast({
      //       title: '登录失败（错误代码003）',
      //     })
      //   }
      // })




    }else{
      wx.showModal({
        title: '用户未授权',
        content: '为了您更好地在多丧玩耍，点击微信登录时请授权你的信息',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

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
    let page = this.data.page + 20
    console.log(page)

    sonSea.where({
      _openid: openid // 当前用户 openid
    }).skip(page).get().then(res => {
      console.log(res)

      let new_data = res.data
      let old_data = this.data.myDays
      console.log(this.data.myDays)
      //为什么这里要加一个.myDays，因为concat是用来拼接数组的，res里的data就是从数据库里面抽出来的数组，而this，当前页面的data指的是当前页面的所有数据，其中的myDays是数组

      //算清楚拿了多少数据
      // console.log(res.data.length)
      let more = page - 20 + res.data.length

      var textConLeft = this.data.textConLeft;
      var textConTop = this.data.textConTop;
      var textConWidth = this.data.textConWidth;
      var imgWidth = this.data.imgWidth;
      var imgHeight = this.data.imgHeight;
      var clientWidth = wx.getSystemInfoSync().windowWidth;
      var leftA = clientWidth - 78 + "px";
      var leftB = clientWidth - 153 + "px";
      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].imgCT == 0) {
          textConLeft.push("70px");
          textConTop.push("-140px");
          textConWidth.push(leftA);
          imgWidth.push("0px");
          imgHeight.push("0px");
          this.setData({
            textConLeft: textConLeft,
            textConTop: textConTop,
            textConWidth: textConWidth,
            imgWidth: imgWidth,
            imgHeight: imgHeight,
          })
        } else if (res.data[i].imgCT == 1) {
          textConLeft.push("145px");
          textConTop.push("-140px");
          textConWidth.push(leftB);
          imgWidth.push("68px");
          imgHeight.push("68px");
          this.setData({
            textConLeft: textConLeft,
            textConTop: textConTop,
            textConWidth: textConWidth,
            imgWidth: imgWidth,
            imgHeight: imgHeight,
          })
        } else if (res.data[i].imgCT == 2) {
          textConLeft.push("145px");
          textConTop.push("-140px");
          textConWidth.push(leftB);
          imgWidth.push("33px");
          imgHeight.push("68px");
          this.setData({
            textConLeft: textConLeft,
            textConTop: textConTop,
            textConWidth: textConWidth,
            imgWidth: imgWidth,
            imgHeight: imgHeight,
          })
        } else {
          textConLeft.push("145px");
          textConTop.push("-140px");
          textConWidth.push(leftB);
          imgWidth.push("33px");
          imgHeight.push("33px");
          this.setData({
            textConLeft: textConLeft,
            textConTop: textConTop,
            textConWidth: textConWidth,
            imgWidth: imgWidth,
            imgHeight: imgHeight,
          })
        }
      }

      this.setData({
        myDays: old_data.concat(new_data),
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
   * 我的守护
   */
  mysh: function(e){
    console.log(e)
    wx.navigateTo({
      url: '../myCover/myCover?openid=' + this.data.openid,
      success: (res => {
        console.log(res)
      }),
      fail: console.error
    })
  }
})