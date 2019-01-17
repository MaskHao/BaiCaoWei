<template>
    <div class="con">
        <orderHeader>
            <h2 slot="title">订单详情</h2>
        </orderHeader>
        <div class="paddingTop orderInfo" data-order-id="" :class="{'padding-bottom-0':orderFitlerStatus == 1 && orderInfo.refund_status == 3}">
                <!--待付款-->
                <p class="count-tip" v-show="isDownCountShow">请在<span class="time-down-count red"><i class="m">{{min}}</i>:<i class="s">{{sec}}</i></span>分钟内付款，时间结束后订单将会被取消。</p>
                <div class="box info-state" :style="{'background':headerTips.color != undefined && headerTips.color}">
                    <i class="icon"><img v-lazy="headerTips.icon"/> </i>
                    <p class="p1">{{headerTips.title}}</p>
                    <p>{{headerTips.content}}</p>
                </div>

            <div class="box info-send">
                <p class="tit"><i class="icon"><img src="http://img2.vipbcw.com/wap/order_flow.png"/></i>配送信息</p>
                <div class="con">
                    <p class="item"><label>收货人:</label><span class="fl">{{orderInfo.consignee}}</span><span class="fr">{{orderInfo.mobile}}</span></p>
                    <p class="item"><label>收货地址:</label>{{orderInfo.address}}</p>
                </div>
            </div>
            <div class="box info-pro">
                <p class="tit">
                    <i class="icon"><img src="http://img2.vipbcw.com/wap/integral-mall/img_shangpin@2x.png"/></i>商品信息
                            <router-link v-bind:to="{path: '/refundDetail',query: {refund_id: content.refund_id,order_id:orderId}}" v-if="orderInfo.refund_status" class="refund-link">{{orderInfo.refund_status_desc}}</router-link >
                            <!-- refund_status -3用户关闭;－2未收货; -1退款失败;1审核中; 2同意退款 ;3已退货，等待仓库收货 4确认收货 5退款成功 -->
                </p>
                <ul class="order-box">
                    <li v-for="goodsList in content.goods_list" :key="goodsList">
                        <div class="pro-box clearfix">
                            <router-link :to="{path: '/data-list/detail-goods',query: {'id':goodsList.goods_id}}">
                                <div class="pro_img"><img v-lazy="goodsList.goods_icon+'?imageView2/1/w/200/h/200'"/> </div>
                                <p class="pro_tit">{{goodsList.goods_name}}</p>
                                <div class="pro_price">
                                    <span>¥{{goodsList.goods_price}}</span>
                                    <span class="fr num">{{goodsList.goods_count}}</span>
                                </div>
                            </router-link>
                        </div>
                        <p class="refund-btn" v-if="orderInfo.order_status == 2 || orderInfo.order_status == 9">
                            <router-link v-if=" orderInfo.refund_status == 0" v-bind:to="{path: '/refundEdit',query: {order_id: orderInfo.order_id,goods_id:goodsList.goods_id}}">申请售后</router-link>
                            <router-link v-else v-bind:to="{path: '/refundDetail',query: {order_id: orderInfo.order_id,goods_id:goodsList.goods_id}}">{{goodsList.refund_status_desc}}</router-link>

                        </p>
                    </li>
                </ul>
                <div class="info-pro-price">
                    <p v-for="amountList in content.additional_amount_list" :key="amountList">{{amountList.amount_name}}:<em>{{amountList.amount_value}}</em></p>
                    <p class="order-price">共{{orderInfo.goodsNumber}}件商品 &nbsp;合计：<i class="redTxt">¥{{orderInfo.order_amount}}（含运费）</i></p>
                </div>
            </div>
            <div class="box info-detail">
                <p v-for="oDetail in content.order_detail" :key="oDetail">{{oDetail}}</p>
            </div>

            <!--待付款-->
            <div class="info-footer" v-show="orderFitlerStatus == 0">
                <a href="javascript:;" class="J_cancelBtn" data-order-id="" @click="getOrderCancel(orderId)">取消订单</a>
                <a class="attr J_goPay" href="javascript:;" data-order-id="" v-on:click="goToPay">去付款 <i class="" v-show="isDownCountShow">{{min}}:{{sec}}</i></a>
            </div>
            <!--待发货-->
            <div class="info-footer" v-show="orderFitlerStatus == 1 && orderInfo.refund_status == 0">
                <router-link v-bind:to="{path: '/refundEdit',query: {order_id: orderId}}">申请退款</router-link >
            </div>
            <!--待收货-->
            <div class="info-footer" v-show="orderFitlerStatus == 2">
                <a class="J_yanchang" href="javascript:;" data-order-id="" v-on:click="setOrderRecept" v-if="ReceptBtn">延长收货</a>
                <router-link v-bind:to="{path: '/order/transport',query: {order_id: orderId}}">查看物流</router-link >
                <a class="attr J_confirmBtn" href="javascript:;" data-order-id="" @click="getoOrderConform(orderId)">确认收货</a>
            </div>
            <!--待收货-->
            <div class="info-footer" v-show="orderFitlerStatus == 3">
                <router-link v-bind:to="{path: '/order/transport',query: {order_id: orderId}}">查看物流</router-link >
                <a class="attr J_confirmBtn" href="javascript:;" data-order-id="" @click="getoOrderConform(orderId)">确认收货</a>
            </div>
             <!--交易成功-->
            <div class="info-footer" v-show="orderFitlerStatus == 4">
                <router-link v-bind:to="{path: '/order/transport',query: {order_id: orderId}}">查看物流</router-link >
                <router-link class="attr" v-bind:to="{path: '/order/orderEvaluate',query: {order_id: orderId}}">评价</router-link>
            </div>
             <!--交易失败-->
            <div class="info-footer" v-show="orderFitlerStatus == 5">
                <a class="J_deleteBtn" href="javascript:void(0)" data-order-id="" v-on:click="getOrderDelete(orderId)">删除订单</a>
                <a class="attr" href="javascript:;" @click="oneMore(orderInfo.order_id)">再来一单</a>
            </div>
        </div>
        <!-- Alert弹窗 -->
        <vAlert ref='alertDialog'></vAlert>

        <!--重新付款遮罩层-->
        <div class="text-dialog" v-bind:class="{'show':isBottomShow}" v-on:click="isBottomShow = false">

        </div>
        <payModule class="mask-content text-dialog-window" id="J_pay_mask" v-bind:class="{'bottom-show':isBottomShow}" @changeModule="isBottomShow = false" :oId="orderId" :isCoupon="isUseCoupon"></payModule>
        <!-- vConfirm弹窗 -->
        <vConfirm ref='dialog'></vConfirm>
    </div>
