<template>
  <div class="footer-box">
    <ul>
      <router-link to="/home/index" tag="li">
        <img v-if="$route.path == '/home/index' && bottomIcon[0].image_url_select" :src="bottomIcon[0].image_url_select"/>
        <img v-else :src="bottomIcon[0].image_url"/>
        <p>{{bottomIcon[0].nav_name}}</p>
      </router-link>
      <router-link to="/data-list/category" tag="li" >
        <img v-if="$route.path == '/data-list/category' && bottomIcon[1].image_url_select" :src="bottomIcon[1].image_url_select"/>
        <img v-else :src="bottomIcon[1].image_url"/>
        <p>{{bottomIcon[1].nav_name}}</p>
      </router-link>
      <router-link to="/substance/index" tag="li">
        <img v-if="$route.path == '/substance/index' && bottomIcon[2].image_url_select" :src="bottomIcon[2].image_url_select"/>
        <img v-else :src="bottomIcon[2].image_url"/>
        <p>{{bottomIcon[2].nav_name}}</p>
      </router-link>
      <router-link v-if="isBindPhone" to="/user-info/bind-phone" tag="li">
        <img v-if="$route.path == '/user-event/list-cart' && bottomIcon[3].image_url_select" :src="bottomIcon[3].image_url_select"/>
        <img v-else :src="bottomIcon[3].image_url"/>
        <p>{{bottomIcon[3].nav_name}}</p>
        <i v-if="cartNum > 0">{{cartNum}}</i>
      </router-link>
      <router-link v-else to="/user-event/list-cart" tag="li">
        <img v-if="$route.path == '/user-event/list-cart' && bottomIcon[3].image_url_select" :src="bottomIcon[3].image_url_select"/>
        <img v-else :src="bottomIcon[3].image_url"/>
        <p>{{bottomIcon[3].nav_name}}</p>
        <i v-if="cartNum > 0 && $route.path != '/user-event/list-cart'">{{cartNum}}</i>
      </router-link>
      <router-link v-if="isBindPhone" to="/user-info/bind-phone" tag="li">
        <img v-if="$route.path == '/user-center/user-center' && bottomIcon[4].image_url_select" :src="bottomIcon[4].image_url_select"/>
        <img v-else :src="bottomIcon[4].image_url"/>
        <p>{{bottomIcon[4].nav_name}}</p>
      </router-link>
      <router-link v-else to="/user-center/user-center" tag="li">
        <img v-if="$route.path == '/user-center/user-center' && bottomIcon[4].image_url_select" :src="bottomIcon[4].image_url_select"/>
        <img v-else :src="bottomIcon[4].image_url"/>
        <p>{{bottomIcon[4].nav_name}}</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
import {getBottomBanner, cartGoods} from '../service/getData'
import {setSessionStore, getSessionStore} from '../assets/js/mUtils'
export default {
  data () {
    return {
      bottomIcon: [
        {
          'image_url': '',
          'image_url_select': ''
        },
        {
          'image_url': '',
          'image_url_select': ''
        },
        {
          'image_url': '',
          'image_url_select': ''
        },
        {
          'image_url': '',
          'image_url_select': ''
        },
        {
          'image_url': '',
          'image_url_select': ''
        }

      ],
      cartNum: 0,
      isBindPhone: 0
    }
  },
  created () {
    if (getSessionStore('bottomIcon') == null) {
      getBottomBanner().then(promise => {
        this.bottomIcon = promise.data.result_data.banner
        setSessionStore('bottomIcon', promise.data.result_data)
      })
    } else {
      this.bottomIcon = JSON.parse(getSessionStore('bottomIcon')).banner
    }
    this.getCarNum()
  },
  methods: {
    getCarNum () {
      var that = this
      cartGoods().then((response) => {
        if (response.data.result_code === '1003') {
          if (typeof (response.data.result_data.openid) !== 'undefined') {
            setSessionStore('bindInfo', response.data.result_data)
            // 跳临时用户绑定手机号页面
            that.isBindPhone = 1
          }
        } else {
          if (response.data.result_data.total_goods_count > 99) {
            that.cartNum = '99+'
          } else {
            that.cartNum = response.data.result_data.total_goods_count
          }
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .footer-box{position: fixed;width:100%;height:50px;left:0;bottom:0;z-index: 888;background:#fff;box-shadow: 1px 0 1px 1px #e5e5e5;
border-top: solid 1px #e5e5e5}
  .footer-box ul{display: flex;}
  .footer-box ul li{flex: 1;text-align: center;padding:5px 0;position:relative;}
  .footer-box ul li.active,.footer-box ul li.active p{color:#ff4f39;}
  .footer-box ul li img{width:25px;}
  .footer-box ul li p{color: rgba(60, 67, 71, 0.5);line-height:15px;}
  .footer-box ul li i{position:absolute;width:16px;height:16px;border-radius:50%;background:#ff4f39;color:#fff;line-height:16px;font-size:1rem;top:2px;left:55%;text-align:center;}
</style>

// WEBPACK FOOTER //
// footerBox.vue?58b1208d
