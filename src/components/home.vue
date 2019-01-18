<template>
  <div class="index-body home-body">
    <div class="index-nav">
      <header class="clear">
        <router-link to="/data-list/search" class="search fr">
          <img src="http://img2.vipbcw.com/wap/icon_search_2.png">
        </router-link>
      </header>
      <div class="nav swiper-container nav-swiper">
        <swiper :options="swiperTab">
          <template v-if="tabItem.title">
            <swiper-slide
              v-for="(tabItem,tabItemIndex) in tabItems"
              :key="tabItemIndex"
              :class="{cur:(tabItem.id == tab_id  )}"
            >
              <a v-if="tabItem.url" :href="tabItem.url" v-cloak>{{tabItem.title}}</a>
              <span @click="clickTabItem(tabItem.id,tabItem.url)" v-else v-cloak>{{tabItem.title}}</span>
            </swiper-slide>
          </template>

          <swiper-slide v-else :class="{cur:(tabItem.id == tab_id)}" :tabItemId="tabItem.id">
            <a v-if="tabItem.url" :href="tabItem.url" v-cloak>
              <img :src="tabItem.image_url" alt>
            </a>
            <span @click="clickTabItem(tabItem.id,tabItem.url)" v-else v-cloak>
              <img :src="tabItem.image_url" alt>
            </span>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="tab_lists">
      <!--<div class="loading" v-show="loading">loading...</div>-->
      <div class="loading" v-show="loading">
        <img style="width:30%;" src="../assets/images/loading.gif" alt>
      </div>
      <div class="tab_list" v-show="show">
        <div
          v-for="(tabContent,tabContentIndex) in tabContentLists[tab_id]"
          :key="tabContentIndex"
          :backgroundImage="tabContent.background_image != '' ? tabContent.background_image : ''"
        >
          <div
            v-if="tabContent.type_id == '1'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="swiper-box template1">
              <swiper :options="bannerSwiper">
                <swiper-slide v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <a
                    :href="tabContentLi.skip_url == 'goto-AppStore' ? 'http://www.vipbcw.com/app_download.html?_f=wxBanner' : tabContentLi.skip_url"
                  >
                    <img :src="tabContentLi.image_url+'?imageView2/2/w/640'" alt>
                  </a>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
              <!--<div class="swiper-pagination"></div>-->
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '2'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="model_m2">
              <ul
                :class="{more:tabContent.data_list.length == '5' || tabContent.data_list.length == '10'}"
              >
                <li class="icon_4" v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <a :href="tabContentLi.skip_url">
                    <img v-lazy="tabContentLi.image_url+'?imageView2/2/w/100'" alt>
                    <p v-cloak>{{tabContentLi.special_name}}</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '3'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="model_pro3 template3">
              <ul>
                <li v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <router-link
                    :to="{ path :'/data-list/detail-goods',query : { id : tabContentLi.goods_id } }"
                    :href="tabContentLi.skip_url"
                  >
                    <div class="pro_img">
                      <img :src="tabContentLi.image_url+'?imageView2/1/w/320/h/320'" alt>
                    </div>
                    <div class="pro_dtl">
                      <div class="pro_name textHidden" v-cloak>
                        {{tabContentLi.goods_name}}
                        <img
                          v-if="tabContentLi.goods_little_icon"
                          :src="tabContentLi.goods_little_icon"
                          alt
                        >
                      </div>
                      <div class="pro_desc" v-cloak>{{tabContentLi.goods_describe}}</div>
                      <div class="pro_price" v-cloak>
                        ¥{{tabContentLi.goods_price}}
                        <del
                          v-if="tabContentLi.market_price != 0"
                        >¥{{tabContentLi.market_price}}</del>
                      </div>
                    </div>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '4'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="model_pro4 template4">
              <ul>
                <li v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <!--<a :href="tabContentLi.skip_url">-->
                  <router-link
                    :to="{ path : '/data-list/detail-goods',query : { id : tabContentLi.goods_id } }"
                  >
                    <div class="pro_name textHidden" v-cloak>{{tabContentLi.goods_name}}</div>
                    <div class="pro_desc textHidden" v-cloak>{{tabContentLi.goods_describe}}</div>
                    <div class="pro_price">
                      <span v-cloak>¥{{tabContentLi.goods_price}}</span>
                    </div>
                    <div class="pro_img">
                      <img v-lazy="tabContentLi.image_url+'?imageView2/1/w/320/h/320'" alt>
                    </div>
                    <!--</a>-->
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '5'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="swiper-box template5">
              <swiper
                :options="productSwiper"
                class="product-swiper"
                :class="{'more' : tabContent.more_url != ''}"
              >
                <swiper-slide class="swiper-slide" v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <router-link
                    :to="{ path : '/data-list/detail-goods',query : { id : tabContentLi.goods_id } }"
                  >
                    <img
                      class="pro_img"
                      v-lazy="tabContentLi.image_url+'?imageView2/1/w/320/h/320'"
                    >
                    <p class="pro_name textHidden" v-cloak>{{tabContentLi.goods_name}}</p>
                    <p class="pro_price" v-cloak>
                      ¥{{tabContentLi.goods_price}}
                      <del
                        v-if="tabContentLi.market_price != 0"
                      >¥{{tabContentLi.market_price}}</del>
                    </p>
                  </router-link>
                </swiper-slide>
                <a :href="tabContent.more_url" class="more-link">查看更多</a>
              </swiper>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '6'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="template6">
              <a
                v-for="tabContentLi in tabContent.data_list" :key="tabContentLi"
                :href="tabContentLi.skip_url ? tabContentLi.skip_url : 'javascript:void(0)'"
              >
                <img :src="tabContentLi.image_url+'?imageView2/2/w/640'" alt>
              </a>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '7'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="model_m3 template7">
              <i v-for="tabContentLi in tabContent.data_list" :key="tabContentLi" class="module-left">
                <a :href="tabContentLi.skip_url">
                  <img :src="tabContentLi.image_url">
                </a>
              </i>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '8'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="check_length" v-if="tabContent.data_list.length == 3">
              <div class="module_title" v-if="tabContent.title" v-cloak>
                <b></b>
                {{tabContent.title}}
                <em>/</em>
                <span v-cloak>{{tabContent.describe}}</span>
              </div>
              <div class="model_m4 template8">
                <i class="module-left">
                  <a
                    :href="(tabContent.data_list[0].skip_url).indexOf('time-to-buy') > 0 ? 'http://www.vipbcw.com/app_download.html?_f=timeToBuy': tabContent.data_list[0].skip_url"
                  >
                    <img
                      style="border-bottom:1px solid #eee;"
                      :src="tabContent.data_list[0].image_url"
                      alt
                    >
                  </a>
                  <a
                    :href="(tabContent.data_list[1].skip_url).indexOf('time-to-buy') > 0 ? 'http://www.vipbcw.com/app_download.html?_f=timeToBuy': tabContent.data_list[1].skip_url"
                  >
                    <img :src="tabContent.data_list[1].image_url" alt>
                  </a>
                </i>
                <i class="module-right">
                  <a
                    :href="(tabContent.data_list[2].skip_url).indexOf('time-to-buy') > 0 ? 'http://www.vipbcw.com/app_download.html?_f=timeToBuy': tabContent.data_list[2].skip_url"
                  >
                    <img
                      style="border-left:1px solid #eee;"
                      :src="tabContent.data_list[2].image_url"
                      alt
                    >
                  </a>
                </i>
              </div>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '9'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="check_length" v-if="tabContent.data_list.length == 3">
              <div class="module_title" v-if="tabContent.title" v-cloak>
                <b></b>
                {{tabContent.title}}
                <em>/</em>
                <span v-cloak>{{tabContent.describe}}</span>
              </div>
              <div class="model_m3 template9">
                <i class="module-left">
                  <a
                    v-if="tabContent.data_list[0].spike_list && timeToBuy"
                    href="http://www.vipbcw.com/app_download.html?_f=timeToBuy"
                  >
                    <img :src="timeToBuy.clock_spike_image" alt>
                    <p v-if="countDown.txt" class="textHidden">正在疯狂秒杀中……</p>
                    <p v-else class="p2 textHidden">
                      <i>{{countDown.h}}</i>:
                      <i>{{countDown.m}}</i>:
                      <i>{{countDown.s}}</i>
                    </p>
                  </a>
                  <a v-else :href="tabContent.data_list[0].skip_url">
                    <img :src="tabContent.data_list[0].image_url" alt>
                  </a>
                </i>
                <i class="module-right">
                  <a :href="tabContent.data_list[1].skip_url">
                    <img :src="tabContent.data_list[1].image_url" alt>
                  </a>
                  <a :href="tabContent.data_list[2].skip_url">
                    <img :src="tabContent.data_list[2].image_url" alt>
                  </a>
                </i>
              </div>
            </div>
          </div>

          <div
            v-if="tabContent.type_id =='10'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="model_pro10 template10 swiper-container" ref="template10_height">
              <swiper :options="commentSwiper" class="commentSwiper">
                <swiper-slide v-for=" tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <a :href="tabContentLi.skip_url">
                    <img :src="tabContentLi.image_url+'?imageView2/2/w/750'" alt>
                  </a>
                </swiper-slide>
              </swiper>
            </div>
          </div>

          <div
            v-if="tabContent.type_id == '11'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="template11 swiper-box">
              <swiper :options="articleSwiper" class="article-swiper">
                <swiper-slide v-for="tabContentLi in tabContent.data_list" :key="tabContentLi" class="swiper-slide">
                  <a :href="tabContentLi.skip_url">
                    <img :src="tabContentLi.image_url">
                  </a>
                </swiper-slide>
              </swiper>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '12'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="template12 swiper-box">
              <swiper :options="goodsSwiper">
                <swiper-slide v-for="tabContentLi in tabContent.data_list" :key="tabContentLi" class="swiper-slide">
                  <router-link
                    class="clearfix"
                    :to="{ path : '/data-list/detail-goods' ,query:{ id : tabContentLi.goods_id}}"
                  >
                    <img v-lazy="tabContentLi.image_url+'?imageView2/1/w/320/h/320'">
                    <div class="right-box">
                      <div @click.stop="addToCart(tabContentLi.goods_id)" class="buy-btn"></div>
                      <p class="g-name textHidden">{{tabContentLi.goods_name}}</p>
                      <p
                        class="g-desc textHidden"
                        v-if="tabContentLi.goods_describe"
                      >{{tabContentLi.goods_describe}}</p>
                      <p class="g-price">
                        ¥{{tabContentLi.goods_price}}
                        <del>¥{{tabContentLi.market_price}}</del>
                      </p>
                    </div>
                  </router-link>
                </swiper-slide>
              </swiper>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '13'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="template13 swiper-box">
              <ul class="clearfix">
                <li v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <a :href="tabContentLi.skip_url">
                    <div class="tit-box">
                      <p v-if="tabContentLi.special_name" v-html="tabContentLi.special_name"></p>
                      <p
                        class="p2"
                        v-if="tabContentLi.goods_describe"
                        v-html="tabContentLi.goods_describe"
                      ></p>
                    </div>
                    <img :src="tabContentLi.image_url+'?imageView2/2/w/250'">
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '14'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'surl'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="template14 swiper-box">
              <swiper :options="pdSwiper" style="padding-right:10px;">
                <swiper-slide v-for="tabContentLi in tabContent.data_list" :key="tabContentLi" class="pdSwiper-slide">
                  <a
                    v-if="tabContentLi.spike_list && timeToBuy"
                    href="http://www.vipbcw.com/app_download.html?_f=timeToBuy"
                  >
                    <img v-lazy="timeToBuy.clock_spike_image+'?imageView2/1/w/250/h/250'">
                    <p class="p1 textHidden" v-html="timeToBuy.clock_spike_desc"></p>
                    <p v-if="countDown.txt" class="textHidden">正在疯狂秒杀中……</p>
                    <p v-else class="p2 textHidden">
                      <i>{{countDown.h}}</i>:
                      <i>{{countDown.m}}</i>:
                      <i>{{countDown.s}}</i>后结束
                    </p>
                  </a>
                  <a v-else :href="tabContentLi.skip_url">
                    <img v-lazy="tabContentLi.image_url+'?imageView2/1/w/250/h/250'">
                    <p class="p1 textHidden" v-html="tabContentLi.special_name"></p>
                    <p class="textHidden" v-html="tabContentLi.goods_describe"></p>
                  </a>
                </swiper-slide>
              </swiper>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '15'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="template15 swiper-box">
              <ul class="clearfix">
                <li v-for="tabContentLi in tabContent.data_list" :key="tabContentLi">
                  <router-link
                    class="clearfix"
                    :to="{ path : '/data-list/detail-goods' ,query:{ id : tabContentLi.goods_id}}"
                  >
                    <img v-lazy="tabContentLi.image_url + '?imageView2/2/w/640'">
                    <p class="g-price">
                      ¥{{tabContentLi.goods_price}}
                      <del>¥{{tabContentLi.market_price}}</del>
                    </p>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          <div
            v-if="tabContent.type_id == '16'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="saleProLists">
              <ul>
                <li v-for="tabContentPro in tabContent.data_list" :key="tabContentPro">
                  <router-link
                    :to="{ path : '/data-list/detail-goods' ,query:{ id : tabContentPro.goods_id} }"
                  >
                    <img class="lazy" v-lazy="tabContentPro.image_url+'?imageView2/2/w/640'" alt>
                    <p class="textHidden" v-cloak>{{tabContentPro.goods_name}}</p>
                    <p class="p-desc">
                      <span class="textHidden">{{tabContentPro.goods_describe}}</span>
                      <i v-cloak>¥{{tabContentPro.goods_price}}</i>
                    </p>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>

          <!--      新闻头条-->
          <div
            v-if="tabContent.type_id == '10001'"
            :style="{marginTop:tabContent.margin_up/2+'px',marginBottom:tabContent.margin_down/2+'px',marginLeft:tabContent.margin_left/2+'px',marginRight:tabContent.margin_right/2+'px',background:'#fff url'+'('+tabContent.background_image+') no-repeat center',backgroundSize:'cover'}"
          >
            <div class="module_title" v-if="tabContent.title" v-cloak>
              <b></b>
              {{tabContent.title}}
              <em>/</em>
              <span v-cloak>{{tabContent.describe}}</span>
            </div>
            <div class="model_news template10001">
              <div class="news_img">
                <img :src="tabContent.image_url" alt>
              </div>
              <div class="swiper-container">
                <swiper :options="newsSwiper" class="news_scroll news-swiper">
                  <swiper-slide
                    class="news_scroll_list swiper-slide"
                    v-for="tabContentLi in tabContent.data_list"
                    :key="tabContentLi"
                  >
                    <a :href="tabContentLi.skip_url">
                      <p class="textHidden">
                        <img v-if="tabContentLi.chihu_banner" :src="tabContentLi.chihu_banner" alt>
                        <span v-cloak>{{tabContentLi.chihu_title}}</span>
                      </p>
                    </a>
                  </swiper-slide>
                </swiper>
              </div>
              <div class="transparent"></div>
            </div>
          </div>
        </div>
        <!--      特卖列表-->
        <div class="saleProLists" v-if="sale_list">
          <img v-if="saleHead.image_url" :src="saleHead.image_url">
          <ul>
            <li v-for="tabContentPro in sale_list" :key="tabContentPro">
              <router-link
                :to="{ path : '/data-list/detail-goods' ,query:{ id : tabContentPro.goods_id} }"
              >
                <img class="lazy" v-lazy="tabContentPro.image_url+'?imageView2/2/w/640'" alt>
                <p class="textHidden" v-cloak>{{tabContentPro.goods_name}}</p>
                <p class="p-desc">
                  <span class="textHidden">{{tabContentPro.goods_describe}}</span>
                  <i v-cloak>¥{{tabContentPro.goods_price}}</i>
                </p>
              </router-link>
            </li>
          </ul>
        </div>
        <!--      商品列表-->
        <div class="tabContentProLists" v-if="good_lists">
          <img v-if="tabContentProHead.image_url" :src="tabContentProHead.image_url">
          <ul class="model_pro">
            <li v-for="(tabContentPro, index) in good_lists" :key="index">
              <router-link
                :to="{ path : '/data-list/detail-goods' ,query:{ id : tabContentPro.id} }"
              >
                <!--:href="'/data-list/detail-goods?id='+tabContentPro.id"-->
                <div class="pro_img">
                  <img
                    class="lazy"
                    v-lazy="tabContentPro.goods_img+'?imageView2/1/w/300/h/300'"
                    alt
                  >
                </div>
                <div class="key-word textHidden" v-cloak>{{tabContentPro.goods_keyword}}</div>
                <div class="name" v-cloak>{{tabContentPro.goods_name}}</div>
                <div class="price">
                  ¥
                  <span v-cloak>
                    {{tabContentPro.shop_price}}
                    <del
                      v-if="tabContentPro.market_price != 0"
                    >¥{{tabContentPro.market_price}}</del>
                  </span>
                </div>
              </router-link>
              <div @click="addToCart(tabContentPro.id)" class="buy-btn"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
