<template lang="html">
    <div class="header collectHeader">
        <div class="left-box" v-on:click="$router.go(-1)"><i class="iconfont icon-iconback"></i> </div>
        <slot name="title"></slot>
        <div class="right-box" @click="serviceFun()"><a href="javascript:void(0);"><i class="iconfont icon-iconservicer"></i></a></div>
    </div>
</template>

<script>
  import {userQiyuInfo} from '../../service/getData'
  import {addScript} from '../../assets/js/mUtils'
  export default {
    data () {
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
                {"index": 6, "key": "fromWhere", "label": "访问来源", "value": "订单列表-在线客服"}
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

<style lang="css">

/*header*/
.header{width: 100%;height: 50px;background: #fff;position: fixed;text-align: center;font-size: 1.4rem;line-height: 50px;z-index: 99;color: rgba(60,67,71,1);border-bottom:solid 1px #ccc;top:0;left: 0;}
.header h2 {text-align: center;font-size: 1.4rem;color: rgba(60,67,71,1);}
.header .right-box{position: absolute;right:0; top:0;display: inline-block;font-size: 1.2rem;padding-right:3%;text-align: right;height:100%;}
.header .left-box{position: absolute;left:0; top:0;display: inline-block;font-size: 1.2rem;padding-left:3%;text-align: left;height:100%;}
.left-box .icon-iconback {
    color: #3c4347;
    background: url(../../assets/images/ic_left.png) no-repeat center;
    background-size: contain;
    float: left;
    height: 100%;
    width: 2rem;
}
.right-box .icon-iconservicer {
    color: #3c4347;
    background: url(../../assets/images/ic_service.png) no-repeat center;
    background-size: contain;
    float: left;
    height: 100%;
    width: 2rem;
}
</style>



// WEBPACK FOOTER //
// orderHeader.vue?56823746