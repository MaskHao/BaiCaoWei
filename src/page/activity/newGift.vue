<template>
  <div class="newGift content">
    <div class="hiddenTxt" id="J_appTitle">新人礼包</div>
    <p class="hiddenTxt" id="J_isShare"></p>
    <p class="hiddenTxt" id="J_shareTit">新人礼包·好礼免费拿</p>
    <p class="hiddenTxt" id="J_shareImg">http://img2.vipbcw.com/wap/app/g_share.jpg</p>
    <p class="hiddenTxt" id="J_shareDesc">首次下载百草味APP客户端，立送108元新人礼包</p>
    <p class="hiddenTxt" id="J_shareUrl">http://www.vipbcw.com/app_download.html?_f=newGift</p>
    <p class="hiddenTxt" id="open_event">NewerPackageClick</p>
    <p class="hiddenTxt" id="stay_time_event">NewerPackageViewTime</p>
    <div class="banner">

      <!--福利一-->
      <img src="//u.bcwcdn.com/activity_img/2017/img_0703/1800_01.jpg" alt="">
      <img src="//u.bcwcdn.com/activity_img/2017/img_0703/1800_02.jpg" alt="">
      <img src="//u.bcwcdn.com/activity_img/2017/img_0703/1800_03.jpg" alt="">


      <div class="log">
        <p>#首单结算满49元，50元礼券将自动放入您的账户#</p>
          <a href="/login/index" v-if="dataType == 1">请到我的-优惠券中查看</a>
          <a href="/user-center/coupons-list" v-else>请到我的-优惠券中查看</a>
      </div>
      <div class="register">
          <a href="/login/index"><img src="//u.bcwcdn.com/activity_img/2017/img_0629/register.png" alt="" v-show="registerShow"></a>
        <img src="//u.bcwcdn.com/activity_img/2017/img_0629/10.png" alt="" v-show="tenShow">
        <img src="//u.bcwcdn.com/activity_img/2017/img_0629/50.png" alt="" v-show="fivtyShow">
        <img src="//u.bcwcdn.com/activity_img/2017/img_0629/reject.png" alt="" v-show="rejectShow">
      </div>

      <div v-for="title in titleData" :key="title">
          <div class="first-tit tit pro-content" v-if="goodsList !='' && title.config_key == 'new_user_first_sign'">
              <img :src="title.config_value" alt="" v-if="title.config_value && title.config_key == 'new_user_first_sign'">
              <ul class="clearfix" id="J_ul1">
                  <li data-id="value.id" v-for="value in goodsList" :key="value">
                      <a :href="'/data-list/detail-goods?id=' + value.id">
                          <div class="goods-img">
                              <img class="lazy" v-lazy="value.goods_img+'?imageView2/1/w/320/h/320'">
                          </div>
                          <p class="goods-name">{{value.goods_name}}</p>
                          <p class="goods-price">¥{{value.shop_price / 100}}<del style="font-size:1rem;margin-left:3px">¥{{value.market_price / 100}}</del></p>
                      </a>
                      <div class="cart J_cart" @click="addCart(value.id)" style="right:2px;bottom:10px;width:30%;">
                          <img src="http://img2.vipbcw.com/wap/cart3.png" alt="">
                      </div>
                  </li>
              </ul>
          </div>


          <div class="second-tit tit" v-if="!isEmptyObject(bannerData) && title.config_key == 'new_user_second_sign'">
              <img :src="title.config_value" alt="" v-if="title.config_key == 'new_user_second_sign' && title.config_value">
              <div v-for="banner in bannerData" :key="banner" class="banner-img">
                  <a :href="banner.banner_url">
                      <img :src="banner.banner_img" alt="">
                  </a>
              </div>
          </div>
      </div>
        <p class="bottom-word">能滑到下面的都是小仙女哦~</p>

      <!--使用规则-->
    </div>


    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import {getConfig,userNew,giftBanner,giftTitle,tplGoods,getGoodsAddCart} from '../../service/getData'
  import Valert from '../../components/alertDialog'
  import {wxShare} from '../../assets/js/mUtils'

  export default{
    data(){
      return {
        goodsList : {},
        get:-1,
        show:0,
        registerShow:true,//立即注册
        fivtyShow:false, //10元优惠券
        tenShow:false, //50优惠券
          rejectShow:false,//不符合上述条件的

          bannerData:'', //banner数据
          titleData:'',//title图片数据
          goodsList:'',
          dataType:''
      }
    },
    components:{
      Valert,
    },
    created(){
      this.registerNow()
        this.getGiftTitle()
      this.getGiftBanner()
        this.getTplGoods()

      var ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        var wx = require('weixin-js-sdk');
        var _url = window.location.href;
        getConfig(_url).then(res => {
          wx.config(res.data.result_data);
        }).then(() => {
          wxShare(wx,'新人礼包·好礼免费拿','首单立减10元，满49包邮再送50元礼券','http://www.vipbcw.com/app_download.html?_f=newGift','http://img2.vipbcw.com/wap/app/g_share.jpg')
        })
      }
    },
    mounted(){

    },
    updated(){},
    methods:{
        registerNow(){
            userNew().then(res => {
                let data = res.data.result_data
                this.dataType = res.data.result_data.type
              /*type = 1 立即注册 2 10元优惠券到账 3 50元优惠券到账  4 不满足上述条件的*/
                if(data.type == 1){
                    this.registerShow = true
                    this.tenShow = false
                    this.fivtyShow = false
                    this.rejectShow = false
                }else if(data.type == 2){
                    this.registerShow = false
                    this.tenShow = true
                    this.fivtyShow = false
                    this.rejectShow = false
                }else if(data.type == 3){
                    this.registerShow = false
                    this.tenShow = false
                    this.fivtyShow = true
                    this.rejectShow = false
                }else{
                    this.registerShow = false
                    this.tenShow = false
                    this.fivtyShow = false
                    this.rejectShow = true
                }
            })
        },
        isEmptyObject(e){
            var t;
            for (t in e)
                return !1;
            return !0
        },
        getGiftBanner(){
          giftBanner().then(res => {
              this.bannerData = res.data.result_data
          })
        },
        getGiftTitle(){
            giftTitle().then(res => {
                this.titleData = res.data.result_data
            })
        },
        addCart(id,e){
            window.event? window.event.returnValue = false : e.preventDefault();
            getGoodsAddCart(id).then((response) => {//加入购物车
                if(response.data.result_code == 0){
                    this.$refs.alertTip.alert('加入购物车成功')
                    this.totalGoodsCount++
                }else{
                    this.$refs.alertTip.alert(response.data.result_info)
                }
            })
        },
        getTplGoods(){
            var  testId = 117,
                prevId = 18,
                onlineId = 125;
            var id = 0;
            var that = this;
            var address = window.location.href.split('/')[2];
            if(address == 'm.vipbcw.com'){
              id = onlineId
            }else if(address == 'prem.vipbcw.com'){
                id = prevId
            }else{
                id = testId
            }

            tplGoods(id).then(response => {
                var res = response.data;
                if(res.result_code == 0){
                    if(res.result_data){
                        that.goodsList = res.result_data.good_double_id[0].goods;
                    }
                }
            })
        },
    },
    watch:{}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,body{padding:0;margin:0;background: #fff;}
  .content {background: #fff;}
  .banner {overflow: hidden}
  .log {text-align: center;background: #fff;padding-bottom: 5px;}
  .log p,.log a {color: #ff6d4c;}
  .log a {text-decoration: underline}
  .register {
    width: 60%;
      padding: 20px 0;
    margin: 0 auto;
    background: #fff;
  }
  .tit {margin: 0 auto;padding-top: 10px;}
  .banner-img {
    margin: 10px auto;
  }
  .bottom-word {
      height: 30px; line-height: 30px;
      text-align: center;
      background: #f5f5f5;
  }

  .pro-content{background: #fff;}
  .pro-content li{float:left;width:42%;margin:15px 4% 0;padding:0 0 10px 0;position:relative;background: #fff;border-radius: 5px;overflow: hidden;}
  .pro-content li .goods-img{position: relative;}
  .pro-content li .goods-img .label{width:25%;position: absolute;top:0;left:0; z-index:2;}
  .pro-content li .goods-name{height: 3.2rem;overflow: hidden;line-height: 1.6rem;margin: 5px 0 8px;font-size: 1.4rem;}
  .pro-content li .goods-price{font-size: 1.6rem;color:#ff4f39;}
  .pro-content li .goods-price del{font-size: 1rem;color:#aaa;margin-left:3px;}
  .pro-content li .cart{position: absolute;right: 2%;bottom:10px;width:30%;}
</style>



// WEBPACK FOOTER //
// newGift.vue?3bae05b4