</template>

<script>
    import {orderDetail,orderDelete,orderCancel,orderRecept,orderConform,buyAgain} from '../../service/getData'
    import vAlert from 'components/alertDialog'
    import orderHeader from './orderHeader'
    import vConfirm from 'components/confirmDialog'
    import payModule from './payModule'

    export default {
        data(){
            return {
                orderId:null,
                content:{},
                additionalAmountList:[],
                goodsList:[],
                headerTips:[],
                orderDetail:[],
                orderInfo:{},
                nowTime:0,
                endTime:0,
                min:0,
                sec:0,
                isDownCountShow:false,
                orderFitlerStatus:0,
                isBottomShow:false,
                ReceptBtn:true,
                refundStatus:false,
              isUseCoupon:0
            }
        },
        methods:{
            getOrderDetail(){
                orderDetail(this.orderId).then((response) => {
                    this.content = response.data.result_data
                    this.additionalAmountList = response.data.result_data.additional_amount_list
                    this.goodsList = response.data.result_data.goods_list
                    this.headerTips = response.data.result_data.header_tips
                    this.orderDetail = response.data.result_data.order_detail
                    this.orderInfo = response.data.result_data.order_info
                    this.nowTime = response.data.result_data.order_info.current_stamp
                    this.endTime = response.data.result_data.order_info.end_time
                    this.isUseCoupon = response.data.result_data.order_info.is_use_coupon
                }).then(() => {
                    this.changeOrderStatus()
                })
            },
            getTime(){
                let lessTime = this.endTime - this.nowTime
                this.min =  Math.floor((lessTime / 60) % 60)
                this.sec =  Math.floor(lessTime % 60)
                this.min= this.min.toString().length<=1?'0'+this.min:this.min
                this.sec = this.sec.toString().length<=1?'0'+this.sec:this.sec
                if(this.orderInfo.order_fitler_status == 1){
                    if (lessTime>=0)
                    {
                        this.isDownCountShow = true
                        this.orderFitlerStatus = 0
                        this.nowTime++
                    } else {
                        this.orderFitlerStatus = 5
                        this.isDownCountShow = false

                    }
                }
            },
            setOrderRecept(){

                this.$refs.dialog.confirm({
                  text:"是否确认延长收货？",
                  cancelButtonText:'取消'
                }).then((res) => {
                    orderRecept(this.orderId).then((response) => {
                        if(response.data.result_code == 0){
                            this.$refs.alertDialog.alert('您已经延长三天哦~')
                            this.ReceptBtn = false
                        }else{
                            this.$refs.alertDialog.alert(response.data.result_info)
                            return false
                        }
                    })
                  // 点击确定按钮的回调处理
                  this.$refs.dialog.show = false;
                }).catch(() => {
                  // 点击取消按钮的回调处理
                });

            },
            changeOrderStatus(){
                if(!(this.orderInfo.order_fitler_status == 1)){
                    this.isDownCountShow = false
                }

                switch (this.orderInfo.order_fitler_status) {
                    case 1:
                        this.orderFitlerStatus = 0
                        break;
                    case 2:
                        this.orderFitlerStatus = 1
                        break;
                    case 3:
                        this.orderFitlerStatus = 2
                        break;
                    case 4:
                        this.orderFitlerStatus = 4
                        break;
                    case 5:
                        this.orderFitlerStatus = 5
                        break;
                    case 6:
                        this.orderFitlerStatus = 3
                        break;
                    case 8: //退款成功
                        this.orderFitlerStatus = 8
                        break;
                }

            },

            getOrderDelete(orderId){


                this.$refs.dialog.confirm({
                  text:"确定删除该订单吗",
                  cancelButtonText:'取消'
                }).then((res) => {
                    orderDelete(orderId).then((response) => {
                        this.$refs.alertDialog.alert(response.data.result_info)
                        this.$router.push({path:'/user-event/user-order'})
                    })
                  // 点击确定按钮的回调处理
                  this.$refs.dialog.show = false;
                }).catch(() => {
                  // 点击取消按钮的回调处理
                });
            },
            getOrderCancel(orderId){
                this.$refs.dialog.confirm({
                  text:"确定取消该订单吗",
                  cancelButtonText:'取消'
                }).then((res) => {
                    orderCancel(orderId).then((response) => {
                      if(response.data.result_code == 0){
                        history.go(0);
                      }else{
                        this.$refs.alertDialog.alert(response.data.result_info)
                      }
                    })

                  // 点击确定按钮的回调处理
                  this.$refs.dialog.show = false;
                }).catch(() => {
                  // 点击取消按钮的回调处理
                });
            },
            getoOrderConform(orderId){
                this.$refs.dialog.confirm({
                  text:"确认收货？",
                  cancelButtonText:'取消'
                }).then((res) => {
                    orderConform(orderId).then((response) => {
                        if(response.data.result_code == 0){
                            //this.$refs.alertDialog.alert('您已经延长三天哦~')
                            this.orderFitlerStatus = 4
                            this.content.header_tips.title = "交易成功"
                            this.content.header_tips.content = "开始和百草味共享美食吧"
                        }else{
                            this.$refs.alertDialog.alert(response.data.result_info)
                            return false
                        }
                    })
                  // 点击确定按钮的回调处理
                  this.$refs.dialog.show = false;
                }).catch(() => {
                  // 点击取消按钮的回调处理
                });
            },
            oneMore(orderId){
                buyAgain(orderId).then((response) => {
                    this.$router.push({path:'/user-event/list-cart'})
                })
            },
            goToPay(){
                this.isBottomShow = true

            },
        },
        components:{
            vAlert,
            orderHeader,
            vConfirm,
            payModule
        },
        watch:{
            'nowTime'(){
                setTimeout(() => {
                    this.getTime()
                },1000)
            },
        },
        created(){
            this.orderId = this.$route.query.order_id;
            this.getOrderDetail()

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
    .con {height: 100%;}
    .red {color: #ff4f39}
    .padding-bottom-0 {padding-bottom: 0 !important;}
    .bottom-show {bottom: 0}
    /*重新付款遮罩层*/
    .text-dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99; background: rgba(0,0,0,0.7);display: none}
    .show {display: block !important}
    /*订单详情*/
    .orderInfo{padding-bottom: 50px;}
    .orderInfo .border {border-top: 10px solid #f9f9f9}
    .orderInfo .box{margin-bottom:10px;background: #fff;}
    .orderInfo .box .tit{padding:0 2%;border-bottom:solid 1px #e5e5e5;font-size: 1.2rem;text-align: left;color:#808080;height:45px;line-height: 45px;position: relative;}
    .orderInfo .box .tit i.iconfont{font-size: 1.6rem;margin-right:5px;float:left;}
    .orderInfo .box .tit i.icon{width:15px;margin-right:5px;float:left;}
    .orderInfo .box.info-state{padding:15px 3% 15px 5rem;position: relative;background: rgba(60,67,71,.89);}
    .orderInfo .box.info-state.succ{background: rgba(245,166,35,1);}
    /*.orderInfo .box.info-state .iconfont{font-size: 2.6rem;position:absolute;left:1.5rem;top:50%;margin-top:-1.3rem;color:#fff;}*/
    .orderInfo .box.info-state .icon{width: 2.6rem;position:absolute;left:1.5rem;top:50%;margin-top:-1.3rem;color:#fff;}
    .orderInfo .box.info-state p{color:#fff;padding:5px 0;}
    .orderInfo .box.info-state p.p1{font-size: 1.4rem;}
    .orderInfo .box .con{padding:5px 2%;}
    .orderInfo .box .con p.item{color:#3c4347;padding:5px 0 5px 18%;line-height:20px;position: relative}
    .orderInfo .box .con p.item:after{content: ".";clear: both;display: block;height: 0;visibility: hidden;}
    .orderInfo .box .con label{width:18%;line-height:20px;color:#808080;position:absolute;top:5px;left:0;}
    .orderInfo .box.info-pro .info-pro-price{padding:10px 2%;}
    .orderInfo .box.info-pro .info-pro-price p{text-align: right;padding:3px 0;}
    .orderInfo .box.info-pro .info-pro-price p em{width:18%;display: inline-block;}
    .orderInfo .box.info-detail{color:#808080;padding:10px 2%;}
    .orderInfo .box.info-detail p{padding:3px 0;}
    .orderInfo .info-footer{position: fixed;bottom:0;left:0;width:100%;height:50px;background: #fff;border-top:solid 1px #e5e5e5;text-align: right;padding:10px 0;z-index: 99;}
    .orderInfo .info-footer a,.pay-success .info-send .btnBox a{display: inline-block;border:solid 1px #434155;color: #434155;font-size: 1.2rem;height: 30px;line-height: 30px;border-radius: 15px;margin:0 2%;padding: 0 1rem;text-align: center;}
    .orderInfo .info-footer a.attr,.pay-success .info-send .btnBox a.attr{border-color: #ff4f39;background:#ff4f39;color:#fff;}
    .orderInfo .refund-btn{text-align: right;}
    .orderInfo .refund-btn a,.orderInfo .refund-link{display: inline-block;padding:0 5px;height:22px;line-height: 22px;border-radius: 11px;font-size:1rem;border: solid 1px #e5e5e5;margin-top:5px;}
    .orderInfo .refund-link{float: right;margin-top:12px;}
    /*订单提交失败*/
    .orderInfo.pay-failure{padding-bottom:0;}
    .pay-failure .box.info-state{background: rgba(0,0,0,.4);}
    .pay-failure .fail-label{padding:3px 5px;border:solid 1px #de2b2b;color:#de2b2b;font-size: 1rem;position: absolute;bottom:15px;left:43%;border-radius: 3px;display: none;}
    .pay-failure .order-box li.on .fail-label{display: block;}
    /*支付成功*/
    .pay-success .box.info-state{background: rgba(245,166,35,1);}
    .pay-success .info-send .total{height:40px;line-height: 40px;text-align: left;margin-left: 2%;border-top:solid 1px #f6f6f6;padding-right:2%;}
    .pay-success .info-send .total .redTxt{float: right;font-weight: bold;font-size:1.4rem;}
    .pay-success .info-send .total label{background:#ff6f64;color:#fff;margin-right:5px;padding:0 3px;}
    .pay-success .info-send .total em{color:#ff6f64;}
    .pay-success .info-btn{position: relative;}
    .pay-success .info-send .btnBox{text-align: right;padding:10px 2%;border-top:solid 1px #d9d9d9;}


    .cp-content-box .order-box li .pro-box .pro_img, .info-pro .order-box li .pro-box .pro_img, .orderInfo-con .order-goods li .pro-box .pro_img {width: 22%;float: left;margin-right: 3%;}

    /*订单列表样式*/
    .orderTab-con .cp-content-box .order-box {background: #fff;margin:5px 0;padding-top:5px;}
    .cp-content-box .order-box .order-title {color: #000;text-align: left;line-height: 2rem;font-size: 1.2rem; padding:0 2%;}
    .cp-content-box .order-box .order-sn,.pay-order .order-box .order-sn {text-align: left;line-height: 2rem;font-size: 1.2rem;color: #858585; padding:7px 2%;}

    .cp-content-box .order-box ul{border-top:solid 1px #e5e5e5;}
    .cp-content-box .order-box li,.info-pro .order-box li
    {margin: 0 0 0 2%;border-bottom:dotted 1px #e5e5e5;padding:10px 3% 10px 0;}

    .cp-content-box .order-box li .price-box,.info-pro .order-box li .price-box
    {border-top:1px dotted #e5e5e5;color: #858585;text-align: right;font-size: 1.2rem;height: 3rem;line-height: 3rem;margin-right: 2%;}

    .cp-content-box .order-box li .pro-box,.info-pro .order-box li .pro-box,.orderInfo-con .order-goods li .pro-box
    {position: relative;}

    .cp-content-box .order-box li .pro-box .pro_price, .info-pro .order-box li .pro-box .pro_price, .orderInfo-con .order-goods li .pro-box .pro_price
    {width: 68%;text-align: left;position: absolute;left: 25%;bottom: 0;color: #000;font-size: 1.2rem;line-height: 1.8rem;}

    .cp-content-box .order-box li .pro-box .pro_tit,.info-pro .order-box li .pro-box .pro_tit,.orderInfo-con .order-goods li .pro-box .pro_tit
    { overflow: hidden; text-overflow:ellipsis; -o-text-overflow:ellipsis;font-size: 1.4rem;color: #000;line-height: 1.8rem;height:3.6rem;}

    .cp-content-box .order-box li .pro-box .pro_tit.p2,.info-pro .order-box li .pro-box .pro_tit.p2,.orderInfo-con .order-goods li .pro-box .pro_tit.p2
    { font-size: 1.2rem;color: #808080;}

    .cp-content-box .order-box li .pro-box .pro_img,.info-pro .order-box li .pro-box .pro_img,.orderInfo-con .order-goods li .pro-box .pro_img
    {width: 22%;float: left;margin-right: 3%;}

    .cp-content-box .order-box li .pro-box .pro_price .num,.info-pro .order-box li .pro-box .pro_price .num,.orderInfo-con .order-goods li .pro-box .pro_price .num
    {color: #858585;}

    .cp-content-box .order-box li .pro-box .pro_price .num:before
    ,.info-pro .order-box li .pro-box .pro_price .num:before
    ,.orderInfo-con .order-goods li .pro-box .pro_price .num:before
    {content: "x";}


    .cp-content-box .order-box .order-info{padding-left: 4%;border-bottom:solid 1px #e5e5e5;}
    .cp-content-box .order-box .order-info .order-price{font-size: 1rem;height: 3rem;line-height: 3rem;color: #858585;text-align: right;}
    .cp-content-box .order-box .order-info .order-price i.redTxt{font-size: 1.4rem;}
    .cp-content-box .order-box .order-info .order-price span{color: #858585;font-size: 1rem;}
    .cp-content-box .order-box .order-info .order-handle{border-top: dotted 1px #e5e5e5;padding:15px 2% 15px 0;text-align: right;}
    .cp-content-box .order-box .order-info .order-handle a,.orderInfo-con .oItem-con.order-handle a{display: inline-block;border:solid 1px #434155;color: #434155;font-size: 1.2rem;height: 30px;line-height: 30px;border-radius: 15px;margin:0 2%;min-width: 7rem;text-align: center;padding:0 1rem;}
    .cp-content-box .order-box .order-info .order-handle a.attr,.orderInfo-con .oItem-con.order-handle a.attr{border-color: #ff4f39;background:#ff4f39;color:#fff;}
    .count-tip {padding: 15px 5%}


    /*选择支付方式遮罩层*/
    .more-mask{width:100%;height:100%;position:fixed;top:0;left:0;background:rgba(0,0,0,.7);z-index: 998;}
    #J_pay_mask.mask-content .content-box{width:100%;background:#fff;position:fixed;left:0;bottom:0;padding-bottom:40px;z-index: 999;height:auto;padding-top:0;
        -webkit-transform: translateY(100%);
        -ms-transform: translateY(100%);
        transform: translateY(100%);
        -webkit-transition: -webkit-transform 300ms;
        transition: transform 300ms;}
    #J_pay_mask.mask-content .content-box.active{
        -webkit-transform: translateY(0);
        -ms-transform: translateY(0);
        transform: translateY(0);}
    #J_pay_mask.mask-content .content-box .tit{padding:15px 10px;text-align: center;color:#0c0c0c;width:100%;border-bottom:solid 1px #efefef;position: relative;}
    #J_pay_mask.mask-content .content-box .con{height:100%;overflow: scroll;}
    #J_pay_mask.mask-content .content-box li{margin-left:10px;padding:0 2%;border-bottom:solid 1px #f5f5f5;position:relative;color:#0c0c0c;height:50px;line-height: 50px;}
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
</style>



// WEBPACK FOOTER //
// orderDetail.vue?bc1bbea8