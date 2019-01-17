<template>
  <div class="pay-index">
    <div class="payHeader">
      <div class="left-box" @click="back()">
        <img src="../../assets/images/ic_left.png">
      </div>确认订单
    </div>
    <div class="order paddingTop paddingBottom_1">
      <!--选择地址-->
      <div id="select-address">
        <router-link :to="{ path : '/address?cart_ids='+goodsId}">
          <div v-if="default_addr.consignee == undefined" id="J_noAddress" class="addr">
            <a href="javascript:;">
              <img src="http://img2.vipbcw.com/wap/order_add.png"> 添加收货地址
              <i class="iconfont icon-icongo fr"></i>
            </a>
          </div>
          <!--有收货地址时-->
          <div v-else class="address">
            <div>
              <span>收货人:</span>
              <p>
                <i id="J_addName" v-html="default_addr.consignee"></i>
                <em class="fr" id="J_addTel" v-html="default_addr.mobile"></em>
              </p>
            </div>
            <div>
              <span>收货地址:</span>
              <p id="J_addInfo" v-html="default_addr.address"></p>
            </div>
            <p class="bg"></p>
          </div>
        </router-link>
      </div>
      <!--选择优惠劵-->
      <div
        v-if="canUseCoup == 1"
        class="choose"
        @click="coupMaskShow ? coupMaskShow=false :coupMaskShow=true"
        style="background: #ffffff url('http://img2.vipbcw.com/wap/icEnter.png') no-repeat 97% center;background-size: 0.7rem;"
      >
        <i class="iconfont icon-iccouponsubmitorder"></i> 选择优惠劵
        <span class="fr" v-html="pay_data.bonus_fee >0 ?'-¥'+pay_data.bonus_fee : '省0元'"></span>
      </div>
      <div v-else class="choose">
        <i class="iconfont icon-iccouponsubmitorder"></i> 选择优惠劵
        <span class="fr">无可用优惠劵</span>
      </div>
      <!--支付方式-->
      <div class="pay">
        <p class="tit">
          <i class="iconfont icon-icmethoddetails"></i> 支付方式
        </p>
        <ul class="way" id="J_payWay">
          <!--余额支付、无余额-->
          <template v-if="pay.code == 1 && pay.money <= 0">
            <li
              v-for="pay in pay_type"
              :key="pay"
              class="way1 dis"
              :class="{active : pay.code == choosePayType}"
            >
              <span>
                <img class="payIcon" :src="pay.icon =='' ? payInfo[pay.code].icon2 : pay.icon" alt>
                {{pay.desc == '' ? payInfo[pay.code].desc : pay.desc}}
              </span>
              <em>
                {{ pay.tip == '' ? payInfo[pay.code].tip : pay.tip }}
                <i v-html="'¥0.00'"></i>
              </em>
            </li>
          </template>

          <!--余额支付、有余额-->
          <li
            v-else-if="pay.code == 1 && pay.money > 0"
            class="way1"
            @click="payCheck(pay.code)"
            :class="{active : pay.code == choosePayType}"
          >
            <span>
              <img class="payIcon" :src="pay.icon =='' ? payInfo[pay.code].icon1 : pay.icon" alt>
              {{pay.desc == '' ? payInfo[pay.code].desc : pay.desc}}
            </span>
            <em>
              {{ pay.tip == '' ? payInfo[pay.code].tip : pay.tip }}
              <i v-html="'¥' + pay.money"></i>
            </em>
          </li>
          <!--支付宝、微信支付-->
          <li
            v-else-if="pay.code == 2 || pay.code == 5"
            @click="payCheck(pay.code)"
            class="way1"
            :class="{active : pay.code == choosePayType}"
          >
            <span>
              <img class="payIcon" :src="pay.icon =='' ? payInfo[pay.code].icon : pay.icon" alt>
              {{ pay.desc == '' ? payInfo[pay.code].desc : pay.desc}}
            </span>
            <em v-html="pay.tip == '' ? payInfo[pay.code].tip : pay.tip"></em>
          </li>
        </ul>
      </div>
      <!--商品信息-->
      <div class="product" id="J_proList">
        <p class="tit">
          <i class="iconfont icon-icgoodsdetails"></i> 商品信息
        </p>
        <div class="pro" :goodsId="good.goods_id" v-for="good in goods_list" :key="good">
          <img
            class="fl"
            v-lazy="good.goods_icon+'?imageView2/1/w/320/h/320'"
            style="display: block;"
          >
          <div class="info fl" v-html="good.goods_title"></div>

          <div class="price">
            <b style="font-weight:normal;" v-html="'¥'+good.goods_price"></b>
            <em class="fr" v-html="'X'+good.goods_count"></em>
            <font color="red"></font>
          </div>
        </div>
      </div>
      <!--给商家留言-->
      <div class="message">
        <input id="marks" type="text" placeholder="选填：给商家留言 （45字内）">
      </div>
      <!--满减活动-->
      <div class="cut" data-fee="7.00">
        <ul>
          <li v-for="value in additional_amount_list" :key="value">
            <span>{{value.amount_name}}</span>
            <em class="fr">{{value.amount_value}}</em>
          </li>
        </ul>
      </div>
      <div class="submit">
        <span>
          共
          <span v-html="pay_data.goods_number"></span>件 合计:
          <em v-html="'¥'+pay_data.order_amount"></em>
          <a style href="javascript:void(0)" id="wx-pay" @click="submitOrder()">提交订单</a>
        </span>
      </div>
    </div>
    <!--优惠劵弹窗-->
    <div v-if="coupMaskShow" :class="{ move : coupMaskShow == true}" class="mask-content">
      <div class="content-box move">
        <p class="tt">
          选择优惠券
          <i @click="coupMaskShow ? coupMaskShow=false :coupMaskShow=true">
            <img src="../../assets/images/ic_close.png">
          </i>
        </p>
        <div class="con">
          <ul>
            <template v-if="coup.type_money　>= 0">
              <li
                :class="{on :coup.bonus_id == choosePayCoup,'dis':coup.is_available == 0}"
                v-for="coup in default_coup"
                :key="coup"
                :data-shipping="coup.is_shipping"
                :data-money="coup.type_money"
                :data-id="coup.bonus_id"
              >
                <div class="coupBox">
                  <img src="http://img2.vipbcw.com/wap/coup_bg.png?v=2">
                  <div class="coupon_piece clearfix">
                    <div v-if="coup.random_type == 2" class="coupon_left">
                      <!--指定金额 指定商品-->
                      <p class="p-price">{{coup.type_money}}</p>
                      <p>指定商品</p>
                    </div>
                    <div v-else-if="coup.random_type == 3" class="coupon_left">
                      <!--商品专享-->
                      <img src="http://img2.vipbcw.com/wap/coup-left.png">
                    </div>
                    <div v-else-if="coup.random_type == 0" class="coupon_left">
                      <!--指定金额 多商品-->
                      <p class="p-price">{{coup.type_money}}</p>
                      <p>满{{coup.min_goods_amount}}可用</p>
                    </div>
                    <div class="coupon_right">
                      <p class="p-name" v-html="coup.type_name"></p>
                      <p>{{coup.label_name}}</p>
                      <p>有效期</p>
                      <p v-html="coup.use_time"></p>
                    </div>
                  </div>
                  <img
                    v-if="coup.is_available == 0"
                    class="img-over"
                    src="../../assets/images/coup-bg.png"
                  >
                </div>
                <em
                  v-if="coup.is_available == 1"
                  class="fr check-icon"
                  @click="coupCheck(coup.bonus_id)"
                ></em>
                <em v-else class="fr check-icon"></em>
              </li>
            </template>

            <li :class="{on : hasClassOn}" v-else data-money="0" data-id="0" style="padding:0;">
              <p style="font-size:1.5rem;position:relative;padding:10px 2% 10px 3%">
                不使用优惠券
                <em class="fr check-icon" @click="coupCheck(coup.bonus_id)"></em>
              </p>
              <p
                v-if="disCoupNum == 0"
                style="text-align: center;font-size:1.4rem;padding:15px 0;"
              >--------以下券不适用--------</p>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="coupMaskShow"
        class="more-mask"
        @click="coupMaskShow ? coupMaskShow=false :coupMaskShow=true"
      ></div>
    </div>
    <ConfirmDial ref="confirm"></ConfirmDial>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
