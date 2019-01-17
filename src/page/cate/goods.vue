<template>
    <div class="con container">

        <div class="index-flash">
            <div class="backBox" v-on:click="routeBack"><i class="iconfont icon-iconback"></i></div>
            <div class="go-pic" v-on:click="go">
                <p><img src="http://img2.vipbcw.com/wap/integral-mall/Group 11.png" alt=""></p>
                <img src="http://img2.vipbcw.com/wap/integral-mall/down.gif" alt="">
            </div>
            <div class="sliderBox">
                <div class="">
                    <swiper :options="swiperOption" class="swiper-box">
                        <swiper-slide v-for="imgHref in content.goods_imgs" :key="imgHref" class="swiper-item"><img v-lazy="imgHref+'?imageView2/2/w/640'"></swiper-slide>
                        <div class="swiper-pagination" slot="pagination"></div>
                    </swiper>
                </div>
            </div>
        </div>

        <div class="show-price">
            <span class="new-price"><i style="float:left;font-size: 2rem">¥</i>

                <b style="font-size:2rem;float:left" :key="content.shop_price">{{shopPrice.split(/\./)[0]}}</b>
                <s style="font-size:1.4rem;text-decoration:none;">{{shopPrice.indexOf('.') == '-1'?'':'.'+shopPrice.split(/\./)[1]}}</s>
            </span>
            <del :key="content.market_price">{{content.market_price}}</del>
            <span class="sec-kill bottom-color" v-show="content.goods_tags" v-for="tags in content.goods_tags" :key="tags">{{tags}}</span>

            

            <span class="count-down fr miao" v-show="content.promote_type == '限量秒杀'">距离秒杀结束<i class="bstyle">{{changeHour}}</i>:<i class="bstyle">{{changeMin}}</i>:<i class="bstyle">{{changeSec}}</i></span>

            <span class="count-down fr" v-show="content.promote_type == '促销活动'">剩<i class="d">{{day}}</i>天<i class="h">{{changeHour}}</i>:<i class="m">{{changeMin}}</i>:<i class="s">{{changeSec}}</i></span>

        </div>

        <div class="show-titles">
            <h1 class="textHidden">{{content.goods_name}}</h1>
            <p>{{content.goods_subtitle}}</p>
        </div>
        <div class="show-carry">
            <a class="show-carry-top" :href="content.activityUrl ? content.activityUrl : 'javascript:;'">
                <em>{{content.activityIco}}</em>
                    {{content.goods_sale_plan}}
                <i v-show="content.activityUrl" class="iconfont icon-icongo fr"></i>
            </a>
            <ul>
                <li v-on:click="changeBottomStatus"><em class="top-middle"></em>购物赚味豆</li>
                <li v-on:click="changeBottomStatus"><em class="top-middle"></em>闪电发货</li>
                <li v-on:click="changeBottomStatus"><em class="top-middle"></em>正品保障</li>
                <li v-on:click="changeBottomStatus"><em class="top-middle"></em>优质服务</li>
            </ul>
        </div>

        <div class="classify-list-content show-list-content clear">
            <h1>搭配推荐</h1>
            <div class="swiper-container swiper2">
                <swiper :options="swiperTab" class="swiper-box">
                    <swiper-slide class="swiper-item" v-for="recommendGoods in content.recommend_goods" :key="recommendGoods">
                        <router-link v-bind:to="{path:'/data-list/detail-goods',query: {id: recommendGoods.goods_id}}">
                            <span><img v-lazy="recommendGoods.goods_img+'?imageView2/1/w/207/h/207'"></span>
                            <h4>{{recommendGoods.goods_title}}</h4>
                            <p>¥{{recommendGoods.shop_price}}<i class="buy-btn" v-on:click.stop="addCart(recommendGoods.goods_id)"></i></p>
                        </router-link>
                    </swiper-slide>

                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
                <div class="swiper-pagination"></div>
            </div>
        </div>

        <div class="show-pjBox" v-if="Number(commentsCount)">
            <p id="J_linkPj">
                <router-link v-bind:to="{path: '/comments',query: {id: this.$route.query.id}}">
                    小吃货们说({{commentsCount}})
                    <span class="fr pr check-more" v-if="commentsCount>2">查看更多<i class="iconfont icon-icongo fr"></i></span>
                </router-link>
            </p>
            <div class="show-pj">
                <ul>
                    <li v-for="(comments,index) in commentsList" :key="index" v-show="index<2">
                        <div class="tab-name clearfix">
                            <!-- http://img2.vipbcw.com/wap/none_head.png -->
                            <img v-if="comments.head_img" v-bind:src="comments.head_img+'?imageView2/2/w/30'"/>
                            <img v-else src="http://img2.vipbcw.com/wap/none_head.png?imageView2/2/w/30"/>
                            <p>{{comments.username}}</p>
                            <p class="tab-time">{{comments.join_time}}</p>
                        </div>
                        <p class="tab-page">{{comments.content}}</p>
                        <span class="reply" :style="{'display':comments.admin_reply == '' && 'none'}">{{comments.admin_reply}}</span>
                    </li>

                </ul>
            </div>
        </div>

        <div class="show-tab" id="pj_link">
            <!-- 商品规格模块 -->
            <div class="tab" id="J_detalBox">

                <div class="detail-box">

                    <div class="detail-line" v-html="content.goods_info">

                    </div>

                </div>

            </div>

        </div>

        <div class="text-dialog" v-bind:class="{'none':!isBottomShow}" v-on:click="isBottomShow = false"></div>
        <div class="text-dialog-window" v-bind:class="{'bottom-show':isBottomShow}">
            <em class="close" v-on:click="isBottomShow = false"></em>
            <h5>服务说明</h5>
            <ul>
                <li class="list-1">
                    <h6>购物赚味豆</h6>
                    <p>下单即享实付金额等值味豆，首次下单享双倍味豆</p>
                </li>
                <li class="list-2">
                    <h6>快速发货</h6>
                    <p>48小时内出库，全国9仓发货</p>
                </li>
                <li class="list-3">
                    <h6>正品保障</h6>
                    <p>品牌直销，品质保证</p>
                </li>
                <li class="list-4">
                    <h6>优质服务</h6>
                    <p>贴心服务，放心购物</p>
                </li>
            </ul>
        </div>
        <div class="footers">
            <ul>
                <li class="count help" @click="serviceFun">
                    <!--http://img2.vipbcw.com/wap/integral-mall/Group 55@3x.png-->
                    <i class="iconfont icon-iconkf"></i>
                    <p>客服</p>
                </li>
                <li class="count collection" v-on:click="changeCollect">

                        <i class="iconfont icon-iconcollected" v-show="isCollect"></i>

                        <i class="iconfont icon-iconcollect" v-show="!isCollect"></i>

                    <p>收藏</p>
                </li>
                <li class="count">
                    <router-link v-if="isBindPhone" to="/user-info/bind-phone">
                        <i class="iconfont icon-iconcart"></i>
                        <p>购物车</p>
                    </router-link>
                    <router-link v-else v-bind:to="{path: '/user-event/list-cart'}">
                      <i class="iconfont icon-iconcart"></i>
                      <em class="cart-number cart-num" v-if="totalGoodsCount!=0">{{totalGoodsCount.toString().length>2?'99+':totalGoodsCount}}</em>
                      <p>购物车</p>
                    </router-link>
                </li>
                <li class="add-count">

                    <span class="J_buyBtn" :data-goods-id="content.goods_id" data-sku-id="" v-on:click="addCart(goodsId)">加入购物车</span>

                    <span style="background:#eee;color:#aaa;">该商品已下架</span>

                </li>
            </ul>
            <vAlert ref='alertDialog'></vAlert>
            <input type="hidden" class="goods_id" value="">
            <input type="hidden" class="skuid" value="">
            <input type="hidden" class="page" value="1">
            <input type="hidden" class="act_id" value="">
        </div>
    </div>
