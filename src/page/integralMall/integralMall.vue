<template>
  <div class="integral-mall">
    <div class="header">
      <div class="left-box" @click="back()">
        <img src="../../assets/images/ic_left.png">
      </div>味豆商城
      <div class="right-box"></div>
    </div>
    <div class="integral-mall-content">
      <div class="index-flash">
        <div class="swiper-box">
          <swiper :options="bannerSwiper">
            <swiper-slide v-for="banner in banner_list" :key="banner">
              <a :href="banner.link_url">
                <img :src="banner.image_url+'?imageView2/1/w/750/h/300'" alt>
              </a>
            </swiper-slide>
            <!--<div class="swiper-pagination"></div>-->
          </swiper>
        </div>
      </div>
      <div class="mall-nav">
        <ul class="clearfix">
          <li>
            <router-link :to="{path : '/integralPeans'}">
              <img src="http://img2.vipbcw.com/wap/wd_icon1.png">味豆
              <i style="margin-left:3px;" v-html="integral"></i>
            </router-link>
          </li>
          <li>
            <router-link :to="{path : '/integralRecord'}">
              <img src="http://img2.vipbcw.com/wap/wd_icon2.png">兑换记录
            </router-link>
          </li>
        </ul>
      </div>
      <div
        class="mall-icon-nav"
        v-bind:class="{'col-3' : nav_list.length <= 3}"
        v-if="nav_list.length > 0"
      >
        <ul>
          <li v-for="value in nav_list" :key="value">
            <a :href="value.link">
              <img :src="value.image_url">
              <p v-html="value.nav_name"></p>
            </a>
          </li>
        </ul>
      </div>
      <div class="img-box" v-if="center_list.length > 0">
        <div class="swiper-container" :class="{'swiper-img': center_list.length > 1}">
          <swiper :option="imgSwiper" class="swiper-wrapper">
            <swiper-slide v-for="value in center_list" :key="value" class="swiper-slide">
              <a :href="value.link_url">
                <img :src="value.image_url+'?imageView2/2/w/640/'">
              </a>
            </swiper-slide>
          </swiper>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="level-tab-tit swiper-container" v-if="level_list.length > 0">
        <swiper v-if="level_list.length >= 5" :options="tabSwiper" class="clearfix swiper-wrapper">
          <swiper-slide
            v-for="value in level_list"
            :key="value"
            :value="value.level_type"
            class="swiper-slide"
            :class="{'on' : value.level_type == levelType}"
          >
            <div @click="tabClick(value.level_type)">
              <img v-if="value.level_img != ''" :src="value.level_img">
              <p v-else v-html="value.level_tip"></p>
            </div>
          </swiper-slide>
        </swiper>
        <ul v-else>
          <li
            v-for="value in level_list"
            :key="value"
            class="swiper-slide"
            :class="{'on' : value.level_type == levelType}"
            @click="tabClick(value.level_type)"
          >
            <img v-if="value.level_img != ''" :src="value.level_img">
            <p v-else v-html="value.level_tip"></p>
          </li>
        </ul>
      </div>
      <div class="level-tab-con" v-if="nowGoods.length > 0">
        <ul class="clearfix">
          <li v-for="value in nowGoods" :key="value">
            <router-link :to="{ path : '/integral-mall/goods', query:{goods_id:value.goods_id} }">
              <img v-lazy="value.goods_img+'?imageView2/1/w/320/h/320'">
              <p class="pro-name" v-html="value.goods_name"></p>
              <p class="pro-price clearfix">
                <i v-html="value.integration_number"></i>
                <del v-if="value.shop_price != 0" v-html="'原价'+value.shop_price"></del>
              </p>
              <p class="pro-cart">兑换</p>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
