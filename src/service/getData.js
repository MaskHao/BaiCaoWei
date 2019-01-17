import {basePath} from '../config/env'
import {encrypt} from '../config/Tools'
import axios from 'axios'
import router from '../router/router'
import {delSessionStore,getSessionStore,setSessionStore,trigger,delCookie} from 'assets/js/mUtils'

let querystring = require('querystring');
axios.defaults.baseURL = basePath;
 //http request 拦截器
axios.interceptors.request.use(
    config => {
        if(config.url.indexOf('unToken') < 0){
          if(config.url.indexOf('?') > 0){
            config.url = config.url + '&pathinfo=' + encodeURIComponent(window.location.href);
          }else{
            config.url = config.url + '?pathinfo=' + encodeURIComponent(window.location.href);
          }

          if(config.data != undefined){
            config.data = querystring.stringify(encrypt(config.data));
          }
        }
        // console.log(config);
       return config;
    },
    err => {
        return Promise.reject(err);
    });

 //http response 拦截器
axios.interceptors.response.use(
    response => {

        // 判断是不是需要走授权
        if (response.data.result_code === '1008' || response.data.result_code === '1009') {
            window.location.href = response.data.result_data.url;
            return false;
        }

        if (response.config.url.indexOf('unLogin') < 0 && response.data.result_code === "1003") {

            delCookie('token');
            delSessionStore('token');
            delSessionStore('userInfo');

            if(typeof(response.data.result_data.openid) != 'undefined'){
                setSessionStore('bindInfo',response.data.result_data);
                // 跳临时用户绑定手机号页面
                window.location.href = '/user-info/bind-phone';
            }else{
              trigger('J_loginBtn')
            }
            return response;
        } else {
            return response;
        }

    },
    err => {
        return Promise.reject(err);
    })

// 登录
let login = (uPhone,uPwd) => axios.post('/account/login?v=2.0',{
    mobile_phone: uPhone,
    password: uPwd
})
//验证码登录
let loginCode = (uPhone,uPwd) => axios.post('/account/loginByCode?v=2.0',{
  mobile_phone: uPhone,
  phone_captcha: uPwd
})
// 退出登录
let logOut = () => axios.post('/account/logOut?v=2.0',{})
// 注册
let register = (uPhone,uPwd,yzm) => axios.post('/account/register?v=2.0',{
    mobile_phone: uPhone,
    password: uPwd,
    phone_captcha: yzm
})
// 找回密码
let findPassword = (uPhone,uPwd,yzm) => axios.post('/account/findPassword?v=2.0',{
    mobile_phone: uPhone,
    new_password: uPwd,
    phone_captcha: yzm
})
// 发送验证码
let sendPhoneCode = (uPhone,type) => axios.post('/account/sendPhoneCode?v=2.0',{
    mobile_phone: uPhone,
    type: type
})
let homeTab = () => axios.post('/site/getIndexTabs?v=2.0',{})

let indexModuleData = (tabId) => axios.post('/site/indexModuleData?v=2.0',{tab_id: tabId})
let productList = (tabId,page) => axios.post('/site/getIndexGoodsList?v=2.0',{tab_id:tabId,page:page})
let saleList = (tabId,page) => axios.post('/site/saleList?v=2.0',{tab_id:tabId,page:page})

let clickTab = (tabId) => axios.post('/site/indexModuleData?v=2.0',{tab_id:tabId})


let getBottomBanner = () => axios.post('/site/getBottomBanner?v=2.0',{})

let getHotSearch = () => axios.post('/goods/words?v=2.0',{})   //热词搜索

let getGoodsSearch = (goodsName,page,goodsType) => axios.post('/goods/search?v=2.0',{search_info: goodsName,page:page,search_type: goodsType})   //搜索商品

let getGoodsCategory = () => axios.post('/discover/category?v=2.0',{})   //商品分类

