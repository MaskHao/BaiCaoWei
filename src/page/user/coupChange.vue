<template>
  <div style="padding-top:45px;">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      兑换优惠券
      <div class="header-right"></div>
    </div>
    <div class="change-content">
      <div class="input-box">
        <input type="text" value="" placeholder="请输入口令/优惠码" v-model="code"/>
      </div>
      <div class="input-btn" @click="exchangeFun()">兑换</div>
    </div>
    <Valert ref="alertDialog"></Valert>
  </div>
</template>

<script>
  import {coupChange} from '../../service/getData'
  import Valert from '../../components/alertDialog'
//  import ConfirmDelete from 'components/confirmDialog'

  export default{
    data () {
      return {
        code:''
      }
    },
    components:{
      Valert,
    },
    created () {
    },
    methods:{
      exchangeFun(){
        var that = this;
        var _code = that.trim(this.code);
        if(_code != ""){
          coupChange(_code).then(res => {
            if(res.data.result_code == 0){
              that.$refs.alertDialog.alert('兑换成功');
            }else{
              that.$refs.alertDialog.alert(res.data.result_info);
            }
          })
        }else{
          that.$refs.alertDialog.alert('请输入正确口令/优惠码');
        }
      },
      trim(str){
        return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
      },
    },
    watch:{
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem;position:fixed;top:0;left:0;width:100%;z-index:999; }
  .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
  .header-box .header-left img,.header-box .header-right img{width:50%;}
  .header-box .header-right{float: right;}
  .change-content .input-box{padding-left:15%;height: 45px;line-height: 45px;
    background: #fff url("http://img2.vipbcw.com/wap/ic_code_change.png") no-repeat 4%;background-size:8% auto;}
  .change-content .input-box input{width:100%;}
  .change-content .input-btn{width:80%;height: 40px;line-height: 40px;background: #ff4f39;color:#fff;text-align: center;margin:20px auto;border-radius: 20px;}

</style>



// WEBPACK FOOTER //
// coupChange.vue?60150b5c