import { homeTab, indexModuleData, productList, clickTab, addCart, saleList } from '../service/getData'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import Valert from './alertDialog'
import { DateToString } from '../assets/js/mUtils'

export default {
  data () {
    return {
      tabItems: {},
      tab_id: 0,
      tabContentLists: {},
      tabContentIndex: 0,
      tabContentProLists: {}, // 商品列表--总
      tabContentTotalPage: {}, // 商品列表总页数
      countPage: {}, // 商品列表当前页
      tabContentProHeadObj: {}, // 商品列表标题==总
      tabContentProHead: {}, // 商品列表标题==当前
      page: 1, // 页面滚动到底部标识
      saleListObj: {}, // 特卖商品列表--总
      saleTotalPage: {}, // 特卖商品总页数
      salePage: {}, // 特卖商品当前页
      saleHeadObj: {}, // 特卖商品标题--总
      saleHead: {}, // 特卖商品标题--当前
      can_load: true,
      loading: true,
      show: false,
      flag: true,
      good_lists: [], // 商品列表
      sale_list: [], // 特卖商品列表
      bannerSwiper: {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        autoplay: 5000,
        paginationClickable: true,
        spaceBetween: 30,
        loop: true
      },
      productSwiper: {
        slidesPerView: 2.6,
        centeredSlides: false,
        slidesPerGroup: 1,
        freeModeMomentum: false
      },
      articleSwiper: {
        slidesPerView: 1.6,
        centeredSlides: false,
        slidesPerGroup: 1,
        freeModeMomentum: false
      },
      swiperTab: {
        slidesPerView: 4.5
      },
      commentSwiper: {
        direction: 'vertical',
        slidesPerView: 2,
        autoplay: 4000,
        loop: true,
        onlyExternal: true,
        loopAdditionalSlides: 2,
        slidesPerGroup: 2
      },
      newsSwiper: {
        direction: 'vertical',
        slidesPerView: 2,
        autoplay: 4000,
        loop: true,
        onlyExternal: true,
        loopAdditionalSlides: 2
      },
      goodsSwiper: {
        slidesPerView: 1.1,
        centeredSlides: false,
        slidesPerGroup: 1,
        freeModeMomentum: false
      },
      pdSwiper: {
        slidesPerView: 2.6,
        centeredSlides: false,
        slidesPerGroup: 1,
        spaceBetween: 10,
        freeModeMomentum: false
      },
      timeToBuyList: [], // 限时购数据
      timeToBuy: null, // 当前场次限时购
      countDown: {
        h: 0,
        m: 0,
        s: 0,
        txt: ''
      } // 限时购倒计时
    }
  },
  components: {
    swiper,
    swiperSlide,
    Valert
  },
  created () {
    setTimeout(() => {
      this.loading = false
      this.show = true
    }, 1000)
    //    this.getTabLists();
  },
  mounted () {
    window.addEventListener('scroll', () => {
      if (parseInt(window.scrollY) + parseInt(window.screen.height) > document.documentElement.scrollHeight - 100 && this.can_load) {
        if (this.saleListObj[this.tab_id].length > 0 && this.salePage[this.tab_id] < this.saleTotalPage[this.tab_id]) {
          // 有特卖商品 且 未加载到最后一页
          this.can_load = false
          var _page = ++this.salePage[this.tab_id]
          this.getSaleList(_page)
        } else {
          if (this.tabContentTotalPage[this.tab_id] == undefined) {
            this.can_load = false
            this.getMoreProList(this.countPage[this.tab_id])
          } else if (this.tabContentProLists[this.tab_id].length > 0 && this.countPage[this.tab_id] < this.tabContentTotalPage[this.tab_id]) {
            this.can_load = false
            var _page = ++this.countPage[this.tab_id]
            this.getMoreProList(_page)
          }
        }
      }
    })
  },
  updated () {
    var height = window.screen.width
    if (document.getElementsByClassName('model_pro10').length != 0) {
      for (var i = 0; i < document.getElementsByClassName('model_pro10').length; i++) {
        document.getElementsByClassName('commentSwiper')[i].style.height = height * 24 / 75 * 2 + 'px'
      }
    }
  },
  methods: {
    getTabLists () {
      homeTab().then(response => {
        if (response.data.result_code == 0) {
          this.tabItems = response.data.result_data.list
          var id = ''
          for (var i = 0; i < this.tabItems.length; i++) {
            if (this.tabItems[i].selected == 1 && this.tabItems[i].url == '') {
              id = this.tabItems[i].id
              this.tab_id = id
              break
            } else if (this.tabItems[i].selected == 1 && this.tabItems[i].url != '') {
              id = this.tabItems[0].id
              this.tab_id = id
              break
            }
          }
          if (id == '') {
            id = this.tabItems[0].id
            this.tab_id = id
          }
          this.getTabContentList(this.tab_id)
        }
      })
    },
    getTabContentList (tabId) {
      var that = this
      indexModuleData(tabId).then(res => {
        if (res.data.result_code == 0) {
          if (res.data.result_data.length != 0) {
            var data = res.data.result_data.list
            for (var i = 0; i < data.length; i++) {
              if (data[i].type_id == '9' || data[i].type_id == '14') {
                for (var j = 0; j < data[i].data_list.length; j++) {
                  if (data[i].data_list[j].spike_list && that.timeToBuyList.length == 0 && data[i].data_list[j].spike_list.length > 0) {
                    that.timeToBuyList = data[i].data_list[j].spike_list
                    that.checkTimeToBuy()
                  }
                }
              }
            }
            that.tabContentLists[tabId] = data
            that.countPage[tabId] = 1
            that.salePage[tabId] = 1
            that.getSaleList(that.salePage[tabId])
          } else {
            that.tabContentLists[tabId] = []
            that.countPage[tabId] = 1
            that.salePage[tabId] = 1
            that.getSaleList(that.salePage[tabId])
          }
        }
      })
    },
    getMoreProList (page) {
      productList(this.tab_id, page).then(res => {
        if (res.data.result_code == 0) {
          if (res.data.result_data.list.length > 0) {
            this.tabContentTotalPage[this.tab_id] = res.data.result_data.list_info.list_count
            this.countPage[this.tab_id] = res.data.result_data.list_info.list_ordinal
            this.tabContentProHeadObj[this.tab_id] = res.data.result_data.list_head
            var data = res.data.result_data.list
          } else {
            this.tabContentTotalPage[this.tab_id] = 1
            this.countPage[this.tab_id] = 1
            this.tabContentProHeadObj[this.tab_id] = {}
            var data = []
          }

          if (this.tabContentProLists[this.tab_id] == undefined) {
            this.tabContentProLists[this.tab_id] = data
          } else {
            for (var i in data) {
              this.tabContentProLists[this.tab_id].push(data[i])
            }
          }
          this.tabContentProHead = this.tabContentProHeadObj[this.tab_id]
          this.good_lists = this.tabContentProLists[this.tab_id]
          this.can_load = true
        }
      })
    },
    clickTabItem (tabItemId) {
      this.tab_id = tabItemId
      if (this.tabContentLists[tabItemId] === undefined) {
        this.loading = true
        this.show = false
        setTimeout(() => {
          this.loading = false
          this.show = true
        }, 1000)
        this.can_load = false
        this.getTabContentList(tabItemId)
      } else {
        this.sale_list = this.saleListObj[this.tab_id]
        this.saleHead = this.saleHeadObj[this.tab_id]
        this.good_lists = this.tabContentProLists[this.tab_id]
        this.tabContentProHead = this.tabContentProHeadObj[this.tab_id]
      }
    },
    addToCart (goodsId, e) {
      window.event ? window.event.returnValue = false : e.preventDefault()
      addCart(goodsId, 1).then(res => {
        if (res.data.result_code) {
          if (res.data.result_code == 0) {
            this.$refs.alertTip.alert('成功丢入购物车')
          } else {
            this.$refs.alertTip.alert(res.data.result_info)
          }
        }
      })
    },
    getSaleList (page) {
      var that = this
      saleList(this.tab_id, page).then(response => {
        if (response.data.result_code === 0) {
          if (response.data.result_data.list.length > 0) {
            this.saleTotalPage[this.tab_id] = response.data.result_data.list_info.list_count
            this.salePage[this.tab_id] = response.data.result_data.list_info.list_ordinal
            var _list = response.data.result_data.list
            var _head = response.data.result_data.list_head
          } else {
            this.saleTotalPage[this.tab_id] = 1
            this.salePage[this.tab_id] = 1
            var _list = []
            var _head = {}
          }
          if (_list.length > 0) {
            that.saleHeadObj[that.tab_id] = _head
            if (that.saleListObj[that.tab_id] == undefined) {
              that.saleListObj[that.tab_id] = _list
            } else {
              for (let i = 0; i < _list.length; i++) {
                that.saleListObj[that.tab_id].push(_list[i])
              }
            }
            that.saleHead = that.saleHeadObj[that.tab_id]
            that.sale_list = that.saleListObj[that.tab_id]
            that.can_load = true
          } else {
            that.saleHeadObj[that.tab_id] = {}
            that.saleListObj[that.tab_id] = []
            that.sale_list = that.saleListObj[that.tab_id]
            that.saleHead = that.saleHeadObj[that.tab_id]
            that.getMoreProList(that.countPage[that.tab_id])
          }
        }
      })
    },
    // 限时购场次
    checkTimeToBuy () {
      var nowTime = this.timeToBuyList[0].nowtime
      var _index = this.checkTimeToBuyIndex()
      var _data = DateToString(new Date(Number(nowTime) * 1000)).split(' ')[0]
      var time10 = this.getTimeTxt(_data + ' 10:00:00')
      var time1430 = this.getTimeTxt(_data + ' 15:00:00')
      var time1930 = this.getTimeTxt(_data + ' 20:00:00')
      var next10 = this.timeToBuyList[_index + 3] ? this.timeToBuyList[_index + 3].timetype : 0
      if (nowTime < time10) {
        // 第一场
        this.timeToBuy = this.timeToBuyList[_index]
        this.countDownFun(time10 - nowTime)
      } else if (nowTime >= time10 && nowTime < time1430) {
        // 第二场
        this.timeToBuy = this.timeToBuyList[_index + 1]
        this.countDownFun(time1430 - nowTime)
      } else if (nowTime >= time1430 && nowTime < time1930) {
        // 第三场
        this.timeToBuy = this.timeToBuyList[_index + 2]
        this.countDownFun(time1930 - nowTime)
      } else {
        if (next10 == 0) {
          this.timeToBuy = this.timeToBuyList[_index + 2]
          this.countDownFun(0)
        } else {
          this.timeToBuy = this.timeToBuyList[_index + 3]
          this.countDownFun(next10 - nowTime)
        }
      }
      //      this.checkTimeToBuyState();
    },
    // 获取时间戳
    getTimeTxt (time) {
      var date = new Date(Date.parse(time.replace(/-/g, '/')))
      return date.getTime() / 1000
    },
    // 该限购场次的状态
    checkTimeToBuyState () {
      var _nowTime = this.timeToBuy.nowtime
      var _startTime = this.timeToBuy.starttime
      if (_nowTime >= _startTime) {
        this.countDown.txt = '正在疯狂秒杀中'
      } else {
        this.countDown.txt = ''
        var _time = _startTime - _nowTime
        this.countDownFun(_time)
      }
    },
    checkTimeToBuyIndex () {
      var _index
      var _list = this.timeToBuyList
      var nowTime = this.timeToBuyList[0].nowtime
      var _data = DateToString(new Date(Number(nowTime) * 1000)).split(' ')[0]
      for (var i = 0; i < _list.length; i++) {
        if (_list[i].timetype.indexOf(_data) >= 0) {
          _index = i
          break
        }
      }
      return _index
    },
    countDownFun (time) {
      var that = this
      var _time = time
      var _timer = setInterval(function () {
        _time--
        if (_time > 0) {
          var hours = parseInt(_time / 60 / 60 % 24, 10) // 计算剩余的小时
          var minutes = parseInt(_time / 60 % 60, 10)// 计算剩余的分钟
          var seconds = parseInt(_time % 60, 10)// 计算剩余的秒数
          that.countDown.h = hours < 10 ? '0' + hours : hours
          that.countDown.m = minutes < 10 ? '0' + minutes : minutes
          that.countDown.s = seconds < 10 ? '0' + seconds : seconds
        } else {
          that.countDown.txt = '正在疯狂秒杀中'
          clearInterval(_timer)
        }
      }, 1000)
    }
  },
  watch: {
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
del {
  color: #999;
  font-weight: normal;
}
html {
  height: 100%;
}
.index-body {
  padding-top: 82px;
  padding-bottom: 55px;
}
.index-nav {
  width: 100%;
  height: 82px;
  background-color: #fff;
  overflow: hidden;
  border-bottom: solid 1px #e8e8e8;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0 1rem;
  z-index: 90;
}
/*.index-body header{background: url("http://img2.vipbcw.com/wap/top_bg.png") repeat-x;position: absolute;}*/
header {
  height: 45px;
  line-height: 45px;
  background-color: #fff;
  position: relative;
  background-image: url("http://img2.vipbcw.com/wap/icon_logo.png");
  background-size: 15%;
  background-position: center center;
  background-repeat: no-repeat;
}
header .logo {
  display: none;
}
.search {
  display: block;
  width: 2rem;
  height: auto;
}
header img {
  width: 100%;
  height: auto;
  max-width: 100%;
  border: 0 none;
}
header a {
  display: block;
}
.nav {
  background-color: #fff;
}
.nav .swiper-slide {
  padding: 0 5px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 1.4rem;
  width: 20%;
  overflow: hidden;
}
.nav .swiper-slide.cur {
  border-top: 2px solid #ff4f39;
  color: #ff4f39;
}
.nav .swiper-slide {
  border-top: solid 2px #ebecec;
}
.nav .swiper-slide a,
.nav .swiper-slide span {
  font-size: 1.3rem;
  display: inline-block;
  width: 100%;
  height: 100%;
}
.nav .swiper-slide img {
  width: 80%;
  vertical-align: top;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
body {
  background-color: #eee;
}
.nav li {
  padding: 0 5px;
  border-top: solid 2px #ebecec;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 1.4rem;
  width: 20%;
  position: relative;
}
.nav li.cur {
  border-top: 2px solid #ff4f39;
  color: #ff4f39;
}
.nav li a,
.nav li span {
  font-size: 1.4rem;
  display: inline-block;
  width: 100%;
  height: 100%;
}
.nav li img {
  width: 80%;
  vertical-align: top;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.module_title {
  font-size: 1.4rem;
  line-height: 2.4rem;
  padding-left: 5px;
  color: #000;
  background-color: #fff;
}
.module_title {
  height: 3rem;
  line-height: 3rem;
}
.module_title b {
  border-left: 4px solid #ff4f39;
  margin-right: 4px;
  border-radius: 4px;
}
.module_title em {
  color: #ff4f39;
  margin: 0 2px;
}
.module_title span {
  color: #ff4f39;
  font-size: 1.2rem;
}
/*.tab_lists{margin-top:82px;}*/
.model_m2 ul {
  padding: 8px 0;
  overflow: hidden;
}
.model_m2 ul li {
  float: left;
  text-align: center;
  margin: 5px 0;
}
.model_m2 ul li.icon_4 {
  width: 25%;
}
.model_m2 ul li img {
  width: 4rem;
  height: auto;
}
.model_m2 ul li p {
  padding-top: 5px;
}
/*icon5*/
.model_m2 ul.more li.icon_4 {
  width: 20%;
}
.model_m3 {
  overflow: hidden;
  position: relative;
  width: 100%;
}
.model_m3 .module-left {
  width: 43%;
  display: inline-block;
  position: relative;
}
.model_m3 .module-left p {
  position: absolute;
  width: 100%;
  height: 1.8rem;
  line-height: 1.8rem;
  text-align: left;
  top: 23%;
  left: 0;
  color: #333;
  font-size: 1.4rem;
  padding-left: 10%;
}
.model_m3 .module-left p.p2 i {
  display: inline-block;
  width: 1.8rem;
  height: 1.8rem;
  text-align: center;
  background: #c62d72;
  color: #fff;
  font-size: 1.4rem;
  margin: 0 2px;
  border-radius: 1px;
}
.model_m3 .module-right {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 57%;
}

.model_m4 {
  overflow: hidden;
  position: relative;
  width: 100%;
}
.model_m4 .module-right {
  width: 50%;
  display: inline-block;
  margin-left: 50%;
}
.model_m4 .module-left {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
}
.article-swiper {
  padding-right: 10px;
}
.product-swiper.more {
  padding-right: 30px;
}
.product-swiper .more-link {
  display: none;
}
.product-swiper.more .more-link {
  display: inline-block;
  width: 2rem;
  padding-left: 0.5rem;
  line-height: 1.4rem;
  height: 5.6rem;
  border-left: solid 1px #aaa;
  color: #aaa;
  margin-top: 15%;
}
.article-swiper .swiper-slide {
  padding: 20px 0 20px 10px;
}
.product-swiper .swiper-slide {
  text-align: center;
  padding: 15px 0 10px;
}
.product-swiper .swiper-slide .pro_img {
  width: 80%;
  margin: 0 auto;
}
.product-swiper .swiper-slide .pro_name {
  width: 90%;
  overflow: hidden;
  margin: 0 auto;
  padding: 10px 0 5px;
}
.product-swiper .swiper-slide .pro_price {
  color: #ff4f39;
}
.model_pro3 {
  background-color: #fff;
}
.model_pro3 ul {
  padding-top: 3rem;
}
.model_pro3 ul li {
  padding: 0 1rem 2rem 1rem;
  margin: 0 1rem 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  overflow: hidden;
  position: relative;
}
.model_pro3 ul li:last-child {
  border: none;
}
.model_pro3 ul li .pro_img {
  float: left;
  width: 40%;
}
.model_pro3 ul li .pro_dtl {
  float: left;
  width: 50%;
  padding-left: 1rem;
  position: absolute;
  top: 50%;
  left: 60%;
  -webkit-transform: translate(-33%, -66%);
  -o-transform: translate(-33%, -66%);
  -ms-transform: translate(-33%, -66%);
  -moz-transform: translate(-33%, -66%);
  transform: translate(-33%, -66%);
}
.model_pro3 ul li .pro_dtl .pro_name {
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  height: 3rem;
  line-height: 3rem;
}
.model_pro3 ul li .pro_dtl .pro_name img {
  width: 12%;
  vertical-align: middle;
}
.model_pro3 ul li .pro_dtl .pro_desc {
  height: 3.2rem;
  line-height: 1.6rem;
  overflow: hidden;
}
.model_pro3 ul li .pro_dtl .pro_desc,
.model_pro3 ul li .pro_dtl .pro_norms {
  color: #333;
}
.model_pro3 ul li .pro_dtl .pro_price {
  margin-top: 1.1rem;
  font-size: 1.6rem;
  font-weight: bold;
  color: #ff4f39;
}
.model_pro4 ul {
  background-color: #ededed;
  overflow: hidden;
  padding-left: 3%;
  padding-top: 3%;
}
.model_pro4 ul li {
  margin: 0 3% 3% 0;
  float: left;
  text-align: center;
  padding: 0 2.1rem;
  width: 47%;
  background-color: #fff;
}
.model_pro4 ul li .pro_name {
  font-size: 1.3rem;
  color: #454545;
  font-weight: bold;
  margin-top: 1.1rem;
  height: 1.5rem;
  lin-height: 1.5rem;
}
.model_pro4 ul li .pro_desc {
  font-size: 1.1rem;
  color: #666;
  margin-top: 0.9rem;
}
.model_pro4 ul li .pro_price {
  margin-top: 0.9rem;
}
.model_pro4 ul li .pro_price span {
  display: inline-block;
  width: 48%;
  height: 1.6rem;
  line-height: 1.6rem;
  font-size: 1.1rem;
  color: #ff4f39;
  border: 1px solid #ff4f39;
  border-radius: 5px;
}
.model_pro4 ul li .pro_img {
  margin-top: 1.4rem;
  margin-bottom: 0.64rem;
}
.model_pro10 {
  overflow: Hidden;
}
.model_pro {
  overflow: hidden;
  width: 96%;
  margin: 0 auto;
}
.model_pro li {
  float: left;
  width: 49%;
  margin-top: 10px;
  background-color: #fff;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  padding-bottom: 10px;
}
.model_pro li:nth-child(odd) {
  margin-right: 1%;
}
.model_pro li:nth-child(even) {
  margin-left: 1%;
}
.model_pro li .pro_img {
}
.model_pro li .key-word {
  height: 2.4rem;
  line-height: 2.4rem;
  margin: 0 auto;
  font-size: 1.3rem;
  overflow: hidden;
  font-weight: bold;
}
.model_pro li .name {
  color: #333333;
  margin: 0 3%;
  height: 3rem;
  line-height: 1.5rem;
  overflow: Hidden;
}
.model_pro li .dtl {
  color: #363636;
  margin: 5% 0 0 3%;
  font-size: 1.3rem;
}
.model_pro li .price span {
  font-size: 1.6rem;
}
.model_pro li .price {
  color: #ff4f39;
  font-size: 1.4rem;
  height: 2.2rem;
  line-height: 2.2rem;
}
.model_pro li .price span {
  color: #ff4f39;
  font-size: 1.5rem;
}
.model_pro li .price s {
  color: #c0c0c0;
  margin-left: 5px;
  font-size: 1rem;
}
.model_pro li .cut {
  padding: 1%;
  color: #fff;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  font-size: 1.3rem;
  position: absolute;
  left: 0;
  top: 3%;
  width: 33%;
  background-color: #f92b37;
}
.model_pro li .cut span {
  color: #fbe92d;
  font-size: 1.3rem;
}
.model_pro .cart {
  position: absolute;
  bottom: 10px;
  right: 3%;
  z-index: 50;
  height: 25px;
  padding: 0 15px;
  line-height: 25px;
  background: #ff4f39;
  border-radius: 30px;
}
.model_pro .cart:after {
  display: inline-block;
  content: "";
  width: 24px;
  height: 24px;
  background: url("http://img2.vipbcw.com/wap/icon_cart3_white.png") no-repeat
    center;
  background-size: 90%;
}
/*.model_pro li .cart{position: absolute;width:17%;padding:5px;background:#A059FF;border-radius: 50%;bottom:5px;right:3%;}*/
.model_news {
  width: 100%;
  height: 58px;
  padding: 5px 0;
  overflow: hidden;
  position: relative;
  background-color: #fff;
}
.model_news .news_img {
  float: left;
  width: 20%;
  padding: 0 2%;
  text-align: center;
  overflow: hidden;
}
.model_news .news_img img {
  width: 100%;
  height: 100%;
  border-right: 1px solid #efefef;
}
.model_news .news_scroll {
  float: left;
  width: 90%;
  padding: 0 2%;
}
.model_news .news_scroll .news_scroll_list {
  height: 24px;
  line-height: 24px;
}
.model_news .news_scroll p img {
  width: 6%;
  margin-right: 2%;
  height: auto;
}
.model_news .transparent {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 99;
  float: left;
  width: 79%;
  height: 19px;
  -webkit-background: linear-gradient(
    to top,
    #fff 0%,
    rgba(255, 255, 255, 0.4)
  );
  -ms-background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0.4));
  -o-background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0.4));
  -o-background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0.4));
  background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0.4));
}
.model_news .news-swiper {
  height: 48px;
}
.limit_time li {
  position: relative;
}
.limit_txt {
  width: 100%;
  height: 80%;
  position: absolute;
  left: 0;
  top: 50%;
  z-index: 11;
  padding: 0 3%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}
