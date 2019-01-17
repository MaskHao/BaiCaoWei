<template>
  <div style="padding:45px 0 90px">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      我的收藏
      <div class="header-right" v-if="collectList.length > 0" @click="delState()">
        <span v-if="isDel">完成</span>
        <img v-else style="width:30%;" src="../../assets/images/icon_del.png"/>
      </div>
      <div class="header-right" v-else></div>
    </div>
    <div class="collect-list">
      <ul>
        <li v-for="value in collectList" :key="value" :data-id="value.goods_id" :class="{'active':isDel}">
          <div class="select-box" :class="{'on': allSelect || goodSelect[value.goods_id] }" v-if="isDel">
            <input type="checkbox" :value="value.goods_id" v-model="delId" @click="selectGood(value.goods_id)">
          </div>
          <div class="goods-box clearfix">
            <router-link class="clearfix" :to="{path: '/data-list/detail-goods',query: {id: value.goods_id}}">
              <img v-lazy="value.goods_img+'?imageView2/1/w/200/h/200'" data-original=""/>
              <div class="goods-info">
                <p class="textHidden">{{value.goods_name}}</p>
                <p class="p-bottom">¥{{value.shop_price}}</p>
              </div>
            </router-link>
          </div>
          <div v-if="!isDel" class="buy-btn" @click="addCart(value.goods_id)"></div>
        </li>
      </ul>
    </div>
    <p class="load-txt" v-if="collectList.length > 0">{{loadTxt}}</p>

    <router-link to="/user-event/list-cart" v-if="!isDel && collectList.length > 0" class="fixed-cart"><i v-if="cartNum != 0">{{cartNum}}</i></router-link>

    <div class="del-bottom" v-if="isDel">
      <div class="select-box" :class="{'on':allSelect}" @click="selectAll()"></div>全选
      <div class="del-btn" @click="delCollect()">删除<i v-if="delLength>0">({{delLength}})</i></div>
    </div>

    <!--列表为空-->
    <div v-if="collectList.length == 0" class="empty-box">
      <img src="../../assets/images/ic_no_collect.png"/>
      <p>这里空空如也</p>
      <p>快去搜索美味吧～</p>
      <router-link class="link-btn" to="/home/index">去逛逛</router-link>
    </div>
    <vAlert ref='alertDialog'></vAlert>
    <ConfirmDelete ref="confirm"></ConfirmDelete>
  </div>
</template>

