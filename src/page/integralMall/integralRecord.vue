<template>
  <div class="integralMall-record">
    <div class="header">
      <div class="left-box" @click="back()"><img  src="../../assets/images/ic_left.png"> </div>
      兑换记录
    </div>
    <div class="integralMall-content" style="padding-top:50px;">
      <div class="inte-title">
        <ul class="clearfix">
          <li :class="{ on : clickItem == 1}" data-type="inaccessible" @click="realExchange(1,$event)">
            <span>实物兑换</span>
          </li>
          <li :class="{ on : clickItem == 0}" data-type="used" @click="couponExchange(1)">
            <span>优惠劵兑换</span>
          </li>
        </ul>
      </div>
      <div class="tab-con">
        <div v-if="clickItem" class="tab-con-cp order-content real-content">
          <ul v-if="realData.length > 0">
            <li v-for="data in realData" :key="data">
              <div class="goodsInfo" v-for="good in data.goods_list" :key="good">
                <div class="img-box"><img :src="good.goods_img"></div>
                <div class="info-box">
                  <p><em v-html="good.goods_name"></em><span class="fr" v-html="good.integration_number"></span></p>
                  <p class="p1" v-html="'订单编号：'+data.order_id"></p>
                  <p class="p1" v-html="'兑换时间：'+data.create_time"></p>
                </div>
              </div>
              <div class="see-more">
                <router-link class="see-btn" :to="{ path :  '/integralTransport',query : { order_id : data.order_id}}">查看物流</router-link>
              </div>
            </li>
          </ul>
          <div v-else class="empty-box" style="background: #ededed;">
            <img src="../../assets/images/ic_no_useWd.png"/>
            <p>啥都没有，快去下单吧</p>
          </div>
        </div>
        <div v-else class="tab-con-cp order-content coup-content">
          <ul v-if="coupData.length > 0">
            <li v-for="data in coupData" class="coupLi" :key="data">
              <div class="goodsInfo">
                <div class="img-box"><img :src="data.goods_img"></div>
                <div class="info-box">
                  <p><em v-html="data.goods_name"></em><span class="fr" v-html="data.integration_number"></span></p>
                  <!--<p class="p1" v-html="'订单编号：'+data.order_id"></p>-->
                  <p class="p1" v-html="'兑换时间：'+data.create_time"></p>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="empty-box" style="background: #ededed;">
            <img src="../../assets/images/ic_no_useWd.png"/>
            <p>啥都没有，快去下单吧</p>
          </div>
        </div>
      </div>
      <Valert ref="alertTip"></Valert>
    </div>
  </div>
</template>

