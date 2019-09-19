const db = wx.cloud.database()
const sonSea = db.collection('sonSea')

// pages/qson/qson.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    KbHeight: 0,
    textCon: "",
    BtnColor: "",
    BtnBgColor: "",
    BtnBorderColor: "",
    imgUrl: [],
    images_fileID: [],
    imgCT: 0,
    Count: 4,
    alreadyCount: 0,
    DISABLED: true,
    openid: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid();
  },

  /**
   * 获取openid
   */
  getOpenid: function(e){
    var that = this;
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'login',
    }).then(res => {
      console.log('云函数获取到的openid: ', res.result.openid)
      var openid = res.result.openid;
      that.setData({
        openid: openid
      })
    }).catch(err => {
      console.log(err)
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
  onShow: function (e) {
    if (this.data.textCon){
      console.log('已经写了东西')
      this.setData({
        BtnColor: "#FFE66A",
        BtnBgColor: "#CF7F7F",
        BtnBorderColor: "#BB4F4F"
      })
    } else if (this.data.imgUrl.length == 0){
      console.log('啥也没有')
      this.setData({
        BtnColor: "#cdcdcd",
        BtnBgColor: "#bfbfbf",
        BtnBorderColor: "#cdcdcd",
        DISABLED: true
      })
    }else{
      console.log('有照片啊')
      this.setData({
        BtnColor: "#FFE66A",
        BtnBgColor: "#CF7F7F",
        BtnBorderColor: "#BB4F4F",
        DISABLED: false
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

  },

  /**
   * 获取键盘高度
   */
  getKbH: function(e){
    console.log(e.detail.height)
    this.setData({
      KbHeight: e.detail.height
    })
  },

  /**
   * 失焦
   */
  KbHide: function(e){
    this.setData({
      KbHeight: 0
    })
  },

  /**
   * 键盘输入
   */
  bindInput: function(e){
    console.log(e.detail.value)
    this.setData({
      textCon: e.detail.value
    },()=>{
      // 判断发送按钮是否可点
      if (this.data.textCon) {
        console.log('已经写了东西')
        this.setData({
          BtnColor: "#FFE66A",
          BtnBgColor: "#CF7F7F",
          BtnBorderColor: "#BB4F4F",
          DISABLED: false
        })
      } else if (this.data.imgUrl.length == 0) {
        console.log('啥也没有')
        this.setData({
          BtnColor: "#cdcdcd",
          BtnBgColor: "#bfbfbf",
          BtnBorderColor: "#cdcdcd",
          DISABLED: true
        })
      } else {
        console.log('有照片啊')
        this.setData({
          BtnColor: "#FFE66A",
          BtnBgColor: "#CF7F7F",
          BtnBorderColor: "#BB4F4F",
          DISABLED: false
        })
      }
    })
  },

  /**
   * 选择图片
   */
  choosePic: function(e){
    // 获取当前已选照片数量
    this.setData({
      alreadyCount: this.data.imgUrl.length
    })

    if (this.data.alreadyCount == 4){
      wx.showToast({
        title: '最多选取四张图片',
        icon: 'none'
      })
    }else{
      wx.chooseImage({
        count: this.data.Count - this.data.alreadyCount,
        sizeType: 'original',
        sourceType: ['album', 'camera'],
        success: res => {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
          let a = this.data.imgUrl.concat(tempFilePaths)
          this.setData({
            imgUrl: a
          })
          console.log(this.data.imgUrl)

          // 判断发送按钮是否可点
          if (this.data.textCon) {
            console.log('已经写了东西')
            this.setData({
              BtnColor: "#FFE66A",
              BtnBgColor: "#CF7F7F",
              BtnBorderColor: "#BB4F4F",
              DISABLED: false
            })
          } else if (this.data.imgUrl.length == 0) {
            console.log('啥也没有')
            this.setData({
              BtnColor: "#cdcdcd",
              BtnBgColor: "#bfbfbf",
              BtnBorderColor: "#cdcdcd",
              DISABLED: true
            })
          } else {
            console.log('有照片啊')
            this.setData({
              BtnColor: "#FFE66A",
              BtnBgColor: "#CF7F7F",
              BtnBorderColor: "#BB4F4F",
              DISABLED: false
            })
          }
        },
        fail: console.error
      })
    }
  },

  /**
   * 删除照片
   */
  deleteImg: function(e){
    let bindex = e.currentTarget.dataset.index
    // 这个splice操作就是得分这样两部写。。。
    let b = this.data.imgUrl
    b.splice(bindex,1)

    // 这里是setData的回调函数的写法！！！！！！！！！！！！！！！！！！！
    this.setData({
      imgUrl: b
    },()=>{
      console.log(this.data.imgUrl)

      // 判断发送按钮是否可点
      if (this.data.textCon) {
        console.log('已经写了东西')
        this.setData({
          BtnColor: "#FFE66A",
          BtnBgColor: "#CF7F7F",
          BtnBorderColor: "#BB4F4F",
          DISABLED: false
        })
      } else if (this.data.imgUrl.length == 0) {
        console.log('啥也没有')
        this.setData({
          BtnColor: "#cdcdcd",
          BtnBgColor: "#bfbfbf",
          BtnBorderColor: "#cdcdcd",
          DISABLED: true
        })
      } else {
        console.log('有照片啊')
        this.setData({
          BtnColor: "#FFE66A",
          BtnBgColor: "#CF7F7F",
          BtnBorderColor: "#BB4F4F",
          DISABLED: false
        })
      }
    })
  },

  /**
   * 发表动态
   */
  formSubmit: function(e){
    console.log("发生了提交事件")
    var that = this;
    var IMGURL = this.data.imgUrl;
    var openid = this.data.openid;
    var textCon = this.data.textCon;
    var images_fileID = this.data.images_fileID;
    var date = new Date();
    var monthOri = date.getMonth() +1;
    var month = monthOri < 10 ? '0' + monthOri : '' + monthOri;
    var day = date.getDate();
    day = day < 10 ? '0' + day : '' + day;
    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour : '' + hour;
    var minute= date.getMinutes();
    minute = minute < 10 ? '0' + minute : '' + minute;
    var time = hour + ":" + minute;
    var now = date.getFullYear() + "/" + monthOri+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+","+date.getMilliseconds();
    var showtime = date.getFullYear() + "." + month + "." + day + " " + date.getHours() + ":" + date.getMinutes();
    var imgCT = IMGURL.length;

    //判断是否有图片
    if(IMGURL.length > 0){
      // for循环进行图片上传，因为upload执行一次只能上传一张
      for (var i = 0; i < IMGURL.length; i++) {
        var cutSlice = IMGURL[i].split("/");         //将临时路径以斜杠为端点进行拆分，得到一个数组
        var name = cutSlice[cutSlice.length - 1];         //取数组最后一个元素作为照片的名字，因为这个就很随机
        images_fileID = this.data.images_fileID;

        // 将图片进行云存储
        wx.cloud.uploadFile({
          cloudPath: "community/article_images/" + name,        //云存储路径
          filePath: IMGURL[i],                              //文件临时路径
          success: res => {
            console.log("存储了1张");
            images_fileID.push(res.fileID);         //拿到当前这轮返回来的fileID，加到列表中去
            this.setData({
              images_fileID: images_fileID          //更新data中的 fileID列表
            })
            if (images_fileID.length === IMGURL.length) {
              console.log("我要开始对数据库进行操作了")
              //对数据库进行操作
              sonSea.add({
                data: {
                  createOpenid: openid,
                  textCon: textCon,
                  imgUrl: IMGURL,
                  images_fileID: images_fileID,
                  imgCT: imgCT,
                  Time: now,
                  showtime: showtime,
                  month: month,
                  day: day,
                  time: time,
                  awCT: 0,
                  jsCT: 0,
                  scCT: 0,
                  plCT: 0,
                  awUsers: [],
                  jsUsers: [],
                  scUsers: [],
                  plUsers: []
                },
                success: res => {
                  console.log(res)
                  wx.navigateBack({
                    delta: 1
                  })
                },
                fail: console.error
              })
            }
          }
        })
      }
    }else{
      sonSea.add({
        data: {
          createOpenid: openid,
          textCon: textCon,
          imgUrl: IMGURL,
          images_fileID: images_fileID,
          imgCT: imgCT,
          Time: now,
          showtime: showtime,
          month: month,
          day: day,
          time: time,
          awCT: 0,
          jsCT: 0,
          scCT: 0,
          plCT: 0,
          awUsers: [],
          jsUsers: [],
          scUsers: [],
          plUsers: []
        },
        success: res => {
          console.log(res)
          wx.navigateBack({
            delta: 1
          })
        },
        fail: console.error
      })
    }
  }
})