let getGoodsDetails = (goodsId) => axios.post('/goods/detial?v=2.0',{goods_id: goodsId})   //商品详情
let getGoodsInfo = (goodsId) => axios.post('/goods/getGoodsInfo?v=2.0',{goods_id: goodsId})   //商品图文详情

let getGoodsComments = (goodsId,page) => axios.post('/goods/comments?v=2.0',{goods_id: goodsId,page: page})   //商品评论

let getGoodsByCate = (catId,page,searchType) => axios.post('/discover/goodsByCate?v=2.0',{cat_id: catId,page:page,search_type:searchType})   //按商品分类查询商品列表

let cartGoods = () => axios.post('/cart/goods?v=2.0&unLogin=1',{}) //购物车列表
let getGoodsAddCart = (goodsId) => axios.post('/goods/cart?v=2.0',{goods_id: goodsId,count:1})   //加入购物车
let isCheckedGoods = (check,goodsId) =>axios.post('/cart/cartSelectEdit?v=2.0',{check:check,goods_id:goodsId})
let deleteGoods = (goodsId) => axios.post('/cart/deleteCartByMore?v=2.0',{goods_id:goodsId})
let addCart = (goodsId,count) => axios.post('/goods/cart?v=2.0',{goods_id:goodsId,count:count})//添加商品到购物车
let changeCartGoodsNum = (change,goodsId,count) => axios.post('/cart/cartEdit?v=2.0',{add_or_del:change,goods_id:goodsId,count:count})//增减购物车商品数量
let goodsAppend = (price) => axios.post('/goods/append?v=2.0',{price:price})//购物车去凑单

let getGoodsAddCollect = (goodsId) => axios.post('/user/collectAdd?v=2.0',{goods_id: goodsId})   //加入收藏

let getGoodsDelCollect = (goodsId) => axios.post('/user/collectDel?v=2.0',{goods_id: goodsId})   //删除收藏

let getGoodsCollectList = () => axios.post('/cart/goods?v=2.0&unLogin=1',{})   //获取购物车商品列表

let getCategory = (type) => axios.post('/eatit/getCategory',{})   //吃乎标题列表
let getEatIndex = (type) => axios.post('/eatit/index',{type:type})   //吃乎内容列表
let eatitLike = (id) => axios.post('/eatit/like',{type:0,id:id})   //吃乎内容列表

let affirmOrder = (goodsId,lanch_times,pay_type,bonus_id) =>axios.post('/order/launch?v=2.0',{goods_id:goodsId,lanch_times:lanch_times,pay_type:pay_type,bonus_id:bonus_id}) //确认订单页面

let orderListGet = (orderFitlerStatus,page) => axios.post('/order/orders?v=2.0',{order_fitler_status:orderFitlerStatus,page:page})   //订单列表

let orderDetail = (orderId) => axios.post('/order/detial?v=2.0',{order_id:orderId})   //订单详情

let orderDelete = (orderId) => axios.post('/order/deleteOrder?v=2.0',{order_id:orderId})   //订单删除

let orderConform = (orderId) => axios.post('order/conform?v=2.0',{order_id:orderId})   //确认收货

let orderCancel = (orderId) => axios.post('/order/cancle?v=2.0',{order_id:orderId})   //订单取消

let orderComment = (orderId) => axios.post('/goods/getOrderComments?v=2.0',{order_id:orderId})   //订单评价

let orderRecept = (orderId) => axios.post('/order/extendReceipt?v=2.0',{order_id:orderId})   //订单延长

let orderRepay = (orderId,payType) => axios.post('/order/rePay?v=2.0',{order_id:orderId,pay_type:payType})   //订单重新发起支付

let orderCreate = (goodsId,payType,addressId,bonusId,payNote) => axios.post('/order/create?v=2.0',{goods_id:goodsId,pay_type:payType,address_id:addressId,bonus_id:bonusId,pay_note:payNote})   //订单创建

let orderStatus = (orderId) => axios.post('/order/orderStatus?v=2.0',{order_id:orderId})   //个人中心的订单数（各状态下对用的数目