import { affirmOrder, orderCreate, getConfig } from '../../service/getData'
import { setSessionStore, getSessionStore } from '../../assets/js/mUtils'
import ConfirmDial from '../../components/confirmDialog'
import Valert from '../../components/alertDialog'

export default {
  data () {
    return {
      goodsId: [],
      //      pay_type:1,
      bonus_id: 0,
      default_addr: {},
      default_coup: {},
      goods_list: [],
      pay_type: [{ status: 0 }, { status: 0 }, { status: 0 }],
      pay_data: {},
      choosePayType: -1,
      choosePayCoup: 0,
      userMoney: 0,
      pay_note: '',
      orderId: 0,
      coupMaskShow: false,
      hasClassOn: false,
      payInfo: {
        '5': { 'icon': 'http://img2.vipbcw.com/wap/ic_wechat_pay@2x.png', 'desc': '微信支付', 'tip': '微信安全支付' },
        '2': { 'icon': 'http://img2.vipbcw.com/wap/ic_alipay@2x.png', 'desc': '支付宝支付', 'tip': '推荐有支付宝用户' },
        '1': { 'icon1': 'http://img2.vipbcw.com/wap/ic_balance_pay@2x.png', 'icon2': 'http://img2.vipbcw.com/wap/ic_balance_pay_disable@2x.png', 'desc': '余额支付', 'tip': '可用余额' }
      },
      canUseCoup: 1,
      count: 0,
      lanch_times: -1,
      Data: {},
      getAddr: {},
      disCoupNum: 0,
      additional_amount_list: []
    }
  },
  components: {
    ConfirmDial,
    Valert
  },
  created () {
    this.goodsId = getSessionStore("transmitGoodsId").replace('[', '').replace(']', '').replace(/\"/g, '').split(',');
    this.lanch_times = getSessionStore('lanch_times');
    this.getAddr = eval('(' + getSessionStore('default_addr') + ')');
    this.affirm(this.goodsId, this.lanch_times);
  },
  mounted () { },
  updated () {
  },
  methods: {
    back () {
      this.$router.go(-1);
    },
    affirm (goodsId, lanch_times, pay_type, bonus_id) {
      affirmOrder(goodsId, lanch_times, pay_type, bonus_id).then(res => {
        if (res.data.result_code == 0) {
          this.pay_data = res.data.result_data;
          this.default_addr = res.data.result_data.default_address;
          this.default_coup = res.data.result_data.default_bonus;
          this.goods_list = res.data.result_data.goods_list;
          this.pay_type = res.data.result_data.pay_type;
          this.additional_amount_list = res.data.result_data.additional_amount_list;
          if (this.getAddr != undefined) {
            this.default_addr = this.getAddr;
          }
          if (this.default_coup == '') {
            this.canUseCoup = 0;
          } else {
            this.canUseCoup = 1;
            for (var j = 0; j < this.default_coup.length; j++) {
              if (this.default_coup[j].bonus_id == '-1') {
                if (j == this.default_coup.length - 1) {
                  this.disCoupNum = 1;
                } else {
                  this.disCoupNum = 0;
                }
              }
            }
          }
          if (pay_type == undefined) {
            for (var i = 0; i < this.pay_type.length; i++) {
              if (this.pay_type[i].status == 1) {
                this.choosePayType = this.pay_type[i].code;
              }
            }
          } else {
            this.choosePayType = pay_type;
          }
          if (bonus_id == undefined) {
            for (var i = 0; i < this.default_coup.length; i++) {
              if (this.default_coup[i].is_default == 1) {
                this.choosePayCoup = this.default_coup[i].bonus_id;
              }
            }
          } else {
            if (this.default_coup.length == 0) {
              this.choosePayCoup = '';
            } else {
              this.choosePayCoup = bonus_id;
            }
          }
        } else {
          this.$refs.alertTip.alert(res.data.result_info);
        }
      })
    },
    coupCheck (coupId) {
      if (coupId == -1) {
        if (this.hasClassOn) {
          this.hasClassOn = false;
        } else {
          this.hasClassOn = true;
        }
      } else {
        this.hasClassOn = false;
      }
      this.affirm(this.goodsId, this.lanch_times, this.choosePayType, coupId);
      this.coupMaskShow = false;
    },
    payCheck (payType) {
      this.affirm(this.goodsId, this.lanch_times, payType, this.choosePayCoup);
    },
    submitOrder () {
      if (document.getElementById('marks').value == 0) {
        this.pay_note = '';
      } else {
        this.pay_note = document.getElementById('marks').value;
      }
      if (document.getElementsByClassName('addr').length > 0) {
        this.$refs.alertTip.alert('请选择收货地址');
      } else if (document.getElementsByClassName('active').length <= 0) {
        this.$refs.alertTip.alert('请选择支付方式');
      } else {
        if (this.choosePayType == 1) {
          //        余额支付
          this.$refs.confirm.confirm({
            text: "确定使用余额支付？",
            cancelButtonText: '取消',
            confirmButtonText: '确定'
          }).then(() => {
            this.$refs.confirm.show = false;
            orderCreate(this.goodsId, this.choosePayType, this.default_addr.address_id, this.choosePayCoup, this.pay_note).then(res => {
              if (res.data.result_code == 0) {
                this.orderId = res.data.result_data.order.order_id;
                setSessionStore('orderId', this.orderId);
                this.$router.push({ path: '/pay/paySucc?orderId=' + this.orderId })
              } else {
                this.$refs.alertTip.alert(res.data.result_info);
              }
            })
          }).catch(() => { })
        } else if (this.choosePayType == 2) {
          //        支付宝支付
          orderCreate(this.goodsId, this.choosePayType, this.default_addr.address_id, this.choosePayCoup, this.pay_note).then(res => {
            if (res.data.result_code == 0) {
              this.orderId = res.data.result_data.order.order_id;
              setSessionStore('orderId', this.orderId);
              if (res.data.result_data.payStatus.status == 0) {
                window.location.href = res.data.result_data.payStatus.info.redirectUrl;
              } else {
                this.$refs.alertTip.alert(res.data.result_info);
              }
            } else {
              this.$refs.alertTip.alert(res.data.result_info);
            }
          })
        } else if (this.choosePayType == 5) {
          //       微信支付
          orderCreate(this.goodsId, this.choosePayType, this.default_addr.address_id, this.choosePayCoup, this.pay_note).then(res => {
            if (res.data.result_code == 0) {
              var _orderId = res.data.result_data.order.order_id;
              this.orderId = res.data.result_data.order.order_id;
              setSessionStore('orderId', this.orderId);

              if (res.data.result_data.payStatus.status == 0) {
                var _flag = res.data.result_data.payStatus.info;
                //var wx = require('weixin-js-sdk');
                wx.chooseWXPay({
                  timestamp: _flag.timeStamp,//时间戳
                  nonceStr: _flag.nonceStr,//随机串
                  package: _flag.package,// 统一支付接口返回的prepay_id参数值
                  signType: _flag.signType,//微信签名方式
                  paySign: _flag.paySign,//微信签名
                  success: function (data) {
                    if (data.errMsg == "chooseWXPay:ok") {
                      // 支付成功之后更新订单信息，保存支付日志
                      window.location.href = '/pay/paySucc?orderId=' + _orderId
                    } else {
                      //支付失败后的操作
                      window.location.href = '/user-event/user-order'
                    }
                  },
                  cancel: function (data) {
                    window.location.href = '/user-event/user-order'
                  }
                });
              } else {
                this.$refs.alertTip.alert(res.data.result_info);
              }
            }
          })
        }
      }
    },
    orderData () {
      orderCreate(this.goodsId, this.choosePayType, this.default_addr.address_id, this.choosePayCoup, this.pay_note).then(res => {
        if (res.data.result_code == 0) {
          this.orderId = res.data.result_data.order.order_id;
          setSessionStore('orderId', this.orderId);
          this.$router.push({ path: '/pay/paySucc', query: { orderId: this.orderId } })
        } else {
          this.$refs.alertTip.alert(res.data.result_info);
        }
      })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.move {
  -webkit-transition: bottom ease-out 200ms;
  -moz-transition: bottom ease-out 200ms;
  -o-transition: bottom ease-out 200ms;
  transition: bottom ease-out 200ms;
  bottom: 0;
}
.payIcon {
  width: 17%;
  margin-right: 5px;
}
.icon-iccouponsubmitorder:before {
  display: inline-block;
  content: "";
  width: 18px;
  height: 18px;
  background: url(http://img2.vipbcw.com/wap/integral-mall/ic_coupon_submitorder@2x.png)
    no-repeat left;
  background-size: 100%;
  vertical-align: top;
}
.icon-icmethoddetails:before {
  display: inline-block;
  content: "";
  width: 20px;
  height: 20px;
  background: url(http://img2.vipbcw.com/wap/integral-mall/ic_payment@2x.png)
    no-repeat left;
  background-size: 100%;
  vertical-align: top;
}
.icon-icgoodsdetails:before {
  display: inline-block;
  content: "";
  width: 18px;
  height: 18px;
  background: url(http://img2.vipbcw.com/wap/integral-mall/img_shangpin@2x.png)
    no-repeat left;
  background-size: 100%;
  vertical-align: top;
}
.order {
  background-color: #eee;
}
.payHeader {
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 50px;
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  font-size: 1.4rem;
  line-height: 50px;
  z-index: 99;
  color: rgba(60, 67, 71, 1);
}
.payHeader .left-box {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  padding-left: 2%;
  text-align: left;
}
.payHeader .left-box img {
  width: 40%;
}
.paddingBottom_1 {
  padding-bottom: 50px;
}
#select-address {
  background-color: #fff;
}
/*无收货地址*/
.addr {
  padding: 15px 2%;
  margin-bottom: 10px;
}
.addr a {
  display: block;
}
.addr i {
  font-size: 1.4rem;
}
.addr img {
  width: 15px;
}
/*有收货地址时*/
.address {
  position: relative;
  width: 98%;
  padding: 10px 2%;
  background: #fff url("../../assets/images/ic_arrow.png") no-repeat;
  background-size: 2%;
  background-position: 98%;
}
.address span {
  width: 20%;
  display: inline-block;
  text-align: left;
  color: #9ea1a3;
  float: left;
}
.address div {
  padding: 0 2%;
  margin: 10px 0;
}
.address div p {
  display: inline-block;
  width: 70%;
}
.address div p i {
  display: inline-block;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.address i.icon-icongo {
  position: absolute;
  right: 2%;
  top: 50%;
  font-size: 1.6rem;
  margin-top: -0.8rem;
}
.address p.bg {
  display: block;
  height: 6px;
  background: url("http://img2.vipbcw.com/wap/p_bg.png") repeat-x;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
/*.addr,.address{margin-right:10px;background:#ffffff url('http://img2.vipbcw.com/wap/icEnter.png') no-repeat right center;background-size:0.7rem;}*/
#address_form {
  margin-right: 10px;
  background: #ffffff url("http://img2.vipbcw.com/wap/icEnter.png") no-repeat
    right center;
  background-size: 0.7rem;
}

/*选择优惠劵*/
.choose {
  margin: 10px 0;
  padding: 10px 2% 10px 3%;
  background-color: #fff;
}
.choose[data-id=""],
.choose[data-id="0"] {
  background-image: none;
}
.choose span {
  margin-right: 5%;
}
.choose .iconfont {
  font-size: 1.4rem;
  color: rgba(222, 43, 43, 1);
}
.pay {
  background-color: #ffffff;
  margin: 10px 0;
}
.pay .tit {
  padding: 3%;
  border-bottom: 1px solid #efefef;
}
.pay .tit .iconfont {
  font-size: 1.4rem;
}
.pay .way {
  padding: 0 3%;
  padding-bottom: 2%;
}
.pay .way1 {
  margin: 10px 0;
  padding: 8px 0;
  border: 1px solid #efefef;
  height: 45px;
}
.pay .way1.active {
  border: 1px solid #ff4348;
}
.pay .way1 span {
  display: inline-block;
  width: 49%;
  text-align: left;
  float: left;
  height: 29px;
  line-height: 29px;
  padding-left: 15%;
  border-right: solid 1px #efefef;
}
.pay .way1 span .iconfont {
  float: left;
  margin-right: 5px;
}
.pay .way1.dis span .icon-money:before {
  display: inline-block;
  content: "";
  width: 22px;
  height: 22px;
  margin-top: 3.5px;
  background-image: url(http://img2.vipbcw.com/wap/ic_balance_pay_disable@2x.png);
  background-size: 100%;
}
.pay .way1 em {
  display: inline-block;
  width: 49%;
  text-align: center;
  color: #9ea1a3;
  line-height: 35px;
}
.pay .way1 em i {
  color: #171616;
}
.pay .way1 .iconfont {
  font-size: 2rem;
}
/*商品信息*/
.product {
  background-color: #ffffff;
  margin: 10px 0;
}
.product .tit {
  padding: 3%;
  border-bottom: 1px solid #efefef;
}
.product .tit .iconfont {
  font-size: 1.4rem;
}
.product .pro {
  padding: 10px 2%;
  overflow: hidden;
  position: relative;
}
.product .pro img {
  width: 20%;
}
.product .pro .info {
  color: #171616;
  margin-left: 3%;
  width: 74%;
  font-size: 1.3rem;
  line-height: 1.8rem;
  height: 3.6rem;
  overflow: hidden;
}
.product .pro .price {
  width: 74%;
  margin-top: 12%;
  position: absolute;
  bottom: 10px;
  left: 23%;
}
.product .pro .warn {
  display: inline-block;
  padding: 0 3px;
  font-size: 1rem;
  border: solid 1px #ff4f39;
  color: #ff4f39;
  background: none;
  position: absolute;
  bottom: 10px;
  left: 40%;
  border-radius: 3px;
}
/*给商家留言*/
.message {
  margin: 10px 0;
  padding: 15px 0;
  background-color: #ffffff;
}
.message input {
  width: 100%;
  padding: 0 3%;
}
/*满减活动*/
.cut {
  margin-top: 10px;
  background-color: #ffffff;
}
.cut ul li {
  padding: 1% 3%;
}
.cut ul li span {
  color: #9ea1a3;
}
/*提交订单*/
.submit {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 98;
  border-top: 1px solid #efefef;
  padding: 7px 3%;
  background-color: #ffffff;
  text-align: right;
}
.submit span {
  font-size: 1.4rem;
  color: #171616;
}
.submit em {
  color: #ff4348;
  font-size: 1.4rem;
}
.submit a {
  display: inline-block;
  background-color: #ff4f39;
  font-size: 1.4rem;
  color: #fff;
  height: 36px;
  line-height: 36px;
  border-radius: 18px;
  padding: 0 20px;
  margin-left: 3%;
}
/*优惠券遮罩层*/
/*#J_coup_mask{display:none;}*/
.mask-content .content-box {
  width: 100%;
  height: 60%;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  bottom: 0;
  padding-top: 40px;
  z-index: 999;
  -webkit-transform: translateY(100%);
  -ms-transform: translateY(100%);
  transform: translateY(100%);
  -webkit-transition: -webkit-transform 300ms;
  transition: transform 300ms;
  overflow-y: hidden;
}
.mask-content .content-box.orderlist-content-box {
  padding-top: 0;
}
.mask-content .content-box.move {
  -webkit-transform: translateY(0);
  -ms-transform: translateY(0);
  transform: translateY(0);
}
.mask-content p.tt {
  text-align: center;
  height: 40px;
  line-height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-bottom: 1px solid #efefef;
}
.mask-content p.tt i {
  display: block;
  width: 40px;
  height: 40px;
  float: right;
  padding: 8px;
  line-height: 24px;
}
.mask-content .con {
  height: 100%;
  overflow-y: scroll;
}
.content-box .con ul li {
  padding: 2% 3%;
  font-size: 1.4rem;
  position: relative;
  height: auto;
  line-height: normal;
}
/*.content-box .con ul li > img {width: 85%;}*/
.content-box .con ul li:nth-child(2) em img {
  margin-top: 40px;
}
.content-box .con ul li:last-child em img {
  margin-top: 40px;
}
.mask-content .content-box li .check-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-image: url("http://img2.vipbcw.com/wap/check_n.png");
  vertical-align: middle;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  right: 5%;
  top: 50%;
  margin-top: -10px;
}
.mask-content .content-box li.on .check-icon {
  background-image: url("http://img2.vipbcw.com/wap/check_r.png");
}
.mask-content .content-box li.dis .check-icon {
  background-image: url("../../assets/images/coup-icon.png");
}

/*遮罩层灰色背景*/
.more-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 998;
}
/*优惠券*/
.coupBox {
  width: 90%;
  position: relative;
  overflow: hidden;
}
.coupBox .img-over {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9;
}
.coupBox .coupon_piece {
  width: 100%;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 2;
}
.coupBox .coupon_piece .coupon_left {
  width: 33%;
  height: 100%;
  float: left;
  text-align: center;
}
.coupBox .coupon_piece .coupon_left img {
  width: 60%;
  margin-top: 15%;
}
.coupBox .coupon_piece .coupon_left p {
  color: #fff;
  line-height: 1.8rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.coupBox .coupon_piece .coupon_left p.p-price {
  font-size: 2rem;
  line-height: 2.4rem;
  padding-top: 25%;
}
.coupBox .coupon_piece .coupon_left p.p-price:before {
  content: "¥";
  font-size: 1.4rem;
}
.coupBox .coupon_piece .coupon_right {
  width: 67%;
  height: 100%;
  float: right;
  position: relative;
  padding-top: 4%;
  padding-left: 1%;
}
.coupBox .coupon_piece .coupon_right p {
  color: #666;
  line-height: 1.8rem;
}
.coupBox .coupon_piece .coupon_right p.p-name {
  color: #333;
  font-size: 1.5rem;
  line-height: 2.2rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
.coupBox .coupon_piece .coupon_right a {
  display: block;
  width: 35%;
  position: absolute;
  right: 10%;
  top: 40%;
}
</style>



// WEBPACK FOOTER //
// pay.vue?71377380