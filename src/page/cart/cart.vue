<template>
  <div>
    <VCartList ref='cartList'></VCartList>
    <footer-box></footer-box>
  </div>
</template>

<script>
  import footerBox from 'components/footerBox'
  import VCartList from 'components/cart'

  export default {
    data () {
      return {
      }
    },
    components: {
      VCartList,
      footerBox,
    },
    created () {

    },
    updated () {

    },
    mounted () {
      this.$refs.cartList.getCartList();
    },
    methods : {
    },
    watch:{

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 </style>



// WEBPACK FOOTER //
// cart.vue?35eba470