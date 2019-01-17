<template>
  <div class="coupCenter">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      领券中心
      <div class="header-right"></div>
    </div>
    <img :src="banner"/>
    <ul class="coup-list">
      <li class="clearfix" v-for="(value,index) in coupList">
        <div class="left" v-if="value.random_type == 3">
          <p class="price">—— {{value.left_title}} ——</p>
          <p class="textHidden">{{value.cou_name}}</p>
          <p class="time" v-html="value.take_info"></p>
        </div>
        <div v-else class="left">
          <p class="price">¥<i>{{value.left_title}}</i><span>{{value.left_msg}}</span></p>
          <p class="textHidden">{{value.cou_name}}</p>
          <p class="time" v-html="value.take_info"></p>
        </div>
        <div v-if="value.is_take == 1" class="right"><img @click="getCoupFun(value.id,index)" src="http://img2.vipbcw.com/wap/coupCenter_get.png"/> </div><!--领取-->
        <div v-else-if="value.is_take == 2" class="right"><img @click="showNoneFun" src="http://img2.vipbcw.com/wap/coupCenter_none.png"/> </div> <!--已抢完-->
        <div v-else class="right"><a :href="value.skip_url"><img src="http://img2.vipbcw.com/wap/coupCenter_go.png"/></a> </div><!--去使用-->
      </li>
    </ul>
    <p style="text-align: center;line-height: 4rem;">
      <a v-if="isLogin == 1" href="/user-center/coupons-list" style="color:#333;font-size: 1.4rem;">去查看我的优惠券></a>
      <a v-if="isLogin == 0" href="/login/index" style="color:#333;font-size: 1.4rem;">去查看我的优惠券></a>
      <a v-if="isLogin == 2" href="/user-info/bind-phone" style="color:#333;font-size: 1.4rem;">去查看我的优惠券></a>
    </p>
    <div v-if="bannerList.length > 0">
      <img src="http://img2.vipbcw.com/wap/coup_tit2.png"/>
      <ul class="banner-list">
        <li v-for="value in bannerList">
          <a :href="value.skip_url"><img :src="value.activity_image"/> </a>
        </li>
      </ul>
    </div>
    <div style="padding-bottom:80px;" v-if="goodsList.length > 0">
      <img src="http://img2.vipbcw.com/wap/coup_tit1.png"/>
      <ul class="classify-list-content clearfix">
        <li v-for="list in goodsList">
          <router-link v-bind:to="{path: '/data-list/detail-goods',query: {id: list.id}}">
            <img v-lazy="list.goods_img+'?imageView2/1/w/320/h/320'" />
            <p class="name textHidden">{{list.goods_keyword}}</p>
            <p class="desc">{{list.goods_name}}</p>
            <p class="price">{{list.shop_price}}</p>
          </router-link>
          <div class="buy-btn" v-on:click="addCart(list.id)"></div>
        </li>
      </ul>
    </div>
    <router-link to="/user-event/list-cart" v-if="goodsList.length > 0" class="fixed-cart"><i v-if="cartNum != 0">{{cartNum}}</i></router-link>

    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import {coupCenter,getGoodsAddCart,getCoupon,cartGoods} from '../../service/getData'
  import Valert from '../../components/alertDialog'

  export default{
    data(){
      return {
          banner:'http://img2.vipbcw.com/wap/coup_banner.png',
        goodsList:[],
        bannerList:[],
        coupList:[],
        cartNum:0,
        isLogin:0,//0未登录，1已登陆，2绑定手机号
      }
    },
    components:{
      Valert,
    },
    created(){
      this.getCoupList();
      this.getCarNum();
    },
    mounted(){

    },
    updated(){},
    methods:{
      getCoupList(){
        var that = this;
        coupCenter().then(res => {
          if(res.data.result_code == 0){
            that.banner = res.data.result_data.banner_image;
            that.goodsList = res.data.result_data.activity_goods;
            that.bannerList = res.data.result_data.activity_image;
            that.coupList = res.data.result_data.coupon_list;
          }else{
            this.$refs.alertTip.alert(res.data.result_info)
          }

        })
      },
      addCart(id) {
        var that = this;
        getGoodsAddCart(id).then((response) => {
          if (response.data.result_code == 0) {
            that.$refs.alertTip.alert('加入购物车成功')
            that.cartNum = Number(that.cartNum) + 1;
          } else {
            that.$refs.alertTip.alert(response.data.result_info)
          }
        })
      },
      getCarNum(){
        var that = this
        cartGoods().then((response) => {
          if(response.data.result_code == 0){
            that.isLogin = 1;
            that.cartNum = response.data.result_data.total_goods_count;
          }else if(response.data.result_code == '1003'){
            if(typeof(response.data.result_data.openid) != 'undefined'){
              setSessionStore('bindInfo',response.data.result_data);
              // 跳临时用户绑定手机号页面
              that.isLogin = 2;
            }else{
              that.isLogin = 0;
            }
          }
        })
      },
      getCoupFun(id,index){
        var that = this;
        getCoupon(id).then(res => {
          if(res.data.result_code == 0){
            that.$refs.alertTip.alert('领取成功');
            that.getCoupList();
          }else{
            that.$refs.alertTip.alert(res.data.result_info)
          }
        })
      },
      showNoneFun(){
        this.$refs.alertTip.alert('已经抢完了，下次早点来哦')
      }
    },
    watch:{}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;top:0;left:0;width:100%;z-index:999; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}

  .coupCenter{background: #fff;padding-top:46px;}
.coup-list li{margin:15px auto;background: url("http://img2.vipbcw.com/wap/coupCenter_bg.png") no-repeat; background-size: 100% 100%;}
.coup-list li .left{width:79%;height:100%;overflow:hidden;float:left;}
.coup-list li .right{width:21%;height:100%;overflow:hidden;float:right;text-align: center;}
.coup-list li .right img{width:70%;}
.coup-list li .left p{color:#fff;font-size:1.4rem;line-height: 2.4rem;text-align: center;width:90%;margin:0 auto;}
.coup-list li .left p.time{font-size:1.3rem;color:#333;}
.coup-list li .left p.price i{font-size:2.4rem;}
.coup-list li .left p.price span{padding-left:5%;font-size:1.4rem}
@media screen and (min-width:320px){
  .coup-list li{width:290px;height:102px;}
  .coup-list li .right img{margin-top:61px;}
  .coup-list li .left{padding-top:10px;}
}
@media screen and (min-width:375px){
  .coup-list li{width:340px;height:120px;}
  .coup-list li .right img{margin-top:72px;}
  .coup-list li .left{padding-top:15px;}
}
@media screen and (min-width:414px){
  .coup-list li{width:380px;height:134px;}
  .coup-list li .right img{margin-top:80px;}
  .coup-list li .left{padding-top:20px;}
}
@media screen and (min-width:481px){
  .coup-list li{width:450px;height:158px;}
  .coup-list li .right img{margin-top:95px;}
  .coup-list li .left{padding-top:25px;}
}
.banner-list{padding:10px 0;}
  .banner-list li{margin:10px auto;}
.classify-list-content {
  overflow: hidden;
  background:#fff;
}

.classify-list-content li{
  float: left;
  width: 45.5%;
  line-height: 20px;
  padding: 0 0 10px;
  margin: 10px 3% 0;
  font-size: 1.4rem;
  background: #fff;
  position: relative;
}

.classify-list-content li .logo{
  width: 45px;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 3;
}

.classify-list-content li:nth-child(even){
  margin-left: 1.5%;
}

.classify-list-content li:nth-child(odd) {
  margin-right: 1.5%;
}


.classify-list-content li .name{
  height:2.4rem;
  line-height: 2.4rem;
  margin: 0 auto;
  font-size:1.3rem;
  overflow: hidden;
  font-weight: bold;;
}
.classify-list-content li .desc{
  line-height: 1.6rem;
  height:3.2rem;
  color:#393939;
  margin: 0 auto;
  overflow: hidden;
}

.classify-list-content li .price {
  position: relative;
  height:2.6rem;line-height: 2.6rem;
  color: #FF4348;
  font-size: 1.4rem;
}

.classify-list-content li .price:before {
  content: '¥';
}

.classify-list-content li p em {
  display: inline-block;
  line-height: 20px;
  padding: 0 5px;
  margin-left: 5px;
  background: #FF4348;
  color: #fff;
  font-size: 1rem;
}

.classify-list-content .none {
  display: none;
}
  .fixed-cart{width:55px;height:55px;position:fixed;bottom:20px;right:20px;background:#fff url("http://img2.vipbcw.com/wap/icon_cart3.png") no-repeat center center;background-size:25px auto;border-radius:50%;box-shadow: 0 0 5px #999;}
  .fixed-cart i{width:20px;height:20px;border-radius:10px; background: rgba(255,67,72,1);color:#fff;text-align:center;line-height:20px;position:absolute;top:8px;right:8px;}

</style>



// WEBPACK FOOTER //
// coupCenter.vue?2bbd0bbc