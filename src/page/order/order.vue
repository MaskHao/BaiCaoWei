<template>
  <div class="con">
    <div class="header-box clearfix">
      <router-link class="header-left" to="/user-center/user-center">
        <img src="../../assets/images/ic_left.png">
      </router-link>我的订单
      <div class="header-right" @click="serviceFun()">
        <img src="../../assets/images/ic_service.png">
      </div>
    </div>
    <div class="orderContent">
      <div class="orderTab-tit">
        <ul class="clearfix">
          <li
            v-bind:class="{'on':index == active}"
            v-for="(orderTab,index) in orderTab"
            :key="index"
          >
            <a
              :href="index == 0 ? '/user-event/user-order' : '/user-event/user-order?id='+index"
              style="display: block;"
            >
              <span>{{orderTab}}</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="orderTab-con">
        <div class="cp-content-box">
          <div class="order-box" v-for="(orderList,index) in orderList" :key="index">
            <p class="order-sn">
              订单日期：
              <i v-html="DateToString(orderList.order_time)"></i>
              <!-- <span class="lovey-key">赠送礼单</span> -->
              <!-----0-未知状态------1-待支付------2-待发货------3-待收货-----4-待评价-----5-交易关闭-----6-延长收货-----7-已评价----8-退款成功---9-待付款-->
              <span
                class="fr redTxt"
                v-if="orderList.order_fitler_status == 1 || orderList.order_fitler_status == 8"
              >{{orderList.order_fitler_status_desc}}</span>
              
              <span
                class="fr blackTxt"
                v-if="orderList.order_fitler_status == 4"
              >{{orderList.order_fitler_status_desc}}</span>
              
              <span
                class="fr greenTxt"
                v-if="orderList.order_fitler_status == 2 || orderList.order_fitler_status == 3 || orderList.order_fitler_status == 6 ||orderList.order_fitler_status == 7 || orderList.order_fitler_status == 9"
              >{{orderList.order_fitler_status_desc}}</span>
              <span
                class="fr"
                v-if="orderList.order_fitler_status == 5"
              >{{orderList.order_fitler_status_desc}}</span>
            </p>
            <a :href="'/user-event/order-detail?order_id='+orderList.order_id">
              <ul>
                <li v-for="orderGoods in orderList.order_goods" :key="orderGoods">
                  <div class="pro-box clearfix">
                    <div class="pro_img" v-if="orderGoods.goods_icon">
                      <img v-lazy="orderGoods.goods_icon+'?imageView2/1/w/200/h/200'">
                    </div>
                    <p class="pro_tit">{{orderGoods.goods_title}}</p>
                    <div class="pro_price">
                      <span>¥{{orderGoods.goods_price}}</span>
                      <span class="fr num">{{orderGoods.goods_count}}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </a>
            <div class="order-info">
              <p class="order-price">
                共{{orderList.goodsNumber}}件商品 &nbsp;合计：
                <i class="redTxt">¥{{orderList.total_fee}}</i>
                <span>（含运费¥{{orderList.shipping_fee}}）</span>
              </p>

              <div class="order-handle" v-if="orderList.order_fitler_status == 1">
                <a
                  id="cancal_order"
                  href="javascript:;"
                  class="J_cancelBtn"
                  data-order-id
                  @click="getOrderCancel(orderList.order_id,index)"
                >取消订单</a>
                <a
                  id="go_pay"
                  class="attr J_goPay"
                  href="javascript:void(0)"
                  data-order-id
                  data-order-money
                  @click="goToPay(orderList.order_id,orderList.is_use_coupon)"
                >去付款
                  <span
                    class="time-down-count"
                    data-now-time
                    data-finish-time
                  >{{getTime(orderList.end_time,orderList)}}</span>
                </a>
              </div>

              <div
                class="order-handle"
                v-if="orderList.order_fitler_status == 3 ||orderList.order_fitler_status == 6"
              >
                <a
                  class="J_yanchang"
                  href="javascript:;"
                  data-order-id
                  v-if="orderList.order_fitler_status == 3"
                  @click="setOrderRecept(orderList.order_id,index)"
                >延长收货</a>
                <router-link
                  v-bind:to="{path: '/order/transport',query: {order_id: orderList.order_id}}"
                >查看物流</router-link>
                <a
                  class="attr J_confirmBtn"
                  href="javascript:;"
                  data-order-id
                  @click="getoOrderConform(orderList.order_id,index)"
                >确认收货</a>
              </div>

              <div class="order-handle" v-if="orderList.order_fitler_status == 4">
                <router-link
                  v-bind:to="{path: '/order/transport',query: {order_id: orderList.order_id}}"
                >查看物流</router-link>
                <router-link
                  class="attr"
                  v-bind:to="{path: '/order/orderEvaluate',query: {order_id: orderList.order_id}}"
                >去评价</router-link>
              </div>

              <div class="order-handle" v-if="orderList.order_fitler_status == 5">
                <a
                  href="javascript:;"
                  class="J_deleteBtn"
                  data-order-id
                  v-on:click="getOrderDelete(orderList.order_id,index)"
                >删除订单</a>
                <a href="javascript:;" class="attr" @click="oneMore(orderList.order_id)">再来一单</a>
              </div>
            </div>
          </div>
          <p id="loding" class="load" v-text="text"></p>
          <div class="empty2" v-if="!orderList.length">
            <img
              style="width:30%;margin:80px auto 20px;display:block;"
              src="../../assets/images/ic_no_goods.png"
            >
            <p class="p2">小吃货，你的零食告急啦！</p>
            <router-link to="/home/index">首页逛逛</router-link>
          </div>
        </div>
        <!-- <div class="load-more scroll-load-more" data-url="/user-event/ajax-order?type=" data-target="J_templateTarget" template-id="list-template" data-page="" data-total="">点击加载更多...</div> -->
      </div>
    </div>
    <!--重新付款遮罩层-->
    <div class="text-dialog" v-bind:class="{'show':isBottomShow}" v-on:click="isBottomShow = false"></div>

    <payModule
      class="mask-content text-dialog-window"
      id="J_pay_mask"
      v-bind:class="{'bottom-show':isBottomShow}"
      @changeModule="isBottomShow = false"
      :oId="transOrderId"
      :isCoupon="isUseCoupon"
    ></payModule>

    <!-- Alert弹窗 -->
    <vAlert ref="alertDialog"></vAlert>
    <!-- vConfirm弹窗 -->
    <vConfirm ref="dialog"></vConfirm>
  </div>
