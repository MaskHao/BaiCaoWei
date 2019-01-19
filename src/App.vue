<template>
	<div>111111
		<transition name="router-fade" mode="out-in">
			<keep-alive>
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
    	</transition>
    	<transition name="router-fade" mode="out-in">
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</transition>
    </div>
</template>

<script>
  	export default {
			components:{},
			methods: {
				getData() {
					console.log(1111)
				}
			},
			created () {
				this.getData()
			}
  	}

</script>

<style lang="scss">
  	/* @import './style/common'; */
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
</style>