.limit_txt img {
  width: 50%;
}
.limit_txt p {
  padding: 2% 0 3%;
}
.limit_txt span {
  padding: 1% 5% 1% 1%;
  background: #00b43c;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  color: #fff;
}
.time-count-box {
  padding-top: 5%;
}
.time-count-box em {
  display: Inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background: #333;
  color: #fff;
  position: relative;
  margin-right: 3px;
}
.hour:after,
.min:after {
  content: ":";
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  right: -21%;
  color: #333;
  font-size: 1.8rem;
}
[v-cloak] {
  display: none;
}
.loading {
  position: fixed;
  top: 40%;
  left: 50%;
  width: 100%;
  text-align: center;
  -webkit-transform: translate(-50%);
  -moz-transform: translate(-50%);
  -ms-transform: translate(-50%);
  transform: translate(-50%);
}
.tabContentProLists {
  background-color: #fff;
}

.template12 .swiper-slide a {
  display: block;
  position: relative;
}
.template12 .swiper-slide img {
  float: left;
  width: 48%;
  margin-right: 2%;
}
.template12 .swiper-slide .right-box {
  padding-top: 2.5rem;
  position: relative;
}
.template12 .swiper-slide p {
  line-height: 2rem;
  font-size: 1.4rem;
  color: #333;
  height: 2rem;
}
.template12 .swiper-slide p.g-name {
  font-weight: bold;
  color: #4a4a4a;
}
.template12 .swiper-slide p.g-desc {
  font-size: 1.3rem;
}
.template12 .swiper-slide p.g-price {
  font-weight: bold;
  color: #ff4f39;
  padding-top: 1rem;
  height: 3rem;
}
.template12 .swiper-slide p.g-price del {
  font-weight: normal;
  color: #999;
  font-size: 1.2rem;
  padding-left: 5px;
}
.template12 .swiper-slide .buy-btn {
  right: 20px;
  bottom: -5px;
  width: 3rem;
  height: 3rem;
  border-radius: 1.5rem;
}
.template15 li {
  margin-bottom: 5px;
  position: relative;
}
.template15 li .g-price {
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  bottom: 10%;
  left: 10%;
}
.template15 li .g-price del {
  padding-left: 10px;
  font-weight: normal;
  color: #333;
}
.template13 ul {
  display: flex;
}
.template13 li {
  flex: 1;
  position: relative;
}
.template13 li .tit-box {
  position: absolute;
  width: 100%;
  top: 5px;
  left: 0;
}
.template13 li p {
  text-align: center;
  color: #333;
  font-size: 1.5rem;
  line-height: 1.8rem;
}
.template13 li p.p2 {
  font-size: 1.3rem;
  color: #999;
}
.template14 {
  padding: 10px 0 10px 10px;
}
.template14 .pdSwiper-slide {
  background: #fff;
  padding-bottom: 5px;
}
.template14 p {
  color: #3a3a3a;
  font-size: 1.2rem;
  line-height: 2rem;
  padding: 0 3%;
  height: 2rem;
}
.template14 p.p1 {
  font-weight: bold;
  color: #333;
  font-size: 1.3rem;
}
.template14 p.p2 i {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  line-height: 1.5rem;
  text-align: center;
  background: #333;
  color: #fff;
  margin: 0 2px;
}
.saleProLists {
  background: #fff;
}
.saleProLists li {
  padding-bottom: 5px;
}
.saleProLists li img {
  margin-bottom: 5px;
}
.saleProLists li p {
  padding: 0 3%;
  font-size: 1.4rem;
  font-weight: bold;
  color: #4a4a4a;
  line-height: 2rem;
}
.saleProLists li p.p-desc i {
  float: right;
  color: #ff4f39;
  font-size: 1.5rem;
  font-weight: bold;
}
.saleProLists li p.p-desc span {
  font-size: 1.3rem;
  font-weight: normal;
  color: #333;
  display: inline-block;
  width: 80%;
}
</style>

// WEBPACK FOOTER //
// home.vue?728bf762