let orderLogistics = (orderId,orderType) => axios.post('/Site/getLogistics?v=2.0',{order_id:orderId,order_type:orderType})   //获取积分商城物流

let setCommentsToTable = (goodsId,orderId,content,commentImg) => axios.post('/goods/setCommentsToTable?v=2.0',{goods_id:goodsId,order_id:orderId,content:content,comment_img:commentImg	})   //添加订单商品评论

let userInfo = () => axios.post('/user/info?v=2.0&unLogin=1',{})   //用户信息
let userQiyuInfo = () => axios.post('/user/info?v=2.0&unLogin=1',{})   //七鱼客服配置信息
let orderNum = () => axios.post('/order/orderStatus?v=2.0',{})   //个人中心订单数量
let collection = (page,cursor_id) => axios.post('/user/collection?v=2.0',{page:page,cursor_id:cursor_id})   //收藏
let delCollectByMore = (goodsIdArr) => axios.post('/user/delCollectByMore?v=2.0',{goods_id:goodsIdArr})   //批量取消收藏
let refundOrderList = (page) => axios.post('/order/refundOrderListV2?v=2.0',{page:page})   //退款售后列表

let addressList = (page) => axios.post('/user/addressList?v=2.0',{page:page})//地址列表
let addressRegion = (parentId) => axios.post('/site/region?v=2.0',{parent_id:parentId})//省市区列表
let addressRegionDtl = (parentId) => axios.post('/site/regionDetial?v=2.0',{parent_id:parentId})//详情地址
let addAddress = (addr,proId,cityId,areaId,consignee,mobile) => axios.post('/user/addressAdd?v=2.0',{address:addr,province_id:proId,city_id:cityId,area_id:areaId,consignee:consignee,mobile:mobile})
let delAddress = (addrId) => axios.post('/user/addressDel?v=2.0',{address_id:addrId})
let setDefaultAddress = (addrId) => axios.post('/user/addressDefault?v=2.0',{address_id:addrId})
let addressDetail = (addrId) => axios.post('/user/addressDetial?v=2.0',{address_id:addrId})//编辑地址时获取地址详情
let editAddress = (addr,addrId,proId,cityId,areaId,consignee,mobile) => axios.post('/user/addressEdit?v=2.0',{address:addr,address_id:addrId,province_id:proId,city_id:cityId,area_id:areaId,consignee:consignee,mobile:mobile})

let regionDetail = (addrId) => axios.post('/site/regionDetial?v=2.0',{region_id:addrId})//获取省市区详情

let refundDetail = (refundId) => axios.post('/order/refundDetailV2?v=2.0',{refund_id:refundId})   //退款退货详情

let refundOrderDetail = (orderId,goodsId) => axios.post('/order/refundDetail?v=2.0',{order_id:orderId,goods_id:goodsId})   //退款退货详情
let refundInit = (orderId,goodsId) => axios.post('/order/refundInit?v=2.0',{order_id:orderId,goods_id:goodsId})   //退款信息初始化

let refundCancel = (orderId,goodsId) => axios.post('/order/refundCancel?v=2.0',{order_id:orderId,goods_id:goodsId})   //取消退款退货详情

let paySuccess = (orderId) => axios.post('/goods/getPayLastGoods?v=2.0',{order_id:orderId}) //支付成功后获得商品及支付信息

