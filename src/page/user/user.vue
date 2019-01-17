<template>
    <div style="padding-bottom:60px;">
        <div class="user-header">
            <div class="h-content" v-if="isLogin">
              <router-link to="/user-info/index">
                <div class="u_img"><img :src="userInfo.head_img"/></div>
                <p>{{userInfo.nick}}</p>
              </router-link>
              <div class="knock" v-show="knockMoneyShow">
                  <em>立减金：</em>
                  <span>{{knockMoney}}</span>
              </div>
            </div>
            <div class="h-content" v-else>
                <router-link to="/login/index">
                    <div class="u_img"><img src="http://img2.vipbcw.com/wap/none_head.png"/></div>
                    <p>登录／注册></p>
                </router-link>
            </div>
            <router-link v-if="isLogin && userInfo.level_url" class="level-img" to="/member/index"><img :src="userInfo.level_url"/></router-link>

            <div class="h-bottom">
                <router-link class="bottom-li" :to="isLogin ? '/integralPeans':'/login/index'">
                    <p>{{userInfo.integration ? userInfo.integration : 0}}</p>
                    <p>味豆</p>
                </router-link>
                <router-link class="bottom-li" :to="isLogin ? '/user-center/coupons-list':'/login/index'">
                  <p>{{coupCount ? coupCount : 0}}</p>
                  <p>优惠券</p>
                </router-link>
            </div>
        </div>
        <div class="item-box">
          <div class="item-list">
            <a v-if="isLogin" class="link" href="/user-event/user-order">
              <p>我的订单</p>
              <span>查看全部订单<i class="ic-right"></i></span>
            </a>
            <router-link v-else class="link" to="/login/index">
              <p>我的订单</p>
              <span>查看全部订单<i class="ic-right"></i></span>
            </router-link>
          </div>
          <div class="order-list clearfix">
            <a v-if="isLogin" class="link-li" href="/user-event/user-order?id=1">
              <img src="../../assets/images/user_order1.png"/>
              <p>待付款</p>
              <i v-if="orderNum.wait_pay_order_num > 0">{{orderNum.wait_pay_order_num}}</i>
            </a>
            <router-link v-else class="link-li" to="/login/index">
              <img src="../../assets/images/user_order1.png"/>
              <p>待付款</p>
              <i v-if="orderNum.wait_pay_order_num > 0">{{orderNum.wait_pay_order_num}}</i>
            </router-link>
            <router-link class="link-li" :to="isLogin? {path:'/user-event/user-order',query: {id: 2}}:'/login/index'">
              <img src="../../assets/images/user_order2.png"/>
              <p>待发货</p>
              <i v-if="orderNum.wait_send_order_num > 0">{{orderNum.wait_send_order_num}}</i>
            </router-link>
            <router-link class="link-li" :to="isLogin? {path:'/user-event/user-order',query: {id: 3}}:'/login/index'">
              <img src="../../assets/images/user_order3.png"/>
              <p>待收货</p>
              <i v-if="orderNum.wait_takeover_order_num > 0">{{orderNum.wait_takeover_order_num}}</i>
            </router-link>
            <router-link class="link-li" :to="isLogin? {path:'/user-event/user-order',query: {id: 4}}:'/login/index'">
              <img src="../../assets/images/user_order4.png"/>
              <p>待评价</p>
              <i v-if="orderNum.wait_review_order_num > 0">{{orderNum.wait_review_order_num}}</i>
            </router-link>
            <router-link class="link-li" :to="isLogin? '/refundOrder':'/login/index'">
              <img src="../../assets/images/user_order5.png"/>
              <p>退款/售后</p>
            </router-link>
          </div>
        </div>
        <div class="item-box">
          <div class="item-list">
            <div class="link">
              <p>常用功能</p>
            </div>
          </div>
          <div class="order-list fun-list clearfix">
            <router-link class="link-li" :to="isLogin? {path:'/member/index'}:'/login/index'">
              <img src="../../assets/images/user_icon1.png"/>
              <p>会员中心</p>
            </router-link>
            <router-link class="link-li" :to="isLogin? {path:'/integral-mall/index'}:'/login/index'">
              <img src="../../assets/images/user_icon2.png"/>
              <p>味豆商城</p>
            </router-link>
            <router-link class="link-li" :to="isLogin? {path:'/address'}:'/login/index'">
              <img src="../../assets/images/user_icon3.png"/>
              <p>地址管理</p>
            </router-link>
            <router-link class="link-li" :to="isLogin? {path:'/user-center/collect-list'}:'/login/index'">
              <img src="../../assets/images/user_icon4.png"/>
              <p>收藏</p>
            </router-link>
            <router-link class="link-li" to="/service">
              <img src="../../assets/images/user_icon5.png"/>
              <p>帮助中心</p>
            </router-link>
            <router-link v-if="isLogin" class="link-li" to="/setting">
              <img src="../../assets/images/user_icon6.png"/>
              <p>设置</p>
            </router-link>
          </div>
        </div>
        <footer-box></footer-box>
      <!--<homeIcon v-if="homeIcon != 0"></homeIcon>-->
    </div>
</template>

