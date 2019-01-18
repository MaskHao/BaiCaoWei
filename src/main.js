// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router/router'

// import VueLazyload
import VueLazyload from 'vue-lazyload'


// use options
Vue.use(VueLazyload, {
    fade: true,//fade: 全部图片使用淡入特效,true: 所有的图片都会使用淡入特效,false (默认): 不使用淡入特效
    nohori: true,//nohori：从水平方向禁用lazyload, true：所有图像都不会检测到水平方向, false （默认）：检测水平方向
    speed: 120,//speed: 速度检测的临界值,0 (默认): 只要图片在屏幕里出现了，那么图片就开始懒加载,(推荐 20): 只有当屏幕滚动速度小于speed且图片在屏幕中出现了才开始懒加载
  // error: 'dist/error.png',
  //  loading: 'assets/images/trans.png',
    attempt: 3
})

Vue.config.productionTip = false
new Vue({
  router
}).$mount('#app')



// WEBPACK FOOTER //
// ./src/main.js