<template>
  <div>
    <div class="homeIcon" v-if="isShow">
      <a href="http://www.vipbcw.com/app_download.html?_f=mo_bottom"><img src="//u.bcwcdn.com/activity_img/2017/img_0417/icon.png" alt=""></a>
      <div class="homeIconClose" @click="closeIcon()"></div>
    </div>
  </div>

</template>

<script>
import {setSessionStore, delSessionStore} from 'assets/js/mUtils'
export default {
  data () {
    return {
      isShow: 1
    }
  },
  created () {

  },
  methods: {
    closeIcon () {
      this.isShow = 0
      setSessionStore('homeIcon', '0')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .homeIcon{position:fixed;bottom:12%;right:0;z-index:10000;display:inline;width:20%;height:11%;text-align:right;}
  .homeIcon .homeIconClose{position:absolute;bottom:-7%;left:-5%;z-index:10001;display:inline-block;width:30%;height:30%;}
</style>

// WEBPACK FOOTER //
// homeIcon.vue?51d44960
