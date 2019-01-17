<template>
  <div :class="{'appBox':bcwMall == 1 && appVs >= 211 && vs == 'IOS'}">
    <p class="hiddenTxt" id="open_event">SigninClick</p>
    <p class="hiddenTxt" id="stay_time_event">SigninViewTime</p>
    <div class="hiddenTxt" id="J_appTitle">每日签到</div>
    <p class="hiddenTxt" id="J_isShare"></p>
    <!--未绑定手机号-->
    <div class="noLogin-box" :class="{'show' : isLogin == '-1'}" style="padding:30% 0 0 0;">
      <img style="width:33.33%;" src="//a.bcwcdn.com/wap/none-login.png"/>
      <p>您还没有绑定手机，先绑定手机号哦</p>
      <a style="width:33.33%;" href="/user-info/bind-phone">绑定手机</a>
    </div>
    <!--未登录状态-->
    <div class="noLogin-box" :class="{'show' : isLogin == '0'}"  style="padding:30% 0 0 0;">
      <img style="width:33.33%;" src="//a.bcwcdn.com/wap/none-login.png"/>
      <p>您还没有登录，抱抱熊喊你先登录哦</p>
      <a style="width:33.33%;" href="/login/index">去登录</a>
    </div>
    <!--常态-->
    <div :class="{'show' : isLogin == '1'}" id="sign-box">
      <div class="top-box">
        <div class="top-header clearfix">
          <p class="head"><img v-if="avatar" :src="avatar + '?imageView2/2/w/100'"/></p>
          <p class="name" v-html="userInfo.nickname"></p>
          <p class="dou"><img src="//u.bcwcdn.com/activity_img/2017/img_sign/sign-dou.png"/>我的味豆：<i v-html="userInfo.integration"></i></p>
        </div>
        <div class="top-btn clearfix">
          <div @click="signFun(0)" class="btn btn-sign" :class="{'show':isSign==0}">今日签到 +<i v-html="nowSign.integral"></i></div>
          <div @click="signFun(1)" class="btn btn-complete" :class="{'show':isSign==1}">已签 明日+<i v-html="tomorrowDou"></i></div>
          <a href="javascript:;" class="btn btn-complete" :class="{'show':taskInfo.now == taskInfo.sum}">已完成 明日来战</a>
          <a href="/integral-mall/earn-peans" class="btn btn-link" :class="{'show':taskInfo.now != taskInfo.sum}">今日任务 <i style="color:#ff4f39;" v-html="taskInfo.now"></i>/<i v-html="taskInfo.sum"></i></a>
        </div>
        <div @click="setRemind" class="top-remind" :class="{'open' : isRemind == 1 && isNotice == 1,'show':bcwMall == 1}">
          <span><i></i></span>
          <p>签到提醒</p>
        </div>
      </div>
      <p class="day-box"> (•̀ᴗ•́)و ̑̑ 与你在一起的<i v-html="userInfo.manyDays"></i>天<i style="float: right;" v-html="time"></i></p>
      <div class="slide-box" :class="{'show':everyInfo != ''}">
        <div class="slide-content">
          <swiper :options="bannerSwiper" ref="mySwiper">
            <swiper-slide class="swiper-li clearfix" v-for="value in everyInfo">
              <img class="banner-img" :src="value.content_img == ''?'//u.bcwcdn.com/activity_img/2017/img_sign/img.png':value.content_img + '?imageView2/1/w/350/h/260'"/>
              <p v-html="value.content"></p>
              <p class="icon-share" :class="{'show':bcwMall == 1 && value.share_img && vs == 'IOS'}" @click="shareImages(value.share_img)"><img src="../../assets/images/ic_share.png"/> </p>
            </swiper-slide>
          </swiper>
        </div>
        <div class="jt-right"><img src="//u.bcwcdn.com/activity_img/2017/img_sign/jt_right.png"/> </div>
      </div>
      <div class="banner-box cont3 clearfix" :class="{'show':images.length == 3 && images != ''}">
        <a v-for="value in images" :href="value.skip_url == ''?'javascript:;' :value.skip_url"><img :src="value.image_url"/></a>
      </div>
      <div class="banner-box cont2 clearfix" :class="{'show':images.length == 2 && images != ''}">
        <a v-for="value in images" :href="value.skip_url == ''?'javascript:;' :value.skip_url"><img :src="value.image_url"/></a>
      </div>
      <div class="banner-box cont1 clearfix" :class="{'show':images.length == 1 && images != ''}">
        <a v-for="value in images" :href="value.skip_url == ''?'javascript:;' :value.skip_url"><img :src="value.image_url"/></a>
      </div>
      <div class="pro-content">
        <img src="//u.bcwcdn.com/activity_img/2017/img_sign/pro_title.png"/>
        <ul class="clearfix" id="J_ul1">
          <li data-id="value.id" v-for="value in goodsList">
            <a :href="'/data-list/detail-goods?id=' + value.id">
              <div class="goods-img">
                <img class="lazy" v-lazy="value.goods_img+'?imageView2/1/w/320/h/320'">
              </div>
              <p class="goods-name">{{value.goods_name}}</p>
              <p class="goods-price">¥{{value.shop_price / 100}}<del style="font-size:1rem;margin-left:3px">¥{{value.market_price / 100}}</del></p>
            </a>
            <div class="cart J_cart" @click="addCart(value.id)" style="right:2px;bottom:10px;width:30%;">
              <img src="//a.bcwcdn.com/wap/cart3.png" alt="">
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom" style="background: none;">
        <img src="//a.bcwcdn.com/projectWap/bottom_logo.png">
      </div>
      <div class="sign-over" :class="{'show':showPop == 1}">
        <div class="sign-pop">
          <img @click="closePop" class="close-btn" src="//u.bcwcdn.com/activity_img/2017/img_sign/sign-close.png"/>
          <p class="title">连续签到</p>
          <p class="num"><i v-html="signDay"></i>天</p>
          <p class="desc">连续签到味豆会魔法递增哦~</p>
          <ul class="clearfix">
            <li v-for="(value,index) in signInfo" :class="{'on' : value.isSign == 1 || index == 3}">
              <p class="circular" v-html="'+' +value.integral"></p>
              <p v-html="value.str"></p>
            </li>
          </ul>
          <a v-if="banner.image_url != ''" :href="banner.skip_url == ''?'javascript:;' :banner.skip_url"><img :src="banner.image_url"/></a>
        </div>
      </div>
    </div>
    <Valert ref='alertDialog'></Valert>
    <!--设置通知弹窗-->
    <div class="member-tip-box" :class="{'show':popShow == 1}">
      <img class="close" @click="closeTip()" src="//a.bcwcdn.com/wap/v_close.png"/>
      <p class="tip-content">去设置中开启通知，<br/>才可接收签到提醒哦！</p>
      <p class="tip-content-btn" @click="openSetting">去设置</p>
    </div>
  </div>
