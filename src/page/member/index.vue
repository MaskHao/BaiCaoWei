<template>
  <div class="member-box">
    <div class="member-top">
      <img src="../../assets/images/me_bg.png"/>
      <div class="ab-box">
          <div class="img-box"><img v-if="userInfo.avatar" :src="userInfo.avatar + '?imageView2/2/w/100'"/> </div>
         <div class="center-box">
           <p>{{userInfo.nickname}}<span v-if="userLevel != 4">成长值 {{userPrice}}/{{levelValue}}</span></p>
           <div class="v-line">
            <p :style="{ width: levelLength + '%' }"><img src="http://img2.vipbcw.com/wap/vip_line.png"/></p>
           </div>
         </div>
        <div class="level-box"><img v-if="headImg" v-lazy="headImg"/> </div>
      </div>
      <router-link v-if="bcwMall == 0" class="rule-box" :to="{path: '/member/rule',query: {type:3}}">
        <img src="../../assets/images/ic_wenhao.png"/>
      </router-link>
    </div>
    <div class="member-nav" v-if="userLevel != ''">
      <ul v-if="userLevel == 0 || userLevel == -1" class="clearfix" :class="{'on' : navMore == 1}">
        <li>
          <a href="/activity/newer-gift" @click="nGift">
            <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav4.png"/></div>
            <p>新人有礼</p>
          </a>
        </li>
        <li @click="showTip('gwzwd')">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav1.png"/></div>
          <p>购物赚味豆</p>
        </li>
        <li @click="showTip('pjjl')">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav5.png"/></div>
          <p>评价奖励</p>
        </li>
        <li @click="showDisTip('sjlb')">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav9.png"/></div>
          <p>升级礼包</p>
        </li>
        <li @click="showDisTip('byq')">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav19.png"/></div>
          <p>包邮券</p>
        </li>
        <li @click="showDisTip('srdl')">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav11.png"/></div>
          <p>生日大礼</p>
        </li>
        <li @click="showDisTip('hyj')">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav15.png"/></div>
          <p>会员价</p>
        </li>
        <li @click="showDisTip('xpsc')">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav13.png"/></div>
          <p>新品试吃</p>
        </li>
        <li @click="showTip('hyr')">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav20.png"/></div>
          <p>会员日</p>
        </li>
      </ul>
      <ul v-else class="clearfix" :class="{'on' : navMore == 1}">
        <li @click="showGiftTip('upGift')">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav8.png"/><i v-if="userGradeGift == 0"></i></div>
          <p>升级礼包</p>
        </li>
        <li @click="getBYcoup()">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav18.png"/></div>
          <p>包邮券</p>
        </li>
        <li @click="showGiftTip('birthGift')">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav10.png"/><i v-if="userBrithdayGift == 2"></i></div>
          <p>生日大礼</p>
        </li>
        <li @click="showTip('hyr')">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav2.png"/></div>
          <p>会员日</p>
        </li>
        <li @click="showTip('pjjl')">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav5.png"/></div>
          <p>评价奖励</p>
        </li>
        <li @click="showTip('xpsc')" v-if="userLevel == 3 || userLevel == 4">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav12.png"/></div>
          <p>新品试吃</p>
        </li>
        <li @click="showTip('hyj')" v-if="userLevel == 2 || userLevel == 3 || userLevel == 4">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav14.png"/></div>
          <p>会员价</p>
        </li>
        <li @click="showDisTip('xpsc')" v-if="userLevel == 1 || userLevel == 2 ">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav13.png"/></div>
          <p>新品试吃</p>
        </li>
        <li @click="showDisTip('hyj')" v-if="userLevel == 1">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav15.png"/></div>
          <p>会员价</p>
        </li>
        <li @click="showTip('zskf')" v-if="userLevel == 4">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav3.png"/></div>
          <p>专属客服</p>
        </li>
        <li @click="showTip('zskf')" v-if="userLevel == 2 || userLevel == 3">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav17.png"/></div>
          <p>专属客服</p>
        </li>
        <li @click="showTip('jstk')" v-if="userLevel == 4">
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav6.png"/></div>
          <p>极速退款</p>
        </li>
        <li @click="showDisTip('jstk')" v-if="userLevel == 2 || userLevel == 3">
          <!--未开通-->
          <div class="img"><img src="http://img2.vipbcw.com/wap/v_nav7.png"/></div>
          <p>极速退款</p>
        </li>
      </ul>
      <p @click="showMoreNav" v-if="userLevel != 1">
        <img v-if="navMore == 0" src="../../assets/images/mem_more.png"/>
        <img v-else src="../../assets/images/mem_more1.png"/>
      </p>
    </div>
    <div class="member-banner">
      <img v-if="memberBanner.length > 0" src="../../assets/images/mem_tit1.png"/>
      <ul class="banner-ul" v-if="memberBanner.length > 0">
        <li v-for="value in memberBanner" :key="value">
          <!--链接-->
          <a v-if="value.link_type == 0" :href="value.link"><img :src="value.image_url + '?imageView2/2/w/640'"/> </a>
          <!--//升级礼包-->
          <img @click="showGiftTip('upGift')" v-else-if="value.link_type == 1" :src="value.image_url + '?imageView2/2/w/640'"/>
          <!--//生日礼包-->
          <img @click="showGiftTip('birthGift')" v-else-if="value.link_type == 2" :src="value.image_url + '?imageView2/2/w/640'"/>
          <!--//包邮券-->
          <img @click="getBYcoup()" v-else-if="value.link_type == 3" :src="value.image_url + '?imageView2/2/w/640'"/>
          <!--//新品试吃-->
          <img @click="showTip('xpsc')" v-else-if="value.link_type == 4" :src="value.image_url + '?imageView2/2/w/640'"/>
        </li>
      </ul>
      <img v-if="memberBannerDis.length > 0" src="../../assets/images/mem_tit2.png"/>
      <ul class="banner-ul" v-if="memberBannerDis.length > 0">
        <li v-for="value in memberBannerDis"  :key="value">
          <!--链接-->
          <a v-if="value.link_type == 0" :href="value.link"><img :src="value.image_url + '?imageView2/2/w/640'"/> </a>
          <!--//升级礼包-->
          <img @click="showDisTip('sjlb')" v-else-if="value.link_type == 1" :src="value.image_url + '?imageView2/2/w/640'"/>
          <!--//生日礼包-->
          <img @click="showDisTip('srdl')" v-else-if="value.link_type == 2" :src="value.image_url + '?imageView2/2/w/640'"/>
          <!--//包邮券-->
          <img @click="showDisTip('byq')" v-else-if="value.link_type == 3" :src="value.image_url + '?imageView2/2/w/640'"/>
          <!--//新品试吃-->
          <img @click="showDisTip('xpsc')" v-else-if="value.link_type == 4" :src="value.image_url + '?imageView2/2/w/640'"/>
        </li>
      </ul>
    </div>
    <!--常规弹窗-->
    <div class="member-tip-box" :class="{'show':tipObj.show}">
      <img class="close" @click="closeTip()" src="http://img2.vipbcw.com/wap/v_close.png"/>
      <img class="tit-img" src="http://img2.vipbcw.com/wap/v_nav2.png"/>
      <p class="tip-content">{{tipObj.msg}}</p>
    </div>
    <!--礼���弹窗-->
    <div class="member-tip-box" :class="{'show':giftTipShow}">
      <img class="tit-img" src="http://img2.vipbcw.com/wap/v_nav2.png"/>
      <img class="close" @click="closeGiftTip()" src="http://img2.vipbcw.com/wap/v_close.png"/>
      <p class="tip-content-tit">{{giftTipObj.title}}</p>
      <ul>
        <li v-for="(value,index) in giftTipObj.gift"  :key="value">{{index+1}}、{{value.gift_name}}</li>
      </ul>
      <p class="tip-content-desc" v-if="giftTipObj.desc">{{giftTipObj.desc}}</p>
      <a class="tip-content-btn" href="/user-center/coupons-list" v-if="giftTipObj.type == 'newGift'">去查看</a>
      <p class="tip-content-btn" @click="getGift(1)" v-else-if="giftTipObj.type == 'upGift' && giftTipObj.btnShow">立即领取</p>
      <p class="tip-content-btn" @click="getGift(2)" v-else-if="giftTipObj.type == 'birthGift' && giftTipObj.btnShow">立即领取</p>
    </div>
    <Valert ref='alertDialog'></Valert>
  </div>