let integralMallBanner = () => axios.post('/IntegralMall/getIndexBanner?v=2.0',{})//积分商城banner
let integralMallGoods =(levelType,nowPage) => axios.post('/IntegralMall/getMallGoods?v=2.0',{level:levelType,page:nowPage})//积分商城的商品
let integralMallEarnPeans = (page,type) => axios.post('/user/getUserMarkList?v=2.0',{page:page,type:1})//味豆赚取
let integralMallUsedPeans = (page) => axios.post('/user/getUserMarkList?v=2.0',{page:page,type:2})//味豆使用
let integralMallRealExchangeList = (page) => axios.post('/IntegralMall/getIntegrationOrders?v=2.0',{page:page})//实物兑换记录
let integralMallCouponExchangeList = (page) => axios.post('/IntegralMall/getUsedIntegration?v=2.0',{page:page,type:0})//优惠劵兑换记录
let integralMallGoodsDetail = (goodsId) =>axios.post('/IntegralMall/getGoodInfo?v=2.0',{goods_id:goodsId})//味豆商城商品详情
let integralMallRealExchange = (goodsId) => axios.post('/IntegralMall/exchangeRealGoods?v=2.0',{goods_id:goodsId})//实物兑换
let integralMallCoupExchange = (goodsId) => axios.post('/IntegralMall/exchangeCoupon?v=2.0',{goods_id:goodsId})//优惠劵兑换
let integralMallCreateOrder = (addressId,goodsId) => axios.post('/IntegralMall/createOrder?v=2.0',{address_id:addressId,goods_id:goodsId})//创建味豆订单
let integralMallOrderList = (page) => axios.post('/IntegralMall/getIntegrationOrders?v=2.0',{page:page})//味豆订单列表
let integralMallTransport = (orderId,orderType) => axios.post('/Site/getLogistics?v=2.0',{order_id:orderId,order_type:1})//味豆物流
let integralMallGetTaskList = () =>axios.post('/user/getTaskList?unLogin=1',{})//赚味豆

let coupCounts = () => axios.post('/coupon/counts?v=2.0&unLogin=1',{})   //优惠券总数（个人中心显示）
let coupHistory = (page) => axios.post('/coupon/history?v=2.0',{page:page})   //已失效优惠券列表
let coupNear = (page) => axios.post('/coupon/getUnUserfulCoupon?v=2.0',{page:page})   //快过期优惠券列表
let coupEnable = (page) => axios.post('/coupon/enable?v=2.0',{page:page})   //未使用优惠券列表
let coupCenter = () => axios.post('/coupon/getCenterInfo?v=2.0',{})   //领券中心


let refundCommit = (refundId,orderId,goodsId,refundReason,refundMoney,applyService,refundImages,description) => axios.post('/order/refundCommit?v=2.0',{refund_id:refundId,order_id:orderId,goods_id:goodsId,refund_reason:refundReason,refund_money:refundMoney,apply_service:applyService,refund_images:refundImages,description:description})   //退款退货编辑/提交

let payType = () => axios.post('/order/getpaytype',{})   //付款类型
let memberCenter = () => axios.post('/grade/memberCenter?v=2',{})   //会员中心
let getGiftDetail = (level,giftType) => axios.post('/grade/getGiftDetail?v=2',{level:level,gift_type:giftType})   //会员中心-礼包详情
let getUserGift = (giftType) => axios.post('/grade/getUserGift?v=2',{gift_type:giftType})   //会员中心-领取礼包
let priComparison = () => axios.post('/grade/PriComparison?v=2',{})   //会员中心-规则
let coupChange = (key) => axios.post('/coupon/conform?v=2.0',{bonus_code:key})   //兑换优惠券
let memberBanner = () => axios.post('/user/memberBanner?v=2',{})   //会员中心banner

let getConfig = (url) => axios.post('/Wechat/getConfig?v=2.0',{url:url}) //获取分享配置项

let editInfo = (obj) => axios.post('/user/editInfo?v=2.0',obj)   //修改用户信息
let getTrade = () => axios.post('/user/getTrade?v=2.0',{})   //获取行业信息

let buyAgain = (orderId) => axios.post('/cart/buyAgain?v=2.0',{order_id:orderId}) //关闭订单重新加入购物车

