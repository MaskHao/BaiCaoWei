<template>
  <div class="content">
    <!--小味推荐-->
    <div class="instructions new_user_part">
      <div class="part_title">
        组合出击
      </div>
      <div class="info_list">
        <ul>
          <li><img src="http://u.bcwcdn.com/activity_img/2017/img_0411/zu_05.jpg" alt=""></li>
          <li><img src="http://u.bcwcdn.com/activity_img/2017/img_0411/zu_11.jpg" alt=""></li>
          <li><img src="http://u.bcwcdn.com/activity_img/2017/img_0411/zu_17.jpg" alt=""></li>
          <li><img src="http://u.bcwcdn.com/activity_img/2017/img_0411/zu_23.jpg" alt=""></li>
        </ul>
      </div>
    </div>
    <!--专场好优惠 活动折上折-->
    <div class="instructions new_user_part">
      <div class="part_title">
        详情介绍 规则就是这么少
      </div>
      <div class="info_list">
        <ul>
          <li>1. 本礼包为60元新人专享礼，领取后请于"我的"-"优惠券"列表中查看</li>
          <li>2. 新人礼包包含7张组合优惠券，每次购物限用一张优惠券</li>
          <li>3. 在确认订单页面-优惠券列表进行优惠券使用选择</li>
        </ul>
      </div>
    </div>
    <div class="btn_box">
      <a href="/activity/newer-gift">看新人专享推荐</a>
      <a href="/home/index">首页瞎逛逛</a>
    </div>
  </div>
</template>

<script>
  export default{
    data(){
      return {
      }
    },
    components:{
    },
    created(){
      var ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        var wx = require('weixin-js-sdk');
        var _url = window.location.href;
        getConfig(_url).then(res => {
          wx.config(res.data.result_data);
        }).then(() => {
          wxShare(wx,'新人礼包·好礼免费拿','首次下载百草味APP客户端，立送108元新人礼包','http://m.vipbcw.com/activity/share','http://img2.vipbcw.com/wap/app/g_share.jpg')
        })
      }
    },
    mounted(){},
    updated(){},
    methods:{
    },
    watch:{}
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content{background-color:#E8E8E8;}
  .content{padding:30px 4% 20px;position:relative;}
  .new_user_part{position:relative;text-align:center;}
  .new_user_part:before{border-bottom:1px solid #031B27;content:'';display:block;width:100%;height:1px;position:absolute;top:12px;z-index: 0;}
  .new_user_part .part_title{border:1px solid #031B27;color:#031B27;display:inline-block;padding:0 10px;height:25px;border-radius:25px;margin:0 auto;line-height:23px;text-align:center;font-size:14px;background-color:#fff;position:relative;z-index: 99;}
  .instructions .info_list{padding:15px 0;text-align:left;}
  .instructions .info_list span{border-color:#fff #fff #fff #CDAC69;}
  .instructions .info_list ul li{color:#696969;font-size:1.2rem;line-height:1.8rem;position:relative;margin:5px 0;}
  .btn_box{text-align:center;}
  .btn_box a{background:#D4AF6B;color:#fff;box-shadow:5px 5px 0 #D1D1D1;width:40%;height:40px;line-height:40px;text-align:center;display:inline-block;font-size:1.4rem;margin:20px 3% 0;}
</style>



// WEBPACK FOOTER //
// newGiftRule.vue?6264c468