</template>

<script>
  import {memberCenter,getGiftDetail,getUserGift,memberBanner,getCoupon} from '../../service/getData'
  import Valert from '../../components/alertDialog'
  import {jsBridge} from 'assets/js/mUtils'

  export default{
    data(){
      return {
        userInfo:{},
        bcwMall:1,//是否app中打开
        topHeight:300,
        goodsList:null,     //享受会员价的商品列表
        levelDataArr:[],        //会员等级列表
        userLevel:'',        //当前会员等级
        userPrice:0,      //当前会员消费金额
        diffVal:0,      //再消费多少钱升到下一等级
        levelLength:0,     //页面上进度条的长度
        nextLevel:1,        //下一等级
        levelValue:0,       //当前等级价格上限
        nowImg:'http://img2.vipbcw.com/wap/v_v1_now.png',       //商品列表中当前等级价格图片
        prevImg:'http://img2.vipbcw.com/wap/v_v0_b.png',        //商品列表中0级价格图片
        nextImg:'http://img2.vipbcw.com/wap/v_v2_a.png',        //商品列表中下一等级价格图片
        myLevelData:{},         //当前等级享受的权益
        newPeopleCoupon:0,      //是否领取新人礼包0未领取1已领取
        userBrithdayGift:0,     //是否领取生日礼包0未到生日，1已领取，2待领取，3过期
        userGradeGift:0,        //是否领取升级礼包0未领取1已领取
        headImg:'',     //顶部会员等级图片
        msg:{
          'zskf':"加小味微信号'bcwwx1'享V4会员专属客服",//专属客服
          'jstk':'V4专享极速退款，保证退款时效。',//极速退款
          'xpsc':'百草味会不定期进行新品试吃，免费将新品带回家。可关注百草味活动咨询哦！',//新品试吃
          'hyj':'凡商品详情页带会员标签的商品，均为会员价，等级越高，优惠越大哦！',//会员价
          'hyr':'每月17日为百草味app会员日，会员日当天不同等级的会员享受不同折扣的会员日价格',//会员日
          'gwzwd':{
            'v0':'下单就送味豆',
            'v1':'下单就送味豆',
            'v4':'下单就送味豆',
          },//购物赚味豆
          'pjjl':'评价商品，可得5味豆，评价+晒图可得10味豆',//评价奖励
          'byq':'Sorry 亲爱滴~你的成长值还差一点点呦~升级至V1用户每月都可获得一张包邮券'//包邮券
        },
        disMsg:{
          'sjlb':'升级到V1，即可享升级礼包，快去升级吧！',
          'srdl':'升级到V1，即可享生日礼包，快去升级吧！',
          'hyj':'升级到V2，即可享专属会员价，还等什么，来升级呀！',
          'xpsc':'升级到V3，即可享试吃资格哦！',
          'zskf':'升级至V4至尊会员，享专属客服特权。',
          'jstk':'升级到V4，专属客服24小时为你解决售后问题哦！',
          'byq':'Sorry 亲爱滴~你的成长值还差一点点呦~升级至V1用户可获得一张包邮券'//包邮券
        },
        tipObj:{
          show:false,
          msg:''
        },
        giftTipObj:{},
        giftTipShow:false,
        newGiftObj:{
          type:'newGift',
          gift:[],
          desc:'',
          title:'新人礼包'
        },
        birthGiftObj:{
          type:'birthGift',
          gift:[],
          desc:'请关注领取有效期,以免失效哦',
          title:'生日大礼'
        },
        upGiftObj:{
          type:'upGift',
          gift:[],
          desc:'请关注礼包的有效期,以免失效哦',
          title:'升级礼包'
        },
        cmbMerchantBridge:{},//调用客户端方法
        navMore:0,//更多特权
        memberBanner:[],//已解锁banner
        memberBannerDis:[],//未解锁banner,
        'vs':'',// 统计客户端 IOS OR ANDROID
        'terminal':''//统计客户端 APP OR WECHAT
      }
    },
    components:{
      Valert,
    },
    created(){
      this.topHeight = Number(window.screen.width) * 554 / 750;
      this.getVipInfo();
      this.chackUA();
      this.checkUA();
    },
    mounted(){},
    updated(){},
    methods:{
      checkUA(){
          var ua = navigator.userAgent;
          if(ua.indexOf("bcwmall") > 0){
            this.bcwMall = 1;
            var _arr = ua.split('/');
            var _length = _arr.length - 1;
            var vs_arr = _arr[_length].split(".");
            this.appVs = vs_arr.join('').substring(0,3);
          }
          var browser = {
            versions: function() {
              var u = navigator.userAgent, app = navigator.appVersion;
              return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                bcwMall:u.indexOf('bcwmall') > -1
              };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
          };
          if(browser.versions.ios || browser.versions.iPhone || browser.versions.iPad){
            this.vs = 'IOS'
          }else if(browser.versions.android){
            this.vs = 'android'
          }
          if(browser.versions.bcwMall){
            this.terminal = 'app'
          }else{
            this.terminal = 'wechat'
          }
        },
      chackUA(){
        var ua = navigator.userAgent;
        if(ua.indexOf("bcwmall") > 0){
          this.bcwMall = 1;
          this.setBridge()
        }else{
          this.bcwMall = 0;
        }
      },
      getVipInfo:function(){
        var that = this;
        memberCenter().then(function(res){
          var data = res.data;
          that.userInfo = data.result_data.userInfo;
          that.headImg = 'http://img2.vipbcw.com/wap/mem_v'+ data.result_data.level +'.png';
            that.goodsList = data.result_data.goods_list ? data.result_data.goods_list : '';
          that.userLevel = data.result_data.level;//等级
          that.userPrice = data.result_data.myLevelVal/100;//累计金额
          that.nextLevel = Number(data.result_data.level) + 1;
          that.diffVal = data.result_data.diffVal / 100;
          that.myLevelData = data.result_data.myLevelData;
          that.newPeopleCoupon = data.result_data.newPeopleCoupon;
          that.userBrithdayGift = data.result_data.userBrithdayGift;
          if(data.result_data.userBrithdayGift == 2){
            that.birthGiftObj.desc = '领取有效期:'+data.result_data.startDay+'-'+data.result_data.endDay;
          }
          that.userGradeGift = data.result_data.userGradeGift;
          that.checkIcon(data.result_data.levelDataArr);
          that.checkImg();
          that.checkLength();
          that.newGiftObj.gift = data.result_data.couponTypeName;
          var _weidou = Number(that.myLevelData.comment_text_weidou)+Number(that.myLevelData.comment_img_weidou);
          that.msg.pjjl = '评价商品，可得'+ that.myLevelData.comment_text_weidou +'味豆，评价+晒图可得'+ _weidou +'味豆';
        })
        memberBanner().then(function(res){
          if(res.data.result_code == 0){
            var _list = res.data.result_data;
            for(var i=0 ; i<_list.length ; i++){
              if(_list[i].lock_type == 0){
                //已解锁
                that.memberBanner.push(_list[i])
              }else if(_list[i].lock_type == 1){
                //未解锁
                that.memberBannerDis.push(_list[i])
              }
            }
          }
        })
      },
      checkImg:function(){
        var _level = this.userLevel;
        var _nextLevel = Number(_level) + 1;
        this.nowImg = 'http://img2.vipbcw.com/wap/v_v'+ _level +'_now.png';
        this.prevImg = 'http://img2.vipbcw.com/wap/v_v0_b.png';
        this.nextImg = 'http://img2.vipbcw.com/wap/v_v'+ _nextLevel +'_a.png';
      },
      checkLength:function(){
        var _level = Number(this.userLevel);
        var _levelArr = this.levelDataArr;
        var _price = Number(this.userPrice);
        if(_level == '-1'){
          this.levelValue = 1;
          this.levelLength = 0;
        }else if(_level == 4){
          this.levelLength = 100;
        }else{
          this.levelValue = Number(_levelArr[_level + 1].level_value)-1;
          this.levelLength = (_price / this.levelValue * 100).toFixed(1);
        }
      },
      checkIcon:function(list){
        var _arr = list;
        var _level = this.userLevel;
        for(var i=0 ; i<_arr.length ; i++){
          if(i < _level){
            _arr[i].icon = 'http://img2.vipbcw.com/wap/v_icon'+ i +'_a.png';
          }else if(i == _level){
            _arr[i].icon = 'http://img2.vipbcw.com/wap/v_icon'+ i +'_now.png';
          }else{
            _arr[i].icon = 'http://img2.vipbcw.com/wap/v_icon'+ i +'.png';
          }
          _arr[i].level_value = _arr[i].level_value / 100;
        }
        this.levelDataArr = _arr;
      },
      showTip:function(type){
        if(!this.tipObj.show && !this.giftTipShow){
          var that =this;
          var _level = this.userLevel;
          var _msg;
          if(type == 'gwzwd'){
            if(_level == 0){
              _msg = this.msg[type].v0
            }else if(_level == 4){
              _msg = this.msg[type].v4
            }else{
              _msg = this.msg[type].v1
            }
          }else{
            _msg = this.msg[type]
          }
          if(type == 'gwzwd'){
            _hmt.push(['_trackEvent', '购物赚味豆', this.vs ,this.terminal ,'']);
          }else if(type == 'pjjl'){
            _hmt.push(['_trackEvent', '评价奖励', this.vs ,this.terminal ,'']);
          }else if(type == 'hyr'){
            _hmt.push(['_trackEvent', '会员日', this.vs ,this.terminal ,'']);
          }else if(type == 'xpsc'){
            _hmt.push(['_trackEvent', '新品试吃', this.vs ,this.terminal ,'']);
          }else if(type == 'zskf'){
            _hmt.push(['_trackEvent', '专属客服', this.vs ,this.terminal ,'']);
          }else if(type == 'jstk'){
            _hmt.push(['_trackEvent', '极速退款', this.vs ,this.terminal ,'']);
          }else if(type == 'hyj'){
            _hmt.push(['_trackEvent', '会员价', this.vs ,this.terminal ,'']);
          }
          this.tipObj.msg = _msg;
          this.tipObj.show = true;
        }
      },
      showDisTip:function(type){
        if(!this.tipObj.show && !this.giftTipShow){
          var that =this;
          var _level = this.userLevel;
          var _msg = this.disMsg[type];
          this.tipObj.msg = _msg;
          this.tipObj.show = true;
        }

        if(type == 'sjlb'){
            _hmt.push(['_trackEvent', '升级礼包', this.vs ,this.terminal ,'']);
          }else if(type == 'byq'){
            _hmt.push(['_trackEvent', '包邮券', this.vs ,this.terminal ,'']);
          }else if(type == 'srdl'){
            _hmt.push(['_trackEvent', '生日大礼', this.vs ,this.terminal ,'']);
          }else if(type == 'xpsc'){
            _hmt.push(['_trackEvent', '新品试吃', this.vs ,this.terminal ,'']);
          }else if(type == 'zskf'){
            _hmt.push(['_trackEvent', '专属客服', this.vs ,this.terminal ,'']);
          }else if(type == 'jstk'){
            _hmt.push(['_trackEvent', '极速退款', this.vs ,this.terminal ,'']);
          }else if(type == 'hyj'){
            _hmt.push(['_trackEvent', '会员价', this.vs ,this.terminal ,'']);
          }
      },
      closeTip:function(){
        this.tipObj.show = false;
      },
      showGiftTip:function(type){
        if(!this.tipObj.show && !this.giftTipShow){
          if(type == 'newGift'){
            this.giftTipObj = this.newGiftObj;
            this.giftTipShow = true;

          }else if(type == 'birthGift'){
            var that = this;
            if( that.birthGiftObj.gift != null && that.birthGiftObj.gift.length == 0){
//              var _data = Tools.encrypt({"level":that.userLevel,"gift_type":2});
              getGiftDetail(that.userLevel,2).then(function(res){
                that.birthGiftObj.gift = res.data.result_data;
                if(that.userBrithdayGift == 2){
                  that.birthGiftObj.btnShow = true;
                  that.birthGiftObj.title = '亲爱的V'+ that.userLevel +'会员,惊喜生日礼包:'
                }else if(that.userBrithdayGift == 0){
                  that.birthGiftObj.btnShow = false;
                  that.birthGiftObj.title = '恭喜您成为V'+ that.userLevel +'会员,生日礼包:'
                }else if(that.userBrithdayGift == 1){
                  console.log(that.userBrithdayGift);
                  that.birthGiftObj.btnShow = false;
                  that.birthGiftObj.title = '您已领取过V'+ that.userLevel +'生日礼包'
                }else if(that.userBrithdayGift == 3){
                  that.birthGiftObj.btnShow = false;
                  that.birthGiftObj.title = '由于未及时领取，生日礼包已过期:'
                }
                that.giftTipObj = that.birthGiftObj;
                that.giftTipShow = true;
              })
            }else{
              that.giftTipObj = that.birthGiftObj;
              if(that.userBrithdayGift == 2){
                that.giftTipObj.btnShow = true;
                that.birthGiftObj.title = '亲爱的V'+ that.userLevel +'会员,惊喜生日礼包:'
              }else if(that.userBrithdayGift == 0){
                that.birthGiftObj.btnShow = false;
                that.birthGiftObj.title = '恭喜您成为V'+ that.userLevel +'会员,生日礼包:'
              }else if(that.userBrithdayGift == 1){
                console.log(that.userBrithdayGift);
                that.birthGiftObj.btnShow = false;
                that.birthGiftObj.title = '您已领取过V'+ that.userLevel +'生日礼包'
              }else if(that.userBrithdayGift == 3){
                that.birthGiftObj.btnShow = false;
                that.birthGiftObj.title = '由于未及时领取，生日礼包已过期:'
              }
              that.giftTipShow = true;
            }
          }else if(type == 'upGift'){
            var that = this;
            if( that.upGiftObj.gift != null && that.upGiftObj.gift.length == 0){
//              var _data = Tools.encrypt({"level":that.userLevel,"gift_type":1});
              getGiftDetail(that.userLevel,1).then(function(res){
                that.upGiftObj.gift = res.data.result_data;
                if(that.userGradeGift == 0){
                  that.upGiftObj.btnShow = true;
                  that.upGiftObj.title = '恭喜升级为V'+ that.userLevel +'会员,升级大礼包:'
                }else{
                  that.upGiftObj.btnShow = false;
                  that.upGiftObj.title = '您已领取过V'+ that.userLevel +'升级礼包'
                }
                that.giftTipObj = that.upGiftObj;
                that.giftTipShow = true;
              })
            }else{
              that.giftTipObj = that.upGiftObj;
              if(that.userGradeGift == 0){
                that.giftTipObj.btnShow = true;
                that.upGiftObj.title = '恭喜升级为V'+ that.userLevel +'会员,升级大礼包:'
              }else{
                that.giftTipObj.btnShow = false;
                that.upGiftObj.title = '您已领取过V'+ that.userLevel +'升级礼包'
              }
              that.giftTipShow = true;
            }
          }
        }
        
        if(type == 'upGift'){
            _hmt.push(['_trackEvent', '升级礼包', this.vs ,this.terminal ,'']);
          }else if(type == 'birthGift'){
            _hmt.push(['_trackEvent', '生日大礼', this.vs ,this.terminal ,'']);
          }

      },
      closeGiftTip:function(){
        this.giftTipShow = false;
      },
      getGift:function(type){
        var that = this;
        getUserGift(type).then(function(res){
          if(res.data.result_code == '10004'){
            that.$refs.alertDialog.alert('礼包领取成功，优惠券已放入您的账户！');
            that.giftTipShow = false;
            if(type == 1){
              that.userGradeGift = 1;
            }else{
              that.userBrithdayGift = 1;
              if(that.bcwMall == 1){
                var _shareInfo = { 'state' : 1 };
                cmbMerchantBridge.initSignNet( "jsDrawGift" , _shareInfo );
              }
            }
          }else{
            that.$refs.alertDialog.alert(res.data.result_info);
          }
        })
      },
      setBridge(){
        var that = this;
        this.setupWebViewJavascriptBridge = jsBridge().jsBridgeFun;
        window.cmbMerchantBridge = jsBridge().merchantBridge;
        this.setupWebViewJavascriptBridge(function(bridge){

        })
      },
      showMoreNav(){
        //查看更多特权
        this.navMore = this.navMore == 1 ? 0 : 1;
      },
      getBYcoup(){
        var that = this;
        var  testId = [0,1702,1703,1704,1705],
          prevId =  [0,1065,1066,1067,1068],
          onlineId =  [0,1742,1743,1744,1745];
        var id = testId[this.userLevel];
        var _location = window.location.href;
        if(_location.indexOf('prem.vipbcw.com') > 0){
          id = prevId[this.userLevel];
        }else if(_location.indexOf('m.vipbcw.com') > 0){
          id = onlineId[this.userLevel]
        }
        getCoupon(id).then(res => {
          if(res.data.result_code == 0){
            var _msg = '恭喜你获得1张包邮券，请前往你的优惠券账户查收！';
            that.tipObj.msg = _msg;
            that.tipObj.show = true;
          }else if(res.data.result_code == '6012'){
            var _msg = '您已经领取过包邮券，请到优惠券中查看';
            that.tipObj.msg = _msg;
            that.tipObj.show = true;
          }else{
            that.$refs.alertDialog.alert(res.data.result_info);
          }
        })

        _hmt.push(['_trackEvent', '包邮券', this.vs ,this.terminal ,'']);
      },
      nGift(){
        _hmt.push(['_trackEvent', '新人有礼', this.vs ,this.terminal ,'']);
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .member-top .rule-box{position: absolute;width:35px;height:35px;top:8px;right:3%;padding:8px;}
  .member-box .member-top{position:relative;background:#fff;}
  .member-box .ab-box{width:90%;height:60px;position:absolute;top:40%;left:50%;text-align:center; -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);}
  .member-box .ab-box .vip-desc{color:#8f5bff;}
  .member-box .vip-img{width:35%;margin:4% auto 0;}
  .member-box .vip-line-box{margin:5% 0 2%;position:relative;}
  .member-box .vip-line-box li{width:20%;text-align:center;float:left;}
  .member-box .vip-line-box li a{display:block;}
  .member-box .vip-line-box li img{width:30%;}
  .member-box .vip-line-box li p{color:#ffe6cd;height:2rem;line-height:2rem;margin-top:10px;}
  .member-box .vip-line-box li.on p{color:#ffff68;}
  .member-box .v-line{width:100%;height:5px;border-radius: 4px;background:#4b20a8;text-align:left;}
  .member-box .v-line p{height:100%;border-radius:4px;overflow:hidden;}
  .member-box .v-line p img{height:100%;vertical-align:top;animation:line 2s infinite; -webkit-animation:line 2s;}
  .member-box .member-nav{margin-bottom:10px;background:#fff;}
  .member-box .member-nav ul{height:170px;overflow:hidden;-webkit-transition:height 0.6s ease;
    -moz-transition:height 0.6s ease;
    -o-transition:height 0.6s ease;
    transition:height 0.6s ease;}
  .member-box .member-nav ul.on{height:255px;}
  .member-box .member-nav li{float:left;width:25%;padding:15px 0;text-align:center;}
  .member-box .member-nav li p{line-height: 20px;}
  .member-box .member-nav li .img{width:27px;margin:0 auto 8px;position:relative;}
  .member-box .member-nav li .img i{width:6px;height:6px;border-radius:3px;background:#ff3c24;position:absolute;top:0;right:0;}
  .member-box .member-img{margin-bottom:10px;}
  .member-box .member-goods{background:#fff;padding:5px 3%;}
  .member-box .member-goods li{margin:20px 0;}
  .member-box .member-goods li .v-goods-img{width:45%;float:left;margin-right:3%}
  .member-box .member-goods .v-goods-right{float:right;width:52%;}
  .member-box .v-goods-right .p1{font-size:1.8rem;font-weight:bold;line-height:2.4rem;padding-right:16px;display:inline-block;max-width:95%;position:relative;}
  .member-box .v-goods-right .p1 img{width:15px;height:auto;vertical-align:initial;position:absolute;top:30%;right:0;}
  .member-box .v-goods-right .p2{font-size:1.5rem;}
  .member-box .v-goods-right .p3{font-size:1.8rem;color:#ff3c24;line-height:2.4rem;}
  .member-box .v-goods-right .p3:before{content:'¥';font-size:1.2rem;padding-right:3px;}
  .member-box .v-goods-right .p-price{width:80%;height:2rem;line-height:2rem;background:url('http://img2.vipbcw.com/wap/vip_price_bg.png');background-size:100% 100%;}
  .member-box .v-goods-right .p-price.biggest{width:80%;background:url('http://img2.vipbcw.com/wap/vip_price_bg1.png') no-repeat;background-size:50% 100%;}
  .member-box .v-goods-right .p-price span{display:inline-block;width:50%;color:#fff;text-align:center;float:left;}
  .member-box .v-goods-right .p-price span img{width:20%;vertical-align:text-top;margin-right:2px;}
  @keyframes line{
    from {width: 0;}
    to {width: 100%;}
  }

  @-moz-keyframes line {
    from {width: 0;}
    to {width: 100%;}
  }

  @-webkit-keyframes line{
    from {width: 0;}
    to {width: 100%;}
  }

  @-o-keyframes line {
    from {width: 0;}
    to {width: 100%;}
  }
  .member-box .member-tip-box{width:66%;background:#fff;border:solid 1px #ffbe41;border-radius:15px;position:fixed;top:50%;left:50%;-webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);z-index:999;text-align:center;padding:3rem 5%;display:none;}
  .member-box .member-tip-box.show{display:block;}
  .member-box .member-tip-box .tit-img{width:26px;position:absolute;top:-17px;left:50%;margin-left:-13px;}
  .member-box .member-tip-box .close{width:5%;position:absolute;top:10px;right:10px;}
  .member-box .member-tip-box .tip-content{line-height:2rem;padding:1rem 0;color:#333;}
  .member-box .member-tip-box .tip-content-tit{font-size:1.3rem;font-weight:bold;line-height:2rem;}
  .member-box .member-tip-box .tip-content-desc{line-height:2rem;margin-top:1rem;}
  .member-box .member-tip-box .tip-content-btn{width:40%;height:30px;line-height:30px;background:#ffbc28;color:#FFF;border-radius:15px;margin:10px auto 0;display:block;}
  .member-box .member-tip-box li{font-size:1.3rem;line-height:1.6rem;}

  .member-top .ab-box{display: flex;height:45px;}
  .member-top .img-box{width:45px;height:45px;border-radius: 50%;overflow:hidden;margin-right:3%;}
  .member-top .center-box{flex:1;}
  .member-top .center-box p{text-align:left;color:#fff;line-height: 30px;font-size:1.2rem;}
  .member-top .center-box p span{float:right;font-size:1.2rem;}
  .member-top .level-box{width:35px;padding-top:8px;margin-left:3%}
  .banner-ul li{margin-bottom:10px;}
</style>



// WEBPACK FOOTER //
// index.vue?390888ad