</template>


<!--<script src="https://qiyukf.com/script/260f5087e5cd788f825aa03596ae6733.js&hidden=1" charset="UTF-8"></script>-->
<script>
    import {getGoodsDetails,getGoodsAddCart,getGoodsAddCollect,getGoodsDelCollect,getGoodsCollectList,getConfig,userQiyuInfo} from 'service/getData'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import vAlert from 'components/alertDialog'
    import {wxShare,addScript,setSessionStore} from 'assets/js/mUtils'
    export default {
        data(){
            return {
                goodsId: null,//当前详情页商品的id
                content: '',//商品的详细信息
                commentsList:'',//评论列表
                isBottomShow:false,//服务说明弹窗显示
                isDownCountShow:false,//倒计时显示
                isCollect:false,//当前商品是否被收藏
                nowTime:0,//当前的服务器时间
                day:0,//倒计时天
                hour:0,//倒计时时
                min:0,//倒计时分
                sec:0,//倒计时秒
                totalGoodsCount:0,//购物车商品数量
                isBindPhone:0,
                swiperOption: {
                  pagination: '.swiper-pagination',
                  slidesPerView: 1,
                  autoplay: 5000,
                  paginationClickable: true,
                  spaceBetween: 30,
                  loop: true,
                  initialSlide :1
                },
                swiperTab: {
                    slidesPerView:3,
                    paginationClickable: true,
                    spaceBetween: 5,
                    slidesPerGroup: 3,
                    slidesOffsetAfter: 10
                },
                shopPrice:'',
                commentsCount:0,//商品评论条数
                qyLogin:0,//0未登录，1登录，2绑定
            }
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
          },
            getDetails(){//获取详情页的商品数据
                getGoodsDetails(this.goodsId).then((response) => {
                    if(response.data.result_data){
                        this.content = response.data.result_data
                        this.commentsList = response.data.result_data.comments.comments_list
                        this.nowTime = response.data.result_data.now_time
                        this.isCollect = response.data.result_data.collection
                        this.shopPrice = response.data.result_data.shop_price
                        this.commentsCount = response.data.result_data.comments.comments_count
                    }
                }).then(() => {
                  var ua = window.navigator.userAgent.toLowerCase();
                  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
//                    var wx = require('weixin-js-sdk');
                    var _url = window.location.href;
                    getConfig(_url).then(res => {
                      wx.config(res.data.result_data);
                    }).then(() => {
                      wxShare(wx,this.content.goods_name,this.content.goods_subtitle,_url,this.content.goods_imgs[0])
                    })
                  }
              })
            },
            routeBack(){//回到上一页
                //this.$router.go(-1)
              window.history.go(-1);
            },
            changeBottomStatus(){
                this.isBottomShow = this.isBottomShow ? false : true
            },
            getTime(){
                this.isDownCountShow = this.content.now_time > this.content.promote_start_date && this.content.now_time < this.content.promote_end_date ? true : false
                let lessTime = this.content.promote_end_date - this.nowTime
                this.day = Math.floor((lessTime / 3600) / 24)
                this.hour = Math.floor((lessTime / 3600) % 24)
                this.min =  Math.floor((lessTime / 60) % 60)
                this.sec =  Math.floor(lessTime % 60)
                lessTime>0 && this.nowTime++
            },
            addCart(id,e){
              window.event? window.event.returnValue = false : e.preventDefault();
                getGoodsAddCart(id).then((response) => {//加入购物车
                  if(response.data.result_code){
                    if(response.data.result_code == 0){
                      this.$refs.alertDialog.alert('加入购物车成功')
                      this.totalGoodsCount++
                    }else{
                      this.$refs.alertDialog.alert(response.data.result_info)
                    }
                  }
                })
            },
            getCarNum(){
                getGoodsCollectList().then((response) => {
                  if(response.data.result_code == 0){
                    this.totalGoodsCount = response.data.result_data.total_goods_count
                  }else if(response.data.result_code == '1003'){
                    if(typeof(response.data.result_data.openid) != 'undefined') {
                      setSessionStore('bindInfo',response.data.result_data);
                      // 跳临时用户绑定手机号页面
                      this.isBindPhone = 1;
                    }
                  }
                })
            },
            delCollect(goodsId){
                getGoodsDelCollect(goodsId).then((response) => {
                    if(response.data.result_code == 0){
                        this.$refs.alertDialog.alert('取消收藏成功')
                    }else{
                        this.$refs.alertDialog.alert(response.data.result_info)
                    }
                })
            },
            getCollect(goodsId){
                getGoodsAddCollect(goodsId).then((response) => {
                    if(response.data.result_code == 0){
                        this.$refs.alertDialog.alert('收藏成功')
                    }else{
                        this.$refs.alertDialog.alert(response.data.result_info)
                    }

                })
            },
            changeCollect(){
                if(this.isCollect){
                    this.delCollect(this.goodsId)
                }else{
                    this.getCollect(this.goodsId)
                }
                this.isCollect = !this.isCollect
            },
            go(){
                let showTab = document.getElementsByClassName('show-tab')
                document.body.scrollTop = showTab[0].offsetTop
            }
            // showAlert() {
            //   this.$refs.alertDialog.alert('加入购物车成功');
            // },
        },
        components:{
            swiper,
            swiperSlide,
            vAlert,
        },
        beforeMount(){
            this.goodsId = this.$route.query.id
            this.getCarNum()
        },
        computed:{
            changeHour(){
                return (this.hour+'').length>1 ? this.hour : '0'+this.hour
            },
            changeMin(){
                return (this.min+'').length>1 ? this.min : '0'+this.min
            },
            changeSec(){
                return (this.sec+'').length>1 ? this.sec : '0'+this.sec
            }
        },
      created () {
        this.goodsId = this.$route.query.id
        this.getDetails()
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
                  {"index": 6, "key": "fromWhere", "label": "访问来源", "value": "商品详情-在线客服"}
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
        watch:{
            '$route'(to,form){
                this.goodsId = this.$route.query.id
                this.getDetails()
                document.body.scrollTop = 0
            },
            'nowTime'(){
                setTimeout(() => {
                    this.getTime()
                },1000)
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*show*/
    .container {margin-top: 0;padding-bottom: 55px;}
    .show-head { background: rgba(255,255,255,0);}
    .show-price,.show-titles,.show-carry{ padding: 0 0 0 5px; background: #fff;}
    .show-price { position: relative; height: 45px; line-height: 45px;}
    .new-price { font-size: 2rem; color: #FF4348;}
    /*.new-price:before { content: '¥';float: left;}*/
    .show-price del { margin-left: 6px; font-size: 1.2rem; color: #aaa;}
    .show-price del:before { content: '¥';}
    .show-price img{width:12%;margin-left:3px;}
    .show-price  .count-down { right: 10px;line-height: 55px;}
    .show-titles { padding: 0 10px 10px;}
    .show-titles h1 { height: 35px; line-height: 35px; font-size: 1.5rem; color: #3C4347;font-weight: bold}
    .show-titles p {font-size: 1.3rem; color: #8a8f91;}
    .show-titles span { display: block; margin-top: 30px; color: #666;}
    .show-carry,.show-pjBox { margin-top: 10px;}
    .show-carry-top { height: 40px; line-height: 40px;font-size:1.2rem;}
    .show-carry-top em { display: inline-block; height: 18px; line-height: 16px; padding: 0 8px; margin-right: 10px;border:1px solid #ff4348;color:#ff4348;border-radius: 2px; font-size: 1rem;}
    .show-carry-top i {right:2%;background-size: 60%;}
    .show-carry ul { height: 40px; line-height: 40px; text-align: center; overflow: hidden;border-top: solid 1px rgb(245,245,245)}
    .show-carry ul li { float: left; width: 25%; position: relative;font-size: 1rem;}
    .show-carry ul li em { display: inline-block; width: 4px; height: 4px; background: #ffda44; border-radius: 50%;position: relative;margin-right:5px;}
    .show-pjBox>p{padding:0 10px;height:40px;line-height: 40px;background:#fff;border-bottom: 1px solid #f5f5f5;}
    .show-pjBox>p .fr{font-size:1rem; }
    .show-pjBox>p a{display: block;font-size:1.3rem;}
    .check-more {padding-right: 5%; color: #c0c0c0;}
    .icon-icongo {display: inline-block;content: "";width: 12px;height: 22px;background: url(../../assets/images/ic_arrow.png) no-repeat center;background-size: 50%;position: absolute;top: 50%;right: -2%;-webkit-transform:translateY(-50%);transform:translateY(-50%);}
    .show-pj { background: #fff; padding:10px;}
    .show-pj h2 { height: 40px; line-height: 40px; font-size: 1.4rem; border-bottom: 1px solid #f5f5f5; color: #333;}
    .show-pj ul li { padding: 8px 0; border-bottom: 1px solid #f5f5f5;}
    .show-pj ul li:last-child {border: 0}
    .show-pj .pj-more{text-align: center;padding:10px 0 0;}
    .show-tab { margin-top: 10px;}
    .show-list-content { margin-top: 10px;background: #fff;}
    .show-list-content h1 { height: 40px; line-height: 40px; font-size: 1.3rem; color: #333; border-bottom: 1px solid #f5f5f5; background: #fff;padding: 0 10px;}
    .show-list-content h1 i { float: left;color:#ff4f39;margin:0 10px;}
    .show-list-content ul { border-bottom: 1px solid #eee;background: #fff;}
    .show-list-content ul .bottom-line { border-bottom: 1px solid #eee;}
    .show-list-content.classify-list-content .swiper-item{margin:0;}
    .show-list-content .swiper-container-horizontal>.swiper-pagination-bullets{bottom:0;}
    .show-tab ul { overflow: hidden; background: #fff;}
    .show-tab>ul>li { float: left; width: 50%; height: 40px; line-height: 40px; text-align: center;}
    .show-tab ul li em { display: inline-block; width: 60%; height: 40px; margin: 0 auto; font-size: 1.4rem; color: #333;}
    .line { border-bottom: 2px solid #ff4f39;}
    .tab-name img{float:left; width:30px;height:30px;border-radius: 15px;overflow: hidden;margin-right:5px;}
    .tab-name p { font-size: 1.4rem;width:60%;overflow:hidden;white-space: nowrap;color: #4a4a4a;}
    .tab-name .tab-time {color: #80bbfd;padding-top: 1%;font-size: 1.2rem}
    .tab-page {font-size: 1.4rem;padding: 5px 0 5px 35px;color: #666;}
    .classify-list-content .swiper-item h4 { width: 95%; line-height: 18px; margin: 0 auto; padding-top: 6px;height:42px;overflow: hidden;}
    .classify-list-content .swiper-item .buy-btn {width:20px;height:20px;bottom:0;}
    .footers { position: fixed; bottom: 0; left: 0; width: 100%; height: 55px; z-index: 98; background: #fff; border-top: 1px solid #f5f5f5;}
    .footers ul .count { float: left; width: 17%; text-align: center; margin-top: 6px; position: relative;}
    .footers ul .count p { color: #999}
    .footers ul .count .kf { position: absolute; left: 60%; top: 5%; display: block; width: 6px; height: 6px; border-radius: 50%; background: #ff4348;}
    .footers ul .count .cart-number { position: absolute; left: 52%; top: -5%; display: block; min-width: 15px; height: 15px; line-height: 15px; border-radius: 50%; background: #ff4348; color: #fff; font-size: 1rem;}
    .count .iconfont { font-size: 1rem;}
    .add-count { float: left; width: 38%; margin-left: 5px;}
    .add-count span { display: block; height: 54px; line-height: 54px; width: 100%; text-align: center; font-size: 1.4rem; background: #ff4f39; color: #fff;}
    /*.dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9; text-align: center; display: none;}*/
    .dialog p { width: 100%; color: #fff;}
    /*.dialog em { display: block; width: 30px; height: 30px; background: url(http://img2.vipbcw.com/wap/icon_collected.svg) no-repeat; background-size: 100%; top: 20%;}*/
    .dialog.collect-sure,.dialog.collect-cancel {position: fixed;  width: 100px; height: 80px; background: rgba(0,0,0,0.8); border-radius: 5px;display: none;text-align: center;padding:10px 0;line-height: 25px;z-index: 99;}
    .icon-iconcollect{display: inline-block;content: "";width: 24px;height: 23px;background-image: url(../../assets/images/ic_star.png);background-size: 100%;}
    .icon-iconcollected{display: inline-block;content: "";width: 24px;height: 23px;background-image: url(../../assets/images/ic_red_star.png);background-size: 100%;}
    .icon-iconkf{display: inline-block;content: "";width: 24px;height: 23px;background-image: url(../../assets/images/ic_kf.png);background-size: 100%;}
    .dialog.collect-cancel { width: 100px; height: 80px; background: rgba(0,0,0,0.8); border-radius: 5px; display: none;}
    .text-dialog { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99; background: rgba(0,0,0,0.7);}
    .text-dialog-window { position: fixed; bottom: -100%; left: 0; width: 100%; background: #fff; padding-bottom: 15px; z-index: 100; -webkit-transition: bottom ease-out 200ms; -moz-transition: bottom ease-out 200ms; -o-transition: bottom ease-out 200ms; transition: bottom ease-out 200ms;}
    .text-dialog-window h5 { height: 60px; line-height: 60px; font-size: 1.6rem; color: #111; text-align: center;}
    .text-dialog-window .close { position: absolute; right: 20px; top: 20px; width: 20px; height: 20px; background: url(http://img2.vipbcw.com/wap/icCloseDetails.png) no-repeat center; background-size: 100%;}
    .text-dialog-window ul { padding: 0 10px;}
    .text-dialog-window ul li { padding: 10px 0 10px 30px;}
    .text-dialog-window ul .list-1 { background: url(http://img2.vipbcw.com/wap/fw_08.png) no-repeat left 8px; background-size: 30px;}
    .text-dialog-window ul .list-2 { background: url(http://img2.vipbcw.com/wap/fw_07.png) no-repeat left 8px; background-size: 30px;}
    .text-dialog-window ul .list-3 { background: url(http://img2.vipbcw.com/wap/fw_10.png) no-repeat left 8px; background-size: 30px;}
    .text-dialog-window ul .list-4 { background: url(http://img2.vipbcw.com/wap/fw_09.png) no-repeat left 8px; background-size: 30px;}
    .text-dialog-window ul li h6 { height: 26px; line-height: 26px; font-size: 1.4rem; color: #333;}
    .text-dialog-window ul li p { color: #999;}
    .move { -webkit-transition: bottom ease-out 200ms; -moz-transition: bottom ease-out 200ms; -o-transition: bottom ease-out 200ms; transition: bottom ease-out 200ms; bottom: 0;}
    .icon-iconcollected {color: #ff4348;}
    .header .left-box {}

    .show-carry ul li em{background:url("http://img2.vipbcw.com/wap/r_icon.png") no-repeat;width:15px;height:15px;background-size:contain;margin-bottom:-10px;}
    .show-list-content.classify-list-content .comment ul{padding:0 3%;background-color: #fff;overflow:hidden;}
    .show-list-content.classify-list-content .comment li{float:none;width:100%;padding-bottom:10px;overflow:hidden;}
    .show-list-content.classify-list-content .comment .per-img{float:left;width:12%;text-align:right;margin-right:5px;}
    .show-list-content.classify-list-content .comment .per-info{float:left;width:86%;}
    .show-list-content.classify-list-content .comment .per-content{margin-top:5px;font-size:1.4rem;color:#3c4347;}
    .show-list-content.classify-list-content .comment .per-time s{text-decoration: none;}
    .show-tab  .detail-title{font-size:1.4rem;color:#333;background-color: #fff;padding:1% 3% 0;}
    .show-tab .detail-box{background-color: #fff;}
    .show-tab .detail-box .detail-line {padding:8px 0;}
    .show-tab .detail-box .detail-line:first-child{}
    .show-tab .detail-box .detail-line .norms{display: inline-block;width: 25%;font-size: 1.4rem;line-height: 2rem;color:#9a9a9a;vertical-align: top;}
    .show-tab .detail-box .detail-line .norms-details{display: inline-block;width:75%;font-size: 1.4rem;line-height: 2rem;color:#2f2f2f;}
    .textHidden img{width: 20px;height: 20px;}
    .top-middle{position: absolute;top: 50%;-webkit-transform:translateY(-50%);-moz-transform:translateY(-50%);-o-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);}
    .classify-list-content .swiper-item,.index-goods-box li { float: left; width: 49%; line-height: 20px; padding: 0 0 15px; margin: 10px auto 0; font-size: 1.4rem; background: #fff;position: relative;}
    .classify-list-content .swiper-item .logo,.index-goods-box li .logo{width:45px;position:absolute;top:5px;left:5px;z-index: 3;}
    .classify-list-content .swiper-item:nth-child(even),.index-goods-box li:nth-child(even){margin-left:1%;}
    .classify-list-content .swiper-item:nth-child(odd),.index-goods-box li:nth-child(odd){margin-right:1%;}
    .classify-list-content .swiper-item span,.index-goods-box li span{ display: block; width: 100%; overflow: hidden; text-align: center;}
    .classify-list-content .swiper-item span img,.index-goods-box li span img{ height:auto; width: 100%; max-width: 100%;margin-bottom:5px;}
    .classify-list-content .swiper-item h1,.index-goods-box li h1{ width: 95%; line-height: 1.8rem; margin: 0 auto; height: 3.6rem;overflow: hidden;}
    .classify-list-content .swiper-item p,.index-goods-box li p{ position: relative; padding: 0 5px; margin-top: 6px; color: #FF4348; font-size: 1.4rem;}
    /*.classify-list-content .swiper-item p:before,.index-goods-box li p:before{ content: '¥';}*/
    .classify-list-content .swiper-item p em,.index-goods-box li p em{ display: inline-block; line-height: 20px; padding: 0 5px; margin-left: 5px; background: #FF4348; color: #fff; font-size: 1rem;}
    .classify-list-content .none { display: none;}
    .none { display: none;}
    .icon-iconcart:before {display: inline-block;content: "";width: 24px;height: 22px;background-image: url(../../assets/images/ic_group.png);background-size: 100%;}
    .index-flash {position: relative;overflow:hidden;}
    .index-flash .bannerMask{position:absolute;bottom:0;left:0;z-index: 9;width:100%;}
    .index-flash .backBox{width:2.6rem;height:2.6rem;line-height: 3rem;text-align: center;position: absolute;top:10px;left: 10px;z-index: 998;border-radius: 1.5rem;}
    .icon-iconback{font-size:2rem;color:#3c4347;background: url(../../assets/images/ic_back.png) no-repeat;background-size: 100%;float: left;height: 100%;width: 100%;}
    .bottom-show{bottom: 0}
    .bottom-color {background: #7ebaff;color: #fff;padding: 2px 4px;border-radius: 5px;}
    .sec-kill {margin-left: 5px;}
    .pr {position: relative;}
    .bstyle {padding: 2px 3px;background: #111;color: #fff;border-radius: 3px;margin: 0 2px;}
    /*.go-pic {display: inline-block;height: 2.5rem;padding:0 1rem;background: rgba(0,0,0,.2);position: absolute;bottom: 0;right: 0;line-height: 2.5rem;text-align: center;color: #fff;border-radius: 5px;z-index: 999}*/
    .go-pic {position: absolute;bottom: 0;right: 0;display: inline-block;width: 24%;z-index: 10;text-align: right;}
    .go-pic>img {position: absolute;left: 10%;top: 0;width: 26%;z-index: 11;}
    .footers .count i img {
        width: 33%;
    }
    .footers ul .count {
        float: left;
        width: 20%;
        text-align: center;
        margin-top: 6px;
        position: relative;
    }

    .classify-list-content .swiper-item:last-child {margin-left: 0}
</style>



// WEBPACK FOOTER //
// goods.vue?0ca0184b