<template>
  <div style="padding-top:45px;" class="user-info">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      个人资料
      <div class="header-right"></div>
    </div>
    <div class="part">
      <div class="change_password slide_part">
        <a href="javascript:void(0)">
          头像
          <span class="logo">
              <img :src="userInfo.head_img == ''? 'http://img2.vipbcw.com/wap/none_head.png' : userInfo.head_img">
          </span>
        </a>
      </div>
      <div class="clear_cache slide_part">
        <router-link :to="{path: '/user-info/nick', query:{nick: userInfo.nick}}">
          昵称
          <div class="ic-right"></div>
          <span style="width:50%;" class="textHidden">{{userInfo.nick ==''? '未设置':userInfo.nick}}</span>
        </router-link>
      </div>
      <div class="clear_cache slide_part">
        <router-link to="/member/index">
          会员等级
          <div class="ic-right"></div>
          <span v-if="userInfo.level_type >= 0">V{{userInfo.level_type}}</span>
          <span v-else>普通用户</span>
        </router-link>
      </div>
      <div v-if="!userInfo.mobile" class="clear_cache slide_part">
        
        <router-link :to="{path: '/user-info/bind-phone', query:{nick: userInfo.nick,headImg: userInfo.head_img}}">
          绑定手机号
          <div class="ic-right"></div>
        </router-link>

        <!-- <a href="/user-info/bind-phone">
          绑定手机号
          <div class="ic-right"></div>
        </a> -->

      </div>
      <div class="clear_cache slide_part">
        手机号码
        <div style="visibility:hidden;" class="ic-right"></div>
        <span>{{userInfo.mobile}}</span>
      </div>
      <div class="version_info slide_part">
        性别
        <div class="ic-right"></div>
        <span class="input-span">{{sex}}</span>
        <select v-model="sexId">
          <option value="2">男</option>
          <option value="1">女</option>
        </select>
      </div>

      <div id="J_birthBox" class="version_info slide_part">
        生日
        <i class="ic-right"></i>
        <span class="input-span"><input type="text" readonly="readonly" id="demo1" data-lcalendar="2000-01-01,2018-01-29" @click="activeBlur()" v-model="birth" />
</span>
      </div>
    </div>

    <div class="part">
      <div class="about_us slide_part">
        所在行业
        <i class="ic-right"></i>
        <span id="J_workRes">{{userInfo.trade_name == ''? '未设置' : userInfo.trade_name}}</span>
        <select v-model="tradeId">
          <option v-for="(value,key) in tradeObj" :key="value" :value="key">{{value}}</option>
        </select>
      </div>
      <div class="about_us slide_part">
        所在城市
        <i class="ic-right"></i>
        <span class="input-span"><input id="demo2" type="text" readonly="readonly" v-model="city" @click="activeBlur()"/></span>
      </div>
    </div>

    <div class="part">
      <div id="J_marryBtn" class="about_us slide_part">
        婚姻状况
        <i class="ic-right"></i>
        <span>{{marry}}</span>
        <select v-model="marryId">
          <option value="1">未婚</option>
          <option value="2">已婚</option>
        </select>
      </div>
      <div class="about_us slide_part">
        <router-link :to="{path:'/user-info/snack', query:{snack: userInfo.snack}}">
          零食种类偏好
          <i class="ic-right"></i>
          <span style="width:50%;" class="textHidden">{{userInfo.snack == ''? '未设置' : userInfo.snack}}</span>
        </router-link>
      </div>
      <div class="about_us slide_part">
        <router-link :to="{path: '/user-info/hobby', query:{hobby: userInfo.interest}}">
          业余爱好
          <i class="ic-right"></i>
          <span style="width:50%;" class="textHidden">{{userInfo.interest == ''? '未设置' : userInfo.interest}}</span>
        </router-link>
      </div>
    </div>
    <Valert ref='alertDialog'></Valert>
    <input id="value1" type="hidden" readonly="" value=""/>
  </div>
</template>