<script>
    import footerBox from 'components/footerBox'
    import homeIcon from 'components/homeIcon'
    import {userInfo,orderNum,coupCounts} from 'service/getData'
    import {setSessionStore,getSessionStore} from 'assets/js/mUtils'

    export default {
      data () {
          return {
            isLogin: false,
            userInfo:{},
            orderNum:{},
            coupCount:'',
            coupOverCount:'',
            homeIcon:1,
            knockMoney:0,//立减金
            knockMoneyShow:false,
          }
      },
      components: {
          footerBox,
        homeIcon
      },
      created () {
        this.homeIcon = getSessionStore('homeIcon');
        this.getUserInfo();
        this.getOrderNum();
      },
      methods:{
          getUserInfo(){
            var that = this;
            userInfo().then(response => {
              if(response.data.result_code == 0){
                that.isLogin = true;
                that.userInfo = response.data.result_data;
                setSessionStore('balance',(response.data.result_data.balance/100).toFixed(2));
                setSessionStore('integration',response.data.result_data.integration);
                that.getCoupCount();
                this.knockMoney = response.data.result_data.knock_money
                this.knockMoney == undefined ? this.knockMoneyShow = false : this.knockMoneyShow = true;//用户中心右上角立减金显示
              }else if(response.data.result_code == '1003'){
                if(typeof(response.data.result_data.openid) != 'undefined') {
                  setSessionStore('bindInfo',response.data.result_data);
                  // 跳临时用户绑定手机号页面
                  that.$router.push ( {
                    path : '/user-info/bind-phone'
                  })
                }else {
                  that.isLogin = false;
                }
              }

            })
          },
          getOrderNum(){
            var that = this;
            orderNum().then(response => {
              that.orderNum = response.data.result_data;
            })
          },
        getCoupCount(){
            var that = this;
            coupCounts().then(response => {
              var data = response.data;
              if(data.result_code == 0){
                that.coupCount = data.result_data.coupon_count;
                that.coupOverCount = data.result_data.coupon_overdue_tips;
              }
            })
        }

      }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .user-header {
      position: relative;background:url(http://img2.vipbcw.com/wap/u_bg.png) no-repeat;background-size:100% auto;
    }
    .user-header .level-img{width:25%;position:absolute;top:22%;right:0;z-index:99;}
    .user-header .h-content {
        padding: 10% 8%;
        position: relative;
    }
    .user-header .h-content a{display: flex;}
    .user-header .h-content .setting{position: absolute;display: block;width:22px;height:22px;right:20px;top:15px;}
    .user-header .h-content .u_img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
    }

    .user-header .h-content p {
        flex: 1;
        color: #fff;
        line-height: 3rem;
        padding-left: 1rem;
        font-size: 1.4rem;
    }

    .user-header .h-bottom {padding:10px 0;width:92%;margin:0 auto;border-radius:10px;
        background: #fff;
        z-index: 3;
        display: flex;
    }

    .user-header .h-bottom .bottom-li {
        flex: 1;
        text-align: center;border-left:1px solid #e5e5e5;
    }
    .user-header .h-bottom .bottom-li:first-child{border-left:0;}
    .user-header .h-bottom .bottom-li img {
        width: 20px;
        margin: 5px 0;
    }

    .user-header .h-bottom .bottom-li p {
        font-size: 1.3rem;
      line-height:2rem;
      color:#666;
    }
    .item-box{width:92%;margin:10px auto 0;border-radius:10px;overflow:hidden;background:#fff;}
    .item-box .item-list{border-bottom:solid 1px #ededed;background: #fff;padding:0 4%;height: 45px;line-height: 45px;}
    .item-box .item-list .link{display: flex;}
    .item-box .item-list .link p{flex: 1;color:#333;font-size: 1.3rem;}
    .item-box .item-list .link span{color:#999;display: block;width:55%;text-align: right;}
    .item-box .item-list:last-child{border-bottom:0;}
    .order-list{height:auto;line-height: 25px;background: #fff;padding:15px 0;}
    .fun-list{padding:15px 0 1px;}
    .order-list .link-li{display:block;text-align: center;position:relative;float:left;width:20%;}
    .order-list.fun-list .link-li{ width:25%;margin-bottom:15px;}
    .order-list .link-li p{color:#666;font-size:1.2rem}
    .order-list .link-li img{width:30%;}
    .order-list.fun-list .link-li img{width:40%;}
    .order-list .link-li i{display:block;position:absolute;top:-5px;left:50%;width:15px;height:15px;line-height:15px;background:#ff4f39;color:#fff;font-size:1rem;text-align:center;border-radius:50%;}
    .item-list .link span .ic-right{width:15px;height:45px;float: right;background-size:70%;}
    .ic-right{display:inline-block;width:40px;background:url("../../assets/images/ic_right_g.png") no-repeat center right;background-size:27% auto;}
    .red{color:#ff4f39;}

    .knock {
        position: absolute;
        top: 50%;
        right: 1%;
        z-index: 99;
    }
    .knock em {
        color: #fff;
    }
    .knock span::before {
        content: '￥';
        font-size: 1.6rem;
        color: #ffd944;

    }
    .knock span {
        font-size: 1.6rem;
        color: #ffd944;
    }
</style>



// WEBPACK FOOTER //
// user.vue?360373f2