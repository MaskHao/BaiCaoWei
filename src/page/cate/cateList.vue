<template>
    <span class="con">
        <div class="header">
            <div class="left-box" v-on:click="routeBack"><i class="iconfont icon-iconback"></i></div>
            {{searchKey?searchKey:name}}
            <div class="right-box"><a href=""><i class="iconfont icon-iconsearch2"></i></a></div>
            <ul class="classify-list-title clear" v-show="listShow">
                <li class="title-list" v-on:click="getGoodsList(1)"><span v-on:click="changeClassOne" v-bind:class="{'choose':isChooseOne}">销量</span></li>
                <li class="title-list" v-on:click="getGoodsList()"><span v-on:click="changeClassTwo" v-bind:class="{'choose':isChooseTwo}">新品</span></li>
                <li class="title-list" id="J_list4" v-on:click="rankPrice(priceType)"><span v-on:click="changeClassThree" v-bind:class="{'choose':isChooseThree}">价格<em class="show-prev" v-bind:class="{'prev-active':isNextActive}"></em><em class="show-next" v-bind:class="{'next-active':isPrevActive}"></em></span></li>
            </ul>
        </div>
        <div class="paddingBottom" style="padding-top:85px;padding-bottom:0">
            <ul class="classify-list-content clear" v-show="listShow">
                <li v-for="list in goodsArray" :key="list">
                    <router-link v-bind:to="{path: '/data-list/detail-goods',query: {id: list.goods_id}}">
                        <i :style="{background:'url('+list.icon_pic+') center center / contain no-repeat'}"></i>
                        <img v-lazy="list.goods_icon+'?imageView2/1/w/320/h/320'" />
                        <p class="name textHidden">{{list.goods_keyword}}</p>
                        <h1>{{list.goods_title}}</h1>
                        <p class="price">¥{{list.shop_price}}</p>
                    </router-link>
                    <div class="buy-btn" v-on:click="addCart(list.goods_id)"></div>
                </li>
            </ul>
            <div class="" v-show="noResultShow">
                <img style="width:30%;margin:80px auto 20px;display:block;" src="../../assets/images/ic_no_search.png">
                <p style="text-align:center;">换个关键词试试~</p>
            </div>
        </div>
        <p id="loding" class="load" v-text="text"></p>
        <div class="fixd-cart" v-if="isBindPhone"><router-link to="/user-info/bind-phone"><i class="iconfont icon-iconcart on"></i></router-link></div>
        <div class="fixd-cart" v-else><router-link to="/user-event/list-cart"><i class="iconfont icon-iconcart on"></i><em class="cart-num" v-show="totalGoodsCount">{{totalGoodsCount.toString().length>2?'99+':totalGoodsCount}}</em></router-link></div>
        <vAlert ref='alertDialog'></vAlert>
    </span>
</template>