<script>
  import {collection,getGoodsAddCart,cartGoods,delCollectByMore} from 'service/getData'
  import vAlert from 'components/alertDialog'
  import ConfirmDelete from 'components/confirmDialog'


  export default {
    data () {
      return {
        collectList:[],
        isDel:false,
        delLength:0,
        allSelect:false,
        goodSelect:{},
        cartNum:0,
        delId:false,
        delIdArr:[],
        page:1,
        pageCount:1,
        lastId:0,
        loadTxt:"加载更多……",
        isLoad:false
      }
    },
    created(){
      this.getCollection();
      this.getCarNum();
      document.addEventListener('scroll',() => {

        let bheight = window.screen.height//浏览器当前窗口可视区域高度
        let sheight = document.body.scrollHeight | document.documentElement.scrollHeight//获取滚动条高度
        let stop = document.body.scrollTop | document.documentElement.scrollTop//滚动条距离顶部的距离

        if(stop>=sheight-bheight && this.page < this.pageCount && this.isLoad){//当滚动条到顶部的距离等于滚动条高度减去窗口高度时
            this.page++;
          this.isLoad = false;
        }else{

        }
      })
    },
    components:{
      ConfirmDelete,
      vAlert,
    },
    methods:{
      getCollection(){
        var that = this;
          collection(this.page,this.lastId).then(res => {
            if(res.data.result_code == 0 && res.data.result_data != ''){
              var _list = res.data.result_data.list;
              var _list_info = res.data.result_data.list_info;
              var _last = Number(_list.length)-1;
              for(var i=0 ; i<_list.length ; i++){
                that.collectList.push(_list[i]);
              }
              //that.collectList = res.data.result_data.list;
              that.pageCount = res.data.result_data.list_info.list_count;
              that.lastId = _list[_last].cursor_id;
              if(_list_info.list_count == _list_info.list_ordinal  ){
                that.loadTxt = '天呐～没有更多了';
              }
              this.isLoad = true;
            }
          })
      },
      delState(){
        this.isDel = this.isDel ? false : true;
        this.allSelect = false;
        var _list = this.collectList;
        this.goodSelect = {};
        for(var i=0 ; i<_list.length ; i++){
          this.goodSelect[_list[i].goods_id] = false;
        }
      },
      getCarNum(){
        var that = this
        cartGoods().then((response) => {
          that.cartNum = response.data.result_data.total_goods_count;
        })
      },
      addCart(id){
        var that = this;
        getGoodsAddCart(id).then((response) => {//加入购物车
          if(response.data.result_code){
            if(response.data.result_code == 0){
              that.cartNum = Number(that.cartNum) + 1;
              that.$refs.alertDialog.alert('加入购物车成功')
            }else{
              that.$refs.alertDialog.alert(response.data.result_info)
            }
          }

        })
      },
      selectAll(){
        var _allId = this.goodSelect;
        var _length=0;
        if(this.allSelect){
          this.allSelect = false;
        }else{
          this.allSelect = true;
        }
        for(var key in _allId){
          ++_length;
          _allId[key] = this.allSelect;
        }
        if(this.allSelect){
          this.delLength = _length;
        }else{
          this.delLength = 0;
        }
      },
      selectGood(id){
        if(this.goodSelect[id]){
          this.goodSelect[id] = false;
        }else{
          this.goodSelect[id] = true;
        }
        this.checkSelAll();
      },
      checkSelAll(){
        var _length=0;
        var _allLength=0
        var _allId = this.goodSelect;
        for(var key in _allId){
          ++_allLength;
          if(_allId[key]){
            ++_length;
          }
        }
        this.delLength = _length;
        if(_length == _allLength){
          this.allSelect = true;
        }else{
          this.allSelect = false;
        }
      },
      delCollect(){
        var that = this;
        if(this.delLength > 0){
          for(var key in this.goodSelect){
            if(this.goodSelect[key]){
              this.delIdArr.push(key);
            }
          }
          //console.log(this.delIdArr);
          this.$refs.confirm.confirm({
            text:"你真的要删除我吗？",
            cancelButtonText:'取消',
            confirmButtonText:'确定'
          }).then(() => {
            // 点击确定按钮的回调处理
            that.$refs.confirm.show = false;
            delCollectByMore(that.delIdArr).then(res => {
              if(res.data.result_code == '0'){
                that.isDel = false;
                that.delIdArr =[];
                that.delLength =0;
                that.page = 1;
                that.pageCount = 1;
                that.lastId = 0;
                that.collectList = [];
                that.getCollection();
              }else{
                that.$refs.alertDialog.alert(response.data.result_info)
              }
            })
          }).catch((res) => {
            // 点击取消按钮的回调处理
          });
        }
      }
    },
    watch:{
      'page'(){
        this.getCollection()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;top:0;left:0;width:100%;z-index:999; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}
  .collect-list li{margin-top:10px;background:#fff;position:relative;}
  .collect-list li.active{padding-left:40px;}
  .select-box{width:40px;height:40px;background:url(http://img2.vipbcw.com/wap/check_n.png) no-repeat center center;background-size:20px 20px;position:absolute;top:50%;left:0;margin-top:-20px;}
  .select-box input{width:100%;height:100%;}
  .select-box.on{background-image:url(http://img2.vipbcw.com/wap/check_r.png);}
  .goods-box{padding:10px 0 10px 10px;}
  .collect-list li.active .goods-box{padding-left:0;}
  .goods-box a{display: block;position:relative;}
  .goods-box img{width:25%;float:left;}
  .goods-box .goods-info{width:75%;height:100%;float:left;padding-left:10px;}
  .goods-box .goods-info p{line-height:2rem;font-size:1.4rem;}
  .goods-box .goods-info .p-bottom{position:absolute;bottom:0;left:28%;color:rgba(255,67,72,1);}
  .fixed-cart{width:55px;height:55px;position:fixed;bottom:20px;right:20px;background:#fff url("http://img2.vipbcw.com/wap/icon_cart3.png") no-repeat center center;background-size:25px auto;border-radius:50%;box-shadow: 0 0 5px #999;}
  .fixed-cart i{width:20px;height:20px;border-radius:10px; background: rgba(255,67,72,1);color:#fff;text-align:center;line-height:20px;position:absolute;top:8px;right:8px;}
  .del-bottom{width:100%;height:45px;position:fixed;left:0;bottom:0;background:#fff;line-height:45px;}
  .del-bottom .select-box{float:left;height:100%;position:relative;top:0;margin-top:0;}
  .del-bottom .del-btn{width:35%;height:34px;line-height:34px;color:#fff;background: rgba(255,67,72,1);float:right;margin-top:5px;border-radius:17px;text-align:center;margin-right:5%;}
  .load-txt{line-height:3rem;text-align:center;}
</style>



// WEBPACK FOOTER //
// collectList.vue?3786bb94