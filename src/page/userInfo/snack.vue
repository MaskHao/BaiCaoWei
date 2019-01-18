<template>
  <div style="padding-top:45px;" class="user-info">
    <div class="header-box clearfix">
      <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
      零食种类偏好
      <div class="header-right"></div>
    </div>
    <div class="nick-content">
      <div class="cate-box">
        <ul class="clearfix">
          <li v-for="(value,index) in snackArr" :key="index" :class="{'on': value.isShow }" @click="selectSnack(index)">{{value.name}}<i></i></li>
        </ul>
      </div>
      <!--<p class="desc">不能超过10个汉字或20个英文，支持中英文、数字、下划线</p>-->
      <div class="input-btn" @click="changeSnack()">保存</div>
    </div>
    <Valert ref='alertDialog'></Valert>
  </div>
</template>

<script>
  import {editInfo} from '../../service/getData'
  import Valert from '../../components/alertDialog'

  export default {
    data () {
      return {
        snackArr:[
          {name:'坚果',isShow:false},
          {name:'糕点',isShow:false},
          {name:'糖果',isShow:false},
          {name:'素食',isShow:false},
          {name:'肉类',isShow:false},
          {name:'海鲜',isShow:false},
          {name:'豆制品',isShow:false},
          {name:'红枣',isShow:false},
          {name:'果干蜜饯',isShow:false},
          {name:'膨化食品',isShow:false},
        ],
        querySnack:''
      }
    },
    components: {
      Valert
    },
    created (){
      this.querySnack = this.$route.query.snack;
      if(this.querySnack != ''){
        var _querySnackArr = this.querySnack.split(',');
        for(var i=0 ; i<_querySnackArr.length ; i++){
          for(var j=0 ; j<this.snackArr.length ; j++){
            if(_querySnackArr[i] == this.snackArr[j].name){
              this.snackArr[j].isShow = true;
            }
          }
        }
      }
    },
    updated(){

    },
    methods:{
      changeSnack(){
        var _snack = '';
        var _snackArr = [];
        var _arr = this.snackArr;
        var that = this;
        for(var i=0 ; i<_arr.length ; i++){
          if(_arr[i].isShow){
            _snackArr.push(_arr[i].name);
           // _snack = _snack + _arr[i].name +','
          }
        }
        _snack = _snackArr.join(',');
        if(_snack == ''){
          this.$refs.alertDialog.alert('请选择零食偏好');
        }else{
          editInfo({snack:_snack}).then(res => {
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
      selectSnack(index){
        this.snackArr[index].isShow = this.snackArr[index].isShow ? false : true;
      }
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
  .cate-box{padding:0 3%;}
  .cate-box li{margin:5px 2%;background:#fff; height:30px;line-height:30px;padding: 0 15px;border-radius:15px;color:#333;float:left;}
  .cate-box li i{background: url(http://img2.vipbcw.com/wap/circle2.png) no-repeat;background-size:100% 100%;display:inline-block;width:10px;height:10px;margin-left:5px;}
  .cate-box li.on i{background: url(http://img2.vipbcw.com/wap/circle3.png) no-repeat;background-size:100% 100%;display:inline-block;width:10px;height:10px;margin-left:5px;}
  .cate-box li.on{background:#ff4f39;color:#fff;}
</style>



// WEBPACK FOOTER //
// snack.vue?8e80dbdc