<template>
  <div class="addrIndex">
    <div class="header">
      <div @click="back()">
        <div class="left-box"><img  src="../../assets/images/ic_left.png"> </div>
      </div>
      我的收货地址
    </div>
    <div class="paddingTop" style="padding-bottom:70px;">
      <!--地址为空时的状态-->
      <div v-if="data.length == 0 || addrList.length == 0" class="empty">
        <div style="width:30%;margin:0 auto;"><img src="../../assets/images/ic_no_address.png" alt=""></div>
        <div class="details">
          <p>没有收货地址</p>
          <span>在不添加，快递小哥找不到我了~</span>
        </div>
      </div>
      <!--我的收货地址-->
      <ul v-else>
        <!-- 默认地址加类名active -->
        <li @click="goBack(addrL)" v-for="(addrL,key) in addrList"   :key="key" :class="{ active : addrL.address_id == defaultCoupId  }" class="myAddr" :data-id="addrL.address_id">
          <p class="personal"><span class="fl" v-html="addrL.consignee"></span><span class="fr" v-html="addrL.mobile"></span></p>
          <div class="addr" v-html="addrL.province_name + addrL.city_name + addrL.area_name + addrL.address"></div>
          <div class="set">
            <span>
                <b @click="stop(addrL.address_id,$event)" class="iconfont icon-iceditdress"></b>编辑
            </span>
            <div @click="delAddr(addrL.address_id,key,$event)" class="del J_delAddress"><span><b class="iconfont icon-icontrash"></b> 删除</span></div>
            <p class="default" @click="setDefaultAddr(addrL.address_id,$event)"><label><span></span>设为默认</label></p>
          </div>
        </li>

      </ul>
      <!--添加收货地址固定-->
      <div class="add1">
        <router-link :to="{path : '/addAddress' }">
          <i class="iconfont icon-icon"></i> 添加新地址
        </router-link>
      </div>
    </div>
    <ConfirmDial ref="dial"></ConfirmDial>
    <Valert ref="alertTip"></Valert>
  </div>
</template>

<script>
  import {getSessionStore,setSessionStore,delSessionStore} from '../../assets/js/mUtils'
  import {addressList,delAddress,setDefaultAddress} from '../../service/getData'
  import ConfirmDial from '../../components/confirmDialog'
  import Valert from '../../components/alertDialog'

  export default {
    data(){
      return {
        href:[],
        data:[],
        addrList:[],
        page:1,
        defaultCoupId:0,
        default_addr:{},
        select_addr:''
      }
    },
    components:{
      ConfirmDial,
      Valert
    },
    created(){
//      this.href = window.location.href.match(/cart_ids=(\d+,\d+)/);
      this.select_addr = eval ( '(' + getSessionStore('default_addr') + ')' ) ? eval ( '(' + getSessionStore('default_addr') + ')' ).address_id : '';
      this.href=this.$route.query.cart_ids;
      this.getAddrList(this.page);
    },
    mounted(){},
    updated(){},
    methods:{
      back(){
        this.$router.go(-1);
      },
      getAddrList(page){
        addressList(page).then( res=>{
          if(res.data.result_code == 0){
            this.data=res.data.result_data;
            if(res.data.result_data.length != 0){
              this.addrList = res.data.result_data.list;
              for(let i in this.addrList){
                if(this.addrList[i].default == 1){
                  this.defaultCoupId = this.addrList[i].address_id;
                }
              }
            }
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      delAddr(addrId,index,e){
        e.stopPropagation();
        this.$refs.dial.confirm({
          text:"确认删除吗？",
          cancelButtonText:'取消',
          confirmButtonText:'删除'
        }).then( () => {
          this.$refs.dial.show = false;
          delAddress(addrId).then(res => {
            if(res.data.result_code == 0){
              this.addrList.splice(index,1);
              if(this.select_addr == addrId){
                delSessionStore('default_addr');
              }
            }else{
              this.$refs.alertTip.alert(res.data.result_info);
            }
          })
        }).catch(()=>{})
      },
      setDefaultAddr(addrId,e){
        e.stopPropagation();
        setDefaultAddress(addrId).then(res => {
          if(res.data.result_code == 0){
            this.defaultCoupId = res.data.result_data.address_id;
          }else{
            this.$refs.alertTip.alert(res.data.result_info);
          }
        })
      },
      goBack(addrL){
        this.default_addr = {'consignee':addrL.consignee,'mobile':addrL.mobile,'address':addrL.province_name+addrL.city_name+addrL.area_name+addrL.address,'address_id':addrL.address_id}
        setSessionStore('default_addr',this.default_addr)
        if(this.href != undefined){
          this.$router.go(-1);
        }
      },
      stop(addrId,e){
        e.stopPropagation();
        this.$router.push('/editAddress?address_id='+addrId);
      }
    },
    watch:{}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .icon-icontrash{display:inline-block;width:18px;height:18px;background:url(../../assets/images/icon_del.png) no-repeat center;background-size:80%;vertical-align: top;}
  .icon-iceditdress{margin-right:3px;display:inline-block;width:18px;height:18px;background:url(../../assets/images/ic_edit@2x.png) no-repeat center;background-size:80%;vertical-align: top;}
  .header{border-bottom:1px solid #ccc;width:100%;height:50px;background-color:#fff;position: fixed;top:0;left:0;text-align:center;font-size:1.4rem;line-height:50px;z-index:99;color:rgba(60,67,71,1);}
  .header .left-box{position:absolute;left:0;top:0;display:inline-block;padding-left:2%;text-align:left;}
  .header .left-box img{width:40%;}
  /*地址为空时的状态*/
  .empty {position: fixed;left: 0%;top: 0;width: 100%;height: 100%;background-color: #fff; background-attachment: fixed; padding-top: 25%;text-align: center;}
  .empty .details p {font-size: 1.4rem; margin-top: 6%;}
  .empty .details span {display: block;margin-top: 2%;color: #9EA1A3;}
  .empty.on{display: block;}

  /*添加收获地址固定*/
  .add1 {width: 60%;height: 40px;position: fixed; bottom: 15px;left: 50%;margin-left: -30%;text-align: center;background: #ff4f39;border-radius: 20px;line-height: 40px;}
  .add1 a{display: block;color: #fff;font-size: 1.4rem;}
  .add1 a i{font-size: 1.4rem;}
  .myAddr {margin-top: 2%;background-color: #fff;padding: 2% 3%;border-left: 2px solid transparent;}
  .myAddr.active {border-left: 2px solid #ff4f39;}
  .myAddr .personal {overflow: hidden;}
  .myAddr .addr { margin-top: 2%;padding:0;}
  .myAddr .set {border-top: 1px solid #efefef;padding-top: 2%;margin-top: 2%;}
  .myAddr .set span img {width: 4%;}
  .myAddr .set .del {display: inline-block;margin-left: 10px;}
  .myAddr .set .iconfont {font-size: 1.3rem;}
  .myAddr .set p {display: inline-block;float: right;}
  .myAddr .set p span {display: inline-block; width: 20px;height: 20px; background: url('http://img2.vipbcw.com/wap/check_n.png') no-repeat;vertical-align: middle;background-size: 100% 100%;border-radius: 50%;margin-right: 5px;}
  .myAddr.active .set p span {background-image: url('http://img2.vipbcw.com/wap/check_r.png');}

  .add-addr-body{background-color:#f5f5f5;}
</style>



// WEBPACK FOOTER //
// address.vue?8488a53e