import { integralMallBanner, integralMallGoods } from '../../service/getData'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Valert from '../../components/alertDialog.vue'
export default {
  data () {
    return {
      banner_list: [],
      integral: 0,
      center_list: [],
      nav_list: [],
      level_list: [],
      levelType: 0,
      goodsList: {},
      goodsPage: {},
      nowPage: {},
      nowGoods: [],
      page: 0,
      isLoad: true,
      bannerSwiper: {
        slidesPerView: 1,
        autoplay: 5000,
        spaceBetween: 30,
        loop: true
      },
      imgSwiper: {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        autoplay: 5000,
        paginationClickable: true,
        spaceBetween: 30,
        loop: true
      },
      tabSwiper: {
        slidesPerView: 4.5
      },

    }
  },
  components: {
    swiper,
    swiperSlide,
    Valert,
  },
  created () {
    this.getIndexBanner();
  },
  mounted () {
    window.addEventListener('scroll', () => {
      if (parseInt(window.scrollY) + parseInt(window.screen.height) > document.documentElement.scrollHeight - 100 && this.isLoad) {
        if (this.nowPage.list_ordinal < this.nowPage.list_count) {
          this.goodsPage[this.levelType].list_ordinal = ++this.nowPage.list_ordinal;
          this.isLoad = false;
          this.getMoreGoods();
        }
      }
    });
  },
  updated () { },
  methods: {
    back () {
      this.$router.go(-1);
    },
    getIndexBanner () {
      integralMallBanner().then(res => {
        if (res.data.result_code == 0) {
          let data = res.data.result_data;
          this.banner_list = data.banner_list ? data.banner_list : [];
          this.integral = data.integration ? data.integration : 0;
          this.center_list = data.center_list ? data.center_list : [];
          this.nav_list = data.nav_list ? data.nav_list : [];
          this.level_list = data.level_list ? data.level_list : [];
          this.levelType = data.level_list[0].level_type;
          this.tabClick(this.level_list[0].level_type);
        } else {
          this.$refs.alertTip.alert(res.data.result_info);
        }
      })
    },
    getMallGoods () {
      var _type = this.levelType;
      if (this.goodsList[_type] == undefined) {
        integralMallGoods(this.levelType, this.nowPage.list_ordinal).then(res => {
          if (res.data.result_code == 0) {
            this.goodsList[_type] = res.data.result_data.goods_list;
            this.goodsPage[_type] = res.data.result_data.list_info;
            this.nowGoods = this.goodsList[_type];
            this.nowPage = this.goodsPage[_type];
          } else {
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      } else {
        this.nowGoods = this.goodsList[_type];
        this.nowPage = this.goodsPage[_type];
      }
    },
    tabClick (type) {
      this.levelType = type;
      if (this.goodsPage[type] == undefined) {
        this.goodsPage[type] = {
          list_count: 0,
          list_ordinal: 0
        }
        this.nowPage = this.goodsPage[type];
      } else {
        this.nowPage = this.goodsPage[type];
      }
      this.getMallGoods();
    },
    getMoreGoods () {
      let _type = this.levelType;
      integralMallGoods(this.levelType, this.nowPage.list_ordinal).then(res => {
        if (res.data.result_code == 0) {
          for (let i in res.data.result_data.goods_list) {
            //              Vue.set(this.goodsList[_type],this.goodsList[_type].length,res.data.result_data.goods_list[i])
            this.goodsList[_type].push(res.data.result_data.goods_list[i]);
          }
          this.goodsPage[_type] = res.data.result_data.list_info;
          this.nowGoods = this.goodsList[_type];
          this.nowPage = this.goodsPage[_type];
        } else {
          this.$refs.alertTip.alert(res.data.result_info);
        }
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
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
.header .left-box {
  position: absolute;
  left: 0;
  top: 0;
  display: inline-block;
  padding-left: 2%;
  text-align: left;
}
.header .left-box img {
  width: 40%;
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

.integral-mall-content {
  margin-top: 50px;
  background-color: #eee;
}
.index-flash {
  position: relative;
  overflow: hidden;
}
.integral-mall .mall-nav {
  background: #fff;
  margin-bottom: 7px;
}
.integral-mall .mall-nav li img {
  width: 16px;
  margin-right: 5px;
}
.integral-mall .mall-nav li i {
  color: #ff4348;
}
.integral-mall .mall-nav li {
  width: 50%;
  float: left;
  padding: 10px 0;
  text-align: center;
  height: auto;
  line-height: normal;
}
.integral-mall .mall-nav li a {
  display: block;
  color: #3c4347;
  height: 20px;
  line-height: 20px;
  border-right: solid 1px #bababa;
}
.integral-mall .mall-nav li:last-child a {
  border-right: 0;
}
.integral-mall .img-box {
  margin-top: 7px;
}
.integral-mall .mall-icon-nav ul {
  display: flex;
  background: #fff;
}
.integral-mall .mall-icon-nav li {
  flex: 1;
  text-align: center;
  padding: 15px 0;
}
.integral-mall .mall-icon-nav.col-3 li img {
  width: 35%;
}
.integral-mall .mall-icon-nav li img {
  width: 50%;
  margin-bottom: 5px;
}
.integral-mall .level-tab-tit {
  background: #fff;
  margin: 7px auto 0;
}
.integral-mall .level-tab-tit li,
.integral-mall .level-tab-tit .swiper-slide {
  float: left;
  width: 25%;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.integral-mall .level-tab-tit li.on,
.integral-mall .level-tab-tit .swiper-slide.on {
  border-bottom: solid 2px #ff4f39;
  color: #ff4f39;
}
.integral-mall .level-tab-con {
  padding-bottom: 10px;
}
.integral-mall .level-tab-con li {
  width: 45.5%;
  float: left;
  padding: 10px;
  margin: 10px 3% 0;
  background: #fff;
}
.integral-mall .level-tab-con .pro-name {
  color: #333;
  height: 3.2rem;
  line-height: 1.6rem;
  overflow: hidden;
  margin: 5px 0 0;
}
.integral-mall .level-tab-con li:nth-child(even) {
  margin-left: 1.5%;
}
.integral-mall .level-tab-con li:nth-child(odd) {
  margin-right: 1.5%;
}
.integral-mall .level-tab-con .pro-price {
  height: 2rem;
  line-height: 2rem;
}
.integral-mall .level-tab-con .pro-cart {
  width: 50%;
  height: 2.4rem;
  line-height: 2.4rem;
  border-radius: 2rem;
  background: #ff4f38;
  color: #fff;
  margin: 5px auto 0;
  text-align: center;
}
.integral-mall .level-tab-con .pro-price i {
  font-size: 1.4rem;
  color: #ff4f38;
}
.integral-mall .level-tab-con .pro-price del {
  color: #979797;
  float: right;
}
.integral-mall .level-tab-con .pro-price i:after {
  content: "味豆";
  font-size: 1.2rem;
  color: #979797;
  padding-left: 5px;
}
</style>



// WEBPACK FOOTER //
// integralMall.vue?1300ed8b