<script>
    import { getGoodsSearch, getGoodsByCate, getGoodsAddCart,getGoodsCollectList} from '../../service/getData'
    import vAlert from '../../components/alertDialog'
    import {setSessionStore} from '../../assets/js/mUtils'
    export default {
        name: 'cartList',
        data() {
            return {
                searchKey: '',
                goodsArray: [],
                priceType: 2,
                isChooseOne: false,
                isChooseTwo: false,
                isChooseThree: false,
                isPrevActive: false,
                isNextActive: false,
                listShow: true,
                noResultShow: false,
                id: null,
                name: '',
                totalGoodsCount:'',
                text:'',
                page:1,
                lastPage:'',
                isBindPhone:0,
                sum:0,
                goodsType:1
            }
        },
        methods: {
            routeBack() {//回到上一页
                this.$router.go(-1)
            },
            getGoodByCate(goodsType){
                this.name = this.$route.query.name
                this.id = this.$route.query.id
                getGoodsByCate(this.id,this.page,goodsType).then((response) => {
                    let res = response.data.result_data
                    let resList = response.data.result_data.list
                    this.getLoading(res,resList)
                });
            },
            getGoodBySearch(goodsType){
                this.searchKey = this.$route.query.searchKey
                getGoodsSearch(this.searchKey,this.page,goodsType).then((response) => {
                    let res = response.data.result_data
                    let resList = response.data.result_data.list
                    this.getLoading(res,resList)
                });
            },

            getLoading(res,resList){
                if(resList){
                    for(let i=0;i<resList.length;i++){
                        this.goodsArray.push(resList[i])
                    }
                }
                this.lastPage = res.list_info != undefined && res.list_info.list_count || 1
                if(this.goodsArray.length){
                    this.text='加载中...'
                    if(this.lastPage <= this.page){
                        setTimeout(() => {
                            this.text = '没有更多了哦'
                        },3000)
                    }
                }
                if (this.sum==0) {
                    if (this.goodsArray.length) {
                        this.isChooseOne = !this.isChooseOne
                    } else {
                        this.listShow = false
                        this.noResultShow = true
                    }
                }
                this.sum=1;
            },
            getGoodsList(goodsType) {//获取页面数据
              this.goodsType = goodsType;

            },
            rankPrice(priceType) {//价格排序
                this.priceType = priceType === 2 ? 3 : 2;
                this.goodsType = this.priceType;
            },
            changeClassOne() {//价格，销量，新品切换

                this.isChooseOne = true
                this.isChooseTwo = false
                this.isChooseThree = false
                this.text=''

                this.isPrevActive = false
                this.isNextActive = false
            },
            changeClassTwo() {//价格，销量，新品切换

                this.isChooseOne = false
                this.isChooseTwo = true
                this.isChooseThree = false
                this.text=''

                this.isPrevActive = false
                this.isNextActive = false
            },
            changeClassThree() {//价格，销量，新品切换

                this.isChooseOne = false
                this.isChooseTwo = false
                this.isChooseThree = true
                this.text=''

                if (this.isPrevActive === false) {
                    this.isPrevActive = true
                    this.isNextActive = false
                } else {
                    this.isPrevActive = false
                    this.isNextActive = true
                }
            },
            addCart(id) {
                getGoodsAddCart(id).then((response) => {
                  if(response.data.result_code){
                    if (response.data.result_code == 0) {
                      this.$refs.alertDialog.alert('加入购物车成功')
                      this.totalGoodsCount++
                    } else {
                      this.$refs.alertDialog.alert(response.data.result_info)
                    }
                  }

                })
            },
            collectList(){
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
            }
        },
        created() {
            if (this.$route.query.id) {
                this.getGoodByCate(this.goodsType)
            } else {
                this.getGoodBySearch(this.goodsType)
            }
          this.collectList()
            document.addEventListener('scroll',() => {

                let bheight = window.screen.height//浏览器当前窗口可视区域高度
                let sheight = document.body.scrollHeight || document.documentElement.scrollHeight//获取滚动条高度
                let stop = document.body.scrollTop || document.documentElement.scrollTop//滚动条距离顶部的距离

                if(stop>=sheight-bheight){//当滚动条到顶部的距离等于滚动条高度减去窗口高度时
                    if(this.lastPage > this.page){
                        this.page++
                    }
                }
            })
        },
        components: {
            vAlert,
        },
        watch:{
            'page'(n,o){
              if(n>o){
                if (this.id) {
                  this.getGoodByCate(this.goodsType)
                } else {
                  this.getGoodBySearch(this.goodsType)
                }
              }
            },
            'goodsType'(){
              this.goodsArray = []
              this.page = 1
              if (this.id) {
                this.getGoodByCate(this.goodsType)
              } else {
                this.getGoodBySearch(this.goodsType)
              }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*classify-list*/
    /*header*/
.load {padding: 12px 0;text-align: center;font-size: 1.3rem}
    .header {
        width: 100%;
        height: 50px;
        background: #fff;
        position: fixed;
        text-align: center;
        font-size: 1.4rem;
        line-height: 50px;
        z-index: 99;
        color: rgba(60, 67, 71, 1);
        border-bottom: solid 1px #e5e5e5;
        top: 0;
        left: 0;
    }

    .header .right-box {
        position: absolute;
        right: 0;
        top: 0;
        display: inline-block;
        font-size: 1.2rem;
        height: 50px;
        padding-right: 3%;
        text-align: right;
    }

    .header .left-box {
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        font-size: 1.2rem;
        padding-left: 3%;
        text-align: left;
        height: 100%
    }

    .header span {
        font-size: 1.6rem;
    }

    .classify-banner-box {
        background: #fff;
        padding-bottom: 10px;
        text-align: center;
    }

    .classify-banner-box img {
        margin-bottom: 10px;
    }

    .right-box {
        position: absolute;
        right: 0;
        top: 0;
        display: inline-block;
        font-size: 1.2rem;
        padding-left: 3%;
        text-align: left;
    }

    .classify-list-title {
        height: 35px;
        line-height: 35px;
        background: #fff;
        border-bottom: 1px solid #e8e8e8;
        position: relative;
    }

    .classify-list-title .title-list {
        float: left;
        width: 33%;
        text-align: center;
    }

    .classify-list-title .title-list .choose::after {
        content: '';
        float: left;
        width: 100%;
        border-bottom: 2px solid #ff4f39;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .classify-list-title .title-list span {
        display: inline-block;
        width: 60%;
        height: 34px;
        font-size: 1.3rem;
        position: relative;
    }

    .classify-list-title .title-list .line {
        border-bottom: 2px solid #ff4f39;
    }

    .classify-list-title .title-list span em {
        display: inline-block;
        width: 0;
        height: 0;
        position: absolute;
        left: 75%;
    }

    .classify-list-title .title-list span .show-prev {
        border-bottom: 4px solid #666;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        top: 30%;
    }

    .classify-list-title .title-list span .prev-active {
        border-bottom: 4px solid #ff4f39;
    }

    .classify-list-title .title-list span .show-next {
        border-top: 4px solid #666;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        top: 55%;
    }

    .classify-list-title .title-list span .next-active {
        border-top: 4px solid #ff4f39;
    }

    .classify-list-content {
        overflow: hidden;
      background:#fff;
    }

    .classify-list-content li{
        float: left;
        width: 45.5%;
        line-height: 20px;
        padding: 0 0 10px;
        margin: 10px 3% 0;
        font-size: 1.4rem;
        background: #fff;
        position: relative;
    }

    .classify-list-content li .logo{
        width: 45px;
        position: absolute;
        top: 5px;
        left: 5px;
        z-index: 3;
    }

    .classify-list-content li:nth-child(even){
        margin-left: 1.5%;
    }

    .classify-list-content li:nth-child(odd) {
        margin-right: 1.5%;
    }

    .classify-list-content li h1{
        width: 95%;
        line-height: 1.8rem;
        margin: 0 auto;
        height: 3.6rem;
        overflow: hidden;
    }
    .classify-list-content li p.name{
      height:2.4rem;
      line-height: 2.4rem;
      margin: 0 auto;
      font-size:1.3rem;
      overflow: hidden;
      font-weight: bold;;
    }
    .classify-list-content li p.price {
        position: relative;
        padding: 0 5px;
      height:2rem;line-height: 2rem;
        color: #FF4348;
        font-size: 1.4rem;
    }

    /*.classify-list-content li p.price:before {*/
        /*content: '¥';*/
    /*}*/

    .classify-list-content li p em {
        display: inline-block;
        line-height: 20px;
        padding: 0 5px;
        margin-left: 5px;
        background: #FF4348;
        color: #fff;
        font-size: 1rem;
    }

    .classify-list-content .none {
        display: none;
    }

    .classify-list-title .title-list .line .border-none {
        border-color: #fff;
    }
    /*search*/

    .search-page {
        height: 100%;
    }

    .search-header {
        height: 50px;
        line-height: 50px;
        padding: 0 0 0 8px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        background: #fff;
        border-bottom: solid 1px #ddd;
    }

    .search-input {
        float: left;
        width: 80%;
        height: 34px;
        line-height: 20px;
        margin: 7px 10px;
        padding: 5px 15px 5px 35px;
        border-radius: 17px;
        background: #eee url(http://img2.vipbcw.com/wap/svg/icon_search_3.svg) no-repeat 5px center;
        background-size: 10%;
    }

    .cancel-input {
        display: inline-block;
        width: 10%;
        line-height: 50px;
        text-align: center;
        font-size: 1.2rem;
        color: #3C4347;
    }

    .search-content {
        background: #fff;
    }

    .search-content .item {
        margin-left: 10px;
        padding-right: 10px;
        padding-bottom: 16px;
        border-bottom: solid 1px #f5f5f5;
    }

    .search-content h1 {
        height: 40px;
        line-height: 40px;
        font-size: 1.4rem;
        color: #3C4347;
    }

    .search-content h1:before {
        content: "|";
        color: #ff4f39;
        font-weight: bold;
        margin-right: 5px;
    }

    .search-content h1 i {
        font-size: 1.4rem;
    }

    .search-content .item:last-child {
        border-bottom: 0;
    }

    .search-content ul {
        background: #fff;
    }

    .search-content ul li {
        float: left;
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
        border: solid 1px #bbb;
        border-radius: 14px;
        margin-right: 10px;
        margin-top: 10px;
    }

    .search-content ul li a:active {
        color: rgba(60, 67, 71, 1);
    }

    .search-page .search-header {
        padding: 0;
    }

    .search-header .left-box {
        float: left;
        text-align: center;
        width: 10%;
    }

    .search-header .search-input {
        margin: 8px 0;
    }

    .left-box .icon-iconback {
        color: #3c4347;
        background: url(../../assets/images/ic_left.png) no-repeat center;
        background-size: contain;
        float: left;
        height: 100%;
        width: 2rem;
    }

    .icon-iconcartwhite:before {
        display: inline-block;
        content: "";
        width: 24px;
        height: 22px;
        background-image: url(http://img2.vipbcw.com/wap/icon_cart3_white.png);
        background-size: 100%;
    }

    .fixd-cart {
        width: 60px;
        height: 60px;
        overflow: hidden;
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 999;
        border-radius: 30px;
        background: #fff;
        text-align: center;
        line-height: 70px;
        box-shadow: 0 0 5px #999;
    }

    .fixd-cart a {
        display: block;
    }

    .iconfont {
        font-size: 2rem;
    }

    .iconfont {
        font-family: "iconfont" !important;
        font-size: 2rem;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-iconcart:before {
        display: inline-block;
        content: "";
        width: 24px;
        height: 22px;
        background-image: url(http://img2.vipbcw.com/wap/icon_cart3.png);
        background-size: 100%;
    }

    .fixd-cart em {
        position: absolute;
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        top: 10px;
        left: 55%;
        background: rgba(255,67,72,1);
        color: #fff;
        font-size: 1rem;
        text-align: center;
        line-height: 20px;
    }

    .classify-list-content li i {
        position: absolute;
        left: 2%;
        top: 0;
        width: 35%;
        height: 10%;
    }
</style>



// WEBPACK FOOTER //
// cateList.vue?2afe7099