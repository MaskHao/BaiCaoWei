<template>
  <div>
    <homeData ref='tabList'></homeData>
    <!--<homeIcon v-if="homeIcon != 0"></homeIcon>-->
    <footer-box></footer-box>
  </div>
</template>

<script>
  import footerBox from 'components/footerBox'
  import homeData from 'components/home'
  import homeIcon from 'components/homeIcon'
  import {getConfig} from 'service/getData'
  import {wxShare,addWxScript,getSessionStore} from 'assets/js/mUtils'

  export default {
    data () {
      return {
        homeIcon:1
      }
    },
    components: {
      footerBox,//相当于：footerBox : footerBox..... 如果想改变组件的名字，改动前者 eg: footer : footerBox
      homeData,
      homeIcon
    },
    created () {
      this.homeIcon = getSessionStore('homeIcon');
    },
    updated () {
    },
    mounted () {
      this.$refs.tabList.getTabLists();
    },
    methods: {
      getWechatConfig(){
        var _url = window.location.href;
        var respont = getConfig(_url).then(response => {
          return response.data;
        })
        return respont;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>