<template>
  <div>
    <div class="rule-box">
      <div class="rule-title" @click="tabClick(1)" :class="{'on' : rule[1] == 1}">
        会员等级<i class="ic"><img src="../../assets/images/ic_top.png"/> </i>
      </div>
      <div class="rule-con" :class="{'on' : rule[1] == 1}">
        <p class="tit" style="padding-top:20px;">会员等级介绍</p>
        <p>1、新人注册成功后下单1次即可成为百草味APP会员，享受会员特权！</p>
        <p>2、百草味APP会员分5个等级，分别为：vo吃货新人、v1吃货达人、v2吃乎顾问、v3吃货大师、v4吃货大神。会员等级由成长值决定。成长值越高，所享权益越多。</p>
        <p>3、会员等级升降均由系统处理。</p>
        <p class="tit">会员等级对应的成长值</p>
        <img src="../../assets/images/rule_02.png"/>
        <img src="../../assets/images/rule_03.png"/>
        <p style="padding-bottom:20px;"></p>
      </div>
    </div>
    <div class="rule-box">
      <div class="rule-title" @click="tabClick(2)" :class="{'on' : rule[2] == 1}">
        会员特权<i class="ic"><img src="../../assets/images/ic_top.png"/> </i>
      </div>
      <div class="rule-con" :class="{'on' : rule[2] == 1}">
        <p style="padding-top:20px;"></p>
        <img src="../../assets/images/rule_04.png"/>
        <img src="../../assets/images/rule_05.png"/>
        <img src="../../assets/images/rule_06.png"/>
        <p class="tit" style="margin-top:20px;">会员特权说明</p>
        <p>1、新人礼包：所有会员均可领取新人礼包，在首页“新人有礼”领取。</p>
        <p>2、评价奖励：V0用户评价商品可得5味豆，评价+晒图可得10味豆。V1-V4用户评价商品可得10味豆，评价+晒图可得15味豆。</p>
        <p>3、购物赚味豆：V0用户购物可得实付金额的同等值味豆；V1会员用户购物可得实付金额1.1倍味豆；V2会员用户购物可得实付金额1.2倍味豆；V3会员用户购物可得实付金额1.3倍味豆；V4会员用户购物得实付金额1.4倍味豆。</p>
        <p>4、升级礼包：升级即可获得相应的升级礼包，等级越高，礼包越丰厚！神秘礼包等你解锁。</p>
        <p>5、生日礼包：不同等级用户享有不同价值的生日礼包。生日前6天至生日当天可领取。有效期内未领取，不再补发生日礼包。</p>
        <p>6、会员日专享：每月17日为百草味app会员日，会员日当天不同等级会员享受不同折扣的会员价。</p>
        <p>7、包邮券：v1及以上会员可领取1张包邮券。</p>
        <p>8、会员专享价：商品详情标有会员专享的商品，会员可享受VIP折扣价，等级越高，折扣越大。</p>
        <p>9、新品试吃：百草味APP会不定期举行新品试吃活动，敬请期待！</p>
        <p>10、极速退款：V4会员享退款绿色通道，保证退款时效，优先处理退款退货等售后问题</p>
        <p style="padding-bottom:20px;">11、vip专属客服：V4会员专属客服，优先处理您在购物中的问题。</p>

      </div>
    </div>
    <div class="rule-box">
      <div class="rule-title" @click="tabClick(3)" :class="{'on' : rule[3] == 1}">
        会员成长值<i class="ic"><img src="../../assets/images/ic_top.png"/> </i>
      </div>
      <div class="rule-con" :class="{'on' : rule[3] == 1}">
        <p style="padding-top:20px;" class="q">1、什么是成长值？</p>
        <p>成长值决定会员等级，成长值越高，会员等级越高，享受到的权益越多。</p>
        <p class="q">2、成长值怎么获得？</p>
        <p>目前成长值只能通过购物获得。付款完成后，成长值按照订单实付金额1：1的比例发放。</p>
        <p class="q">3、什么情况会扣除成长值？</p>
        <p style="padding-bottom:20px;">退款情况下，将扣除与订单金额数值相同的成长值，相应等级也会下降或者保持不变。</p>
      </div>
    </div>
  </div>
</template>

<script>

  export default{
    data(){
      return{
        rule:{
          '1':0,
          '2':0,
          '3':0
        }
      }
    },
    created:function(){

    },
    methods:{
      changeTab:function(type){
        this.nowTab = type;
      },
      changeNextTab:function(type){
        this.nextTab = type;
      },
      tabClick:function(index){
        var _rule = this.rule[index];
        this.rule[index] = _rule ? 0 : 1;
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rule-title{height:45px;line-height:25px;padding:10px 4%;background:#fff;color:#333;border-bottom:solid 1px #c0c0c0;}
.rule-title .ic{height:25px;width:25px;float:right;-webkit-transition: -webkit-transform 0.4s ease-out;
  -moz-transition: -moz-transform 0.4s ease-out;
  transition: transform 0.4s ease-out; }
.rule-title.on .ic{-webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg); }
.rule-con{padding:0 4%;max-height:0;overflow:hidden;-webkit-transition:max-height 0.6s ease;
  -moz-transition:max-height 0.6s ease;
  -o-transition:max-height 0.6s ease;
  transition:max-height 0.6s ease;}
.rule-con.on{max-height:10000px;}
.rule-con p{color:#333;margin-bottom:20px;}
.rule-con p.tit,.rule-con p.q{font-size: 1.4rem;font-weight:bold;}
.rule-con p.q{margin-bottom:0;}
</style>



// WEBPACK FOOTER //
// rule.vue?36e1ef56