</template>

<script>
  import {singRemind,doSign,signIndex,tplGoods,getGoodsAddCart} from 'service/getData'
  import {jsBridge} from 'assets/js/mUtils'
  import Valert from 'components/alertDialog'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default{
    data(){
      return {
        'notNextTick' : true,
        'userInfo':{},
        'isRemind':0,//签到提醒 1=>打开
        'isNotice':0,//客户端通知 1=>打开
        'taskInfo':{},
        'signInfo':{},
        'everyInfo':[],
        'banner':[],
        'images':[],
        'time':'',
        'nowSign':{},
        'isSign':6,
        'tomorrowDou':'',
        'showPop':0,
        'signDay':0,
        'avatar':'',
        'bcwMall':0,//是否在app中打开 1=>app中
        'isLogin':'',//1=>登录；0=>未登录；-1=>未绑定
        'goodsList':[],
        'bannerSwiper': {
          everyInfo:[],
          vs:'',// 统计
          terminal:'',//统计
          flag:0,//1=> 期待明日再见哦！ 2=>亲爱的，到头了哦！
          initialSlide :7,
          pagination : '.swiper-pagination',
          observer:true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,//修改swiper的父元素时，自动初始化swiper
          loop : false,
          onTouchStart: function(swiper, event){
            if(swiper.isEnd || swiper.isBeginning){
              this.eStart = Number(event.touches[0].screenX);
            }
          },
          onTouchEnd: function(swiper, event){
            this.eEnd = Number(event.changedTouches[0].screenX);
            if(swiper.isEnd && this.eEnd < this.eStart && this.eStart-this.eEnd > 30){
              this.flag = 1;
            }
            if(swiper.isBeginning && this.eEnd > this.eStart && this.eEnd-this.eStart > 30){
              this.flag = 2;
            }
          },
          onSlideChangeEnd: function(swiper){
            if(this.everyInfo.length > 0){
              var _name = 'signImg-'+this.everyInfo[swiper.activeIndex].date; //切换结束时，告诉我现在是第几个slide
              _hmt.push(['_trackEvent', _name, this.vs , this.terminal ,'']);
            }
          }
        },
        'setupWebViewJavascriptBridge':{},//客户端调用的方法
        'cmbMerchantBridge':{},//调用客户端方法
        'popShow':0,
        'appVs':0, //app版本号
        'vs':'',// 统计
        'terminal':''//统计
      }
    },
    components:{
      swiper,
      swiperSlide,
      Valert,
    },
    created(){
      this.getSingInfo()
      this.getTplGoods()
      this.chackUA()
      if(this.bcwMall == 1 && this.vs == 'IOS'){
        this.setBridge()
      }else if(this.bcwMall == 1 && this.vs == 'android'){
        this.isNotice = 1
      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }

    },
    methods:{
        getSingInfo(){
          var that = this;
          that.time = that.getNowFormatDate();
          signIndex().then(response => {
            if(response.data.result_code == 0){
              that.isLogin = '1';
              var result = response.data.result_data;
              that.userInfo = result.userInfo;//用户信息
              that.avatar = result.userInfo.avatar;//用户信息
              that.isRemind = result.isRemind;//是否提醒 0 不提醒 1 提醒
              that.taskInfo = result.taskInfo;//任务信息
              that.signInfo = result.signInfo;//签到信息
              that.everyInfo = result.everyInfo;//每日一话数据
              that.bannerSwiper.everyInfo = result.everyInfo;//每日一话数据
              for(var i in result.bannerInfo.images){
                that.images.push(result.bannerInfo.images[i]);
              }
              //                            that.images = result.bannerInfo.images;//banner信息
              that.banner = result.bannerInfo.banner;//banner信息
              that.nowSign = result.signInfo[3];
              that.signDay = result.signInfo[3].signDay;
              that.isSign = that.nowSign.isSign;
              that.tomorrowDou = result.signInfo[4].integral;
            }else if(response.data.result_code == '1003'){
              if(typeof(response.data.result_data.openid) != 'undefined'){
                that.isLogin = '-1'
              }else{
                that.isLogin = '0'
              }
            }
          })
        },
        getNowFormatDate() {
          var date = new Date();
          var seperator1 = "/";
          var seperator2 = ":";
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
          return currentdate;
        },
        closePop(){
          this.showPop = 0;
        },
        signFun(sign){
          var that = this;
          _hmt.push(['_trackEvent', 'signBtn', this.vs , this.terminal ,'']);
          this.showPop = 1;
          if(sign == 0){
            doSign().then(res => {
              if(res.data.result_code == 0){
                that.isSign = 1;
                that.userInfo.integration = Number(that.userInfo.integration) + Number(that.nowSign.integral)
              }else{
                that.$refs.alertDialog.alert(res.data.result_info);
              }
            })
          }
        },
        setRemind(){
          _hmt.push(['_trackEvent', 'remindBtn', this.vs , this.terminal ,'']);
          var that = this;
          if(that.isNotice == 0){
            //显示打开通知提醒
            that.popShow = 1;
          }else{
            singRemind().then(function(res){
              var result = res.data;
              if(result.result_code == 0){
                that.isRemind = result.result_data.is_remind;
                if(result.result_data.is_remind == 1){
                  that.$refs.alertDialog.alert('签到提醒设置成功');
                }else{
                  that.$refs.alertDialog.alert('已成功关闭签到提醒');
                }
              }else{
                that.$refs.alertDialog.alert(result.result_info)
              }
            })
          }
        },
        chackUA(){
          var ua = navigator.userAgent;
          if(ua.indexOf("bcwmall") > 0){
            this.bcwMall = 1;
            var _arr = ua.split('/');
            var _length = _arr.length - 1;
            var vs_arr = _arr[_length].split(".");
            this.appVs = vs_arr.join('').substring(0,3);
          }
          var browser = {
            versions: function() {
              var u = navigator.userAgent, app = navigator.appVersion;
              return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                bcwMall:u.indexOf('bcwmall') > -1
              };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
          };
          if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
            this.vs = 'IOS'
            this.bannerSwiper.vs = 'IOS'
          }else if(browser.versions.android){
            this.vs = 'android'
            this.bannerSwiper.vs = 'android'
          }
          if(browser.versions.bcwMall){
            this.terminal = 'app'
            this.bannerSwiper.terminal = 'app'
          }else{
            this.terminal = 'wechat'
            this.bannerSwiper.terminal = 'wechat'
          }
        },
        getTplGoods(){
          var that = this;
          tplGoods('112').then(response => {
            var res = response.data;
            if(res.result_code == 0){
              if(res.result_data){
                that.goodsList = res.result_data.good_double_id[0].goods;
              }
            }
          })
        },
        addCart(id) {
          getGoodsAddCart(id).then((response) => {
            if (response.data.result_code == 0) {
              this.$refs.alertDialog.alert('加入购物车成功')
            } else {
              this.$refs.alertDialog.alert(response.data.result_info)
            }
          })
        },
        setBridge(){
          var that = this;
          this.setupWebViewJavascriptBridge = jsBridge().jsBridgeFun;
          window.cmbMerchantBridge = jsBridge().merchantBridge;
          this.setupWebViewJavascriptBridge(function(bridge){
            bridge.registerHandler('appSetChange', function (data, responseCallback) {
              var obj = data;
              if(navigator.userAgent.indexOf("Android") > 0){
                obj = eval('(' + data + ')');
              }
              that.isNotice = obj.isNotice;
              if(that.isNotice == 1 && that.isRemind == 0 && obj.setChange == 1){
                singRemind().then(function(res){
                  var result = res.data;
                  if(result.result_code == 0){
                    that.isRemind = result.result_data.is_remind;
                    if(result.result_data.is_remind == 1){
                      that.$refs.alertDialog.alert('签到提醒设置成功');
                    }else{
                      that.$refs.alertDialog.alert('已成功关闭签到提醒');
                    }
                  }else{
                    that.$refs.alertDialog.alert(result.result_info)
                  }
                })
              }
              var responseData = {"javascript": "success"};
              responseCallback(responseData)
            })
          })
        },
        shareImages(imgSrc){
          var _shareInfo = { 'image_link' : imgSrc};
          cmbMerchantBridge.initSignNet( "jsShareImages" , _shareInfo );

        },
        openSetting(){
          this.popShow = 0;
          cmbMerchantBridge.initSignNet( "jsOpenSetting" , '' );
        },
        closeTip(){
            this.popShow = 0;
        }
    },
    watch:{
      'bannerSwiper.flag'(){
        if(this.bannerSwiper.flag == 1){
          this.$refs.alertDialog.alert('期待明日再见哦！')
        }else if(this.bannerSwiper.flag == 2){
          this.$refs.alertDialog.alert('亲爱的，到头了哦！')
        }
        this.bannerSwiper.flag = 0
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .noLogin-box,#sign-box{display:none;}
  .noLogin-box.show,#sign-box.show{display:block;}
  body{background: #ededed;}
  .hiddenTxt{display:none;}
  .top-box{padding-top:30px;background:url("//u.bcwcdn.com/activity_img/2017/img_sign/sign-bg.png") no-repeat; background-size: 100% 100%;}
  .appBox .top-box{padding-top:80px;}
  .top-box .top-header{padding:0 5%;}
  .top-box .top-header .head{width:70px;height:70px;float: left;border:solid 2px #fff;border-radius: 35px;margin-right:10px;overflow: hidden;}
  .top-box .top-header .name{color:#333;font-size: 1.4rem;font-weight: bold;height:3rem;line-height: 2rem;padding-top:1rem;}
  .top-header .dou{height:1.5rem;line-height: 1.5rem;}
  .top-header .dou img{height:1.5rem;width:auto;margin-right:5px;}
  .top-header .dou i{color:#ff4f39;}
  .top-btn{padding:30px 0;}
  .top-btn .btn{display:none;width:35%;float: left;height:40px;line-height: 40px;background: #ff872f;color:#fff;margin-left:10%;text-align: center;border-radius: 20px;font-size:1.4rem;}
  .top-btn .btn-link{background:#ff9e2f;}
  .top-btn .btn-complete{background:#fff;border:solid 1px #ff872f;color:#ff872f;}
  .top-btn .btn.show{display: block;}
  .day-box{padding:8px 3%;background: #ffdb7d;color:#ff872f;}
  .slide-box{padding:10px 3% 10px 8%;position: relative;display:none}
  .slide-box.show{display: block;}
  .slide-box .jt-right{position: absolute;width:5%;top:50%;left:3%;-webkit-transform: translate(0,-50%);
    -moz-transform: translate(0,-50%);
    -o-transform: translate(0,-50%);
    -ms-transform: translate(0,-50%);
    transform: translate(0,-50%);}
  .slide-content{width:100%;background: #fff;}
  .slide-content .swiper-li{padding:10px;position: relative;}
  .slide-content .swiper-li .banner-img{float: left;width:53%;margin-right:2%;}
  .slide-content .swiper-li p{color:#333;line-height: 2rem;}
  .slide-content .swiper-li .icon-share{width:12%;position: absolute;bottom:5px;right:10px;display: none;}
  .slide-content .swiper-li .icon-share.show{display: block;}
  .banner-box{padding:10px 3%;background: #fff;margin-bottom:10px;display:none}
  .banner-box.show{display:block}
  .banner-box a{float: left; width:49%;}
  .banner-box.cont1 a{width:100%;}
  .banner-box.cont3 a:first-child,.banner-box.cont2 a:first-child{margin-right:2%;}
  .banner-box.cont3 a:last-child{margin-top:8px;}
  .pro-content{background: #fff;}
  .pro-content li{float:left;width:42%;margin:15px 4% 0;padding:0 0 10px 0;position:relative;background: #fff;border-radius: 5px;overflow: hidden;}
  .pro-content li .goods-img{position: relative;}
  .pro-content li .goods-img .label{width:25%;position: absolute;top:0;left:0; z-index:2;}
  .pro-content li .goods-name{height: 3.2rem;overflow: hidden;line-height: 1.6rem;margin: 5px 0 8px;font-size: 1.4rem;}
  .pro-content li .goods-price{font-size: 1.6rem;color:#ff4f39;}
  .pro-content li .goods-price del{font-size: 1rem;color:#aaa;margin-left:3px;}
  .pro-content li .cart{position: absolute;right: 2%;bottom:10px;width:30%;}
  .top-remind{width:60px;position:absolute;top:35px;right:5%;text-align: center;display:none;}
  .appBox .top-remind{top:90px;}
  .top-remind.show{display:block;}
  .top-remind span{display:block;width:58px;height:25px;border-radius: 13px;background: #fff;}
  .top-remind p{line-height: 1.6rem;color:#ff872f;}
  .top-remind span i{display: block;width:25px;height:25px;border-radius: 13px;background: #c0c0c0;}
  .top-remind.open span i{display: block;width:25px;height:25px;border-radius: 13px;background: #ff872f;float: right}
  .noLogin-box{padding:30% 25% 0;;text-align: center;font-size: 1.4rem;}
  .noLogin-box p{margin:20px 0 10px;}
  .noLogin-box a{width:50%;height:40px;border-radius: 20px;text-align: center;background: #ff4f39;display: inline-block;line-height: 40px;font-size: 1.4rem;color:#fff;}
  .sign-over{width:100%;height:100%;position: fixed;top:0;left:0;background: rgba(0,0,0,.4);z-index: 990;display: none;}
  .sign-over.show{display: block;}
  .sign-over .sign-pop{width:76%;position: absolute;top:50%;left:50%;background:#fff;z-index: 999;border-radius: 15px;overflow: hidden;-webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);padding-top:30px;text-align: center;}
  .sign-over .sign-pop .title{font-size: 1.4rem;color:#333;}
  .sign-over .sign-pop .num{font-size: 1.2rem;color:#333;padding-top:5px;}
  .sign-over .sign-pop .num i{font-size: 3rem;color:#ff9e2f;font-weight: bold;padding:0 3px;}
  .sign-over .sign-pop .desc{color:#ff9e2f;padding:10px 0;}
  .sign-over .sign-pop .close-btn{width:5%;position: absolute;top:15px; right:15px;}
  .sign-over .sign-pop ul{padding:0 3% 15px;}
  .sign-over .sign-pop li{float: left;width:14.2%;}
  .sign-over .sign-pop li p{color:#333;line-height: 2rem;text-align: center;font-size: 1rem;}
  .sign-over .sign-pop li .circular{width:30px;height:30px;line-height: 30px;background: #d9d9d9;color:#fff;border-radius: 15px;margin:0 auto;font-size: 1rem;}
  .sign-over .sign-pop li.on .circular{background: #ff9e2f;}
  .bottom{background: none;padding: 25px;text-align: center;}
  .bottom img{width:30%}
  .member-tip-box{width:66%;background:#fff;border-radius:15px;position:fixed;top:50%;left:50%;-webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);z-index:999;text-align:center;padding:3rem 5%;display:none;}
  .member-tip-box.show{display:block;}
  .member-tip-box .tit-img{width:26px;position:absolute;top:-17px;left:50%;margin-left:-13px;}
  .member-tip-box .close{width:5%;position:absolute;top:10px;right:10px;}
  .member-tip-box .tip-content{font-size:1.4rem;line-height:2rem;padding:1rem 0;color:#333;}
  .member-tip-box .tip-content-tit{font-size:1.4rem;font-weight:bold;line-height:2rem;}
  .member-tip-box .tip-content-desc{line-height:2rem;margin-top:1rem;}
  .member-tip-box .tip-content-btn{width:40%;height:30px;line-height:30px;background:#ffbc28;color:#FFF;border-radius:15px;margin:10px auto 0;display:block;}

</style>



// WEBPACK FOOTER //
// index.vue?c2fbbd10