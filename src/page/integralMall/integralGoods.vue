<template>
  <div class="integrtal-goods">
    <div class="index-flash" style="overflow:hidden;">
      <div class="backBox" @click="back()"><i class="icon-iconback"></i></div>
      <img src="../../assets/images/s_goods.jpg" alt="">
      <div class="sliderBox">
        <div class="swiper-container swiper1">
          <swiper>
            <swiper-slide v-for="goodsImg in goodsData.goods_imgs" :key="goodsImg"><img :src="goodsImg+'?imageView2/2/w/640/'"></swiper-slide>
            <div class="swiper-pagination"></div>
          </swiper>
        </div>
      </div>
    </div>
    <div class="integral-mall">
      <div class="goods-tit">
        <p class="p1"><i v-html="goodsData.integration_number"></i><em v-html="goodsData.level_info.level_tip"></em><span v-if="goodsData.limit_count" v-html="'限购'+goodsData.limit_count+'件'"></span><s v-html="goodsData.shop_price > 0 ? '¥'+goodsData.shop_price : ''" class="fr"></s></p>
        <p class="p2" v-html="goodsData.goods_name"></p>
        <p style="margin-top:5px;" v-html="goodsData.goods_desc"></p>
      </div>
      <div class="goods-info">
        <p class="tit" style="font-weight:bold;"><img style="width:5%;margin-right:5px;" src="http://img2.vipbcw.com/wap/integral-mall/Shape_icon.png" alt="">兑换流程</p>
        <div class="rull">
          <p v-for="(goods_rule,index) in goodsData.goods_rules"  :key="index"><i v-html="index +1"></i><em v-html="goods_rule"></em></p>
        </div>
      </div>
      <div class="exchangeInfo" v-if="goodsData.stock_number <= 0">
        <div class="integral-btn1 dis">已抢完</div>
      </div>
      <div class="exchangeInfo" v-else>
        <div v-if="goodsData.goods_type == 0">
          <div class="leftGoods">还剩<span v-html="goodsData.stock_number"></span>件</div>
          <div class="integral-btn" @click="exchange(goodsData.goods_type)">立即兑换</div>
        </div>
        <div v-else>
          <div class="leftGoods">还剩<span v-html="goodsData.stock_number"></span>件</div>
          <div class="integral-btn" @click="exchange(goodsData.goods_type)">立即兑换</div>
        </div>
      </div>
      <div class="goodsImgs">
      </div>
      <!-- 优惠券弹窗 -->
      <div v-if="alertAction == 1 || alertAction == 2 || alertAction == 3" class="coup-mark"></div>
      <div v-if="alertAction == 1" class="coup-pop">
        <img src="http://img2.vipbcw.com/wap/sign/exCoup_bg.png">
        <div class="ab">
          <p class="p1">优惠券<i>兑换成功!</i></p>
          <p class="p2"><router-link :to="{ path :'/user-center/coupons-list' }">去查看</router-link>
            <router-link class="goUse" :to="{ path : goToUse == '' ? '/home/index' : goToUse }">去使用</router-link></p>
        </div>
      </div>
      <!-- 味豆不足 -->
      <div v-if="alertAction == 2" class="coup-pop pop1">
        <p class="close" @click="closePop()"><img src="../../assets/images/ic_close.png"/> </p>
        <p class="p-desc">啊哦！你的味豆不够，快去赚味豆吧！</p>
        <router-link class="p-link" to="/integral-mall/earn-peans">赚味豆</router-link>
      </div>
      <!-- 等级不够 -->
      <div v-if="alertAction == 3" class="coup-pop pop1">
        <p class="close" @click="closePop()"><img src="../../assets/images/ic_close.png"/> </p>
        <p class="p-desc">V{{goodsData.level_type}}专享，您的等级不够哦！快去升级吧！</p>
        <router-link class="p-link" :to="{ path : '/member/rule' , query:{type:3} }">快去升级</router-link>
      </div>
    </div>
    <Valert ref="alertTip"></Valert>
    <Vconfirm ref="confirmTip"></Vconfirm>
  </div>
</template>

