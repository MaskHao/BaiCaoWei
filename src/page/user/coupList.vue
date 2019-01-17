<template>
  <div style="padding-top:50px;">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      优惠券
      <router-link class="header-right" to="/user-center/coup-change">兑换</router-link>
    </div>
    <div class="coup-content">
      <div class="tab-tit-box">
        <ul>
          <li @click="changeTab(1)" :class="{'on':nowTab==1}"><p>未使用({{enablePage.object_count}})</p></li>
          <li @click="changeTab(2)" :class="{'on':nowTab==2}"><p>快过期({{nearPage.object_count}})</p></li>
          <li @click="changeTab(3)" :class="{'on':nowTab==3}"><p>已失效({{historyPage.object_count}})</p></li>
        </ul>
      </div>
      <div class="tab-content-box">
          <ul>
            <li v-for="value in nowCoup" :key="value" :class="{'dis' : nowTab == 3}">
              <div class="coup-top clearfix">
                <div class="left" v-if="value.random_type == 2">
                  <!--指定金额 指定商品-->
                  <p class="p-price">{{value.type_money}}</p>
                  <!--<p>指定商品</p>-->
                </div>
                <div class="left" v-else-if="value.random_type == 3">
                  <!--商品专享-->
                  <p class="zx">专享</p>
                </div>
                <div class="left" v-else-if="value.random_type == 0">
                  <!--指定金额 多商品-->
                  <p class="p-price">{{value.type_money}}</p>
                  <!--<p>满{{value.min_goods_amount}}可用</p>-->
                </div>
                <div class="p-center">
                  <p class="p-name textHidden">{{value.type_name}}</p>
                  <p class="p-desc">{{value.label_name}}</p>
                </div>
              </div>
              <!--去使用按钮-->
              <!-- <img src="../../assets/images/coup-go.png"/> -->
              <a v-if="nowTab != 3 && value.url_to_use != ''" :href="value.url_to_use" class="go-coup">
                <span class="coup-img-go"><img src="../../assets/images/coup-go.png"/></span>
              </a>
              <!--已使用-->
              <a v-else-if="nowTab == 3 && value.status == 1" href="javascript:;"><img src="../../assets/images/coup-used.png"/></a>
              <!--已过期-->
              <a v-else-if="nowTab == 3 && value.status == 2" href="javascript:;"><img src="../../assets/images/coup-time.png"/></a>
              <div class="coup-bottom" v-html="'有效期 ' + setTime(value.use_start_date,value.use_end_date)"></div>
            </li>
          </ul>
        <!--列表为空-->
        <div v-if="nowCoup.length == 0" class="empty-box">
          <img src="../../assets/images/ic_no_coup.png"/>
          <p>您没有{{nowTxt}}的优惠券</p>
        </div>
        <p v-if="nowPage.list_count > 1" class="load-txt">{{loadTxt}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {coupHistory,coupNear,coupEnable} from 'service/getData'
//  import {DateToString} from '../../assets/js/mUtils'
//  import vAlert from 'components/alertDialog'
//  import ConfirmDelete from 'components/confirmDialog'

  export default{
    data () {
      return {
        historyCoup:[],
        historyPage:{},
        nearCoup:[],
        nearPage:{},
        enableCoup:[],
        enablePage:{},
        nowCoup:[],
        nowPage:{},
        nowTab:1,
        nowTxt:'未使用',
        loadTxt:"加载更多……",
        page:1,
        isLoad:false
      }
    },
    created () {
       this.getEnableCoup(this.page);
       this.getNearCoup(this.page);
       this.getHistoryCoup(this.page);
      document.addEventListener('scroll',() => {

        let bheight = window.screen.height//浏览器当前窗口可视区域高度
        let sheight = document.body.scrollHeight | document.documentElement.scrollHeight//获取滚动条高度
        let stop = document.body.scrollTop | document.documentElement.scrollTop//滚动条距离顶部的距离
        if(stop>=sheight-bheight && this.nowPage.list_ordinal < this.nowPage.list_count && this.isLoad){//当滚动条到顶部的距离等于滚动条高度减去窗口高度时
          this.page = this.nowPage.list_ordinal
          ++this.page;
          this.isLoad = false;
        }else{

        }
      })
    },
    methods:{
      changeTab(type){
        if(type == 1){
          //未使用
          this.nowCoup = this.enableCoup;
          this.nowPage = this.enablePage;
          this.nowTxt = '未使用';
        }else if(type == 2){
          //快过期
          this.nowCoup = this.nearCoup;
          this.nowPage = this.nearPage;
          this.nowTxt = '快过期';
        }else if(type == 3){
          //已失效
          this.nowCoup = this.historyCoup;
          this.nowPage = this.historyPage;
          this.nowTxt = '已失效';
        }
        this.nowTab = type;
      },
      getEnableCoup(page){
        var that = this;
        coupEnable(page).then(res => {
          if(res.data.result_code == 0){
            var _list = res.data.result_data.list;
            for(var i=0 ; i<_list.length ; i++){
              that.enableCoup.push(_list[i]);
            }
            that.enablePage = res.data.result_data.list_info;
            if(that.nowTab == 1){
              that.nowCoup = that.enableCoup;
              that.nowPage = that.enablePage;
            }
            if(that.nowPage.list_count == that.nowPage.list_ordinal){
              that.loadTxt = '天呐～没有更多了';
            }else {
              that.loadTxt = '加载更多……';
              that.isLoad = true;
            }
          }
        })
      },
      getNearCoup(page){
        var that = this;
        coupNear(page).then(res => {
          if(res.data.result_code == 0){
            var _list = res.data.result_data.list;
            for(var i=0 ; i<_list.length ; i++){
              that.nearCoup.push(_list[i])
            }
            that.nearPage = res.data.result_data.list_info;
            if(that.nowTab == 2){
              that.nowCoup = that.nearCoup;
              that.nowPage = that.nearPage;
            }
            if(that.nowPage.list_count == that.nowPage.list_ordinal){
              that.loadTxt = '天呐～没有更多了';
            }else {
              that.loadTxt = '加载更多……';
              that.isLoad = true;
            }
          }
        })
      },
      getHistoryCoup(page){
        var that = this;
        coupHistory(page).then(res => {
          if(res.data.result_code == 0){
            var _list = res.data.result_data.list;
            for(var i=0 ; i<_list.length ; i++){
              that.historyCoup.push(_list[i])
            }
            that.historyPage = res.data.result_data.list_info;
            if(that.nowTab == 3){
              that.nowCoup = that.historyCoup;
              that.nowPage = that.historyPage;
            }
            if(that.nowPage.list_count == that.nowPage.list_ordinal){
              that.loadTxt = '天呐～没有更多了';
            }else {
              that.loadTxt = '加载更多……';
              that.isLoad = true;
            }
          }
        })
      },
      setTime(startTime,endTime){
        var str = this.DateToString(startTime) +'-'+ this.DateToString(endTime);
        return str;
      },
      DateToString(date){
        var date = new Date(Number(date)*1000);
        return date.getFullYear()
          + "/" + (date.getMonth()>8?(date.getMonth()+1):"0"+(date.getMonth()+1))
          + "/" + (date.getDate()>9?date.getDate():"0"+date.getDate())
          + " " + (date.getHours()>9?date.getHours():"0"+date.getHours())
          + ":" + (date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes());
      }
    },
    watch:{
      'page'(){
        if(this.nowTab == 1){
          this.getEnableCoup(this.page);
        }else if(this.nowTab == 2){
          this.getNearCoup(this.page);
        }else if(this.nowTab == 3){
          this.getHistoryCoup(this.page);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;top:0;left:0;width:100%;z-index:999; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}
  .tab-tit-box{position:fixed;width:100%;height:30px;background:#fff;top:45px;left:0;z-index:99;}
  .tab-tit-box ul{display:flex;}
  .tab-tit-box ul li{flex:1;color:#848484;}
  .tab-tit-box ul li p{color:#848484;line-height:28px;text-align:center;}
  .tab-tit-box ul li.on p{color:#ff4f39;border-bottom:solid 2px #ff4f39;}

  .tab-content-box{padding:40px 0;}
  .tab-content-box li{background:url("../../assets/images/coup_bg.png") no-repeat;background-size: 100% auto;position: relative;}
  .tab-content-box li.dis{background:url("../../assets/images/coup_bg2.png") no-repeat;background-size: 100% auto;position: relative}
  .tab-content-box li .coup-bottom{text-align: center;color:#fff;}
  .tab-content-box li .coup-img-go{display: block;width:20%;position: absolute;top:10px;right:-1%;}
  .tab-content-box li a.go-coup {position: absolute;left: 0;top: 0;width: 100%;height: 100%;}
  .tab-content-box li .coup-top .left{width:25%;float:left;text-align: center;}
  .tab-content-box li .coup-top .left p{color:#fb7551;}
  .tab-content-box li .coup-top .left img{width:80%;}
  .tab-content-box li.dis .coup-top .left p{color:#c0c0c0}
  .tab-content-box li .coup-top .left p{line-height: 16px;}
  .tab-content-box li .coup-top .left .p-price{font-size:24px;line-height: 30px;}
  .tab-content-box li .coup-top .left .p-price:before{font-size: 13px;content:'¥';color:#fb7551}
  .tab-content-box li.dis .coup-top .left .p-price:before{color:#c0c0c0}
  .tab-content-box li .coup-top .p-center{float:left;width:55%;}
  .tab-content-box li .coup-top .p-center p{color:#fb7551;}
  .tab-content-box li .coup-top .left .zx{font-size: 2rem;}
  .tab-content-box li.dis .coup-top .p-center p{color:#c0c0c0;}
  .tab-content-box li .coup-top .p-center .p-name{font-size: 1.5rem;line-height: 2.4rem;}
  .tab-content-box li .coup-top .p-center .p-desc{line-height: 1.6rem;height:3.2rem;overflow:hidden;}
  @media screen and (min-width:320px){
    .tab-content-box li{width:290px;margin:0 auto 15px;height:105px;}
    .tab-content-box li .coup-top{height:76px;overflow:hidden}
    .tab-content-box li .coup-bottom{height:29px;line-height: 29px;}
    .tab-content-box li .coup-top .p-center{padding-top:7px;}
    .tab-content-box li .coup-top .left .p-price,.tab-content-box li .coup-top .left .zx{line-height: 76px;}
    /*.tab-content-box li .coup-top .left .p-price{padding-top:15px;}*/
  }
  @media screen and (min-width:375px){
    .tab-content-box li{width:340px;margin:0 auto 15px;height:123px;}
    .tab-content-box li .coup-top{height:89px;overflow:hidden}
    .tab-content-box li .coup-bottom{height:34px;line-height: 34px;}
    .tab-content-box li .coup-top .p-center{padding-top:15px;}
    .tab-content-box li .coup-top .left .p-price,.tab-content-box li .coup-top .left .zx{line-height: 89px;}
    /*.tab-content-box li .coup-top .left .p-price{padding-top:20px;}*/
  }
  @media screen and (min-width:414px){
    .tab-content-box li{width:380px;margin:0 auto 15px;height:137px;}
    .tab-content-box li .coup-top{height:99px;overflow:hidden}
    .tab-content-box li .coup-bottom{height:38px;line-height: 38px;}
    .tab-content-box li .coup-top .p-center{padding-top:20px}
    .tab-content-box li .coup-top .left .p-price,.tab-content-box li .coup-top .left .zx{line-height: 99px;}
    /*.tab-content-box li .coup-top .left .p-price{padding-top:25px}*/
  }
  @media screen and (min-width:481px){
    .tab-content-box li{width:450px;margin:0 auto 15px;height:162px;}
    .tab-content-box li .coup-top{height:117px;overflow:hidden}
    .tab-content-box li .coup-bottom{height:45px;line-height: 45px;}
    .tab-content-box li .coup-top .p-center{padding-top:30px;}
    .tab-content-box li .coup-top .left .p-price,.tab-content-box li .coup-top .left .zx{line-height: 117px;}
    /*.tab-content-box li .coup-top .left .p-price{padding-top:35px;}*/
  }
  .empty-box{padding-top:20%;text-align:center}
  .empty-box img{width:30%; margin-bottom:10px;}
  .load-txt{line-height:3rem;text-align:center;}
</style>



// WEBPACK FOOTER //
// coupList.vue?3d621d3a