let sendCode =　(mobile) => axios.post('/account/sendPhoneCode?v=2.0',{mobile_phone:mobile,type:0,})//发送验证码
let checkCount = (mobile) => axios.post('/account/checkAccount?v=2.0',{mobile_phone:mobile})//检测手机号是否在我们平台注册
let registerAlready = (nick,uid,unionid,openid,registrationId,code,headImg,mobile) => axios.post('/account/thirdPartyBind?v=2.0',{nick:nick,uid:uid,wechat_unionid:unionid,wechat_openid:openid,registration_id:registrationId,phone_captcha:code,head_img:headImg,mobile_phone:mobile,type:5})//已注册用户走绑定接口
let Unregister = (nick,pas,uid,unionid,openid,registrationId,code,headImg,mobile) => axios.post('/account/thirdPartyRegister?v=2.0',{nick:nick,uid:uid,password:pas,wechat_unionid:unionid,wechat_openid:openid,registration_id:registrationId,phone_captcha:code,head_img:headImg,mobile_phone:mobile,type:5})//未注册用户绑定接口

let userNew = () => axios.post('/activity/getNewUserGiftInfo',{}) //检查是否是新用户
let giftBanner = () => axios.post('/activity/getNewUserBanner',{}) //获取banner图片
let giftTitle = () => axios.post('/activity/getNewUserSign',{}) //获取title图片

let checkCoup = (take) => axios.post('/activity/getNewerGift?v=2.0&unLogin=1',{take:take})//优惠券领取接口
let getCoup = (take) => axios.post('/activity/getNewerGift?v=2.0',{take:take})//优惠券领取接口

let signIndex = () => axios.post('/Signed/index?v=2.0&unLogin=1',{})   //签到首页
let doSign = () => axios.post('/Signed/doSign?v=2.0',{})   //执行签到
let singRemind = () => axios.post('/Signed/signInReminder?v=2.0',{})   //签到提醒


let tplGoods = (id) => axios.post('/activity/getTplGoods',{'id':id})   //活动模版商品列表
let getCoupon = (id) => axios.post('/coupon/getCoupon?v=2.0',{'coupon':id})   //领取优惠券方法
let nmActivityList = (id) => axios.post('/activity/nmActivityList?v=2.0',{'type':id})   //n元减

export {login,homeTab,indexModuleData,productList,saleList,clickTab,getBottomBanner,sendPhoneCode,register,findPassword,getHotSearch,getGoodsSearch,getGoodsCategory,getGoodsDetails,getGoodsInfo,getGoodsComments,getGoodsByCate,cartGoods,isCheckedGoods,deleteGoods,addCart,changeCartGoodsNum,getGoodsAddCart,getGoodsAddCollect,getGoodsDelCollect,getGoodsCollectList,getEatIndex,getCategory,eatitLike,affirmOrder,orderListGet,orderDetail,orderDelete,orderCancel,orderComment,orderRecept,orderRepay,orderCreate,orderStatus,orderLogistics,setCommentsToTable,refundOrderList,refundDetail,refundCancel,userInfo,userQiyuInfo,addressList,paySuccess,addAddress,delAddress,setDefaultAddress,addressRegion,addressRegionDtl,addressDetail,regionDetail,editAddress,integralMallBanner,integralMallGoods,integralMallEarnPeans,integralMallUsedPeans,orderNum,collection,logOut,integralMallRealExchangeList,integralMallCouponExchangeList,integralMallGoodsDetail,integralMallRealExchange,integralMallCoupExchange,integralMallCreateOrder,delCollectByMore,integralMallOrderList,integralMallTransport,coupCounts,coupHistory,coupNear,coupEnable,coupCenter,loginCode,integralMallGetTaskList,refundCommit,payType,orderConform,refundOrderDetail,memberCenter,getGiftDetail,getUserGift,memberBanner,priComparison,coupChange,goodsAppend,editInfo,getTrade,getConfig,buyAgain,sendCode,checkCount,registerAlready,Unregister,refundInit,checkCoup,getCoup,signIndex,doSign,singRemind,tplGoods,userNew,giftTitle,giftBanner,getCoupon,nmActivityList}



// WEBPACK FOOTER //
// ./src/service/getData.js