</template>

<script>
import { orderListGet, orderDelete, payType, orderCancel, addCart, orderRecept, orderConform, orderRepay, buyAgain, userQiyuInfo } from '../../service/getData'
import payModule from './payModule'
import vAlert from 'components/alertDialog'
import vConfirm from 'components/confirmDialog'
import orderHeader from './orderHeader'
import { setSessionStore, getSessionStore, addScript } from '../../assets/js/mUtils'
export default {
  data () {
    return {
      orderTab: ['全部', '待付款', '待发货', '待收货', '待评价'],
      active: 0,   //此时的订单列表状态
      orderList: [],
      nowTime: 0,
      payList: [],
      isBottomShow: false,
      page: 1,
      lastPage: 0,
      lastMsg: '',
      text: '',
      transOrderId: undefined,
      isUseCoupon: 0,
      set: ''
    }
  },
  methods: {
    serviceFun () {
      ysf.open();

    },
    goToPay (orderId, iscoupon) {
      this.isBottomShow = true
      setSessionStore('rePayOrderId', orderId)
      this.transOrderId = orderId
      this.isUseCoupon = iscoupon
    },
    getOrderList (orderFitlerStatus, page) {
      return orderListGet(orderFitlerStatus, page).then((response) => {
        let r = response.data.result_data
        this.orderList = response.data.result_data.list
        this.lastPage = response.data.result_data.list_info.list_count
        if (response.data.result_data.list.length != 0) {
          this.nowTime = response.data.result_data.list[0].current_stamp
        }
        //console.log(this.orderList)
        this.lastMsg = r
        this.loopTime()
      });
    },
    underTakeData (orderFitlerStatus, page) {
      return orderListGet(orderFitlerStatus, page).then((response) => {
        let r = response.data.result_data
        if (r) {
          for (let i = 0; i < r.list.length; i++) {
            this.orderList.push(r.list[i])
          }
        }
        if (this.page > 1) {
          if (this.lastPage > this.page) {
            this.text = '加载中...'
          } else {
            setTimeout(() => {
              this.text = '没有更多了哦'
            }, 500)
          }
        }
      });
    },
    loopTime () {
      this.set = setInterval(() => {
        this.nowTime++
      }, 1000)
    },
    getOrderData (index) {
      clearInterval(this.set)
      this.getOrderList(index)
      this.active = index
      this.page = 0
      this.text = ''
    },
    getTime (end, orderlist) {
      let lessTime = end - this.nowTime
      let min = Math.floor((lessTime / 60) % 60)
      let sec = Math.floor(lessTime % 60)
      min = min.toString().length <= 1 ? '0' + min : min
      sec = sec.toString().length <= 1 ? '0' + sec : sec
      if (lessTime > 0) {
        return min + ':' + sec
      } else {
        orderlist.order_fitler_status = 5
        return ''
      }
    },
    getOrderDelete (orderId, index) {

      this.$refs.dialog.confirm({
        text: "确定删除该商品吗",
        cancelButtonText: '取消'
      }).then((res) => {
        orderDelete(orderId).then((response) => {
          this.$refs.alertDialog.alert(response.data.result_info)
          this.orderList.splice(index, 1)

        })
        // 点击确定按钮的回调处理
        this.$refs.dialog.show = false;
      }).catch(() => {
        // 点击取消按钮的回调处理
      });
    },
    getOrderCancel (orderId, index) {
      this.$refs.dialog.confirm({
        text: "确定取消该订单吗",
        cancelButtonText: '取消'
      }).then((res) => {
        orderCancel(orderId).then((response) => {
          this.$refs.alertDialog.alert(response.data.result_info)
          this.orderList[index]['order_fitler_status'] = 5
          this.orderList[index]['order_fitler_status_desc'] = '交易关闭'
        })
        // 点击确定按钮的回调处理
        this.$refs.dialog.show = false;
      }).catch(() => {
        // 点击取消按钮的回调处理
      });
    },
    llpay () {

    },
    oneMore (orderId) {
      buyAgain(orderId).then((response) => {
        this.$router.push({ path: '/user-event/list-cart' })
      })
    },
    setOrderRecept (orderId, index) {
      this.$refs.dialog.confirm({
        text: "是否确认延长收货？",
        cancelButtonText: '取消'
      }).then((res) => {
        orderRecept(orderId).then((response) => {
          if (response.data.result_code == 0) {
            this.$refs.alertDialog.alert('您已经延长三天哦~')
            this.ReceptBtn = false
            this.orderList[index]['order_fitler_status'] = 6
          } else {
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
    getoOrderConform (orderId, index) {
      this.$refs.dialog.confirm({
        text: "是否确认确认收货？",
        cancelButtonText: '取消'
      }).then((res) => {
        orderConform(orderId).then((response) => {
          if (response.data.result_code == 0) {
            //this.$refs.alertDialog.alert('您已经延长三天哦~')
            this.orderList.splice(index, 1)
          } else {
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
    DateToString (date) {
      var date = new Date(Number(date) * 1000);

      return date.getFullYear()
        + "-" + (date.getMonth() > 8 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1))
        + "-" + (date.getDate() > 9 ? date.getDate() : "0" + date.getDate());
    }
  },
  components: {
    vConfirm,
    vAlert,
    orderHeader,
    payModule
  },
  computed: {

  },
  created () {
    if (this.$route.query.id) {
      this.active = this.$route.query.id
    }
    this.getOrderList(this.active, this.page)

    document.addEventListener('scroll', () => {
      let bheight = window.screen.height//浏览器当前窗口可视区域高度
      let sheight = document.body.scrollHeight || document.documentElement.scrollHeight//获取滚动条高度
      let stop = document.body.scrollTop || document.documentElement.scrollTop//滚动条距离顶部的距离

      if (stop >= sheight - bheight) {//当滚动条到顶部的距离等于滚动条高度减去窗口高度时
        //this.lastPage > this.page && this.lastMsg
        if (this.lastMsg) {
          this.page++
          //console.log(this.page)
        }
      }
    })
  },
  updated () {

  },
  mounted () {
    this.$nextTick(function () {
      var _qy = document.getElementById('J_qyScript');
      if (!_qy) {
        addScript()
      }
      userQiyuInfo().then(res => {
        let _data = res.data;
        if (_data.result_code == 0) {
          ysf.config({
            uid: _data.result_data.user_id,
            data: JSON.stringify([
              { "key": "real_name", "value": _data.result_data.nick },
              { "key": "mobile_phone", "value": _data.result_data.mobile },
              { "key": "email", "hidden": true },
              { "index": 0, "key": "integration", "label": "味豆数量", "value": _data.result_data.integration },
              { "index": 1, "key": "channel", "label": "渠道", "value": _data.result_data.channel },
              { "index": 2, "key": "is_cooperation", "label": "是否企业账户", "value": _data.result_data.chanis_cooperation },
              { "index": 3, "key": "birthday", "label": "生日", "value": _data.result_data.birthday },
              { "index": 4, "key": "create_time", "label": "注册时间", "value": _data.result_data.create_time },
              { "index": 5, "key": "avatar", "label": "头像地址", "value": _data.result_data.head_img, "href": _data.result_data.head_img },
              { "index": 6, "key": "fromWhere", "label": "访问来源", "value": "个人中心-在线客服" }
            ])
          });
        }
      })
    })
  },
  watch: {
    'page' () {
      this.underTakeData(this.active, this.page)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-box {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: #fff;
  border-bottom: solid 1px #c8c8c8;
  text-align: center;
  color: #000;
  font-size: 1.4rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}
.header-box .header-left,
.header-box .header-right {
  float: left;
  width: 15%;
  text-align: center;
  height: 100%;
}
.header-box .header-left img,
.header-box .header-right img {
  width: 40%;
}
.header-box .header-right {
  float: right;
}
.con {
  height: 100%;
}
.none {
  display: none;
}
.load {
  padding: 12px 0;
  text-align: center;
  font-size: 1.3rem;
}
.bottom-show {
  bottom: 0;
}
/*重新付款遮罩层*/
.text-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.7);
  display: none;
}
.show {
  display: block !important;
}
/*订单列表*/
.orderContent {
  padding-top: 80px;
}
.orderContent .orderTab-tit {
  background: #fff;
  height: 36px;
  border-bottom: solid 1px #c4c4c8;
  position: fixed;
  top: 45px;
  left: 0;
  width: 100%;
  z-index: 99;
}
.orderContent .orderTab-tit li {
  width: 20%;
  float: left;
  height: 35px;
  line-height: 20px;
  text-align: center;
  font-size: 1.2rem;
  padding-top: 5px;
}
.orderContent .orderTab-tit li span {
  display: inline-block;
  height: 100%;
  padding: 0 3px;
}
.orderContent .orderTab-tit li.on {
  border-bottom: solid 3px #ff4f39;
}
/*订单列表样式*/
.orderTab-con .cp-content-box .order-box {
  background: #fff;
  margin: 10px 0;
}
.cp-content-box .order-box .order-title {
  color: #000;
  text-align: left;
  line-height: 2rem;
  font-size: 1.2rem;
  padding: 0 2%;
}
.cp-content-box .order-box .order-sn,
.pay-order .order-box .order-sn {
  text-align: left;
  line-height: 2rem;
  font-size: 1.3rem;
  color: #858585;
  padding: 7px 2%;
}
.cp-content-box .order-box .order-sn .fr {
  font-size: 1.3rem;
}
.cp-content-box .order-box ul {
  border-top: solid 1px #e5e5e5;
}
.cp-content-box .order-box li,
.info-pro .order-box li {
  margin: 0 0 0 2%;
  border-bottom: dotted 1px #e5e5e5;
  padding: 10px 3% 10px 0;
}

.cp-content-box .order-box li .price-box,
.info-pro .order-box li .price-box {
  border-top: 1px dotted #e5e5e5;
  color: #858585;
  text-align: right;
  font-size: 1.2rem;
  height: 3rem;
  line-height: 3rem;
  margin-right: 2%;
}

.cp-content-box .order-box li .pro-box,
.info-pro .order-box li .pro-box,
.orderInfo-con .order-goods li .pro-box {
  position: relative;
}

.cp-content-box .order-box li .pro-box .pro_price,
.info-pro .order-box li .pro-box .pro_price,
.orderInfo-con .order-goods li .pro-box .pro_price {
  width: 68%;
  text-align: left;
  position: absolute;
  left: 25%;
  bottom: 0;
  color: #000;
  font-size: 1.2rem;
  line-height: 1.8rem;
}

.cp-content-box .order-box li .pro-box .pro_tit,
.info-pro .order-box li .pro-box .pro_tit,
.orderInfo-con .order-goods li .pro-box .pro_tit {
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  font-size: 1.4rem;
  color: #000;
  line-height: 1.8rem;
  height: 3.6rem;
}

.cp-content-box .order-box li .pro-box .pro_tit.p2,
.info-pro .order-box li .pro-box .pro_tit.p2,
.orderInfo-con .order-goods li .pro-box .pro_tit.p2 {
  font-size: 1.2rem;
  color: #808080;
}

.cp-content-box .order-box li .pro-box .pro_img,
.info-pro .order-box li .pro-box .pro_img,
.orderInfo-con .order-goods li .pro-box .pro_img {
  width: 22%;
  float: left;
  margin-right: 3%;
}

.cp-content-box .order-box li .pro-box .pro_price .num,
.info-pro .order-box li .pro-box .pro_price .num,
.orderInfo-con .order-goods li .pro-box .pro_price .num {
  color: #858585;
}

.cp-content-box .order-box li .pro-box .pro_price .num:before,
.info-pro .order-box li .pro-box .pro_price .num:before,
.orderInfo-con .order-goods li .pro-box .pro_price .num:before {
  content: "x";
}

.cp-content-box .order-box .order-info {
  padding-left: 4%;
}
.cp-content-box .order-box .order-info .order-price {
  font-size: 1rem;
  height: 3rem;
  line-height: 3rem;
  color: #858585;
  text-align: right;
}
.cp-content-box .order-box .order-info .order-price i.redTxt {
  font-size: 1.4rem;
}
.cp-content-box .order-box .order-info .order-price span {
  color: #858585;
  font-size: 1rem;
}
.cp-content-box .order-box .order-info .order-handle {
  border-top: dotted 1px #e5e5e5;
  padding: 15px 2% 15px 0;
  text-align: right;
}
.cp-content-box .order-box .order-info .order-handle a,
.orderInfo-con .oItem-con.order-handle a {
  display: inline-block;
  border: solid 1px #434155;
  color: #434155;
  font-size: 1.2rem;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  margin: 0 2%;
  min-width: 7rem;
  text-align: center;
  padding: 0 1rem;
}
.cp-content-box .order-box .order-info .order-handle a.attr,
.orderInfo-con .oItem-con.order-handle a.attr {
  border-color: #ff4f39;
  background: #ff4f39;
  color: #fff;
}

/*订单详情*/
.orderInfo {
  padding-bottom: 50px;
}
.orderInfo .box {
  margin-bottom: 10px;
  background: #fff;
}
.orderInfo .box .tit {
  padding: 0 2%;
  border-bottom: solid 1px #e5e5e5;
  font-size: 1.2rem;
  text-align: left;
  color: #808080;
  height: 45px;
  line-height: 45px;
}
.orderInfo .box .tit i.iconfont {
  font-size: 1.6rem;
  margin-right: 5px;
  float: left;
}
.orderInfo .box .tit i.icon {
  width: 15px;
  margin-right: 5px;
  float: left;
}
.orderInfo .box.info-state {
  padding: 15px 3% 15px 5rem;
  position: relative;
  background: rgba(60, 67, 71, 0.89);
}
.orderInfo .box.info-state.succ {
  background: rgba(245, 166, 35, 1);
}
/*.orderInfo .box.info-state .iconfont{font-size: 2.6rem;position:absolute;left:1.5rem;top:50%;margin-top:-1.3rem;color:#fff;}*/
.orderInfo .box.info-state .icon {
  width: 2.6rem;
  position: absolute;
  left: 1.5rem;
  top: 50%;
  margin-top: -1.3rem;
  color: #fff;
}
.orderInfo .box.info-state p {
  color: #fff;
  padding: 5px 0;
}
.orderInfo .box.info-state p.p1 {
  font-size: 1.4rem;
}
.orderInfo .box .con {
  padding: 5px 2%;
}
.orderInfo .box .con p.item {
  color: #3c4347;
  padding: 5px 0 5px 18%;
  line-height: 20px;
  position: relative;
}
.orderInfo .box .con p.item:after {
  content: ".";
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
.orderInfo .box .con label {
  width: 18%;
  line-height: 20px;
  color: #808080;
  position: absolute;
  top: 5px;
  left: 0;
}
.orderInfo .box.info-pro .info-pro-price {
  padding: 10px 2%;
}
.orderInfo .box.info-pro .info-pro-price p {
  text-align: right;
  padding: 3px 0;
}
.orderInfo .box.info-pro .info-pro-price p em {
  width: 18%;
  display: inline-block;
}
.orderInfo .box.info-detail {
  color: #808080;
  padding: 10px 2%;
}
.orderInfo .box.info-detail p {
  padding: 3px 0;
}
.orderInfo .info-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  border-top: solid 1px #e5e5e5;
  text-align: right;
  padding: 10px 0;
  z-index: 99;
}
.orderInfo .info-footer a,
.pay-success .info-send .btnBox a {
  display: inline-block;
  border: solid 1px #434155;
  color: #434155;
  font-size: 1.2rem;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  margin: 0 2%;
  width: 7rem;
  text-align: center;
}
.orderInfo .info-footer a.attr,
.pay-success .info-send .btnBox a.attr {
  border-color: #ff4f39;
  background: #ff4f39;
  color: #fff;
}
.orderInfo .refund-btn {
  text-align: right;
}
.orderInfo .refund-btn a,
.orderInfo .refund-link {
  display: inline-block;
  padding: 0 5px;
  height: 22px;
  line-height: 22px;
  border-radius: 11px;
  font-size: 1rem;
  border: solid 1px #e5e5e5;
  margin-top: 5px;
}
.orderInfo .refund-link {
  float: right;
  margin-top: 12px;
}
/*订单提交失败*/
.orderInfo.pay-failure {
  padding-bottom: 0;
}
.pay-failure .box.info-state {
  background: rgba(0, 0, 0, 0.4);
}
.pay-failure .fail-label {
  padding: 3px 5px;
  border: solid 1px #de2b2b;
  color: #de2b2b;
  font-size: 1rem;
  position: absolute;
  bottom: 15px;
  left: 43%;
  border-radius: 3px;
  display: none;
}
.pay-failure .order-box li.on .fail-label {
  display: block;
}
/*支付成功*/
.pay-success .box.info-state {
  background: rgba(245, 166, 35, 1);
}
.pay-success .info-send .total {
  height: 40px;
  line-height: 40px;
  text-align: left;
  margin-left: 2%;
  border-top: solid 1px #f6f6f6;
  padding-right: 2%;
}
.pay-success .info-send .total .redTxt {
  float: right;
  font-weight: bold;
  font-size: 1.4rem;
}
.pay-success .info-send .total label {
  background: #ff6f64;
  color: #fff;
  margin-right: 5px;
  padding: 0 3px;
}
.pay-success .info-send .total em {
  color: #ff6f64;
}
.pay-success .info-btn {
  position: relative;
}
.pay-success .info-send .btnBox {
  text-align: right;
  padding: 10px 2%;
  border-top: solid 1px #d9d9d9;
}

/*选择支付方式遮罩层*/
.more-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 998;
}
#J_pay_mask.mask-content .content-box {
  width: 100%;
  background: #fff;
  z-index: 999;
  height: auto;
  padding-top: 0;
}
#J_pay_mask.mask-content .content-box.active {
  -webkit-transform: translateY(0);
  -ms-transform: translateY(0);
  transform: translateY(0);
}
#J_pay_mask.mask-content .content-box .tit {
  padding: 15px 10px;
  text-align: center;
  color: #0c0c0c;
  width: 100%;
  border-bottom: solid 1px #efefef;
}
#J_pay_mask.mask-content .content-box .con {
  height: 100%;
  overflow: scroll;
}
#J_pay_mask.mask-content .content-box li {
  margin-left: 10px;
  padding: 0 2%;
  border-bottom: solid 1px #f5f5f5;
  position: relative;
  color: #0c0c0c;
  height: 50px;
  line-height: 50px;
}
#J_pay_mask.mask-content .content-box li .iconfont {
  font-size: 3rem;
  margin-right: 5px;
}
#J_pay_mask.mask-content .content-box li .iconfont.icon-icongo {
  font-size: 1.2rem;
  margin: 0;
}
#J_pay_mask.mask-content .content-box li.disabled {
  color: #777;
}
#J_pay_mask.mask-content .content-box li:last-child {
  border-bottom: 0;
}
#J_pay_mask.mask-content .content-box .icon-alipayc {
  color: #00aaef;
}
#J_pay_mask.mask-content .content-box .icon-wechatc {
  color: #3ab137;
}
#J_pay_mask.mask-content .content-box .icon-money {
  color: #ff4348;
}
#J_pay_mask.mask-content .content-box li.dis,
#J_pay_mask.mask-content .content-box li.dis .icon-money {
  color: #c0c0c0;
}
.greenTxt {
  color: #19d5ab;
}
.blackTxt {
  color: #3c4347;
}
.empty2 {
  text-align: center;
}
.p2 {
  font-size: 1.2rem;
  color: #808080;
  text-align: center;
  padding: 10px 0;
}
.empty2 a {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 20px;
  background: #ff4f39;
  color: #fff;
}

.icon-alipayc:before {
  display: inline-block;
  content: "";
  width: 22px;
  height: 22px;
  margin-top: 3.5px;
  background-image: url(http://img2.vipbcw.com/wap/ic_alipay@2x.png);
  background-size: 100%;
}

.icon-UP:before {
  display: inline-block;
  content: "";
  width: 22px;
  height: 22px;
  margin-top: 3.5px;
  background-image: url(http://img2.vipbcw.com/wap/ic_UP@2x.png);
  background-size: 100%;
}

.icon-money:before {
  display: inline-block;
  content: "";
  width: 22px;
  height: 22px;
  margin-top: 3.5px;
  background-image: url(http://img2.vipbcw.com/wap/ic_balance_pay@2x.png);
  background-size: 100%;
}

.icon-icongo {
  display: inline-block;
  content: "";
  width: 12px;
  height: 22px;
  background: url(../../assets/images/ic_arrow.png) no-repeat center;
  background-size: 50%;
  position: absolute;
  top: 50%;
  right: 2%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>



// WEBPACK FOOTER //
// order.vue?1812f0f0