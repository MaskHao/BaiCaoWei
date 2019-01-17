<template>
  <div>
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      设置
      <div class="header-right"></div>
    </div>
    <div class="content-box">
      <ul>
        <li>
          <router-link class="link" to="/login/findPassword">
            <p>重置密码</p>
            <i class="ic-right"></i>
          </router-link>
        </li>
      </ul>
      <div v-if="!wechat" class="log-out" @click="logOut()">退出登录</div>
    </div>
    <vAlert ref='alertDialog'></vAlert>
  </div>
</template>

<script>
  import {logOut} from 'service/getData'
  import vAlert from 'components/alertDialog'
  import {delSessionStore,delCookie} from 'assets/js/mUtils'

  export default {
    data () {
      return {
        isLogin: false,
        userInfo:{},
        orderNum:{},
        wechat:true
      }
    },
    components:{
      vAlert,
    },
    created (){
      var ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){

      }else{
        this.wechat = false;
      }

    },
    methods:{
      logOut(){
        var that = this;
        logOut().then(res => {
          if(res.data.result_code == 0){
            delSessionStore('token');
            delCookie('token');
            delSessionStore('userInfo');
            delSessionStore('default_addr');
            delSessionStore('realExchange');
            delSessionStore('integration');
            delSessionStore('balance');
            window.history.go(-1);
          }else{
            that.$refs.alertDialog.alert(res.data.result_info);
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}
  .content-box li,.log-out{width:100%;height:45px;line-height:45px;border-bottom:solid 1px #e5e5e5;padding:0 15px;background:#fff;}
  .content-box li .link{display: flex;}
  .content-box li .link p{flex: 1;color:#333;font-size: 1.3rem;}
  .content-box li .link span{color:#848484;font-size: 1rem;display: block;width:40%;text-align: right;}
  .content-box li .link span .ic-right{width:15px;height:40px;float: right;background-size:70%;}
  .ic-right{display:inline-block;width:40px;background:url("../../assets/images/ic_right_g.png") no-repeat center right;background-size:27% auto;}
.log-out{background:#ff4f39;color:#fff;text-align:center;margin-top:50px;}
</style>



// WEBPACK FOOTER //
// setting.vue?742d0707