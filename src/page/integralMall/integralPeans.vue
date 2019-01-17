<template>
  <div class="integral-peans">
    <div class="header">
      <div class="left-box" @click="back()"><img  src="../../assets/images/ic_left.png"> </div>
      我的味豆
    </div>
    <div class="paddingTop inte-box">
      <div class="inte-header">
        <img src="http://img2.vipbcw.com/wap/integral-mall/inte_bg.png">
        <div class="ab">
          <p class="p2">{{integration}}</p>
          <p class="p1">味豆集的越多，魔法越强哦～</p>
          <div class="inte-btn">
            <a href="/activity/detail/314">
              <span>查看规则</span>
            </a>
          </div>
        </div>
      </div>
      <div class="inte-content">
        <ul class="inte-title">
          <li :class="{ on : hasClassOn }" @click="earnPeans(1,$event)"><span>味豆赚取</span></li>
          <li :class="{ on : !hasClassOn}" @click="usedPeans(1,$event)"><span>味豆使用</span></li>
        </ul>
        <ul v-if="hasClassOn" class="inte-list inte-list1">
          <li v-for="peans in earnPeansNum" :key="peans">
            <p class="p1 textHidden" v-html="peans.change_type_content"></p>
            <p class="p2" v-html="peans.time"></p>
            <div class="addPeans" v-html="peans.integration > 0 ? '+'+peans.integration : peans.integration"></div>
          </li>
        </ul>
        <ul v-else class="inte-list inte-list2">
          <li v-for="used in usedPeansNum" :key="used">
            <p v-html="used.change_type_content"></p>
            <!--<p class="p2" v-html="'订单编号：'+used.order_id"></p>-->
            <p class="p2" v-html="setData(used.create_time)"></p>
            <div class="addPeans" v-html="used.integration"></div>
          </li>
        </ul>
      </div>

    </div>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import Valert from '../../components/alertDialog.vue'
  import {DateToString,getSessionStore} from '../../assets/js/mUtils'
  import {integralMallEarnPeans,integralMallUsedPeans} from '../../service/getData'

  export default{
    data(){
      return {
        earnPeansNum:[],
        page:1,
        can_load:true,
        totalPage:0,
        object_count:0,
        usedPeansNum:[],
        usedPage:1,
        usedTotalPage:0,
        used_object_count:0,
        dataType:0,
        hasClassOn:1,
        integration:''
      }
    },
    components:{
      Valert,
    },
    created(){
      this.earnPeans(this.page);
      this.integration = getSessionStore('integration');
    },
    mounted(){
      window.addEventListener('scroll', ()=>{
        if(parseInt(window.scrollY) + parseInt(window.screen.height) > document.documentElement.scrollHeight - 100 && this.can_load){
          if(this.page < this.totalPage){
            this.page++;
            this.can_load=false;
          }
          if(this.usedPage < this.usedTotalPage){
            this.usedPage++;
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
      earnPeans(page,e){
        if(e !=undefined){
          this.hasClassOn = 1;
        }
        if(this.earnPeansNum.length == 0 || this.earnPeansNum.length != this.object_count) {
          integralMallEarnPeans ( page , 1 ).then ( response => {
            if ( response.data.result_code == 0 ) {
              for ( var i = 0 ; i < response.data.result_data.list.length ; i ++ ) {
                this.earnPeansNum.push ( response.data.result_data.list[ i ] );
              }
              this.totalPage = response.data.result_data.list_info.list_count;
              this.object_count = response.data.result_data.list_info.object_count;
              for ( var i = 0 ; i < this.earnPeansNum.length ; i ++ ) {
                this.earnPeansNum[ i ].time = DateToString ( new Date ( this.earnPeansNum[ i ].create_time * 1000 ) );
              }
              this.can_load = true;
            }  else {
              this.$refs.alertTip.alert ( response.data.result_info );
            }
          } )
        }
      },
      usedPeans( page ){
        this.hasClassOn = 0;
        if(this.usedPeansNum.length == 0 || this.usedPeansNum.length != this.used_object_count) {
          integralMallUsedPeans ( page ).then( response => {
            if(response.data.result_code == 0){
              for(var i=0;i < response.data.result_data.list.length ; i++){
                this.usedPeansNum.push(response.data.result_data.list[i]);
              }
              this.usedTotalPage = response.data.result_data.list_info.list_count;
              this.used_object_count = response.data.result_data.list_info.object_count;
              this.can_load = true;
            }else {
              this.$refs.alertTip.alert ( response.data.result_info );
            }
          })
        }
      },
      setData(time){
        return DateToString ( new Date ( time * 1000 ))
      }
    },
    watch:{
      page(){
        this.earnPeans(this.page);
      },
      usedPage(){
        this.usedPeans(this.usedPage);
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{border-bottom:1px solid #ccc;width:100%;height:50px;background-color:#fff;position: fixed;top:0;left:0;text-align:center;font-size:1.4rem;line-height:50px;z-index:99;color:rgba(60,67,71,1);}
  .header .left-box{position:absolute;left:0;top:0;display:inline-block;padding-left:2%;text-align:left;}
  .header .left-box img{width:40%;}
  .inte-box{background: #fff;}
  .inte-header{position: relative;}
  .inte-header .ab{position:absolute;width:100%;height:auto;top:36%;left:0;text-align:center;}
  .inte-header p{color:#3c4347;text-align: center;}
  .inte-header .p1{color:#FFFBF0;padding-top:0;margin:1% 0;}
  .inte-header .p2{font-size:2.4rem;padding:2% 0;color:#fff;padding-bottom:0;}
  .inte-header .p3{height:24px;line-height: 24px;background: #fff;border:solid 1px #3c4347;border-radius: 12px;display: inline-block;padding:0 10px;}
  .inte-content .title{padding:25px 0 20px;text-align: center;}
  .inte-content .title img{width: 30%;margin:0 auto;}
  .inte-content ul{padding:0 4%;}
  .inte-content li{border-top:solid 1px #f3f3f3;padding:10px 0;}
  .inte-content li p{line-height: 2rem; color:#3c4347;}
  .inte-content li p .fr{font-weight: bold;color:#3c4347;}
  .inte-content li .p2{color:#8a8e91;}

  .inte-header .inte-btn{background:url(http://img2.vipbcw.com/wap/integral-mall/inte_see.png) no-repeat center;background-size:25%;padding:3% 0;}
  .inte-header .inte-btn span{font-size:1.4rem;color:#F36B6B;}
  .inte-content li p.p1{height:2rem;padding-right:8%;}
  .inte-content .inte-title{overflow:hidden;width:100%;padding:0;}
  .inte-content .inte-title li{float:left;width:50%;padding:0;text-align:center;}
  .inte-content .inte-title li span{font-size:1.4rem;display:inline-block;height:33px;line-height:33px;padding:0 15px;}
  .inte-content .inte-title li.on span{border-bottom:2px solid #FF4F38;color:#FF4F38;}
  .inte-content .inte-list li{position:relative;}
  .inte-content .inte-list .addPeans{position:absolute;top:50%;right:3%;color:#FF4F38;font-weight:bold;
    -webkit-transform: translate(0,-60%);-moz-transform: translate(0,-60%);-ms-transform: translate(0,-60%);transform: translate(0,-60%);
  }
</style>



// WEBPACK FOOTER //
// integralPeans.vue?04270766