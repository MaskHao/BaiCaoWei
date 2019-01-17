import Vue from 'vue'
import App from '../App'
import VueRouter from 'vue-router'
import {routerMode} from '../config/env'
import {wxConfig} from '../assets/js/mUtils'

Vue.use(VueRouter)

const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')
const search = r => require.ensure([], () => r(require('../page/home/search')), 'search')
const cart = r => require.ensure([], () => r(require('../page/cart/cart')), 'cart')
const cate = r => require.ensure([], () => r(require('../page/cate/cate')), 'cate')
const cateList = r => require.ensure([], () => r(require('../page/cate/cateList')), 'cateList')
const goods = r => require.ensure([], () => r(require('../page/cate/goods')), 'goods')
const showGoods = r => require.ensure([], () => r(require('../page/cate/showGoods')), 'showGoods')
const comments = r => require.ensure([], () => r(require('../page/cate/comments')), 'comments')
const substance = r => require.ensure([], () => r(require('../page/substance/substance')), 'substance')
const user = r => require.ensure([], () => r(require('../page/user/user')), 'user')
const setting = r => require.ensure([], () => r(require('../page/user/setting')), 'setting')
const collectList = r => require.ensure([], () => r(require('../page/user/collectList')), 'collectList')
const coupList = r => require.ensure([], () => r(require('../page/user/coupList')), 'coupList')
const coupChange = r => require.ensure([], () => r(require('../page/user/coupChange')), 'coupChange')
const integral = r => require.ensure([], () => r(require('../page/user/integral')), 'integral')
const userInfo = r => require.ensure([], () => r(require('../page/userInfo/index')), 'index')
const userNick = r => require.ensure([], () => r(require('../page/userInfo/nick')), 'nick')
const userSnack = r => require.ensure([], () => r(require('../page/userInfo/snack')), 'snack')
const userHobby = r => require.ensure([], () => r(require('../page/userInfo/hobby')), 'hobby')
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const register = r => require.ensure([], () => r(require('../page/login/register')), 'register')
const findPassword = r => require.ensure([], () => r(require('../page/login/findPassword')), 'findPassword')
const pay = r => require.ensure([],() => r(require('../page/pay/pay')),'pay')
const paySucc = r => require.ensure([],() => r(require('../page/pay/paySucc')),'paySucc')
const payFail = r => require.ensure([],() => r(require('../page/pay/payFail')),'payFail')
const order = r => require.ensure([], () => r(require('../page/order/order')), 'order')
const orderDetail = r => require.ensure([], () => r(require('../page/order/orderDetail')), 'orderDetail')
const refundEdit = r => require.ensure([], () => r(require('../page/order/refundEdit')), 'refundEdit')
const transport = r => require.ensure([], () => r(require('../page/order/transport')), 'transport')
const orderEvaluate = r => require.ensure([], () => r(require('../page/order/orderEvaluate')), 'orderEvaluate')
const refundOrder = r => require.ensure([], () => r(require('../page/order/refundOrder')), 'refundOrder')
const address = r => require.ensure([], () => r(require('../page/address/address')), 'address')
const service = r => require.ensure([], () => r(require('../page/service/service')), 'service')
const tell = r => require.ensure([], () => r(require('../page/service/tell')), 'tell')
const editAddress = r => require.ensure([], () => r(require('../page/address/editAddress')), 'editAddress')
const addAddress = r => require.ensure([], () => r(require('../page/address/addAddress')), 'addAddress')
const refundDetail = r => require.ensure([], () => r(require('../page/order/refundDetail')), 'refundDetail')
const integralMall = r => require.ensure([], () => r(require('../page/integralMall/integralMall')), 'integralMall')
const integralGoods = r => require.ensure([], () => r(require('../page/integralMall/integralGoods')), 'integralGoods')
const integralPeans = r => require.ensure([], () => r(require('../page/integralMall/integralPeans')), 'integralPeans')
const integralRecord = r => require.ensure([], () => r(require('../page/integralMall/integralRecord')), 'integralRecord')
const integralOrder = r => require.ensure([], () => r(require('../page/integralMall/integralOrder')), 'integralOrder')
const integralExchangeSucc = r => require.ensure([], () => r(require('../page/integralMall/integralExchangeSucc')), 'integralExchangeSucc')
const integralOrderList = r => require.ensure([], () => r(require('../page/integralMall/integralOrderList')), 'integralOrderList')
const integralTransport = r => require.ensure([], () => r(require('../page/integralMall/integralTransport')), 'integralTransport')
const integralEarnPeans = r => require.ensure([], () => r(require('../page/integralMall/integralEarnPeans')), 'integralEarnPeans')
const appendGoods = r => require.ensure([], () => r(require('../page/cart/appendGoods')), 'appendGoods')
const member = r => require.ensure([], () => r(require('../page/member/index')), 'index')
const memberRule = r => require.ensure([], () => r(require('../page/member/rule')), 'rule')
const sign = r => require.ensure([], () => r(require('../page/sign/index')), 'index')
const newGift = r => require.ensure([], () => r(require('../page/activity/newGift')), 'newGift')
const newGiftRule = r => require.ensure([], () => r(require('../page/activity/newGiftRule')), 'newGiftRule')
const nmActivityList = r => require.ensure([], () => r(require('../page/activity/nmActivityList')), 'nmActivityList')
const coupCenter = r => require.ensure([], () => r(require('../page/activity/coupCenter')), 'coupCenter')
const bindPhone = r => require.ensure([], () => r(require('../page/userInfo/bindPhone')), 'bindPhone')


