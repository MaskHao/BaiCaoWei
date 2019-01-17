<template>
  <div style="padding-top:45px;" class="user-info">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      修改昵称
      <div class="header-right"></div>
    </div>
    <div class="nick-content">
      <div class="input-item">
        <input type="text" v-model="nick"/>
      </div>
      <p class="desc">不能超过10个汉字或20个英文，支持中英文、数字、下划线</p>
      <div class="input-btn" @click="changeNick()">保存</div>
    </div>
    <Valert ref='alertDialog'></Valert>
  </div>
</template>

<script>
  import {editInfo} from 'service/getData'
  import Valert from 'components/alertDialog'

  export default {
    data () {
      return {
        nick:''
      }
    },
    components: {
      Valert
    },
    created (){
      this.nick = this.$route.query.nick;
    },
    updated(){

    },
    methods:{
      changeNick(){
        var that = this;
        var _nick = this.trim(this.nick);
        if(_nick == ''){
          this.$refs.alertDialog.alert('请输入昵称');
        }else{
          editInfo({nick:_nick}).then(res => {
            if(res.data.result_code == '0'){
              window.history.go(-1)
            }else{
              that.$refs.alertDialog.alert(res.data.result_info);
            }
          })
        }
      },
      trim(str){
        return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;top:0;left:0;width:100%;z-index:999; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}
  .nick-content{padding-top:10px;}
  .nick-content .input-item{height:45px;background:#fff;padding:5px 5%;}
  .nick-content .input-item input{width:100%;height:35px;line-height:35px;}
  .nick-content .desc{color:#f5a623;text-align:center;line-height:50px;}
  .nick-content .input-btn{margin:30px auto 0;width:90%;height:40px;line-height:40px;background:#ff4f39;color:#fff;text-align:center;border-radius:20px;}
</style>



// WEBPACK FOOTER //
// nick.vue?75209e0d