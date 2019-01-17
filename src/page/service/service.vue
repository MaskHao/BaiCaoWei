<template>
  <div>
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      客服帮助
      <div class="header-right" to="register/index"></div>
    </div>
    <div class="kf-part">
      <p class="kf-part-tit">常见问题<i>/FAQ</i></p>
      <ul class="clearfix">
        <li>
          <a href="/activity/detail/303">
            <img src="http://img2.vipbcw.com/wap/ic_help_1.png?v=1"/>
            <p>订单问题</p>
          </a>
        </li>
        <li>
          <a href="/activity/detail/304">
            <img src="http://img2.vipbcw.com/wap/ic_help_2.png?v=1"/>
            <p>支付问题</p>
          </a>
        </li>
        <li>
          <a href="/activity/detail/302">
            <img src="http://img2.vipbcw.com/wap/ic_help_3.png?v=1"/>
            <p>物流问题</p>
          </a>
        </li>
        <li>
          <a href="/activity/detail/305">
            <img src="http://img2.vipbcw.com/wap/ic_help_4.png?v=1"/>
            <p>售后问题</p>
          </a>
        </li>
        <li>
          <a href="/activity/detail/306">
            <img src="http://img2.vipbcw.com/wap/ic_help_5.png?v=1"/>
            <p>发票问题</p>
          </a>
        </li>
        <li>
          <a href="/activity/detail/307">
            <img src="http://img2.vipbcw.com/wap/ic_help_6.png?v=1"/>
            <p>优惠券问题</p>
          </a>
        </li>
        <li>
          <a href="/activity/detail/308">
            <img src="http://img2.vipbcw.com/wap/ic_help_7.png?v=1"/>
            <p>其他问题</p>
          </a>
        </li>
      </ul>
    </div>
    <div class="kf-part">
      <p class="kf-part-tit">联系客服<i>/service</i></p>
      <ul class="clearfix">
        <li @click="serviceFun()">
          <a href="javascript:;">
            <img src="http://img2.vipbcw.com/wap/ic_help_8.png?v=1"/>
            <p>在线客服</p>
          </a>
        </li>
        <li>
          <router-link to="/tell">
            <img src="http://img2.vipbcw.com/wap/ic_help_9.png?v=1"/>
            <p>客服热线</p>
          </router-link>
        </li>
      </ul>
    </div>
    <img style="width:94%;display: block;margin:10px auto;" src="http://img2.vipbcw.com/wap/help_0.jpg">
  </div>
</template>

<script>
  import {userQiyuInfo} from 'service/getData'
  import {addScript} from 'assets/js/mUtils'
  export default{
    data(){
      return {
        qyLogin:0
      }
    },
    created () {
    },
    mounted(){
      this.$nextTick(function () {
        var _qy = document.getElementById('J_qyScript');
        if(!_qy){
          addScript()
        }
        userQiyuInfo().then(res => {
          let _data = res.data;
          if(_data.result_code == 0){
            this.qyLogin = 1;
            ysf.config({
              uid: _data.result_data.user_id,
              data: JSON.stringify([
                {"key": "real_name", "value": _data.result_data.nick},
                {"key": "mobile_phone","value": _data.result_data.mobile},
                {"key": "email", "hidden":true},
                {"index": 0, "key": "integration", "label": "味豆数量", "value": _data.result_data.integration},
                {"index": 1, "key": "channel", "label": "渠道", "value": _data.result_data.channel},
                {"index": 2, "key": "is_cooperation", "label": "是否企业账户", "value": _data.result_data.chanis_cooperation},
                {"index": 3, "key": "birthday", "label": "生日", "value": _data.result_data.birthday},
                {"index": 4, "key": "create_time", "label": "注册时间", "value": _data.result_data.create_time},
                {"index": 5, "key": "avatar", "label": "头像地址", "value": _data.result_data.head_img, "href": _data.result_data.head_img},
                {"index": 6, "key": "fromWhere", "label": "访问来源", "value": "个人中心-在线客服"}
              ])
            });
          }else if(_data.result_code == '1003'){
            if(typeof(res.data.result_data.openid) != 'undefined'){
              this.qyLogin = 2;
            }else{
              this.qyLogin = 0;
            }
          }
        })
      })
    },
    methods:{
      serviceFun(){
        if(this.qyLogin == 0){
          window.location.href = '/login/index';
        }else if(this.qyLogin == 1){
          ysf.open();
        }else if(this.qyLogin == 2){
          window.location.href = '/user-info/bind-phone';
        }
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-right{float: right;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .kf-part{background:#fff;margin-top:10px;}
  .kf-part .kf-part-tit{padding:10px 3%;color:#101010;font-size:1.4rem;}
  .kf-part .kf-part-tit i{color:#ff4630;font-size:1.4rem;}
  .kf-part ul{padding-top:10px;}
  .kf-part li{width:25%;text-align: center;float: left;padding-bottom:20px;}
  .kf-part li a{display: block;}
  .kf-part li img{width:25%;margin-bottom:10px;}
</style>



// WEBPACK FOOTER //
// service.vue?7246b840