const routes = [{
  path: '/',
  component: App, // 顶层路由，对应index.html
  children: [ // 二级路由。对应App.vue
    // 地址为空时跳转home页面
    {
      path: '',
      redirect: '/home/index', meta: { keepAlive: true }
    },
    // 首页
    {
      path: '/home/index',
      name:'百草味',
      component: home, meta: { keepAlive: true }
    },
    // 搜索
    {
      path: '/data-list/search',
      name:'搜索',
      component: search
    },
    // 购物车
    {
      path: '/user-event/list-cart',
      name:'购物车',
      component: cart
    },
    // 吃乎
    {
      path: '/substance/index',
      name:'阅读',
      component: substance
    },
    // 分类
    {
      path: '/data-list/category',
      name:'分类',
      component: cate
    },
    // 分类列表
    {
      path: '/data-list/list-goods',
      name:'列表',
      component: cateList
    },
    // 商品详情
    {
      path: '/data-list/detail-goods',
      name:'商品详情',
      component: goods
    },
    // 商品详情--app
    {
      path: '/home/show-good',
      component: showGoods
    },
    // 商品评价
    {
      path: '/comments',
      name:'评价列表',
      component: comments
    },
    // 个人中心
    {
      path: '/user-center/user-center',
      name:'个人中心',
      component: user
    },
    // 设置
    {
      path: '/setting',
      name:'设置',
      component: setting
    },
    // 收藏
    {
      path: '/user-center/collect-list',
      name:'收藏列表',
      component: collectList
    },
    // 优惠券
    {
      path: '/user-center/coupons-list',
      name:'我的优惠券',
      component: coupList
    },
    // 优惠券兑换
    {
      path: '/user-center/coup-change',
      name:'兑换优惠券',
      component: coupChange
    },
    // 积分
    {
      path: '/integral',
      name:'我的味豆',
      component: integral
    },
    // 个人资料
    {
      path: '/user-info/index',
      name:'个人资料',
      component: userInfo
    },
    // 个人资料--修改昵称
    {
      path: '/user-info/nick',
      name:'个人资料-修改昵称',
      component: userNick
    },
    // 个人资料--零食偏好
    {
      path: '/user-info/snack',
      name:'个人资料-零食偏好',
      component: userSnack
    },
    // 个人资料--业余爱好
    {
      path: '/user-info/hobby',
      name:'个人资料-业余爱好',
      component: userHobby
    },
    // 客服帮助
    {
      path: '/service',
      name:'客服帮助',
      component: service
    },
    // 客服帮助
    {
      path: '/tell',
      name:'客服帮助',
      component: tell
    },
    // 登录
    {
      path: '/login/index',
      name:'登录',
      component: login
    },
    // 注册
    {
      path: '/register/index',
      name:'注册',
      component: register
    },
    // 找回密码
    {
      path: '/login/findPassword',
      name:'找回密码',
      component: findPassword
    },
    // 确认订单
    {
      path:'/user-event/pay',
      name:'确认订单',
      component:pay
    },
    // 支付成功
    {
      path:'/pay/paySucc',
      name:'支付成功',
      component:paySucc
    },
    // 支付失败
    {
      path:'/pay/payFail',
      name:'支付失败',
      component:payFail
    },
    //订单列表
    {
        path: '/user-event/user-order',
      name:'订单列表',
        component: order
    },
    //订单详情
    {   //order/orderDetail
        path: '/user-event/order-detail',
      name:'订单详情',
        component: orderDetail
    },
    //物流
    {
        path: '/order/transport',
      name:'物流信息',
        component: transport
    },
    //评价填写
    {
        path: '/order/orderEvaluate',
      name:'评价',
        component: orderEvaluate
    },
    //评价填写
    {
        path: '/refundOrder',
      name:'退款售后',
        component: refundOrder
    },
    // 地址
    {
      path:'/address',
      name:'地址列表',
      component: address
    },
    // 编辑地址
    {
      path:'/editAddress',
      name:'地址编辑',
      component: editAddress
    },
    // 添加地址
    {
      path:'/addAddress',
      name:'地址添加',
      component: addAddress
    },
    //退款退货编辑页
    {
        path: '/refundDetail',
      name:'退货退款',
        component: refundDetail
    },
    //退货编辑
    {
        path: '/refundEdit',
      name:'退货退款',
        component: refundEdit
    },
    //味豆商城首页
    {
      path:'/integral-mall/index',
      name:'味豆商城',
      component:integralMall
    },
    //味豆详情
    {
      path:'/integral-mall/goods',
      name:'味豆商品',
      component:integralGoods
    },
    //我的味豆
    {
      path:'/integralPeans',
      name:'我的味豆',
      component:integralPeans
    },
    //味豆记录
    {
      path:'/integralRecord',
      name:'味豆记录',
      component:integralRecord
    },
    //味豆订单
    {
      path:'/integralOrder',
      name:'味豆订单',
      component:integralOrder
    },
    //兑换成功
    {
      path:'/integralExchangeSucc',
      name:'退换成功',
      component:integralExchangeSucc
    },
    //味豆订单列表
    {
      path:'/integralOrderList',
      name:'订单列表',
      component:integralOrderList
    },
    //味豆订单物流
    {
      path:'/integralTransport',
      name:'物流信息',
      component:integralTransport
    },
    //赚味豆
    {
      path:'/integral-mall/earn-peans',
      name:'赚味豆',
      component:integralEarnPeans
    },
    //凑单列表
    {
      path:'/appendGoods',
      name:'凑单',
      component:appendGoods
    },
    //会员中心
    {
      path:'/member/index',
      name:'会员中心',
      component:member
    },
    //会员中心-规则
    {
      path:'/member/rule',
      name:'会员制度',
      component:memberRule
    },
    //签到
    {
      path:'/sign/index',
      name:'每日签到',
      component:sign
    },
    //新人礼包
    {
      path:'/activity/newer-gift',
      name:'新人礼包',
      component:newGift
    },
    //新人礼包规则
    {
      path:'/activity/newgift-rule',
      name:'新人礼包',
      component:newGiftRule
    },
    //领券中心
    {
      path:'/activity/coup-center',
      name:'领券中心',
      component:coupCenter
    },
    //n元件承接页面
    {
      path:'/activity/nm-activity-list',
      name:'活动优惠',
      component:nmActivityList
    },
    //绑定手机号
    {
      path:'/user-info/bind-phone',
      name:'绑定手机号',
      component:bindPhone
    }
  ]
}]

const router = new VueRouter({
  hashbang:false,
  history: true,
  routes,
  mode: routerMode,
  linkActiveClass: 'active',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.afterEach(route => {
  _hmt.push(['_trackPageview', route.path]);
  let title = route.name ? route.name : '404';
  document.title = title;
  var _indexUrl = 'https://' + window.location.host;
  if(route.path.indexOf('/data-list/detail-goods') < 0){
    wxConfig(route.fullPath,'发现一家好店：百草味微信商城','你的掌上零食铺，精选万千零食，只为满足每一个吃货！',_indexUrl,'http://app.static.vipbcw.com/banner/1470103920.jpg')
  }
  // setPageTitle(title)
})
export default router;



// WEBPACK FOOTER //
// ./src/router/router.js