<script>
  import Valert from '../../components/alertDialog'
  import Vconfirm from '../../components/confirmDialog'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import {setSessionStore,getSessionStore} from '../../assets/js/mUtils'
  import {integralMallGoodsDetail,integralMallCoupExchange,integralMallRealExchange,userInfo} from '../../service/getData'

  export default{
    data(){
      return {
        goodsId:null,
        goodsData:{level_info:{level_tip:''}},
        swiper1: {
          pagination: '.swiper-pagination',
          slidesPerView: 1,
          autoplay: 5000,
          paginationClickable: true,
          spaceBetween: 30,
          loop: true
        },
        alertAction:0,
        transformIntegralNum:0,
        realExchange:{default_addr:[],addrId:0,goods_list:[]},
        goToUse:'',
        isLogin:0,
        isBindPhone:0,
        userLevel:0,
        userIntegral:0
      }
    },
    components:{
      swiper,
      swiperSlide,
      Valert,
      Vconfirm
    },
    created(){
      this.goodsId=this.$route.query.goods_id;
//     this.goodsId=window.location.href.match(/goods_id=(\d+)/)[1];
      this.getDetailInfo(this.goodsId);
      this.getUserInfo()
    },
    mounted(){},
    updated(){},
    methods:{
      back(){this.$router.go(-1);},
      getDetailInfo(goodsId){
        integralMallGoodsDetail(goodsId).then(res =>{
          if(res.data.result_code == 0){
            this.goodsData=res.data.result_data;
            this.transformIntegralNum =this.goodsData.integration_number;
            setSessionStore('transformIntegralNum',this.transformIntegralNum);
            document.getElementsByClassName('goodsImgs')[0].innerHTML=this.goodsData.content;
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      exchange(goods_type){
        console.log(this.userLevel)
        console.log(this.goodsData.level_type)
        if(this.isBindPhone == 1){
          // 跳临时用户绑定手机号页面
          this.$router.push ( {
            path : '/user-info/bind-phone'
          })
        }else if(this.isLogin == 1){
          this.$router.push ( {
            path : '/login/index'
          })
        }else if(this.userLevel < this.goodsData.level_type){
          this.alertAction = 3;
        }else if(this.userIntegral < this.transformIntegralNum){
          this.alertAction = 2;
        }else{
          if(goods_type == 0){
            this.$refs.confirmTip.confirm({
              text:"确定兑换？",
              cancelButtonText:'取消',
              confirmButtonText:'确定'
            }).then(() => {
              this.$refs.confirmTip.show = false;
              integralMallCoupExchange(this.goodsId).then( res => {
                if( res.data.result_code == 0){
                  if(res.data.result_data.url_to_use != ''){
                    this.goToUse = res.data.result_data.url_to_use;
                  }
                  this.alertAction = 1;
                }else{
                  this.$refs.alertTip.alert(res.data.result_info);
                }
              })
            }).catch(() => {})
          }else{
            integralMallRealExchange(this.goodsId).then(res => {
              if(res.data.result_code == 0){
                this.realExchange.default_addr = res.data.result_data.default_address;
                this.realExchange.addrId = this.realExchange.default_addr.address_id;
                this.realExchange.goods_list = res.data.result_data.goods_list;
                setSessionStore('realExchange',this.realExchange);
                this.$router.push('/integralOrder?goods_id='+this.goodsId);
              }else{
                this.$refs.alertTip.alert(res.data.result_info);
              }
            })
          }
        }

      },
      closePop(){
        this.alertAction = 0;
      },
      //获取用户积分和等级
      getUserInfo(){
        var that=this;
        userInfo().then(response => {
          if(response.data.result_code == 0){
            that.userLevel = response.data.result_data.level_type;
            that.userIntegral = response.data.result_data.integration;
          }else if(response.data.result_code == '1003'){
            if(typeof(response.data.result_data.openid) != 'undefined') {
              setSessionStore('bindInfo',response.data.result_data);
              that.isBindPhone = 1;
            }else{
              that.isLogin = 1;
            }
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .coup-mark{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.3);z-index:99;}
  .integral-mall .coup-pop{position: fixed;top:50%;left:50%;width:80%;-webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);transform: translate(-50%,-50%);z-index: 998;text-align:center;}
  .integral-mall .coup-pop .ab{position:absolute;width:100%;top:65%;}
  .integral-mall .coup-pop .ab .p1{font-size:1.5rem;font-weight:bold;}
  .integral-mall .coup-pop .ab .p1 i{color: #FF6F64;font-size: 1.5rem;font-weight: bold;}
  .integral-mall .coup-pop .ab .p2 a{display: inline-block;width:35%;height:36px;line-height: 36px;text-align: center;margin:20px 3%;border-radius: 18px;border:solid 1px #3C4347;}
  .integral-mall .coup-pop .ab .p2 a:last-child{background-color: #ff4f39;border-color:#ff4f39;color:#fff;}
  .coup-pop.pop1{background:#fff;border-radius: 3px;padding:40px 5% 20px;}
  .pop1 .p-desc{color:#999;margin-bottom:20px;}
  .pop1 .p-link{background:#ff4f39;color:#fff;width:50%;height:35px;line-height: 35px;display: block;margin:0 auto;border-radius: 18px;}
  .pop1 .close{width:40px;position: absolute;top:0;right:0;padding:10px;}

  .backBox{display:inline-block;width:3rem;height:3rem;position:absolute;top:10px;left:10px;z-index:11;border-radius:50%;}
  .icon-iconback{display:inline-block;width:100%;height:100%;background:url(data:image/png;base64,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) no-repeat;background-size:95%;}
  .integrtal-goods{padding-bottom:56px;}
  .index-flash{position:relative;}
  .sliderBox{position:absolute;top:0;left:0;z-index: 10;width: 100%;}
  .integral-mall .goods-tit{background:#fff;padding:10px 3%;}
  .integral-mall .goods-tit p{padding-bottom:5px;color:#8a8e91;}
  .integral-mall .goods-tit p.p1:before{content: "";display: inline-block;width:15px;height:15px;background: url(http://img2.vipbcw.com/wap/integral-mall/redbean_icon.png);background-size: 100%;margin-right:5px;}
  .integral-mall .goods-tit p.p1{font-size:1.5rem;font-weight:bold;color:#ff4348;}
  .integral-mall .goods-tit p.p1 span{font-weight:normal;color:#8a8e91;}
  .integral-mall .goods-tit p.p2{color:#3c4347;font-size:1.3rem;font-weight:bold;}

  .integral-mall .goods-info{background:#fff;border-bottom:solid 1px #dedede;margin-top:10px;}
  .integral-mall .goods-info p{line-height: 2rem;padding:5px 3%;color:#3c4347;}
  .integral-mall .goods-info .tit{border-bottom:solid 1px #f3f3f3;font-size:1.4rem;}
  .integral-mall .rull{padding:5px 0;}
  .integral-mall .rull p{height: 30px;line-height: 30px;}
  .integral-mall .rull p i{display: inline-block;width:20px;height:20px;border:solid 1px #3c4347;;border-radius: 10px;line-height: 20px;text-align: center;margin-right:5px;}
  .integral-mall .integral-btn,.integral-mall .pay-btn{position: fixed;bottom:0;left:0;width:100%;height:40px;line-height: 40px;text-align: center;background-color: #ff4f39;color:#fff;}
  .integral-mall .integral-btn.dis{background-color: #dedede;}
  .integral-mall .product .info p{font-size:1.4rem;}
  .integral-mall .product .info p.p2{margin-top:5px;color:#8a8e91;font-size:1.2rem;}
  .integral-mall .product .pro .info{height: auto;}
  .integral-mall .pay-btn{background-color: #fff;text-align: right;height: 50px;line-height: 50px;}
  .integral-mall .pay-btn .price{color:#ff4348;}
  .integral-mall .pay-btn .btn{display: inline-block;width:30%;margin:0 10px;height:34px;line-height: 34px;border-radius: 17px;background-color: #ff4f39;color:#fff;text-align: center;}

  .integral-mall .rull p{height:auto;line-height:20px;}
  .integral-mall .goods-tit p.p2{margin-top:5px;}
  .exchangeInfo{position:fixed;bottom:0;left:0;height:40px;line-height:40px;width:100%;}
  .exchangeInfo .integral-btn1{width:100%;text-align:center;background-color:#dedede;color:#fff;}
  .exchangeInfo .integral-btn{width:40%;position:relative;float:left;}
  .exchangeInfo .leftGoods{width:60%;background-color:#fff;color:#999;padding-left:3%;float:left;}
  .exchangeInfo .leftGoods span{color:#FF4F38;margin:0 3px;}
  .integral-mall .goods-tit p.p1 i{font-size:1.5rem;font-weight:bold;color:#ff4348;font-style: normal;}
  .integral-mall .goods-tit p.p2{font-size:1.4rem;}
  .integral-mall .goods-info .tit{font-size:1.3rem;}
  .integral-mall .goods-tit p.p1 em{padding:0px 2px; background-color:#7EBAFF;color:#fff;border-radius:3px;margin:0 5px 0 10px;}
  .integral-mall .goods-tit p.p1 span{padding:0px 5px; background-color:#7EBAFF;color:#fff;border-radius:3px;margin:0 5px;}
  .integral-mall .goods-tit p.p1 s{color:#999;font-weight:normal;}
  .integral-mall .goodsImgs{background-color:#fff;margin-top:10px;}
</style>



// WEBPACK FOOTER //
// integralGoods.vue?0b74e493