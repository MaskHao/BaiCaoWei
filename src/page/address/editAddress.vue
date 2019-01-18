<template>
  <div class="editAddr">
    <div class="header">
        <div class="left-box" @click="back()"><img  src="../../assets/images/ic_left.png"> </div>
      编辑收货地址
    </div>
    <div class="paddingTop">
      <form id="J_address_form">
        <div class="add">
          <div class="info">
            <p>收货人</p>
            <input class="uname" name="consignee" :value="data.receiver_username" type="text" placeholder="请输入2-15个字">
            <input type="hidden" name="address_id" value="77409">
          </div>
          <div class="info">
            <p>联系电话</p>
            <input name="mobile" :value="data.telnumber" type="telephone" id="J_phone">
          </div>
          <div class="info">
            <p>省份</p>
            <select name="province" id="province" v-model="proSelected">
              <option v-if="province.length == 0" :value="data.province_id" v-html="data.provincename"></option>
              <option v-else v-for="pro in province" :key="pro"  :value="pro.region_id" v-html="pro.region_name"></option>
            </select>
          </div>
          <div class="info">
            <p>市</p>
            <select name="city" id="city" v-model="citySelected">
              <option v-if="city.length == 0" :value="data.city_id" v-html="data.cityname"></option>
              <option v-else v-for="c in city" :key="c" :value="c.region_id" v-html="c.region_name"></option>
            </select>
          </div>
          <div class="info">
            <p>区域</p>
            <select name="district" id="district" v-model="areaSelected">
              <option v-if="area.length == 0" :value="data.country_id" v-html="data.countryname"></option>
              <option v-else v-for="a in area" :key="a" :value="a.region_id" v-html="a.region_name"></option>
            </select>
          </div>
          <div class="txt">
            <textarea id="detailArea" name="address" placeholder="请填写详细地址" v-html="data.detailInfo"></textarea>
          </div>
          <div>
          </div>
        </div>
      </form>
      <!--保存收获地址固定-->
      <div @click="saveEdit()" class="save" id="J_address_edit" style="position: relative;margin:45px auto 0;bottom:0;left:auto;">保存</div>
    </div>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import Valert from '../../components/alertDialog'
  import {addressDetail,addressRegion,regionDetail,editAddress} from '../../service/getData'
  export default{
    data(){
      return {
        addrId:0,
        data:{},
        proSelected:0,
        parentId:1,
        province:[],
        citySelected:0,
        city:[],
        areaSelected:0,
        area:[],
        flag:1
      }
    },
    components:{
      Valert,
    },
    created(){
//      this.addrId=window.location.href.match(/address_id=(\d+)/)[1];
      this.addrId=this.$route.query.address_id;
      this.getAddrDtl(this.addrId);
      this.proRegion(this.parentId);
    },
    mounted(){},
    updated(){},
    methods:{
      back(){
        this.$router.go(-1);
      },
      getAddrDtl(addrId){
        addressDetail(addrId).then(res => {
          if(res.data.result_code == 0){
            this.data=res.data.result_data;
            this.proSelected=res.data.result_data.province_id;
            this.citySelected=res.data.result_data.city_id;
            this.areaSelected=res.data.result_data.country_id;
            //this.cityRegion(this.proSelected);
            //this.areaRegion(this.citySelected);
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      proRegion(id){
        addressRegion(id).then(res => {
          if(res.data.result_code == 0){
            this.province=res.data.result_data.list;
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      cityRegion(id){
        addressRegion(id).then(res => {
          if(res.data.result_code == 0){
            var _change = 0;
            var _city = res.data.result_data.list;
            for(var i=0 ; i<_city.length ; i++){
              if(this.citySelected == _city[i].region_id){
                _change = 1;
              }
            }
            this.city=res.data.result_data.list;
            if(_change == 0){
              this.citySelected = 0;
              this.areaSelected = 0;
            }
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      areaRegion(id){
        addressRegion(id).then(res => {
          if(res.data.result_code == 0){
            var _change = 0;
            this.area=res.data.result_data.list;
            for(var i=0 ; i<this.area.length ; i++){
              if(this.areaSelected == this.area[i].region_id){
                _change = 1;
              }
            }
            if(_change == 0){
              this.areaSelected = 0;
            }
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      saveEdit(){
        let _userName=document.getElementsByClassName('uname')[0].value;
        let _mobile=document.getElementById('J_phone').value;
        let reg=new RegExp(/^1[3|4|5|7|8][0-9]{9}$/g);
        let detailInfo=document.getElementById('detailArea').value;
        if(_userName.length <2){
          this.$refs.alertTip.alert('收货人姓名至少两个字');
        }else if(_userName.length>16){
          this.$refs.alertTip.alert('收货人姓名超过十五个字啦');
        }else if( !_mobile.match(reg)){
          this.$refs.alertTip.alert('请输入正确的手机号');
        }else if(!this.proSelected || !this.citySelected || !this.areaSelected){
          this.$refs.alertTip.alert('请选择完整的收货地址');
        }else if(detailInfo.replace(/(^\s+)|(\s+$)/g,'') == ''){
          this.$refs.alertTip.alert('请填写详细地址');
        }else{
          editAddress(detailInfo,this.addrId,this.proSelected,this.citySelected,this.areaSelected,_userName,_mobile).then( res => {
            if(res.data.result_code == 0){
              this.$router.go(-1);
            }else{
              this.$refs.alertTip.alert(res.data.result_info);
            }
          })
        }
      }
    },
    watch:{
      proSelected(){
        this.cityRegion(this.proSelected);
      },
      citySelected(){
        this.areaRegion(this.citySelected);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header{border-bottom:1px solid #ccc;width:100%;height:50px;background-color:#fff;position: fixed;top:0;left:0;text-align:center;font-size:1.4rem;line-height:50px;z-index:99;color:rgba(60,67,71,1);}
  .header .left-box{position:absolute;left:0;top:0;display:inline-block;padding-left:2%;text-align:left;}
  .header .left-box img{width:40%;}
  /*添加收获地址*/
  .add {margin-top: 3%;background-color: #fff;padding: 0 2%;}
  .add .info {padding: 10px 0;border-bottom: 1px solid #efefef;line-height: 30px;}
  .add .info input,.add .info select{width:75%;height: 30px;}
  .add .info .area {padding-left: 10%;margin-top: 2%;}
  .add .info p {display: inline-block;width: 20%;}
  .add textarea {color: #333;width: 100%; padding: 10px 0;}
  .add .info{padding:3% 0;border-bottom: 1px solid #efefef;}
  .add .info .area{padding-left:10%; margin-top:2%;}
  .add .txt{position:relative;}
  .add .txt textarea{color:#333;width: 100%;margin-top:3%;padding-right:6%;}
  .add .txt span{display:inline-block; width:28px;height:28px;background:url('http://img2.vipbcw.com/wap/icX.png') no-repeat center;background-size:70%;position:absolute;right:0%;top:30%;}
  /*收货人姓名长度*/
  .unameVali span {padding: 3% 4%;background-color: #313131;border-radius: 10px;color: #fff;position: absolute;top: 60%;left: 50%;transform: translate(-50%, 0%);-webkit-transform: translate(-50%, 0%);-moz-transform: translate(-50%, 0%);-o-transform: translate(-50%, 0%);display: none;}
  /*保存收获地址固定*/
  .save {width: 80%;height: 40px; position: fixed;bottom: 40px;left: 50%;margin-left: -40%;text-align: center;background: #ff4f39;border-radius: 20px;line-height: 40px;color: #fff;font-size: 1.4rem;}
</style>



// WEBPACK FOOTER //
// editAddress.vue?161adcc0