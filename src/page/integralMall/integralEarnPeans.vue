<template>
  <div class="integral-peans">
    <div class="hiddenTxt" id="J_appTitle">赚味豆</div>
    <div class="header" :class="{ app : inApp == 1 }">
      <div class="left-box" @click="back()"><img  src="../../assets/images/ic_left.png"> </div>
      赚味豆
    </div>
    <div :class="{'show':show==1}" class="integral-mall">
      <div class="tab-tit">
        <ul class="clearfix">
          <li :class="{ on : hasClassOn}" data-type="inaccessible" @click=" hasClassOn = 1 ">
            <span>每日任务</span>
          </li>
          <li :class="{ on : !hasClassOn}" data-type="used" @click=" hasClassOn = 0 ">
            <span>新手任务</span>
          </li>
        </ul>
      </div>
      <div class="task-center">
        <div v-if="hasClassOn == 1" class="daily-task task">
          <ul>
            <li v-for="ts in task">
              <div class="label-box"><img :src="ts.task_tag" alt=""></div>
              <div class="task-content">
                <p v-html="ts.task_name"></p>
                <div class="task-desc" v-html="ts.task_desc"></div>
              </div>
              <div v-if="ts.complete">
                <div class="task-state dis"><a :href="ts.task_name == '分享APP' ? 'http://www.vipbcw.com/app_download.html' : ts.task_url">已完成</a></div>
              </div>
              <div v-else>
                <div class="task-state"><a :href="ts.task_name == '分享APP' ? 'http://www.vipbcw.com/app_download.html' : ts.task_url">去完成</a></div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="newer-task task">
          <ul>
            <li v-for="task in newerTask">
              <div class="label-box"><img :src="task.task_tag" alt=""></div>
              <div class="task-content">
                <p v-html="task.task_name"></p>
                <div class="task-desc" v-html="task.task_desc"></div>
              </div>
              <div v-if="task.complete">
                <div class="task-state dis"><a :href="task.task_name == '分享APP' ? 'http://www.vipbcw.com/app_download.html' : task.task_url">已完成</a></div>
              </div>
              <div v-else>
                <div class="task-state"><a :href="task.task_name == '分享APP' ? 'http://www.vipbcw.com/app_download.html' : task.task_url">去完成</a></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="{'show':show==0}" class="noLogin-box" style="padding:30% 0 0 0;">
      <img style="width:33.33%;" src="http://img2.vipbcw.com/wap/none-login.png"/>
      <p>您还没有登录，抱抱熊喊你先登录哦</p>
      <a style="width:33.33%;" href="/login/index">去登录</a>
    </div>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import Valert from '../../components/alertDialog.vue'
  import {integralMallGetTaskList} from '../../service/getData'

  export default{
    data(){
      return {
        task:[],
        newerTask:[],
        show:2,
        hasClassOn:1,
        inApp:0,
      }
    },
    components:{
      Valert,
    },
    created(){
      this.getInfo();
    },
    mounted(){
      var _userAgent = navigator.userAgent;
      if(_userAgent.indexOf("bcwmall") > 0){
      this.inApp = 1;
        document.getElementsByClassName('header')[0].style.height = '0px';
        document.getElementsByClassName('tab-tit')[0].style.top = '0px';
        document.getElementsByClassName('integral-mall')[0].style.paddingTop = '10px';
      }
    },
    updated(){},
    methods:{
      back(){
        this.$router.go(-1);
      },
      getInfo(){
        integralMallGetTaskList().then( res => {
          if(res.data.result_code == 1003){
            this.show = 0;
          }else if(res.data.result_code == 0){
            this.show = 1;
            this.task = res.data.result_data.everyTime;
            this.newerTask = res.data.result_data.longTime;
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
    },
    watch:{}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{display:block;border-bottom:1px solid #ccc;width:100%;height:50px;background-color:#fff;position: fixed;top:0;left:0;text-align:center;font-size:1.4rem;line-height:50px;z-index:99;color:rgba(60,67,71,1);}
  .header .left-box{position:absolute;left:0;top:0;display:inline-block;padding-left:2%;text-align:left;}
  .header .left-box img{width:40%;}
  .header.app{display:none;}
  body{background-color:#f5f5f5;}
  .tab-tit{position:fixed;left:0;top:50px;width:100%;height:40px;background:#fff;z-index: 99;}
  .tab-tit ul{height:40px;line-height:38px;}
  .tab-tit li{float:left;width:50%;text-align:center;}
  .tab-tit li span{font-size:1.2rem;display:inline-block;padding:0 15px;}
  .tab-tit li.on span{color:#ff4f39;border-bottom:2px solid #ff4f39;line-height:28px;}
  .integral-mall{padding-top:55px;}
  .integral-mall .task-center{padding:0 2%;margin-top:40px;}
  .integral-mall .task-center ul li{position:relative;background-color:#fff;margin-top:2%;padding:4% 0;}
  .integral-mall .task-center .label-box{width:30px;vertical-align: middle;margin-left:10px;float:left;position:absolute;top:50%;left:0;
    -webkit-transform: translate(0,-60%);-moz-transform: translate(0,-60%);-ms-transform: translate(0,-60%);transform: translate(0,-60%);
  }
  .integral-mall .task-center .task-content{margin-left:50px;}
  .integral-mall .task-center .task-content>p{font-size:1.5rem;color:#333;}
  .integral-mall .task-center .task-content .task-desc{color:#8d9194;margin-top:1%;font-size:1.3rem;}
  .integral-mall .task-center .task-state{font-size:1.4rem;color:#fff;border-radius:15px;background-color:#ff4f39;position:absolute;top:50%;right:3%;
    -webkit-transform: translate(0,-60%);-moz-transform: translate(0,-60%);-ms-transform: translate(0,-60%);transform: translate(0,-60%);
  }
  .integral-mall .task-center .task-state a{font-size:1.4rem;color:#fff;display:Inline-block;height:2.2rem;line-height:2.2rem;width:6rem;text-align:center;}
  .integral-mall .task-center .task-state.dis{background-color:#CDCDCD;}
  .integral-mall .task-center .daily-task{padding-bottom:25%;}
  .noLogin-box{    padding: 30% 0 0 0;text-align: center;
    font-size: 1.4rem;}
  .noLogin-box p {
    margin: 20px 0 10px;
  }
  .noLogin-box a {
    width: 33.3%;
    height: 40px;
    border-radius: 20px;
    text-align: center;
    background: #ff4f39;
    display: inline-block;
    line-height: 40px;
    font-size: 1.4rem;
    color: #fff;
  }
  .integral-mall,.noLogin-box{display:none;}
  .integral-mall.show,.noLogin-box.show{display:block;}
</style>



// WEBPACK FOOTER //
// integralEarnPeans.vue?4c7a8cc3