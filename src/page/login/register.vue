<template>
    <div>
        <div class="header-box clearfix">
            <div class="header-left" onclick="window.history.go(-1)"><img src="../../assets/images/ic_left.png"/></div>
            注册
            <div class="header-right"></div>
        </div>
        <div class="login-box">
            <div class="input-item">
                <img class="icon" src="../../assets/images/ic_iphone.png"/>
                <input type="text" placeholder="手机号" value="" v-model="userPhone"/>
            </div>
            <div class="input-item input-yzm">
                <img class="icon" src="../../assets/images/ic_yzm.png"/>
                <input type="text" placeholder="验证码" value="" v-model="userYzm"/>
                <p class="yzm-btn" @click="sendCode()">{{yzmText}}</p>
            </div>
            <div class="input-item">
                <img class="icon" src="../../assets/images/ic_locker.png"/>
                <input type="password" placeholder="8-16位密码" value="" v-model="userPwd"/>
            </div>
            <div class="input-btn" @click="registerFun()">注册</div>
        </div>
        <vAlert ref='alertDialog'></vAlert>
    </div>
</template>

<script>
    import vAlert from 'components/alertDialog'
    import {sendPhoneCode,register} from 'service/getData'

    export default {
        data () {
            return {
                userPhone: '',
                userPwd: '',
                userYzm: '',
                yzmText:'获取验证码',
                yzmState: 0
            }
        },
        components: {
            vAlert
        },
        methods:{
            sendCode(){
                var that = this;
                var phone = /^1[0-9]{10}$/;
                var _userPhone = that.trim(this.userPhone);
                if(phone.test(_userPhone)){
                    var time = 60;
                    if(that.yzmState == 0){
                        that.yzmState = 1;
                        sendPhoneCode(_userPhone,0).then(res => {
                            if(res.data.result_code != 0){
                                that.yzmState = 0;
                                that.$refs.alertDialog.alert(res.data.result_info);
                            }else{
                                var timer = setInterval(function(){
                                    if(time == 1){
                                        that.yzmState = 0;
                                        that.yzmText = '获取验证码';
                                        clearInterval(timer);
                                    }else{
                                        time--;
                                        that.yzmText = time +'s后重发';
                                    }
                                },1000)
                            }
                        });
                    }
                }else{
                    this.$refs.alertDialog.alert('手机号格式错误');
                }

            },
            registerFun(){
                var that = this;
                var phone = /^1[0-9]{10}$/;
                var _userPhone = this.trim(this.userPhone);
                var _userYzm = this.trim(this.userYzm);
                var _userPwd = this.userPwd;
                if(!phone.test(_userPhone)){
                    this.$refs.alertDialog.alert('手机号格式错误');
                    return false;
                }else if(_userYzm == ""){
                    this.$refs.alertDialog.alert('验证码不可以为空');
                    return false;
                }else if(_userPwd == ""){
                    this.$refs.alertDialog.alert('密码不可以为空');
                    return false;
                }else{
                    register(_userPhone , _userPwd,_userYzm).then(response => {
                        var res = response.data;
                        if(res.result_code == 0){
                            that.$router.push({ path: '/home/index'});
                        }else{
                            that.$refs.alertDialog.alert(res.result_info);
                        }
                    })
                }
            },
            trim(str){
                return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .header-box{height:45px;line-height: 45px;background: #fff;border-bottom:solid 1px #c8c8c8;text-align: center;color:#000;font-size: 1.4rem; }
    .header-box .header-left,.header-box .header-right{float:left;width:15%;text-align: center;height: 100%;}
    .header-box .header-left img,.header-box .header-right img{width:50%;}
    .header-box .header-right{float: right;}
    .login-box{padding-top:20px;text-align: center;}
    .input-item,.input-btn{width:85%;height:45px;background:#fff;padding:5px 0 5px 45px;margin:15px auto 0;border-radius: 23px;overflow:hidden;position: relative;}
    .input-item input{width:100%;height:35px;line-height: 35px;}
    .input-item .icon{position: absolute;width:29px;height:29px;top:8px;left:8px;}
    .input-btn{padding:0;background:#ff4f39;color:#fff;text-align: center;line-height: 45px;margin-top:25px;font-size: 1.4rem;}
    .link-find{display:inline-block; padding:15px;}
    .input-yzm input{width:65%;}
    .input-yzm .yzm-btn{width:35%;height:100%;line-height: 35px; display: inline-block;color:#ff4f39;float: right;border-left:solid 1px #eee;}
</style>



// WEBPACK FOOTER //
// register.vue?5adf92c4