<script>
  import Valert from '../../components/alertDialog'
  import {integralMallRealExchangeList,integralMallCouponExchangeList} from '../../service/getData'

  export default{
    data(){
      return {
        page:1,
        totalPage:0,
        object_count:0,
        realData:[],
        page2:1,
        totalPage2:0,
        object_count2:0,
        coupData:[],
        can_load:true,
        clickItem:1,
      }
    },
    components:{
      Valert,
    },
    created(){
      this.realExchange(this.page);
    },
    mounted(){
      window.addEventListener('scroll', ()=>{
        if(parseInt(window.scrollY) + parseInt(window.screen.height) > document.documentElement.scrollHeight - 100 && this.can_load){
          if(this.page < this.totalPage){
            this.page++;
            this.can_load=false;
          }
          if(this.page2 < this.totalPage2){
            this.page2++;
            this.can_load=false;
          }
        }
      });
    },
    updated(){},
    methods:{
      back(){
        this.$router.go(-1);
      },
      realExchange(page,e){
        if( e != undefined){
          this.clickItem = 1;
        }
        if(this.realData.length == 0 || this.realData.length != this.object_count) {
          integralMallRealExchangeList(page).then ( response => {
             if ( response.data.result_code == 0 ) {
                for ( var i = 0 ; i < response.data.result_data.list.length ; i ++ ) {
                  this.realData.push ( response.data.result_data.list[ i ] );
                }
                this.totalPage = response.data.result_data.list_info.list_count;
                this.object_count = response.data.result_data.list_info.object_count;
                this.can_load = true;
              } else {
                this.$refs.alertTip.alert(response.data.result_info);
              }
            } )
        }
      },
      couponExchange(page){
        this.clickItem = 0;
        if(this.coupData.length == 0 || this.coupData.length != this.object_count2){
          integralMallCouponExchangeList(page).then(response =>{
              if(response.data.result_code == 0){
                for(var i=0;i<response.data.result_data.list.length;i++) {
                  this.coupData.push( response.data.result_data.list[i] );
                }
                this.totalPage2=response.data.result_data.list_info.list_count;
                this.object_count2=response.data.result_data.list_info.object_count;
                this.can_load=true;
              }else{
                this.$refs.alertTip.alert(response.data.result_info);
              }
            })
        }
      }
    },
    watch:{
      page:function () {
        this.realExchange(this.page);
      },
      page2:function () {
        this.couponExchange(this.page2);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{border-bottom:1px solid #ccc;width:100%;height:50px;background-color:#fff;position: fixed;top:0;left:0;text-align:center;font-size:1.4rem;line-height:50px;z-index:99;color:rgba(60,67,71,1);}
  .header .left-box{position:absolute;left:0;top:0;display:inline-block;padding-left:2%;text-align:left;}
  .header .left-box img{width:40%;}

  .integralMall-record{background-color:#eee;}
/*.tab-con{background-color:#fff;}*/
  .integralMall-content .tab-tit{z-index: 10;height:40px;}
  .integralMall-content .tab-tit li.on span{color:#ff4f39;}
  .integralMall-content .tab-tit li span{line-height:38px;}
  .integralMall-content ul{padding:0;}
  /*.integralMall-content .inte-title{overflow:hidden;width:100%;padding:0;}*/
  .integralMall-content .inte-title{position:fixed;top:50px;left:0;height:40px;z-index: 99;width:100%;}
  .integralMall-content .tab-con{margin-top:50px;}
  .integralMall-content .inte-title li{margin-bottom:5px;float:left;width:50%;padding:0;text-align:center;height:40px;background-color:#fff;}
  .integralMall-content .inte-title li span{font-size:1.4rem;display:inline-block;height:40px;line-height:40px;padding:0 15px;}
  .integralMall-content .inte-title li.on span{color:#FF4F38;}

  /*.integralMall-content .order-content{display:none;}*/
  /*.integralMall-content .order-content.on{display:block;}*/
  .integralMall-content .order-content li{height:auto;padding:0;margin:10px auto;position:relative;background: #fff}
  .integralMall-content .order-content li.coupLi{margin-bottom:5px;border-bottom:1px solid #eee;}
  .integralMall-content .order-content li .goodsInfo{padding:10px 10px 10px 95px;margin:0 3%;height:105px;}
  .integralMall-content .order-content li .img-box{position:absolute;left:0;width:85px;height:85px;line-height:85px;overflow:hidden;top:10px;margin-left:10px;}
  .integralMall-content .order-content li p{margin-bottom:8px;}
  .integralMall-content .order-content li p:first-child em{height:3.2rem;line-height:1.6rem;overflow:hidden;}
  .integralMall-content .order-content li p.p1{padding-top:0;line-height:1.2rem;}
  .integralMall-content .order-content li p .fr{font-weight:normal;color:#999;}
  .integralMall-content .order-content li .see-more{margin-top:10px;padding:10px 0;text-align:right;border-top:1px solid #eee;}
  .integralMall-content .order-content li .see-more .see-btn{margin-right:10px;color:#666;display:inline-block;padding:3px 8px;font-size:1.4rem;border:1px solid #999;border-radius:2px;}

</style>



// WEBPACK FOOTER //
// integralRecord.vue?6a58030c