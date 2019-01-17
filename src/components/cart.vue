<template>
  <div class="cart-index">
    <div class="header cartHeader">
      购物车
      <div v-if="cart_data.total_goods_count != 0" class="right-box deleteBox" @click="changeText(delOrPost)">
        <img v-if="delOrPost == 1" src="../assets/images/icon_del.png"/>
        <span v-else>完成</span>
      </div>
    </div>
    <div class="loading" v-show="loading"><img style="width:30%;" src="../assets/images/loading.gif" alt=""></div>
    <div class="loaded" v-show="!loading">
      <!--购物车未登录提示-->
      <div v-if="!isLogin" class="empty-box">
        <img src="../assets/images/ic_no_login.png"/>
        <p>还没有登录</p>
        <p>还等什么，快去注册登录吧~</p>
        <router-link class="link-btn" to="/login/index">去登录</router-link>
      </div>
      <!--购物车无商品提示-->
      <div v-else-if="cart_data.total_goods_count == 0" class="empty-box">
        <img src="../assets/images/ic_no_cart.png"/>
        <p>购物车是空的</p>
        <p>赶紧去探索属于你的百草味吧~</p>
      </div>
      <div v-else class="cartContent">
        <div class="cart-product" v-for="data in cart_data.list" :key="data">
          <div v-if="data.tip_content" class="add-label">
            <span><img :src="data.tip_icon"></span>{{data.tip_content}}
            <a v-if="data.tip_url"  class="fr" :href="data.tip_url">继续挑选 > </a>
            <div v-else>
              <router-link class="appendLink fr" v-if="data.goMakeOrder > 0" :dataPrice=" data.goMakeOrder" :to="{ path : '/appendGoods'}">继续挑选 > </router-link>
            </div>
          </div>
          <div class="cart-item">
            <ul>
              <li v-for="cateData in data.goods_list" :key="cateData" :class="{ on : cateData.selected == '0'}" :data-goods-id="cateData.goods_id">
                <div v-if="cateData.act_type == 999 && !cateData.is_on_sale" class="cart-present" :class="{ lanch_times : cateData.selected != 0}">
                  <div class="goods-box clearfix">
                    <router-link :to="{ path :  '/data-list/detail-goods',query : { id : cateData.goods_id}}">
                      <div class="img-box"><img class="lazyImg" v-lazy="cateData.goods_img+'?imageView2/1/w/200/h/200'"> </div>
                      <div class="info-box">
                        <p class="pro-tit"><em>赠品</em><span v-html="cateData.goods_name"></span><i class="fr">x{{cateData.cart_good_number}}</i></p>
                        <p class="pro-price"><em v-html="cateData.goods_desc"></em> <span class="fr gray" v-html="cateData.end_time"></span></p>
                      </div>
                    </router-link>
                  </div>
                </div>
                <div v-else-if="cateData.act_type == 999 && cateData.is_on_sale" style="padding-left:10%;" class="cart-present" :class="{ lanch_times : cateData.selected != 0}">
                  <!--无效商品-->
                    <div class="select-box">
                      <div>
                        <div v-if="delOrPost">
                          <i class="label">失效</i>
                        </div>
                        <div v-else>
                          <i :data-goods-id="cateData.goods_id" :class="{ on :checkedDelAll == 1 }" class="check-icon J_checkBtn2 isShow" @click="changeStatus($event)" ></i>
                        </div>
                      </div>
                    </div>
                  <div class="goods-box clearfix">
                    <router-link :to="{ path :  '/data-list/detail-goods',query : { id : cateData.goods_id}}">
                      <div class="img-box"><img class="lazyImg" v-lazy="cateData.goods_img+'?imageView2/1/w/200/h/200'"> </div>
                      <div class="info-box">
                        <p class="pro-tit"><em>赠品</em><span v-html="cateData.goods_name"></span><i class="fr">x{{cateData.cart_good_number}}</i></p>
                        <p class="pro-price"><em v-html="cateData.end_time"></em> </p>
                      </div>
                    </router-link>
                  </div>
                </div>
                <div v-else>
                  <div class="select-box">
                    <!--无效商品-->
                    <div v-if="cateData.is_on_sale == 1">
                      <div v-if="delOrPost">
                        <i class="label">失效</i>
                      </div>
                      <div v-else>
                        <i :data-goods-id="cateData.goods_id" :class="{ on :checkedDelAll == 1 }" class="check-icon J_checkBtn2 isShow" @click="changeStatus($event)" ></i>
                      </div>
                    </div>
                    <!--有效商品-->
                    <div v-else>
                      <div v-if="delOrPost">
                        <i class="check-icon J_checkBtn isShow" :class="{ on : cateData.selected == '0'}" @click="isChecked(cateData.selected,[cateData.goods_id])"></i>
                      </div>
                      <div v-else>
                        <i :data-goods-id="cateData.goods_id" :class="{ on :checkedDelAll == 1 }" class="check-icon J_checkBtn2 isShow" @click="changeStatus($event)" ></i>
                      </div>
                    </div>
                  </div>
                  <div class="goods-box clearfix">
                    <router-link :to="{ path :  '/data-list/detail-goods',query : { id : cateData.goods_id}}">
                      <div class="img-box"><img class="lazyImg" v-lazy="cateData.goods_img+'?imageView2/1/w/200/h/200'"> </div>
                      <div class="info-box">
                        <p class="pro-tit" v-html="cateData.goods_name"></p>
                        <!--有效商品展示价格-->
                        <p v-if=" !cateData.is_on_sale" class="pro-price redTxt" v-html="'¥'+cateData.shop_price"></p>
                      </div>
                    </router-link>
                    <div class="onSale">
                      <!--无效商品-->
                      <p v-if="cateData.is_on_sale == 1" class="pro-price">
                        对不起，商品已经下架，不能购买
                      </p>
                      <!--有效商品-->
                      <div v-else class="onSaleGoods">
                        <div v-if="delOrPost" class="shopping-num-box">
                          <div class="mui-numbox">
                            <i class="btn btn-add" @click="changeGoodsNum(1,cateData.goods_id,1)"><img src="../assets/images/btn_add.png" alt=""></i>
                            <i class="btn btn-reduce" v-if="cateData.cart_good_number > 1" @click="changeGoodsNum(2,cateData.goods_id,1)"><img src="../assets/images/btn_reduce.png" alt=""></i>
                            <i class="btn btn-reduce" v-else><img src="../assets/images/btn_reduce_dis.png" alt=""></i>
                            <span class="mui-numbox-input" v-html="cateData.cart_good_number"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-footer clearfix">
          <div class="col col-2" id="J_check_all">
            <div v-if="delOrPost">
              <div class="select-box footer-check"><i class="check-icon" :class="{on : cart_data.allSelectGood == 0}" @click="checkAll(cart_data.allSelectGood)"></i></div>全选
            </div>
            <div v-else>
              <div class="select-box footer-check footer-check-del"><i :class="{on : checkedDelAll == 1}" class="check-icon check-icon2" @click="checkDelAll()"></i></div>全选
            </div>
          </div>
          <div v-if="delOrPost" class="delOrPost">
            <div class="col col-5">
              <p :class="{ lineHeight : cart_data.total_discont_free <= 0 }">合计:<i class="redTxt" id="J_totalPrice" v-html="'¥'+cart_data.total_free"></i></p>
              <p v-if="cart_data.total_discont_free" class="l">活动优惠:<i id="J_priPrice" v-html="'¥'+cart_data.total_discont_free"></i></p>
            </div>
              <div @click="goPay()" class="col col-3" >去结算(<i class="totalCount" v-html="cart_data.selected_count"></i>)</div>
          </div>
          <div v-else>
            <div class="col col-3" @click="isDeleteGoods()"><i>删除</i></div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmDelete ref="confirm"></ConfirmDelete>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import {cartGoods} from '../service/getData'
  import {isCheckedGoods} from '../service/getData'
  import {deleteGoods} from '../service/getData'
  import {changeCartGoodsNum} from '../service/getData'
  import ConfirmDelete from './confirmDialog'
  import Valert from './alertDialog'
  import {setSessionStore,getSessionStore} from '../assets/js/mUtils'

  export default {
    data () {
      return {
        cart_data:{list:[]},
        checked:0,
        checkedAll:0,
        checkedDelAll:0,
        goodsId:[],
        delGoodsId:[],
        delOrPost:1,
        transmitGoodsId:[],
        isLogin:true,
        appendGoods:{price:0,count:0,lanch_times:-1},
        loading:true
      }
    },
    components:{
      ConfirmDelete,
      Valert,
    },
    created () {
//      this.getCartList();
      setTimeout(() =>{
        this.loading = false;
      },1000);
    },
    updated () {
      setSessionStore("transmitGoodsId",this.transmitGoodsId)
      if(document.getElementsByClassName('appendLink').length > 0){
        this.appendGoods.price = document.getElementsByClassName('appendLink')[0].getAttribute('dataPrice');
        this.appendGoods.count = this.cart_data.selected_count;
        setSessionStore('appendGoods',this.appendGoods);
      }
    },
    mounted () {
    },
    methods: {
      getCartList(){
        var that = this;
        var _referer = document.referrer;
        cartGoods().then(response => {
          if(response.data.result_code == '1003'){
            if(typeof(response.data.result_data.openid) != 'undefined') {
              if(_referer.indexOf('bind-phone') < 0){
                // 跳临时用户绑定手机号页面
                window.location.href = '/user-info/bind-phone';
              }
            }else{
              that.isLogin = false;
            }
          }else if(response.data.result_code == '0') {
            this.cart_data = response.data.result_data;
            var goodsIdData = response.data.result_data.list;
            for ( var i = 0 ; i < goodsIdData.length ; i ++ ) {
              for ( var j = 0 ; j < goodsIdData[ i ].goods_list.length ; j ++ ) {
                if ( ! goodsIdData[ i ].goods_list[ j ].is_on_sale ) {
                  this.goodsId.push ( goodsIdData[ i ].goods_list[ j ].goods_id );
                }
                if(! goodsIdData[ i ].goods_list[ j ].is_on_sale && goodsIdData[i].goods_list[j].selected == 0){
                  this.transmitGoodsId.push( goodsIdData[ i ].goods_list[ j ].goods_id );
                }
              }
            }
          }else if(response.data.result_code == 1003){
            this.$router.push('/login');
          }else{
            this.$refs.alertTip.alert(response.data.result_info);
          }
        }).then((res)=>{
          if(document.getElementsByClassName('cart-present').length == 0){
            this.lanch_times = 0;
          }else if(document.getElementsByClassName('lanch_times').length == document.getElementsByClassName('cart-present').length){
            this.lanch_times = 1;
          }
        });
      },
      isChecked(checked,goodsId){
        if(checked == 0){
          this.checked = 1;
        }else{
          this.checked = 0;
        }
        isCheckedGoods(this.checked,goodsId).then(response => {
          if ( response.data.result_code == '0' ) {
            this.cart_data = response.data.result_data;
//            修改传递的商品ID
            var goodsIdData = response.data.result_data.list;
            this.transmitGoodsId=[];
            for ( var i = 0 ; i < goodsIdData.length ; i ++ ) {
              for ( var j = 0 ; j < goodsIdData[ i ].goods_list.length ; j ++ ) {
                if ( ! goodsIdData[ i ].goods_list[ j ].is_on_sale && goodsIdData[i].goods_list[j].selected == 0) {
                  this.transmitGoodsId.push( goodsIdData[ i ].goods_list[ j ].goods_id );
                }
              }
            }
//            修改传递的商品ID
          }else{
            this.$refs.alertTip.alert(response.data.result_info);
          }
        })
      },
      checkAll(checkedAll){
        if(checkedAll == 0){
          this.checkedAll = 1 ;
        }else{
          this.checkedAll = 0 ;
        }
        isCheckedGoods(this.checkedAll,this.goodsId).then(response => {
          if(response.data.result_code == '0') {
            this.cart_data = response.data.result_data;
//          修改传递的商品ID
            var goodsIdData = response.data.result_data.list;
            this.transmitGoodsId=[];
            for ( var i = 0 ; i < goodsIdData.length ; i ++ ) {
              for ( var j = 0 ; j < goodsIdData[ i ].goods_list.length ; j ++ ) {
                if ( ! goodsIdData[ i ].goods_list[ j ].is_on_sale && goodsIdData[i].goods_list[j].selected == 0) {
                  this.transmitGoodsId.push( goodsIdData[ i ].goods_list[ j ].goods_id );
                }
              }
            }
//          修改传递的商品ID
          }else{
            this.$refs.alertTip.alert(response.data.result_info);
          }
        })
      },
      changeText(){
        this.delOrPost = this.delOrPost == 0 ? 1 : 0
      },
      changeStatus(e){
        if(e.currentTarget.className == 'check-icon J_checkBtn2 isShow on'){
          e.currentTarget.className='check-icon J_checkBtn2 isShow';
        }else{
          e.currentTarget.className='check-icon J_checkBtn2 isShow ' + 'on';
        }
        if(document.getElementsByClassName('J_checkBtn2 on').length == document.getElementsByClassName('J_checkBtn2').length){
          document.getElementsByClassName('check-icon2')[0].className='check-icon check-icon2 on';
        }else{
          document.getElementsByClassName('check-icon2')[0].className='check-icon check-icon2';
        }
      },
      checkDelAll(){
        if(this.checkedDelAll == 1){
          if(document.getElementsByClassName('J_checkBtn2 on').length != document.getElementsByClassName('J_checkBtn2').length) {
            document.getElementsByClassName('check-icon2')[0].className='check-icon check-icon2 on';
//          this.checkedDelAll = 1;值未改变，数据不更新
            for(var i=0;i<document.getElementsByClassName('J_checkBtn2').length;i++){
              if(document.getElementsByClassName('J_checkBtn2')[i].className != 'check-icon J_checkBtn2 isShow on'){
                document.getElementsByClassName('J_checkBtn2')[i].className='check-icon J_checkBtn2 isShow on';
              }
            }
          }else{
            document.getElementsByClassName('check-icon2')[0].className='check-icon check-icon2';
            this.checkedDelAll = 0;
          }
        }else{
          this.checkedDelAll = 1;
        }
      },
      isDeleteGoods(){
        if(document.getElementsByClassName('on check-icon J_checkBtn2').length == 0){
          this.$refs.alertTip.alert('请选择要删除的商品');
        }else{
            this.$refs.confirm.confirm({
            text:"你确定要放弃这份美味么？",
            cancelButtonText:'取消',
            confirmButtonText:'确定'
          }).then(() => {
            // 点击确定按钮的回调处理
            this.$refs.confirm.show = false;
              for(var i=0;i<document.getElementsByClassName('J_checkBtn2').length;i++){
                if(document.getElementsByClassName('J_checkBtn2')[i].className == 'check-icon J_checkBtn2 isShow on'){
                  this.delGoodsId.push(document.getElementsByClassName('J_checkBtn2')[i].getAttribute('data-goods-id'))
                }
              }
            deleteGoods(this.delGoodsId).then(res => {
              if(res.data.result_code == '0') {
                this.cart_data = res.data.result_data;
                //修改传递的商品ID
                var goodsIdData = res.data.result_data.list;
                this.transmitGoodsId=[];
                for ( var i = 0 ; i < goodsIdData.length ; i ++ ) {
                  for ( var j = 0 ; j < goodsIdData[ i ].goods_list.length ; j ++ ) {
                    if (! goodsIdData[ i ].goods_list[ j ].is_on_sale && goodsIdData[i].goods_list[j].selected == 0) {
                      this.transmitGoodsId.push( goodsIdData[ i ].goods_list[ j ].goods_id );
                    }
                  }
                }
                //修改传递的商品ID
                for ( var i = 0 ; i < document.getElementsByClassName ( 'on check-icon J_checkBtn2' ).length ; i ++ ) {
                  document.getElementsByClassName ( 'on check-icon J_checkBtn2' )[ i ].className = 'check-icon J_checkBtn2 isShow'
                }
              }else{
                this.$refs.alertTip.alert(res.data.result_info);
              }
            }).catch((res) => {})
          }).catch((res) => {
            // 点击取消按钮的回调处理
          });
        }
      },
      changeGoodsNum(change,goodsId,num){
        changeCartGoodsNum(change,goodsId,num).then(response => {
          if(response.data.result_code == '0'){
            this.cart_data=response.data.result_data;
            this.appendGoods.price = this.cart_data.shippingFee - this.cart_data.total_free;
            this.appendGoods.count = this.cart_data.selected_count;
            setSessionStore('appendGoods',this.appendGoods);
          }else if(response.data.result_code == ''){
            //this.$refs.alertTip.alert('操作过于频繁');
          }
          else{
              this.$refs.alertTip.alert(response.data.result_info);
            }
          })
      },
      goPay(){
        if(this.cart_data.selected_count ==0){
          this.$refs.alertTip.alert('没有选择要购买的商品');
        }else{
          window.location.href='/user-event/pay'
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading{position:fixed;top:40%;left:50%;width:100%;text-align:center;
    -webkit-transform: translate(-50%);-moz-transform: translate(-50%);-ms-transform: translate(-50%);transform: translate(-50%);
  }
  .cart-present{background-color:#fff;}
  .cart-present .goods-box{padding-left:10px;}
  .cart-present .goods-box .img-box{width:20%;}
  .gray{color:#999;}
  .cart-present .pro-tit em{color:#fff;padding:1px 0;background: #80BBFF;border-radius: 6px;margin:0 1%;display: inline-block;width:10%;text-align:  center;vertical-align: top;font-size:1rem;}
  .cart-present .pro-tit span{ display: inline-block;width: 75%;overflow: hidden;line-height: 1.8rem;    text-overflow: ellipsis; white-space: nowrap; -o-text-overflow: ellipsis;}
  .cart-footer .col.col-5 .lineHeight{line-height:37px;}
  .cart-index{background-color:#eee;height:100%;}
  .header{border-bottom:1px solid #ccc;width:100%;height:50px;line-height:50px;background-color: #fff;position:fixed;top:0;left:0;z-index:99;color:rgba(60,67,71,1);font-size:1.4rem;text-align: center;}
  .header .right-box{position:absolute;right:0;top:0;display:inline-block;width:15%;height: 50px;font-size:1.2rem;text-align: center;padding-right: 3%;}
  .header .right-box img{width:40%;}
  .cartContent{margin-bottom: 105px;padding-top:50px;}
  .cart-footer{position:fixed;bottom:50px;left:0;z-index:99;width:100%;height:50px;background-color:#fff;border-top:1px solid #d9d9d9;}
  .cart-footer .col.col-2{width:20%;padding-left:10%;text-align:left;float:left;height:48px;line-height:48px;}
  .cart-footer .col.col-2 .select-box{width:10%;position:absolute;left:0;top:0;text-align:center;}
  .cart-footer .col.col-2 .footer-check{display: block;}
  .cart-footer .col.col-2 .select-box .check-icon{width:20px;height:20px;display:inline-block;background:url("http://img2.vipbcw.com/wap/check_n.png") no-repeat center;background-size:100%;vertical-align: middle;}
  .cart-footer .col.col-2 .select-box .check-icon.on{background-image:url("http://img2.vipbcw.com/wap/check_r.png")}
  .cart-footer .col.col-5{width:45%;text-align:right;line-height:normal;padding-top:5px; float:left;height:48px;}
  .cart-footer .col.col-3{text-align:center;width: 30%;background: #ff4f39;color: #fff;height: 35px;line-height: 35px;float: right;margin: 5px 2%;border-radius: 35px;}
  /*.cartContent{padding-bottom: 105px;}*/
  .cartContent .cart-product .cart-item{margin-bottom:10px;}
  .cartContent .cart-item li{background: #fff;position: relative;border-bottom:solid 1px #e5e5e5;}
  .cartContent .cart-item li>div{padding-left:10%;}
  .cartContent .cart-item li div.cart-present{padding-left:10px;}
  /*.cartContent .cart-item.activity-item li{border-bottom:0;}*/
  .cartContent .cart-product .add-label{padding:0 2%;text-align: left;height:40px;line-height: 40px;margin-top:10px;background:#fff;font-size: 1.2rem;color:#51575b;}
  .cartContent .cart-product .add-label span{display: inline-block;width:auto;margin-right:3px;height:50%;line-height: 100%;vertical-align: middle;}
  .cartContent .cart-product .add-label span img{height:100%;width:auto;}
  .cartContent .cart-product .add-label{margin-top:0;border-bottom:solid 1px #e5e5e5;position: relative;}
  .cartContent .cart-product .add-label .fr{position: absolute;width:100%;height: 100%;padding-right: 2%;top:0;left:0;text-align: right;background: transparent;z-index: 5;}
  /*.cartContent .cart-item.activity-item{border:solid #e5e5e5;border-width:1px 0;}*/
  .cartContent li .select-box{position: absolute;left: 0;top:50%;vertical-align: middle;text-align: center;width: 10%;height: 22px;margin-top: -11px;}
  .cartContent li .select-box .check-icon{width:20px;height:20px;display:inline-block;background:url("http://img2.vipbcw.com/wap/check_n.png") no-repeat center;background-size:100%;vertical-align: middle;}
  .cartContent li .select-box .J_checkBtn2{display: none;margin:0 auto;}
  .cartContent li.on .select-box .check-icon.on{background-image:url("http://img2.vipbcw.com/wap/check_r.png");}
  .cartContent li .select-box .check-icon.on{background-image:url("http://img2.vipbcw.com/wap/check_r.png");}
  .cartContent li .select-box .check-icon.isShow{display:inline-block;}
  .cartContent li .goods-box{position: relative;padding: 10px 2% 10px 0;}
  .cartContent li .cart-present .goods-box .img-box{width:13%;}
  .cartContent li .goods-box .img-box{width: 25%;float: left;display: inline-block;border:solid 1px #e5e5e5;}
  .cartContent li .cart-present .goods-box .info-box{width:85%;}
  .cartContent li .goods-box .info-box{font-size: 1.2rem;float: left;display: inline-block;width: 75%;padding:0 0 0 5px;color:#3c4347;}
  .cartContent li .goods-box .pro-tit{overflow: hidden;line-height: 1.8rem;text-overflow: ellipsis;white-space:nowrap;  -o-text-overflow:ellipsis;font-size: 1.3rem;}
  .cartContent li .goods-box .pro-tit.p2{color: #9ea1a3;font-size: 1.2rem;}
  .cartContent li .cart-present .goods-box .pro-price{width:82%;}
  .cartContent li .goods-box .pro-price{bottom:10px;position:absolute;line-height: 30px;width:70%;}
  .cartContent li .cart-present .pro-price{line-height:1.8rem;}
  .cartContent li .cart-present .pro-price em,.cartContent li .cart-present .pro-price span{font-size:1.2rem;}
  .cartContent li .goods-box .onSale{width:75%;margin-left:25%;padding-left:5px;}
  .cartContent li .goods-box .shopping-num-box{position: absolute;bottom:10px;right:2%;}
  .mui-numbox{width: 90px;height: 30px;line-height: 30px;padding:0 30px;position: relative;display: inline-block;}
  .mui-numbox .btn{position: absolute;top:0;left: 0;width:30px;}
  .mui-numbox .btn img{width:82%;}
  .mui-numbox .btn.btn-add{right: 0;left: auto;border-left: solid 1px #fff;border-right:0;}
  .mui-numbox .mui-numbox-input{display:inline-block;width: 30px;height: 28px;text-align: center;font-size: 1.2rem;}

  .cartContent li:last-child{border-bottom:0;}
  .cartContent li .goods-box .pro-price{color:#9ea1a3;}
  .cartContent li .goods-box .pro-price.redTxt{color:rgba(255,67,72,1);}
  .cartContent li .select-box i.label{background: #aaa;color:#fff;font-size: 1rem;padding:0 3px;}
  .empty-box{padding-top:30%;}
</style>



// WEBPACK FOOTER //
// cart.vue?bc521bf0