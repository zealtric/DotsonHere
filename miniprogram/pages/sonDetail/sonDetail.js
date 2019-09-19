const db = wx.cloud.database()
const sonSea = db.collection('sonSea')
const userRelationship = db.collection('userRelationship')
const sonReply = db.collection('sonReply')
// pages/sonDetail/sonDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    openid: "",
    createOpenid: "",
    fatherID: "",
    awImg: "",
    jsImg: "",
    scImg: "",
    textMarginB: "",
    imgWidth: "",
    imgHeight: "",
    follower: [],
    btText: "",
    btColor: "",
    follow: 0,
    KbHeight: 0,
    plCon: "",
    BtnColor: "#cdcdcd",
    BtnBgColor: "#bfbfbf",
    DISABLED: true,
    textFunc: "none",
    plKind: 0,
    plawImg: [],
    page: 0,
    plSquare: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.flag)
    
    var id = options._id;//帖子的id
    var openid = options.openid;//用户的openid

    // this.setData({
    //   id: options._id,
    //   openid: options.openid
    // })
    // var id = this.data.id;
    // var openid = this.data.openid;

    var textMarginB = "";
    var imgWidth = "";
    var imgHeight = "";
    var createOpenid = "";
    var follower = new Array();
    sonSea.where({
      _id: options._id
      // _id: id
    }).get().then(res => {
      console.log(res.data)

      // 关注
      createOpenid = res.data[0].createOpenid;//帖子创建人的openid
      userRelationship.where({
        user: createOpenid
      }).get().then(res => {
        console.log(res.data)
        follower = res.data[0].follower;
        var d = follower.includes(openid);
        if(d){
          this.setData({
            btText: "关心中",
            btColor: "green",
            follow: 1
          })
        }else{
          this.setData({
            btText: "滋醒Ta",
            btColor: "blue",
            follow: 0
          })
        }
      })

      if (res.data[0].textCon) {
        textMarginB = "15px";
      } else {
        textMarginB = "0px";
      }

      if (res.data[0].imgCT == 0) {
        imgWidth ="0px";
        imgHeight = "0px";
      } else if (res.data[0].imgCT == 1) {
        imgWidth = "198px";
        imgHeight = "198px";
      } else {
        imgWidth = "98px";
        imgHeight = "98px";
      }

      this.setData({
        Detail: res.data[0],
        id: id,
        openid: openid,
        textMarginB: textMarginB,
        imgHeight: imgHeight,
        imgWidth: imgWidth,
        createOpenid: createOpenid
      });

      var a = res.data[0].awUsers.includes(openid);
      var b = res.data[0].jsUsers.includes(openid);
      var c = res.data[0].scUsers.includes(openid);
      // 安慰
      if (a) {
        this.setData({
          awImg: "../../images/anweiED.png"
        })
      } else {
        this.setData({
          awImg: "../../images/anwei.png"
        })
      }
      // 救丧
      if (b) {
        this.setData({
          jsImg: "../../images/jiusangED.png"
        })
      } else {
        this.setData({
          jsImg: "../../images/jiusang.png"
        })
      }
      // 收藏
      if (c) {
        this.setData({
          scImg: "../../images/shoucangED.png"
        })
      } else {
        this.setData({
          scImg: "../../images/shoucang.png"
        })
      }
    });
    sonReply.where({
      originID: options._id
      // originID: id
    }).get().then(res => {
      var plawImg = new Array();
      for (var i = 0; i < res.data.length; i++) {
        var a = res.data[i].plawUsers.includes(openid);
        // 评论得到的安慰
        if (a) {
          plawImg.push("../../images/anweiED.png");
        } else {
          plawImg.push("../../images/anwei.png");
        }
        this.setData({
          plawImg: plawImg,
        })
      }
      this.setData({
        plSquare: res.data
      })
    });
    if(options.flag){
      this.pl()
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
    let page = this.data.page + 20
    let openid = this.data.openid
    let id = this.data.id
    console.log(page)

    sonReply.skip(page).where({
      originID: id
    }).get().then(res => {
      console.log(res)

      let new_data = res.data
      let old_data = this.data.plSquare
      console.log(this.data.plSquare)
      //为什么这里要加一个.plSquare，因为concat是用来拼接数组的，res里的data就是从数据库里面抽出来的数组，而this，当前页面的data指的是当前页面的所有数据，其中的sonSquare是数组

      //算清楚拿了多少数据
      // console.log(res.data.length)
      let more = page - 20 + res.data.length

      var plawImg = this.data.plawImg;
      for (var i = 0; i < res.data.length; i++) {
        var a = res.data[i].plawUsers.includes(openid);
        // 评论得到的安慰
        if (a) {
          plawImg.push("../../images/anweiED.png");
        } else {
          plawImg.push("../../images/anwei.png");
        }
        this.setData({
          plawImg: plawImg,
        })
      }

      this.setData({
        plSquare: old_data.concat(new_data),
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
   * 关注
   */
  follow: function(e){
    var follow = this.data.follow;
    var openid = this.data.openid;
    var createOpenid = this.data.createOpenid;
    var follower = new Array();
    var follows = new Array();
    if (follow == 0){
      userRelationship.doc(openid).get().then(res=>{
        follows = res.data.follows;
        var a = follows.includes(createOpenid);
        if(!a){
          follows.push(createOpenid);
          userRelationship.doc(openid).update({
            data: {
              follows: follows
            },
            success: console.log,
            fail: console.error
          })
        }
      })
      userRelationship.doc(createOpenid).get().then(res => {
        follower = res.data.follower;
        var a = follower.includes(openid);
        if (!a) {
          follower.push(openid);
          userRelationship.doc(createOpenid).update({
            data: {
              follower: follower
            },
            success: console.log,
            fail: console.error
          })
        }
      })
      this.setData({
        btText: "关心中",
        btColor: "green",
        follow: 1
      })
    }else{
      userRelationship.doc(openid).get().then(res => {
        follows = res.data.follows;
        var a = follows.includes(createOpenid);
        if (a) {
          this.remove(follows, createOpenid);
          userRelationship.doc(openid).update({
            data: {
              follows: follows
            },
            success: console.log,
            fail: console.error
          })
        }
      })
      userRelationship.doc(createOpenid).get().then(res => {
        follower = res.data.follower;
        var a = follower.includes(openid);
        if (a) {
          this.remove(follower, openid);
          userRelationship.doc(createOpenid).update({
            data: {
              follower: follower
            },
            success: console.log,
            fail: console.error
          })
        }
      })
      this.setData({
        btText: "滋醒Ta",
        btColor: "blue",
        follow: 0
      })
    }
  },


  /**
   * 点赞
   */
  aw: function (e) {
    console.log(e)
    var id = this.data.id;
    var thisSon = sonSea.doc(id);
    var openid = this.data.openid;
    var awCT = 0;
    var awUsers = new Array();
    thisSon.get().then(res => {
      awCT = res.data.awCT;
      awUsers = res.data.awUsers;
      var a = awUsers.includes(openid);
      console.log(a);
      console.log(awUsers);
      if (a) {
        this.remove(awUsers, openid);
        console.log(awUsers);
        awCT = awCT - 1;
        thisSon.update({
          data: {
            awUsers: awUsers,
            awCT: awCT
          },
          success: console.log,
          fail: console.error
        })
        this.setData({
          awImg: "../../images/anwei.png"
        })
        console.log(this.data.awImg)
      } else {
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
          awImg: "../../images/anweiED.png"
        })
        console.log(this.data.awImg)
      }
    })
  },

  awpl:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var plIndex = e.currentTarget.dataset.index;
    var thisReply = sonReply.doc(id);
    var openid = this.data.openid;
    var plawCT = 0;
    var plawUsers = new Array();
    thisReply.get().then(res => {
      plawCT = res.data.plawCT;
      plawUsers = res.data.plawUsers;
      var a = plawUsers.includes(openid);
      console.log(a);
      console.log(plawUsers);
      if (a) {
        this.remove(plawUsers, openid);
        console.log(plawUsers);
        plawCT = plawCT - 1;
        thisReply.update({
          data: {
            plawUsers: plawUsers,
            plawCT: plawCT
          },
          success: console.log,
          fail: console.error
        })
        //改图标样式
        var key = "plawImg[" + plIndex + "]";
        this.setData({
          [key]: "../../images/anwei.png"
        })
        console.log(this.data.plawImg)
      } else {
        plawUsers.push(openid);
        plawCT = plawCT + 1;
        thisReply.update({
          data: {
            plawUsers: plawUsers,
            plawCT: plawCT
          },
          success: console.log,
          fail: console.error
        })
        //改图标样式
        var key = "plawImg[" + plIndex + "]";
        this.setData({
          [key]: "../../images/anweiED.png"
        })
        console.log(this.data.plawImg)
      }
    })
  },

  /**
   * 收藏
   */
  sc: function (e) {
    console.log(e)
    var id = this.data.id;
    var thisSon = sonSea.doc(id);
    var openid = this.data.openid;
    var scCT = 0;
    var scUsers = new Array();
    thisSon.get().then(res => {
      scCT = res.data.scCT;
      scUsers = res.data.scUsers;
      var a = scUsers.includes(openid);
      console.log(a);
      console.log(scUsers);
      if (a) {
        this.remove(scUsers, openid);
        console.log(scUsers);
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
          scImg: "../../images/shoucang.png"
        })
        console.log(this.data.scImg)
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
          scImg: "../../images/shoucangED.png"
        })
        console.log(this.data.scImg)
      }
    })
  },

  /**
   * 救丧
   */
  js: function (e) {
    var that = this;
    var id = this.data.id;
    var thisSon = sonSea.doc(id);
    var openid = this.data.openid;
    var jsCT = 0;
    var jsUsers = new Array();
    thisSon.get().then(res => {
      jsCT = res.data.jsCT;
      jsUsers = res.data.jsUsers;
      // 判断是否是自己的帖子
      if (openid == res.data.createOpenid) {
        wx.showToast({
          icon: 'none',
          title: '不可以给自己救丧哦',
        })
      } else {

        var a = jsUsers.includes(openid);
        if (a) {
          wx.showToast({
            icon: 'none',
            title: '给出去的东西可要不回来的哦',
          })
        } else {
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
                  jsImg: "../../images/jiusangED.png"
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

  remove: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == val) {
        array.splice(i, 1);
      }
    }
    return -1;
  },

  /**
   * 评论
   */
  pl: function(e){
    this.setData({
      textFunc: "flex",
      plKind: 1
    })
  },

  hfpl: function(e){
    console.log(e.currentTarget.dataset.id)
    var fatherid = e.currentTarget.dataset.id;
    this.setData({
      textFunc: "flex",
      plKind: 2,
      fatherID: fatherid,
    })
  },

  closeKb: function (e) {
    this.setData({
      textFunc: "none"
    })
  },

  /**
   * 获取键盘高度
   */
  getKbH: function (e) {
    console.log(e.detail.height)
    this.setData({
      KbHeight: e.detail.height
    })
  },

  /**
   * 失焦
   */
  KbHide: function (e) {
    this.setData({
      KbHeight: 0
    })
  },

  /**
   * 键盘输入
   */
  bindInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      plCon: e.detail.value
    }, () => {
      // 判断发送按钮是否可点
      if (this.data.plCon) {
        console.log('已经写了东西')
        this.setData({
          BtnColor: "#FFE66A",
          BtnBgColor: "#CF7F7F",
          DISABLED: false
        })
      } else {
        console.log('啥也没有')
        this.setData({
          BtnColor: "#cdcdcd",
          BtnBgColor: "#bfbfbf",
          DISABLED: true
        })
      }
    })
  },

  /**
   * 发表评论/回复
   */
  formSubmit: function (e) {
    console.log("发生了提交事件")
    var that = this;
    var id = this.data.id;
    var fatherid = this.data.fatherID;
    var openid = this.data.openid;
    var plCon = this.data.plCon;
    var date = new Date();
    var monthOri = date.getMonth() + 1;
    var month = monthOri < 10 ? '0' + monthOri : '' + monthOri;
    var day = date.getDate();
    day = day < 10 ? '0' + day : '' + day;
    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour : '' + hour;
    var minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : '' + minute;
    var time = hour + ":" + minute;
    var now = date.getFullYear() + "/" + monthOri + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "," + date.getMilliseconds();
    var showtime = date.getFullYear() + "." + month + "." + day + " " + date.getHours() + ":" + date.getMinutes();
    var plCT = 0;
    var plUsers = new Array();
    var plplCT = 0;
    var plplUsers = new Array();
    

    //区分是评论还是回复
    if(this.data.plKind == 1){
      sonReply.add({
        data: {
          plOpenid: openid,
          plCon: plCon,
          plTime: now,
          plmonth: month,
          plday: day,
          pltime: time,
          plshowtime: showtime,
          plawCT: 0,
          plplCT: 0,
          plawUsers: [],
          plplUsers: [],
          fatherID: "",
          originID: id,
        },
        success: res => {
          console.log(res)
          this.setData({
            textCon: "",
            textFunc: "none",
            BtnColor: "#cdcdcd",
            BtnBgColor: "#bfbfbf",
            DISABLED: true
          })
          sonSea.doc(id).get().then(res => {
            plCT = res.data.plCT;
            console.log(plCT)
            plUsers = res.data.plUsers;
            plCT = plCT + 1;
            var a = plUsers.includes(openid);
            if (!a) {
              plUsers.push(openid);
              sonSea.doc(id).update({
                data: {
                  plUsers: plUsers,
                  plCT: plCT
                },
                success: console.log(plUsers),
                fail: console.error
              })
            }else{
              sonSea.doc(id).update({
                data: {
                  plUsers: plUsers,
                  plCT: plCT
                },
                success: console.log,
                fail: console.error
              })
            }
          })
        },
        fail: console.error
      })
    }else if(this.data.plKind == 2){
      sonReply.add({
        data: {
          plOpenid: openid,
          plCon: plCon,
          plTime: now,
          plmonth: month,
          plday: day,
          pltime: time,
          plshowtime: showtime,
          plawCT: 0,
          plplCT: 0,
          plawUsers: [],
          plplUsers: [],
          fatherID:fatherid,
          originID:id,
        },
        success: res => {
          console.log(res)
          this.setData({
            textCon: "",
            textFunc: "none",
            BtnColor: "#cdcdcd",
            BtnBgColor: "#bfbfbf",
            DISABLED: true
          })
          sonReply.doc(fatherid).get().then(res => {
            plplCT = res.data.plplCT;
            console.log(plplCT)
            plplUsers = res.data.plplUsers;
            plplCT = plplCT + 1;
            var a = plplUsers.includes(openid);
            if (!a) {
              plplUsers.push(openid);
              sonReply.doc(fatherid).update({
                data: {
                  plplUsers: plplUsers,
                  plplCT: plplCT
                },
                success: console.log,
                fail: console.error
              })
            } else {
              sonReply.doc(fatherid).update({
                data: {
                  plplUsers: plplUsers,
                  plplCT: plplCT
                },
                success: console.log,
                fail: console.error
              })
            }
          })

          // this.onLoad({
          //   success(res) {
          //     wx.stopPullDownRefresh();
          //   }
          // })
          var x = { _id: id, openid: openid }
          this.onLoad(x)

        },
        fail: console.error
      })
    }
  }
})