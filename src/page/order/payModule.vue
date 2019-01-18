<template lang="html">
    <div class="">
        <div class="content-box" v-if="show == 1">
            <p class="tit" v-on:click="changePayModule">请选择支付方式</p>
            <div class="con">
                <ul class="way">
                    <!--余额支付、无余额-->
                    <li v-for="pay in payList" v-if="pay.code == 1 && pay.money <= 0 || pay.code == 1 && isCoupon" class="way1 dis">
                        <span>
                            <img class="payIcon" :src="pay.icon =='' ? payInfo[pay.code].icon2 : pay.icon" alt="">{{pay.desc == '' ? payInfo[pay.code].desc : pay.desc}}
                        </span>
                        <i class="iconfont icon-iconto fr"></i>
                    </li>
                    <!--余额支付、有余额-->
                    <li  v-else-if="pay.code == 1 && pay.money > 0 && !isCoupon" class="way1" @click="payOrder(pay.code)">
                        <span>
                            <img class="payIcon" :src="pay.icon =='' ? payInfo[pay.code].icon1 : pay.icon" alt="">{{pay.desc == '' ? payInfo[pay.code].desc : pay.desc}}
                        </span>
                        <i class="iconfont icon-iconto fr"></i>
                    </li>
                    <!--支付宝、微信支付-->
                    <li v-else-if="pay.code == 2 || pay.code == 5" @click="payOrder(pay.code)" class="way1">
                        <span>
                             <img class="payIcon" :src="pay.icon =='' ? payInfo[pay.code].icon : pay.icon" alt="">{{ pay.desc == '' ? payInfo[pay.code].desc : pay.desc}}
                        </span>
                        <i class="iconfont icon-iconto fr"></i>
                    </li>
                </ul>
            </div>
        </div>
        <input class="pay_order_id" type='hidden' value="0" />
        <input class="user_money" type="hidden" value="">
        <ConfirmDial ref="confirm"></ConfirmDial>
        <Valert ref="alertTip"></Valert>
    </div>
</template>

<script>
import {payType,orderRepay} from '../../service/getData'
import {setSessionStore,getSessionStore} from '../../assets/js/mUtils'
import ConfirmDial from '../../components/confirmDialog'
import Valert from '../../components/alertDialog'

export default {
    props:['oId','isCoupon'],
    data(){
        return {
            payList:[],
            aLiPayStyle:{},
            llPayStyle:{},
            weixinPayStyle:{},
            ePayStyle:{},
            isALiPay:false,
            isWeiXinPay:false,
          payInfo:{
            '5':{'icon':'http://img2.vipbcw.com/wap/ic_wechat_pay@2x.png','desc':'微信支付','tip':'微信安全支付'},
            '2':{'icon':'http://img2.vipbcw.com/wap/ic_alipay@2x.png','desc':'支付宝支付','tip':'推荐有支付宝用户'},
            '1':{'icon1':'http://img2.vipbcw.com/wap/ic_balance_pay@2x.png','icon2':'http://img2.vipbcw.com/wap/ic_balance_pay_disable@2x.png','desc':'余额支付','tip':'可用余额'}
          },
          show:1,
        }
    },
    components:{
      ConfirmDial,
      Valert
    },
    methods:{
        getPayType(){
            payType().then((response) => {
                this.payList = response.data.result_data.list
            })
        },
        changePayModule(){
            this.$emit('changeModule')
        },
      payOrder(payCode){
          var orderId = this.oId;
          if(payCode == 2){
            //支付宝支付
            orderRepay(orderId,2).then(res => {
              if(res.data.result_code == 0){
                if(res.data.result_data.payStatus.status == 0){
                  window.location.href = res.data.result_data.payStatus.info.redirectUrl;
                }else{
                  this.$refs.alertTip.alert(res.data.result_data.payStatus.desc);
                }
              }else{
                this.$refs.alertTip.alert(res.data.result_info);
              }
            })
          }else if(payCode == 1){
            //余额支付
            this.$refs.confirm.confirm({
              text:"确定使用余额支付？",
              cancelButtonText:'取消',
              confirmButtonText:'确定'
            }).then( () => {
              this.$refs.confirm.show = false;
              this.show = 0;
              orderRepay(orderId,1).then(res => {
                if(res.data.result_code == 0){
                  if(res.data.result_data.payStatus.status == 1){
                    window.location.href='/pay/paySucc?orderId='+orderId
                    //this.$router.push({path:'/pay/paySucc?orderId='+orderId})
                  }else{
                    this.$refs.alertTip.alert(res.data.result_data.payStatus.desc);
                  }
                }else{
                  this.$refs.alertTip.alert(res.data.result_info);
                }
              })
            }).catch(()=>{})
          }else if(payCode == 5){
            //微信支付
            orderRepay(orderId,5).then(res => {
              if(res.data.result_code == 0){
                  if(res.data.result_data.payStatus.status == 0){
                    var _flag = res.data.result_data.payStatus.info;
                    //var wx = require('weixin-js-sdk');
                    wx.chooseWXPay({
                      timestamp : _flag.timeStamp,//时间戳
                      nonceStr : _flag.nonceStr,//随机串
                      package : _flag.package,// 统一支付接口返回的prepay_id参数值
                      signType : _flag.signType,//微信签名方式
                      paySign : _flag.paySign,//微信签名
                      success: function(data){
                        if(data.errMsg == "chooseWXPay:ok" ) {
                          // 支付成功之后更新订单信息，保存支付日志
                          window.location.href='/pay/paySucc?orderId='+ orderId
                        }else{
                          //支付失败后的操作
                          window.location.href='/user-event/user-order'
                        }
                      },
                      cancel: function(data) {
                        window.location.href='/user-event/user-order'
                      }
                    });
                  }else{
                      this.$refs.alertTip.alert(res.data.result_data.payStatus.desc);
                  }
              }else{
                this.$refs.alertTip.alert(res.data.result_info);
              }
            })
          }
        },
      onBridgeReady(Data){
          var that = this;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',{
            'appId' : Data.appId, //公众号名称
            'timeStamp' : Data.timeStamp,//时间戳
            'nonceStr' : Data.nonceStr,//随机串
            'package' : Data.package,// 统一支付接口返回的prepay_id参数值
            'signType' : Data.signType,//微信签名方式
            'paySign' : Data.paySign//微信签名
          },
          function(res){
            if(res.err_msg == 'get_brand_wcpay_request:ok'){
              window.location.href='/pay/paySucc?orderId='+that.orderId
              //that.$router.push({path:'/pay/paySucc',query: {orderId: that.orderId}})
            }else if(res.err_msg.indexOf('get_brand_wcpay_request:fail') >= 0 || res.err_msg.indexOf('get_brand_wcpay_request:cancel') >= 0){
              history.go(0)
//              that.$router.push({path:'/user-event/user-order'})
            }
          }
        )
      }
    },
    created(){
        let n = navigator.userAgent
        this.getPayType()
        if(n.indexOf('micromessenger')>0){
            this.isALiPay = false
            this.isWeiXinPay = true
        }else if(n.indexOf('aplipay')>0){
            this.isALiPay = true
            this.isWeiXinPay = false
        }
    }
}
</script>