<script>
  import {userInfo,editInfo,getTrade} from '../../service/getData'
  import {MobileCalendar} from '../../assets/js/LCalendar.js'
  import {MobileArea} from '../../assets/js/LArea.js'
  import {cityData,sexData,marryData,workData} from '../../assets/js/city.data.js'
  import Valert from '../../components/alertDialog'

  export default {
    data () {
      return {
        userInfo:{},
        sex:'',
        sexId:'',
        birth:'',
        city:'',
        marryId:'',
        marry:'',
        trade:'',
        tradeId:'',
        sexObj:{
          0:'未设置',
          1:'女',
          2:'男'
        },
        marryObj:{
          0:'未设置',
          1:'未婚',
          2:'已婚'
        },
        tradeObj:{}
      }
    },
    components: {
      Valert
    },
    created (){
      this.getUserInfo();
      this.getTradeFun();
    },
    mounted: function () {
      var calendar = new MobileCalendar();
      var d = new Date();
      var str = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
      calendar.init({
        'trigger': '#demo1',//标签id
        'type': 'date',//date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择
        'minDate':'1900-1-1',//最小日期 注意：该值会覆盖标签内定义的日期范围
        'maxDate':str//最大日期 注意：该值会覆盖标签内定义的日期范围
      });
      var area = new MobileArea();
      area.init({
        'trigger': '#demo2',//触发选择控件的文本框，同时选择完毕后name属性输出到该位置
        'valueTo':'#value1',//选择完毕后id属性输出到该位置
        'keys':{id:'id',name:'name'},//绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
        'type':1,//数据源类型
        'data':cityData//数据源
      });
    },
    updated(){

    },
    methods:{
      getUserInfo(){
        var that = this;
        userInfo().then(response => {
          if(response.data.result_code == 0){
            that.isLogin = true;
            that.userInfo = response.data.result_data;
            that.birth = that.userInfo.birthday;
            var _city = that.userInfo.province_id;
            if(_city == 0){
              that.city = '未设置';
            }else{
              that.city = that.userInfo.province_name +' '+ that.userInfo.city_name;
            }
            var _marry = that.userInfo.is_marry;
            switch (_marry){
              case '0':that.marry = '未设置';break;
              case '1':that.marry = '未婚';break;
              case '2':that.marry = '已婚';break;
              default:that.marry = '未设置';
            }
            var _sex = that.userInfo.sex;
            switch (_sex){
              case '0':that.sex = '未设置';break;
              case '1':that.sex = '女';break;
              case '2':that.sex = '男';break;
              default:that.sex = '未设置';
            }
          }else if(response.data.result_code == '1003'){
            that.isLogin = false;
          }

        })
      },
      getTradeFun(){
        var that = this;
        getTrade().then(response => {
          var _trade = response.data.result_data.list;
          for(let i=0 ; i<_trade.length ; i++){
            that.tradeObj[_trade[i].id] = _trade[i].trade_name;
          }
//          console.log(that.tradeObj);
        })
      },
      activeBlur(){
        document.activeElement.blur();
      }
    },
    watch:{
      birth(){
        var _birth = document.getElementById('demo1').value;
        var that = this;
        if(_birth != ''){
          editInfo({birthday:that.birth}).then(res => {
            that.$refs.alertDialog.alert(res.data.result_info);
          })
        }
      },
      city(){
        var _cityId = document.getElementById('value1').value;
        var that = this;
        if(_cityId != ''){
          var _cityArr = _cityId.split(",");
          var _p = _cityArr[0];
          var _c = _cityArr[1];
          editInfo({province_id:_p,city_id:_c}).then(res => {
            that.$refs.alertDialog.alert(res.data.result_info);
          })
        }
      },
      marryId(){
        var that = this;
        if(this.marryId != ''){
          that.marry = that.marryObj[that.marryId];
          editInfo({is_marry:that.marryId}).then(res => {
            that.$refs.alertDialog.alert(res.data.result_info);
          })
        }
      },
      sexId(){
        var that = this;
        if(this.sexId != ''){
          that.sex = that.sexObj[that.sexId];
          editInfo({sex:that.sexId}).then(res => {
            that.$refs.alertDialog.alert(res.data.result_info);
          })
        }
      },
      tradeId(){
        var that = this;
        if(this.tradeId != ''){
          that.userInfo.trade_name = that.tradeObj[that.tradeId];
          editInfo({trade_id:that.tradeId}).then(res => {
            that.$refs.alertDialog.alert(res.data.result_info);
          })
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "../../assets/css/LCalendar.css";


  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;top:0;left:0;width:100%;z-index:999; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}
  .user-info .slide_part{width:100%;height:45px;border-bottom:1px solid rgb(229,229,229);background: #fff;padding:5px 2%;line-height:35px;font-size:1.2rem;color:#3c4347;position: relative;}
  .user-info .part{margin-bottom:10px;}
  .user-info .slide_part.change_password{height:70px;line-height: 70px;padding:0 2%;}
  .user-info .slide_part a{display: block;}
  .user-info .slide_part a .icon-icongo,.slide_part .icon-icongo{font-size:1.2rem;color:#63696c;float:right;line-height: 35px;}
  .user-info .slide_part select{width: 100%;position: absolute;top:0; left: 0;opacity: 0;}
  .user-info .slide_part span{float:right;font-size:1.2rem;color: rgb(128,128,128);text-align: right;line-height: 35px;}
  .user-info .slide_part span.input-span{width:70%;}
  .slide_part span.input-span input{text-align:right;width:100%;font-size:1.2rem;color: rgb(128,128,128);}
  .user-info .slide_part span.logo{width:60px;height:60px;border-radius: 30px;overflow: hidden;line-height: 60px;margin:5px 0;}
  .user-info .logout{width:100%;height:44px;margin-top:30px;line-height:44px;font-size:1.5rem;color:#3c4347;text-align:center;background: rgb(255,98,120);}
  .user-info .getSave{margin-top:40px;}
  .user-info .getSave p{width:200px;font-size:1.5rem;margin:0 auto;text-align: center}
  .user-info .getSave input{display: block;width:91%;height:35px;border-radius: 50px;background: #ff4f39;text-align: center;font-size:15px;line-height:35px;margin:26px auto;color:#fff;}
  .user-info .getSave_text{width:100%;border-bottom:1px solid rgb(229,229,229);background: #FFF;position:relative;padding:5px 48px 5px 12px}
  .user-info .getSave_text input{background: none;line-height:30px;font-size:15px;width:100%;color:#c0c0c0;margin-left:10px;}
  .user-info .getSave_text textarea{width:100%;height:auto;line-height:21px;color:#c0c0c0}
  .user-info .regFxp_text{font-size:1.2rem;color:rgb(245,166,35); line-height:35px;margin-left:20px;}
  .user-info .getSave_text .delete{display: none;width:14px;height:14px;position:absolute;right:17px;;top:50%;margin-top:-7px;background: url(http://img2.vipbcw.com/wap/delete_ico.png) no-repeat;background-size: 100%;}
  .user-info .preference_circle ul{padding:20px 15px;}
  .user-info .preference_circle ul li {float:left;height:36px;background: #FFF;border-radius:18px; padding:8px 12px;line-height:20px;font-size:14px;color:#3c4347;margin:0 15px 20px 0}
  .user-info .preference_circle ul li span{display:inline-block;width:10px;height:10px;background: url(http://img2.vipbcw.com/wap/circle2.png);background-size: 100%}
  .user-info .preference_circle ul li.on {background: #ff4f39;color:#fff;}
  .user-info .preference_circle ul li.on span{background: url(http://img2.vipbcw.com/wap/circle3.png);background-size: 100%}

  .ic-right{float:right;display:inline-block;width:15px;height:35px;background:url("../../assets/images/ic_right_g.png") no-repeat center right;background-size:60% auto;}

</style>



// WEBPACK FOOTER //
// index.vue?7adfb9c1