<template>
  <div class="con">
      <div class="container">
        <router-link :to="{ path: '/data-list/search'}" class="classify"><span class="input-box cate-index-box"><em>{{searchWord.word}}</em></span></router-link>
        <div class="classify-top">
            <div class="classify-bottom">
                <ul class="clear">
                    <li v-for="list in content" :key="list">
                        <router-link v-bind:to="{path: '/data-list/list-goods',query: {id: list.cat_id,name:list.cat_name}}">
                            <img v-lazy="list.image_url+'?imageView2/2/w/320'" alt="">
                        </router-link>
                        <p>{{list.cat_name}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <footer-box></footer-box>
    <!--<homeIcon v-if="homeIcon != 0"></homeIcon>-->
  </div>
</template>

<script>
  import {getGoodsCategory,homeTab} from '../../service/getData'
  import footerBox from '../../components/footerBox'
  import homeIcon from '../../components/homeIcon'
  import {getSessionStore} from '../../assets/js/mUtils'

  export default {
    data () {
      return {
        content: null,
          searchWord:'',
        homeIcon:1
      }
    },
    methods:{

    },
    components: {
      footerBox,
      homeIcon
    },
    created(){
      this.homeIcon = getSessionStore('homeIcon');
        getGoodsCategory().then((response) => {//获取页面数据
            this.content = response.data.result_data.bottom
        })
        homeTab().then((res) => {
            this.searchWord = res.data.result_data.default_search_words_new
        })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .con {height: 100%;}
    /*classify*/
    .classify{background: #ff4f39;border-bottom:solid 1px #efefef;position: relative;padding:8px 5%;display: block}
    .classify .input-box { display: block; height: 34px; line-height: 34px; border-radius: 17px; color: #ff4f39;}
    .classify .input-box em { display: inline-block; height: 34px; line-height: 34px; padding-left: 30px; font-size: 1.2rem; background: url('http://img2.vipbcw.com/wap/icon_search_3.png') no-repeat 5px center; background-size: 20px;}
    .classify-top {overflow: hidden;}
    .classify-top h1{ color: #333;background: #fff;text-align: center;padding:15px 0;}
    .classify-top h1 img{width:40%;}
    .classify-top h1 p{font-size: 1rem;}
    .classify-top-flash li { width: 80%; overflow: hidden;}
    .classify-bottom {margin: 10px 0 0;}
    .classify-bottom ul { padding: 0 10px;overflow: hidden;}
    .classify-bottom ul li { float: left; width: 25%;text-align: center;margin:0 4.1% 10px;max-height: 170px;overflow: hidden;border-radius: 5px;}
    .classify-bottom ul li span { display: block;border-radius: 50%;margin: 0 auto;}
    .classify-bottom ul li img { width: 100%;vertical-align: middle;}
    .classify-bottom ul li p { padding: 8px 0; font-size: 1.3rem;color: #c7c7c7;}
    .classify-top .index-flash{padding-bottom:15px;background:#fff;}

    .cate-index-box.input-box{padding-top:0;background-color: #FFF;}
    .cate-container.container{margin-top:0;}

    .container {margin-top: 0;padding-bottom:55px;background: #fff;}
    .container .pro_ul{margin-top:10px;}
    .container .pro_ul ul {overflow: hidden;background-color: #fff;}
    .container .pro_ul ul li {float: left;width: 20%;text-align: center;font-size: 1.2rem;padding:10px 0;position: relative;}
    .container .pro_ul ul li a {display: block;}
    .container .pro_ul li i{display: inline-block;width:20px;height:20px;overflow: hidden;}
    .container .pro_ul ul li .detail {margin-top: 3%;}
</style>



// WEBPACK FOOTER //
// cate.vue?1ad00f89