<style lang="css" scoped>
    .content-box .way1 span {display: inline-block;width: 49%;text-align: left;float: left;height:50px;line-height: 50px;}
    .content-box .way1 span .iconfont{float: left;margin-right: 5px;}
    .payIcon{width:14%;margin-right:5px;}

    .text-dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99; background: rgba(0,0,0,0.7);display: none}
    .text-dialog-window { position: fixed; bottom: -100%; left: 0; width: 100%; background: #fff; padding-bottom: 15px; z-index: 100; -webkit-transition: bottom ease-out 200ms; -moz-transition: bottom ease-out 200ms; -o-transition: bottom ease-out 200ms; transition: bottom ease-out 200ms;}
    .bottom-show{bottom: 0}
    /*选择支付方式遮罩层*/
    .more-mask{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.7);z-index: 998;}
    /*#J_pay_mask.mask-content .content-box{width:100%;background:#fff;position:fixed;left:0;bottom:0;padding-bottom:40px;z-index: 999;height:auto;padding-top:0;
        -webkit-transform: translateY(100%);
        -ms-transform: translateY(100%);
        transform: translateY(100%);
        -webkit-transition: -webkit-transform 300ms;
        transition: transform 300ms;}*/
    #J_pay_mask.mask-content .content-box.active{
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);}
    #J_pay_mask.mask-content .content-box .tit{padding:15px 10px;text-align: center;color:#0c0c0c;width:100%;border-bottom:solid 1px #efefef;position: relative;}
    #J_pay_mask.mask-content .content-box .con{height:100%;overflow: scroll;}
    #J_pay_mask.mask-content .content-box li{margin-left:10px;padding:0 2%;border-bottom:solid 1px #f5f5f5;position:relative;color:#0c0c0c;height:50px;line-height: 50px;position: relative;}
    #J_pay_mask.mask-content .content-box li .iconfont{font-size: 3rem;margin-right:5px;}
    #J_pay_mask.mask-content .content-box li .iconfont.icon-icongo{font-size: 1.2rem;margin:0;}
    #J_pay_mask.mask-content .content-box li.disabled{color:#777;}
    #J_pay_mask.mask-content .content-box li:last-child{border-bottom:0;}
    #J_pay_mask.mask-content .content-box .icon-alipayc{color:#00aaef;}
    #J_pay_mask.mask-content .content-box .icon-wechatc{color:#3ab137;}
    #J_pay_mask.mask-content .content-box .icon-money{color:#FF4348;}
    #J_pay_mask.mask-content .content-box li.dis,#J_pay_mask.mask-content .content-box li.dis .icon-money{color:#c0c0c0;}
    #J_pay_mask.pay .bottom-show {-webkit-transform: translateY(12%); transform: translateY(12%);}
    #J_pay_mask.pay .text-dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99; background: rgba(0,0,0,0.5);}
    #J_pay_mask.pay .text-dialog {display: block;}
    .none {display: none;}
    .text-dialog-window-close { position: absolute; left: 20px; top: 50%; -webkit-transform:translateY(-50%);transform: translateY(-50%); width: 20px; height: 20px; background: url(http://img2.vipbcw.com/wap/icCloseDetails.png) no-repeat center; background-size: 100%;}
    .icon-alipayc {
        display: inline-block;
        width: 22px;
        height: 50px;
        background-image: url(http://app.static.vipbcw.com/index_icon/ic_alipay@3x.png);
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .icon-UP {
        display: inline-block;
        width: 22px;
        height: 50px;
        background-image: url(http://img2.vipbcw.com/wap/ic_UP@2x.png);
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .icon-weixin  {
        display: inline-block;
        width: 22px;
        height: 50px;
        background-image: url(http://app.static.vipbcw.com/index_icon/ic_wechat_pay@3x.png);
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
    }


    .icon-money {
        display: inline-block;
        width: 22px;
        height: 50px;
        background-image: url(http://img2.vipbcw.com/wap/ic_balance_pay@2x.png);
        background-position: center;
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .icon-iconto {
        color: #3c4347;
        background: url(../../assets/images/ic_left.png) no-repeat center;
        background-size: contain;
        float: left;
        height: 100%;
        width: 2rem;
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
        float: right;
    }
</style>



// WEBPACK FOOTER //
// payModule.vue?4061a5d7