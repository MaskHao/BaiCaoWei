<template>
    <div>
        <header>阅读</header>
        <div class="chi-content paddingBottom" style="padding-top:100px; ">
            <div class="tab-title">
                <ul v-if="titleText.length <= 3" class="tab-ul clearfix">
                    <li class="tab-li" v-bind:class="{'on':active == titleText.type}" v-for="titleText in titleText" :key="titleText" @click="getEatIndex(titleText.type)">
                      <img :src="titleText.image_logo"/>
                      <p>{{titleText.title}}</p>
                    </li>
                </ul>
              <swiper v-else class="tab-ul clearfix" :options="swiperTab">
                <swiper-slide class="tab-li" :class="{'on':active == titleText.type}" v-for="titleText in titleText" :key="titleText">
                  <div @click="getEatIndex(titleText.type)">
                    <img :src="titleText.image_logo"/>
                    <p>{{titleText.title}}</p>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
            <div class="tab-content">
                <div class="cp-tab-content on">
                    <ul>
                        <li v-for="(list,index) in content" :key="index">
                            <!-- /substance/detail?id=+'list.eat_id' -->
                          <a :href="'/substance/detail/'+list.eat_id">
                            <p class="title textHidden">{{list.title}}
                              <img v-if="list.title_icon" :src="list.title_icon"/>
                            </p>
                            <p class="desc textHidden">
                              <img v-if="list.description_icon" :src="list.description_icon"/>
                              {{list.description}}
                            </p>
                            <img class="img lazy" :src="list.imageUrl+'?imageView2/2/w/640'"/>
                            <div data-id="" class="data-box clearfix">
                              <span v-if="list.auther" class="author"><img :src="list.auther.avatar"/>{{list.auther.nickname}}</span>
                              <span class="data-li ping">{{list.comment_count}}</span>
                              <span @click="likeClick(list.eat_id,index,list.praise_count)" class="data-li like" :class="{'on':list.is_praise}">{{list.praise_count}}</span>
                            </div>
                          </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <footer-box></footer-box>
      <!--<homeIcon v-if="homeIcon != 0"></homeIcon>-->
      <vAlert ref='alertDialog'></vAlert>
    </div>
</template>

<script>
  import footerBox from '../../components/footerBox'
  import homeIcon from '../../components/homeIcon'
  import {getEatIndex,getCategory,eatitLike} from '../../service/getData'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import vAlert from '../../components/alertDialog'
  import {getSessionStore} from '../../assets/js/mUtils'

  export default {
    data () {
      return {
          content:'',
          titleText:[],
          active:1,
          swiperTab: {
            slidesPerView : 3.5
          },
        homeIcon:1
      }
    },
    methods:{
        getEatIndex(index){
          var that = this;
            getEatIndex(index).then((response) => {
              that.content = response.data.result_data.list
            })
          that.active = index
        },
      getCate(){
          var that = this;
          getCategory().then(response => {
            that.titleText = response.data.result_data.list;
            that.active = that.titleText[0].type;
            that.getEatIndex(that.active);
          })
      },
      likeClick(id,index,count,e){
        window.event? window.event.returnValue = false : e.preventDefault();
        eatitLike(id).then(response => {
          if(response.data.result_code == 0){
            this.content[index].is_praise = this.content[index].is_praise == 0 ? 1 : 0;
            if(Number(count) >= 0){
              this.content[index].praise_count = this.content[index].is_praise == 0 ? Number(count)-1:Number(count)+1
            }
          }else{
            this.$refs.alertDialog.alert(response.data.result_info);
          }
        })
      }
    },
    components: {
      swiper,
      swiperSlide,
      footerBox,
      vAlert,
      homeIcon
    },
    created(){
      this.homeIcon = getSessionStore('homeIcon');
      this.getCate();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*吃乎*/
header {width: 100%;height: 50px;background: #fff;position: fixed;text-align: center;font-size: 1.4rem;line-height: 50px;z-index: 99;color: rgba(60,67,71,1);border-bottom: solid 1px #e5e5e5;top: 0;
left: 0;}
.chi-content .tab-title .tab-ul{background:#f4f7fb}
.chi-content .tab-title{position:fixed;width:100%;height:50px;top:50px;left:0;z-index:99;}
.chi-content .tab-title .tab-li{float: left;width:33.33%;text-align: center;height:50px;padding:5px 0;background: #f4f7fb;}
.chi-content .tab-title .tab-li img{height:20px;width:20px;}
.chi-content .tab-title .tab-li p{line-height: 20px;}
.chi-content .tab-title .tab-li.on{background:#dcecff;}
.chi-content .tab-content li{position:relative;background:#fff;margin-bottom:10px;padding:5px 3%;}
.chi-content .tab-content li .title{padding:3px 2rem 3px 0;font-size: 1.4rem;font-weight: bold;display: inline-block;line-height: 2rem;color:#4a4a4a;position: relative;max-width: 100%}
.chi-content .tab-content li .title img{height: 1.4rem;width:auto;margin-left:3px;position: absolute; right: 0;top: 5px;}
.chi-content .tab-content li .desc img{height: 1.4rem;width:auto;margin-right:3px;}
.chi-content .tab-content li .desc{padding-bottom:8px;font-size: 1.2rem;color:#666;}
.chi-content .tab-content li .label{position: absolute;width:20%;top:5%;left:0;}
.chi-content .tab-content li .data-box{padding:8px 0;}
.chi-content .tab-content li .data-box .author{line-height: 2rem;color:#999;display: inline-block;}
.chi-content .tab-content li .data-box .author img{width: 2rem;height:2rem;border-radius: 1rem;overflow: hidden;margin-right:3px;}
.chi-content .tab-content .data-box .data-li{float: right;display: inline-block;height:2rem;line-height: 2rem;padding-left:2.2rem;margin-left:8px;}
.chi-content .tab-content .data-box .data-li.like{background: url("http://img2.vipbcw.com/wap/eat_like.png") no-repeat center left;background-size: 2rem auto;}
.chi-content .tab-content .data-box .data-li.like.on{background: url("http://img2.vipbcw.com/wap/eat_likeErr.png") no-repeat center left;background-size: 2rem auto;}
.chi-content .tab-content .data-box .data-li.ping{background: url("http://img2.vipbcw.com/wap/eat_ping.png") no-repeat center left;background-size: 2rem auto;}

</style>



// WEBPACK FOOTER //
// substance.vue?3e27015f